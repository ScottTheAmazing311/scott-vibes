import { houses } from "@/lib/resorted/houses";
import type { Key } from "@/lib/resorted/model";
import { hv } from "./hv";

export type BarDatum = { k: Key; value: number; display?: string };

/**
 * House-colored bars, widths relative to the largest value. Inside a Reveal
 * they grow on scroll; with `animate` they grow on mount (used by the result).
 */
export default function Bars({ data, animate = false }: { data: BarDatum[]; animate?: boolean }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={`rs-bars${animate ? " rs-bars-animate" : ""}`}>
      {data.map((d, i) => (
        <div key={d.k} className={`rs-bar${i === 0 ? " rs-bar-first" : ""}`} style={hv(d.k, { "--i": i })}>
          <span className="rs-bar-name">{houses[d.k].name}</span>
          <span className="rs-bar-track">
            <span className="rs-bar-fill" style={{ "--w": `${(d.value / max) * 100}%` } as React.CSSProperties} />
          </span>
          <span className="rs-bar-val">{d.display ?? d.value}</span>
        </div>
      ))}
    </div>
  );
}
