import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import Mark from "@/components/kidzone/Mark";
import "./kidzone.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Kid Zone", template: "%s · Kid Zone" },
  description: "Games and activities for the Knudson kids.",
  robots: { index: false, follow: false },
};

export default function KidzoneLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${bricolage.variable} kidzone min-h-[100dvh]`}
      style={{ fontFamily: "var(--font-bricolage), system-ui, sans-serif" }}
    >
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 pt-7">
        <Link href="/kidzone" className="flex items-center gap-3 no-underline" style={{ color: "var(--kz-ink)" }}>
          <span className="flex items-end gap-1" aria-hidden="true">
            <Mark shape="circle" size={13} className="text-[var(--kz-marigold)]" />
            <Mark shape="triangle" size={13} className="text-[var(--kz-brick)]" />
            <Mark shape="cards" size={13} className="text-[var(--kz-cobalt)]" />
          </span>
          <span className="text-xl font-extrabold tracking-tight">Kid Zone</span>
        </Link>
        <span className="text-sm font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
          the Knudson arcade
        </span>
      </header>
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-10">{children}</main>
    </div>
  );
}
