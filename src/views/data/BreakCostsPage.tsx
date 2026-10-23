import DataArticle from "@/views/data/DataArticle";
import {
  BREAK_BALANCE,
  BREAK_MONTHS,
  FCAC_PENALTY_URL,
  breakExplanation,
  breakFileDate,
  breakLead,
  buildBreakExamples,
} from "@/lib/breakCosts";
import { formatCad, formatLongDate, formatPct } from "@/lib/dataFormat";
import { publishedRates } from "@/lib/publishedRates";

export default function BreakCostsPage() {
  const examples = buildBreakExamples(publishedRates);
  const fileDate = breakFileDate(publishedRates);
  const asOf = fileDate ? formatLongDate(fileDate) : "the latest rate file";
  const lead = breakLead(examples, asOf);
  const paragraphs = breakExplanation(examples, asOf);

  return (
    <DataArticle
      title="What breaking a 5-year fixed costs at each Big 5 bank today"
      lead={lead}
      asOf={asOf}
      currentPath="/mortgage-break-costs/"
    >
      <section>
        <h2 className="text-2xl font-bold text-slate-900">Illustrative posted-rate IRD</h2>
        <p className="mt-3">
          Same balance, same remaining term, each bank's own uninsured rates from the rate file.
          A blank interest-rate differential means the file does not have both posted shelves the formula needs.
          The figure is an illustration, not a payout quote.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3 font-semibold">Bank</th>
                <th className="p-3 font-semibold">Contract rate</th>
                <th className="p-3 font-semibold">5-year posted</th>
                <th className="p-3 font-semibold">3-year posted</th>
                <th className="p-3 font-semibold">Assumed discount</th>
                <th className="p-3 font-semibold">Comparison rate</th>
                <th className="p-3 font-semibold">IRD</th>
                <th className="p-3 font-semibold">3 months' interest</th>
                <th className="p-3 font-semibold">Greater of the two</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((example) => (
                <tr key={example.slug} className="border-t border-slate-200 align-top">
                  <td className="p-3 font-medium">
                    {example.lenderName}
                    {example.sourceUrl ? (
                      <a href={example.sourceUrl} className="mt-1 block text-xs font-normal text-teal-700 hover:underline">Rate page</a>
                    ) : null}
                  </td>
                  <td className="p-3">{formatPct(example.contractRate)}</td>
                  <td className="p-3">{formatPct(example.originalPosted)}</td>
                  <td className="p-3">{formatPct(example.comparisonPosted)}</td>
                  <td className="p-3">{formatPct(example.discount)}</td>
                  <td className="p-3">{formatPct(example.comparisonRate)}</td>
                  <td className="p-3">{example.complete ? formatCad(example.ird) : "—"}</td>
                  <td className="p-3">{formatCad(example.threeMonth)}</td>
                  <td className="p-3">
                    {formatCad(example.penalty)}
                    {example.binding === "ird" ? <span className="mt-1 block text-xs text-slate-500">IRD is higher</span> : null}
                    {example.binding === "three_months" ? <span className="mt-1 block text-xs text-slate-500">Three months is higher</span> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
          {examples.map((example) => (
            <li key={`${example.slug}-reason`}>{example.lenderName}: {example.reason}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900">Assumptions</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Balance {formatCad(BREAK_BALANCE)}, with {BREAK_MONTHS} months left on a 5-year fixed.</li>
          <li>The contract rate is that bank's current uninsured 5-year fixed special in the rate file.</li>
          <li>The original discount is assumed to equal today's posted-minus-special gap. The funding-day posted rate is not in the file.</li>
          <li>The comparison posted rate is the current 3-year posted rate. Thirty-six months is an exact 3-year term, so the remainder is not rounded to a neighbouring term.</li>
          <li>The charge shown is the greater of that posted-rate IRD and three months' interest on the balance. Administration and discharge fees are excluded.</li>
        </ul>
        <p className="mt-3">
          Run your own numbers in the{" "}
          <a href="/tools/mortgage-penalty-calculator/" className="text-teal-700 hover:underline">mortgage penalty calculator</a>.
          The{" "}
          <a href="/guides/mortgage-prepayment-penalties/" className="text-teal-700 hover:underline">prepayment penalties guide</a>{" "}
          sets the posted method next to the discounted method. The consumer explanation of the two charges is from the{" "}
          <a href={FCAC_PENALTY_URL} className="text-teal-700 hover:underline">Financial Consumer Agency of Canada</a>.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900">How the posted-rate differential works</h2>
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className="mt-3">{paragraph}</p>
        ))}
      </section>
    </DataArticle>
  );
}
