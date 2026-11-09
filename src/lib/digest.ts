import "server-only";
import { createClient } from "@sanity/client";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import schema from "./digest.schema.json";

/** The daily digest at /feed. Grok Bot pushes one edition a day; the newest seven are kept in Sanity.
 *  Needs SANITY_API_WRITE_TOKEN (server-side env). */

export const CATEGORIES = schema.properties.categories.const;
export const TIME_ZONE = "America/Denver";
const RETAINED = 7;

export interface DigestItem {
  id: string;
  category: string;
  title: string;
  source_date: string;
  label: string;
  summary: string;
  why_useful: string;
  caveat: string;
  sources: { title: string; url: string }[];
}

export interface Edition {
  schema_version: string;
  edition_id: string;
  updated_at: string;
  timezone: string;
  title: string;
  categories: string[];
  items: DigestItem[];
  coverage_note: string;
}

const ajv = new Ajv2020({ strict: false });
addFormats(ajv);
export const isEdition = ajv.compile<Edition>(schema);

function client() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!token || !projectId) return null;
  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
    perspective: "raw",
  });
}

const GLOB = "digest.edition.*";

/** Saves an edition, replacing any earlier push for that day, and drops anything past the newest seven. */
export async function saveEdition(edition: Edition) {
  const sanity = client();
  if (!sanity) throw new Error("not configured");
  const ids = await sanity.fetch<string[]>(`*[_id in path($glob)].edition_id`, { glob: GLOB });
  const tx = sanity.transaction().createOrReplace({
    _id: `digest.edition.${edition.edition_id}`,
    _type: "digestEdition",
    edition_id: edition.edition_id,
    payload: JSON.stringify(edition),
  });
  [...new Set([...ids, edition.edition_id])]
    .sort()
    .reverse()
    .slice(RETAINED)
    .forEach((id) => tx.delete(`digest.edition.${id}`));
  await tx.commit({ visibility: "sync" });
}

/** Stored editions, newest first. */
export async function loadEditions(): Promise<Edition[]> {
  const sanity = client();
  if (!sanity) throw new Error("not configured");
  const payloads = await sanity.fetch<string[]>(`*[_id in path($glob)] | order(edition_id desc)[0...${RETAINED}].payload`, { glob: GLOB });
  return payloads.map((payload) => JSON.parse(payload) as Edition);
}
