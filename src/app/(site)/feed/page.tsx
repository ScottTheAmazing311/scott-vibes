import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { accessFrom, SESSION_COOKIE, type Access } from "@/lib/digest/session";
import { digestStore } from "@/lib/digest/store";
import { CATEGORIES, TIME_ZONE, denverDate, type DigestItem, type Edition } from "@/lib/digest/validate";

/** The private daily digest. Rendered entirely on the server, per request, and only for the owner:
 *  no client component ever receives digest data, and filters are plain links back to this page. */

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Daily Digest", robots: { index: false, follow: false } };

const dayLabel = (date: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...options }).format(new Date(`${date}T12:00:00Z`));
const updatedLabel = (iso: string) => new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(iso));

const denverToday = () => denverDate(Date.now());

const AUTH_NOTES: Record<string, string> = {
  denied: "That Google account doesn't have access.",
  failed: "Sign-in didn't finish. Try again.",
  unconfigured: "Sign-in isn't set up yet.",
};

function Gate({ access, note }: { access: Access; note?: string }) {
  const message = access === "forbidden" ? AUTH_NOTES.denied : access === "unconfigured" ? AUTH_NOTES.unconfigured : note;
  return (
    <main className="wrap flex min-h-[70dvh] flex-col justify-center pb-24 pt-32">
      <h1 className="display display-lg">Private</h1>
      {message && <p className="body mt-6">{message}</p>}
      {access !== "unconfigured" && (
        <div className="mt-10">
          <a href="/api/digest/auth/login" className="pill">
            <span>Sign in with Google</span>
            <span className="dot">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      )}
    </main>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="wrap pb-24 pt-28 md:pb-32 md:pt-36">
      {children}
      <form action="/api/digest/auth/logout" method="post" className="mt-20">
        <button type="submit" className="ulink cursor-pointer text-sm text-ink-3">
          Sign out
        </button>
      </form>
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
  const access = accessFrom((await cookies()).get(SESSION_COOKIE)?.value);
  if (access !== "owner") return <Gate access={access} note={typeof params.auth === "string" ? AUTH_NOTES[params.auth] : undefined} />;

  const store = digestStore();
  let editions: Edition[] | null = null;
  if (store) {
    try {
      editions = await store.history();
    } catch {}
  }
  if (!editions) {
    return (
      <Shell>
        <h1 className="display display-md">Daily Digest</h1>
        <p className="body mt-6">The digest couldn&rsquo;t be loaded right now. Stored editions aren&rsquo;t affected.</p>
      </Shell>
    );
  }
  if (editions.length === 0) {
    return (
      <Shell>
        <h1 className="display display-md">Daily Digest</h1>
        <p className="body mt-6">No editions have arrived yet.</p>
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
