"use client";

import { useRef, useState } from "react";
import { monopoly } from "@/lib/resorted/content";
import { houses } from "@/lib/resorted/houses";
import { mapOrder } from "@/lib/resorted/model";
import Glyph from "./Glyph";
import { withSpokenLines } from "./quotes";

/** Three tabbed rounds at the Monopoly table, four seats each. Arrow keys move between rounds. */
export default function MonopolyTable() {
  const [round, setRound] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next = (round + (e.key === "ArrowRight" ? 1 : -1) + monopoly.length) % monopoly.length;
    setRound(next);
    tabRefs.current[next]?.focus();
  }

  const r = monopoly[round];

  return (
    <div>
      <div className="rs-tabs" role="tablist" aria-label="Monopoly rounds" onKeyDown={onKeyDown}>
        {monopoly.map((m, i) => (
          <button
            key={m.title}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`rs-monotab-${i}`}
            aria-selected={i === round}
            aria-controls="rs-monopanel"
            tabIndex={i === round ? 0 : -1}
            className="rs-tab"
            onClick={() => setRound(i)}
          >
            Round {i + 1} · {m.title}
          </button>
        ))}
      </div>
      <div id="rs-monopanel" role="tabpanel" aria-labelledby={`rs-monotab-${round}`}>
        <div className="rs-situation">
          <span className="rs-sit-eyebrow">The situation</span>
          <p>{r.setup}</p>
        </div>
        <div className="rs-seats">
          {mapOrder.map((k) => (
            <div key={k} className="rs-seat" style={{ "--house": `var(--${k})` } as React.CSSProperties}>
              <div className="rs-seat-head">
                <Glyph active={[k]} size={15} />
                <span className="rs-seat-name">{houses[k].name}</span>
                <span className="rs-seat-driver">{houses[k].driver}</span>
              </div>
              <p>{withSpokenLines(r.seats[k])}</p>
            </div>
          ))}
        </div>
        <p className="rs-mononote">
          <b>{r.note[0]}</b>
          {withSpokenLines(r.note[1])}
        </p>
      </div>
    </div>
  );
}
