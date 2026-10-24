import { houses } from "@/lib/resorted/houses";
import type { Key } from "@/lib/resorted/model";
import Glyph from "./Glyph";

/** A two-column row: glyph + house name label beside text. Used anywhere all four houses are listed. */
export default function HouseRow({ k, children }: { k: Key; children: React.ReactNode }) {
  return (
    <div className="rs-hrow" style={{ "--house": `var(--${k})` } as React.CSSProperties}>
      <span className="rs-hrow-label">
        <Glyph active={[k]} size={13} />
        {houses[k].name}
      </span>
      <span className="rs-hrow-text">{children}</span>
    </div>
  );
}
