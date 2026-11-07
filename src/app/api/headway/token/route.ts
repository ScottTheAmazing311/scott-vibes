import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_PATH, REFRESH_COOKIE, config, googleToken, unseal } from "@/lib/headway-auth";

/** Trades the signed-in person's sealed refresh token for a short-lived Google access token. */
export async function GET(request: NextRequest) {
  const headers = { "Cache-Control": "no-store" };
  const cfg = config();
  if (!cfg) return NextResponse.json({ reason: "not_configured" }, { status: 503, headers });

  const sealed = request.cookies.get(REFRESH_COOKIE)?.value;
  const refreshToken = sealed ? unseal(sealed, cfg.key) : null;
  if (!refreshToken) return NextResponse.json({ reason: "signed_out" }, { status: 401, headers });

  const { ok, data } = await googleToken({
    refresh_token: refreshToken,
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    grant_type: "refresh_token",
  });
  if (!ok || !data.access_token) {
    if (data.error === "invalid_grant") {
      const res = NextResponse.json({ reason: "signed_out" }, { status: 401, headers });
      res.cookies.set(REFRESH_COOKIE, "", { path: COOKIE_PATH, maxAge: 0 });
      return res;
    }
    return NextResponse.json({ reason: "google_unavailable" }, { status: 502, headers });
  }
  return NextResponse.json(
    { access_token: data.access_token, expires_in: data.expires_in ?? 3600, scope: data.scope ?? "" },
    { headers },
  );
}
