import Link from "next/link";

export interface TickerItem {
  name: string;
  kind: string;
  href: string;
}

/**
 * Editorial marquee of everything Scott makes: each item names the work,
 * says what it is, and links to it. Duplicated track scrolling left (CSS
 * only), paused on hover, static and scrollable under reduced motion.
 */
export default function MakerTicker({ items }: { items: TickerItem[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee border-y border-charcoal/15" aria-label="Things Scott makes">
      <div className="marquee-track flex w-max items-baseline py-4" style={{ ["--marquee-dur" as string]: `${items.length * 3.6}s` }}>
        {row.map((item, i) => {
          const external = item.href.startsWith("http");
          const inner = (
            <>
              <span className="display text-xl uppercase transition-colors duration-300 group-hover:text-[#5f8a12] md:text-2xl">
                {item.name}
              </span>
              <span className="label opacity-60">{item.kind}</span>
            </>
          );
          const cls = "group flex items-baseline gap-3 whitespace-nowrap px-5";
          return (
            <span key={i} className="flex items-baseline" aria-hidden={i >= items.length}>
              {external ? (
                <a href={item.href} target="_blank" rel="noreferrer" className={cls} tabIndex={i >= items.length ? -1 : 0}>
                  {inner}
                </a>
              ) : (
                <Link href={item.href} className={cls} tabIndex={i >= items.length ? -1 : 0}>
                  {inner}
                </Link>
              )}
              <span className="select-none text-xl md:text-2xl" style={{ color: "#86c421" }} aria-hidden="true">
                ·
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
