"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

interface Props {
  as?: ElementType;
  className?: string;
  id?: string;
  /** ms before the first child transition starts */
  delay?: number;
  /** portion of the element that must be visible */
  amount?: number;
  style?: CSSProperties;
  children: ReactNode;
  [dataAttr: `data-${string}`]: string | undefined;
}

/** Adds `.in` once the element enters the viewport. Children opt in via .line-in, .fade, .rule-x, .num-in, .mask-in. */
export default function Reveal({
  as: Tag = "div",
  className = "",
  id,
  delay = 0,
  amount = 0.15,
  style,
  children,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.disconnect();
          }
        }
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);

  return (
    <Tag
      {...rest}
      ref={ref}
      id={id}
      className={`rv ${className}`}
      style={{ ...style, ["--rv-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
