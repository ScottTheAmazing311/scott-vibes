/**
 * Editorial marquee of everything Scott makes (mechanism from the
 * bs-testimonial-ticker block, ported to CSS-only motion): a duplicated
 * track scrolling left, paused on hover, static under reduced motion.
 */
export default function MakerTicker({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee border-y border-charcoal/15" aria-label="Things Scott makes">
      <div className="marquee-track flex w-max items-baseline py-4" style={{ ["--marquee-dur" as string]: `${items.length * 3.2}s` }}>
        {row.map((item, i) => (
          <span key={i} className="flex items-baseline whitespace-nowrap" aria-hidden={i >= items.length}>
            <span className="display px-5 text-xl uppercase md:text-2xl">{item}</span>
            <span className="select-none text-xl md:text-2xl" style={{ color: "#86c421" }} aria-hidden="true">
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
