"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive ASCII wave field. Three interfering sine waves drift slowly;
 * the cursor becomes a fourth wave source that ripples the glyphs, and a
 * press sends out a stronger pulse. Static under prefers-reduced-motion,
 * paused off-screen, throttled to ~30fps.
 */
const RAMP = " .·:;=+*#%@";
const CELL_W = 12;
const CELL_H = 14;
const INK = "#171b19";
const ACCENT = "#55771b"; // acid, darkened for glyph contrast on ivory

export default function AsciiField({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let t = Math.random() * 100;
    let raf = 0;
    let last = 0;
    let visible = false;
    const cursor = { x: -9999, y: -9999, tx: -9999, ty: -9999, power: 0, target: 0, pulse: 0 };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.font = "12px Menlo, Consolas, monospace";
      ctx.textBaseline = "top";
      const cols = Math.ceil(w / CELL_W);
      const rows = Math.ceil(h / CELL_H);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * CELL_W;
          const py = r * CELL_H;
          let v =
            Math.sin(c * 0.32 + t * 0.9) +
            Math.sin(r * 0.24 - t * 0.7) +
            Math.sin((c + r) * 0.17 + t * 0.5);
          const dx = px - cursor.x;
          const dy = py - cursor.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const strength = cursor.power + cursor.pulse;
          let near = 0;
          if (strength > 0.01 && dist < 320) {
            near = Math.exp(-dist / 110) * strength;
            v += Math.cos(dist * 0.055 - t * 3.2) * near * 2.6;
          }
          const n = Math.min(1, Math.max(0, (v + 3.6) / 7.2));
          const idx = Math.min(RAMP.length - 1, Math.floor(n * RAMP.length));
          const ch = RAMP[idx];
          if (ch === " ") continue;
          ctx.globalAlpha = Math.min(1, 0.1 + n * 0.5 + near * 0.5);
          ctx.fillStyle = near > 0.22 ? ACCENT : INK;
          ctx.fillText(ch, px, py);
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 33) return; // ~30fps
      const dt = Math.min(0.1, (now - last) / 1000 || 0.033);
      last = now;
      t += dt * 1.1;
      cursor.x += (cursor.tx - cursor.x) * 0.14;
      cursor.y += (cursor.ty - cursor.y) * 0.14;
      cursor.power += (cursor.target - cursor.power) * 0.08;
      cursor.pulse *= 0.94;
      draw();
    };

    const start = () => {
      if (!raf && visible && !reduce) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      draw();
    };

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      cursor.tx = e.clientX - rect.left;
      cursor.ty = e.clientY - rect.top;
      if (cursor.power < 0.02) {
        cursor.x = cursor.tx;
        cursor.y = cursor.ty;
      }
      cursor.target = 1;
    };
    const onLeave = () => {
      cursor.target = 0;
    };
    const onDown = (e: PointerEvent) => {
      onMove(e);
      cursor.pulse = 2.2;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(wrap);

    if (!reduce) {
      wrap.addEventListener("pointermove", onMove, { passive: true });
      wrap.addEventListener("pointerleave", onLeave, { passive: true });
      wrap.addEventListener("pointerdown", onDown, { passive: true });
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative touch-none select-none ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
