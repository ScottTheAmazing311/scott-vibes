import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/digest/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const origin = URL.canParse(request.headers.get("origin") ?? "") ? new URL(request.headers.get("origin")!).host : null;
  if (origin !== (request.headers.get("host") ?? url.host)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403, headers: { "Cache-Control": "private, no-store" } });
  }
  const res = NextResponse.redirect(new URL("/feed", request.url), 303);
  res.headers.set("Cache-Control", "private, no-store");
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
