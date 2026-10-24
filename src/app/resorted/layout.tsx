import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Newsreader } from "next/font/google";
import "./resorted.css";

const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--rs-font-display",
  display: "swap",
});

const body = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--rs-font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--rs-font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: "Re-Sorted · Every house runs on one driver" },
  description:
    "An unofficial re-sorting of the four houses by decision driver instead of virtue. Four drivers, two axes, 21 characters re-sorted, and a 28-question sorting quiz.",
  openGraph: {
    title: "Re-Sorted · Every house runs on one driver",
    description:
      "An unofficial re-sorting of the four houses by decision driver instead of virtue. Four drivers, two axes, 21 characters re-sorted, and a 28-question sorting quiz.",
    url: "/resorted",
    type: "website",
  },
};

export default function ResortedLayout({ children }: { children: React.ReactNode }) {
  return <div className={`rs ${display.variable} ${body.variable} ${mono.variable}`}>{children}</div>;
}
