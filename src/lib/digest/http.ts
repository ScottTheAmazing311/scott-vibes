import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { accessFrom, SESSION_COOKIE } from "./session";

export const NO_STORE = { "Cache-Control": "private, no-store" };

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  NextResponse.json(body, { status, headers: { ...NO_STORE, ...headers } });

/** Null when the owner is signed in, otherwise the refusal to send. The ingest bearer is never considered here. */
export async function refuseUnlessOwner() {
  const access = accessFrom((await cookies()).get(SESSION_COOKIE)?.value);
  if (access === "owner") return null;
  if (access === "forbidden") return json({ error: "forbidden" }, 403);
  if (access === "unconfigured") return json({ error: "not_configured" }, 503);
  return json({ error: "unauthenticated" }, 401);
}
