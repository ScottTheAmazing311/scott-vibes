import type { Metadata } from "next";
import HubPage from "@/components/HubPage";
import { domains } from "@/lib/content";
import { getPhotos } from "@/sanity/lib/photos";

const domain = domains.find((d) => d.id === "photography")!;

export const metadata: Metadata = {
  title: domain.name,
  description: domain.line,
};

export const revalidate = 60;

export default async function Page() {
  const photos = await getPhotos();
  return <HubPage domain={domain} gallery={photos} />;
}
