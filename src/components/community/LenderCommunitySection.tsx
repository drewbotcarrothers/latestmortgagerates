import {
  chartLenderProducts,
  communityRates,
  formatAsOf,
  formatRate,
  formatSpread,
  lenderBySlug,
  lenderName,
  omittedForMissingPosted,
  publicLenderProducts,
  termLabel,
} from "@/lib/communityRates";
import BankGapChart from "@/components/community/BankGapChart";

export default function LenderCommunitySection({ slug }: { slug: string }) {
  const lender = lenderBySlug(slug);
  if (!lender) return null;
  const name = lenderName(slug);
  const chartRows = chartLenderProducts(lender).map((product) => ({ lenderSlug: slug, product }));
  const tableRows = publicLenderProducts(lender);
  const omitted = omittedForMissingPosted(lender);

  return (
    <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby={`${slug}-reported`}>
      <h2 id={`${slug}-reported`} className="text-xl font-bold text-slate-900">
        Posted vs what borrowers actually get
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {name} rates {communityRates.attribution}, last 30 days, as of {formatAsOf()}.
        The posted rate is this bank&apos;s uninsured rate in the current snapshot. Insured status on the reports is often unstated, so each row combines every status.
      </p>
      {lender.matchedN >= communityRates.thresholds.publicMinN && lender.medianSpreadVsOwnPosted != null && (
        <p className="mt-3 text-sm text-slate-700">
          Where a report could be matched to {name}&apos;s own posted rate, the median discount is {formatSpread(lender.medianSpreadVsOwnPosted)} that posted rate (N = {lender.matchedN}).
        </p>
      )}
      {chartRows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">
          Fewer than {communityRates.thresholds.chartMinN} recent reports line up with a posted {name} product, so this page does not chart a comparison.
          {" "}
          <a href="/real-mortgage-rates/" className="font-medium text-teal-700 hover:underline">See rates people report across lenders</a>.
        </p>
      ) : (
        <div className="mt-5">
          <BankGapChart rows={chartRows} />
        </div>
      )}
      {tableRows.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="mb-2 text-left text-xs text-slate-500">
              Cells with N at least {communityRates.thresholds.publicMinN} only.
            </caption>
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3">Product</th>
                <th className="py-2 pr-3">N</th>
                <th className="py-2 pr-3">Reported median</th>
                <th className="py-2 pr-3">Posted</th>
                <th className="py-2">Gap</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((product) => (
                <tr key={`${product.termMonths}-${product.rateType}`} className="border-b border-slate-100">
                  <td className="py-2 pr-3 font-medium text-slate-900">{termLabel(product.termMonths)} {product.rateType}</td>
                  <td className="py-2 pr-3">{product.n}</td>
                  <td className="py-2 pr-3">{formatRate(product.reportedMedian)}</td>
                  <td className="py-2 pr-3">{formatRate(product.postedRate)}</td>
                  <td className="py-2">{formatSpread(product.spreadVsPosted)} posted</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {omitted.length > 0 && (
        <p className="mt-3 text-xs text-slate-500">
          {omitted.map((product) => `${termLabel(product.termMonths)} ${product.rateType} (N = ${product.n})`).join("; ")} omitted: no posted rate in this snapshot.
        </p>
      )}
      <p className="mt-4 text-sm text-slate-600">
        <a href="/real-mortgage-rates/" className="font-medium text-teal-700 hover:underline">Real mortgage rates</a>
        {" · "}
        <a href="/guides/negotiate-mortgage-rate/" className="font-medium text-teal-700 hover:underline">How to negotiate</a>
        {" · "}
        <a href="/tools/renewal-offer-checker/" className="font-medium text-teal-700 hover:underline">Check an offer</a>
      </p>
    </section>
  );
}
