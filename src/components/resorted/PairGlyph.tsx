import { mapOrder, type Key } from "@/lib/resorted/model";

const POS: Record<Key, [number, number]> = { g: [10, 10], s: [62, 10], h: [10, 62], r: [62, 62] };

/** Four map-order dots with the edge between two houses drawn in their colors. Dashed when diagonal. */
export function PairGlyph({ a, b, diagonal = false, size = 72 }: { a: Key; b: Key; diagonal?: boolean; size?: number }) {
  const id = `pg-${a}${b}`;
  const [x1, y1] = POS[a];
  const [x2, y2] = POS[b];
  return (
    <svg className="rs-pair-glyph" width={size} height={size} viewBox="0 0 72 72" aria-hidden="true">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0" style={{ stopColor: `var(--${a})` }} />
          <stop offset="1" style={{ stopColor: `var(--${b})` }} />
        </linearGradient>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#${id})`} strokeWidth="1.5" strokeDasharray={diagonal ? "3 4" : undefined} />
      {mapOrder.map((k) => {
        const on = k === a || k === b;
        return (
          <circle
            key={k}
            cx={POS[k][0]}
            cy={POS[k][1]}
            r={on ? 5 : 3}
            style={{ fill: on ? `var(--${k})` : "var(--faint)", filter: on ? `drop-shadow(0 0 5px var(--${k}))` : undefined }}
          />
        );
      })}
    </svg>
  );
}

/** Two house dots joined by a short gradient line, for "A vs. B" rows. */
export function VsDots({ a, b }: { a: Key; b: Key }) {
  const id = `vs-${a}${b}`;
  return (
    <svg width="48" height="12" viewBox="0 0 48 12" aria-hidden="true" style={{ flex: "none", overflow: "visible" }}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="6" y1="6" x2="42" y2="6">
          <stop offset="0" style={{ stopColor: `var(--${a})` }} />
          <stop offset="1" style={{ stopColor: `var(--${b})` }} />
        </linearGradient>
      </defs>
      <line x1="6" y1="6" x2="42" y2="6" stroke={`url(#${id})`} strokeWidth="1.25" />
      <circle cx="6" cy="6" r="4" style={{ fill: `var(--${a})`, filter: `drop-shadow(0 0 4px var(--${a}))` }} />
      <circle cx="42" cy="6" r="4" style={{ fill: `var(--${b})`, filter: `drop-shadow(0 0 4px var(--${b}))` }} />
    </svg>
  );
}
