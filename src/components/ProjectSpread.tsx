import Image from "next/image";
import Link from "next/link";
import type { Domain } from "@/lib/content";
import Reveal from "./Reveal";

type Layout = "right" | "left" | "full";

interface Props {
  domain: Domain;
  layout: Layout;
}

function Figure({ domain, className = "", fromLeft = false, sizes }: { domain: Domain; className?: string; fromLeft?: boolean; sizes: string }) {
  return (
    <Link href={domain.path} aria-label={`Explore ${domain.name}`} className={`mask-in block ${fromLeft ? "from-left" : ""} ${className}`}>
      <div className="plx relative h-full w-full">
        <Image
          src={domain.image.src}
          alt={domain.image.alt}
          fill
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: domain.imagePos ?? "center" }}
        />
      </div>
    </Link>
  );
}

function Copy({ domain, className = "" }: { domain: Domain; className?: string }) {
  return (
    <div className={className}>
      <div className="numeral num-in text-[clamp(5rem,14vw,12rem)] text-charcoal/[0.18]">{domain.number}</div>
      <h3 className="display display-md fade mt-6" style={{ ["--i" as string]: 1 }}>
        {domain.name}
      </h3>
      <p className="body fade mt-4" style={{ ["--i" as string]: 2 }}>
        {domain.line}
      </p>
      <p className="fade mt-8" style={{ ["--i" as string]: 3 }}>
        <Link href={domain.path} className="ulink text-sm">
          Explore {domain.name}
        </Link>
      </p>
    </div>
  );
}

export default function ProjectSpread({ domain, layout }: Props) {
  if (layout === "full") {
    return (
      <Reveal as="article" className="relative py-20 md:py-28" style={{ background: domain.bg }} amount={0.1}>
        <div className="wrap">
          <Copy domain={domain} className="max-w-3xl" />
        </div>
        {/* edge-to-edge image, text column overhangs it on desktop */}
        <div className="relative mt-12 md:mt-[-3rem] md:pl-[28vw]">
          <Figure domain={domain} className="aspect-[16/9] w-full md:aspect-[21/9]" sizes="100vw" />
        </div>
      </Reveal>
    );
  }

  const imageRight = layout === "right";

  return (
    <Reveal as="article" className="py-20 md:py-28" style={{ background: domain.bg }} amount={0.1}>
      <div className="wrap grid gap-12 md:grid-cols-12 md:items-center md:gap-8">
        <Copy
          domain={domain}
          className={imageRight ? "md:col-span-5 md:col-start-1" : "md:col-span-5 md:col-start-8 md:row-start-1"}
        />
        <div
          className={
            imageRight
              ? "md:col-span-7 md:col-start-6 md:-mr-[var(--gutter)]"
              : "md:col-span-7 md:col-start-1 md:row-start-1 md:-ml-[var(--gutter)]"
          }
        >
          <Figure
            domain={domain}
            fromLeft={!imageRight}
            className="aspect-[4/3] w-full md:aspect-[16/11]"
            sizes="(min-width: 768px) 60vw, 100vw"
          />
        </div>
      </div>
    </Reveal>
  );
}
