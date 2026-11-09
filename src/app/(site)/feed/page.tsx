import type { Metadata } from "next";
import Link from "next/link";
import TweetEmbed from "@/components/TweetEmbed";
import { CATEGORIES, TIME_ZONE, loadEditions, type DigestItem, type Edition } from "@/lib/digest";

/** The daily digest. Unlisted, not linked from the site. Filters are plain links back to this page. */

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Daily Digest", robots: { index: false, follow: false } };

const dayLabel = (date: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...options }).format(new Date(`${date}T12:00:00Z`));
const updatedLabel = (iso: string) => new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(iso));

const tweetId = (url: string) => url.match(/^https:\/\/(?:www\.)?(?:x|twitter)\.com\/[^/]+\/status\/(\d+)/)?.[1];

const denverToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(Date.now());

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="wrap pb-24 pt-28 md:pb-32 md:pt-36">
      {children}
    </main>
  );
}

function FilterLink({ href, on, children }: { href: string; on: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} prefetch={false} aria-current={on ? "page" : undefined} className={`shrink-0 whitespace-nowrap px-1.5 py-1 text-sm font-medium ${on ? "bg-acid" : "text-ink-2 hover:text-charcoal"}`}>
      {children}
    </Link>
  );
}

function Item({ item }: { item: DigestItem }) {
  const tweets = [...new Set(item.sources.map((source) => tweetId(source.url)).filter((id) => id !== undefined))];
  return (
    <article className="grid gap-x-10 gap-y-3 border-t border-[var(--rule)] py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
      <p className="text-sm leading-snug text-ink-3">
        <span className="block font-medium text-ink-2">{item.label}</span>
        {dayLabel(item.source_date, { month: "short", day: "numeric", year: "numeric" })}
      </p>
      <div className="max-w-[42rem]">
        <h3 className="text-xl font-bold leading-tight tracking-[-0.02em] md:text-2xl">{item.title}</h3>
        <p className="mt-3 leading-relaxed text-ink-2">{item.summary}</p>
        <p className="mt-4 leading-relaxed text-ink-2">
          <span className="font-semibold text-charcoal">Why it&rsquo;s useful. </span>
          {item.why_useful}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-3">
          <span className="font-semibold text-ink-2">Caveat. </span>
          {item.caveat}
        </p>
        {tweets.length > 0 && (
          <div className="mt-5 space-y-4">
            {tweets.map((id) => (
              <TweetEmbed key={id} id={id} />
            ))}
          </div>
        )}
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {item.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer nofollow" className="ulink [overflow-wrap:anywhere]">
                {source.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Digest({ editions, selected, category, today }: { editions: Edition[]; selected: Edition; category: string | null; today: string }) {
  const latest = editions[0];
  const isLatest = selected.edition_id === latest.edition_id;
  const behind = isLatest && selected.edition_id < today;
  const href = (edition: string, cat: string | null) => {
    const query = new URLSearchParams();
    if (edition !== latest.edition_id) query.set("edition", edition);
    if (cat) query.set("category", cat);
    const text = query.toString();
    return text ? `/feed?${text}` : "/feed";
  };
  const present = CATEGORIES.filter((name) => selected.items.some((item) => item.category === name));
  const shown = present.filter((name) => !category || name === category);

  return (
    <>
      <header>
        <h1 className="display display-md">{selected.title}</h1>
        <p className="mt-5 font-medium">
          {dayLabel(selected.edition_id, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          <span className="text-ink-3"> · Updated {updatedLabel(selected.updated_at)}</span>
        </p>
        {(!isLatest || behind) && <p className="mt-1 text-sm text-ink-3">{isLatest ? "This is the newest edition so far; nothing has arrived for today." : "A past edition."}</p>}
        <p className="body mt-4 text-sm!">{selected.coverage_note}</p>
      </header>

      <nav aria-label="Filters" className="mt-10 space-y-3 border-t border-[var(--rule-strong)] pt-4">
        {editions.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="label mr-2 shrink-0">Editions</span>
            {editions.map((edition) => (
              <FilterLink key={edition.edition_id} href={href(edition.edition_id, null)} on={edition.edition_id === selected.edition_id}>
                {dayLabel(edition.edition_id, { month: "short", day: "numeric" })}
              </FilterLink>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="label mr-2 shrink-0">Show</span>
          <FilterLink href={href(selected.edition_id, null)} on={!category}>
            Everything
          </FilterLink>
          {present.map((name) => (
            <FilterLink key={name} href={href(selected.edition_id, name)} on={name === category}>
              {name}
            </FilterLink>
          ))}
        </div>
      </nav>

      {shown.map((name) => (
        <section key={name} className="mt-14 md:mt-20">
          <h2 className="display display-sm mb-6">{name}</h2>
          {selected.items
            .filter((item) => item.category === name)
            .map((item) => (
              <Item key={item.id} item={item} />
            ))}
        </section>
      ))}
    </>
  );
}

export default async function FeedPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  let editions: Edition[] | null = null;
  try {
    editions = await loadEditions();
  } catch {}
  if (!editions?.length) {
    return (
      <Shell>
        <h1 className="display display-md">Daily Digest</h1>
        <p className="body mt-6">{editions ? "No editions have arrived yet." : "The digest couldn\u2019t be loaded right now."}</p>
      </Shell>
    );
  }

  const selected = editions.find((edition) => edition.edition_id === params.edition) ?? editions[0];
  const category = typeof params.category === "string" && CATEGORIES.includes(params.category) ? params.category : null;
  return (
    <Shell>
      <Digest editions={editions} selected={selected} category={category} today={denverToday()} />
    </Shell>
  );
}
