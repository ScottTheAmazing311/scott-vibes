import type { Metadata } from "next";
import HubPage from "@/components/HubPage";
import { domains } from "@/lib/content";

const domain = domains.find((d) => d.id === "theology")!;

export const metadata: Metadata = {
  title: domain.name,
  description: domain.line,
};

export default function Page() {
  return <HubPage domain={domain} />;
}
