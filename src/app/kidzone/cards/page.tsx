import Link from "next/link";
import FlashCards from "@/components/kidzone/FlashCards";

export const metadata = { title: "Flash Cards" };

export default function Page() {
  return (
    <div>
      <Link href="/kidzone" className="text-sm font-bold opacity-60 hover:opacity-100">← All games</Link>
      <h1 className="mb-8 mt-2 text-4xl font-extrabold md:text-5xl">⚡ Flash Cards</h1>
      <FlashCards />
    </div>
  );
}
