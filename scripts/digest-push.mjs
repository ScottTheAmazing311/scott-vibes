// Pushes one digest edition to the ingest route, for seeding and endpoint checks.
// usage: DIGEST_INGEST_URL=... DIGEST_INGEST_TOKEN=... node scripts/digest-push.mjs <edition.json>
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const { DIGEST_INGEST_URL: url, DIGEST_INGEST_TOKEN: token } = process.env;
if (!url || !token || !process.argv[2]) {
  console.error("Needs DIGEST_INGEST_URL, DIGEST_INGEST_TOKEN and an edition file.");
  process.exit(2);
}

const canonical = (v) =>
  Array.isArray(v)
    ? `[${v.map(canonical).join(",")}]`
    : v && typeof v === "object"
      ? `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(",")}}`
      : JSON.stringify(v);

const edition = JSON.parse(readFileSync(process.argv[2], "utf8"));
const hash = createHash("sha256").update(canonical(edition)).digest("hex");
const res = await fetch(url, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "Idempotency-Key": `${edition.edition_id}:${hash}` },
  body: JSON.stringify(edition),
});
const body = await res.json().catch(() => ({}));
console.log(res.status, body);
if (res.ok && body.content_hash !== hash) console.error(`Hash mismatch: sent ${hash}`);
process.exit(res.ok && body.content_hash === hash ? 0 : 1);
