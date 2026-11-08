import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { seal } from "@/lib/headway-auth";
import { STATE_COOKIE, STATE_PATH, authConfig, callbackUri } from "@/lib/digest/session";

export const dynamic = "force-dynamic";

/** Starts Google sign-in for /feed. Asks only who you are, nothing from your calendar or mail. */
export async function GET(request: Request) {
  const cfg = authConfig();
  if (!cfg) return NextResponse.redirect(new URL("/feed?auth=unconfigured", request.url));

  const token = () => randomBytes(24).toString("base64url");
  const pending = { state: token(), nonce: token(), verifier: token() };
  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.search = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: callbackUri(request),
    response_type: "code",
    scope: "openid email",
    prompt: "select_account",
    state: pending.state,
    nonce: pending.nonce,
    code_challenge: createHash("sha256").update(pending.verifier).digest("base64url"),
    code_challenge_method: "S256",
  }).toString();

  const res = NextResponse.redirect(auth);
  res.headers.set("Cache-Control", "private, no-store");
  res.cookies.set(STATE_COOKIE, seal(JSON.stringify(pending), cfg.key), {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    path: STATE_PATH,
    maxAge: 600,
  });
  return res;
}
