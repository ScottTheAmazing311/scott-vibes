// Turns a picture into a color-by-letter page, all in the browser.
// The picture is cut into mosaic pieces (SLIC superpixels), each piece snaps to a crayon, pieces too small
// to hold a letter fold into a neighbor, and the borders are traced once and smoothed into ink lines.

export interface Crayon {
  name: string;
  hex: string;
}

export const CRAYONS: Crayon[] = [
  { name: "Red", hex: "#d7263d" },
  { name: "Maroon", hex: "#8a1f30" },
  { name: "Pink", hex: "#f4a3bf" },
  { name: "Magenta", hex: "#c93a8e" },
  { name: "Orange", hex: "#f28a2e" },
  { name: "Peach", hex: "#f7c9a6" },
  { name: "Yellow", hex: "#f6d64a" },
  { name: "Tan", hex: "#cfae7f" },
  { name: "Brown", hex: "#7a4a28" },
  { name: "Light Green", hex: "#a5d46a" },
  { name: "Green", hex: "#2f9a4f" },
  { name: "Dark Green", hex: "#1f5a3a" },
  { name: "Light Blue", hex: "#8fcbe8" },
  { name: "Blue", hex: "#2a62c9" },
  { name: "Navy", hex: "#22306b" },
  { name: "Light Purple", hex: "#c2a5e0" },
  { name: "Purple", hex: "#6c3fa0" },
  { name: "Gray", hex: "#8e9096" },
  { name: "Black", hex: "#26262b" },
];

/** Crayon index meaning "leave it white": never gets a letter. */
export const WHITE = CRAYONS.length;

/** Working size of the long side, in pixels. */
const LONG = 640;
/** Pieces whose inscribed radius is below this can't fit a letter. */
const MIN_RADIUS = 6;
/** Photos are duller than crayons; push chroma before matching. */
const BOOST = 1.3;

export interface Picture {
  w: number;
  h: number;
  lab: Float32Array;
}

export interface Mark {
  x: number;
  y: number;
  size: number;
  crayon: number;
}

export interface Sheet {
  w: number;
  h: number;
  /** every border as one SVG path */
  lines: string;
  marks: Mark[];
  /** crayon indices that appear, in palette order (white excluded) */
  used: number[];
  hasWhite: boolean;
  /** the colored-in answer, as a PNG data URL */
  preview: string;
}

export interface Options {
  colors: number;
  /** piece size in working pixels */
  cell: number;
  /** join neighboring pieces of the same color into one shape */
  join: boolean;
}

/* ---------- color ---------- */

const LIN = new Float32Array(256).map((_, i) => {
  const c = i / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
});

function labOf(r: number, g: number, b: number): [number, number, number] {
  const R = LIN[r], G = LIN[g], B = LIN[b];
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f((0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047);
  const fy = f(0.2126 * R + 0.7152 * G + 0.0722 * B);
  const fz = f((0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

const rgbOf = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
const PALETTE = [...CRAYONS.map((c) => rgbOf(c.hex)), [255, 255, 255] as [number, number, number]];
const PALETTE_LAB = PALETTE.map(([r, g, b]) => labOf(r, g, b));

function nearest(L: number, a: number, b: number, allowed: number[]) {
  let best = WHITE, bd = Infinity;
  for (const k of allowed) {
    const p = PALETTE_LAB[k];
    const d = (L - p[0]) ** 2 + (a * BOOST - p[1]) ** 2 + (b * BOOST - p[2]) ** 2;
    if (d < bd) {
      bd = d;
      best = k;
    }
  }
  return best;
}

/* ---------- input ---------- */

/** Scales the picture to working size, converts to Lab and softens it a little. */
export function readPicture(src: CanvasImageSource, sw: number, sh: number): Picture {
  const s = LONG / Math.max(sw, sh);
  const w = Math.max(1, Math.round(sw * s));
  const h = Math.max(1, Math.round(sh * s));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(src, 0, 0, w, h);
  const px = ctx.getImageData(0, 0, w, h).data;
  let lab = new Float32Array(w * h * 3);
  for (let i = 0; i < w * h; i++) lab.set(labOf(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]), i * 3);
  for (let pass = 0; pass < 2; pass++) lab = blur(lab, w, h);
  return { w, h, lab };
}

function blur(src: Float32Array, w: number, h: number) {
  const out = new Float32Array(src.length);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      for (let ch = 0; ch < 3; ch++) {
        let sum = 0, n = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx, yy = y + dy;
            if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
            sum += src[(yy * w + xx) * 3 + ch];
            n++;
          }
        out[(y * w + x) * 3 + ch] = sum / n;
      }
  return out;
}

/* ---------- pieces ---------- */

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** SLIC superpixels. Seeds are jittered so flat areas get irregular, hand-cut looking pieces. */
function slic({ w, h, lab }: Picture, S: number, m = 12) {
  const rand = rng(7);
  const cx: number[] = [], cy: number[] = [], cl: number[] = [], ca: number[] = [], cb: number[] = [];
  for (let gy = S / 2; gy < h; gy += S)
    for (let gx = S / 2; gx < w; gx += S) {
      const x = Math.min(w - 1, Math.max(0, Math.round(gx + (rand() - 0.5) * S * 0.6)));
      const y = Math.min(h - 1, Math.max(0, Math.round(gy + (rand() - 0.5) * S * 0.6)));
      const i = (y * w + x) * 3;
      cx.push(x);
      cy.push(y);
      cl.push(lab[i]);
      ca.push(lab[i + 1]);
      cb.push(lab[i + 2]);
    }
  const K = cx.length;
  const labels = new Int32Array(w * h).fill(-1);
  const dist = new Float32Array(w * h);
  const R = Math.ceil(S * 1.4);
  const wgt = (m / S) ** 2;
  for (let iter = 0; iter < 10; iter++) {
    dist.fill(Infinity);
    for (let k = 0; k < K; k++) {
      const x0 = Math.max(0, Math.floor(cx[k] - R)), x1 = Math.min(w - 1, Math.ceil(cx[k] + R));
      const y0 = Math.max(0, Math.floor(cy[k] - R)), y1 = Math.min(h - 1, Math.ceil(cy[k] + R));
      for (let y = y0; y <= y1; y++)
        for (let x = x0; x <= x1; x++) {
          const i = y * w + x;
          const D =
            (lab[i * 3] - cl[k]) ** 2 + (lab[i * 3 + 1] - ca[k]) ** 2 + (lab[i * 3 + 2] - cb[k]) ** 2 + ((x - cx[k]) ** 2 + (y - cy[k]) ** 2) * wgt;
          if (D < dist[i]) {
            dist[i] = D;
            labels[i] = k;
          }
        }
    }
    const sum = new Float64Array(K * 6);
    for (let i = 0; i < w * h; i++) {
      const k = labels[i];
      if (k < 0) continue;
      sum[k * 6] += i % w;
      sum[k * 6 + 1] += (i / w) | 0;
      sum[k * 6 + 2] += lab[i * 3];
      sum[k * 6 + 3] += lab[i * 3 + 1];
      sum[k * 6 + 4] += lab[i * 3 + 2];
      sum[k * 6 + 5]++;
    }
    for (let k = 0; k < K; k++) {
      const n = sum[k * 6 + 5];
      if (!n) continue;
      cx[k] = sum[k * 6] / n;
      cy[k] = sum[k * 6 + 1] / n;
      cl[k] = sum[k * 6 + 2] / n;
      ca[k] = sum[k * 6 + 3] / n;
      cb[k] = sum[k * 6 + 4] / n;
    }
  }
  return labels;
}

/** Splits labels into connected pieces; fragments smaller than minSize join the piece before them. */
function connect(labels: Int32Array, w: number, h: number, minSize: number) {
  const N = w * h;
  const out = new Int32Array(N).fill(-1);
  const stack = new Int32Array(N);
  const comp = new Int32Array(N);
  let next = 0;
  for (let start = 0; start < N; start++) {
    if (out[start] >= 0) continue;
    const old = labels[start];
    const adj = start % w > 0 ? out[start - 1] : start >= w ? out[start - w] : -1;
    out[start] = next;
    let sp = 0, n = 0;
    stack[sp++] = start;
    while (sp) {
      const i = stack[--sp];
      comp[n++] = i;
      const x = i % w;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
        if (j < 0 || j >= N || out[j] >= 0 || labels[j] !== old) continue;
        out[j] = next;
        stack[sp++] = j;
      }
    }
    if ((n < minSize || old < 0) && adj >= 0) for (let t = 0; t < n; t++) out[comp[t]] = adj;
    else next++;
  }
  return { labels: out, count: next };
}

/** Calls fn(a, b) for every pair of side-by-side pixels in different pieces. */
function eachBorder(labels: Int32Array, w: number, h: number, fn: (a: number, b: number) => void) {
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x, a = labels[i];
      if (x < w - 1 && labels[i + 1] !== a) fn(a, labels[i + 1]);
      if (y < h - 1 && labels[i + w] !== a) fn(a, labels[i + w]);
    }
}

/** Applies a union-find forest: renumbers pieces and carries each root's crayon. */
function relabel(labels: Int32Array, parent: Int32Array, crayon: Int32Array) {
  const find = (a: number) => {
    while (parent[a] !== a) a = parent[a] = parent[parent[a]];
    return a;
  };
  const id = new Int32Array(parent.length).fill(-1);
  const next: number[] = [];
  for (let i = 0; i < labels.length; i++) {
    const r = find(labels[i]);
    if (id[r] < 0) {
      id[r] = next.length;
      next.push(crayon[r]);
    }
    labels[i] = id[r];
  }
  return { count: next.length, crayon: Int32Array.from(next) };
}

function joinSame(labels: Int32Array, w: number, h: number, count: number, crayon: Int32Array, all: boolean) {
  const parent = Int32Array.from({ length: count }, (_, i) => i);
  const find = (a: number) => {
    while (parent[a] !== a) a = parent[a] = parent[parent[a]];
    return a;
  };
  eachBorder(labels, w, h, (a, b) => {
    if (crayon[a] !== crayon[b] || (!all && crayon[a] !== WHITE)) return;
    const ra = find(a), rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  });
  return relabel(labels, parent, crayon);
}

/** Chamfer distance to the nearest border; the max per piece is where its letter fits best. */
function insets(labels: Int32Array, w: number, h: number, count: number) {
  const d = new Float32Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x, a = labels[i];
      const edge = x === 0 || y === 0 || x === w - 1 || y === h - 1 || labels[i - 1] !== a || labels[i + 1] !== a || labels[i - w] !== a || labels[i + w] !== a;
      d[i] = edge ? 1 : 1e9;
    }
  const D = Math.SQRT2;
  for (let y = 1; y < h; y++)
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      d[i] = Math.min(d[i], d[i - 1] + 1, d[i - w] + 1, d[i - w - 1] + D, d[i - w + 1] + D);
    }
  for (let y = h - 2; y >= 0; y--)
    for (let x = w - 2; x > 0; x--) {
      const i = y * w + x;
      d[i] = Math.min(d[i], d[i + 1] + 1, d[i + w] + 1, d[i + w + 1] + D, d[i + w - 1] + D);
    }
  const max = new Float32Array(count), at = new Int32Array(count), area = new Int32Array(count);
  for (let i = 0; i < w * h; i++) {
    const a = labels[i];
    area[a]++;
    if (d[i] > max[a]) {
      max[a] = d[i];
      at[a] = i;
    }
  }
  return { max, at, area };
}

/* ---------- lines ---------- */

/** Traces every border once, from junction to junction, so shared edges are a single smooth line. */
function trace(labels: Int32Array, w: number, h: number) {
  const W1 = w + 1;
  // Outside the picture counts as the piece it touches: the frame is drawn separately as a crisp rectangle.
  const lab = (x: number, y: number) => labels[Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))];
  const hE = new Uint8Array(w * (h + 1));
  const vE = new Uint8Array(W1 * h);
  const deg = new Uint8Array(W1 * (h + 1));
  for (let y = 0; y <= h; y++)
    for (let x = 0; x < w; x++)
      if (lab(x, y - 1) !== lab(x, y)) {
        hE[y * w + x] = 1;
        deg[y * W1 + x]++;
        deg[y * W1 + x + 1]++;
      }
  for (let y = 0; y < h; y++)
    for (let x = 0; x <= w; x++)
      if (lab(x - 1, y) !== lab(x, y)) {
        vE[y * W1 + x] = 1;
        deg[y * W1 + x]++;
        deg[(y + 1) * W1 + x]++;
      }

  const take = (n: number) => {
    const x = n % W1, y = (n / W1) | 0;
    if (x < w && hE[y * w + x] === 1) return (hE[y * w + x] = 2), n + 1;
    if (x > 0 && hE[y * w + x - 1] === 1) return (hE[y * w + x - 1] = 2), n - 1;
    if (y < h && vE[y * W1 + x] === 1) return (vE[y * W1 + x] = 2), n + W1;
    if (y > 0 && vE[(y - 1) * W1 + x] === 1) return (vE[(y - 1) * W1 + x] = 2), n - W1;
    return -1;
  };
  const walk = (start: number) => {
    const pts = [start % W1, (start / W1) | 0];
    let n = start;
    for (;;) {
      n = take(n);
      if (n < 0) break;
      pts.push(n % W1, (n / W1) | 0);
      if (deg[n] !== 2) break;
    }
    return pts;
  };

  let d = "";
  const emit = (pts: number[]) => {
    if (pts.length >= 4) d += smooth(pts);
  };
  for (let n = 0; n < deg.length; n++) if (deg[n] && deg[n] !== 2) for (let k = 0; k < deg[n]; k++) emit(walk(n));
  for (let n = 0; n < deg.length; n++) if (deg[n] === 2) emit(walk(n));
  return d;
}

/** Staircase to curve: edge midpoints, then Douglas-Peucker, then two rounds of Chaikin. Ends stay put. */
function smooth(pts: number[]) {
  const n = pts.length / 2;
  const closed = pts[0] === pts[pts.length - 2] && pts[1] === pts[pts.length - 1];
  let p: number[] = closed ? [] : [pts[0], pts[1]];
  for (let i = 0; i < n - 1; i++) p.push((pts[i * 2] + pts[i * 2 + 2]) / 2, (pts[i * 2 + 1] + pts[i * 2 + 3]) / 2);
  if (closed) p.push(p[0], p[1]);
  else p.push(pts[pts.length - 2], pts[pts.length - 1]);
  p = simplify(p, 0.7);
  for (let round = 0; round < 2; round++) {
    const q = [p[0], p[1]];
    for (let i = 0; i < p.length / 2 - 1; i++) {
      const ax = p[i * 2], ay = p[i * 2 + 1], bx = p[i * 2 + 2], by = p[i * 2 + 3];
      q.push(0.75 * ax + 0.25 * bx, 0.75 * ay + 0.25 * by, 0.25 * ax + 0.75 * bx, 0.25 * ay + 0.75 * by);
    }
    q.push(p[p.length - 2], p[p.length - 1]);
    p = q;
  }
  let s = `M${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  for (let i = 2; i < p.length; i += 2) s += `L${p[i].toFixed(1)} ${p[i + 1].toFixed(1)}`;
  return s;
}

function simplify(p: number[], eps: number) {
  const n = p.length / 2;
  if (n < 3) return p;
  const keep = new Uint8Array(n);
  keep[0] = keep[n - 1] = 1;
  const stack = [0, n - 1];
  while (stack.length) {
    const b = stack.pop()!, a = stack.pop()!;
    const ax = p[a * 2], ay = p[a * 2 + 1], dx = p[b * 2] - ax, dy = p[b * 2 + 1] - ay;
    const len = Math.hypot(dx, dy) || 1;
    let far = -1, fd = eps;
    for (let i = a + 1; i < b; i++) {
      const dist = len > 1e-6 && (dx || dy) ? Math.abs(dy * (p[i * 2] - ax) - dx * (p[i * 2 + 1] - ay)) / len : Math.hypot(p[i * 2] - ax, p[i * 2 + 1] - ay);
      if (dist > fd) {
        fd = dist;
        far = i;
      }
    }
    if (far > 0) {
      keep[far] = 1;
      stack.push(a, far, far, b);
    }
  }
  const out: number[] = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(p[i * 2], p[i * 2 + 1]);
  return out;
}

/* ---------- the sheet ---------- */

export function makeSheet(pic: Picture, { colors, cell, join }: Options): Sheet {
  const { w, h, lab } = pic;
  const cut = connect(slic(pic, cell), w, h, Math.floor((cell * cell) / 4));
  const labels = cut.labels;
  let count = cut.count;

  // Each piece's average color, matched to the nearest crayon.
  const mean = new Float64Array(count * 4);
  for (let i = 0; i < w * h; i++) {
    const k = labels[i];
    mean[k * 4] += lab[i * 3];
    mean[k * 4 + 1] += lab[i * 3 + 1];
    mean[k * 4 + 2] += lab[i * 3 + 2];
    mean[k * 4 + 3]++;
  }
  const avg = (k: number) => [mean[k * 4] / mean[k * 4 + 3], mean[k * 4 + 1] / mean[k * 4 + 3], mean[k * 4 + 2] / mean[k * 4 + 3]] as const;
  let allowed = PALETTE.map((_, i) => i);
  let crayon = Int32Array.from({ length: count }, (_, k) => nearest(...avg(k), allowed));

  // Too many crayons: drop the one covering the least area and rematch its pieces, until we're at the limit.
  for (;;) {
    const area = new Float64Array(PALETTE.length);
    for (let k = 0; k < count; k++) area[crayon[k]] += mean[k * 4 + 3];
    const inUse = allowed.filter((c) => c !== WHITE && area[c] > 0);
    if (inUse.length <= colors) break;
    const drop = inUse.reduce((a, b) => (area[b] < area[a] ? b : a));
    allowed = [...inUse.filter((c) => c !== drop), WHITE];
    for (let k = 0; k < count; k++) if (crayon[k] === drop) crayon[k] = nearest(...avg(k), allowed);
  }

  ({ count, crayon } = joinSame(labels, w, h, count, crayon, join));

  // Fold pieces too small for a letter into the neighbor they share the most border with.
  for (let pass = 0; pass < 5; pass++) {
    const { max, area } = insets(labels, w, h, count);
    const small = Array.from({ length: count }, (_, k) => k).filter((k) => max[k] < MIN_RADIUS);
    if (!small.length) break;
    const isSmall = new Uint8Array(count);
    small.forEach((k) => (isSmall[k] = 1));
    const shared = new Map<number, Map<number, number>>();
    const add = (a: number, b: number) => {
      if (!isSmall[a]) return;
      const m = shared.get(a) ?? new Map<number, number>();
      m.set(b, (m.get(b) ?? 0) + (isSmall[b] ? 0.5 : 1) * (crayon[a] === crayon[b] ? 2 : 1));
      shared.set(a, m);
    };
    eachBorder(labels, w, h, (a, b) => (add(a, b), add(b, a)));
    const parent = Int32Array.from({ length: count }, (_, i) => i);
    const find = (a: number) => {
      while (parent[a] !== a) a = parent[a] = parent[parent[a]];
      return a;
    };
    small.sort((a, b) => area[a] - area[b]);
    for (const a of small) {
      let best = -1, bs = 0;
      for (const [b, s] of shared.get(a) ?? new Map<number, number>()) {
        if (s > bs) {
          bs = s;
          best = b;
        }
      }
      if (best < 0) continue;
      const ra = find(a), rb = find(best);
      if (ra !== rb) parent[ra] = rb;
    }
    ({ count, crayon } = relabel(labels, parent, crayon));
    ({ count, crayon } = joinSame(labels, w, h, count, crayon, join));
  }

  const { max, at } = insets(labels, w, h, count);
  const marks: Mark[] = [];
  const seen = new Set<number>();
  let hasWhite = false;
  for (let k = 0; k < count; k++) {
    if (crayon[k] === WHITE) {
      hasWhite = true;
      continue;
    }
    seen.add(crayon[k]);
    marks.push({ x: (at[k] % w) + 0.5, y: Math.floor(at[k] / w) + 0.5, size: Math.min(15, Math.max(8, max[k] * 1.25)), crayon: crayon[k] });
  }

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  for (let i = 0; i < w * h; i++) {
    const [r, g, b] = PALETTE[crayon[labels[i]]];
    img.data.set([r, g, b, 255], i * 4);
  }
  ctx.putImageData(img, 0, 0);

  return { w, h, lines: trace(labels, w, h), marks, used: [...seen].sort((a, b) => a - b), hasWhite, preview: c.toDataURL("image/png") };
}
