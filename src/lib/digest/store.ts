import "server-only";
import { createClient } from "@sanity/client";
import { isEditionShape, type Edition } from "./validate";
import { RETAINED_EDITIONS, RevisionConflict, type Commit, type DigestStore, type Snapshot } from "./ingest";

/** Editions live in Sanity under dotted document IDs, which a public dataset never serves without a token.
 *  Every write goes through one transaction guarded by the head document's revision, so writers can't interleave.
 *  Needs SANITY_API_WRITE_TOKEN (server-side env). */

const prefix = () => {
  const value = process.env.DIGEST_STORE_PREFIX;
  return value && /^digest[a-z0-9]*$/.test(value) ? value : "digest";
};

export function digestStore(): DigestStore | null {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!token || !projectId) return null;

  const client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
    perspective: "raw",
    timeout: 8000,
    maxRetries: 1,
  });
  const p = prefix();
  const HEAD = `${p}.head`;
  const editionId = (id: string) => `${p}.edition.${id}`;
  const editionGlob = `${p}.edition.*`;

  const parse = (payload: string): Edition | null => {
    try {
      const value: unknown = JSON.parse(payload);
      return isEditionShape(value) ? value : null;
    } catch {
      return null;
    }
  };

  return {
    async snapshot(receiptId, nowIso) {
      const read = () =>
        client.fetch<{ rev: string | null; editions: Snapshot["editions"]; receipt: Snapshot["receipt"]; expired: string[] }>(
          `{
            "rev": *[_id == $head][0]._rev,
            "editions": *[_id in path($editions)]{edition_id, updated_at, content_hash},
            "receipt": *[_id == $receipt][0]{hash, response},
            "expired": *[_id in path($receipts) && expires_at < $now][0...50]._id
          }`,
          { head: HEAD, editions: editionGlob, receipt: `${p}.receipt.${receiptId}`, receipts: `${p}.receipt.*`, now: nowIso },
        );
      let state = await read();
      if (!state.rev) {
        await client.createIfNotExists({ _id: HEAD, _type: "digestHead", seq: 0 }, { visibility: "sync" });
        state = await read();
      }
      if (!state.rev) throw new Error("head missing");
      return { rev: state.rev, editions: state.editions, receipt: state.receipt, expiredReceipts: state.expired };
    },

    async commit(rev, commit: Commit) {
      const tx = client.transaction().patch(HEAD, (patch) => patch.ifRevisionId(rev).inc({ seq: 1 }));
      if (commit.edition) {
        const { summary, payload } = commit.edition;
        tx.createOrReplace({ _id: editionId(summary.edition_id), _type: "digestEdition", ...summary, payload });
      }
      const { id, key, hash, response, expiresAt } = commit.receipt;
      tx.createOrReplace({ _id: `${p}.receipt.${id}`, _type: "digestReceipt", key, hash, response, expires_at: expiresAt });
      commit.deleteEditions.forEach((edition) => tx.delete(editionId(edition)));
      commit.deleteReceipts.forEach((receipt) => tx.delete(receipt));
      try {
        await tx.commit({ visibility: "sync" });
      } catch (err) {
        if ((err as { statusCode?: number }).statusCode === 409) throw new RevisionConflict();
        throw err;
      }
    },

    async latest() {
      const payload = await client.fetch<string | null>(`*[_id in path($editions)] | order(edition_id desc)[0].payload`, { editions: editionGlob });
      return payload ? parse(payload) : null;
    },

    async history() {
      const payloads = await client.fetch<string[]>(`*[_id in path($editions)] | order(edition_id desc)[0...${RETAINED_EDITIONS}].payload`, { editions: editionGlob });
      return payloads.map(parse).filter((edition): edition is Edition => edition !== null);
    },
  };
}
