import { mapOrder, type Key } from "@/lib/resorted/model";

/**
 * A tiny 2×2 of squares in map order (g s h r). Active houses fill with
 * their color, the rest stay faint. Encodes which houses something is about.
 */
export default function Glyph({ active, size = 14 }: { active: Key[] | "all"; size?: number }) {
  const gap = size >= 20 ? 2.5 : 2;
  const cell = (size - gap) / 2;
  const rx = size >= 20 ? 2 : 1.2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" style={{ flexShrink: 0 }}>
      {mapOrder.map((k, i) => (
        <rect
          key={k}
          x={(i % 2) * (cell + gap)}
          y={Math.floor(i / 2) * (cell + gap)}
          width={cell}
          height={cell}
          rx={rx}
          fill={active === "all" || active.includes(k) ? `var(--${k})` : "var(--faint)"}
        />
      ))}
    </svg>
  );
}
