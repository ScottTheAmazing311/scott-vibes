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
  "The four houses, re-sorted by what drives a decision. With a 28-question quiz.";

export const metadata: Metadata = {
  title: { absolute: "Re-Sorted · Improved wizard house sorting" },
  description,
  openGraph: {
    title: "Re-Sorted · Improved wizard house sorting",
    description,
    url: "/resorted",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function ResortedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`rs ${display.variable} ${sans.variable} ${mono.variable}`}>
      <div className="rs-atmos" aria-hidden="true" />
      {children}
    </div>
  );
}
