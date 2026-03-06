"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const BRICK = "#A32100";
const SLATE = "#1B3644";
const IVORY = "#EBD999";

const CELLS = [
  {
    id: "photography",
    name: "Photography",
    path: "/photography",
    color: BRICK,
    word: "FRAME",
    grid: "md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-3",
    wordPos: "bottom-[-0.05em] right-4 text-[100px] sm:text-[140px] md:text-[200px]",
    wipeHidden: "inset(0 0 100% 0)", // reveals top to bottom
    mobile: "min-h-[280px]",
    lightText: true,
  },
  {
    id: "writing",
    name: "Creative Writing",
    path: "/writing",
    color: SLATE,
    word: "INK",
    grid: "md:col-start-3 md:col-end-5 md:row-start-1 md:row-end-2",
    wordPos: "top-[-0.15em] right-4 text-[100px] sm:text-[140px]",
    wipeHidden: "inset(0 0 0 100%)", // reveals right to left
    mobile: "min-h-[200px]",
    lightText: true,
  },
  {
    id: "theology",
    name: "Theology",
    path: "/theology",
    color: IVORY,
    word: "LIGHT",
    grid: "md:col-start-3 md:col-end-4 md:row-start-2 md:row-end-3",
    wordPos: "bottom-[-0.08em] left-2 text-[60px] sm:text-[80px]",
    wipeHidden: "inset(100% 0 0 0)", // reveals bottom to top
    mobile: "min-h-[200px]",
    lightText: false, // ivory is light, so use dark text
  },
  {
    id: "coded-creations",
    name: "Coded Creations",
    path: "/coded-creations",
    color: SLATE,
    word: "VOID",
    grid: "md:col-start-4 md:col-end-5 md:row-start-2 md:row-end-3",
    wordPos: "top-[-0.05em] right-2 text-[60px] sm:text-[80px]",
    wipeHidden: "inset(0 0 100% 0)", // reveals top to bottom
    mobile: "min-h-[200px]",
    lightText: true,
  },
  {
    id: "work",
    name: "Work",
    path: "/work",
    color: BRICK,
    word: "CRAFT",
    grid: "md:col-start-1 md:col-end-3 md:row-start-3 md:row-end-4",
    wordPos: "top-[-0.1em] right-4 text-[80px] sm:text-[120px]",
    wipeHidden: "inset(0 100% 0 0)", // reveals left to right
    mobile: "min-h-[200px]",
    lightText: true,
  },
  {
    id: "potpourri",
    name: "Potpourri",
    path: "/potpourri",
    color: IVORY,
    word: "WILD",
    grid: "md:col-start-3 md:col-end-5 md:row-start-3 md:row-end-4",
    wordPos: "bottom-[-0.05em] left-4 text-[80px] sm:text-[120px]",
    wipeHidden: "inset(100% 0 0 0)", // reveals bottom to top
    mobile: "min-h-[200px]",
    lightText: false,
  },
];

const MARQUEE =
  "FRAME THE WORLD \u00B7 SPILL SOME INK \u00B7 FIND THE LIGHT \u00B7 ENTER THE VOID \u00B7 MASTER YOUR CRAFT \u00B7 RUN WILD \u00B7 ";

function CellVisual({ id, light }: { id: string; light: boolean }) {
  const c = light ? "rgba(255,255,255,0.35)" : "rgba(17,17,17,0.08)";

  switch (id) {
    case "photography":
      return (
        <>
          <div className="absolute top-6 left-6 sm:top-8 sm:left-8 w-8 h-8 sm:w-10 sm:h-10 border-l-[3px] border-t-[3px]" style={{ borderColor: c }} />
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-8 h-8 sm:w-10 sm:h-10 border-r-[3px] border-t-[3px]" style={{ borderColor: c }} />
          <div className="absolute bottom-14 left-6 sm:bottom-16 sm:left-8 w-8 h-8 sm:w-10 sm:h-10 border-l-[3px] border-b-[3px]" style={{ borderColor: c }} />
          <div className="absolute bottom-14 right-6 sm:bottom-16 sm:right-8 w-8 h-8 sm:w-10 sm:h-10 border-r-[3px] border-b-[3px]" style={{ borderColor: c }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%]">
            <div className="w-[2px] h-5 mx-auto" style={{ background: c }} />
            <div className="flex items-center -mt-[10px]">
              <div className="w-5 h-[2px]" style={{ background: c }} />
              <div className="w-3 h-3 border-[2px] mx-[-1px]" style={{ borderColor: c }} />
              <div className="w-5 h-[2px]" style={{ background: c }} />
            </div>
            <div className="w-[2px] h-5 mx-auto -mt-[1px]" style={{ background: c }} />
          </div>
          <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden md:grid grid-cols-3 gap-1.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-4 h-3 border-[1.5px]" style={{ borderColor: c }} />
            ))}
          </div>
        </>
      );
    case "writing":
      return (
        <div className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 space-y-3 w-2/5">
          <div className="h-[2px]" style={{ background: c }} />
          <div className="h-[2px] w-[80%]" style={{ background: c }} />
          <div className="h-[2px] w-[65%]" style={{ background: c }} />
          <div className="h-[2px] w-[90%]" style={{ background: c }} />
          <div className="h-[2px] w-[35%]" style={{ background: c }} />
        </div>
      );
    case "theology":
      return (
        <div className="absolute top-[40%] right-5 -translate-y-1/2">
          <div className="relative w-8 h-12">
            <div className="absolute top-0 left-1/2 w-[3px] h-full -translate-x-1/2" style={{ background: c }} />
            <div className="absolute top-[28%] left-0 w-full h-[3px]" style={{ background: c }} />
          </div>
        </div>
      );
    case "coded-creations":
      return (
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
          <span className="font-mono text-2xl" style={{ color: c }}>{">"}</span>
          <div className="w-3 h-5 animate-pulse" style={{ background: c }} />
        </div>
      );
    case "work":
      return (
        <div className="absolute bottom-12 left-6 sm:left-8 flex items-end gap-[5px]">
          {[5, 9, 14, 10, 7, 12].map((h, i) => (
            <div key={i} className="w-3" style={{ height: h, background: c }} />
          ))}
        </div>
      );
    case "potpourri":
      return (
        <div className="absolute top-[38%] right-8 -translate-y-1/2">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-5 h-5 border-[2px]" style={{ borderColor: c }} />
            <div className="absolute top-7 left-7 w-4 h-4 rotate-45" style={{ background: c }} />
            <div className="absolute bottom-2 left-1 w-6 h-3 border-[2px]" style={{ borderColor: c }} />
            <div className="absolute top-4 left-14 w-3 h-3" style={{ background: c }} />
            <div className="absolute bottom-0 left-8 w-8 h-[2px]" style={{ background: c }} />
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function Home() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="h-dvh flex flex-col border-[4px] border-[#111] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 sm:px-8 py-3 border-b-[4px] border-[#111] bg-[#FAF9F6] shrink-0">
        <h1
          className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-black tracking-tight"
          style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.06)" }}
        >
          SCOTTVIBES
        </h1>
        <span className="font-mono text-[9px] sm:text-[10px] text-[#111]/20 tracking-widest hidden sm:block">
          CREATIVE PORTFOLIO
        </span>
      </header>

      {/* Bento grid */}
      <div className="flex-1 bg-[#111] grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-[4px] overflow-auto md:overflow-hidden">
        {CELLS.map((cell, i) => {
          const isHovered = hoveredId === cell.id;
          const revealTextColor = cell.lightText ? "#FAF9F6" : "#111";
          const revealVisualLight = cell.lightText;

          return (
            <Link
              key={cell.id}
              href={cell.path}
              className={`relative overflow-hidden bg-[#FAF9F6] group ${cell.grid} ${cell.mobile}`}
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "none" : "translateY(20px)",
                transition: `opacity 0.6s ${i * 0.1}s, transform 0.6s ${i * 0.1}s`,
              }}
              onMouseEnter={() => setHoveredId(cell.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Base layer */}
              <div className="absolute inset-0">
                <span
                  className={`absolute font-[family-name:var(--font-playfair)] font-black leading-none select-none pointer-events-none ${cell.wordPos}`}
                  style={{ color: cell.color, opacity: 0.07 }}
                >
                  {cell.word}
                </span>
                <CellVisual id={cell.id} light={false} />
                <div className="absolute bottom-0 left-0 p-4 sm:p-5">
                  <h2
                    className="font-[family-name:var(--font-playfair)] text-base sm:text-lg font-black uppercase tracking-tight"
                    style={{ textShadow: `2px 2px 0 ${cell.color}20` }}
                  >
                    {cell.name}
                  </h2>
                </div>
              </div>

              {/* Reveal layer — directional wipe */}
              <div
                className="absolute inset-0 transition-[clip-path] duration-500 ease-[cubic-bezier(0.7,0,0.3,1)]"
                style={{
                  backgroundColor: cell.color,
                  clipPath: isHovered ? "inset(0)" : cell.wipeHidden,
                }}
              >
                <span
                  className={`absolute font-[family-name:var(--font-playfair)] font-black leading-none select-none pointer-events-none ${cell.wordPos}`}
                  style={{ color: revealTextColor, opacity: 0.12 }}
                >
                  {cell.word}
                </span>
                <CellVisual id={cell.id} light={revealVisualLight} />
                <div className="absolute bottom-0 left-0 p-4 sm:p-5">
                  <h2
                    className="font-[family-name:var(--font-playfair)] text-base sm:text-lg font-black uppercase tracking-tight"
                    style={{
                      color: revealTextColor,
                      textShadow: cell.lightText
                        ? "2px 2px 0 rgba(0,0,0,0.2)"
                        : "2px 2px 0 rgba(0,0,0,0.05)",
                    }}
                  >
                    {cell.name}
                  </h2>
                </div>
                <span
                  className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 font-mono text-xs font-bold"
                  style={{ color: revealTextColor, opacity: 0.7 }}
                >
                  {"->"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Marquee */}
      <div className="border-t-[4px] border-[#111] bg-[#FAF9F6] py-2 overflow-hidden shrink-0">
        <div
          className="whitespace-nowrap font-mono text-[10px] tracking-[0.3em] uppercase text-[#111]/20"
          style={{ animation: "marquee 30s linear infinite" }}
        >
          {MARQUEE}
          {MARQUEE}
        </div>
      </div>
    </div>
  );
}
