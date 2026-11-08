import { canonicalJson, checkEdition, sha256, type Edition } from "./validate";

/** The ingest rules from the handoff's INTERFACE.md, independent of where editions are stored. */

export const RETAINED_EDITIONS = 7;
export const RECEIPT_DAYS = 90;
const COMMIT_ATTEMPTS = 6;

export interface Receipt {
  edition_id: string;
  schema_version: string;
  status: "created" | "updated" | "unchanged";
  content_hash: string;
}

export interface EditionSummary {
  edition_id: string;
  updated_at: string;
  content_hash: string;
}

export interface Snapshot {
  rev: string;
  editions: EditionSummary[];
  /** the stored receipt for this idempotency key, if any */
  receipt: { hash: string; response: Receipt } | null;
  expiredReceipts: string[];
}

export interface Commit {
  /** absent when the edition is unchanged and only the receipt is recorded */
  edition?: { summary: EditionSummary; payload: string };
  receipt: { id: string; key: string; hash: string; response: Receipt; expiresAt: string };
  deleteEditions: string[];
  deleteReceipts: string[];
}

export class RevisionConflict extends Error {}

export interface DigestStore {
  snapshot(receiptId: string, nowIso: string): Promise<Snapshot>;
  /** Applies everything atomically, only if the store is still at `rev`. Throws RevisionConflict otherwise. */
  commit(rev: string, commit: Commit): Promise<void>;
  latest(): Promise<Edition | null>;
  history(): Promise<Edition[]>;
}

export interface IngestResult {
  status: number;
  body: Record<string, unknown>;
  retryAfter?: number;
}

const fail = (status: number, error: string, detail?: string): IngestResult => ({ status, body: detail ? { error, detail } : { error } });

const IDEMPOTENCY_KEY = /^[\x21-\x7e]{1,128}$/;

type Decision = { replay: Receipt } | { fail: IngestResult } | { status: Receipt["status"]; write: boolean; deleteEditions: string[] };

function decide(edition: Edition, hash: string, snap: Snapshot): Decision {
  if (snap.receipt) {
    return snap.receipt.hash === hash ? { replay: snap.receipt.response } : { fail: fail(409, "idempotency_conflict") };
  }

  const existing = snap.editions.find((e) => e.edition_id === edition.edition_id);
  if (existing) {
    const incoming = Date.parse(edition.updated_at);
    const stored = Date.parse(existing.updated_at);
    if (incoming < stored) return { fail: fail(409, "stale_edition") };
    if (incoming === stored) {
      if (existing.content_hash !== hash) return { fail: fail(409, "edition_conflict") };
      return { status: "unchanged", write: false, deleteEditions: [] };
    }
    return { status: "updated", write: true, deleteEditions: [] };
  }

  const newestFirst = snap.editions.map((e) => e.edition_id).sort().reverse();
  if (newestFirst.length >= RETAINED_EDITIONS && edition.edition_id < newestFirst[RETAINED_EDITIONS - 1]) {
    return { fail: fail(409, "outside_retention_window") };
  }
  const kept = [...newestFirst, edition.edition_id].sort().reverse();
  return { status: "created", write: true, deleteEditions: kept.slice(RETAINED_EDITIONS) };
}

/** Validates a raw body and stores it. Every failure leaves the stored editions as they were. */
export async function processIngest(store: DigestStore, raw: Uint8Array, key: string | null, now = Date.now()): Promise<IngestResult> {
  if (!key || !IDEMPOTENCY_KEY.test(key)) return fail(400, "invalid_idempotency_key");

  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(raw));
  } catch {
    return fail(400, "malformed_json");
  }

  const checked = checkEdition(parsed, now);
  if (!checked.ok) return fail(422, checked.error, checked.detail);
  const { edition } = checked;

  const canonical = canonicalJson(edition);
  const hash = sha256(canonical);
  const receiptId = sha256(key);
  const nowIso = new Date(now).toISOString();

  for (let attempt = 0; attempt < COMMIT_ATTEMPTS; attempt++) {
    try {
      const snap = await store.snapshot(receiptId, nowIso);
      const decision = decide(edition, hash, snap);
      if ("replay" in decision) return { status: 200, body: { ...decision.replay } };
      if ("fail" in decision) return decision.fail;

      const response: Receipt = { edition_id: edition.edition_id, schema_version: edition.schema_version, status: decision.status, content_hash: hash };
      await store.commit(snap.rev, {
        edition: decision.write ? { summary: { edition_id: edition.edition_id, updated_at: edition.updated_at, content_hash: hash }, payload: canonical } : undefined,
        receipt: { id: receiptId, key, hash, response, expiresAt: new Date(now + RECEIPT_DAYS * 86_400_000).toISOString() },
        deleteEditions: decision.deleteEditions,
        deleteReceipts: snap.expiredReceipts,
      });
      return { status: decision.status === "created" ? 201 : 200, body: { ...response } };
    } catch (err) {
      if (!(err instanceof RevisionConflict)) return { ...fail(503, "store_unavailable"), retryAfter: 5 };
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 60 * 2 ** attempt));
    }
  }
  return { ...fail(503, "store_busy"), retryAfter: 2 };
}
