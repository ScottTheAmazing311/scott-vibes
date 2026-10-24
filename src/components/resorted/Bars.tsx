import { houses } from "@/lib/resorted/houses";
import type { Key } from "@/lib/resorted/model";

export type BarDatum = { k: Key; value: number; display?: string };

/** House-colored horizontal bars. Width is relative to the max value in the set. */
export default function Bars({ data, big = false }: { data: BarDatum[]; big?: boolean }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="rs-bars">
      {data.map((d, i) => (
        <div key={d.k} className="rs-bar" style={{ "--house": `var(--${d.k})` } as React.CSSProperties}>
          <span className="rs-bar-label">{houses[d.k].name}</span>
          <span className={`rs-bar-track${big && i === 0 ? " rs-bar-big" : ""}`}>
            <span className="rs-bar-fill" style={{ "--w": `${(d.value / max) * 100}%` } as React.CSSProperties} />
          </span>
          <span className="rs-bar-val">{d.display ?? d.value}</span>
        </div>
      ))}
    </div>
  );
}
