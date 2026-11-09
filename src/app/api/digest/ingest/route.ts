import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { isEdition, saveEdition } from "@/lib/digest";

/** Grok Bot pushes each day's edition here. Needs DIGEST_INGEST_SECRET (server-side env). */

export const dynamic = "force-dynamic";

const MAX_BODY = 128 * 1024;
const digest = (text: string) => createHash("sha256").update(text).digest();

export async function POST(request: Request) {
  const secret = process.env.DIGEST_INGEST_SECRET;
  if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const header = request.headers.get("authorization") ?? "";
  if (!timingSafeEqual(digest(header), digest(`Bearer ${secret}`))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const text = await request.text();
  if (text.length > MAX_BODY) return NextResponse.json({ error: "payload_too_large" }, { status: 413 });

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "malformed_json" }, { status: 400 });
  }
  if (!isEdition(body)) {
    const first = isEdition.errors?.[0];
    return NextResponse.json({ error: "schema_violation", detail: `${first?.instancePath || "/"} ${first?.keyword ?? ""}` }, { status: 422 });
  }

  try {
    await saveEdition(body);
  } catch {
    return NextResponse.json({ error: "store_unavailable" }, { status: 503 });
  }
  return NextResponse.json({ edition_id: body.edition_id, status: "saved" });
}
