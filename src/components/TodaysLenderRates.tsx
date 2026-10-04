import { formatBuildDateLong } from "@/lib/buildDate";
import {
  buildTodayRows,
  formatCell,
  formatGap,
  type ScrapedRate,
} from "@/lib/todaysRates";

interface TodaysLenderRatesProps {
  lenderName: string;
  rates: ScrapedRate[];
  buildDateIso: string;
}

export default function TodaysLenderRates({ lenderName, rates, buildDateIso }: TodaysLenderRatesProps) {
  const rows = buildTodayRows(rates);
  const updated = formatBuildDateLong(new Date(buildDateIso));

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden" aria-labelledby="todays-rates-heading">
      <div className="p-6 border-b border-slate-200">
        <h2 id="todays-rates-heading" className="text-2xl font-bold text-slate-900">
          Today&apos;s {lenderName} rates
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Updated {updated}. Lowest scraped quote for each term. A dash means that product is not in this scrape. The gap is the posted rate minus the discounted rate on the same row, and only when the scrape includes a posted rate. HELOC pricing is not in this mortgage scrape, so no HELOC rate is shown.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">
            Today&apos;s {lenderName} mortgage rates as of {updated}
          </caption>
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Product</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Insured</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Uninsured</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Posted</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Posted vs discounted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="px-4 py-3 text-left font-medium text-slate-900">
                  {row.label}
                  {row.unlabeled != null ? (
                    <span className="block text-xs font-normal text-slate-500">
                      Unlabelled product {formatCell(row.unlabeled)}
                    </span>
                  ) : null}
                </th>
                <td className="px-4 py-3 text-slate-700">{formatCell(row.insured)}</td>
                <td className="px-4 py-3 text-slate-700">{formatCell(row.uninsured)}</td>
                <td className="px-4 py-3 text-slate-700">{formatCell(row.posted)}</td>
                <td className="px-4 py-3 text-slate-700">{formatGap(row.gap)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
