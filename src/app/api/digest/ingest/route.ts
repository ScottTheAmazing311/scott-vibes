import { createHash, timingSafeEqual } from "node:crypto";
import { json } from "@/lib/digest/http";
import { processIngest } from "@/lib/digest/ingest";
import { digestStore } from "@/lib/digest/store";

/** Grok Bot pushes one daily edition here. Write-only: this secret can't read anything back.
 *  Needs DIGEST_INGEST_SECRET and SANITY_API_WRITE_TOKEN (server-side env). */

export const dynamic = "force-dynamic";

const MAX_BODY = 128 * 1024;
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const MAX_FAILED_AUTH = 20;

// Per serverless instance, so this slows a guesser rather than setting a hard global limit.
const hits = new Map<string, { resetAt: number; total: number; failed: number }>();

function counter(ip: string, now: number) {
  if (hits.size > 5000) hits.clear();
  let entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    entry = { resetAt: now + WINDOW_MS, total: 0, failed: 0 };
    hits.set(ip, entry);
  }
  return entry;
}

const digest = (text: string) => createHash("sha256").update(text).digest();

async function readBounded(request: Request) {
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > MAX_BODY) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new Uint8Array(Buffer.concat(chunks));
}

export async function POST(request: Request) {
  const now = Date.now();
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const count = counter(ip, now);
  const retryAfter = { "Retry-After": String(Math.max(1, Math.ceil((count.resetAt - now) / 1000))) };
  if (++count.total > MAX_REQUESTS || count.failed >= MAX_FAILED_AUTH) return json({ error: "rate_limited" }, 429, retryAfter);

  const secret = process.env.DIGEST_INGEST_SECRET;
  if (!secret || secret.length < 32) return json({ error: "not_configured" }, 503);

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !timingSafeEqual(digest(token), digest(secret))) {
    count.failed++;
    return json({ error: "unauthorized" }, 401, { "WWW-Authenticate": "Bearer" });
  }

  const encoding = request.headers.get("content-encoding");
  const type = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (type !== "application/json" || (encoding && encoding !== "identity")) return json({ error: "unsupported_media_type" }, 415);
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY) return json({ error: "payload_too_large" }, 413);

  const raw = await readBounded(request);
  if (!raw) return json({ error: "payload_too_large" }, 413);

  const store = digestStore();
  if (!store) return json({ error: "not_configured" }, 503);

  const result = await processIngest(store, raw, request.headers.get("idempotency-key"), now);
  return json(result.body, result.status, result.retryAfter ? { "Retry-After": String(result.retryAfter) } : {});
}
