import Link from "next/link";
import DashGame from "@/components/kidzone/DashGame";

export const metadata = { title: "Shape Dash" };

export default function Page() {
  return (
    <div>
      <Link href="/kidzone" className="text-sm font-bold opacity-60 hover:opacity-100">← All games</Link>
      <h1 className="mb-8 mt-2 text-4xl font-extrabold md:text-5xl">🟧 Shape Dash</h1>
      <DashGame />
    </div>
  );
}
