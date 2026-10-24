import { axis, diagonal, readingOrder, type Key } from "./model";

export type Answer = { first: Key | null; second: Key | null };
export type Scores = Record<Key, number>;

/** First choice is worth 3 points, second is worth 1. fc counts first choices. */
export function score(answers: Answer[]): { sc: Scores; fc: Scores } {
  const sc: Scores = { g: 0, r: 0, h: 0, s: 0 };
  const fc: Scores = { g: 0, r: 0, h: 0, s: 0 };
  for (const a of answers) {
    if (a.first) {
      sc[a.first] += 3;
      fc[a.first] += 1;
    }
    if (a.second) sc[a.second] += 1;
  }
  return { sc, fc };
}

/** Sort by score desc, then first-choice count desc, then reading order (g, r, h, s). */
export function rank(sc: Scores, fc: Scores): Key[] {
  return [...readingOrder].sort((a, b) => sc[b] - sc[a] || fc[b] - fc[a] || readingOrder.indexOf(a) - readingOrder.indexOf(b));
}

/** Integer percents that always sum to 100: rounding drift lands on the top-scoring key. */
export function percents(sc: Scores): Scores {
  const total = readingOrder.reduce((t, k) => t + sc[k], 0);
  if (total === 0) return { g: 25, r: 25, h: 25, s: 25 };
  const p: Scores = { g: 0, r: 0, h: 0, s: 0 };
  for (const k of readingOrder) p[k] = Math.round((sc[k] / total) * 100);
  const drift = 100 - readingOrder.reduce((t, k) => t + p[k], 0);
  const top = [...readingOrder].sort((a, b) => sc[b] - sc[a])[0];
  p[top] += drift;
  return p;
}

export function isNearTie(sc: Scores, ranked: Key[]): boolean {
  return sc[ranked[0]] - sc[ranked[1]] <= 3;
}

export type RelationKey = "heart" | "head" | "self" | "beyond" | "tension";

/** Which relation line applies to a dominant/secondary pair. */
export function relationKey(a: Key, b: Key): RelationKey {
  if (diagonal[a] === b) return "tension";
  if (axis[a].mind === axis[b].mind) return axis[a].mind;
  return axis[a].ref;
}

/** Position on the 2×2 map as CSS percentages. +x is the Head side, +y is the Beyond side (down). */
export function mapPosition(sc: Scores): { left: number; top: number } {
  const total = sc.g + sc.r + sc.h + sc.s;
  if (total === 0) return { left: 50, top: 50 };
  const x = (sc.r + sc.s - sc.g - sc.h) / total;
  const y = (sc.h + sc.r - sc.g - sc.s) / total;
  const clamp = (v: number) => Math.max(-0.86, Math.min(0.86, v * 1.7));
  return { left: 50 + clamp(x) * 50, top: 50 + clamp(y) * 50 };
}

export function readout(sc: Scores): { heart: number; head: number; self: number; beyond: number } {
  const total = sc.g + sc.r + sc.h + sc.s;
  if (total === 0) return { heart: 50, head: 50, self: 50, beyond: 50 };
  const heart = Math.round(((sc.g + sc.h) / total) * 100);
  const self = Math.round(((sc.g + sc.s) / total) * 100);
  return { heart, head: 100 - heart, self, beyond: 100 - self };
}

export function growthEdge(ranked: Key[]): Key {
  return diagonal[ranked[0]];
}

export function blindSpot(ranked: Key[]): Key {
  return ranked[3];
}
