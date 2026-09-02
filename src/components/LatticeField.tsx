"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive lattice background (from the bs-magnetic-lattice-hero engine):
 * a grid of faint strands whose junctions lean toward the cursor and charge
 * up in acid green; clicks fire a shockwave ring through the field.
 * Renders static under reduced motion and pauses while the tab is hidden.
 */

const SETTINGS = {
  cell: 64,
  pullRadius: 240,
  pullStrength: 20,
  deadZone: 48,
  easing: 0.1,
  anchorCells: 1.75,
  waveSpeed: 360,
  waveFade: 0.9,
  waveBand: 48,
  waveKick: 16,
  tickSpacing: 96,
  junctionRest: 1.6,
  junctionPeak: 3.6,
};

const THEME = {
  backdrop: "#171b19", // charcoal
  strand: [242, 240, 233] as const, // ivory at rest
  strandRestAlpha: 0.1,
  accent: [184, 242, 60] as const, // acid
  ring: [206, 248, 110] as const,
};

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
function rgba(rgb: readonly number[], a: number) {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a.toFixed(3)})`;
}

export default function LatticeField({ className = "" }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = stage?.querySelector("canvas");
    const host = stage?.parentElement; // pointer events live on the section
    if (!stage || !canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0,
      height = 0,
      dpr = 1,
      rafId = 0,
      lastTime = 0;
    const FAR = { x: -1e4, y: -1e4 };
    const pointer = { x: FAR.x, y: FAR.y };
    let pointerGoal = { x: FAR.x, y: FAR.y };
    const waves: { x: number; y: number; radius: number; life: number }[] = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function resize() {
      const rect = stage!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduceMotion.matches) renderFrame(0);
    }

    function displace(rx: number, ry: number, col: number, row: number, cols: number, rows: number) {
      const anchor =
        smoothstep(0, SETTINGS.anchorCells, Math.min(col, cols - 1 - col)) *
        smoothstep(0, SETTINGS.anchorCells, Math.min(row, rows - 1 - row));
      let x = rx,
        y = ry,
        charge = 0;
      if (anchor > 0) {
        const dx = pointer.x - rx;
        const dy = pointer.y - ry;
        const dist = Math.hypot(dx, dy);
        if (dist < SETTINGS.pullRadius && dist > 0.0001) {
          const falloff = 0.5 * (1 + Math.cos((Math.PI * dist) / SETTINGS.pullRadius));
          const ramp = smoothstep(0, SETTINGS.deadZone, dist);
          const travel = SETTINGS.pullStrength * falloff * ramp * anchor;
          x += (dx / dist) * travel;
          y += (dy / dist) * travel;
          charge = falloff * anchor;
        }
        for (const w of waves) {
          const wx = rx - w.x;
          const wy = ry - w.y;
          const wd = Math.hypot(wx, wy);
          if (wd < 0.0001) continue;
          const band = wd - w.radius;
          if (Math.abs(band) < SETTINGS.waveBand) {
            const kick = (1 - Math.abs(band) / SETTINGS.waveBand) * w.life * SETTINGS.waveKick * anchor;
            const dir = band < 0 ? 1 : -1;
            x += (wx / wd) * kick * dir;
            y += (wy / wd) * kick * dir;
          }
        }
      }
      return { x, y, charge };
    }

    function renderFrame(dt: number) {
      ctx!.fillStyle = THEME.backdrop;
      ctx!.fillRect(0, 0, width, height);

      ctx!.strokeStyle = "rgba(255,255,255,0.045)";
      ctx!.lineWidth = 1;
      const s = SETTINGS.tickSpacing;
      const arm = 3;
      ctx!.beginPath();
      for (let tx = s / 2; tx < width; tx += s) {
        for (let ty = s / 2; ty < height; ty += s) {
          ctx!.moveTo(tx - arm, ty);
          ctx!.lineTo(tx + arm, ty);
          ctx!.moveTo(tx, ty - arm);
          ctx!.lineTo(tx, ty + arm);
        }
      }
      ctx!.stroke();

      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i];
        w.radius += SETTINGS.waveSpeed * dt;
        w.life -= SETTINGS.waveFade * dt;
        if (w.life <= 0) waves.splice(i, 1);
      }

      const cols = Math.max(3, Math.round(width / SETTINGS.cell)) + 1;
      const rows = Math.max(3, Math.round(height / SETTINGS.cell)) + 1;
      const stepX = width / (cols - 1);
      const stepY = height / (rows - 1);

      const grid: { x: number; y: number; charge: number }[][] = new Array(rows);
      for (let r = 0; r < rows; r++) {
        grid[r] = new Array(cols);
        for (let c = 0; c < cols; c++) {
          grid[r][c] = displace(c * stepX, r * stepY, c, r, cols, rows);
        }
      }

      function strand(a: { x: number; y: number; charge: number }, b: { x: number; y: number; charge: number }) {
        const t = smoothstep(0, 1, (a.charge + b.charge) / 2);
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.strokeStyle = rgba(
          [
            Math.round(mix(THEME.strand[0], THEME.accent[0], t)),
            Math.round(mix(THEME.strand[1], THEME.accent[1], t)),
            Math.round(mix(THEME.strand[2], THEME.accent[2], t)),
          ],
          mix(THEME.strandRestAlpha, 0.85, t),
        );
        ctx!.lineWidth = mix(0.75, 1.6, t);
        ctx!.stroke();
      }

      for (let r = 0; r < rows; r++) for (let c = 0; c < cols - 1; c++) strand(grid[r][c], grid[r][c + 1]);
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows - 1; r++) strand(grid[r][c], grid[r + 1][c]);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const j = grid[r][c];
          const jt = smoothstep(0, 1, j.charge);
          const radius = mix(SETTINGS.junctionRest, SETTINGS.junctionPeak, jt);
          if (jt > 0.35) {
            const haloR = radius + mix(0, 7, (jt - 0.35) / 0.65);
            const grad = ctx!.createRadialGradient(j.x, j.y, radius * 0.4, j.x, j.y, haloR);
            grad.addColorStop(0, rgba(THEME.accent, jt * 0.32));
            grad.addColorStop(1, rgba(THEME.accent, 0));
            ctx!.beginPath();
            ctx!.arc(j.x, j.y, haloR, 0, Math.PI * 2);
            ctx!.fillStyle = grad;
            ctx!.fill();
          }
          ctx!.beginPath();
          ctx!.arc(j.x, j.y, radius, 0, Math.PI * 2);
          ctx!.fillStyle = rgba(
            [
              Math.round(mix(THEME.strand[0], THEME.accent[0], jt)),
              Math.round(mix(THEME.strand[1], THEME.accent[1], jt)),
              Math.round(mix(THEME.strand[2], THEME.accent[2], jt)),
            ],
            mix(0.22, 1, jt),
          );
          ctx!.fill();
        }
      }

      for (const wr of waves) {
        ctx!.beginPath();
        ctx!.arc(wr.x, wr.y, Math.max(0, wr.radius), 0, Math.PI * 2);
        ctx!.strokeStyle = rgba(THEME.ring, wr.life * 0.3);
        ctx!.lineWidth = 1.4;
        ctx!.stroke();
      }
    }

    function tick(now: number) {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
      lastTime = now;
      pointer.x = mix(pointer.x, pointerGoal.x, SETTINGS.easing);
      pointer.y = mix(pointer.y, pointerGoal.y, SETTINGS.easing);
      renderFrame(dt);
      rafId = window.requestAnimationFrame(tick);
    }

    function start() {
      if (rafId || reduceMotion.matches) return;
      lastTime = 0;
      rafId = window.requestAnimationFrame(tick);
    }
    function stop() {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function localPoint(event: PointerEvent) {
      const rect = stage!.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }
    const onMove = (event: PointerEvent) => {
      pointerGoal = localPoint(event);
    };
    const onLeave = () => {
      pointerGoal = { x: FAR.x, y: FAR.y };
    };
    const onDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest("a, button")) return;
      const p = localPoint(event);
      waves.push({ x: p.x, y: p.y, radius: 0, life: 1 });
      if (reduceMotion.matches) renderFrame(0);
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    resize();
    if (reduceMotion.matches) renderFrame(0);
    else start();

    return () => {
      stop();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={stageRef} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <canvas className="h-full w-full" />
    </div>
  );
}
