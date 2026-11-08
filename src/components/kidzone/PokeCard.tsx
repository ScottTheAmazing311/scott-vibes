"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Mark, { type KidShape } from "./Mark";
import { art, pad, RARITY, REGIONS, TYPES, type Mon } from "./pokeData";

const RARITY_MARK: Record<Mon["rarity"], KidShape> = { common: "circle", rare: "gem", epic: "star", legendary: "star" };

/** The face of a trading card. Sizes itself to its container's width. */
export function PokeCard({ mon, shiny = false, sweep = false }: { mon: Mon; shiny?: boolean; sweep?: boolean }) {
  const [hp, atk, def, spd] = mon.stats;
  return (
    <div className="pk-wrap">
      <div
        className={`pk-card ${sweep ? "pk-sweep" : ""}`}
        data-rarity={mon.rarity}
        data-shiny={shiny}
        style={{ "--t": TYPES[mon.types[0]]?.[0] ?? "#9a9682" } as React.CSSProperties}
      >
        <div className="pk-inner">
          <div className="pk-name">
            <b>{mon.name}</b>
            <span>
              HP <em>{hp}</em>
            </span>
          </div>
          <div className="pk-window">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={art(mon.id, shiny)} alt={shiny ? `Shiny ${mon.name}` : mon.name} draggable={false} />
          </div>
          <div className="pk-strip">
            <span className="pk-types">
              {mon.types.map((t) => (
                <i key={t} style={{ background: TYPES[t]?.[0] }}>
                  {t}
                </i>
              ))}
            </span>
            <span className="flex items-center gap-[1.2cqw]">
              {pad(mon.id)} · {REGIONS[mon.gen - 1]}
              <Mark shape={RARITY_MARK[mon.rarity]} size={12} className="h-[4cqw] w-[4cqw]" />
              {mon.rarity === "legendary" && <Mark shape="star" size={12} className="-ml-[1cqw] h-[4cqw] w-[4cqw]" />}
            </span>
          </div>
          <p className="pk-text">
            {shiny && <strong style={{ color: "var(--kz-marigold)" }}>Shiny! </strong>}
            {mon.fact}
          </p>
          <div className="pk-stats">
            <span>
              <small>ATK</small>
              {atk}
            </span>
            <span>
              <small>DEF</small>
              {def}
            </span>
            <span>
              <small>SPD</small>
              {spd}
            </span>
          </div>
        </div>
        <div className="pk-foil" />
        <div className="pk-glare" />
        <span className="sr-only">
          {RARITY[mon.rarity].label}
          {shiny ? ", shiny" : ""}
        </span>
      </div>
    </div>
  );
}

export function CardBack({ glow }: { glow?: string }) {
  return (
    <div className="pk-wrap">
      <div className="pk-back" style={glow ? { boxShadow: `0 0 0 0.6cqw ${glow}, 0 0 14cqw 3cqw ${glow}` } : undefined}>
        <Mark shape="ball" size={64} className="h-[34cqw] w-[34cqw]" style={{ color: "var(--kz-brick)" }} />
        <p>POKÉ PACKS</p>
      </div>
    </div>
  );
}

/** Tilts toward the pointer and steers the card's holo foil. */
export function Tilt({ children, className = "", strength = 14 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    rx.set((0.5 - y) * strength);
    ry.set((x - 0.5) * strength);
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className={`[perspective:1000px] ${className}`}>
      <motion.div ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>
    </div>
  );
}
