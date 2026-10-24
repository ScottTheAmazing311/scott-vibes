import { houses } from "@/lib/resorted/houses";
import { diagonal, readingOrder } from "@/lib/resorted/model";

const rows: { label: string; value: (k: (typeof readingOrder)[number]) => string }[] = [
  { label: "Driver", value: (k) => houses[k].driver },
  { label: "Asks first", value: (k) => houses[k].firstQuestion },
  { label: "Loyal to", value: (k) => houses[k].loyal.replace(/^Loyal to /, "") },
  { label: "Map position", value: (k) => houses[k].axes },
  { label: "At its best", value: (k) => houses[k].sig.best },
  { label: "Signature flaw", value: (k) => houses[k].sig.flaw },
  { label: "Hurts others by", value: (k) => houses[k].sig.hurts },
  { label: "Under stress", value: (k) => houses[k].sig.stress },
  { label: "Growth edge", value: (k) => `Borrow from ${houses[diagonal[k]].name}` },
  { label: "At Monopoly", value: (k) => houses[k].sig.mono },
];

export default function GlanceTable() {
  return (
    <div className="rs-scroll">
      <table className="rs-glance">
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Attribute</span>
            </th>
            {readingOrder.map((k) => (
              <th key={k} scope="col" style={{ "--house": `var(--${k})` } as React.CSSProperties}>
                {houses[k].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {readingOrder.map((k) => (
                <td key={k}>{row.value(k)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
