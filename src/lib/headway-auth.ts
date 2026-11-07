import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/** Google sign-in for Headway (/headway). The browser never sees the refresh token: it lives in an
 *  encrypted, httpOnly cookie, and /api/headway/token trades it for short-lived access tokens.
 *  Needs HEADWAY_GOOGLE_CLIENT_ID, HEADWAY_GOOGLE_CLIENT_SECRET and HEADWAY_SECRET (server-side env). */

export const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
];
export const REFRESH_COOKIE = "hw_rt";
export const STATE_COOKIE = "hw_state";
export const COOKIE_PATH = "/api/headway";
export const REFRESH_MAX_AGE = 60 * 60 * 24 * 180;

export function config() {
  const clientId = process.env.HEADWAY_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.HEADWAY_GOOGLE_CLIENT_SECRET;
  const secret = process.env.HEADWAY_SECRET;
  if (!clientId || !clientSecret || !secret) return null;
  return { clientId, clientSecret, key: createHash("sha256").update(secret).digest() };
}

export const redirectUri = (request: Request) => new URL("/api/headway/callback", request.url).toString();

export function seal(text: string, key: Buffer) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

export function unseal(sealed: string, key: Buffer) {
  try {
    const raw = Buffer.from(sealed, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", key, raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

export async function googleToken(params: Record<string, string>) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    error?: string;
  };
  return { ok: res.ok, data };
}
