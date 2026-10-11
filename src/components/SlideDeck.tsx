"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/** Self-hosted slide deck: pages through slide images rendered from the original
 *  presentation. Arrow keys work when the deck has focus; Present uses the
 *  Fullscreen API. Images live at `${dir}/slide-NN.jpg`, 1-indexed. */
export default function SlideDeck({ dir, count, title }: { dir: string; count: number; title: string }) {
  const [index, setIndex] = useState(1);
  const boxRef = useRef<HTMLDivElement>(null);

  const src = useCallback((n: number) => `${dir}/slide-${String(n).padStart(2, "0")}.jpg`, [dir]);
  const go = useCallback(
    (delta: number) => setIndex((prev) => Math.min(count, Math.max(1, prev + delta))),
    [count],
  );

  // keep the neighboring slides warm
  useEffect(() => {
    [index + 1, index - 1].forEach((n) => {
      if (n >= 1 && n <= count) {
        const img = new window.Image();
        img.src = src(n);
      }
    });
  }, [index, count, src]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      go(-1);
    }
  };

  const present = () => {
    boxRef.current?.requestFullscreen?.().then(() => boxRef.current?.focus());
  };

  return (
    <div>
      <div
        ref={boxRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label={`${title} slides, slide ${index} of ${count}`}
        className="relative aspect-video w-full border border-charcoal/20 bg-white outline-none focus-visible:border-charcoal [&:fullscreen]:border-0 [&:fullscreen]:bg-black"
      >
        <Image
          src={src(index)}
          alt={`${title}, slide ${index} of ${count}`}
          fill
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-contain"
          priority
        />
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(-1)}
          disabled={index === 1}
          className="absolute inset-y-0 left-0 w-1/5 disabled:cursor-default"
        />
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(1)}
          disabled={index === count}
          className="absolute inset-y-0 right-0 w-1/5 disabled:cursor-default"
        />
      </div>
      <div className="mt-4 flex items-center gap-6">
        <button type="button" onClick={() => go(-1)} disabled={index === 1} className="ulink text-sm disabled:opacity-30">
          <span aria-hidden="true">&larr;</span> Prev
        </button>
        <span className="label tabular-nums" aria-live="polite">
          {String(index).padStart(2, "0")} / {count}
        </span>
        <button type="button" onClick={() => go(1)} disabled={index === count} className="ulink text-sm disabled:opacity-30">
          Next <span aria-hidden="true">&rarr;</span>
        </button>
        <button type="button" onClick={present} className="ulink ml-auto text-sm">
          Present full screen <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  );
}
