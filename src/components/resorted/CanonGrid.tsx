"use client";

import { useState } from "react";
import { canon } from "@/lib/resorted/content";
import { houses } from "@/lib/resorted/houses";
import { readingOrder, type Key } from "@/lib/resorted/model";
import Chip from "./Chip";
import Glyph from "./Glyph";

type Filter = "all" | "moved" | Key;

/** The re-sorted character roster: computed callout, filter pills, 21 cards. */
export default function CanonGrid() {
  const [filter, setFilter] = useState<Filter>("all");

  const movedCount = canon.filter((c) => c.canon !== c.resorted).length;
  const gTotal = canon.filter((c) => c.canon === "g").length;
  const gMoved = canon.filter((c) => c.canon === "g" && c.resorted !== "g").length;

  const shown = canon.filter((c) => {
    if (filter === "all") return true;
    if (filter === "moved") return c.canon !== c.resorted;
    return c.resorted === filter;
  });

  return (
    <div>
      <div className="rs-callout">
        <span className="rs-callout-num" aria-hidden="true">
          {gMoved}/{gTotal}
        </span>
        <p>
          Of the {gTotal} Gryffindors on this list, {gMoved} end up in another house. That’s the padding showing: the original sort put
          most of the heroes in one place, whatever actually drove them.
        </p>
      </div>
      <div className="rs-filters" role="group" aria-label="Filter characters">
        <button className="rs-filter" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
          All <span className="rs-count">{canon.length}</span>
        </button>
        <button className="rs-filter" aria-pressed={filter === "moved"} onClick={() => setFilter("moved")}>
          Moved houses <span className="rs-count">{movedCount}</span>
        </button>
        {readingOrder.map((k) => (
          <button key={k} className="rs-filter" aria-pressed={filter === k} onClick={() => setFilter(k)}>
            <Glyph active={[k]} size={12} />
            {houses[k].name} <span className="rs-count">{canon.filter((c) => c.resorted === k).length}</span>
          </button>
        ))}
      </div>
      <div className="rs-canon-grid">
        {shown.map((c) => {
          const moved = c.canon !== c.resorted;
          return (
            <article
              key={c.name}
              className={`rs-canon-card${moved ? " rs-moved" : ""}`}
              style={{ "--house": `var(--${c.resorted})` } as React.CSSProperties}
            >
              <div className="rs-canon-head">
                <h3>{c.name}</h3>
                <span className="rs-canon-status">{moved ? "Moves" : "Stays"}</span>
              </div>
              <div className="rs-canon-chips">
                <Chip k={c.canon}>{houses[c.canon].name}</Chip>
                <span aria-hidden="true">→</span>
                <span className="sr-only">re-sorted to</span>
                <Chip k={c.resorted}>{houses[c.resorted].name}</Chip>
                {c.secondary && <span>with a {houses[c.secondary].name} streak</span>}
              </div>
              <p>{c.why}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
