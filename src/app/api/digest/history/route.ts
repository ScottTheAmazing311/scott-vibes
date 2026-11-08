import { json, refuseUnlessOwner } from "@/lib/digest/http";
import { digestStore } from "@/lib/digest/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const refusal = await refuseUnlessOwner();
  if (refusal) return refusal;
  const store = digestStore();
  if (!store) return json({ error: "not_configured" }, 503);
  try {
    return json({ editions: await store.history() });
  } catch {
    return json({ error: "store_unavailable" }, 503, { "Retry-After": "5" });
  }
}
