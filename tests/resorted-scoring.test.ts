/**
 * Unit tests for the Re-Sorted quiz scoring (src/lib/resorted/scoring.ts).
 * Run with: npx tsx tests/resorted-scoring.test.ts
 */
import assert from "node:assert/strict";
import {
  score,
  rank,
  percents,
  isNearTie,
  relationKey,
  mapPosition,
  readout,
  growthEdge,
  blindSpot,
  type Answer,
} from "../src/lib/resorted/scoring";
import type { Key } from "../src/lib/resorted/model";

const a = (first: Key | null, second: Key | null = null): Answer => ({ first, second });

// score: firsts are 3, seconds are 1, fc counts firsts
{
  const { sc, fc } = score([a("g", "h"), a("g"), a("r", "g")]);
  assert.deepEqual(sc, { g: 7, r: 3, h: 1, s: 0 });
  assert.deepEqual(fc, { g: 2, r: 1, h: 0, s: 0 });
}

// skipped second choices score nothing extra
{
  const { sc } = score(Array.from({ length: 28 }, () => a("s")));
  assert.deepEqual(sc, { g: 0, r: 0, h: 0, s: 84 });
}

// rank: score desc, then first-choice count, then reading order g r h s
{
  const ranked = rank({ g: 10, r: 10, h: 10, s: 10 }, { g: 1, r: 2, h: 1, s: 1 });
  assert.deepEqual(ranked, ["r", "g", "h", "s"]); // fc breaks the four-way tie, reading order the rest
}
{
  const ranked = rank({ g: 5, r: 5, h: 5, s: 5 }, { g: 0, r: 0, h: 0, s: 0 });
  assert.deepEqual(ranked, ["g", "r", "h", "s"]); // full tie falls back to reading order
}

// percents: integers that sum to 100, drift goes to the top key
{
  const p = percents({ g: 1, r: 1, h: 1, s: 0 }); // thirds
  assert.equal(p.g + p.r + p.h + p.s, 100);
  assert.equal(p.g, 34); // 33 + 1 drift to top-scoring (g wins the sort tie)
}
{
  assert.deepEqual(percents({ g: 0, r: 0, h: 0, s: 0 }), { g: 25, r: 25, h: 25, s: 25 });
}

// near tie: gap of 3 or less
{
  assert.equal(isNearTie({ g: 40, r: 37, h: 10, s: 10 }, ["g", "r", "h", "s"]), true);
  assert.equal(isNearTie({ g: 40, r: 36, h: 10, s: 10 }, ["g", "r", "h", "s"]), false);
}

// relation: tension on the diagonal, else shared mind, else shared ref
{
  assert.equal(relationKey("g", "r"), "tension");
  assert.equal(relationKey("h", "s"), "tension");
  assert.equal(relationKey("g", "h"), "heart");
  assert.equal(relationKey("r", "s"), "head");
  assert.equal(relationKey("g", "s"), "self");
  assert.equal(relationKey("r", "h"), "beyond");
}

// map position: all-one-house run pins to a clamped corner
{
  const { sc } = score(Array.from({ length: 28 }, () => a("g")));
  const pos = mapPosition(sc);
  assert.equal(pos.left, 50 + -0.86 * 50); // full Heart
  assert.equal(pos.top, 50 + -0.86 * 50); // full Self
}
{
  assert.deepEqual(mapPosition({ g: 1, r: 1, h: 1, s: 1 }), { left: 50, top: 50 });
}

// readout halves always sum to 100
{
  const r = readout({ g: 38, r: 14, h: 29, s: 19 });
  assert.equal(r.heart + r.head, 100);
  assert.equal(r.self + r.beyond, 100);
  assert.equal(r.heart, 67);
}

// growth edge is the dominant's diagonal; blind spot is the lowest
{
  assert.equal(growthEdge(["g", "h", "s", "r"]), "r");
  assert.equal(blindSpot(["g", "h", "s", "r"]), "r");
}

console.log("resorted scoring: all tests passed");
