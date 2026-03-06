"use client";

import { useEffect, useRef } from "react";

interface Props {
  frequency: number;
  color: string;
  width?: number;
  speed?: number;
}

const CHARS = "▁▂▃▄▅▆▇█";

export default function AsciiWave({
  frequency,
  color,
  width = 18,
  speed = 0.15,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      if (!ref.current) return;
      frame++;
      const line = Array.from({ length: width }, (_, i) => {
        const val =
          Math.sin((i / width) * Math.PI * frequency * 2 + frame * speed) *
            0.5 +
          0.5;
        return CHARS[Math.floor(val * (CHARS.length - 1))];
      }).join("");
      ref.current.textContent = line;
    }, 80);
    return () => clearInterval(interval);
  }, [frequency, width, speed]);

  return (
    <span
      ref={ref}
      className="font-mono text-sm tracking-widest"
      style={{ color }}
      aria-hidden
    />
  );
}
