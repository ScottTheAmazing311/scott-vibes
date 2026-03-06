"use client";

import { useEffect, useRef } from "react";

export interface HubPosition {
  x: number;
  y: number;
  color: string;
  frequency: number;
  amplitude: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

interface Props {
  hubs: HubPosition[];
  hoveredIndex: number | null;
}

export default function FrequencyCanvas({ hubs, hoveredIndex }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef<number>(0);
  const hoveredRef = useRef<number | null>(null);

  // Keep hoveredRef in sync without re-running the effect
  hoveredRef.current = hoveredIndex;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const hubColors = hubs.length > 0 ? hubs.map((h) => h.color) : ["#fff"];
    particlesRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * (w || 1920),
      y: Math.random() * (h || 1080),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.15 + 0.03,
      color: hubColors[Math.floor(Math.random() * hubColors.length)],
    }));

    startTimeRef.current = performance.now();
    let animId: number;

    const draw = (now: number) => {
      const elapsed = (now - startTimeRef.current) * 0.001;
      const introFade = Math.min(1, elapsed / 2.5);
      const hovered = hoveredRef.current;

      ctx.clearRect(0, 0, w, h);

      // Background radial glow
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.6);
      bgGrad.addColorStop(0, "rgba(20, 15, 30, 0.4)");
      bgGrad.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Particles
      const particles = particlesRef.current;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const a = Math.round(p.alpha * introFade * 255);
        if (a <= 0) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + a.toString(16).padStart(2, "0");
        ctx.fill();
      }

      if (hubs.length === 0) {
        animId = requestAnimationFrame(draw);
        return;
      }

      // Connections between adjacent hubs (ring)
      for (let i = 0; i < hubs.length; i++) {
        const a = hubs[i];
        const b = hubs[(i + 1) % hubs.length];
        drawConnection(ctx, a, b, elapsed, introFade);
      }
      // Cross connections
      if (hubs.length >= 6) {
        drawConnection(ctx, hubs[0], hubs[3], elapsed, introFade * 0.5);
        drawConnection(ctx, hubs[1], hubs[4], elapsed, introFade * 0.5);
        drawConnection(ctx, hubs[2], hubs[5], elapsed, introFade * 0.5);
      }

      // Waveform rings
      for (let i = 0; i < hubs.length; i++) {
        drawWaveform(ctx, hubs[i], elapsed, introFade, hovered === i);
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hubs]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

function drawWaveform(
  ctx: CanvasRenderingContext2D,
  hub: HubPosition,
  time: number,
  introFade: number,
  isHovered: boolean
) {
  const segments = 128;
  const baseRadius = 50;
  const hoverMult = isHovered ? 2.2 : 1.0;
  const amp = hub.amplitude * hoverMult * introFade;

  ctx.beginPath();
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const wave1 =
      Math.sin(angle * hub.frequency * 4 + time * hub.frequency * 2) * amp;
    const wave2 =
      Math.sin(angle * hub.frequency * 7 - time * hub.frequency * 1.3) *
      amp *
      0.3;
    const wave3 =
      Math.sin(angle * hub.frequency * 2 + time * 0.5) * amp * 0.15;
    const r = baseRadius + wave1 + wave2 + wave3;
    const x = hub.x + Math.cos(angle) * r;
    const y = hub.y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  ctx.save();
  ctx.shadowColor = hub.color;
  ctx.shadowBlur = isHovered ? 45 : 18;
  ctx.strokeStyle = hub.color;
  ctx.lineWidth = isHovered ? 2 : 1.5;
  ctx.globalAlpha = introFade * (isHovered ? 1 : 0.6);
  ctx.stroke();

  // Inner fill
  ctx.globalAlpha = introFade * (isHovered ? 0.1 : 0.03);
  ctx.fillStyle = hub.color;
  ctx.fill();
  ctx.restore();

  // Second ring — slightly offset for depth
  ctx.beginPath();
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const wave =
      Math.sin(angle * hub.frequency * 3 - time * hub.frequency * 1.5) *
      amp *
      0.5;
    const r = baseRadius * 0.7 + wave;
    const x = hub.x + Math.cos(angle) * r;
    const y = hub.y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.save();
  ctx.globalAlpha = introFade * (isHovered ? 0.4 : 0.15);
  ctx.strokeStyle = hub.color;
  ctx.lineWidth = 0.8;
  ctx.shadowColor = hub.color;
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.restore();

  // Center dot
  ctx.save();
  ctx.beginPath();
  ctx.arc(hub.x, hub.y, isHovered ? 5 : 3, 0, Math.PI * 2);
  ctx.fillStyle = hub.color;
  ctx.globalAlpha = introFade;
  ctx.shadowColor = hub.color;
  ctx.shadowBlur = isHovered ? 20 : 10;
  ctx.fill();
  ctx.restore();
}

function drawConnection(
  ctx: CanvasRenderingContext2D,
  a: HubPosition,
  b: HubPosition,
  time: number,
  introFade: number
) {
  const steps = 60;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return;
  const nx = -dy / len;
  const ny = dx / len;

  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const baseX = a.x + dx * t;
    const baseY = a.y + dy * t;
    const envelope = Math.sin(t * Math.PI);
    const wave = Math.sin(t * Math.PI * 4 + time * 1.5) * 10 * envelope;
    const x = baseX + nx * wave;
    const y = baseY + ny * wave;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.save();
  ctx.globalAlpha = introFade * 0.12;
  const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
  gradient.addColorStop(0, a.color);
  gradient.addColorStop(1, b.color);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1;
  ctx.shadowColor = a.color;
  ctx.shadowBlur = 6;
  ctx.stroke();
  ctx.restore();
}
