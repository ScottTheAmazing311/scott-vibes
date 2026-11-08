// End-to-end checks for /feed and /api/digest against a production build and the real Sanity project.
// Run `npm run build` first. Uses a throwaway document prefix and synthetic data, deletes both afterward,
// and generates its own one-time ingest secret. Reads .env.local but never prints a value.
import { spawn } from "node:child_process";
import { createCipheriv, hkdfSync, randomBytes } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@sanity/client";

const PORT = process.env.E2E_PORT ?? "3142";
const BASE = `http://localhost:${PORT}`;
const OWNER = "owner@e2e.invalid";
const PREFIX = "digeste2e";
const SECRET = randomBytes(32).toString("base64url");
const MARK = "E2EMARKER";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8").split("\n").filter((l) => /^[A-Z_]+=/.test(l)).map((l) => {
    const i = l.indexOf("=");
    return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, "")];
  }),
);

const key = Buffer.from(hkdfSync("sha256", env.HEADWAY_SECRET, "", "scottvibes-digest-session-v1", 32));
function seal(text, k = key) {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", k, iv);
  const body = Buffer.concat([c.update(text, "utf8"), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), body]).toString("base64url");
}
const session = (email, exp = Date.now() + 3600_000) => `dg_session=${seal(JSON.stringify({ email, exp }))}`;
const ownerCookie = session(OWNER);
const wrongCookie = session("someone@e2e.invalid");

let passed = 0;
const failures = [];
function check(name, ok, info = "") {
  if (ok) passed++;
  else failures.push(`${name} ${info}`);
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${ok ? "" : ` ${info}`}`);
}

const CATS = ["Pixel Dev", "AI cutting edge", "DGX Spark", "Design and Aesthetic", "Sports Roundup", "Notable trending things"];
function denver(ms) {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: "America/Denver", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(ms);
  const g = (t) => p.find((x) => x.type === t).value;
  return `${g("year")}-${g("month")}-${g("day")}`;
}
const dayAgo = (n) => denver(Date.now() - n * 86_400_000);
const edition = (day, over = {}) => ({
  schema_version: "1.0",
  edition_id: day,
  updated_at: `${day}T00:30:00-07:00`,
  timezone: "America/Denver",
  title: `${MARK} digest`,
  categories: CATS,
  items: [
    { id: "a", category: "Pixel Dev", title: `${MARK} pixel <script>window.__xss=1</script>`, source_date: day, label: "Test", summary: "Sum", why_useful: "Why", caveat: "Cav", sources: [{ title: "Src", url: "https://example.com/a" }] },
    { id: "b", category: "Sports Roundup", title: `${MARK} sports`, source_date: day, label: "Test", summary: "Sum", why_useful: "Why", caveat: "Cav", sources: [{ title: "Src", url: "https://example.com/b" }] },
  ],
  coverage_note: "Synthetic test data",
  ...over,
});

let n = 0;
const push = (body, { token = SECRET, idem = `key-${++n}`, type = "application/json", cookie } = {}) =>
  fetch(`${BASE}/api/digest/ingest`, {
    method: "POST",
    headers: { "Content-Type": type, ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(idem ? { "Idempotency-Key": idem } : {}), ...(cookie ? { Cookie: cookie } : {}) },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
const get = (path, cookie, headers = {}) => fetch(BASE + path, { headers: { ...(cookie ? { Cookie: cookie } : {}), ...headers }, redirect: "manual" });
const latestId = async () => (await (await get("/api/digest/latest", ownerCookie)).json()).edition_id;

const admin = createClient({ projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production", apiVersion: "2024-01-01", token: env.SANITY_API_WRITE_TOKEN, useCdn: false, perspective: "raw" });
async function cleanup() {
  const ids = await admin.fetch(`*[_id in path($a) || _id in path($b) || _id == $c]._id`, { a: `${PREFIX}.edition.*`, b: `${PREFIX}.receipt.*`, c: `${PREFIX}.head` });
  if (ids.length) {
    const tx = admin.transaction();
    ids.forEach((id) => tx.delete(id));
    await tx.commit({ visibility: "sync" });
  }
  return ids.length;
}

await cleanup();
const server = spawn("npx", ["next", "start", "-p", PORT], {
  stdio: "ignore",
  detached: true,
  env: { ...process.env, DIGEST_INGEST_SECRET: SECRET, DIGEST_OWNER_EMAIL: OWNER, DIGEST_STORE_PREFIX: PREFIX },
});
const stop = () => {
  try {
    process.kill(-server.pid);
  } catch {}
};

try {
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(BASE);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  // Empty state
  check("empty: latest is 404 for owner", (await get("/api/digest/latest", ownerCookie)).status === 404);
  check("empty: page says no editions", (await (await get("/feed", ownerCookie)).text()).includes("No editions have arrived yet"));

  // Writer auth
  const today = dayAgo(1);
  check("no bearer refused", (await push(edition(today), { token: null })).status === 401);
  check("wrong bearer refused", (await push(edition(today), { token: "x".repeat(40) })).status === 401);
  check("owner session can't ingest", (await push(edition(today), { token: null, cookie: ownerCookie })).status === 401);
  check("wrong media type refused", (await push(edition(today), { type: "text/plain" })).status === 415);
  check("oversized body refused", (await push("x".repeat(130 * 1024))).status === 413);
  check("missing idempotency key refused", (await push(edition(today), { idem: null })).status === 400);
  check("malformed JSON refused", (await push("{nope")).status === 400);
  check("unknown field refused", (await push({ ...edition(today), extra: 1 })).status === 422);
  check("nothing stored after refusals", (await get("/api/digest/latest", ownerCookie)).status === 404);

  // Writes, against real Sanity transactions
  const created = await push(edition(today), { idem: "first" });
  const receipt = await created.json();
  check("valid edition created (201)", created.status === 201 && receipt.status === "created" && /^[0-9a-f]{64}$/.test(receipt.content_hash), JSON.stringify(receipt));
  check("ingest response is no-store", created.headers.get("cache-control") === "private, no-store");
  const replay = await push(edition(today), { idem: "first" });
  check("replay returns the original receipt", replay.status === 200 && (await replay.json()).content_hash === receipt.content_hash);
  check("same key, new body conflicts", (await push(edition(today, { title: "Other" }), { idem: "first" })).status === 409);
  const staleBody = await (await push(edition(today, { updated_at: `${today}T00:10:00-07:00`, title: "Old" }))).json();
  check("older update is stale", staleBody.error === "stale_edition", JSON.stringify(staleBody));
  const newer = await push(edition(today, { updated_at: `${today}T00:40:00-07:00`, title: `${MARK} newer` }));
  check("later update replaces", newer.status === 200 && (await newer.json()).status === "updated");
  check("older edition doesn't become latest", (await push(edition(dayAgo(3)))).status === 201 && (await latestId()) === today);

  const parallel = await Promise.all([dayAgo(4), dayAgo(5), dayAgo(6), dayAgo(7)].map((d) => push(edition(d))));
  check("concurrent pushes all commit", parallel.every((r) => r.status === 201), parallel.map((r) => r.status).join());
  check("window fills to seven", (await push(edition(dayAgo(2)))).status === 201);
  const full = await (await get("/api/digest/history", ownerCookie)).json();
  const ids = full.editions.map((e) => e.edition_id);
  check("history is seven, newest first", ids.length === 7 && ids.join() === [...ids].sort().reverse().join() && ids[0] === today, ids.join());
  const outside = await (await push(edition(dayAgo(8)))).json();
  check("older than the window refused", outside.error === "outside_retention_window", JSON.stringify(outside));
  check("a new day prunes the oldest", (await push(edition(dayAgo(0)))).status === 201);
  const pruned = (await (await get("/api/digest/history", ownerCookie)).json()).editions.map((e) => e.edition_id);
  check("still seven, oldest gone", pruned.length === 7 && pruned[0] === dayAgo(0) && !pruned.includes(dayAgo(7)), pruned.join());

  // Readers
  for (const path of ["/api/digest/latest", "/api/digest/history"]) {
    check(`${path} logged out: 401`, (await get(path)).status === 401);
    check(`${path} wrong user: 403`, (await get(path, wrongCookie)).status === 403);
    check(`${path} forged cookie: 401`, (await get(path, `dg_session=${randomBytes(60).toString("base64url")}`)).status === 401);
    check(`${path} expired session: 401`, (await get(path, session(OWNER, Date.now() - 1000))).status === 401);
    check(`${path} ingest bearer can't read`, (await get(path, undefined, { Authorization: `Bearer ${SECRET}` })).status === 401);
    const ok = await get(path, ownerCookie);
    check(`${path} owner: 200 and no-store`, ok.status === 200 && ok.headers.get("cache-control") === "private, no-store", ok.headers.get("cache-control"));
  }
  const headwayKeyCookie = `dg_session=${seal(JSON.stringify({ email: OWNER, exp: Date.now() + 1e6 }), Buffer.from(env.HEADWAY_SECRET.padEnd(32).slice(0, 32)))}`;
  check("cookie sealed with another key refused", (await get("/api/digest/latest", headwayKeyCookie)).status === 401);

  // The page and its framework payloads
  for (const [name, cookie] of [["logged out", undefined], ["wrong user", wrongCookie]]) {
    for (const [kind, headers] of [["html", {}], ["rsc", { RSC: "1" }], ["prefetch", { RSC: "1", "Next-Router-Prefetch": "1" }]]) {
      const res = await get(`/feed?edition=${today}`, cookie, headers);
      const text = await res.text();
      check(`/feed ${name} ${kind}: no digest data`, !text.includes(MARK) && !text.includes("Synthetic test data"));
      check(`/feed ${name} ${kind}: not publicly cacheable`, /private/.test(res.headers.get("cache-control") ?? "") && /no-store/.test(res.headers.get("cache-control") ?? ""), res.headers.get("cache-control"));
    }
  }
  const pageRes = await get(`/feed?edition=${today}`, ownerCookie);
  const page = await pageRes.text();
  check("/feed owner sees the edition", page.includes(`${MARK} newer`));
  check("/feed owner response is private, no-store", /private/.test(pageRes.headers.get("cache-control")) && /no-store/.test(pageRes.headers.get("cache-control")), pageRes.headers.get("cache-control"));
  check("/feed escapes HTML in digest text", !page.includes("<script>window.__xss=1</script>") && page.includes("&lt;script&gt;"));
  const filtered = await (await get(`/feed?edition=${today}&category=${encodeURIComponent("Sports Roundup")}`, ownerCookie)).text();
  check("category filter narrows items", filtered.includes(`${MARK} sports`) && !filtered.includes(`${MARK} pixel &lt;`));
  const past = await (await get(`/feed?edition=${dayAgo(3)}`, ownerCookie)).text();
  check("past edition is labeled as past", past.includes("A past edition."));
  check("time shows a Denver zone", /Updated [\d:]+.(AM|PM) M[SD]T/.test(page.replace(/<!-- -->/g, "")));
  check("logout refuses a cross-site origin", (await fetch(`${BASE}/api/digest/auth/logout`, { method: "POST", headers: { Origin: "https://evil.example", Cookie: ownerCookie }, redirect: "manual" })).status === 403);
  const login = await get("/api/digest/auth/login");
  const target = new URL(login.headers.get("location") ?? BASE);
  check("login asks Google for identity only", target.hostname === "accounts.google.com" && target.searchParams.get("scope") === "openid email" && target.searchParams.get("code_challenge_method") === "S256");
  const badState = await get("/api/digest/auth/callback?code=x&state=y");
  check("callback without valid state gives no session", badState.status === 303 && !(badState.headers.get("set-cookie") ?? "").includes("dg_session="));

  // Public surfaces
  const anon = createClient({ projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production", apiVersion: "2024-01-01", useCdn: false, perspective: "raw" });
  const q = `*[_id in path($a) || _id == $h]{_id, title, payload}`;
  const params = { a: `${PREFIX}.edition.*`, h: `${PREFIX}.head` };
  const stored = await admin.fetch(q, params);
  check("documents exist with the token", stored.length >= 7, String(stored.length));
  check("Sanity API without a token sees nothing", (await anon.fetch(q, params)).length === 0);
  check("Sanity CDN without a token sees nothing", (await anon.withConfig({ useCdn: true }).fetch(q, params)).length === 0);
  check("marker search without a token finds nothing", (await anon.fetch(`*[payload match $m]._id`, { m: MARK })).length === 0);

  const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
  const bundle = walk(".next/static");
  check("client bundle has no digest code", !bundle.some((f) => /\.(js|css)$/.test(f) && /digest\.edition|digest\.schema|why_useful/.test(readFileSync(f, "utf8"))));

  // Public site unaffected
  for (const path of ["/", "/theology", "/kidzone", "/creative/apps", "/photography", "/headway"]) check(`${path} still public`, (await get(path)).status === 200);
  const home = await get("/");
  check("/ stays cacheable, not forced private", !/private/.test(home.headers.get("cache-control") ?? ""), home.headers.get("cache-control"));

  // Last: this trips the limiter for the rest of the window
  let limited = false;
  for (let i = 0; i < 30 && !limited; i++) limited = (await push(edition(today), { token: "y".repeat(40) })).status === 429;
  check("repeated bad bearers get 429", limited);
} finally {
  stop();
  const removed = await cleanup();
  console.log(`cleanup: removed ${removed} test documents`);
}

console.log(`\n${passed} passed, ${failures.length} failed`);
process.exit(failures.length ? 1 : 0);
