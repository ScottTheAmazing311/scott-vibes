import type { Key } from "@/lib/resorted/model";

export default function Chip({ k, children }: { k: Key; children: React.ReactNode }) {
  return (
    <span className="rs-chip" style={{ "--house": `var(--${k})` } as React.CSSProperties}>
      {children}
    </span>
  );
}
