"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ImageSpec } from "@/lib/content";

interface Props {
  images: ImageSpec[];
  sizes: string;
  /** ms between slides */
  interval?: number;
  className?: string;
}

/** Crossfades through a set of images; shows only the first under reduced motion. */
export default function AppRotator({ images, sizes, interval = 3500, className = "" }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <div className={`relative ${className}`}>
      {images.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 flex items-center justify-center p-[7%] transition-opacity duration-700 ease-[var(--ease-out)]"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <Image
            src={img.src}
            alt={i === index ? img.alt : ""}
            width={img.width}
            height={img.height}
            priority={i === 0}
            sizes={sizes}
            className="h-auto max-h-full w-auto max-w-full border-[6px] border-charcoal shadow-[0_18px_40px_rgba(23,27,25,0.35)]"
          />
        </div>
      ))}
    </div>
  );
}
