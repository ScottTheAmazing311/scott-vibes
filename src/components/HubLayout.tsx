"use client";

import Link from "next/link";
import AsciiWave from "@/components/AsciiWave";
import { HUBS } from "@/lib/hubs";

interface Props {
  hubId: string;
  children: React.ReactNode;
}

export default function HubLayout({ hubId, children }: Props) {
  const currentHub = HUBS.find((h) => h.id === hubId)!;
  const otherHubs = HUBS.filter((h) => h.id !== hubId);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Top bar */}
      <nav className="sticky top-0 z-50 bg-[#FAF9F6] border-b-[3px] border-[#111]">
        <div className="flex items-center justify-between px-4 sm:px-8 py-3">
          <Link
            href="/"
            className="font-[family-name:var(--font-playfair)] text-lg font-black tracking-tight hover:opacity-60 transition-opacity"
          >
            SV
          </Link>

          {/* Hub nav dots */}
          <div className="flex items-center gap-1.5">
            {otherHubs.map((hub) => (
              <Link
                key={hub.id}
                href={hub.path}
                className="w-4 h-4 border-2 border-[#111] transition-all hover:scale-125"
                style={{ backgroundColor: hub.color }}
                title={hub.name}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Hero header */}
      <header
        className="border-b-[3px] border-[#111] px-4 sm:px-8 py-10 sm:py-16"
        style={{ backgroundColor: currentHub.color }}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight text-[#111]">
            {currentHub.name}
          </h1>
          <div className="mt-3 flex items-center gap-4">
            <AsciiWave
              frequency={currentHub.frequency}
              color="#111"
              width={20}
              speed={0.1}
            />
            <span className="font-mono text-xs uppercase tracking-widest text-[#111]/50">
              {currentHub.subtitle}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 sm:px-8 py-10 sm:py-16">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t-[3px] border-[#111] px-4 sm:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest text-[#111]/30 hover:text-[#111] transition-colors"
        >
          {"<-- back to dial"}
        </Link>
        <span className="font-mono text-[10px] text-[#111]/15">
          SCOTTVIBES
        </span>
      </footer>
    </div>
  );
}
