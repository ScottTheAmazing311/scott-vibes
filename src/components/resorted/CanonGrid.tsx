"use client";

import { useState } from "react";
import { canon } from "@/lib/resorted/content";
import { houses } from "@/lib/resorted/houses";
import { mapOrder, readingOrder, type Key } from "@/lib/resorted/model";
import Glyph from "./Glyph";
import { hv } from "./hv";
import Reveal from "./Reveal";

type Filter = "all" | "moved" | Key;

/** Centers of the four cells in the 46px mover grid (two 21.5px cells and a 3px gap per side). */
const CELL: Record<Key, [number, number]> = { g: [10.75, 10.75], s: [35.25, 10.75], h: [10.75, 35.25], r: [35.25, 35.25] };

/** A tiny map: the dot starts in the canon house and travels to the re-sorted one when the card appears. */
function Mover({ from, to }: { from: Key; to: Key }) {
  const [fx, fy] = CELL[from];
  const [tx, ty] = CELL[to];
  return (
    <span className="rs-mover" aria-hidden="true" style={{ "--fx": `${fx}px`, "--fy": `${fy}px`, "--tx": `${tx}px`, "--ty": `${ty}px` } as React.CSSProperties}>
      {mapOrder.map((k) => (
        <i key={k} style={hv(k)} />
      ))}
      {from !== to && <b className="rs-mover-ghost" />}
      <b className="rs-mover-dot" style={hv(to)} />
    </span>
  );
}

export default function CanonGrid() {
  const [filter, setFilter] = useState<Filter>("all");

  const movedCount = canon.filter((c) => c.canon !== c.resorted).length;
  const gTotal = canon.filter((c) => c.canon === "g").length;
  const gMoved = canon.filter((c) => c.canon === "g" && c.resorted !== "g").length;

  const shown = canon.filter((c) => (filter === "all" ? true : filter === "moved" ? c.canon !== c.resorted : c.resorted === filter));

  return (
    <div>
      <Reveal className="rs-callout">
        <span className="rs-callout-num" aria-hidden="true">
          {gMoved}
          <span>/</span>
          {gTotal}
        </span>
        <p>
          Gryffindors who move. The books put most of the heroes in one house.
        </p>
      </Reveal>

      <div className="rs-filters" role="group" aria-label="Filter characters">
        <button className="rs-filter" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
          All <span className="n">{canon.length}</span>
        </button>
        <button className="rs-filter" aria-pressed={filter === "moved"} onClick={() => setFilter("moved")}>
          Moved <span className="n">{movedCount}</span>
        </button>
        {readingOrder.map((k) => (
          <button key={k} className="rs-filter" aria-pressed={filter === k} onClick={() => setFilter(k)}>
            <Glyph active={[k]} size={11} />
            {houses[k].name} <span className="n">{canon.filter((c) => c.resorted === k).length}</span>
          </button>
        ))}
      </div>

      <div className="rs-people">
        {shown.map((c, i) => {
          const moved = c.canon !== c.resorted;
          return (
            <Reveal
              key={`${filter}-${c.name}`}
              as="article"
              className="rs-person"
              delay={Math.min(i, 8) * 45}
              style={hv(c.resorted)}
              data-moved={moved ? "" : undefined}
            >
              <div className="rs-person-top">
                <h3>{c.name}</h3>
                <Mover from={c.canon} to={c.resorted} />
              </div>
              <div className="rs-person-path">
                <span style={{ color: `var(--${c.canon})` }}>{houses[c.canon].name}</span>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
                <span className="sr-only">re-sorted to</span>
                <span style={{ color: `var(--${c.resorted})` }}>{houses[c.resorted].name}</span>
              </div>
              {c.secondary && <span className="rs-person-streak">{houses[c.secondary].name} streak</span>}
              <p>{c.why}</p>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
