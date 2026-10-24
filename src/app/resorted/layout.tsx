import type { Metadata } from "next";
import { Bodoni_Moda, Geist, Geist_Mono } from "next/font/google";
import "./resorted.css";

const display = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--rs-display",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--rs-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--rs-mono",
  display: "swap",
});

const description =
  "An unofficial re-sorting of the four houses by decision driver instead of virtue. Four drivers, two axes, 21 characters re-sorted, and a 28-question sorting quiz.";

export const metadata: Metadata = {
  title: { absolute: "Re-Sorted · Every house runs on one driver" },
  description,
  openGraph: {
    title: "Re-Sorted · Every house runs on one driver",
    description,
    url: "/resorted",
    type: "website",
  },
};

export default function ResortedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`rs ${display.variable} ${sans.variable} ${mono.variable}`}>
      <div className="rs-atmos" aria-hidden="true" />
      {children}
    </div>
  );
}
