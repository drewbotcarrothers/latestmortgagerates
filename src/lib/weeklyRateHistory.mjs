/**
 * Weekly mortgage-rate series for /mortgage-rate-history/.
 *
 * Sources, and only these:
 * - data/historical_rates.json — daily lowest 5-year rates and big-bank prime
 *   behind /trends/ (the scrape keeps about 90 days)
 * - data/weekly-rate-file-snapshots.json — one data/rates.json snapshot per
 *   week, taken from the rate files the daily scrape commits
 * - data/rates.json — the current rate file, applied on top when it is newer
 *   than the stored snapshot for its week
 *
 * A week is Monday–Sunday. The point is the latest snapshot dated inside that
 * week. Missing weeks and missing series stay null. Nothing is interpolated,
 * carried into the next week, or filled with zero.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const HISTORY_PATH = "/mortgage-rate-history/";
export const EMBED_PATH = "/embed/mortgage-rate-history/";
export const CSV_PATH = "/data/mortgage-rate-history.csv";
export const HISTORY_PAGE_URL = "https://latestmortgagerates.ca/mortgage-rate-history/";
export const EMBED_PAGE_URL = "https://latestmortgagerates.ca/embed/mortgage-rate-history/";
export const CSV_URL = "https://latestmortgagerates.ca/data/mortgage-rate-history.csv";

export const INSURED_HISTORY_LABEL = "Insured (under 20% down)";
export const UNINSURED_HISTORY_LABEL = "Uninsured (20%+ down)";

export const BIG_FIVE = [
  { slug: "td", name: "TD" },
  { slug: "rbc", name: "RBC" },
  { slug: "cibc", name: "CIBC" },
  { slug: "bmo", name: "BMO" },
  { slug: "scotiabank", name: "Scotiabank" },
];

/** Internal keys, in table and chart order. */
export const SERIES_KEYS = [
  "lowest_5y_fixed_insured",
  "lowest_5y_fixed_uninsured",
  "lowest_5y_variable_insured",
  "lowest_5y_variable_uninsured",
  "big_five_median_5y_fixed_posted",
  "big_bank_prime",
];

export const SERIES_META = [
  {
    key: "lowest_5y_fixed_insured",
    csv: "lowest_5y_fixed_insured_under_20_down",
    label: `Lowest 5-year fixed, ${INSURED_HISTORY_LABEL}`,
    color: "#0f766e",
    dash: false,
  },
  {
    key: "lowest_5y_fixed_uninsured",
    csv: "lowest_5y_fixed_uninsured_20_plus_down",
    label: `Lowest 5-year fixed, ${UNINSURED_HISTORY_LABEL}`,
    color: "#1d4ed8",
    dash: false,
  },
  {
    key: "lowest_5y_variable_insured",
    csv: "lowest_5y_variable_insured_under_20_down",
    label: `Lowest 5-year variable, ${INSURED_HISTORY_LABEL}`,
    color: "#c2410c",
    dash: false,
  },
  {
    key: "lowest_5y_variable_uninsured",
    csv: "lowest_5y_variable_uninsured_20_plus_down",
    label: `Lowest 5-year variable, ${UNINSURED_HISTORY_LABEL}`,
    color: "#a16207",
    dash: false,
  },
  {
    key: "big_five_median_5y_fixed_posted",
    csv: "big_five_median_5y_fixed_posted",
    label: "Big Five median 5-year fixed posted",
    color: "#334155",
    dash: true,
  },
  {
    key: "big_bank_prime",
    csv: "big_bank_prime",
    label: "Big-bank prime",
    color: "#be123c",
    dash: true,
  },
];

const LOWEST_KEYS = [
  "lowest_5y_fixed_insured",
  "lowest_5y_fixed_uninsured",
  "lowest_5y_variable_insured",
  "lowest_5y_variable_uninsured",
];

export function embedSnippet() {
  return `<iframe src="${EMBED_PAGE_URL}" title="Canadian mortgage rate history (weekly)" width="100%" height="520" style="border:0" loading="lazy"></iframe>\n<p>Source: <a href="${HISTORY_PAGE_URL}">Latest Mortgage Rates</a></p>`;
}

export function weekStart(isoDate) {
  const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const sinceMonday = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - sinceMonday);
  return date.toISOString().slice(0, 10);
}

export function addDays(isoDate, days) {
  const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** A stored rate. Zero and non-numbers are missing observations, not rates. */
export function positiveRate(value) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number <= 0 || number >= 25) return null;
  return Math.round(number * 10000) / 10000;
}

export function formatSeriesNumber(value) {
  if (value == null || !Number.isFinite(value)) return "";
  const rounded = Math.round(value * 1000) / 1000;
  const [whole, fraction = ""] = rounded.toFixed(3).replace(/0+$/, "").split(".");
  const decimals = (fraction + "00").slice(0, Math.max(2, fraction.length));
  return `${whole}.${decimals}`;
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(process.cwd(), relativePath), "utf8"));
}

function rowsOf(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.rates)) return payload.rates;
  return [];
}

function snapshotDate(rows) {
  let latest = null;
  for (const row of rows) {
    const raw = typeof row?.scraped_at === "string" ? row.scraped_at.slice(0, 10) : "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) continue;
    if (latest == null || raw > latest) latest = raw;
  }
  return latest;
}

/**
 * Lowest advertised 5-year rate for one insurance status.
 * Same filter as scraping/src/historical_rates.py: term 60, rate type, mortgage type.
 */
function lowestOf(rows, rateType, mortgageType) {
  let best = null;
  for (const row of rows) {
    if (Number(row?.term_months) !== 60) continue;
    if (row?.rate_type !== rateType) continue;
    if (row?.mortgage_type !== mortgageType) continue;
    const rate = positiveRate(row.rate);
    if (rate == null) continue;
    if (best == null || rate < best) best = rate;
  }
  return best;
}

/**
 * One posted rate per Big Five bank on 5-year fixed.
 * Prefer the uninsured row. Otherwise any 5-year fixed row that has posted_rate.
 * Within that pool, keep the posted rate on the lowest advertised rate.
 * Matches src/lib/rateSnapshot.ts.
 */
export function bigFivePostedMedian(rows) {
  const banks = [];
  const missing = [];
  for (const bank of BIG_FIVE) {
    const bankRows = rows.filter(
      (row) =>
        row?.lender_slug === bank.slug &&
        Number(row.term_months) === 60 &&
        row.rate_type === "fixed" &&
        positiveRate(row.posted_rate) != null,
    );
    if (bankRows.length === 0) {
      missing.push(bank.name);
      continue;
    }
    const uninsured = bankRows.filter((row) => row.mortgage_type === "uninsured");
    const pool = uninsured.length > 0 ? uninsured : bankRows;
    const chosen = [...pool].sort((a, b) => positiveRate(a.rate) - positiveRate(b.rate))[0];
    banks.push({
      slug: bank.slug,
      name: chosen.lender_name || bank.name,
      posted: positiveRate(chosen.posted_rate),
    });
  }
  const posted = banks.map((bank) => bank.posted).filter((rate) => rate != null);
  return {
    rate: median(posted),
    banks,
    missing,
  };
}

export function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid];
  return Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10000) / 10000;
}

export function lenderNames(rows) {
  const names = new Map();
  for (const row of rows) {
    if (!row?.lender_slug || names.has(row.lender_slug)) continue;
    names.set(row.lender_slug, row.lender_name || row.lender_slug);
  }
  return [...names.values()].sort((a, b) => a.localeCompare(b, "en-CA"));
}

/** Metrics for one rate-file snapshot. Null when the file has no scrape date. */
export function metricsFromRates(payload, extra = {}) {
  const rows = rowsOf(payload);
  const date = snapshotDate(rows);
  if (!date) return null;
  const posted = bigFivePostedMedian(rows);
  return {
    week_start: weekStart(date),
    snapshot_date: date,
    commit: extra.commit ?? null,
    lowest_5y_fixed_insured: lowestOf(rows, "fixed", "insured"),
    lowest_5y_fixed_uninsured: lowestOf(rows, "fixed", "uninsured"),
    lowest_5y_variable_insured: lowestOf(rows, "variable", "insured"),
    lowest_5y_variable_uninsured: lowestOf(rows, "variable", "uninsured"),
    big_five_median_5y_fixed_posted: posted.rate,
    posted_banks: posted.banks,
    posted_missing: posted.missing,
    lender_count: new Set(rows.map((row) => row?.lender_slug).filter(Boolean)).size,
  };
}

/** Keep the later snapshot when two rate files fall in the same week. */
export function upsertSnapshot(weeks, snapshot) {
  if (!snapshot?.week_start || !snapshot.snapshot_date) return [...(weeks ?? [])];
  if (weekStart(snapshot.snapshot_date) !== snapshot.week_start) return [...(weeks ?? [])];
  const next = [];
  let replaced = false;
  for (const week of weeks ?? []) {
    if (week.week_start !== snapshot.week_start) {
      next.push(week);
      continue;
    }
    replaced = true;
    if (week.snapshot_date > snapshot.snapshot_date) next.push(week);
    else next.push(snapshot);
  }
  if (!replaced) next.push(snapshot);
  next.sort((a, b) => (a.week_start < b.week_start ? -1 : a.week_start > b.week_start ? 1 : 0));
  return next;
}

function lowestBundle(snapshot) {
  if (!snapshot) return null;
  return {
    lowest_5y_fixed_insured: positiveRate(snapshot.lowest_5y_fixed_insured),
    lowest_5y_fixed_uninsured: positiveRate(snapshot.lowest_5y_fixed_uninsured),
    lowest_5y_variable_insured: positiveRate(snapshot.lowest_5y_variable_insured),
    lowest_5y_variable_uninsured: positiveRate(snapshot.lowest_5y_variable_uninsured),
  };
}

function lowestBundleFromDaily(row) {
  if (!row) return null;
  return {
    lowest_5y_fixed_insured: positiveRate(row.fixed_insured_best_rate),
    lowest_5y_fixed_uninsured: positiveRate(row.fixed_uninsured_best_rate),
    lowest_5y_variable_insured: positiveRate(row.variable_insured_best_rate),
    lowest_5y_variable_uninsured: positiveRate(row.variable_uninsured_best_rate),
  };
}

function blankRow(week) {
  return {
    week_start: week,
    lowest_5y_fixed_insured: null,
    lowest_5y_fixed_uninsured: null,
    lowest_5y_variable_insured: null,
    lowest_5y_variable_uninsured: null,
    big_five_median_5y_fixed_posted: null,
    big_bank_prime: null,
    lowest_snapshot_date: null,
    lowest_source: null,
    prime_snapshot_date: null,
    posted_snapshot_date: null,
    posted_banks: [],
    posted_missing: [],
    source_note: "",
  };
}

function joinNames(names) {
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

function shortBankName(bank) {
  return BIG_FIVE.find((item) => item.slug === bank.slug)?.name ?? bank.name;
}

function bankList(banks) {
  return banks.map((bank) => `${shortBankName(bank)} ${formatSeriesNumber(bank.posted)}%`).join(", ");
}

export function sourceNote(row) {
  const parts = [];
  if (row.lowest_snapshot_date) {
    const source =
      row.lowest_source === "daily-history"
        ? "daily history snapshot"
        : "rate-file snapshot";
    parts.push(`Lowest 5-year rates from the ${source} dated ${row.lowest_snapshot_date}.`);
  } else {
    parts.push("No stored lowest 5-year rates for this week.");
  }
  if (row.posted_snapshot_date && row.big_five_median_5y_fixed_posted != null) {
    const who = bankList(row.posted_banks);
    const missing = row.posted_missing?.length
      ? ` ${joinNames(row.posted_missing)} had no 5-year fixed posted rate in that file.`
      : "";
    parts.push(
      `Big Five median 5-year fixed posted from the rate-file snapshot dated ${row.posted_snapshot_date} (${who}).${missing}`,
    );
  } else {
    parts.push("No stored Big Five 5-year fixed posted median for this week.");
  }
  if (row.prime_snapshot_date && row.big_bank_prime != null) {
    parts.push(`Big-bank prime from the daily history snapshot dated ${row.prime_snapshot_date}.`);
  } else {
    parts.push("No stored big-bank prime for this week.");
  }
  return parts.join(" ");
}

function mergeWeek(week, fileSnapshot, dailyRow) {
  const row = blankRow(week);
  const fileDate = fileSnapshot?.snapshot_date ?? null;
  const dailyDate = dailyRow?.date ?? null;
  const useDailyLowest = dailyDate != null && (fileDate == null || dailyDate >= fileDate);
  const bundle = useDailyLowest ? lowestBundleFromDaily(dailyRow) : lowestBundle(fileSnapshot);
  if (bundle && (useDailyLowest ? dailyDate : fileDate)) {
    for (const key of LOWEST_KEYS) row[key] = bundle[key];
    row.lowest_snapshot_date = useDailyLowest ? dailyDate : fileDate;
    row.lowest_source = useDailyLowest ? "daily-history" : "rate-file";
  }
  const prime = positiveRate(dailyRow?.prime_rate);
  if (dailyDate && prime != null) {
    row.big_bank_prime = prime;
    row.prime_snapshot_date = dailyDate;
  }
  const posted = positiveRate(fileSnapshot?.big_five_median_5y_fixed_posted);
  if (fileDate && posted != null) {
    row.big_five_median_5y_fixed_posted = posted;
    row.posted_snapshot_date = fileDate;
    row.posted_banks = fileSnapshot.posted_banks ?? [];
    row.posted_missing = fileSnapshot.posted_missing ?? [];
  }
  row.source_note = sourceNote(row);
  return row;
}

/**
 * @param {{ fileSnapshots?: object[], dailyRows?: object[] }} input
 * fileSnapshots: weekly rate-file metrics. dailyRows: historical_rates.json data[].
 */
export function buildWeeklyRows({ fileSnapshots = [], dailyRows = [] } = {}) {
  const fileByWeek = new Map();
  for (const snapshot of fileSnapshots) {
    if (!snapshot?.week_start || !snapshot?.snapshot_date) continue;
    if (weekStart(snapshot.snapshot_date) !== snapshot.week_start) continue;
    const existing = fileByWeek.get(snapshot.week_start);
    if (!existing || snapshot.snapshot_date >= existing.snapshot_date) {
      fileByWeek.set(snapshot.week_start, snapshot);
    }
  }
  const dailyByWeek = new Map();
  for (const row of dailyRows) {
    if (!row?.date || !/^\d{4}-\d{2}-\d{2}$/.test(row.date)) continue;
    const week = weekStart(row.date);
    const existing = dailyByWeek.get(week);
    if (!existing || row.date > existing.date) dailyByWeek.set(week, row);
  }
  const keys = [...fileByWeek.keys(), ...dailyByWeek.keys()].sort();
  if (keys.length === 0) return [];
  const rows = [];
  for (let cursor = keys[0]; cursor <= keys[keys.length - 1]; cursor = addDays(cursor, 7)) {
    rows.push(mergeWeek(cursor, fileByWeek.get(cursor) ?? null, dailyByWeek.get(cursor) ?? null));
  }
  return rows;
}

export function seriesSpan(rows, key) {
  const present = rows.filter((row) => row[key] != null);
  if (present.length === 0) return null;
  const dates = present
    .map((row) => {
      if (key === "big_bank_prime") return row.prime_snapshot_date;
      if (key === "big_five_median_5y_fixed_posted") return row.posted_snapshot_date;
      return row.lowest_snapshot_date;
    })
    .filter(Boolean)
    .sort();
  return {
    fromWeek: present[0].week_start,
    toWeek: present[present.length - 1].week_start,
    weeks: present.length,
    firstSnapshot: dates[0] ?? null,
    lastSnapshot: dates[dates.length - 1] ?? null,
  };
}

export function csvEscape(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function toCsv(rows) {
  const header = ["week_start", ...SERIES_META.map((series) => series.csv), "source_note"];
  const lines = [header.join(",")];
  for (const row of rows) {
    const cells = [
      row.week_start,
      ...SERIES_META.map((series) => formatSeriesNumber(row[series.key])),
      row.source_note,
    ];
    lines.push(cells.map(csvEscape).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Multi-series SVG. A line stops at a blank week instead of bridging it. */
export function weeklyHistoryChartSvg(rows, options = {}) {
  const width = options.width ?? 760;
  const height = options.height ?? 320;
  const pad = { left: 48, right: 16, top: 16, bottom: 36 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const values = [];
  for (const row of rows) {
    for (const series of SERIES_META) {
      const value = row[series.key];
      if (value != null) values.push(value);
    }
  }
  if (values.length === 0 || rows.length === 0) return "";
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min -= 0.25;
    max += 0.25;
  }
  const padY = (max - min) * 0.12;
  min -= padY;
  max += padY;
  const xAt = (index) =>
    pad.left + (rows.length === 1 ? innerW / 2 : (index / (rows.length - 1)) * innerW);
  const yAt = (value) => pad.top + (1 - (value - min) / (max - min)) * innerH;
  const ticks = [max, (max + min) / 2, min];
  const grid = ticks
    .map((tick) => {
      const y = yAt(tick).toFixed(1);
      return `<line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" stroke="#e2e8f0" stroke-width="1"></line><text x="${pad.left - 8}" y="${Number(y) + 4}" text-anchor="end" font-size="11" fill="#64748b">${tick.toFixed(2)}</text>`;
    })
    .join("");
  const paths = SERIES_META.map((series) => {
    let d = "";
    let drawing = false;
    rows.forEach((row, index) => {
      const value = row[series.key];
      if (value == null) {
        drawing = false;
        return;
      }
      const x = xAt(index).toFixed(1);
      const y = yAt(value).toFixed(1);
      d += drawing ? `L${x},${y}` : `M${x},${y}`;
      drawing = true;
    });
    if (!d) return "";
    const dash = series.dash ? ` stroke-dasharray="5 4"` : "";
    return `<path d="${d}" fill="none" stroke="${series.color}" stroke-width="2"${dash}></path>`;
  }).join("");
  const step = Math.max(1, Math.ceil(rows.length / 6));
  const labels = rows
    .map((row, index) => ({ row, index }))
    .filter(({ index }) => {
      if (index === 0 || index === rows.length - 1) return true;
      if (index % step !== 0) return false;
      return rows.length - 1 - index >= step;
    })
    .map(({ row, index }) => {
      const anchor = index === 0 ? "start" : index === rows.length - 1 ? "end" : "middle";
      return `<text x="${xAt(index).toFixed(1)}" y="${height - 10}" text-anchor="${anchor}" font-size="11" fill="#64748b">${escapeXml(row.week_start)}</text>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Weekly Canadian mortgage rates. Each line is one series. A break means that week has no stored observation."><rect width="${width}" height="${height}" fill="#ffffff"></rect>${grid}${paths}${labels}</svg>`;
}

let cache;

/** Weekly rows for the page, the embed, and the CSV. Reads committed data files only. */
export function loadWeeklyHistory() {
  if (cache) return cache;
  const stored = readJson("data/weekly-rate-file-snapshots.json");
  const rates = readJson("data/rates.json");
  const historical = readJson("data/historical_rates.json");
  const live = metricsFromRates(rates);
  const fileSnapshots = upsertSnapshot(stored.weeks ?? [], live);
  const dailyRows = Array.isArray(historical?.data) ? historical.data : [];
  const rows = buildWeeklyRows({ fileSnapshots, dailyRows });
  cache = {
    rows,
    lenders: lenderNames(rowsOf(rates)),
    asOf: latestSnapshotDate(rows),
    dailyFrom: dailyRows[0]?.date ?? null,
    dailyTo: dailyRows[dailyRows.length - 1]?.date ?? null,
    dailyCount: dailyRows.length,
    chartSvg: weeklyHistoryChartSvg(rows),
    embedSnippet: embedSnippet(),
    csv: toCsv(rows),
  };
  return cache;
}

function latestSnapshotDate(rows) {
  const dates = [];
  for (const row of rows) {
    for (const date of [row.lowest_snapshot_date, row.posted_snapshot_date, row.prime_snapshot_date]) {
      if (date) dates.push(date);
    }
  }
  dates.sort();
  return dates[dates.length - 1] ?? null;
}

export function mortgageRateHistoryCsv() {
  return loadWeeklyHistory().csv;
}
