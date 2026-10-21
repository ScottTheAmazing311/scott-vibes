import Link from "next/link";
import Mark from "@/components/kidzone/Mark";
import { kidGames } from "@/lib/kidzone";

export default function KidzonePage() {
  return (
    <div>
      <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
        What do you want to play?
      </h1>
      <p className="mt-4 max-w-xl text-lg font-medium" style={{ color: "var(--kz-ink-soft)" }}>
        Pick a game. New ones show up here when we build them together.
      </p>
      <div className="mt-12 grid gap-5 md:grid-cols-12">
        {kidGames.map((g, i) => (
          <Link
            key={g.slug}
            href={`/kidzone/${g.slug}`}
            className={`kz-tile group flex min-h-[220px] flex-col justify-between p-7 no-underline md:min-h-[250px] ${
              i % 3 === 0 ? "md:col-span-7" : "md:col-span-5"
            }`}
            style={{ background: `var(--kz-${g.accent}-soft)`, color: "var(--kz-ink)" }}
          >
            {/* saturated accent lives in the mark; the tile stays a soft tint */}
            <Mark
              shape={g.shape}
              size={52}
              className="transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
              style={{ color: `var(--kz-${g.accent})` }}
            />
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">{g.title}</h2>
              <p className="mt-1.5 max-w-sm text-[15px] font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
                {g.blurb}
              </p>
              <span className="kz-btn mt-5 !min-h-[2.5rem] !px-6 !text-[15px]">Play</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
