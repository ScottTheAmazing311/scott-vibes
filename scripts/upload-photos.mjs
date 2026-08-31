/**
 * One-off bulk upload: Photos/<Series>/*.jpg -> Sanity photo documents.
 *
 * Usage: node --env-file=.env.local scripts/upload-photos.mjs [--dry-run]
 * Needs SANITY_API_WRITE_TOKEN (Editor) in .env.local. Re-runnable: documents
 * use deterministic ids and Sanity dedupes identical asset uploads.
 */
import { createClient } from "@sanity/client";
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const PHOTOS_DIR = new URL("../Photos/", import.meta.url).pathname;
// Section order on the page; folders not listed here still upload, after these.
const SERIES_ORDER = ["People", "Places", "Things", "Flowers", "B&W", "Golf", "Animals"];
const MAX_EDGE = 2500;
const JPEG_QUALITY = 85;
const CONCURRENCY = 3;
const DRY_RUN = process.argv.includes("--dry-run");

const token = process.env.SANITY_API_WRITE_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
if (!token && !DRY_RUN) throw new Error("SANITY_API_WRITE_TOKEN is not set (add it to .env.local)");

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const docId = (series, file) =>
  `photo-${(series + "-" + path.parse(file).name).toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`;

async function uploadOne(series, file, order) {
  const full = path.join(PHOTOS_DIR, series, file);
  const resized = await sharp(full)
    .rotate() // respect EXIF orientation
    .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();
  if (DRY_RUN) {
    console.log(`[dry] ${series}/${file} -> ${(resized.length / 1024).toFixed(0)}KB, order ${order}`);
    return;
  }
  const asset = await client.assets.upload("image", resized, {
    filename: path.parse(file).name + ".jpg",
  });
  await client.createOrReplace({
    _id: docId(series, file),
    _type: "photo",
    series,
    order,
    image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
  });
  console.log(`ok  ${series}/${file} (${(resized.length / 1024).toFixed(0)}KB)`);
}

const dirs = (await readdir(PHOTOS_DIR, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort((a, b) => {
    const ia = SERIES_ORDER.indexOf(a), ib = SERIES_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

const jobs = [];
for (const [si, series] of dirs.entries()) {
  const files = (await readdir(path.join(PHOTOS_DIR, series)))
    .filter((f) => /\.(jpe?g|png|heic|webp)$/i.test(f))
    .sort();
  files.forEach((file, i) => jobs.push({ series, file, order: si * 1000 + i }));
}
console.log(`${jobs.length} photos across ${dirs.length} series: ${dirs.join(", ")}${DRY_RUN ? " (dry run)" : ""}`);

let failed = 0;
const queue = [...jobs];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (let job = queue.shift(); job; job = queue.shift()) {
      try {
        await uploadOne(job.series, job.file, job.order);
      } catch (err) {
        failed++;
        console.error(`FAIL ${job.series}/${job.file}: ${err.message}`);
      }
    }
  }),
);
console.log(failed ? `done with ${failed} failures — rerun to retry` : "done, all uploaded");
