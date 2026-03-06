"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FrequencyCanvas, { HubPosition } from "@/components/FrequencyCanvas";
import { HUBS } from "@/lib/hubs";

function calculatePositions(w: number, h: number): HubPosition[] {
  const cx = w / 2;
  const cy = h / 2;

  if (w < 640) {
    // Mobile: 2-column grid below header
    const colW = w / 2;
    const startY = h * 0.28;
    const rowH = (h - startY - 40) / 3;
    return HUBS.map((hub, i) => ({
      x: colW * (i % 2) + colW / 2,
      y: startY + Math.floor(i / 2) * rowH + rowH / 2,
      color: hub.color,
      frequency: hub.frequency,
      amplitude: hub.amplitude * 0.6,
    }));
  }

  // Desktop: circular layout
  const radius = Math.min(w * 0.3, h * 0.32, 340);
  return HUBS.map((hub, i) => ({
    x: cx + Math.cos((i / HUBS.length) * Math.PI * 2 - Math.PI / 2) * radius,
    y: cy + Math.sin((i / HUBS.length) * Math.PI * 2 - Math.PI / 2) * radius,
    color: hub.color,
    frequency: hub.frequency,
    amplitude: hub.amplitude,
  }));
}

export default function Home() {
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const update = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const positions = useMemo(() => {
    if (dims.w === 0) return [];
    return calculatePositions(dims.w, dims.h);
  }, [dims]);

  // Loading state
  if (dims.w === 0) {
    return <div className="h-screen w-screen bg-[#050505]" />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050505] select-none">
      <FrequencyCanvas hubs={positions} hoveredIndex={hoveredIndex} />

      {/* Center wordmark */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
      >
        <h1
          className="font-[family-name:var(--font-syne)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white/90"
          style={{
            textShadow: "0 0 40px rgba(167, 139, 250, 0.15), 0 0 80px rgba(167, 139, 250, 0.05)",
          }}
        >
          scottvibes
        </h1>
        <motion.p
          className="font-[family-name:var(--font-space-grotesk)] text-white/30 text-xs sm:text-sm mt-3 tracking-[0.3em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
        >
          tune into something
        </motion.p>
      </motion.div>

      {/* Hub labels */}
      {positions.map((pos, i) => {
        const hub = HUBS[i];
        const isHovered = hoveredIndex === i;

        return (
          <motion.div
            key={hub.id}
            className="absolute z-20"
            style={{
              left: pos.x,
              top: pos.y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.2 + i * 0.12,
              ease: "easeOut",
            }}
          >
            <Link
              href={hub.path}
              className="flex flex-col items-center group py-4 px-6"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span
                className="text-xs sm:text-sm md:text-base font-semibold tracking-wide transition-all duration-500 font-[family-name:var(--font-syne)]"
                style={{
                  color: hub.color,
                  textShadow: isHovered
                    ? `0 0 20px ${hub.color}60, 0 0 40px ${hub.color}30`
                    : "none",
                  transform: isHovered ? "scale(1.15)" : "scale(1)",
                }}
              >
                {hub.name}
              </span>
              <span
                className="text-[10px] sm:text-xs mt-1 transition-all duration-500 font-[family-name:var(--font-space-grotesk)]"
                style={{
                  color: isHovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
                }}
              >
                {hub.subtitle}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
