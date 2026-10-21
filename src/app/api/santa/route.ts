import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

/** Receives Kid Zone wish lists and files them in Sanity for Dad to read.
 *  Needs SANITY_API_WRITE_TOKEN (server-side env; locally in .env.local). */
export async function POST(request: Request) {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!token || !projectId) {
    return NextResponse.json({ ok: false, reason: "mailbox-not-configured" }, { status: 503 });
  }

  let body: { kid?: string; wishes?: { text?: string; stars?: number }[]; note?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const kid = String(body.kid ?? "").slice(0, 40).trim();
  const wishes = (Array.isArray(body.wishes) ? body.wishes : [])
    .slice(0, 12)
    .map((w) => ({ text: String(w.text ?? "").slice(0, 120).trim(), stars: Math.min(3, Math.max(1, Number(w.stars) || 1)) }))
    .filter((w) => w.text.length > 0);
  const note = String(body.note ?? "").slice(0, 500).trim();

  if (!kid || wishes.length === 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });

  try {
    await client.create({
      _type: "santaLetter",
      kid,
      wishes: wishes.map((w, i) => ({ _key: `w${i}`, ...w })),
      note,
      year: new Date().getFullYear(),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, reason: "delivery-failed" }, { status: 502 });
  }
}
