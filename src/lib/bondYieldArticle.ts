import { publishedRates } from "./publishedRates";
import { fiveYearFixedBenchmarks, spreadOverYield, type FixedBenchmarks } from "./bondSpread";
import { latestBondYield, monthEndYields } from "./marketSeries.mjs";
import { seriesChartSvg } from "./seriesChart";
import { formatLongDate, formatPct, latestScrapeDate } from "./dataFormat";
import { cachedBondSeries, type BondSeries } from "./loadMarketSeries";

export const BOND_SLUG = "bond-yields-mortgage-rates-explained";

export interface BondArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorTitle: string;
  date: string;
  category: "rates";
  tags: string[];
  readTime: number;
  featured: boolean;
  image: string;
  yieldDate: string | null;
  yieldValue: number | null;
  asOf: string | null;
}

function versus(spread: number): string {
  const points = `${Math.abs(spread).toFixed(2)} percentage points`;
  if (spread > 0) return `${points} above`;
  if (spread < 0) return `${points} below`;
  return "in line with";
}

function mortgageLabel(value: string): string {
  if (value === "insured") return "insured";
  if (value === "uninsured") return "uninsured";
  if (value === "insurable") return "insurable";
  return "mortgage type not labelled";
}

export function bondSnapshot(series: BondSeries = cachedBondSeries(), rows = publishedRates) {
  const latest = latestBondYield(series);
  const benchmarks: FixedBenchmarks = fiveYearFixedBenchmarks(rows);
  const asOf = latestScrapeDate(rows);
  const lowestSpread =
    latest && benchmarks.lowest ? spreadOverYield(benchmarks.lowest.rate, latest.yield) : null;
  const medianSpread =
    latest && benchmarks.big5Median != null ? spreadOverYield(benchmarks.big5Median, latest.yield) : null;
  return { latest, benchmarks, asOf, lowestSpread, medianSpread, series };
}

export function bondYieldsBlogPost(series?: BondSeries): BondArticle {
  const snap = bondSnapshot(series);
  const { latest, benchmarks, asOf, lowestSpread, medianSpread } = snap;
  const asOfLabel = asOf ? formatLongDate(asOf) : "the latest rate file";
  const yieldLabel = latest ? formatPct(latest.yield) : "unavailable";
  const yieldDate = latest ? formatLongDate(latest.date) : "the latest observation";
  const lowest = benchmarks.lowest;
  const title = "5-year fixed rates and the Canada 5-year bond yield";

  const excerpt =
    latest && lowest && lowestSpread != null && benchmarks.big5Median != null && medianSpread != null
      ? `The lowest 5-year fixed in the ${asOfLabel} rate file is ${formatPct(lowest.rate)} at ${lowest.lenderName} (${mortgageLabel(lowest.mortgageType)}), ${versus(lowestSpread)} the Government of Canada 5-year benchmark yield of ${yieldLabel} on ${yieldDate}. The Big Five median uninsured 5-year fixed is ${formatPct(benchmarks.big5Median)}, ${versus(medianSpread)} that same yield.`
      : `The spread between this site's 5-year fixed rates and the Government of Canada 5-year bond yield is published when both the rate file and the Bank of Canada series are available.`;

  const points = (snap.series.observations ?? []).map((row: { date: string; yield: number }) => ({
    date: row.date,
    value: row.yield,
  }));
  const lines = [];
  if (lowest) {
    lines.push({ value: lowest.rate, label: `Lowest 5-year fixed ${formatPct(lowest.rate)}`, color: "#b45309" });
  }
  if (benchmarks.big5Median != null) {
    lines.push({
      value: benchmarks.big5Median,
      label: `Big Five median ${formatPct(benchmarks.big5Median)}`,
      color: "#1d4ed8",
    });
  }
  const chart = seriesChartSvg({
    points,
    lines,
    mode: "line",
    ariaLabel: `Government of Canada 5-year benchmark bond yield from ${points[0]?.date ?? ""} to ${points[points.length - 1]?.date ?? ""}, with today's 5-year fixed rates marked`,
  });

  const months = monthEndYields(snap.series.observations ?? []) as { date: string; yield: number }[];
  const monthRows = months
    .map(
      (row) =>
        `<tr><td>${formatLongDate(row.date)}</td><td>${formatPct(row.yield)}</td></tr>`,
    )
    .join("");

  const big5Rows = benchmarks.big5Quotes
    .map(
      (quote) =>
        `<tr><td>${quote.lenderName}</td><td>${formatPct(quote.rate)}</td><td>${latest ? versus(spreadOverYield(quote.rate, latest.yield)) : "—"}</td></tr>`,
    )
    .join("");

  const content = `<p class="mb-4">Fixed mortgage rates in Canada are priced off lenders' own funding costs, and the usual public benchmark for a five-year fixed is the Government of Canada 5-year bond. This page subtracts that yield from the 5-year fixed rates in our rate file. The difference is the spread. It is not a fee, and it is not a prediction.</p>

<h2>The current spread</h2>
<p class="mb-4">The yield is Bank of Canada Valet series <code>BD.CDN.5YR.DQ.YLD</code>, the benchmark bond yield at the 5-year point on the Government of Canada curve. The latest observation used here is ${yieldLabel} on ${yieldDate}. The mortgage rates are from the rate file dated ${asOfLabel}. The lowest closed 5-year fixed in that file is ${lowest ? `${formatPct(lowest.rate)} at ${lowest.lenderName}, ${mortgageLabel(lowest.mortgageType)}` : "not available"}. The Big Five median is the middle uninsured 5-year fixed after RBC, TD, Scotiabank, BMO, and CIBC are sorted. With five banks, that is the third rate.</p>
<p class="mb-4">The chart below is the bond yield. The dashed lines are today's mortgage rates, drawn across the whole window so you can see the gap. They are not a history of mortgage rates. A day when the yield rises and the mortgage lines stay put is a day the spread got smaller. The mortgage lines move only when this page is rebuilt from a new rate file.</p>
<div class="my-6">${chart}</div>

<h2>Big Five uninsured 5-year fixed</h2>
<table>
  <thead><tr><th>Lender</th><th>Uninsured 5-year fixed</th><th>Versus the latest yield</th></tr></thead>
  <tbody>${big5Rows}</tbody>
</table>
<p class="mb-4">Insured 5-year fixed rates can be lower than these uninsured specials. The lowest rate in the opening sentence keeps its insured or uninsured label so the two figures are not mixed. Open terms are left out.</p>

<h2>Month-end yields</h2>
<p class="mb-4">Each row is the last observation of that month in the cached series. The source is the same Valet series, not a second estimate.</p>
<table>
  <thead><tr><th>Month-end observation</th><th>5-year benchmark yield</th></tr></thead>
  <tbody>${monthRows}</tbody>
</table>

<h2>What the spread is, and what it is not</h2>
<p class="mb-4">A lender funding a five-year fixed mortgage is taking five years of rate risk. The 5-year Canada bond is the public price of a similar term. When that yield rises, the cost of hedging or of holding the mortgage usually rises with it, and posted fixed rates tend to follow, often before the Bank of Canada has changed the overnight rate. Variable and adjustable mortgages are different. They are priced off prime, and prime moves with the overnight target. A bond-yield move does not, by itself, change a variable payment.</p>
<p class="mb-4">The spread is the room between the bond and the mortgage rate on the day both were observed. A wider spread means the mortgage rate is further above the bond. A narrower spread means less room. Lenders do not all move on the same morning, the lowest rate may be insured, and a special can sit well below a posted shelf. None of that is a promise that the spread will stay at today's width. The <a href="/mortgage-rate-forecast-2027/">2027 forecast page</a> shows what the banks publish for the policy rate and for 5-year yields, and it applies today's spread only as a labelled scenario.</p>
<p class="mb-4">Read the live shelf on the <a href="/rates/5-year-fixed/">5-year fixed</a> page, the policy rate on the <a href="/prime-rate/">prime rate</a> page, and the dated log on the <a href="/rate-changes/">rate-change tracker</a>. The yield series is the Bank of Canada's. The mortgage rates are ours.</p>`;

  return {
    slug: BOND_SLUG,
    title,
    excerpt,
    content,
    author: "Andrew",
    authorTitle: "Rate Analyst",
    date: asOf ?? latest?.date ?? "2026-10-23",
    category: "rates",
    tags: ["bond yields", "5-year fixed", "spread", "Bank of Canada"],
    readTime: 8,
    featured: false,
    image: "/blog/bond-yields.jpg",
    yieldDate: latest?.date ?? null,
    yieldValue: latest?.yield ?? null,
    asOf,
  };
}
