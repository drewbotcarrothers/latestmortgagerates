import DataArticle from "@/views/data/DataArticle";
import { communityRates, formatAsOf } from "@/lib/communityRates";
import { DISCOUNT_MIN_N, discountRows, quarterLabel, widestPublishedGap, withSnapshotPostedRates } from "@/lib/discountByBank";
import { publishedRates } from "@/lib/publishedRates";
import { formatPct } from "@/lib/dataFormat";

function discountLenders() {
  return withSnapshotPostedRates(communityRates.lenders, publishedRates);
}

function points(value: number): string {
  return `${value.toFixed(2)} percentage points`;
}

export function discountLead(): string {
  const rows = discountRows(discountLenders(), communityRates.lenderNames);
  const quarter = quarterLabel(communityRates.asOf);
  const best = widestPublishedGap(rows);
  const fixedPublished = rows.some((row) => row.fixed);
  const headline = best
    ? `In ${quarter}, the widest published gap is ${points(best.cell.pointsBelow)} below ${best.row.name}'s own posted 5-year ${best.rateType} rate, from ${best.cell.n} reports.`
    : `In ${quarter}, no lender has both ${DISCOUNT_MIN_N} or more reports and a posted rate in the file, so no gap is published.`;
  const fixedNote = fixedPublished
    ? "Five-year fixed gaps are published only for lenders that clear the same count."
    : `No lender has ${DISCOUNT_MIN_N} or more self-reported 5-year fixed rates with a posted rate in the file, so no 5-year fixed gap is published.`;
  return `${headline} ${fixedNote}`;
}

export default function DiscountByBankPage() {
  const rows = discountRows(discountLenders(), communityRates.lenderNames);
  const quarter = quarterLabel(communityRates.asOf);
  const asOf = formatAsOf(communityRates.asOf);

  return (
    <DataArticle
      title="How far below posted rates Canadians report getting, by bank"
      lead={discountLead()}
      asOf={`${quarter}, ${asOf}`}
      currentPath="/reports/discount-by-bank/"
      badge={quarter}
    >
      <section>
        <h2 className="text-2xl font-bold text-slate-900">{quarter} median gap versus each lender's posted rate</h2>
        <p className="mt-3">
          Rates here are {communityRates.attribution}. They are unverified and not a mortgage offer.
          A cell is published only when N is at least {DISCOUNT_MIN_N} and the file has that lender's own posted rate for the same 5-year product.
          The gap is the posted rate minus the reported median, rounded to the nearest 0.05. A positive number means the reported median is below posted.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3 font-semibold">Lender</th>
                <th className="p-3 font-semibold">5-year fixed</th>
                <th className="p-3 font-semibold">N</th>
                <th className="p-3 font-semibold">5-year variable</th>
                <th className="p-3 font-semibold">N</th>
              </tr>
            </thead>
            <tbody>
              {rows.filter((row) => row.fixed || row.variable).map((row) => (
                <tr key={row.slug} className="border-t border-slate-200">
                  <td className="p-3 font-medium">{row.name}</td>
                  <td className="p-3">
                    {row.fixed ? `${points(row.fixed.pointsBelow)} below ${formatPct(row.fixed.postedRate)}` : "—"}
                  </td>
                  <td className="p-3">{row.fixed ? row.fixed.n : "—"}</td>
                  <td className="p-3">
                    {row.variable ? `${points(row.variable.pointsBelow)} below ${formatPct(row.variable.postedRate)}` : "—"}
                  </td>
                  <td className="p-3">{row.variable ? row.variable.n : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-600">{communityRates.disclaimer}</p>
      </section>

      {rows.some((row) => row.omitted.length) ? (
        <section>
          <h2 className="text-2xl font-bold text-slate-900">Counted, but not published as a gap</h2>
          <p className="mt-3">
            These products have at least {DISCOUNT_MIN_N} reports and no posted rate in the file. The count is shown. The gap is not, because there is no posted shelf to subtract from.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {rows.flatMap((row) =>
              row.omitted.map((item) => (
                <li key={`${row.slug}-${item.rateType}`}>{row.name}, 5-year {item.rateType}: N = {item.n}</li>
              )),
            )}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="text-2xl font-bold text-slate-900">How to read the quarter</h2>
        <p className="mt-3">
          The quarter label follows the as-of date on the reported-rate file, {asOf}. The medians are the ones already stored for each lender and product.
          The published gap is rounded to the nearest 0.05.
          Compare the same file on <a href="/real-mortgage-rates/" className="text-teal-700 hover:underline">real mortgage rates</a> and in the{" "}
          <a href="/blog/below-the-line-mortgage-rate-report-october-2026/" className="text-teal-700 hover:underline">October 2026 rate report</a>.
          The extraction rules are on the <a href="/methodology/" className="text-teal-700 hover:underline">methodology</a> page.
        </p>
      </section>
    </DataArticle>
  );
}
