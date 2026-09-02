/**
 * Aggregate daily commit counts across all public repos of a GitHub user
 * into src/lib/activity-data.json (a year of {date, count} entries).
 *
 * Usage: node scripts/fetch-activity.mjs
 * Re-run any time to refresh the calendar on /professional.
 */
import { writeFile } from "node:fs/promises";

const USER = "ScottTheAmazing311";
const HEADERS = { "User-Agent": "scottvibes-activity", Accept: "application/vnd.github+json" };

const repos = await (await fetch(`https://api.github.com/users/${USER}/repos?per_page=100`, { headers: HEADERS })).json();
if (!Array.isArray(repos)) throw new Error("repo list failed: " + JSON.stringify(repos).slice(0, 200));
console.log(`${repos.length} public repos`);

const daily = new Map(); // yyyy-mm-dd -> count

for (const repo of repos) {
  // stats endpoints warm up with a 202; retry a few times
  let weeks = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`https://api.github.com/repos/${repo.full_name}/stats/commit_activity`, { headers: HEADERS });
    if (res.status === 202) {
      await new Promise((r) => setTimeout(r, 2500));
      continue;
    }
    if (!res.ok) break;
    weeks = await res.json();
    break;
  }
  if (!Array.isArray(weeks)) {
    console.log(`  ${repo.name}: no stats`);
    continue;
  }
  let total = 0;
  for (const week of weeks) {
    week.days.forEach((count, i) => {
      if (!count) return;
      const date = new Date((week.week + i * 86400) * 1000).toISOString().slice(0, 10);
      daily.set(date, (daily.get(date) || 0) + count);
      total += count;
    });
  }
  console.log(`  ${repo.name}: ${total} commits/yr`);
}

const data = [...daily.entries()]
  .map(([date, count]) => ({ date, count }))
  .sort((a, b) => a.date.localeCompare(b.date));

await writeFile(
  new URL("../src/lib/activity-data.json", import.meta.url),
  JSON.stringify({ user: USER, fetched: new Date().toISOString().slice(0, 10), days: data }, null, 2),
);
console.log(`wrote ${data.length} active days, ${data.reduce((s, d) => s + d.count, 0)} commits total`);
