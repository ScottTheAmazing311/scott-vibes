import Link from "next/link";
import TriviaGame from "@/components/kidzone/TriviaGame";

export const metadata = { title: "Trivia Blast" };

export default function Page() {
  return (
    <div>
      <Link href="/kidzone" className="text-sm font-bold opacity-60 hover:opacity-100">← All games</Link>
      <h1 className="mb-8 mt-2 text-4xl font-extrabold md:text-5xl">🧠 Trivia Blast</h1>
      <TriviaGame />
    </div>
  );
}
