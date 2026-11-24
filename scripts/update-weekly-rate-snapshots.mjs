/**
 * Keep data/weekly-rate-file-snapshots.json aligned with rate-file snapshots.
 *
 *   node scripts/update-weekly-rate-snapshots.mjs
 *     Upsert the current data/rates.json into the weekly file. The scrape
 *     workflow runs this before it commits, so the next build sees that week
 *     even on a shallow checkout.
 *
 *   node scripts/update-weekly-rate-snapshots.mjs --from-git
 *     Rebuild every week from git history of data/rates.json. One snapshot
 *     per Monday-start week: the latest scrape date in that week.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { metricsFromRates, upsertSnapshot } from "../src/lib/weeklyRateHistory.mjs";

const OUT = "data/weekly-rate-file-snapshots.json";
const fromGit = process.argv.includes("--from-git");

function readStore() {
  try {
    return JSON.parse(readFileSync(OUT, "utf8"));
  } catch {
    return { weeks: [] };
  }
}

function writeStore(weeks, extra = {}) {
  const body = {
    description:
      "One data/rates.json snapshot per Monday-start week: the latest scrape date in that week. Lowest 5-year rates and the Big Five 5-year fixed posted median are computed from that file. Null means the snapshot had no rate for that series. Weeks with no rate file are omitted here and left blank when the page is built. Not interpolated.",
    ...extra,
    weeks,
  };
  writeFileSync(OUT, `${JSON.stringify(body, null, 2)}\n`);
}

function snapshotsFromGit() {
  const log = execFileSync("git", ["log", "--format=%H", "--", "data/rates.json"], {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });
  const hashes = log.trim().split("\n").filter(Boolean);
  const batch = execFileSync("git", ["cat-file", "--batch"], {
    input: hashes.map((hash) => `${hash}:data/rates.json`).join("\n") + "\n",
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
  let weeks = [];
  let offset = 0;
  for (const hash of hashes) {
    const headerEnd = batch.indexOf("\n", offset);
    if (headerEnd < 0) break;
    const header = batch.slice(offset, headerEnd);
    const match = header.match(/ blob (\d+)$/);
    if (!match) {
      offset = headerEnd + 1;
      continue;
    }
    const size = Number(match[1]);
    const start = headerEnd + 1;
    const json = batch.slice(start, start + size);
    offset = start + size + 1;
    let payload;
    try {
      payload = JSON.parse(json);
    } catch (error) {
      console.warn(`skip ${hash}: ${error.message}`);
      continue;
    }
    const metrics = metricsFromRates(payload, { commit: hash });
    if (!metrics) {
      console.warn(`skip ${hash}: no scrape date`);
      continue;
    }
    weeks = upsertSnapshot(weeks, metrics);
  }
  return weeks;
}

if (fromGit) {
  const weeks = snapshotsFromGit();
  writeStore(weeks, { rebuiltFromGit: true });
  console.log(`wrote ${weeks.length} weekly rate-file snapshots`);
} else {
  const rates = JSON.parse(readFileSync("data/rates.json", "utf8"));
  const metrics = metricsFromRates(rates);
  if (!metrics) {
    console.warn("weekly snapshot skipped: data/rates.json has no scrape date");
    process.exit(0);
  }
  const store = readStore();
  const weeks = upsertSnapshot(store.weeks ?? [], metrics);
  writeStore(weeks, { rebuiltFromGit: store.rebuiltFromGit === true });
  console.log(`upserted week ${metrics.week_start} from ${metrics.snapshot_date}`);
}
