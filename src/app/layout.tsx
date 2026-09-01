import type { Metadata } from "next";
import { Archivo, Newsreader } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s, ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(`https://www.${site.domain}`),
  openGraph: {
    title: site.name,
    description: site.description,
    url: "/",
    siteName: site.domain,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Whitewater pouring through a rocky gorge" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`no-js ${archivo.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.remove('no-js')" }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
