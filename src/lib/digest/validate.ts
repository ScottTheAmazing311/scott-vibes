import { createHash } from "node:crypto";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import schema from "./digest.schema.json";

/** Validation for digest editions pushed by Grok Bot: the v1 JSON Schema, then the rules a schema can't express. */

export const CATEGORIES = schema.properties.categories.const;
export const TIME_ZONE = "America/Denver";
const SKEW_MS = 5 * 60 * 1000;

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

const ajv = new Ajv2020({ allErrors: false, strict: false });
addFormats(ajv);
const matchesSchema = ajv.compile(schema);

/** The calendar date in Denver for an instant, as YYYY-MM-DD. */
export function denverDate(ms: number) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(ms);
  const part = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

/** Links must be public HTTPS hosts. They are only ever rendered, never fetched by the server. */
export function isPublicHttpsUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || !url.hostname || url.username || url.password) return false;
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (host.startsWith("[")) return false; // no IPv6 literals: a news source has a name
  if (!host.includes(".") || /\.(local|localhost|internal|intranet|lan|home|corp|test|invalid|example)$/.test(host)) return false;
  const v4 = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
    if ((a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127)) return false;
  }
  return true;
}

/** Shape only, for reading back editions that already passed every rule when they were stored. */
export const isEditionShape = (value: unknown): value is Edition => matchesSchema(value);

export type Checked = { ok: true; edition: Edition } | { ok: false; error: string; detail?: string };

export function checkEdition(value: unknown, now: number): Checked {
  if (!matchesSchema(value)) {
    const first = matchesSchema.errors?.[0];
    return { ok: false, error: "schema_violation", detail: `${first?.instancePath || "/"} ${first?.keyword ?? ""}`.slice(0, 120) };
  }
  const edition = value as unknown as Edition;

  const updated = Date.parse(edition.updated_at);
  if (denverDate(updated) !== edition.edition_id) return { ok: false, error: "edition_date_mismatch" };
  if (updated > now + SKEW_MS) return { ok: false, error: "future_update" };

  const ids = new Set(edition.items.map((item) => item.id));
  if (ids.size !== edition.items.length) return { ok: false, error: "duplicate_item_id" };

  const badLink = edition.items.some((item) => item.sources.some((source) => !isPublicHttpsUrl(source.url)));
  if (badLink) return { ok: false, error: "disallowed_source_url" };

  return { ok: true, edition };
}

/** RFC 8785 for this schema: sorted keys and JSON string escaping. Editions hold no numbers. */
export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");
