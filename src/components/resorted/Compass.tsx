"use client";

import { useEffect, useRef } from "react";
import { houses } from "@/lib/resorted/houses";
import { mapOrder, type Key } from "@/lib/resorted/model";
import { hv } from "./hv";

const RGB: Record<Key, string> = { g: "240,105,79", r: "134,165,255", h: "236,191,87", s: "85,207,151" };
const HEX: Record<Key, string> = { g: "#f0694f", r: "#86a5ff", h: "#ecbf57", s: "#55cf97" };
const CENTER: Record<Key, [number, number]> = { g: [0.25, 0.25], s: [0.75, 0.25], h: [0.25, 0.75], r: [0.75, 0.75] };

const quadrantAt = (x: number, y: number): Key => (x < 0.5 ? (y < 0.5 ? "g" : "h") : y < 0.5 ? "s" : "r");
const clamp = (v: number) => Math.max(0.05, Math.min(0.95, v));
const holdFor = (ms: number) => performance.now() + ms;

type Mote = { x: number; y: number; vx: number; vy: number; r: number; ph: number };

/**
 * The decision compass. A point of light moves over the 2×2 map and wakes
 * whichever house it's nearest, along with the dust around it.
 * hero: follows the pointer, drifts on its own when left alone.
 * result: travels from the center to the quiz-taker's map position and stays.
 */
export default function Compass({ mode = "hero", target }: { mode?: "hero" | "result"; target?: { left: number; top: number } }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sqRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const input = useRef({ tx: 0.5, ty: 0.5, heldUntil: 0 });

  const goalLeft = target?.left;
  const goalTop = target?.top;

  useEffect(() => {
    const wrap = wrapRef.current;
    const sq = sqRef.current;
    const canvas = canvasRef.current;
    const orb = orbRef.current;
    const bloom = bloomRef.current;
    const needle = needleRef.current;
    if (!wrap || !sq || !canvas || !orb || !bloom || !needle) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const goal = goalLeft != null && goalTop != null ? ([goalLeft / 100, goalTop / 100] as const) : null;
    let w = 0;
    let h = 0;
    let cx = goal ? 0.5 : 0.25;
    let cy = goal ? 0.5 : 0.25;
    if (reduce && goal) [cx, cy] = goal;
    let active: Key | null = null;
    const t0 = performance.now();

    const motes: Mote[] = Array.from({ length: 84 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0005,
      vy: (Math.random() - 0.5) * 0.0005 - 0.00012,
      r: 0.5 + Math.random() * 1.5,
      ph: Math.random() * Math.PI * 2,
    }));

    const place = () => {
      const px = cx * w;
      const py = cy * h;
      const pos = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
      orb.style.transform = pos;
      bloom.style.transform = pos;
      const dx = px - w / 2;
      const dy = py - h / 2;
      needle.style.width = `${Math.hypot(dx, dy)}px`;
      needle.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
      const k = quadrantAt(cx, cy);
      if (k !== active) {
        active = k;
        wrap.dataset.active = k;
        wrap.style.setProperty("--glow", HEX[k]);
      }
      wrap.classList.add("is-live");
    };

    const paint = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        if (!reduce) {
          m.x += m.vx;
          m.y += m.vy;
          if (m.x < 0) m.x += 1;
          if (m.x > 1) m.x -= 1;
          if (m.y < 0) m.y += 1;
          if (m.y > 1) m.y -= 1;
        }
        const near = Math.max(0, 1 - Math.hypot(m.x - cx, m.y - cy) / 0.42);
        const flicker = reduce ? 0.85 : 0.65 + 0.35 * Math.sin(now * 0.0018 + m.ph);
        const alpha = (0.08 + 0.64 * near * near) * flicker;
        ctx.fillStyle = `rgba(${RGB[quadrantAt(m.x, m.y)]},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(m.x * w, m.y * h, m.r * (1 + near), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      const rect = sq.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) {
        place();
        paint(performance.now());
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(sq);

    if (reduce) return () => ro.disconnect();

    let raf = 0;
    let running = false;
    const frame = (now: number) => {
      let tx: number;
      let ty: number;
      if (goal) {
        [tx, ty] = goal;
      } else if (now < input.current.heldUntil) {
        tx = input.current.tx;
        ty = input.current.ty;
      } else {
        const t = now - t0;
        tx = 0.5 + 0.31 * Math.sin(t * 0.00029 + 2.4);
        ty = 0.5 + 0.3 * Math.sin(t * 0.00043 + 0.9);
      }
      const ease = goal ? 0.028 : 0.065;
      cx += (tx - cx) * ease;
      cy += (ty - cy) * ease;
      place();
      paint(now);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(wrap);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
    };
  }, [goalLeft, goalTop]);

  function onPointerMove(e: React.PointerEvent) {
    if (mode !== "hero") return;
    const sq = sqRef.current;
    if (!sq) return;
    const r = sq.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    input.current = { tx: clamp(x), ty: clamp(y), heldUntil: holdFor(3500) };
  }

  function hold(k: Key) {
    input.current = { tx: CENTER[k][0], ty: CENTER[k][1], heldUntil: holdFor(6000) };
  }

  return (
    <div ref={wrapRef} className={`rs-compass rs-compass-${mode}`} data-active="g" onPointerMove={onPointerMove}>
      <div className="rs-cl-cols">
        <span className="rs-cl">
          <b>Heart</b>
        </span>
        <span className="rs-cl">
          <b>Head</b>
        </span>
      </div>
      <div className="rs-cl-rows">
        <span className="rs-cl">
          <b>Self</b>
        </span>
        <span className="rs-cl">
          <b>Beyond self</b>
        </span>
      </div>
      <div ref={sqRef} className="rs-sq">
        <canvas ref={canvasRef} aria-hidden="true" />
        <span className="rs-ring rs-ring-1" aria-hidden="true" />
        <span className="rs-ring rs-ring-2" aria-hidden="true" />
        <span className="rs-ax rs-ax-h" aria-hidden="true" />
        <span className="rs-ax rs-ax-v" aria-hidden="true" />
        <div ref={bloomRef} className="rs-bloom" aria-hidden="true" />
        <div ref={needleRef} className="rs-needle" aria-hidden="true" />
        {mapOrder.map((k) => {
          const house = houses[k];
          const inner = (
            <>
              <span className="rs-quad-name">{house.name}</span>
              <span className="rs-quad-driver">{house.driver}</span>
            </>
          );
          return mode === "hero" ? (
            <a key={k} href={`#${house.id}`} className={`rs-quad rs-quad-${k}`} style={hv(k)} onFocus={() => hold(k)}>
              {inner}
            </a>
          ) : (
            <div key={k} className={`rs-quad rs-quad-${k}`} style={hv(k)}>
              {inner}
            </div>
          );
        })}
        <div ref={orbRef} className="rs-orb" aria-hidden="true" />
      </div>
    </div>
  );
}
