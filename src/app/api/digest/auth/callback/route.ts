import { NextResponse, type NextRequest } from "next/server";
import { googleToken, unseal } from "@/lib/headway-auth";
import { SESSION_COOKIE, SESSION_DAYS, STATE_COOKIE, STATE_PATH, authConfig, callbackUri, identityFrom, sealSession } from "@/lib/digest/session";

export const dynamic = "force-dynamic";

/** Google sends people back here. Only the owner's verified address gets a session cookie. */
export async function GET(request: NextRequest) {
  const back = (problem?: string) => {
    const res = NextResponse.redirect(new URL(problem ? `/feed?auth=${problem}` : "/feed", request.url), 303);
    res.headers.set("Cache-Control", "private, no-store");
    res.cookies.set(STATE_COOKIE, "", { path: STATE_PATH, maxAge: 0 });
    return res;
  };

  const cfg = authConfig();
  if (!cfg) return back("unconfigured");

  const params = request.nextUrl.searchParams;
  const sealed = request.cookies.get(STATE_COOKIE)?.value;
  const opened = sealed ? unseal(sealed, cfg.key) : null;
  const pending = opened ? (JSON.parse(opened) as { state: string; nonce: string; verifier: string }) : null;
  const code = params.get("code");
  if (!pending || !code || params.get("state") !== pending.state) return back("failed");

  const { ok, data } = await googleToken({
    code,
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    redirect_uri: callbackUri(request),
    grant_type: "authorization_code",
    code_verifier: pending.verifier,
  });
  const email = ok ? identityFrom(data.id_token, cfg.clientId, pending.nonce) : null;
  if (!email) return back("failed");
  if (email !== cfg.owner) return back("denied");

  const res = back();
  res.cookies.set(SESSION_COOKIE, sealSession(email, cfg.key), {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
  return res;
}
