import Link from "next/link";
import PianoLab from "@/components/kidzone/PianoLab";

export const metadata = { title: "Piano Lab" };

export default function Page() {
  return (
    <div>
      <Link href="/kidzone" className="text-sm font-bold opacity-60 hover:opacity-100">← All games</Link>
      <h1 className="mb-8 mt-2 text-4xl font-extrabold md:text-5xl">🎹 Piano Lab</h1>
      <PianoLab />
    </div>
  );
}
