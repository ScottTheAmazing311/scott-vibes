import { json, refuseUnlessOwner } from "@/lib/digest/http";
import { digestStore } from "@/lib/digest/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const refusal = await refuseUnlessOwner();
  if (refusal) return refusal;
  const store = digestStore();
  if (!store) return json({ error: "not_configured" }, 503);
  try {
    const edition = await store.latest();
    return edition ? json(edition) : json({ error: "no_editions" }, 404);
  } catch {
    return json({ error: "store_unavailable" }, 503, { "Retry-After": "5" });
  }
}
