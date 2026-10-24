"use client";

import { useEffect, useRef, useState } from "react";
import Glyph from "./Glyph";

/** Fixed top bar: frosts after the first scroll, tracks the current section, and draws a reading-progress line. */
export default function TopBar({ links }: { links: { href: string; label: string }[] }) {
  const barRef = useRef<HTMLElement>(null);
  const progRef = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const bar = barRef.current;
    const prog = progRef.current;
    if (!bar || !prog) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      bar.toggleAttribute("data-scrolled", window.scrollY > 24);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    for (const { href } of links) {
      const el = document.querySelector(href);
      if (el) io.observe(el);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [links]);

  return (
    <header ref={barRef} className="rs-top">
      <div className="rs-wrap rs-top-in">
        <a href="#top" className="rs-brand">
          <Glyph active="all" size={16} />
          Re-Sorted
        </a>
        <nav className="rs-navlinks" aria-label="Sections">
          {links.map(({ href, label }) => (
            <a key={href} href={href} aria-current={current === href ? "true" : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <a href="#quiz" className="rs-btn rs-btn-primary rs-btn-sm">
          Take the quiz
        </a>
      </div>
      <span ref={progRef} className="rs-progress" aria-hidden="true" />
    </header>
  );
}
