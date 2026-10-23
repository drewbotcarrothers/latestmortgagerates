/**
 * Append published-rate changes to data/rate-changes.json.
 *
 *   node scripts/append-rate-changes.mjs            # HEAD vs the working tree
 *   node scripts/append-rate-changes.mjs --backfill # walk git history of data/rates.json
 *
 * The daily scrape commits the history file with the new rates. The site
 * build reads the file. It does not need git.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { canonicalRates, changeId, diffRates, rowsFromPayload } from "../src/lib/rateChanges.mjs";

const HISTORY = "data/rate-changes.json";
const backfill = process.argv.includes("--backfill");

function readSnapshot(ref) {
  const raw = ref
    ? execFileSync("git", ["show", `${ref}:data/rates.json`], {
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
      })
    : readFileSync("data/rates.json", "utf8");
  return canonicalRates(rowsFromPayload(JSON.parse(raw)));
}

function loadHistory() {
  if (!existsSync(HISTORY)) {
    return {
      description:
        "Published mortgage-rate changes detected between snapshots of data/rates.json. A product that appears or disappears is not recorded as a price change.",
      changes: [],
    };
  }
  return JSON.parse(readFileSync(HISTORY, "utf8"));
}

function writeHistory(history) {
  history.updatedAt = new Date().toISOString();
  history.changeCount = history.changes.length;
  writeFileSync(HISTORY, `${JSON.stringify(history)}\n`);
}

function remember(history, fresh) {
  const seen = new Set(history.changes.map(changeId));
  const added = [];
  for (const change of fresh) {
    const id = changeId(change);
    if (seen.has(id)) continue;
    seen.add(id);
    added.push(change);
  }
  return added;
}

if (backfill) {
  const log = execFileSync("git", ["log", "--reverse", "--format=%H%x09%cI", "--", "data/rates.json"], {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });
  const commits = log
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, observedAt] = line.split("\t");
      return { hash, observedAt };
    });
  let previous = null;
  const changes = [];
  let index = 0;
  for (const commit of commits) {
    index += 1;
    let current;
    try {
      current = readSnapshot(commit.hash);
    } catch (error) {
      console.warn(`skip ${commit.hash}: ${error.message}`);
      continue;
    }
    if (previous) changes.push(...diffRates(previous, current, commit.observedAt));
    previous = current;
    if (index % 100 === 0) console.log(`backfill ${index}/${commits.length}, ${changes.length} changes`);
  }
  const history = loadHistory();
  history.description =
    "Published mortgage-rate changes detected between git snapshots of data/rates.json. A product that appears or disappears is not recorded as a price change.";
  history.changes = [];
  history.changes.push(...remember(history, changes));
  history.backfilledFrom = commits[0]?.observedAt?.slice(0, 10) ?? null;
  history.backfilledTo = commits[commits.length - 1]?.observedAt?.slice(0, 10) ?? null;
  writeHistory(history);
  console.log(`backfill wrote ${history.changes.length} changes`);
} else {
  let previous;
  try {
    previous = readSnapshot("HEAD");
  } catch (error) {
    console.warn(`rate-change append skipped, git history unavailable: ${error.message}`);
    process.exit(0);
  }
  const current = readSnapshot(null);
  const fresh = diffRates(previous, current, new Date().toISOString());
  const history = loadHistory();
  const added = remember(history, fresh);
  if (!added.length) {
    console.log("no new published-rate changes");
    process.exit(0);
  }
  history.changes.push(...added);
  writeHistory(history);
  console.log(`appended ${added.length} rate changes`);
}
