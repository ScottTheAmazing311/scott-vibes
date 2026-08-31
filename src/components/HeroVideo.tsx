"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduce(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}

interface Props {
  /** plays once, then hands off to the loop */
  intro: string;
  /** seamless continuation, loops forever */
  loop: string;
  poster: string;
  loopPoster: string;
  className?: string;
}

/**
 * Two-phase background video: the intro plays through once, then crossfades
 * into the loop video, which repeats forever. Under prefers-reduced-motion
 * (or if autoplay is blocked) only the loop's still frame is shown.
 */
export default function HeroVideo({ intro, loop, poster, loopPoster, className = "" }: Props) {
  const introRef = useRef<HTMLVideoElement>(null);
  const loopRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"intro" | "loop" | "still">("intro");

  useEffect(() => {
    const a = introRef.current;
    const b = loopRef.current;
    if (reduce || !a || !b) return;
    const toLoop = () => {
      b.play().catch(() => {});
      setPhase("loop");
    };
    a.addEventListener("ended", toLoop);
    a.play().catch(() => setPhase("still"));
    return () => {
      a.removeEventListener("ended", toLoop);
      a.pause();
      b.pause();
    };
  }, [reduce]);

  if (reduce || phase === "still") {
    /* eslint-disable-next-line @next/next/no-img-element -- plain background frame, no optimization needed */
    return <img src={loopPoster} alt="" aria-hidden="true" className={`${className} object-cover`} />;
  }

  return (
    <div className={className} aria-hidden="true">
      <video
        ref={introRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={intro}
        poster={poster}
        muted
        playsInline
        preload="auto"
      />
      <video
        ref={loopRef}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        style={{ opacity: phase === "loop" ? 1 : 0 }}
        src={loop}
        muted
        loop
        playsInline
        preload="auto"
      />
    </div>
  );
}
