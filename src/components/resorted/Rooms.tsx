"use client";

import { useEffect } from "react";

const ROOM: Record<string, string> = {
  none: "#6f7890",
  g: "#f0694f",
  r: "#86a5ff",
  h: "#ecbf57",
  s: "#55cf97",
};

/**
 * Watches every [data-room] section and tints the page's room light to the
 * one crossing the middle of the viewport. The color eases via @property --room.
 */
export default function Rooms() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".rs");
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const room = (e.target as HTMLElement).dataset.room ?? "none";
          root.style.setProperty("--room", ROOM[room] ?? ROOM.none);
        }
      },
      { rootMargin: "-48% 0px -48% 0px" }
    );
    document.querySelectorAll("[data-room]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
