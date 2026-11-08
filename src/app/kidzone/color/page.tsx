import Link from "next/link";
import Mark from "@/components/kidzone/Mark";
import ColorByLetter from "@/components/kidzone/ColorByLetter";

export const metadata = { title: "Color by Letter" };

export default function Page() {
  return (
    <div>
      <Link href="/kidzone" className="text-sm font-bold no-underline print:hidden" style={{ color: "var(--kz-ink-soft)" }}>
        ← All games
      </Link>
      <h1 className="mb-9 mt-2 flex items-center gap-4 text-4xl font-extrabold tracking-tight md:text-5xl print:hidden">
        <Mark shape="crayon" size={38} style={{ color: "var(--kz-cobalt)" }} />
        Color by Letter
      </h1>
      <ColorByLetter />
    </div>
  );
}
