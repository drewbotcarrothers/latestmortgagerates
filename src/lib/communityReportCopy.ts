import {
  buildTakeaways,
  communityRates,
  distributionFor,
  formatAsOf,
  formatRate,
} from "./communityRates";

const CHART_MARKER = "<!--COMMUNITY_CHARTS-->";

export function october2026Report() {
  const fixed = distributionFor(60, "fixed", "all");
  const variable = distributionFor(60, "variable", "all");
  const takeaways = buildTakeaways();
  const asOf = formatAsOf();
  const fixedMedian = fixed ? formatRate(fixed.median) : "—";
  const variableMedian = variable ? formatRate(variable.median) : "—";
  const fixedN = fixed?.n ?? 0;
  const variableN = variable?.n ?? 0;
  const fixedShare = fixed?.shareBelowBig5 == null ? "—" : `${Math.round(fixed.shareBelowBig5 * 100)}%`;
  const variableShare = variable?.shareBelowBig5 == null ? "—" : `${Math.round(variable.shareBelowBig5 * 100)}%`;

  const title = "Below-the-Line Mortgage Rate Report: October 2026";
  const excerpt = `As of ${asOf}, the median 5-year variable rate ${communityRates.attribution} is ${variableMedian} (N = ${variableN}) and the median 5-year fixed rate is ${fixedMedian} (N = ${fixedN}). ${variableShare} of 5-year variable reports sit below the Big-5 posted median.`;

  const content = `<p class="mb-4">Posted mortgage rates and the rates people actually receive are not the same number. This October 2026 report compares rates ${communityRates.attribution} with the posted rates in our ${asOf} snapshot. The figures below are read from that file. They are self-reported, unverified, and not a mortgage offer.</p>

<p class="mb-4">Counting every insured status over the 30 days ending ${asOf}, the median 5-year fixed report is <strong>${fixedMedian}</strong> (N = ${fixedN}) and the median 5-year variable report is <strong>${variableMedian}</strong> (N = ${variableN}). ${fixedShare} of the 5-year fixed reports are below the Big-5 posted median of ${fixed ? formatRate(fixed.big5PostedMedian) : "—"}, and ${variableShare} of the 5-year variable reports are below ${variable ? formatRate(variable.big5PostedMedian) : "—"}. Prime assumed for variable effective rates is ${formatRate(communityRates.prime)}.</p>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">What the medians say</h2>

<ul class="list-disc pl-5 space-y-2 mb-6">
${takeaways.map((line) => `<li>${line}</li>`).join("\n")}
</ul>

${CHART_MARKER}

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">How to use this</h2>

<p class="mb-4">If a renewal letter is above the reported median for your term, that is a reason to ask for a better number, not a guarantee you will get the median. Insured status is often missing from the reports, so compare like with like when you can. Cells are published only when N is at least ${communityRates.thresholds.publicMinN}. Rates on the charts are rounded to the nearest 0.05.</p>

<p class="mb-4">The full table, the distribution, and the weekly series live on the <a href="/real-mortgage-rates/" class="text-teal-600 hover:underline font-medium">real mortgage rates</a> page. To place one offer on the distribution, use the <a href="/tools/renewal-offer-checker/" class="text-teal-600 hover:underline font-medium">renewal offer checker</a>. For the conversation with your bank, read <a href="/guides/negotiate-mortgage-rate/" class="text-teal-600 hover:underline font-medium">how much below posted people negotiate</a>. Bank-level gaps for <a href="/lenders/td/" class="text-teal-600 hover:underline">TD</a>, <a href="/lenders/rbc/" class="text-teal-600 hover:underline">RBC</a>, <a href="/lenders/cibc/" class="text-teal-600 hover:underline">CIBC</a>, <a href="/lenders/bmo/" class="text-teal-600 hover:underline">BMO</a>, and <a href="/lenders/scotiabank/" class="text-teal-600 hover:underline">Scotiabank</a> are on each lender page when the sample is large enough.</p>

<p class="mb-4">Posted rates move with the snapshot. The community medians move when the file is replaced. The rules for collection, medians, the prime assumption, and the N threshold are on the <a href="/methodology/" class="text-teal-600 hover:underline font-medium">methodology</a> page.</p>`;

  return {
    slug: "below-the-line-mortgage-rate-report-october-2026",
    title,
    excerpt,
    content,
    author: "Andrew",
    authorTitle: "Rate Analyst",
    date: "2026-10-03",
    category: "rates" as const,
    tags: ["real mortgage rates", "below posted", "renewal", "rate report", "October 2026"],
    readTime: 7,
    featured: true,
    image: "/logo.png",
    chartMarker: CHART_MARKER,
  };
}

export const COMMUNITY_CHART_MARKER = CHART_MARKER;
