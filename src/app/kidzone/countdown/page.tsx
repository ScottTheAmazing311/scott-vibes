import Link from "next/link";
import Mark from "@/components/kidzone/Mark";
import CountdownGame from "@/components/kidzone/CountdownGame";

export const metadata = { title: "Countdown" };

export default function Page() {
  return (
    <div>
      <Link href="/kidzone" className="text-sm font-bold no-underline" style={{ color: "var(--kz-ink-soft)" }}>
        ← All games
      </Link>
      <h1 className="mb-9 mt-2 flex items-center gap-4 text-4xl font-extrabold tracking-tight md:text-5xl">
        <Mark shape="ring" size={38} style={{ color: "var(--kz-cobalt)" }} />
        Countdown
      </h1>
      <CountdownGame />
    </div>
  );
}
