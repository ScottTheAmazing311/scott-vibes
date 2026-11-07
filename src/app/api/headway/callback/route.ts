import { NextResponse, type NextRequest } from "next/server";
import {
  COOKIE_PATH,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
  STATE_COOKIE,
  config,
  googleToken,
  redirectUri,
  seal,
} from "@/lib/headway-auth";

/** Google sends people back here after sign-in. Keeps the refresh token in a sealed cookie. */
export async function GET(request: NextRequest) {
  const back = (error?: string) => {
    const res = NextResponse.redirect(new URL(error ? `/headway?error=${error}` : "/headway", request.url));
    res.cookies.set(STATE_COOKIE, "", { path: COOKIE_PATH, maxAge: 0 });
    return res;
  };

  const cfg = config();
  if (!cfg) return back("not_configured");

  const params = request.nextUrl.searchParams;
  if (params.get("error")) return back(params.get("error") === "access_denied" ? "access_denied" : "google_error");
  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state || state !== request.cookies.get(STATE_COOKIE)?.value) return back("expired");

  const { ok, data } = await googleToken({
    code,
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    redirect_uri: redirectUri(request),
    grant_type: "authorization_code",
  });
  if (!ok || !data.refresh_token) return back("google_error");
  if (!(data.scope ?? "").includes("calendar.events")) return back("scopes");

  const res = back();
  res.cookies.set(REFRESH_COOKIE, seal(data.refresh_token, cfg.key), {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: COOKIE_PATH,
    maxAge: REFRESH_MAX_AGE,
  });
  return res;
}
