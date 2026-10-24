"use client";

import { useState } from "react";
import Reveal from "./Reveal";

type Focus = "rivals" | "background" | "diagonals";

const NODES = {
  g: { x: 110, y: 96 },
  s: { x: 450, y: 96 },
  h: { x: 110, y: 364 },
  r: { x: 450, y: 364 },
} as const;

type NodeKey = keyof typeof NODES;

const EDGES: { cls: string; a: NodeKey; b: NodeKey; diag?: boolean }[] = [
  { cls: "sq-edge e-top", a: "g", b: "s" },
  { cls: "sq-edge e-bottom", a: "h", b: "r" },
  { cls: "sq-edge e-left", a: "g", b: "h" },
  { cls: "sq-edge e-right", a: "s", b: "r" },
  { cls: "sq-diag", a: "g", b: "r", diag: true },
  { cls: "sq-diag", a: "s", b: "h", diag: true },
];

const NAMES: Record<NodeKey, string> = { g: "Gryffindor", s: "Slytherin", h: "Hufflepuff", r: "Ravenclaw" };

/** Shorten a segment by `pad` at each end so edges stop short of the node halos. */
function trim(a: NodeKey, b: NodeKey, pad: number) {
  const A = NODES[a];
  const B = NODES[b];
  const len = Math.hypot(B.x - A.x, B.y - A.y);
  const ux = (B.x - A.x) / len;
  const uy = (B.y - A.y) / len;
  return { x1: A.x + ux * pad, y1: A.y + uy * pad, x2: B.x - ux * pad, y2: B.y - uy * pad };
}

/**
 * The relationship square. Edges draw themselves in on scroll; hovering one
 * of the explanations beside it lights the edge it's about.
 */
export default function RelationshipSquare({ points }: { points: { focus: Focus; title: string; text: string }[] }) {
  const [focus, setFocus] = useState<Focus | null>(null);

  return (
    <div className="rs-square-wrap">
      <Reveal>
        <svg
          className="rs-square"
          viewBox="0 0 560 460"
          role="img"
          data-focus={focus ?? undefined}
          aria-label="Relationship square. Gryffindor and Slytherin share Self and are rivals. Gryffindor and Hufflepuff share Heart. Slytherin and Ravenclaw share Head. Hufflepuff and Ravenclaw share Beyond self. The diagonals, Gryffindor to Ravenclaw and Slytherin to Hufflepuff, are opposite on both axes."
        >
          <defs>
            {EDGES.map(({ a, b }) => {
              const t = trim(a, b, 22);
              return (
                <linearGradient key={`${a}${b}`} id={`sq-${a}${b}`} gradientUnits="userSpaceOnUse" x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}>
                  <stop offset="0" style={{ stopColor: `var(--${a})` }} />
                  <stop offset="1" style={{ stopColor: `var(--${b})` }} />
                </linearGradient>
              );
            })}
          </defs>

          {EDGES.map(({ cls, a, b, diag }) => {
            const t = trim(a, b, diag ? 30 : 22);
            return <line key={`${a}${b}`} className={cls} {...t} stroke={`url(#sq-${a}${b})`} pathLength={diag ? undefined : 1} />;
          })}

          <g className="sq-labels l-top">
            <text className="sq-lab" x="280" y="80" textAnchor="middle">
              RIVALS
            </text>
            <text className="sq-sub" x="280" y="120" textAnchor="middle">
              share Self
            </text>
          </g>
          <g className="sq-labels l-bottom">
            <text className="sq-lab" x="280" y="348" textAnchor="middle">
              STEADY ALLIES
            </text>
            <text className="sq-sub" x="280" y="388" textAnchor="middle">
              share Beyond self
            </text>
          </g>
          <g className="sq-labels">
            <text className="sq-lab" x="90" y="230" textAnchor="middle" transform="rotate(-90 90 230)">
              HEART ALLIES
            </text>
            <text className="sq-sub" x="132" y="230" textAnchor="middle" transform="rotate(-90 132 230)">
              share Heart
            </text>
            <text className="sq-lab" x="470" y="230" textAnchor="middle" transform="rotate(90 470 230)">
              HEAD ALLIES
            </text>
            <text className="sq-sub" x="428" y="230" textAnchor="middle" transform="rotate(90 428 230)">
              share Head
            </text>
          </g>
          <g className="sq-labels l-center">
            <rect className="sq-centerbox" x="200" y="208" width="160" height="44" rx="22" />
            <text className="sq-lab" x="280" y="227" textAnchor="middle">
              DIAGONALS
            </text>
            <text className="sq-sub" x="280" y="243" textAnchor="middle">
              opposite on both axes
            </text>
          </g>

          {(Object.keys(NODES) as NodeKey[]).map((k) => {
            const { x, y } = NODES[k];
            const top = y < 200;
            return (
              <g key={k}>
                <circle cx={x} cy={y} r="16" fill="none" style={{ stroke: `var(--${k})`, strokeOpacity: 0.35 }} />
                <circle className="sq-node" cx={x} cy={y} r="6" style={{ fill: `var(--${k})`, filter: `drop-shadow(0 0 8px var(--${k}))` }} />
                <text className="sq-name" x={x} y={top ? y - 34 : y + 54} textAnchor="middle" style={{ fill: `var(--${k})` }}>
                  {NAMES[k]}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="rs-square-caption">
          Neighbors share one axis and get along. The dashed diagonals share nothing, which is where the friction lives.
        </p>
      </Reveal>
      <div className="rs-points" data-focus={focus ?? undefined}>
        {points.map((p, i) => (
          <Reveal
            key={p.focus}
            delay={i * 90}
            className="rs-point"
            data-on={focus === p.focus ? "" : undefined}
            tabIndex={0}
            onMouseEnter={() => setFocus(p.focus)}
            onMouseLeave={() => setFocus(null)}
            onFocus={() => setFocus(p.focus)}
            onBlur={() => setFocus(null)}
          >
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
