import { useState } from "react";
import DataArticle from "@/views/data/DataArticle";
import WeeklyRateChart, { type WeeklySeriesMeta } from "@/components/WeeklyRateChart";
import { formatLongDate } from "@/lib/dataFormat";

const INSURED_HISTORY_LABEL = "Insured (under 20% down)";
const UNINSURED_HISTORY_LABEL = "Uninsured (20%+ down)";

export interface HistoryRow {
  week_start: string;
  lowest_5y_fixed_insured: number | null;
  lowest_5y_fixed_uninsured: number | null;
  lowest_5y_variable_insured: number | null;
  lowest_5y_variable_uninsured: number | null;
  big_five_median_5y_fixed_posted: number | null;
  big_bank_prime: number | null;
  lowest_snapshot_date: string | null;
  prime_snapshot_date: string | null;
  posted_snapshot_date: string | null;
  source_note: string;
}

export interface RateHistoryInput {
  rows: HistoryRow[];
  lenders: string[];
  asOf: string | null;
  dailyFrom: string | null;
  dailyTo: string | null;
  dailyCount: number;
  chartSvg: string;
  embedSnippet: string;
  series: WeeklySeriesMeta[];
}

function count(rows: HistoryRow[], key: keyof HistoryRow): number {
  return rows.filter((row) => row[key] != null).length;
}

function firstDate(rows: HistoryRow[], pick: (row: HistoryRow) => string | null): string | null {
  const dates = rows.map(pick).filter((date): date is string => Boolean(date)).sort();
  return dates[0] ?? null;
}

function lastDate(rows: HistoryRow[], pick: (row: HistoryRow) => string | null): string | null {
  const dates = rows.map(pick).filter((date): date is string => Boolean(date)).sort();
  return dates[dates.length - 1] ?? null;
}

export function rateHistoryLead(history: RateHistoryInput): string {
  const first = history.rows[0]?.week_start;
  const last = history.rows[history.rows.length - 1]?.week_start;
  const span =
    first && last
      ? `from the week of ${formatLongDate(first)} through the week of ${formatLongDate(last)}`
      : "from the snapshots stored in this project";
  return `Weekly Canadian mortgage rates ${span}. Each point is the latest stored snapshot in that Monday-to-Sunday week: the lowest 5-year fixed and variable rates for ${INSURED_HISTORY_LABEL} and ${UNINSURED_HISTORY_LABEL}, the Big Five median 5-year fixed posted rate, and big-bank prime. A blank cell has no stored observation. Nothing in this series is interpolated.`;
}

function cell(value: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  const rounded = Math.round(value * 1000) / 1000;
  const [whole, fraction = ""] = rounded.toFixed(3).replace(/0+$/, "").split(".");
  const decimals = (fraction + "00").slice(0, Math.max(2, fraction.length));
  return `${whole}.${decimals}%`;
}

export default function RateHistoryPage({ history }: { history: RateHistoryInput }) {
  const [copied, setCopied] = useState(false);
  const asOf = history.asOf ? formatLongDate(history.asOf) : "the latest stored snapshot";
  const rows = history.rows;
  const lowestWeeks = count(rows, "lowest_5y_fixed_insured");
  const postedWeeks = count(rows, "big_five_median_5y_fixed_posted");
  const primeWeeks = count(rows, "big_bank_prime");
  const lowestFrom = firstDate(rows, (row) => (row.lowest_5y_fixed_insured != null ? row.lowest_snapshot_date : null));
  const lowestTo = lastDate(rows, (row) => (row.lowest_5y_fixed_insured != null ? row.lowest_snapshot_date : null));
  const postedFrom = firstDate(rows, (row) =>
    row.big_five_median_5y_fixed_posted != null ? row.posted_snapshot_date : null,
  );
  const postedTo = lastDate(rows, (row) =>
    row.big_five_median_5y_fixed_posted != null ? row.posted_snapshot_date : null,
  );
  const primeFrom = firstDate(rows, (row) => (row.big_bank_prime != null ? row.prime_snapshot_date : null));
  const primeTo = lastDate(rows, (row) => (row.big_bank_prime != null ? row.prime_snapshot_date : null));

  return (
    <DataArticle
      title="Canadian mortgage rate history (weekly)"
      lead={rateHistoryLead(history)}
      asOf={asOf}
      currentPath="/mortgage-rate-history/"
    >
      <section>
        <h2 className="text-2xl font-bold text-slate-900">How this series is built</h2>
        <p className="mt-3">
          Lender websites are scraped twice a day, once in the morning and once in the evening, Eastern time. A lender counts toward a week&apos;s lowest rate only when that snapshot includes a 5-year rate for the product. If a page fails, that lender is missing until the next successful read. The current rate file includes {history.lenders.length} lenders: {history.lenders.join(", ")}.
        </p>
        <p className="mt-3">
          Lowest is the minimum advertised rate among rows with a 60-month term, that rate type, and that insurance status. {INSURED_HISTORY_LABEL} is a mortgage with less than 20% down. {UNINSURED_HISTORY_LABEL} is 20% or more down. The series does not treat a missing insurance status as either one.
        </p>
        <p className="mt-3">
          The Big Five median is the median 5-year fixed posted rate at TD, RBC, CIBC, BMO, and Scotiabank. For each bank, the posted rate on the {UNINSURED_HISTORY_LABEL} row is used when that row has one. Otherwise another 5-year fixed posted rate in the same file is used. A bank with no posted rate is left out. An odd count uses the middle value. An even count uses the average of the two middle values. The source note names the banks in the median. A week in which none of the five has a posted rate is blank. An advertised special is not copied in to stand for a missing posted rate.
        </p>
        <p className="mt-3">
          Big-bank prime is the prime stored in the daily history file behind the{" "}
          <a href="/trends/" className="text-teal-700 hover:underline">rate trends</a> page. That file currently holds {history.dailyCount} days
          {history.dailyFrom && history.dailyTo
            ? `, from ${formatLongDate(history.dailyFrom)} through ${formatLongDate(history.dailyTo)}`
            : ""}
          . It does not store prime for earlier dates, and this page does not reconstruct those weeks, so they are blank.
        </p>
        <p className="mt-3">
          The week starts on Monday. The value is the latest snapshot whose date falls in that Monday-to-Sunday week. From {history.dailyFrom ? formatLongDate(history.dailyFrom) : "the start of the daily history file"}, the lowest rates follow the daily history row when that row is the latest snapshot in the week, because that is the series on the trends page. A later rate-file snapshot in the same week is used when the daily file has no later date. One blank week is not filled from the week before or the week after.
        </p>
        <p className="mt-3">
          Last updated {asOf}. Lowest 5-year rates are populated for {lowestWeeks} of {rows.length} weeks
          {lowestFrom && lowestTo ? `, snapshots ${formatLongDate(lowestFrom)} through ${formatLongDate(lowestTo)}` : ""}.
          The Big Five posted median is populated for {postedWeeks} weeks
          {postedFrom && postedTo ? `, snapshots ${formatLongDate(postedFrom)} through ${formatLongDate(postedTo)}` : ""}.
          Big-bank prime is populated for {primeWeeks} weeks
          {primeFrom && primeTo ? `, snapshots ${formatLongDate(primeFrom)} through ${formatLongDate(primeTo)}` : ""}.
        </p>
        <p className="mt-3">
          The daily chart is on <a href="/trends/" className="text-teal-700 hover:underline">rate trends</a>.
          Individual published moves are in the{" "}
          <a href="/rate-changes/" className="text-teal-700 hover:underline">mortgage rate-change tracker</a>.
          The rest of the files are listed on <a href="/rate-data/" className="text-teal-700 hover:underline">rate data</a>.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900">Weekly chart</h2>
        <div className="mt-4">
          <WeeklyRateChart svg={history.chartSvg} series={history.series} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900">Embed this chart</h2>
        <p className="mt-3">
          The embed is the chart with a credit line. Paste the snippet as written. The link text is Latest Mortgage Rates, and it points at this page.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-800">{history.embedSnippet}</pre>
        <button
          type="button"
          className="mt-3 rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800"
          onClick={() => {
            navigator.clipboard.writeText(history.embedSnippet).then(() => {
              setCopied(true);
            }).catch(() => {
              setCopied(false);
            });
          }}
        >
          {copied ? "Copied" : "Copy embed code"}
        </button>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900">Download</h2>
        <p className="mt-3">
          <a href="/data/mortgage-rate-history.csv" className="font-medium text-teal-700 hover:underline">
            Download the weekly CSV
          </a>
          . Columns are week_start, each series, and a source note. The file is rebuilt on every site build, including the twice-daily scrape deploy. Empty cells are blank, not zero.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900">Weekly values</h2>
        <p className="mt-3">
          A dash is a missing observation. The Big Five cell is the median of the banks named in that row&apos;s source note. It is blank when none of the five had a 5-year fixed posted rate.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <caption className="sr-only">
              Weekly Canadian mortgage rates. Blank cells have no stored observation.
            </caption>
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3 font-semibold">Week starting</th>
                {history.series.map((series) => (
                  <th key={series.key} className="p-3 font-semibold">{series.label}</th>
                ))}
                <th className="p-3 font-semibold">Source note</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.week_start} className="border-t border-slate-200 align-top">
                  <td className="p-3 whitespace-nowrap">{formatLongDate(row.week_start)}</td>
                  <td className="p-3 whitespace-nowrap">{cell(row.lowest_5y_fixed_insured)}</td>
                  <td className="p-3 whitespace-nowrap">{cell(row.lowest_5y_fixed_uninsured)}</td>
                  <td className="p-3 whitespace-nowrap">{cell(row.lowest_5y_variable_insured)}</td>
                  <td className="p-3 whitespace-nowrap">{cell(row.lowest_5y_variable_uninsured)}</td>
                  <td className="p-3 whitespace-nowrap">{cell(row.big_five_median_5y_fixed_posted)}</td>
                  <td className="p-3 whitespace-nowrap">{cell(row.big_bank_prime)}</td>
                  <td className="p-3 min-w-[18rem] text-slate-600">{row.source_note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DataArticle>
  );
}
