import Link from "next/link";
import { kidGames } from "@/lib/kidzone";

export default function KidzonePage() {
  return (
    <div>
      <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
        What do you want to play?
      </h1>
      <p className="mt-3 max-w-xl text-lg font-medium opacity-70">
        Pick a game. New ones show up here when we build them together.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {kidGames.map((g) => (
          <Link
            key={g.slug}
            href={`/kidzone/${g.slug}`}
            className="group block rounded-3xl border-[3px] border-[#2B2440] p-6 no-underline transition-transform duration-150 hover:-translate-y-1 hover:rotate-[-0.5deg]"
            style={{ background: g.color, boxShadow: "6px 6px 0 #2B2440", color: "#2B2440" }}
          >
            <span className="text-5xl" aria-hidden="true">{g.emoji}</span>
            <h2 className="mt-3 text-3xl font-extrabold">{g.title}</h2>
            <p className="mt-1 text-base font-semibold opacity-80">{g.blurb}</p>
            <span className="mt-4 inline-block rounded-full border-2 border-[#2B2440] bg-white px-4 py-1 text-sm font-bold transition-transform duration-150 group-hover:scale-105">
              Play →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
