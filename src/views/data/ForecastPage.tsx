import DataArticle from "@/views/data/DataArticle";
import { bondSnapshot } from "@/lib/bondYieldArticle";
import { formatLongDate, formatPct } from "@/lib/dataFormat";
import {
  forecastsCompiled,
  policyPrimeRange,
  publishedForecasts,
  yieldSpreadRange,
} from "@/lib/forecast2027";
import type { BondSeries } from "@/lib/loadMarketSeries";
import { publishedRates } from "@/lib/publishedRates";

export function forecastLead(): string {
  const range = policyPrimeRange(publishedForecasts);
  if (!range) {
    return "The forecast table includes only figures copied from a cited bank publication. Where a publication does not state an end-2027 policy rate, the cell is left blank.";
  }
  return `The published end-2027 Bank of Canada overnight rates in this table run from ${formatPct(range.lowPolicy)} to ${formatPct(range.highPolicy)}. Adding the ${range.spread.toFixed(2)} percentage-point big-bank prime spread used on this site puts prime at ${formatPct(range.lowPrime)} to ${formatPct(range.highPrime)}, which is arithmetic on those forecasts, not a forecast by this site.`;
}

function cell(value: number | null): string {
  return value == null ? "Not stated" : formatPct(value);
}

function publishedLabel(iso: string): string {
  return iso.length === 7 ? iso : formatLongDate(iso);
}

export default function ForecastPage({
  bond,
  fiveYearSummary,
}: {
  bond: BondSeries;
  fiveYearSummary: { lendersHiked: number; lendersCut: number; from: string; to: string; events: number };
}) {
  const lead = forecastLead();
  const snap = bondSnapshot(bond, publishedRates);
  const spread = snap.lowestSpread;
  const yieldRange = yieldSpreadRange(publishedForecasts, spread);
  const asOf = snap.asOf ? formatLongDate(snap.asOf) : formatLongDate(forecastsCompiled);

  return (
    <DataArticle
      title="Canadian mortgage rate forecast 2027"
      lead={lead}
      asOf={asOf}
      currentPath="/mortgage-rate-forecast-2027/"
      badge="Updated after each Bank of Canada decision"
    >
      <section>
        <h2 className="text-2xl font-bold text-slate-900">Published forecasts</h2>
        <p className="mt-3">
          Each row is one official economics publication. The number is the figure that publication states for the end of 2027, or for the fourth quarter of 2027, as the basis column says.
          A blank cell means that publication does not state the figure. Nothing here is filled in from a later note, a different PDF, or a guess about the size of a hike.
          Compiled {formatLongDate(forecastsCompiled)}.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3 font-semibold">Institution</th>
                <th className="p-3 font-semibold">Published</th>
                <th className="p-3 font-semibold">Overnight / policy rate</th>
                <th className="p-3 font-semibold">5-year yield</th>
              </tr>
            </thead>
            <tbody>
              {publishedForecasts.map((forecast) => (
                <tr key={forecast.institution} className="border-t border-slate-200 align-top">
                  <td className="p-3">
                    <a href={forecast.url} className="font-medium text-teal-700 hover:underline">{forecast.institution}</a>
                    <span className="mt-1 block text-xs text-slate-500">{forecast.publication}</span>
                  </td>
                  <td className="p-3">{publishedLabel(forecast.published)}</td>
                  <td className="p-3">
                    {cell(forecast.policyRate)}
                    {forecast.policyBasis ? <span className="mt-1 block text-xs text-slate-500">{forecast.policyBasis}</span> : null}
                  </td>
                  <td className="p-3">
                    {cell(forecast.fiveYearYield)}
                    {forecast.yieldBasis ? <span className="mt-1 block text-xs text-slate-500">{forecast.yieldBasis}</span> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
          {publishedForecasts.map((forecast) => (
            <li key={`${forecast.institution}-note`}>
              <a href={forecast.url} className="text-teal-700 hover:underline">{forecast.institution}</a>: {forecast.note}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900">What this site's data shows</h2>
        <p className="mt-3">
          {snap.latest && snap.benchmarks.lowest && spread != null
            ? `On ${snap.latest.date}, the Government of Canada 5-year benchmark yield was ${formatPct(snap.latest.yield)}. The lowest 5-year fixed in the ${asOf} rate file, ${formatPct(snap.benchmarks.lowest.rate)} at ${snap.benchmarks.lowest.lenderName}, sits ${Math.abs(spread).toFixed(2)} percentage points above that yield.`
            : "The bond yield or the 5-year fixed shelf was not available when this page was built."}
          {snap.benchmarks.big5Median != null && snap.medianSpread != null
            ? ` The Big Five median uninsured 5-year fixed is ${formatPct(snap.benchmarks.big5Median)}, ${Math.abs(snap.medianSpread).toFixed(2)} percentage points above the same yield.`
            : ""}
        </p>
        <p className="mt-3">
          In the 30 days from {formatLongDate(fiveYearSummary.from)} to {formatLongDate(fiveYearSummary.to)}, {fiveYearSummary.lendersHiked} lenders finished with a higher published 5-year fixed and {fiveYearSummary.lendersCut} finished lower, across {fiveYearSummary.events} advertised-rate changes.
          The dated log is the <a href="/rate-changes/" className="text-teal-700 hover:underline">rate-change tracker</a>.
          The yield series and the chart are on the <a href="/blog/bond-yields-mortgage-rates-explained/" className="text-teal-700 hover:underline">bond-yield page</a>.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900">Scenarios, not a site forecast</h2>
        <p className="mt-3">
          If big-bank prime kept today's {policyPrimeRange(publishedForecasts)?.spread.toFixed(2)} percentage-point gap over the overnight target, the published policy-rate range above would line up with a prime of {formatPct(policyPrimeRange(publishedForecasts)?.lowPrime)} to {formatPct(policyPrimeRange(publishedForecasts)?.highPrime)}.
          That is the same arithmetic as the opening sentences. It assumes the banks keep the spread. It is not a prediction that they will.
        </p>
        {yieldRange ? (
          <p className="mt-3">
            The published 5-year yields in the table run from {formatPct(yieldRange.lowYield)} to {formatPct(yieldRange.highYield)}.
            If the lowest 5-year fixed kept today's spread of {yieldRange.currentSpread.toFixed(2)} percentage points over the bond, those yields would line up with a mortgage rate of {formatPct(yieldRange.lowMortgage)} to {formatPct(yieldRange.highMortgage)}.
            Scotiabank and Desjardins do not state a 5-year yield in the publications used here, so they are outside that range.
            The spread can narrow or widen. This is a scenario, labelled as one.
          </p>
        ) : null}
        <p className="mt-3">
          Desjardins' October 22, 2026 outlook says it expects a first increase at the October 2026 decision and another in January 2027.
          It does not state how large those increases are, so this page does not turn that sentence into a policy-rate number.
          CIBC's end-2027 figures are from the June 24, 2026 forecast update, which is older than the October tables from the other banks.
        </p>
      </section>
    </DataArticle>
  );
}
