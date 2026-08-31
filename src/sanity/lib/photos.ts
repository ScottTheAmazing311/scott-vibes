import { client } from "./client";

export interface SanityPhoto {
  _id: string;
  title?: string;
  series?: string;
  date?: string;
  /** marks the photo used as its series' quick-link thumbnail */
  featured?: boolean;
  url: string;
  width: number;
  height: number;
}

const QUERY = `*[_type == "photo" && defined(image.asset)] | order(coalesce(order, 9999) asc, date desc) {
  _id,
  title,
  series,
  date,
  featured,
  "url": image.asset->url,
  "width": image.asset->metadata.dimensions.width,
  "height": image.asset->metadata.dimensions.height
}`;

/** Fetch catalogued photos; returns [] when Sanity is unconfigured, empty, or unreachable. */
export async function getPhotos(): Promise<SanityPhoto[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    return await client.fetch<SanityPhoto[]>(QUERY);
  } catch {
    return [];
  }
}

/** Group photos by series, preserving photo order; unnamed series last. */
export function groupBySeries(photos: SanityPhoto[]): { series: string; photos: SanityPhoto[] }[] {
  const groups = new Map<string, SanityPhoto[]>();
  for (const p of photos) {
    const key = p.series?.trim() || "Uncatalogued";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }
  const entries = [...groups.entries()].map(([series, photos]) => ({ series, photos }));
  return entries.sort((a, b) => Number(a.series === "Uncatalogued") - Number(b.series === "Uncatalogued"));
}
