import type { Key } from "@/lib/resorted/model";

/** Inline style that themes an element to one house via --house (plus any extra custom properties). */
export function hv(k: Key, extra: Record<string, string | number> = {}): React.CSSProperties {
  return { "--house": `var(--${k})`, ...extra } as React.CSSProperties;
}

export function vars(values: Record<string, string | number>): React.CSSProperties {
  return values as React.CSSProperties;
}
