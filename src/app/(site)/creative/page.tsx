import { redirect } from "next/navigation";

/** Vibe Projects goes straight to the apps page; no index page in between. */
export default function Page() {
  redirect("/creative/apps");
}
