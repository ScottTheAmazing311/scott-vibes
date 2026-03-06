"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AsciiWave from "@/components/AsciiWave";
import { HUBS } from "@/lib/hubs";

function calculatePositions(w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;

  if (w < 640) {
    // Mobile: 2-column grid
    const colW = w / 2;
    const startY = h * 0.22;
    const rowH = (h - startY - 20) / 3;
    return HUBS.map((_, i) => ({
      x: colW * (i % 2) + colW / 2,
      y: startY + Math.floor(i / 2) * rowH + rowH / 2,
    }));
  }

  const radius = Math.min(w * 0.3, h * 0.32, 300);
  return HUBS.map((_, i) => ({
    x: cx + Math.cos((i / HUBS.length) * Math.PI * 2 - Math.PI / 2) * radius,
    y: cy + Math.sin((i / HUBS.length) * Math.PI * 2 - Math.PI / 2) * radius,
  }));
}

export default function Home() {
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const update = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const positions = useMemo(() => {
    if (dims.w === 0) return [];
    return calculatePositions(dims.w, dims.h);
  }, [dims]);

  if (dims.w === 0) {
    return <div className="h-screen w-screen bg-[#FAF9F6]" />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#FAF9F6] border-[4px] border-[#111]">
      {/* Center wordmark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <h1 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#111] tracking-tight select-none">
          SCOTTVIBES
        </h1>
        <p className="font-mono text-[10px] sm:text-xs tracking-[0.5em] uppercase text-[#111]/30 mt-3 select-none">
          {"// tune into something"}
        </p>
      </div>

      {/* Hub blocks */}
      {positions.map((pos, i) => {
        const hub = HUBS[i];
        const isHovered = hoveredIndex === i;
        const boxW = dims.w < 640 ? 140 : 170;
        const boxH = dims.w < 640 ? 90 : 105;

        return (
          <Link
            key={hub.id}
            href={hub.path}
            className="absolute z-20 group"
            style={{
              left: pos.x - boxW / 2,
              top: pos.y - boxH / 2,
              width: boxW,
              height: boxH,
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="w-full h-full border-[3px] border-[#111] flex flex-col items-center justify-center transition-all duration-200 relative overflow-hidden"
              style={{
                backgroundColor: isHovered ? hub.color : "#FAF9F6",
              }}
            >
              {/* Hub name */}
              <span
                className="font-[family-name:var(--font-playfair)] text-sm sm:text-base font-bold uppercase tracking-wider transition-colors duration-200 z-10"
                style={{ color: isHovered ? "#111" : "#111" }}
              >
                {hub.name}
              </span>

              {/* ASCII waveform */}
              <div className="mt-1.5 z-10">
                <AsciiWave
                  frequency={hub.frequency}
                  color={isHovered ? "#111" : hub.color}
                  width={dims.w < 640 ? 12 : 16}
                  speed={isHovered ? 0.35 : 0.15}
                />
              </div>

              {/* Subtitle */}
              <span
                className="font-mono text-[9px] sm:text-[10px] mt-1 uppercase tracking-widest transition-colors duration-200 z-10"
                style={{
                  color: isHovered ? "rgba(17,17,17,0.6)" : "rgba(17,17,17,0.3)",
                }}
              >
                {hub.subtitle}
              </span>
            </div>
          </Link>
        );
      })}

      {/* Corner decorations — brutalist ASCII */}
      <div className="absolute top-6 left-6 font-mono text-[10px] text-[#111]/15 leading-tight select-none">
        {"┌──────────\n│ sv.2026\n│"}
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-[10px] text-[#111]/15 leading-tight text-right select-none whitespace-pre">
        {"         │\n sv.2026 │\n──────────┘"}
      </div>
    </div>
  );
}
