import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_PATH, REFRESH_COOKIE, config, unseal } from "@/lib/headway-auth";

/** Signs out of Headway: revokes Google access and drops the cookie. */
export async function GET(request: NextRequest) {
  const cfg = config();
  const sealed = request.cookies.get(REFRESH_COOKIE)?.value;
  const refreshToken = cfg && sealed ? unseal(sealed, cfg.key) : null;
  if (refreshToken) {
    await fetch("https://oauth2.googleapis.com/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token: refreshToken }),
    }).catch(() => {});
  }
  const res = NextResponse.redirect(new URL("/headway", request.url));
  res.cookies.set(REFRESH_COOKIE, "", { path: COOKIE_PATH, maxAge: 0 });
  return res;
}
