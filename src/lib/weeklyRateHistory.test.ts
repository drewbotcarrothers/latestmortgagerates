import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { rateSnapshot } from "./rateSnapshot.ts";
import {
  INSURED_HISTORY_LABEL,
  UNINSURED_HISTORY_LABEL,
  bigFivePostedMedian,
  buildWeeklyRows,
  embedSnippet,
  loadWeeklyHistory,
  metricsFromRates,
  positiveRate,
  toCsv,
  upsertSnapshot,
  weekStart,
  weeklyHistoryChartSvg,
} from "./weeklyRateHistory.mjs";

const root = fileURLToPath(new URL("../..", import.meta.url));

function daily(date: string, fixedInsured: number, prime: number) {
  return {
    date,
    fixed_insured_best_rate: fixedInsured,
    fixed_uninsured_best_rate: fixedInsured + 0.2,
    variable_insured_best_rate: fixedInsured - 0.4,
    variable_uninsured_best_rate: fixedInsured - 0.2,
    prime_rate: prime,
  };
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (quoted) {
      if (char === '"' && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else current += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      cells.push(current);
      current = "";
    } else current += char;
  }
  cells.push(current);
  return cells;
}

function fileWeek(date: string, fixedInsured: number, median: number | null) {
  return {
    week_start: weekStart(date),
    snapshot_date: date,
    lowest_5y_fixed_insured: fixedInsured,
    lowest_5y_fixed_uninsured: fixedInsured + 0.25,
    lowest_5y_variable_insured: fixedInsured - 0.5,
    lowest_5y_variable_uninsured: fixedInsured - 0.3,
    big_five_median_5y_fixed_posted: median,
    posted_banks: median == null ? [] : [{ slug: "td", name: "TD", posted: median }],
    posted_missing: median == null ? ["RBC", "CIBC", "BMO", "Scotiabank"] : [],
  };
}

describe("weekly rate history", () => {
  it("starts weeks on Monday and treats zero as missing", () => {
    assert.equal(weekStart("2026-11-24"), "2026-11-23");
    assert.equal(weekStart("2026-03-01"), "2026-02-23");
    assert.equal(weekStart("2026-08-24"), "2026-08-24");
    assert.equal(positiveRate(0), null);
    assert.equal(positiveRate("0"), null);
    assert.equal(positiveRate(3.74), 3.74);
  });

  it("leaves a week blank instead of interpolating or carrying the previous rate", () => {
    const rows = buildWeeklyRows({
      fileSnapshots: [fileWeek("2026-03-06", 4, 6), fileWeek("2026-03-20", 4.4, 6.2)],
      dailyRows: [],
    });
    assert.deepEqual(
      rows.map((row) => row.week_start),
      ["2026-03-02", "2026-03-09", "2026-03-16"],
    );
    assert.equal(rows[0].lowest_5y_fixed_insured, 4);
    assert.equal(rows[1].lowest_5y_fixed_insured, null);
    assert.equal(rows[1].big_five_median_5y_fixed_posted, null);
    assert.equal(rows[1].big_bank_prime, null);
    assert.match(rows[1].source_note, /No stored lowest 5-year rates/);
    assert.equal(rows[2].lowest_5y_fixed_insured, 4.4);
    assert.notEqual(rows[1].lowest_5y_fixed_insured, 4.2);
  });

  it("uses the later snapshot in the week and does not pull prime from another week", () => {
    const rows = buildWeeklyRows({
      fileSnapshots: [fileWeek("2026-11-24", 3.4, 6.19)],
      dailyRows: [daily("2026-11-23", 3.5, 4.7), daily("2026-11-17", 3.2, 4.45)],
    });
    const current = rows.find((row) => row.week_start === "2026-11-23");
    const previous = rows.find((row) => row.week_start === "2026-11-16");
    assert.ok(current && previous);
    assert.equal(current.lowest_5y_fixed_insured, 3.4);
    assert.equal(current.lowest_source, "rate-file");
    assert.equal(current.big_bank_prime, 4.7);
    assert.equal(previous.big_bank_prime, 4.45);
    assert.equal(previous.lowest_5y_fixed_insured, 3.2);
    assert.equal(previous.big_five_median_5y_fixed_posted, null);
  });

  it("prefers the daily history row when it is the latest snapshot that week", () => {
    const rows = buildWeeklyRows({
      fileSnapshots: [fileWeek("2026-11-23", 9, 6)],
      dailyRows: [daily("2026-11-24", 4.34, 4.7)],
    });
    const row = rows[0];
    assert.equal(row.lowest_5y_fixed_insured, 4.34);
    assert.equal(row.lowest_source, "daily-history");
    assert.equal(row.big_five_median_5y_fixed_posted, 6);
    assert.equal(row.big_bank_prime, 4.7);
  });

  it("keeps an older rate-file snapshot when the new one is from a previous date", () => {
    const kept = upsertSnapshot(
      [fileWeek("2026-11-24", 4, 6.19)],
      fileWeek("2026-11-23", 9, 1),
    );
    assert.equal(kept.length, 1);
    assert.equal(kept[0].lowest_5y_fixed_insured, 4);
  });

  it("breaks the chart line across a blank week", () => {
    const rows = buildWeeklyRows({
      fileSnapshots: [fileWeek("2026-03-02", 4, 6), fileWeek("2026-03-16", 4.2, null)],
      dailyRows: [],
    });
    const svg = weeklyHistoryChartSvg(rows);
    const paths = [...svg.matchAll(/stroke="#0f766e"[^>]*|d="[^"]*"/g)].map((match) => match[0]);
    const line = svg.match(/stroke="#0f766e"/);
    assert.ok(line);
    const insured = svg.split('stroke="#0f766e"')[0];
    const path = insured.match(/d="(M[^"]*)"/);
    assert.ok(path);
    assert.equal((path[1].match(/M/g) || []).length, 2);
    assert.equal(paths.length > 0, true);
  });

  it("matches the live rate file and the daily history, and writes blank CSV cells", () => {
    const history = loadWeeklyHistory();
    const historical = JSON.parse(readFileSync(join(root, "data/historical_rates.json"), "utf8")) as {
      data: { date: string; fixed_insured_best_rate: number; prime_rate: number }[];
    };
    const store = JSON.parse(readFileSync(join(root, "data/weekly-rate-file-snapshots.json"), "utf8")) as {
      weeks: { week_start: string; big_five_median_5y_fixed_posted: number | null }[];
    };
    const live = metricsFromRates(JSON.parse(readFileSync(join(root, "data/rates.json"), "utf8")));
    assert.ok(live);
    assert.ok(history.rows.length >= 40);
    assert.equal(history.rows[0].week_start, store.weeks[0].week_start);
    assert.equal(history.rows[0].week_start, "2026-02-23");
    for (const row of history.rows) {
      assert.equal(weekStart(row.week_start), row.week_start);
      for (const key of [
        "lowest_5y_fixed_insured",
        "lowest_5y_fixed_uninsured",
        "lowest_5y_variable_insured",
        "lowest_5y_variable_uninsured",
        "big_five_median_5y_fixed_posted",
        "big_bank_prime",
      ] as const) {
        const value = row[key];
        if (value != null) assert.ok(value > 0 && value < 25, `${row.week_start} ${key}`);
      }
    }
    const current = history.rows.find((row) => row.week_start === live.week_start);
    const latestDaily = [...historical.data].reverse().find((row) => weekStart(row.date) === live.week_start);
    assert.ok(current && latestDaily);
    assert.equal(current.big_five_median_5y_fixed_posted, live.big_five_median_5y_fixed_posted);
    assert.equal(current.big_five_median_5y_fixed_posted, rateSnapshot.fixed.big5Posted?.rate);
    if (latestDaily.date >= live.snapshot_date) {
      assert.equal(current.lowest_5y_fixed_insured, latestDaily.fixed_insured_best_rate);
      assert.equal(current.lowest_snapshot_date, latestDaily.date);
    } else {
      assert.equal(current.lowest_5y_fixed_insured, live.lowest_5y_fixed_insured);
      assert.equal(current.lowest_snapshot_date, live.snapshot_date);
    }
    assert.equal(current.big_bank_prime, latestDaily.prime_rate);

    const augustFile = store.weeks.find((week) => week.week_start === "2026-08-24");
    const august = history.rows.find((row) => row.week_start === "2026-08-24");
    const augustDaily = [...historical.data].reverse().find((row) => weekStart(row.date) === "2026-08-24");
    assert.ok(augustFile && august && augustDaily);
    assert.equal(augustFile.big_five_median_5y_fixed_posted, null);
    assert.equal(august.big_five_median_5y_fixed_posted, null);
    assert.equal(august.big_bank_prime, augustDaily.prime_rate);
    assert.ok(august.lowest_5y_fixed_insured != null);

    const early = history.rows.find((row) => row.big_bank_prime == null && row.lowest_5y_fixed_insured != null);
    assert.ok(early);
    assert.match(early.source_note, /No stored big-bank prime/);

    const csv = toCsv(history.rows);
    assert.match(
      csv.split("\n")[0],
      /^week_start,lowest_5y_fixed_insured_under_20_down,lowest_5y_fixed_uninsured_20_plus_down,lowest_5y_variable_insured_under_20_down,lowest_5y_variable_uninsured_20_plus_down,big_five_median_5y_fixed_posted,big_bank_prime,source_note$/,
    );
    const earlyCells = parseCsvLine(csv.split("\n").find((line) => line.startsWith(`${early.week_start},`)) ?? "");
    assert.equal(earlyCells[6], "");
    assert.notEqual(earlyCells[1], "");
    assert.notEqual(earlyCells[1], "0");
    assert.doesNotMatch(csv, />20%|&gt;20%/);
  });

  it("computes the Big Five posted median from posted_rate only", () => {
    const median = bigFivePostedMedian([
      { lender_slug: "td", term_months: 60, rate_type: "fixed", mortgage_type: "uninsured", rate: 4.5, posted_rate: 6.1 },
      { lender_slug: "rbc", term_months: 60, rate_type: "fixed", mortgage_type: "uninsured", rate: 4.4, posted_rate: 6.3 },
      { lender_slug: "cibc", term_months: 60, rate_type: "fixed", mortgage_type: "uninsured", rate: 4.2, posted_rate: null },
      { lender_slug: "bmo", term_months: 60, rate_type: "fixed", mortgage_type: "insured", rate: 4.1, posted_rate: 6.5 },
      { lender_slug: "scotiabank", term_months: 60, rate_type: "fixed", mortgage_type: "uninsured", rate: 4, posted_rate: 0 },
    ]);
    assert.equal(median.rate, 6.3);
    assert.deepEqual(median.missing, ["CIBC", "Scotiabank"]);
    const live = metricsFromRates(JSON.parse(readFileSync(join(root, "data/rates.json"), "utf8")));
    assert.equal(live?.big_five_median_5y_fixed_posted, rateSnapshot.fixed.big5Posted?.rate);
    assert.equal(live?.posted_missing.length, 0);
  });

  it("uses the citeable labels and the credit anchor, with no surname", () => {
    const snippet = embedSnippet();
    assert.match(snippet, /<a href="https:\/\/latestmortgagerates\.ca\/mortgage-rate-history\/">Latest Mortgage Rates<\/a>/);
    assert.equal(INSURED_HISTORY_LABEL, "Insured (under 20% down)");
    assert.equal(UNINSURED_HISTORY_LABEL, "Uninsured (20%+ down)");
    const files = [
      "src/lib/weeklyRateHistory.mjs",
      "src/views/data/RateHistoryPage.tsx",
      "src/views/data/RateHistoryEmbed.tsx",
      "src/pages/mortgage-rate-history/index.astro",
      "src/pages/embed/mortgage-rate-history/index.astro",
      "data/weekly-rate-file-snapshots.json",
    ];
    const forbidden = /carrothers|>20%|&gt;20%/i;
    for (const file of files) {
      const source = readFileSync(join(root, file), "utf8");
      assert.equal(forbidden.test(source), false, file);
    }
    const page = readFileSync(join(root, "src/views/data/RateHistoryPage.tsx"), "utf8");
    assert.match(page, /Insured \(under 20% down\)/);
    assert.match(page, /Uninsured \(20%\+ down\)/);
    assert.match(page, /\/trends\//);
    assert.match(page, /\/rate-data\//);
    assert.match(page, /\/rate-changes\//);
    assert.match(page, /\/data\/mortgage-rate-history\.csv/);
    const embed = readFileSync(join(root, "src/views/data/RateHistoryEmbed.tsx"), "utf8");
    assert.match(embed, />\s*Latest Mortgage Rates\s*</);
  });
});
