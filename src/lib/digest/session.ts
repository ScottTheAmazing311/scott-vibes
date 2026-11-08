import { hkdfSync } from "node:crypto";
import { seal, unseal } from "../headway-auth";

/** Owner-only sign-in for /feed: Google proves who you are, and only DIGEST_OWNER_EMAIL gets a session.
 *  Reuses the Headway Google client. The session key is derived from HEADWAY_SECRET under its own label,
 *  so a Headway cookie can never open a digest session or the reverse. */

export const SESSION_COOKIE = "dg_session";
export const STATE_COOKIE = "dg_state";
export const STATE_PATH = "/api/digest/auth";
export const SESSION_DAYS = 30;

export function authConfig() {
  const clientId = process.env.HEADWAY_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.HEADWAY_GOOGLE_CLIENT_SECRET;
  const secret = process.env.HEADWAY_SECRET;
  const owner = process.env.DIGEST_OWNER_EMAIL?.trim().toLowerCase();
  if (!clientId || !clientSecret || !secret || !owner) return null;
  const key = Buffer.from(hkdfSync("sha256", secret, "", "scottvibes-digest-session-v1", 32));
  return { clientId, clientSecret, owner, key };
}

export const callbackUri = (request: Request) => new URL("/api/digest/auth/callback", request.url).toString();

export function sealSession(email: string, key: Buffer, now = Date.now()) {
  return seal(JSON.stringify({ email, exp: now + SESSION_DAYS * 86_400_000 }), key);
}

export type Access = "owner" | "forbidden" | "anonymous" | "unconfigured";

/** Checked on every read, so changing DIGEST_OWNER_EMAIL locks out existing sessions at once. */
export function accessFrom(cookie: string | undefined, now = Date.now()): Access {
  const cfg = authConfig();
  if (!cfg) return "unconfigured";
  if (!cookie) return "anonymous";
  const opened = unseal(cookie, cfg.key);
  if (!opened) return "anonymous";
  try {
    const { email, exp } = JSON.parse(opened) as { email?: string; exp?: number };
    if (!email || !exp || exp < now) return "anonymous";
    return email.toLowerCase() === cfg.owner ? "owner" : "forbidden";
  } catch {
    return "anonymous";
  }
}

/** Reads the claims of an ID token received directly from Google's token endpoint over TLS. */
export function identityFrom(idToken: string | undefined, clientId: string, nonce: string, now = Date.now()) {
  try {
    const claims = JSON.parse(Buffer.from((idToken ?? "").split(".")[1], "base64url").toString("utf8")) as {
      iss?: string;
      aud?: string;
      exp?: number;
      nonce?: string;
      email?: string;
      email_verified?: boolean;
    };
    const issuer = claims.iss === "https://accounts.google.com" || claims.iss === "accounts.google.com";
    if (!issuer || claims.aud !== clientId || !claims.exp || claims.exp * 1000 < now || claims.nonce !== nonce) return null;
    if (!claims.email || claims.email_verified !== true) return null;
    return claims.email.toLowerCase();
  } catch {
    return null;
  }
}
