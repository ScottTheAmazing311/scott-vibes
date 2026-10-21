"use client";

import { useCallback, useEffect, useState } from "react";

/* ESPN's public scoreboard feed. No key needed. */
const SCOREBOARD = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
const STORE = "kz-nfl-v1";

interface Team {
  id: string;
  abbr: string;
  name: string;
  logo: string;
  home: boolean;
  score: string;
  winner: boolean;
}

interface Game {
  id: string;
  date: string;
  started: boolean;
  completed: boolean;
  teams: Team[];
}

interface Pick {
  teamId: string;
  week: number;
  year: number;
  resolved?: "w" | "l";
}

interface Store {
  profiles: { id: string; name: string }[];
  picks: Record<string, Record<string, Pick>>; // profileId -> eventId -> pick
  records: Record<string, { w: number; l: number }>;
}

const EMPTY: Store = { profiles: [], picks: {}, records: {} };

interface Scoreboard {
  week: number;
  year: number;
  games: Game[];
}

function parseScoreboard(data: unknown): Scoreboard {
  const d = data as {
    week?: { number?: number };
    season?: { year?: number };
    events?: {
      id: string;
      date: string;
      status?: { type?: { state?: string; completed?: boolean } };
      competitions?: {
        competitors?: {
          id: string;
          homeAway?: string;
          winner?: boolean;
          score?: string;
          team?: { abbreviation?: string; shortDisplayName?: string; logo?: string };
        }[];
      }[];
    }[];
  };
  return {
    week: d.week?.number ?? 0,
    year: d.season?.year ?? new Date().getFullYear(),
    games: (d.events ?? []).map((e) => ({
      id: e.id,
      date: e.date,
      started: (e.status?.type?.state ?? "pre") !== "pre",
      completed: e.status?.type?.completed ?? false,
      teams: (e.competitions?.[0]?.competitors ?? [])
        .map((c) => ({
          id: c.id,
          abbr: c.team?.abbreviation ?? "?",
          name: c.team?.shortDisplayName ?? "Team",
          logo: c.team?.logo ?? "",
          home: c.homeAway === "home",
          score: c.score ?? "",
          winner: c.winner ?? false,
        }))
        .sort((a, b) => Number(a.home) - Number(b.home)), // away first
    })),
  };
}

export default function NflPicks() {
  const [store, setStore] = useState<Store>(EMPTY);
  const [board, setBoard] = useState<Scoreboard | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [active, setActive] = useState<string | null>(null);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState("");

  const persist = useCallback((s: Store) => {
    setStore(s);
    try {
      localStorage.setItem(STORE, JSON.stringify(s));
    } catch {}
  }, []);

  /* Load storage + current week; then resolve any finished past picks. */
  useEffect(() => {
    let saved = EMPTY;
    try {
      saved = { ...EMPTY, ...JSON.parse(localStorage.getItem(STORE) || "{}") };
    } catch {}
    setStore(saved);
    setActive(saved.profiles[0]?.id ?? null);

    (async () => {
      try {
        const current = parseScoreboard(await (await fetch(SCOREBOARD)).json());
        setBoard(current);
        setStatus("ok");

        // Resolve old picks: gather past weeks that still have unresolved picks.
        const weeksToCheck = new Set<string>();
        for (const byEvent of Object.values(saved.picks)) {
          for (const p of Object.values(byEvent)) {
            if (!p.resolved && (p.year < current.year || p.week < current.week)) {
              weeksToCheck.add(`${p.year}:${p.week}`);
            }
          }
        }
        const results = new Map<string, string>(); // eventId -> winning teamId
        const markWinners = (sb: Scoreboard) => {
          for (const g of sb.games) {
            if (!g.completed) continue;
            const winner = g.teams.find((t) => t.winner);
            if (winner) results.set(g.id, winner.id);
          }
        };
        markWinners(current);
        for (const key of [...weeksToCheck].slice(0, 4)) {
          const [year, week] = key.split(":");
          try {
            markWinners(parseScoreboard(await (await fetch(`${SCOREBOARD}?seasontype=2&week=${week}&dates=${year}`)).json()));
          } catch {}
        }

        let changed = false;
        const next: Store = structuredClone(saved);
        for (const [profileId, byEvent] of Object.entries(next.picks)) {
          for (const [eventId, p] of Object.entries(byEvent)) {
            if (p.resolved || !results.has(eventId)) continue;
            p.resolved = results.get(eventId) === p.teamId ? "w" : "l";
            next.records[profileId] = next.records[profileId] ?? { w: 0, l: 0 };
            next.records[profileId][p.resolved]++;
            changed = true;
          }
        }
        if (changed) {
          setStore(next);
          try {
            localStorage.setItem(STORE, JSON.stringify(next));
          } catch {}
        }
      } catch {
        setStatus("error");
      }
    })();
  }, []);

  const addProfile = () => {
    if (!name.trim()) return;
    const id = `p-${Date.now()}`;
    persist({ ...store, profiles: [...store.profiles, { id, name: name.trim().slice(0, 20) }] });
    setActive(id);
    setName("");
    setNaming(false);
  };

  const pick = (game: Game, teamId: string) => {
    if (!active || !board || game.started) return;
    const mine = { ...(store.picks[active] ?? {}) };
    mine[game.id] = { teamId, week: board.week, year: board.year };
    persist({ ...store, picks: { ...store.picks, [active]: mine } });
  };

  if (status === "error") {
    return (
      <div className="kz-panel mx-auto max-w-xl p-10 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight">The scoreboard is napping</h2>
        <p className="mt-2 text-base font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
          We couldn't reach the NFL schedule. Check the internet and try again.
        </p>
        <button onClick={() => location.reload()} className="kz-btn mt-6">Try again</button>
      </div>
    );
  }

  return (
    <div>
      {/* Who's picking + standings */}
      <div className="flex flex-wrap items-center gap-2">
        {store.profiles.map((p) => {
          const r = store.records[p.id] ?? { w: 0, l: 0 };
          return (
            <button key={p.id} className="kz-chip" data-on={active === p.id} onClick={() => setActive(p.id)}>
              {p.name}
              <span className="ml-2 text-xs opacity-70">
                {r.w}-{r.l}
              </span>
            </button>
          );
        })}
        {naming ? (
          <span className="flex items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addProfile()}
              placeholder="Your name"
              autoFocus
              className="w-36 rounded-full border-[1.5px] px-4 py-1.5 text-sm font-bold outline-none focus:border-[var(--kz-marigold)]"
              style={{ borderColor: "var(--kz-line)", background: "var(--kz-panel)" }}
            />
            <button onClick={addProfile} className="kz-chip">Join</button>
          </span>
        ) : (
          <button onClick={() => setNaming(true)} className="kz-chip" style={{ borderStyle: "dashed" }}>
            + Add a picker
          </button>
        )}
        {board && (
          <span className="ml-auto text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
            Week {board.week}
          </span>
        )}
      </div>

      {!active && store.profiles.length === 0 && (
        <div className="kz-tile mt-6 p-8 text-center" style={{ background: "var(--kz-marigold-soft)" }}>
          <h2 className="text-2xl font-extrabold tracking-tight">Add a picker to start</h2>
          <p className="mt-1 text-base font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
            Everyone picks their winners. Right picks build your record, week after week.
          </p>
        </div>
      )}

      {/* Games */}
      {status === "loading" ? (
        <div className="mt-6 grid gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="kz-panel h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {board?.games.map((g) => {
            const myPick = active ? store.picks[active]?.[g.id] : undefined;
            const kickoff = new Date(g.date).toLocaleDateString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" });
            return (
              <div key={g.id} className="kz-panel p-4">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  {g.teams.map((t, side) => {
                    const chosen = myPick?.teamId === t.id;
                    const won = g.completed && t.winner;
                    return (
                      <button
                        key={t.id}
                        onClick={() => pick(g, t.id)}
                        disabled={!active || g.started}
                        className={`flex items-center gap-3 rounded-[14px] border-2 p-3 transition-transform duration-100 enabled:hover:-translate-y-0.5 motion-reduce:transition-none ${side === 1 ? "flex-row-reverse text-right" : ""}`}
                        style={{
                          borderColor: chosen ? "var(--kz-marigold)" : "var(--kz-line)",
                          background: g.completed && chosen ? (won ? "var(--kz-leaf-soft)" : "var(--kz-brick-soft)") : chosen ? "var(--kz-marigold-soft)" : "transparent",
                          opacity: g.completed && !won ? 0.65 : 1,
                        }}
                        aria-pressed={chosen}
                        aria-label={`Pick ${t.name}`}
                      >
                        {t.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.logo} alt="" width={36} height={36} className="shrink-0" />
                        ) : (
                          <span className="h-9 w-9 shrink-0 rounded-full" style={{ background: "var(--kz-line)" }} />
                        )}
                        <span className="min-w-0">
                          <span className="block truncate text-base font-extrabold">{t.name}</span>
                          {g.started && <span className="block text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>{t.score}</span>}
                        </span>
                      </button>
                    );
                  })}
                  <span className="order-first col-start-2 row-start-1 text-center text-xs font-bold" style={{ color: "var(--kz-ink-soft)" }}>
                    {g.completed ? "Final" : g.started ? "Playing now" : kickoff}
                    <span className="mt-1 block">at</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {active && board && (
        <p className="mt-4 text-center text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
          Tap a team to pick it. Picks lock at kickoff, and your record updates after the games finish.
        </p>
      )}
    </div>
  );
}
