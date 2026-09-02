import activity from "@/lib/activity-data.json";

/**
 * GitHub-style commit calendar (from the bs-data-visualization-activity-calendar
 * block), fed by real public-commit data collected by scripts/fetch-activity.mjs.
 * Ivory-to-acid ramp; pure static render with title tooltips.
 */

// quiet -> busy
const LEVELS = ["#E6E4DA", "#DcefA6", "#C9EC6B", "#B8F23C", "#7FA824"];
const DAY_MS = 86400000;

function level(count: number) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

export default function ActivityCalendar() {
  const counts = new Map<string, number>(activity.days.map((d) => [d.date, d.count]));
  const total = activity.days.reduce((s, d) => s + d.count, 0);

  // 53 columns of weeks (Sun-start), ending with the current week.
  const today = new Date();
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const weekStart = todayUtc - new Date(todayUtc).getUTCDay() * DAY_MS;
  const weeks: { date: string; count: number; future: boolean }[][] = [];
  const monthLabels: { col: number; label: string }[] = [];
  let lastMonth = -1;

  for (let w = 52; w >= 0; w--) {
    const col: { date: string; count: number; future: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      const t = weekStart - w * 7 * DAY_MS + d * DAY_MS;
      const iso = new Date(t).toISOString().slice(0, 10);
      col.push({ date: iso, count: counts.get(iso) ?? 0, future: t > todayUtc });
    }
    const month = new Date(weekStart - w * 7 * DAY_MS).getUTCMonth();
    if (month !== lastMonth) {
      monthLabels.push({ col: weeks.length, label: new Date(weekStart - w * 7 * DAY_MS).toLocaleString("en", { month: "short", timeZone: "UTC" }) });
      lastMonth = month;
    }
    weeks.push(col);
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="relative mb-2 h-4">
          {monthLabels.map((m) => (
            <span key={m.col} className="label absolute" style={{ left: `${(m.col / weeks.length) * 100}%` }}>
              {m.label}
            </span>
          ))}
        </div>
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-1 flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  className="aspect-square w-full"
                  style={{ background: day.future ? "transparent" : LEVELS[level(day.count)] }}
                  title={day.future ? undefined : `${day.date}: ${day.count} ${day.count === 1 ? "commit" : "commits"}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <span className="label">
            {total.toLocaleString()} commits across public repos, last 12 months
          </span>
          <span className="flex items-center gap-1.5">
            <span className="label">Quiet</span>
            {LEVELS.map((c) => (
              <span key={c} className="h-3 w-3" style={{ background: c }} />
            ))}
            <span className="label">Busy</span>
          </span>
        </div>
      </div>
    </div>
  );
}
