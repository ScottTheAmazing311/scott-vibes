import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { COOKIE_PATH, SCOPES, STATE_COOKIE, config, redirectUri } from "@/lib/headway-auth";

/** Starts Google sign-in for Headway. */
export async function GET(request: Request) {
  const cfg = config();
  if (!cfg) return NextResponse.redirect(new URL("/headway?error=not_configured", request.url));

  const state = randomBytes(16).toString("base64url");
  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.search = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: redirectUri(request),
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  }).toString();

  const res = NextResponse.redirect(auth);
  res.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    path: COOKIE_PATH,
    maxAge: 600,
  });
  return res;
}
