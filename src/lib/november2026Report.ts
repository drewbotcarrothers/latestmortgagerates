import snapshotData from "../data/below-the-line-october-2026.json";
import {
  communityRates,
  formatAsOf,
  formatRate,
  formatSpread,
  lenderName,
  productLabel,
  roundToNickel,
  type ProductCell,
  type RateType,
} from "./communityRates";

const CHART_MARKER = "<!--NOVEMBER_2026_REPORT_CHARTS-->";

export const NOVEMBER_2026_SLUG = "below-the-line-mortgage-rate-report-november-2026";
export const NOVEMBER_DATA_AS_OF = "2026-10-31";
export const NOVEMBER_BORROWER_FROM = "2026-10-01";
export const NOVEMBER_POSTED_FROM = "2026-10-03";
export const NOVEMBER_TEMPORAL_COVERAGE = `${NOVEMBER_BORROWER_FROM}/${NOVEMBER_DATA_AS_OF}`;
export const NOVEMBER_CHART_MARKER = CHART_MARKER;
export const PUBLIC_CELL_MIN_N = 10;

/**
 * Advertised-rate changes (the rate field) on 3- and 5-year products in
 * data/rate-changes.json for October 2026. A test recomputes these from that file.
 */
export const OCTOBER_2026_RATE_CHANGES = {
  total: 140,
  increases: 120,
  decreases: 20,
  lenders: 24,
  products: [
    { termMonths: 60, rateType: "fixed" as const, label: "5-year fixed", increases: 43, decreases: 8 },
    { termMonths: 36, rateType: "fixed" as const, label: "3-year fixed", increases: 31, decreases: 8 },
    { termMonths: 60, rateType: "variable" as const, label: "5-year variable", increases: 39, decreases: 4 },
    { termMonths: 36, rateType: "variable" as const, label: "3-year variable", increases: 7, decreases: 0 },
  ],
  variableIncreasesOnOrAfterPrime: 36,
  variableIncreasesOfQuarterPoint: 33,
};

interface RawCell {
  term: number;
  type: RateType;
  insured: "all" | "insured" | "uninsured";
  n: number;
  median?: number;
  p25?: number;
  big5PostedMedian?: number | null;
  lowestPosted?: number | null;
  lowestLenderMostOften?: string | null;
  belowBig5?: number | null;
  vsLowest?: number | null;
  shareBelowBig5?: number | null;
  pd?: number | null;
  publish?: boolean;
}

interface RawBank {
  slug: string;
  term: number;
  type: RateType;
  n: number;
  median: number | null;
  posted: number | null;
}

interface SnapshotFile {
  usableRecords: number;
  postedSnapshots: number;
  asOf: string;
  cells: RawCell[];
  big5Lenders: RawBank[];
}

const snapshot = snapshotData as SnapshotFile;

export interface NovemberCell {
  termMonths: number;
  rateType: RateType;
  insured: "all" | "insured" | "uninsured";
  n: number;
  median: number;
  p25: number;
  lowestPosted: number | null;
  lowestPostedLender: string | null;
  big5PostedMedian: number | null;
  spreadVsBig5Median: number | null;
  spreadVsLowestPosted: number | null;
  shareBelowBig5: number | null;
  medianPrimeDiscount: number | null;
}

export interface NovemberBankGap {
  slug: string;
  termMonths: number;
  rateType: RateType;
  n: number;
  reportedMedian: number;
  postedRate: number | null;
}

const INSURED_ORDER: Record<NovemberCell["insured"], number> = {
  all: 0,
  uninsured: 1,
  insured: 2,
};

const BANK_ORDER = ["td", "rbc", "cibc", "bmo", "scotiabank"];

/** Insured 3-year fixed Big-5 median in the daily snapshots is left unpublished. */
function omitBig5(cell: RawCell): boolean {
  return cell.term === 36 && cell.type === "fixed" && cell.insured === "insured";
}

function compareCells(a: NovemberCell, b: NovemberCell): number {
  if (a.termMonths !== b.termMonths) return b.termMonths - a.termMonths;
  if (a.rateType !== b.rateType) return a.rateType === "fixed" ? -1 : 1;
  return INSURED_ORDER[a.insured] - INSURED_ORDER[b.insured];
}

export function novemberCells(): NovemberCell[] {
  return snapshot.cells
    .filter((cell) => cell.publish === true && cell.n >= PUBLIC_CELL_MIN_N && cell.median != null && cell.p25 != null)
    .map((cell) => {
      const hideBig5 = omitBig5(cell);
      return {
        termMonths: cell.term,
        rateType: cell.type,
        insured: cell.insured,
        n: cell.n,
        median: cell.median as number,
        p25: cell.p25 as number,
        lowestPosted: cell.lowestPosted ?? null,
        lowestPostedLender: cell.lowestLenderMostOften ?? null,
        big5PostedMedian: hideBig5 ? null : (cell.big5PostedMedian ?? null),
        spreadVsBig5Median: hideBig5 ? null : (cell.belowBig5 ?? null),
        spreadVsLowestPosted: cell.vsLowest ?? null,
        shareBelowBig5: hideBig5 ? null : (cell.shareBelowBig5 ?? null),
        medianPrimeDiscount: cell.type === "variable" && cell.insured === "all" ? (cell.pd ?? null) : null,
      };
    })
    .sort(compareCells);
}

export function novemberCell(termMonths: number, rateType: RateType, insured: NovemberCell["insured"]): NovemberCell {
  const cell = novemberCells().find(
    (row) => row.termMonths === termMonths && row.rateType === rateType && row.insured === insured,
  );
  if (!cell) throw new Error(`Missing October cell ${termMonths} ${rateType} ${insured}`);
  return cell;
}

export function novemberChartProducts(): ProductCell[] {
  return novemberCells().map((cell) => ({
    termMonths: cell.termMonths,
    rateType: cell.rateType,
    insured: cell.insured,
    n: cell.n,
    median: cell.median,
    min: cell.median,
    p25: cell.p25,
    medianPrimeDiscount: cell.medianPrimeDiscount,
    lowestPosted: cell.lowestPosted,
    lowestPostedLender: cell.lowestPostedLender,
    big5PostedMedian: cell.big5PostedMedian,
    big5PostedMin: null,
    spreadVsLowestPosted: cell.spreadVsLowestPosted,
    spreadVsBig5Median: cell.spreadVsBig5Median,
  }));
}

function compareBanks(a: NovemberBankGap, b: NovemberBankGap): number {
  const bank = BANK_ORDER.indexOf(a.slug) - BANK_ORDER.indexOf(b.slug);
  if (bank !== 0) return bank;
  if (a.termMonths !== b.termMonths) return b.termMonths - a.termMonths;
  return a.rateType === b.rateType ? 0 : a.rateType === "fixed" ? -1 : 1;
}

export function novemberBankRows(): NovemberBankGap[] {
  return snapshot.big5Lenders
    .filter((row) => row.n >= PUBLIC_CELL_MIN_N && row.median != null)
    .map((row) => ({
      slug: row.slug,
      termMonths: row.term,
      rateType: row.type,
      n: row.n,
      reportedMedian: row.median as number,
      postedRate: row.posted,
    }))
    .sort(compareBanks);
}

export function novemberBankGaps(): NovemberBankGap[] {
  return novemberBankRows().filter((row) => row.postedRate != null);
}

export function novemberBanksWithoutPosted(): NovemberBankGap[] {
  return novemberBankRows().filter((row) => row.postedRate == null);
}

export function datasetFieldsForMonthlyReport(slug: string): { dateModified?: string; temporalCoverage?: string } {
  if (slug !== NOVEMBER_2026_SLUG) return {};
  return {
    dateModified: NOVEMBER_DATA_AS_OF,
    temporalCoverage: NOVEMBER_TEMPORAL_COVERAGE,
  };
}

function formatShare(value: number | null): string {
  if (value == null) return "—";
  return `${Math.round(value * 100)}%`;
}

function primePhrase(value: number): string {
  return `prime minus ${value.toFixed(2)}`;
}

function pointsBelow(value: number): string {
  return `${value.toFixed(2)} percentage points below`;
}

function cellBy(termMonths: number, rateType: RateType, insured: NovemberCell["insured"]): NovemberCell {
  return novemberCell(termMonths, rateType, insured);
}

function summarySentences(): string {
  const fixed = cellBy(60, "fixed", "all");
  const variable = cellBy(60, "variable", "all");
  const three = cellBy(36, "fixed", "all");
  const versusLow =
    fixed.spreadVsLowestPosted === 0
      ? `level with the lowest posted rate of ${formatRate(fixed.lowestPosted)}`
      : `${formatSpread(fixed.spreadVsLowestPosted)} the lowest posted rate of ${formatRate(fixed.lowestPosted)}`;
  const discount = variable.medianPrimeDiscount;
  if (discount == null || fixed.spreadVsBig5Median == null || three.spreadVsBig5Median == null) {
    throw new Error("October headline cell is missing a spread or prime discount");
  }
  return `In October 2026, the median 5-year fixed rate ${communityRates.attribution} was ${formatRate(fixed.median)} (N = ${fixed.n}), ${pointsBelow(fixed.spreadVsBig5Median)} the Big-5 posted median of ${formatRate(fixed.big5PostedMedian)} and ${versusLow}. The median 5-year variable rate was ${formatRate(variable.median)} (N = ${variable.n}), at a median discount of ${primePhrase(discount)} (N = ${variable.n}), and the median 3-year fixed rate was ${formatRate(three.median)} (N = ${three.n}), ${pointsBelow(three.spreadVsBig5Median)} the Big-5 posted median of ${formatRate(three.big5PostedMedian)} (N = ${three.n}).`;
}

function bullet(cell: NovemberCell): string {
  const big5 =
    cell.big5PostedMedian == null || cell.spreadVsBig5Median == null
      ? "The Big-5 posted comparison is omitted for this cell."
      : `${formatSpread(cell.spreadVsBig5Median)} the Big-5 posted median of ${formatRate(cell.big5PostedMedian)} (${formatShare(cell.shareBelowBig5)} of reports are below that median, N = ${cell.n}).`;
  const low =
    cell.lowestPosted == null
      ? ""
      : ` Lowest posted ${formatRate(cell.lowestPosted)} (${lenderName(cell.lowestPostedLender)}). The reported median is ${formatSpread(cell.spreadVsLowestPosted)} that lowest posted rate.`;
  const discount =
    cell.medianPrimeDiscount == null
      ? ""
      : ` Median prime discount: ${primePhrase(cell.medianPrimeDiscount)} (N = ${cell.n}).`;
  return `${productLabel(cell)}: reported median ${formatRate(cell.median)} (N = ${cell.n}). 25th percentile ${formatRate(cell.p25)} (N = ${cell.n}). ${big5}${low}${discount}`;
}

function tableCell(value: string, strong = false): string {
  const className = strong
    ? "p-3 border-t border-slate-200 font-semibold"
    : "p-3 border-t border-slate-200";
  return `<td class="${className}">${value}</td>`;
}

function productTable(): string {
  const rows = novemberCells()
    .map((cell, index) => {
      const shade = index % 2 === 1 ? ' class="bg-slate-50"' : "";
      const discount = cell.medianPrimeDiscount == null ? "—" : primePhrase(cell.medianPrimeDiscount);
      const lowest =
        cell.lowestPosted == null
          ? "—"
          : `${formatRate(cell.lowestPosted)} (${lenderName(cell.lowestPostedLender)})`;
      return `<tr${shade}>
        ${tableCell(productLabel(cell), true)}
        ${tableCell(`N = ${cell.n}`)}
        ${tableCell(formatRate(cell.median))}
        ${tableCell(formatRate(cell.p25))}
        ${tableCell(lowest)}
        ${tableCell(formatRate(cell.big5PostedMedian))}
        ${tableCell(formatSpread(cell.spreadVsBig5Median))}
        ${tableCell(formatSpread(cell.spreadVsLowestPosted))}
        ${tableCell(formatShare(cell.shareBelowBig5))}
        ${tableCell(discount)}
      </tr>`;
    })
    .join("\n");
  return `<div class="overflow-x-auto mb-6">
  <table class="w-full border-collapse text-sm">
    <caption class="text-left text-sm text-slate-600 mb-3">Published cells for October 1–31, 2026. A cell is shown only when N is at least ${PUBLIC_CELL_MIN_N}. Rates are rounded to the nearest 0.05. Data as of ${formatAsOf(NOVEMBER_DATA_AS_OF)}.</caption>
    <thead>
      <tr class="bg-slate-100">
        <th class="p-3 text-left font-semibold border-b border-slate-200">Product</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">N</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Reported median</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">25th percentile</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Lowest posted</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Big-5 posted median</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Vs Big-5</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Vs lowest posted</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Share below Big-5</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Prime discount</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</div>`;
}

function bankTable(): string {
  const rows = novemberBankGaps()
    .map((row, index) => {
      const shade = index % 2 === 1 ? ' class="bg-slate-50"' : "";
      const posted = row.postedRate as number;
      const spread = roundToNickel(posted - row.reportedMedian);
      const label = `${lenderName(row.slug)} · ${productLabel({ termMonths: row.termMonths, rateType: row.rateType })}`;
      return `<tr${shade}>
        ${tableCell(label, true)}
        ${tableCell(`N = ${row.n}`)}
        ${tableCell(formatRate(row.reportedMedian))}
        ${tableCell(formatRate(posted))}
        ${tableCell(formatSpread(spread))}
      </tr>`;
    })
    .join("\n");
  return `<div class="overflow-x-auto mb-6">
  <table class="w-full border-collapse text-sm">
    <caption class="text-left text-sm text-slate-600 mb-3">Big-5 products with N at least ${PUBLIC_CELL_MIN_N} and a posted rate in the October snapshots. All insured statuses are combined. Posted is the median of that bank's daily posted rate.</caption>
    <thead>
      <tr class="bg-slate-100">
        <th class="p-3 text-left font-semibold border-b border-slate-200">Bank and product</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">N</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Reported median</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Bank posted</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Vs posted</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</div>`;
}

function rateChangeTable(): string {
  const tally = OCTOBER_2026_RATE_CHANGES;
  const rows = tally.products
    .map((row, index) => {
      const shade = index % 2 === 1 ? ' class="bg-slate-50"' : "";
      const changes = row.increases + row.decreases;
      return `<tr${shade}>
        ${tableCell(row.label, true)}
        ${tableCell(`N = ${changes}`)}
        ${tableCell(String(row.increases))}
        ${tableCell(String(row.decreases))}
      </tr>`;
    })
    .join("\n");
  return `<div class="overflow-x-auto mb-6">
  <table class="w-full border-collapse text-sm">
    <caption class="text-left text-sm text-slate-600 mb-3">Advertised-rate changes on 3- and 5-year products in the <a href="/rate-changes/" class="text-teal-600 hover:underline font-medium">mortgage rate-change tracker</a>, October 1–31, 2026. N in this table is the number of advertised-rate changes, which is separate from the borrower-report N above.</caption>
    <thead>
      <tr class="bg-slate-100">
        <th class="p-3 text-left font-semibold border-b border-slate-200">Product</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Changes</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Increases</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Decreases</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr>
        ${tableCell("3- and 5-year total", true)}
        ${tableCell(`N = ${tally.total}`)}
        ${tableCell(String(tally.increases))}
        ${tableCell(String(tally.decreases))}
      </tr>
    </tbody>
  </table>
</div>`;
}

function missingPostedSentence(): string {
  return novemberBanksWithoutPosted()
    .map((row) => {
      const label = `${lenderName(row.slug)} ${productLabel({ termMonths: row.termMonths, rateType: row.rateType })}`;
      return `${label} has a reported median of ${formatRate(row.reportedMedian)} (N = ${row.n}). The October snapshots have no posted rate for that product, so the gap stays off the chart and the table.`;
    })
    .join(" ");
}

export function november2026Report() {
  const variable = cellBy(60, "variable", "all");
  const three = cellBy(36, "fixed", "all");
  const threeInsured = cellBy(36, "fixed", "insured");
  const threeUninsured = cellBy(36, "fixed", "uninsured");
  const summary = summarySentences();
  const asOf = formatAsOf(NOVEMBER_DATA_AS_OF);
  const headlines = novemberCells().filter((cell) => cell.insured === "all");
  const tally = OCTOBER_2026_RATE_CHANGES;
  const variableGap =
    variable.spreadVsBig5Median == null
      ? ""
      : ` The gap versus the Big-5 posted median of ${formatRate(variable.big5PostedMedian)} is ${pointsBelow(variable.spreadVsBig5Median)} (N = ${variable.n}), and ${formatShare(variable.shareBelowBig5)} of those reports sit below that posted median (N = ${variable.n}).`;

  const title = "Below-the-Line Mortgage Rate Report: November 2026";
  const excerpt = summary;
  const content = `<p class="mb-4">${summary}</p>

<p class="mb-4">Posted mortgage rates and the rates people actually receive are not the same number. This November edition compares rates ${communityRates.attribution} for October 1–31, 2026 with posted rates from ${snapshot.postedSnapshots} daily snapshots dated October 3–31. The month contains ${snapshot.usableRecords} usable reports. The figures below are read from that month's file. They are self-reported, unverified, and not a mortgage offer. Data as of ${asOf}.</p>

<p class="mb-4">Variable effective rates and variable posted medians in this edition span October 29, when prime moved from ${formatRate(4.45)} to ${formatRate(4.7)}.${variableGap} The median prime discount is the comparison that stays on one scale: ${primePhrase(variable.medianPrimeDiscount ?? 0)} for 5-year variable (N = ${variable.n}).</p>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">What the medians say</h2>

<ul class="list-disc pl-5 space-y-2 mb-6">
${headlines.map((cell) => `<li>${bullet(cell)}</li>`).join("\n")}
<li>${productLabel(threeInsured)}: reported median ${formatRate(threeInsured.median)} (N = ${threeInsured.n}). 25th percentile ${formatRate(threeInsured.p25)} (N = ${threeInsured.n}). Lowest posted ${formatRate(threeInsured.lowestPosted)} (${lenderName(threeInsured.lowestPostedLender)}). The reported median is ${formatSpread(threeInsured.spreadVsLowestPosted)} that lowest posted rate. The Big-5 posted median for this insured cell is omitted. The combined 3-year fixed row and the uninsured row both use a Big-5 posted median of ${formatRate(three.big5PostedMedian)} (N = ${three.n} and N = ${threeUninsured.n}).</li>
</ul>

<p class="mb-4">Lowest posted is the median of each day's lowest posted rate. The Big-5 figure is the median of each day's Big-5 posted median. Both run across the ${snapshot.postedSnapshots} snapshots from October 3 to October 31. Prime discount is the median discount on every report for that term, so the table shows it on the all-statuses variable row. Insured and uninsured splits are published only when N is at least ${PUBLIC_CELL_MIN_N}.</p>

${productTable()}

${CHART_MARKER}

<p class="mb-4">The bank chart uses the same October snapshots. These rows are Big-5 products with N at least ${PUBLIC_CELL_MIN_N}. The posted rate is the median of that bank's own daily posted rate. Variable rows span the October 29 prime change, so read a variable gap next to the prime discount above. ${missingPostedSentence()}</p>

${bankTable()}

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Posted rates in October</h2>

<p class="mb-4">The <a href="/rate-changes/" class="text-teal-600 hover:underline font-medium">mortgage rate-change tracker</a> records published rate moves between snapshots of the rate file. In October it logged ${tally.total} advertised-rate changes on 3- and 5-year fixed and variable products: ${tally.increases} increases and ${tally.decreases} decreases, across ${tally.lenders} lenders. The Bank of Canada raised the overnight rate on October 28, 2026, and prime moved from ${formatRate(4.45)} to ${formatRate(4.7)} effective October 29. See the <a href="/prime-rate/" class="text-teal-600 hover:underline font-medium">prime rate</a> page. Of the ${tally.variableIncreasesOnOrAfterPrime} variable 3- and 5-year increases dated October 29 through October 31, ${tally.variableIncreasesOfQuarterPoint} were 0.25 percentage points, the same size as the prime move.</p>

${rateChangeTable()}

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">How to use this</h2>

<p class="mb-4">If a renewal letter is above the reported median for your term, that is a reason to ask for a better number, not a guarantee you will get the median. Insured status is often missing from the reports, so compare like with like when you can. Cells are published only when N is at least ${PUBLIC_CELL_MIN_N}. Rates on the charts are rounded to the nearest 0.05. ${communityRates.disclaimer}</p>

<p class="mb-4">The current table, distribution, and weekly series live on the <a href="/real-mortgage-rates/" class="text-teal-600 hover:underline font-medium">real mortgage rates</a> page. That page reads the file in use today. This post is the October snapshot. The previous write-up is the <a href="/blog/below-the-line-mortgage-rate-report-october-2026/" class="text-teal-600 hover:underline font-medium">October 2026 rate report</a>. To place one offer on the current distribution, use the <a href="/tools/renewal-offer-checker/" class="text-teal-600 hover:underline font-medium">renewal offer checker</a>. For the conversation with your bank, read <a href="/guides/negotiate-mortgage-rate/" class="text-teal-600 hover:underline font-medium">how much below posted people negotiate</a>. Bank-level gaps for <a href="/lenders/td/" class="text-teal-600 hover:underline">TD</a>, <a href="/lenders/rbc/" class="text-teal-600 hover:underline">RBC</a>, <a href="/lenders/cibc/" class="text-teal-600 hover:underline">CIBC</a>, <a href="/lenders/bmo/" class="text-teal-600 hover:underline">BMO</a>, and <a href="/lenders/scotiabank/" class="text-teal-600 hover:underline">Scotiabank</a> are on each lender page when the sample is large enough.</p>

<p class="mb-4">Posted rates move with the snapshot. The rules for collection, medians, the prime assumption, and the N threshold are on the <a href="/methodology/" class="text-teal-600 hover:underline font-medium">methodology</a> page.</p>`;

  return {
    slug: NOVEMBER_2026_SLUG,
    title,
    excerpt,
    content,
    author: "Andrew",
    authorTitle: "Rate Analyst",
    date: "2026-11-03",
    updatedDate: NOVEMBER_DATA_AS_OF,
    category: "rates" as const,
    tags: ["real mortgage rates", "below posted", "renewal", "rate report", "November 2026"],
    readTime: 8,
    featured: true,
    image: "/logo.png",
    chartMarker: CHART_MARKER,
  };
}
