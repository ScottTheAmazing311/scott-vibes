"use client";

import { useEffect, useRef, useState } from "react";

/** Shape Dash: a one-button runner. Tap / click / space to jump the spikes. */
export default function DashGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [best, setBest] = useState(0);

  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem("kz-dash-best") || 0));
    } catch {}
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 900;
    const H = 320;
    const GROUND = 260;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    type Obstacle = { x: number; w: number; h: number; kind: "spike" | "block" };

    let raf = 0;
    let running = true;
    let state: "ready" | "playing" | "dead" = "ready";
    let y = GROUND;
    let vy = 0;
    let rot = 0;
    let speed = 5;
    let dist = 0;
    let obstacles: Obstacle[] = [];
    let nextSpawn = W + 100;
    let flash = 0;
    const SIZE = 34;

    const reset = () => {
      y = GROUND;
      vy = 0;
      rot = 0;
      speed = 5;
      dist = 0;
      obstacles = [];
      nextSpawn = W + 100;
    };

    const jump = () => {
      if (state === "ready") {
        state = "playing";
        reset();
        return;
      }
      if (state === "dead") {
        state = "ready";
        return;
      }
      if (y >= GROUND - 0.5) vy = -13.2;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    const onPointer = (e: PointerEvent) => {
      e.preventDefault();
      jump();
    };
    window.addEventListener("keydown", onKey);
    canvas.addEventListener("pointerdown", onPointer);

    const die = () => {
      state = "dead";
      flash = 8;
      const score = Math.floor(dist / 10);
      try {
        const prev = Number(localStorage.getItem("kz-dash-best") || 0);
        if (score > prev) {
          localStorage.setItem("kz-dash-best", String(score));
          setBest(score);
        }
      } catch {}
    };

    const step = () => {
      if (!running) return;

      if (state === "playing") {
        dist += speed;
        speed = Math.min(11, 5 + dist / 4000);

        vy += 0.85;
        y = Math.min(GROUND, y + vy);
        if (y < GROUND) rot += 0.11;
        else rot = Math.round(rot / (Math.PI / 2)) * (Math.PI / 2);

        nextSpawn -= speed;
        if (nextSpawn <= 0) {
          const kind = Math.random() < 0.7 ? "spike" : "block";
          const double = kind === "spike" && Math.random() < 0.35 && dist > 2500;
          obstacles.push({ x: W + 40, w: double ? 52 : 26, h: kind === "spike" ? 30 : 36, kind });
          nextSpawn = 170 + Math.random() * 240 - Math.min(80, dist / 300);
        }
        obstacles.forEach((o) => (o.x -= speed));
        obstacles = obstacles.filter((o) => o.x + o.w > -10);

        // collision (shrunken hitbox is kinder)
        const px = 120 + 6;
        const pw = SIZE - 12;
        const py = y - SIZE + 6;
        const ph = SIZE - 8;
        for (const o of obstacles) {
          const oy = GROUND - o.h;
          if (px < o.x + o.w - 6 && px + pw > o.x + 6 && py + ph > oy + 4) {
            die();
            break;
          }
        }
      }

      // ---- draw ----
      ctx.fillStyle = "#DFF3FF";
      ctx.fillRect(0, 0, W, H);
      // distant hills
      ctx.fillStyle = "#BFE3F5";
      for (let i = 0; i < 4; i++) {
        const hx = ((i * 280 - (dist * 0.25) % 280) + 280) % (W + 280) - 140;
        ctx.beginPath();
        ctx.arc(hx, GROUND + 60, 120, Math.PI, 0);
        ctx.fill();
      }
      // ground
      ctx.fillStyle = "#9BE8A8";
      ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.strokeStyle = "#2B2440";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, GROUND);
      ctx.lineTo(W, GROUND);
      ctx.stroke();

      // obstacles
      for (const o of obstacles) {
        ctx.fillStyle = o.kind === "spike" ? "#EF476F" : "#7F9CF5";
        ctx.strokeStyle = "#2B2440";
        if (o.kind === "spike") {
          const n = o.w > 40 ? 2 : 1;
          const w = o.w / n;
          for (let i = 0; i < n; i++) {
            ctx.beginPath();
            ctx.moveTo(o.x + i * w, GROUND);
            ctx.lineTo(o.x + i * w + w / 2, GROUND - o.h);
            ctx.lineTo(o.x + (i + 1) * w, GROUND);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        } else {
          ctx.fillRect(o.x, GROUND - o.h, o.w, o.h);
          ctx.strokeRect(o.x, GROUND - o.h, o.w, o.h);
        }
      }

      // player
      ctx.save();
      ctx.translate(120 + SIZE / 2, y - SIZE / 2);
      ctx.rotate(rot);
      ctx.fillStyle = "#FFD166";
      ctx.strokeStyle = "#2B2440";
      ctx.lineWidth = 3;
      ctx.fillRect(-SIZE / 2, -SIZE / 2, SIZE, SIZE);
      ctx.strokeRect(-SIZE / 2, -SIZE / 2, SIZE, SIZE);
      // face
      ctx.fillStyle = "#2B2440";
      ctx.fillRect(-4, -8, 5, 5);
      ctx.fillRect(6, -8, 5, 5);
      ctx.fillRect(-2, 4, 10, 3);
      ctx.restore();

      // score
      ctx.fillStyle = "#2B2440";
      ctx.font = "800 26px var(--font-baloo), system-ui";
      ctx.textAlign = "left";
      ctx.fillText(String(Math.floor(dist / 10)), 20, 40);

      if (state !== "playing") {
        ctx.textAlign = "center";
        ctx.font = "800 34px var(--font-baloo), system-ui";
        if (state === "ready") {
          ctx.fillText("Tap or press SPACE to start", W / 2, 130);
          ctx.font = "600 20px var(--font-baloo), system-ui";
          ctx.fillText("Jump the spikes. Don't stop running!", W / 2, 165);
        } else {
          ctx.fillText(`Ouch! You ran ${Math.floor(dist / 10)}`, W / 2, 130);
          ctx.font = "600 20px var(--font-baloo), system-ui";
          ctx.fillText("Tap to try again", W / 2, 165);
        }
      }
      if (flash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${flash / 10})`;
        ctx.fillRect(0, 0, W, H);
        flash--;
      }

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  return (
    <div>
      <div className="rounded-3xl border-[3px] border-[#2B2440] bg-white p-3" style={{ boxShadow: "6px 6px 0 #2B2440" }}>
        <canvas ref={canvasRef} className="w-full touch-none rounded-2xl" style={{ aspectRatio: "900 / 320" }} aria-label="Shape Dash game" />
      </div>
      <p className="mt-3 text-center text-sm font-bold opacity-70">
        Best run: {best} · space, tap, or click to jump
      </p>
    </div>
  );
}
