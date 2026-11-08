"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import Mark from "./Mark";
import { CardBack, PokeCard, Tilt } from "./PokeCard";
import { art, isBigPull, points, RARITY, type Mon } from "./pokeData";

export interface Drawn {
  mon: Mon;
  shiny: boolean;
}

type Phase = "pack" | "tear" | "cards" | "summary";

const EASE = [0.16, 1, 0.3, 1] as const;
const CARD_W = "w-[min(66vw,17.5rem)] md:w-[19.5rem]";

/**
 * The pack table: tear the pack, flip through the cards one at a time, then
 * see the whole pull fanned out with its total. Modeled on the pack opening in
 * TCG Card Shop Simulator.
 */
export default function PackOpening({
  cards,
  tease,
  newIds,
  label,
  packsLeft,
  onOpen,
  onNext,
  onDone,
  onZoom,
}: {
  cards: Drawn[];
  /** the best card in the pack, shown as a silhouette in the pack window */
  tease: Mon | null;
  /** set by the parent once the pack is opened and saved */
  newIds: number[] | null;
  label: string;
  packsLeft: number;
  onOpen: () => void;
  onNext: () => void;
  onDone: () => void;
  onZoom: (d: Drawn) => void;
}) {
  const reduce = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>("pack");
  const [index, setIndex] = useState(0);
  // big pulls arrive face-down; this marks the ones already flipped
  const [flipped, setFlipped] = useState<boolean[]>(() => cards.map((c) => !isBigPull(c.mon, c.shiny)));
  const stage = useRef<HTMLDivElement>(null);

  const open = () => {
    if (phase !== "pack") return;
    onOpen();
    if (reduce) {
      setPhase("cards");
      return;
    }
    setPhase("tear");
    setTimeout(() => setPhase("cards"), 1250);
  };

  const advance = () => {
    if (phase === "pack") return open();
    if (phase !== "cards") return;
    if (!flipped[index]) {
      setFlipped((f) => f.map((v, i) => v || i === index));
      return;
    }
    if (index < cards.length - 1) setIndex(index + 1);
    else setPhase("summary");
  };

  useEffect(() => {
    if (phase === "cards") stage.current?.focus({ preventScroll: true });
  }, [phase]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") {
      e.preventDefault();
      advance();
    }
  };

  const current = cards[index];
  const faceUp = flipped[index];
  const behind = Math.min(cards.length - index - 1, 3);
  const total = cards.reduce((a, c) => a + points(c.mon, c.shiny), 0);

  return (
    <div className="pk-table mt-6">
      <div className="flex items-center justify-between px-5 pt-4 text-sm font-extrabold md:px-7" style={{ color: "rgba(251,246,230,0.7)" }}>
        <span>{label}</span>
        {phase === "cards" && (
          <span>
            Card {index + 1} of {cards.length}
          </span>
        )}
      </div>

      {phase !== "summary" ? (
        <div
          ref={stage}
          tabIndex={-1}
          onClick={advance}
          onKeyDown={onKey}
          role="button"
          aria-label={phase === "pack" ? "Tear the pack open" : "Next card"}
          // the whole table is the tap target, so the site's focus ring would just outline the table
          style={{ outline: "none" }}
          className="relative flex min-h-[33rem] cursor-pointer select-none items-center justify-center md:min-h-[38rem]"
        >
          {/* the stack of cards waiting inside the pack */}
          {phase !== "pack" && current && (
            <motion.div
              className={`relative aspect-[63/88] ${CARD_W}`}
              initial={reduce ? false : { y: "34%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: reduce ? 0 : 0.55, duration: 0.55, ease: EASE }}
            >
              {Array.from({ length: behind }, (_, k) => (
                <div
                  key={k}
                  className="absolute inset-0"
                  style={{ transform: `translate(${(k + 1) * 5}px, ${(k + 1) * 6}px) scale(${1 - (k + 1) * 0.02})`, zIndex: -k - 1, opacity: 0.9 - k * 0.2 }}
                >
                  <CardBack />
                </div>
              ))}

              <AnimatePresence initial={false}>
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={reduce ? false : { scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { x: "-135%", y: -30, rotate: -16, opacity: 0, transition: { duration: 0.38, ease: [0.4, 0, 1, 1] } }}
                  transition={{ duration: 0.3, ease: EASE }}
                  // the card leaving stays above the one arriving
                  style={{ zIndex: 10 + cards.length - index }}
                >
                  <BigPull card={current} faceUp={faceUp} isNew={!!newIds?.includes(current.mon.id)} reduce={reduce} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* the pack itself, until it drops away */}
          {(phase === "pack" || phase === "tear") && (
            <div className={`absolute ${CARD_W}`}>
              <Pack tease={tease} tearing={phase === "tear"} reduce={reduce} />
            </div>
          )}

          <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-sm font-bold" style={{ color: "rgba(251,246,230,0.6)" }}>
            {phase === "pack"
              ? "Who's in the window? Tap the pack to tear it open."
              : phase === "cards" && !faceUp
                ? "Something big! Tap to flip it."
                : phase === "cards"
                  ? index < cards.length - 1
                    ? "Tap for the next card"
                    : "Tap to see your whole pack"
                  : ""}
          </p>
        </div>
      ) : (
        <Summary cards={cards} newIds={newIds ?? []} total={total} packsLeft={packsLeft} reduce={reduce} onNext={onNext} onDone={onDone} onZoom={onZoom} />
      )}
    </div>
  );
}

/* ---------- the pack ---------- */

function Pack({ tease, tearing, reduce }: { tease: Mon | null; tearing: boolean; reduce: boolean }) {
  return (
    <motion.div
      className="pk-pack"
      animate={tearing ? { y: "75%", opacity: 0 } : reduce ? {} : { y: [0, -8, 0] }}
      transition={tearing ? { delay: 0.75, duration: 0.45, ease: [0.4, 0, 1, 1] } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
      whileHover={tearing || reduce ? undefined : { rotate: -2, scale: 1.02 }}
      style={{ filter: "drop-shadow(0 24px 30px rgba(10,12,20,0.5))" }}
    >
      <motion.div
        className="pk-pack-top"
        animate={tearing ? { x: 80, y: -120, rotate: 28, opacity: 0 } : {}}
        transition={{ delay: 0.32, duration: 0.45, ease: EASE }}
      />
      <div className="pk-pack-body">
        <span className="pk-pack-title flex items-center gap-[3cqw]">
          <Mark shape="ball" size={24} className="h-[11cqw] w-[11cqw]" style={{ color: "#fbf6e6" }} />
          Poké Packs
        </span>
        <span className="pk-pack-window">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {tease && <img src={art(tease.id)} alt="" draggable={false} />}
        </span>
        <span className="pk-pack-foot">5 cards · Who&apos;s inside?</span>
      </div>
      {tearing && (
        <motion.span className="pk-cut" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.3, ease: "linear" }} />
      )}
    </motion.div>
  );
}

/* ---------- the front card ---------- */

function BigPull({ card, faceUp, isNew, reduce }: { card: Drawn; faceUp: boolean; isNew: boolean; reduce: boolean }) {
  const big = isBigPull(card.mon, card.shiny);
  const glow = card.shiny ? "rgba(249,215,126,0.75)" : RARITY[card.mon.rarity].color === "var(--kz-brick)" ? "rgba(217,91,67,0.7)" : "rgba(232,163,61,0.7)";
  const callout = card.shiny ? "Shiny!" : card.mon.rarity === "legendary" ? "Legendary!" : card.mon.rarity === "epic" ? "Epic!" : null;

  return (
    <div className="relative">
      {/* value pops in above the card once it's showing */}
      {faceUp && (
        <motion.div
          className="absolute -top-12 left-1/2 z-10 flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-extrabold"
          style={{ background: big ? "var(--kz-marigold)" : "rgba(251,246,230,0.95)", color: "var(--kz-ink)" }}
          initial={reduce ? false : { scale: 0.4, y: 10, opacity: 0, x: "-50%" }}
          animate={{ scale: 1, y: 0, opacity: 1, x: "-50%" }}
          transition={{ type: "spring", stiffness: 420, damping: 14, delay: big ? 0.35 : 0.08 }}
        >
          {callout && <span>{callout}</span>}
          <Mark shape="star" size={14} style={{ color: big ? "var(--kz-ink)" : "var(--kz-marigold)" }} />+{points(card.mon, card.shiny)} pts
        </motion.div>
      )}

      {big && faceUp && !reduce && <Burst color={card.shiny ? "#f9d77e" : card.mon.rarity === "legendary" ? "#f08a6c" : "#f4c76a"} />}

      <div className="[perspective:1200px]">
        <motion.div
          className="relative"
          style={{ transformStyle: "preserve-3d" }}
          initial={false}
          animate={{ rotateY: faceUp ? 0 : 180 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
        >
          <div style={{ backfaceVisibility: "hidden" }}>
            <Tilt>
              <PokeCard mon={card.mon} shiny={card.shiny} sweep={big && faceUp && !reduce} />
            </Tilt>
          </div>
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <motion.div
              animate={reduce ? {} : { scale: [1, 1.03, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            >
              <CardBack glow={glow} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {isNew && faceUp && <NewSticker reduce={reduce} delay={big ? 0.5 : 0.15} />}
    </div>
  );
}

function NewSticker({ reduce, delay }: { reduce: boolean; delay: number }) {
  return (
    <motion.div
      className="absolute -left-5 -top-6 z-10 grid h-[4.5rem] w-[4.5rem] place-items-center"
      initial={reduce ? false : { scale: 0, rotate: -40 }}
      animate={{ scale: 1, rotate: -12 }}
      transition={{ type: "spring", stiffness: 380, damping: 12, delay }}
    >
      <Mark shape="star" size={72} className="absolute inset-0 drop-shadow-[0_4px_6px_rgba(10,12,20,0.4)]" style={{ color: "var(--kz-brick)" }} />
      <span className="relative mt-1 text-[13px] font-extrabold tracking-wide" style={{ color: "#fbf6e6" }}>
        NEW
      </span>
    </motion.div>
  );
}

/** Short rays fly out from behind a big card as it flips, then vanish. */
function Burst({ color }: { color: string }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => (
        <motion.span
          key={i}
          className="absolute left-0 top-0 h-7 w-2 rounded-full"
          style={{ background: color, rotate: (360 / 14) * i, originY: 0, marginLeft: -4 }}
          initial={{ y: 60, opacity: 0, scaleY: 0.4 }}
          animate={{ y: [60, 210], opacity: [0, 1, 0], scaleY: [0.4, 1.4, 0.6] }}
          transition={{ duration: 0.75, delay: 0.25, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ---------- the whole pull, fanned out ---------- */

function Summary({
  cards,
  newIds,
  total,
  packsLeft,
  reduce,
  onNext,
  onDone,
  onZoom,
}: {
  cards: Drawn[];
  newIds: number[];
  total: number;
  packsLeft: number;
  reduce: boolean;
  onNext: () => void;
  onDone: () => void;
  onZoom: (d: Drawn) => void;
}) {
  const count = useMotionValue(reduce ? total : 0);
  const shown = useTransform(count, (v) => Math.round(v).toLocaleString());
  useEffect(() => {
    if (reduce) return;
    const a = animate(count, total, { duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] });
    return () => a.stop();
  }, [count, total, reduce]);

  const mid = (cards.length - 1) / 2;
  const fresh = new Set(newIds);
  const shiny = cards.some((c) => c.shiny);

  return (
    <div className="flex min-h-[33rem] flex-col items-center justify-center px-4 pb-7 pt-4 md:min-h-[38rem]">
      <div className="flex w-full justify-center pl-[clamp(2rem,9vw,4.5rem)]">
        {cards.map((c, i) => {
          const off = i - mid;
          return (
            <motion.button
              key={i}
              onClick={() => onZoom(c)}
              aria-label={`${c.shiny ? "Shiny " : ""}${c.mon.name}, see the card`}
              className="relative -ml-[clamp(2rem,9vw,4.5rem)] w-[clamp(6.5rem,24vw,12.5rem)] shrink-0 focus-visible:outline-none"
              style={{ zIndex: i }}
              initial={reduce ? false : { opacity: 0, y: 60, rotate: 0, x: `${-off * 60}%` }}
              animate={{ opacity: 1, y: Math.abs(off) * 10, rotate: off * 4, x: 0 }}
              transition={{ delay: reduce ? 0 : i * 0.07, duration: 0.5, ease: EASE }}
              whileHover={reduce ? undefined : { y: Math.abs(off) * 10 - 18, zIndex: 20 }}
            >
              <PokeCard mon={c.mon} shiny={c.shiny} />
              {fresh.has(c.mon.id) && (
                <span className="absolute -left-2 -top-3 grid h-12 w-12 -rotate-12 place-items-center">
                  <Mark shape="star" size={48} className="absolute inset-0" style={{ color: "var(--kz-brick)" }} />
                  <span className="relative mt-0.5 text-[10px] font-extrabold" style={{ color: "#fbf6e6" }}>
                    NEW
                  </span>
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm font-extrabold uppercase tracking-wide" style={{ color: "rgba(251,246,230,0.65)" }}>
          Pack total
        </p>
        <p className="mt-1 flex items-center justify-center gap-2 text-5xl font-extrabold tracking-tight" style={{ color: "var(--kz-marigold)" }}>
          <Mark shape="star" size={34} />
          <motion.span>{shown}</motion.span>
          <span className="text-2xl">pts</span>
        </p>
        <p className="mt-2 text-sm font-bold" style={{ color: "rgba(251,246,230,0.75)" }}>
          {shiny
            ? "A SHINY! Those are super hard to find."
            : fresh.size > 0
              ? `${fresh.size} new Pokémon for your Pokédex!`
              : "All doubles this time. Your counters go up!"}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {packsLeft > 0 && (
            <button onClick={onNext} className="kz-btn" style={{ background: "var(--kz-marigold)", color: "var(--kz-ink)" }}>
              Open the next pack
            </button>
          )}
          <button onClick={onDone} className="kz-btn-ghost">
            To my Pokédex
          </button>
        </div>
      </div>
    </div>
  );
}
