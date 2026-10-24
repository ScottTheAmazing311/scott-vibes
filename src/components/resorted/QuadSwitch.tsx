"use client";

import { useEffect, useId, useRef, useState } from "react";
import { houses } from "@/lib/resorted/houses";
import { mapOrder, type Key } from "@/lib/resorted/model";
import Glyph from "./Glyph";
import { hv } from "./hv";
import { withSpokenLines } from "./quotes";

const CYCLE_MS = 6500;

export type QuadItem = { title: string; values: Record<Key, string> };

/**
 * A list of titles beside a 2×2 of the four houses' answers. Cycles on its
 * own while in view until someone picks; hovering pauses it so it never moves
 * under a reader.
 */
export default function QuadSwitch({
  items,
  label,
  prompt,
  variant = "word",
}: {
  items: QuadItem[];
  label: string;
  prompt: string;
  variant?: "word" | "sentence";
}) {
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const [canCycle, setCanCycle] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (!reduce) setCanCycle(true);
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cycling = canCycle && inView && !locked && !hovering;

  useEffect(() => {
    if (!cycling) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % items.length), CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [cycling, index, items.length]);

  function choose(n: number) {
    setIndex(n);
    setLocked(true);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const forward = e.key === "ArrowDown" || e.key === "ArrowRight";
    const back = e.key === "ArrowUp" || e.key === "ArrowLeft";
    if (!forward && !back) return;
    e.preventDefault();
    const n = (index + (forward ? 1 : -1) + items.length) % items.length;
    choose(n);
    tabRefs.current[n]?.focus();
  }

  const item = items[index];

  return (
    <div
      ref={rootRef}
      className={`rs-switch rs-switch-${variant}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="rs-switch-tabs" role="tablist" aria-label={label} aria-orientation="vertical" onKeyDown={onKeyDown}>
        <span className="rs-label" aria-hidden="true">
          {prompt}
        </span>
        {items.map((it, n) => (
          <button
            key={it.title}
            ref={(el) => {
              tabRefs.current[n] = el;
            }}
            role="tab"
            id={`${uid}-tab-${n}`}
            aria-selected={n === index}
            aria-controls={`${uid}-panel`}
            tabIndex={n === index ? 0 : -1}
            className="rs-switch-tab"
            onClick={() => choose(n)}
          >
            {it.title}
            {n === index && cycling && <span key={index} className="rs-switch-timer" style={{ animationDuration: `${CYCLE_MS}ms` }} aria-hidden="true" />}
          </button>
        ))}
      </div>
      <div key={index} id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${index}`} className="rs-quadgrid" aria-live="polite">
        {mapOrder.map((k, i) => (
          <div key={k} className="rs-quadcell rs-enter" style={hv(k, { "--i": i })}>
            <span className="rs-hl">
              <Glyph active={[k]} size={11} />
              {houses[k].name}
            </span>
            <p>{withSpokenLines(item.values[k])}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
