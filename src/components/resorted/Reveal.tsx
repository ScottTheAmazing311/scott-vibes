"use client";

import { useEffect, useRef } from "react";

type Tag = "div" | "section" | "article" | "li";

/**
 * Fades content up as it scrolls into view and adds .is-in, which other
 * pieces key off (bar fills, square edges, canon movers). Without JS or with
 * reduced motion, everything is simply visible.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  style,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: Tag;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const merged = delay ? ({ ...style, "--rsd": `${delay}ms` } as React.CSSProperties) : style;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`rs-reveal ${className}`} style={merged} {...rest}>
      {children}
    </Tag>
  );
}
