/**
 * Re-Sorted core model: house keys, orders, axes.
 * Keys: g Gryffindor · r Ravenclaw · h Hufflepuff · s Slytherin.
 */

export type Key = "g" | "r" | "h" | "s";

export const readingOrder: Key[] = ["g", "r", "h", "s"];

/** 2×2 map order: Gryffindor top-left, Slytherin top-right, Hufflepuff bottom-left, Ravenclaw bottom-right. */
export const mapOrder: Key[] = ["g", "s", "h", "r"];

export const diagonal: Record<Key, Key> = { g: "r", r: "g", h: "s", s: "h" };

export type Mind = "heart" | "head";
export type Ref = "self" | "beyond";

export const axis: Record<Key, { mind: Mind; ref: Ref }> = {
  g: { mind: "heart", ref: "self" },
  s: { mind: "head", ref: "self" },
  h: { mind: "heart", ref: "beyond" },
  r: { mind: "head", ref: "beyond" },
};
