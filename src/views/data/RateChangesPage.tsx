import DataArticle from "@/views/data/DataArticle";
import { formatLongDate, formatPct } from "@/lib/dataFormat";

export interface RateChangeRow {
  date: string;
  lender_name: string;
  lender_slug: string;
  term_months: number;
  rate_type: string;
  mortgage_type: string;
  field: string;
  previous: number;
  rate: number;
  direction: string;
}

export interface FiveYearSummary {
  asOf: string;
  from: string;
  to: string;
  events: number;
  lendersCut: number;
  lendersHiked: number;
  lendersWithCutEvent: number;
  lendersWithHikeEvent: number;
}

function termLabel(months: number): string {
  if (months % 12 === 0) {
    const years = months / 12;
    return `${years}-year`;
  }
  return `${months}-month`;
}

function fieldLabel(field: string): string {
  return field === "posted_rate" ? "posted" : "advertised";
}

export function rateChangeLead(summary: FiveYearSummary): string {
  const from = formatLongDate(summary.from);
  const to = formatLongDate(summary.to);
  const reversed =
    summary.lendersWithCutEvent > summary.lendersCut
      ? ` ${summary.lendersWithCutEvent} lenders cut a 5-year fixed at some point in the window, including cuts that were later reversed.`
      : "";
  const lower = summary.lendersCut === 0 ? "none finished lower" : `${summary.lendersCut} finished lower`;
  return `In the 30 days from ${from} to ${to}, ${summary.lendersHiked} lenders finished with a higher published 5-year fixed than they started, and ${lower}. The log records ${summary.events} five-year fixed advertised-rate changes in that window.${reversed}`;
}

export default function RateChangesPage({
  summary,
  fiveYearRows,
  recentRows,
  totalCount,
  backfilledFrom,
}: {
  summary: FiveYearSummary;
  fiveYearRows: RateChangeRow[];
  recentRows: RateChangeRow[];
  totalCount: number;
  backfilledFrom: string;
}) {
  const asOf = formatLongDate(summary.asOf);
  return (
    <DataArticle
      title="Mortgage rate-change tracker"
      lead={rateChangeLead(summary)}
      asOf={asOf}
      currentPath="/rate-changes/"
    >
      <section>
        <h2 className="text-2xl font-bold text-slate-900">Last 30 days, 5-year fixed</h2>
        <p className="mt-3">
          A lender counts as higher or lower only by comparing the rate at the start of the window with the rate at the end.
          A cut that was followed by a larger hike finishes higher, so it is not counted as a lender that cut.
          The count is of lenders, across insured and uninsured rows, not of individual products.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <dt className="text-sm text-slate-500">Finished higher</dt>
            <dd className="text-2xl font-bold text-slate-900">{summary.lendersHiked} lenders</dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <dt className="text-sm text-slate-500">Finished lower</dt>
            <dd className="text-2xl font-bold text-slate-900">{summary.lendersCut} lenders</dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <dt className="text-sm text-slate-500">Advertised-rate changes</dt>
            <dd className="text-2xl font-bold text-slate-900">{summary.events}</dd>
          </div>
        </dl>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Lender</th>
                <th className="p-3 font-semibold">Product</th>
                <th className="p-3 font-semibold">From</th>
                <th className="p-3 font-semibold">To</th>
              </tr>
            </thead>
            <tbody>
              {fiveYearRows.map((row, index) => (
                <tr key={`${row.date}-${row.lender_slug}-${row.mortgage_type}-${index}`} className="border-t border-slate-200">
                  <td className="p-3">{formatLongDate(row.date)}</td>
                  <td className="p-3">{row.lender_name}</td>
                  <td className="p-3">{row.mortgage_type} 5-year fixed</td>
                  <td className="p-3">{formatPct(row.previous)}</td>
                  <td className="p-3">{formatPct(row.rate)} ({row.direction})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900">Latest changes, any product</h2>
        <p className="mt-3">
          The committed history holds {totalCount.toLocaleString("en-CA")} changes, backfilled from git snapshots of the rate file beginning {formatLongDate(backfilledFrom)}.
          The newest 25 are below. The full log stays in the data file and is not loaded into the page.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Lender</th>
                <th className="p-3 font-semibold">Product</th>
                <th className="p-3 font-semibold">Field</th>
                <th className="p-3 font-semibold">From</th>
                <th className="p-3 font-semibold">To</th>
              </tr>
            </thead>
            <tbody>
              {recentRows.map((row, index) => (
                <tr key={`${row.date}-${row.lender_slug}-${row.term_months}-${row.field}-${index}`} className="border-t border-slate-200">
                  <td className="p-3">{formatLongDate(row.date)}</td>
                  <td className="p-3">{row.lender_name}</td>
                  <td className="p-3">{row.mortgage_type} {termLabel(row.term_months)} {row.rate_type}</td>
                  <td className="p-3">{fieldLabel(row.field)}</td>
                  <td className="p-3">{formatPct(row.previous)}</td>
                  <td className="p-3">{formatPct(row.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          The log records a numeric change between two scrapes. That includes a product that was relabelled, a correction, or a scrape that bounced and came back.
          It is not a list of announcements the lenders published. A product that appears for the first time, or drops out of the file, is not counted as a price change.
          Open terms are left out.
        </p>
      </section>
    </DataArticle>
  );
}
