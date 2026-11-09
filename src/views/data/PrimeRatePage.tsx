import DataArticle from "@/views/data/DataArticle";
import { seriesChartSvg } from "@/lib/seriesChart";
import { formatLongDate, formatPct } from "@/lib/dataFormat";
import { BIG6, primeAnnouncements, primeFileFacts, type PrimeRateRow } from "@/lib/primeData";
import { publishedRates } from "@/lib/publishedRates";
import type { PolicySeries } from "@/lib/loadMarketSeries";

function money(value: number | null): string {
  return formatPct(value);
}

export function primeLead(rows: readonly PrimeRateRow[], asOfLabel: string): string {
  const facts = primeFileFacts(rows);
  const scraped = facts.scraped
    .map((row) => `${money(row.prime)} at ${row.name}`)
    .join(" and ");
  const scrapedSentence = facts.scraped.length
    ? `The rate file records a scraped prime of ${scraped}.`
    : "The rate file does not record a scraped prime for any lender.";
  return `The big-bank consensus prime is ${money(facts.prime)} as of ${asOfLabel}, ${facts.spread.toFixed(2)} percentage points above the Bank of Canada overnight target of ${money(facts.policyRate)}. ${scrapedSentence}`;
}

export default function PrimeRatePage({ policy }: { policy: PolicySeries }) {
  const facts = primeFileFacts(publishedRates);
  const asOf = facts.asOf ? formatLongDate(facts.asOf) : "the latest rate file";
  const lead = primeLead(publishedRates, asOf);
  const chart = seriesChartSvg({
    points: policy.changes.map((change) => ({ date: change.date, value: change.rate })),
    mode: "step",
    ariaLabel: "Bank of Canada target for the overnight rate, from the first 2022 observation in Valet series V39079 through the latest change",
  });
  const decisions = [
    ...primeAnnouncements.remaining2026.map((row) => ({ ...row, year: "2026" })),
    ...primeAnnouncements.year2027.map((row) => ({ ...row, year: "2027" })),
  ];

  return (
    <DataArticle
      title="Prime rate in Canada today"
      lead={lead}
      asOf={asOf}
      currentPath="/prime-rate/"
    >
      <section>
        <h2 className="text-2xl font-bold text-slate-900">Lender prime rates</h2>
        <p className="mt-3">
          The daily rate file covers {facts.lenderCount} lenders. Only rows that store a prime field are listed as scraped primes.
          The big-bank figure is the consensus in the site config: the overnight target plus {facts.spread.toFixed(2)} percentage points.
          It is the prime used for RBC, TD, Scotiabank, BMO, CIBC, and National Bank on this page, except where a scraped number is different.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3 font-semibold">Lender</th>
                <th className="p-3 font-semibold">Prime</th>
                <th className="p-3 font-semibold">How it is sourced</th>
              </tr>
            </thead>
            <tbody>
              {BIG6.map((bank) => (
                <tr key={bank.slug} className="border-t border-slate-200">
                  <td className="p-3">{bank.name}</td>
                  <td className="p-3">{money(facts.prime)}</td>
                  <td className="p-3">Consensus: policy rate plus {facts.spread.toFixed(2)}</td>
                </tr>
              ))}
              {facts.scraped.map((row) => (
                <tr key={row.slug} className="border-t border-slate-200">
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">{money(row.prime)}</td>
                  <td className="p-3">
                    Scraped prime field
                    {row.sourceUrl ? (
                      <>
                        {" "}
                        (<a href={row.sourceUrl} className="text-teal-700 hover:underline">source page</a>)
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {facts.tdVariablePosted != null ? (
          <p className="mt-3 text-sm text-slate-600">
            TD's uninsured 5-year variable row in the same file stores a posted rate of {money(facts.tdVariablePosted)}.
            The site config describes that as TD's separate mortgage prime, last checked against RBC's prime page on the date in the source note below.
            It is not a new scrape of a TD prime page.
          </p>
        ) : null}
        <p className="mt-3 text-sm text-slate-600">Source note from the prime config: {facts.source}</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900">Bank of Canada policy rate, 2022 to 2026</h2>
        <p className="mt-3">
          The chart and table are Bank of Canada Valet series {policy.series}, the target for the overnight rate.
          Each row is the first date the series prints a new target, except the opening row, which is the rate already in force at the start of the window.
          A hold, including the September 2, 2026 hold at {money(facts.policyRate)}, does not add a row because the target did not change.
          Observations in the cached series run through {policy.observationsThrough ? formatLongDate(policy.observationsThrough) : "the latest fetch"}.
        </p>
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3" dangerouslySetInnerHTML={{ __html: chart }} />
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3 font-semibold">Series date</th>
                <th className="p-3 font-semibold">Target overnight rate</th>
              </tr>
            </thead>
            <tbody>
              {policy.changes.map((change, index) => (
                <tr key={change.date} className="border-t border-slate-200">
                  <td className="p-3">{formatLongDate(change.date)}{index === 0 ? " (start of window)" : ""}</td>
                  <td className="p-3">{money(change.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Source: <a href={policy.source} className="text-teal-700 hover:underline">Bank of Canada Valet, series {policy.series}</a>.
          The series date is the business day the new target appears in the data, which is often the day after the announcement.
          This page does not attach a separate press-release URL to each row.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900">Next decision dates</h2>
        <p className="mt-3">
          Announcements are at {primeAnnouncements.announcementTime}. {primeAnnouncements.mprNote}
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Monetary Policy Report</th>
              </tr>
            </thead>
            <tbody>
              {decisions.map((row) => (
                <tr key={row.date} className="border-t border-slate-200">
                  <td className="p-3">{formatLongDate(row.date)}</td>
                  <td className="p-3">{row.monetaryPolicyReport ? "Published with this decision" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Source: <a href={primeAnnouncements.source} className="text-teal-700 hover:underline">{primeAnnouncements.sourceTitle}</a>
          {" "}and the <a href={primeAnnouncements.keyRatePage} className="text-teal-700 hover:underline">key interest rate page</a>.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900">What prime means for a mortgage</h2>
        <p className="mt-3">
          A variable-rate mortgage and a home equity line of credit are usually priced as prime plus or minus a margin set in the contract.
          When the Bank of Canada changes the overnight target and the banks follow, prime moves by the same amount and that margin stays put.
          The payment consequence depends on the product.
        </p>
        <p className="mt-3">
          On many variable-rate mortgages (often called a VRM), the regular payment stays the same when prime changes, and the split between interest and principal changes instead.
          If prime rises far enough, the fixed payment may no longer cover the interest, and the amortization can extend. The contract sets the trigger and the lender's options.
          This page does not state a payment rule for any one bank.
        </p>
        <p className="mt-3">
          On an adjustable-rate mortgage (ARM), the payment itself is recalculated when prime changes, so the amortization stays closer to the original schedule and the monthly amount moves.
          A HELOC is usually interest-only at prime plus or minus a margin. The minimum payment moves with prime because the interest charge moves.
          None of these are offers, and the contract, not this page, decides which rule applies.
        </p>
        <p className="mt-3">
          The September 2, 2026 hold is written up in the{" "}
          <a href="/blog/bank-of-canada-holds-rate-september-2026/" className="text-teal-700 hover:underline">Bank of Canada hold note</a>.
          The glossary entry is{" "}
          <a href="/glossary/prime-rate/" className="text-teal-700 hover:underline">prime rate</a>.
          Fixed rates, which follow bond yields rather than prime, are on the{" "}
          <a href="/blog/bond-yields-mortgage-rates-explained/" className="text-teal-700 hover:underline">bond-yield spread page</a>.
        </p>
      </section>
    </DataArticle>
  );
}
