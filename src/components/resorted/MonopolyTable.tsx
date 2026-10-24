"use client";

import { useRef, useState } from "react";
import { monopoly } from "@/lib/resorted/content";
import { houses } from "@/lib/resorted/houses";
import { mapOrder } from "@/lib/resorted/model";
import Glyph from "./Glyph";
import { hv } from "./hv";
import { withSpokenLines } from "./quotes";

/** A table with one seat per house in map order around the situation card. Three rounds; arrow keys switch. */
export default function MonopolyTable() {
  const [round, setRound] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const r = monopoly[round];

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next = (round + (e.key === "ArrowRight" ? 1 : -1) + monopoly.length) % monopoly.length;
    setRound(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div className="rs-seg-wrap">
        <div className="rs-seg" role="tablist" aria-label="Monopoly rounds" onKeyDown={onKeyDown}>
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
              onClick={() => setRound(i)}
            >
              <span className="n">Round {i + 1}</span>
              {m.title}
            </button>
          ))}
        </div>
      </div>

      <div key={round} id="rs-monopanel" role="tabpanel" aria-labelledby={`rs-monotab-${round}`}>
        <div className="rs-board">
          <div className="rs-table-card rs-enter">
            <span className="rs-label">
              Round {round + 1} · {r.title}
            </span>
            <p>{r.setup}</p>
          </div>
          {mapOrder.map((k, i) => (
            <div key={k} className="rs-seat rs-enter" style={hv(k, { "--i": i + 1, gridArea: k })}>
              <div className="rs-seat-head">
                <Glyph active={[k]} size={14} />
                <span className="rs-seat-name">{houses[k].name}</span>
                <span className="rs-seat-driver">{houses[k].driver}</span>
              </div>
              <p>{withSpokenLines(r.seats[k])}</p>
            </div>
          ))}
        </div>
        <p className="rs-mononote rs-enter" style={{ "--i": 5 } as React.CSSProperties}>
          <span className="rs-label">{r.note[0]}</span>
          {withSpokenLines(r.note[1])}
        </p>
      </div>
    </div>
  );
}
