"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/content";

export default function Header() {
  const [dark, setDark] = useState(false);

  // Watch which section sits under the header strip and flip the text color on dark ones.
  useEffect(() => {
    const strip = 72;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-header-theme]"));
    if (!sections.length) return;
    const visible = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) visible.add(el);
          else visible.delete(el);
        }
        setDark(Array.from(visible).some((el) => el.dataset.headerTheme === "dark"));
      },
      { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - strip)}px 0px`, threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header className={`hdr fixed inset-x-0 top-0 z-40 ${dark ? "on-dark" : ""}`}>
      <div className="wrap flex h-16 items-center justify-between md:h-[72px]">
        <Link href="/" className="text-[0.9375rem] font-semibold tracking-[-0.02em]">
          {site.name}
        </Link>
        <a href={`mailto:${site.email}`} className="pill pill-outline py-1.5! text-[0.8125rem]">
          Email me
        </a>
      </div>
    </header>
  );
}
