import assert from "node:assert/strict";
import { test } from "node:test";
import { processIngest, RevisionConflict, type Commit, type DigestStore, type Snapshot } from "../src/lib/digest/ingest";
import { canonicalJson, checkEdition, denverDate, isPublicHttpsUrl, sha256, CATEGORIES, type Edition } from "../src/lib/digest/validate";

// Synthetic data only: this repo is public, so real digest text never goes in it.
const NOW = Date.parse("2026-11-08T20:00:00Z");

function edition(day = "2026-11-08", overrides: Partial<Edition> = {}): Edition {
  return {
    schema_version: "1.0",
    edition_id: day,
    updated_at: `${day}T12:00:00-07:00`,
    timezone: "America/Denver",
    title: "Test Digest",
    categories: [...CATEGORIES],
    items: [
      { id: "one", category: "Pixel Dev", title: "T", source_date: "2026-11-01", label: "L", summary: "S", why_useful: "W", caveat: "C", sources: [{ title: "Src", url: "https://example.com/a" }] },
    ],
    coverage_note: "Synthetic",
    ...overrides,
  };
}

function memoryStore() {
  const editions = new Map<string, { updated_at: string; content_hash: string; payload: string }>();
  const receipts = new Map<string, Commit["receipt"]>();
  let rev = 0;
  let failNext = false;
  const store: DigestStore = {
    async snapshot(receiptId): Promise<Snapshot> {
      const at = String(rev);
      await new Promise((resolve) => setTimeout(resolve, 1));
      const receipt = receipts.get(receiptId);
      return {
        rev: at,
        editions: [...editions].map(([edition_id, e]) => ({ edition_id, updated_at: e.updated_at, content_hash: e.content_hash })),
        receipt: receipt ? { hash: receipt.hash, response: receipt.response } : null,
        expiredReceipts: [],
      };
    },
    async commit(at, commit) {
      if (failNext) {
        failNext = false;
        throw new Error("store down");
      }
      if (at !== String(rev)) throw new RevisionConflict();
      rev++;
      if (commit.edition) {
        const { summary, payload } = commit.edition;
        editions.set(summary.edition_id, { updated_at: summary.updated_at, content_hash: summary.content_hash, payload });
      }
      receipts.set(commit.receipt.id, commit.receipt);
      commit.deleteEditions.forEach((id) => editions.delete(id));
    },
    async latest() {
      const id = [...editions.keys()].sort().pop();
      return id ? (JSON.parse(editions.get(id)!.payload) as Edition) : null;
    },
    async history() {
      return [...editions.keys()].sort().reverse().map((id) => JSON.parse(editions.get(id)!.payload) as Edition);
    },
  };
  return { store, editions, failOnce: () => (failNext = true) };
}

const send = (store: DigestStore, body: unknown, key: string | null = "k1") => processIngest(store, new TextEncoder().encode(JSON.stringify(body)), key, NOW);

test("a valid edition is created and readable", async () => {
  const { store } = memoryStore();
  const res = await send(store, edition());
  assert.equal(res.status, 201);
  assert.equal(res.body.status, "created");
  assert.equal(res.body.content_hash, sha256(canonicalJson(edition())));
  assert.equal((await store.latest())?.edition_id, "2026-11-08");
});

test("same key and body replays the receipt; same key with a new body conflicts", async () => {
  const { store } = memoryStore();
  await send(store, edition());
  const replay = await send(store, edition());
  assert.equal(replay.status, 200);
  assert.equal(replay.body.status, "created");
  const other = await send(store, edition("2026-11-08", { title: "Different" }));
  assert.equal(other.status, 409);
  assert.equal(other.body.error, "idempotency_conflict");
});

test("key order doesn't change the hash", () => {
  assert.equal(canonicalJson({ b: 1, a: [{ d: "x", c: "y" }] }), canonicalJson({ a: [{ c: "y", d: "x" }], b: 1 }));
});

test("later updates replace, older ones are stale, equal times must match", async () => {
  const { store } = memoryStore();
  await send(store, edition(), "a");
  const stale = await send(store, edition("2026-11-08", { updated_at: "2026-11-08T11:00:00-07:00", title: "Old" }), "b");
  assert.equal(stale.body.error, "stale_edition");
  const clash = await send(store, edition("2026-11-08", { title: "Clash" }), "c");
  assert.equal(clash.body.error, "edition_conflict");
  const same = await send(store, edition(), "d");
  assert.equal(same.status, 200);
  assert.equal(same.body.status, "unchanged");
  const later = await send(store, edition("2026-11-08", { updated_at: "2026-11-08T12:30:00-07:00", title: "New" }), "e");
  assert.equal(later.body.status, "updated");
  assert.equal((await store.latest())?.title, "New");
});

test("latest is the greatest edition, not the last to arrive", async () => {
  const { store } = memoryStore();
  await send(store, edition("2026-11-08"), "a");
  await send(store, edition("2026-11-05"), "b");
  assert.equal((await store.latest())?.edition_id, "2026-11-08");
});

test("keeps seven editions and refuses anything older than the window", async () => {
  const { store, editions } = memoryStore();
  for (let day = 1; day <= 8; day++) await send(store, edition(`2026-11-0${day}`), `day${day}`);
  assert.equal(editions.size, 7);
  assert.ok(!editions.has("2026-11-01"));
  const old = await send(store, edition("2026-11-01"), "again");
  assert.equal(old.body.error, "outside_retention_window");
  assert.equal(editions.size, 7);
});

test("invalid editions are refused and nothing changes", async () => {
  const { store, editions } = memoryStore();
  await send(store, edition(), "good");
  const before = JSON.stringify([...editions]);
  const item = edition().items[0];
  const cases: [unknown, string][] = [
    [{ ...edition(), extra: true }, "schema_violation"],
    [edition("2026-11-08", { items: [{ ...item, category: "Gossip" }] }), "schema_violation"],
    [edition("2026-11-08", { items: [{ ...item, sources: [{ title: "x", url: "javascript:alert(1)" }] }] }), "schema_violation"],
    [edition("2026-11-08", { items: [{ ...item, source_date: "2026-02-30" }] }), "schema_violation"],
    [edition("2026-11-08", { items: [item, item] }), "duplicate_item_id"],
    [edition("2026-11-08", { updated_at: "2026-11-09T01:00:00Z", edition_id: "2026-11-09" }), "edition_date_mismatch"],
    [edition("2026-11-09"), "future_update"],
    [edition("2026-11-08", { updated_at: "2026-11-08T13:30:00-07:00" }), "future_update"],
    [edition("2026-11-08", { items: [{ ...item, sources: [{ title: "x", url: "https://localhost/a" }] }] }), "disallowed_source_url"],
    [edition("2026-11-08", { items: [{ ...item, sources: [{ title: "x", url: "https://192.168.1.4/a" }] }] }), "disallowed_source_url"],
    [edition("2026-11-08", { items: [{ ...item, sources: [{ title: "x", url: "https://me:pw@example.com/a" }] }] }), "disallowed_source_url"],
  ];
  for (const [body, error] of cases) {
    const res = await send(store, body, `bad-${error}-${Math.random()}`);
    assert.equal(res.status, 422, error);
    assert.equal(res.body.error, error);
  }
  assert.equal(JSON.stringify([...editions]), before);
  assert.equal((await processIngest(store, new TextEncoder().encode("{nope"), "x", NOW)).body.error, "malformed_json");
  assert.equal((await send(store, edition(), null)).body.error, "invalid_idempotency_key");
});

test("a failed write keeps the last good edition", async () => {
  const { store, failOnce } = memoryStore();
  await send(store, edition("2026-11-07"), "a");
  failOnce();
  const res = await send(store, edition("2026-11-08"), "b");
  assert.equal(res.status, 503);
  assert.equal((await store.latest())?.edition_id, "2026-11-07");
  const retry = await send(store, edition("2026-11-08"), "b");
  assert.equal(retry.status, 201);
});

test("concurrent pushes all land without losing a write", async () => {
  const { store, editions } = memoryStore();
  const results = await Promise.all([1, 2, 3, 4].map((day) => send(store, edition(`2026-11-0${day}`), `c${day}`)));
  assert.deepEqual(results.map((r) => r.status), [201, 201, 201, 201]);
  assert.equal(editions.size, 4);
});

test("Denver dates follow daylight saving", () => {
  assert.equal(denverDate(Date.parse("2026-07-01T05:59:00Z")), "2026-06-30"); // MDT, UTC-6
  assert.equal(denverDate(Date.parse("2026-12-01T06:59:00Z")), "2026-11-30"); // MST, UTC-7
});

test("source links must be public HTTPS hosts", () => {
  assert.ok(isPublicHttpsUrl("https://www.seahawks.com/game"));
  for (const url of ["http://example.com", "https://localhost", "https://10.0.0.1", "https://[::1]/", "https://intranet/x", "https://a.local/x", "ftp://example.com"]) {
    assert.equal(isPublicHttpsUrl(url), false, url);
  }
});

test("checkEdition accepts the synthetic edition", () => {
  assert.equal(checkEdition(edition(), NOW).ok, true);
});
