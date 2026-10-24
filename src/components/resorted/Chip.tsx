import type { Key } from "@/lib/resorted/model";
import { hv } from "./hv";

export default function Chip({ k, children }: { k: Key; children: React.ReactNode }) {
  return (
    <span className="rs-chip" style={hv(k)}>
      {children}
    </span>
  );
}
