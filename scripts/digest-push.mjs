// Pushes one digest edition to the ingest route, for seeding and checks.
// usage: DIGEST_INGEST_URL=... DIGEST_INGEST_TOKEN=... node scripts/digest-push.mjs <edition.json>
import { readFileSync } from "node:fs";

const { DIGEST_INGEST_URL: url, DIGEST_INGEST_TOKEN: token } = process.env;
if (!url || !token || !process.argv[2]) {
  console.error("Needs DIGEST_INGEST_URL, DIGEST_INGEST_TOKEN and an edition file.");
  process.exit(2);
}
const res = await fetch(url, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: readFileSync(process.argv[2], "utf8"),
});
console.log(res.status, await res.json().catch(() => ({})));
process.exit(res.ok ? 0 : 1);
