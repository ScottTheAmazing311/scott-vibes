import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import Link from "next/link";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-baloo",
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
      className={`${baloo.variable} min-h-screen`}
      style={{
        fontFamily: "var(--font-baloo), system-ui, sans-serif",
        background:
          "radial-gradient(1200px 500px at 80% -10%, #FFE8C2 0%, transparent 60%), radial-gradient(900px 500px at 0% 110%, #DFF3FF 0%, transparent 55%), #FFF8ED",
        color: "#2B2440",
      }}
    >
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 pt-6">
        <Link href="/kidzone" className="text-2xl font-extrabold tracking-tight no-underline" style={{ color: "#2B2440" }}>
          🎈 Kid Zone
        </Link>
        <span className="rounded-full border-2 border-[#2B2440] bg-white px-3 py-1 text-xs font-bold">
          Knudson family arcade
        </span>
      </header>
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-8">{children}</main>
    </div>
  );
}
