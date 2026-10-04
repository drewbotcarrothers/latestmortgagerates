import { calculateMonthlyPayment } from "./mortgageMath";
import communityData from "../data/community-rates.json";

export const PUBLIC_MIN_N = 10;
export const CHART_MIN_N = 5;

export type RateType = "fixed" | "variable";
export type InsuredStatus = "insured" | "uninsured" | "unknown" | "insurable" | "all";
export type WindowKey = "7d" | "30d";

export interface ProductCell {
  termMonths: number;
  rateType: RateType;
  insured: Exclude<InsuredStatus, "all">;
  n: number;
  median: number;
  min: number;
  p25: number;
  medianPrimeDiscount: number | null;
  lowestPosted: number | null;
  lowestPostedLender: string | null;
  big5PostedMedian: number | null;
  big5PostedMin: number | null;
  /** Posted minus reported. Positive means the reported median is below posted. */
  spreadVsLowestPosted: number | null;
  spreadVsBig5Median: number | null;
}

export interface RateWindow {
  from: string;
  to: string;
  usableRecords: number;
  products: ProductCell[];
}

export interface Distribution {
  termMonths: number;
  rateType: RateType;
  insured: InsuredStatus;
  n: number;
  median: number;
  p25: number;
  p75: number;
  min: number;
  max: number;
  big5PostedMedian: number | null;
  lowestPosted: number | null;
  lowestPostedLender: string | null;
  shareBelowBig5: number | null;
  rates: number[];
}

export interface WeekSeries {
  n: number;
  median: number | null;
}

export interface WeekPoint {
  weekStarting: string;
  fixed: WeekSeries;
  variable: WeekSeries;
}

export interface PostedBenchmark {
  big5PostedMedian: number | null;
  lowestPosted: number | null;
  lowestPostedLender: string | null;
}

export interface LenderProduct {
  termMonths: number;
  rateType: RateType;
  n: number;
  reportedMedian: number;
  postedRate: number | null;
  spreadVsPosted: number | null;
  rates: number[];
}

export interface LenderBlock {
  slug: string;
  matchedN: number;
  medianSpreadVsOwnPosted: number | null;
  products: LenderProduct[];
}

export interface CommunityRates {
  generated: string;
  asOf: string;
  prime: number;
  attribution: string;
  disclaimer: string;
  thresholds: { publicMinN: number; chartMinN: number };
  lenderNames: Record<string, string>;
  windows: Record<WindowKey, RateWindow>;
  distributions: Distribution[];
  weekly: {
    from: string;
    to: string;
    termMonths: number;
    benchmarks: { fixed: PostedBenchmark; variable: PostedBenchmark };
    weeks: WeekPoint[];
  };
  lenders: LenderBlock[];
}

export const communityRates = communityData as CommunityRates;

export const BIG5_SLUGS = ["td", "rbc", "cibc", "bmo", "scotiabank"] as const;

const INSURED_LABEL: Record<string, string> = {
  all: "all insured statuses",
  unknown: "insured status not stated",
  insured: "insured",
  uninsured: "uninsured",
  insurable: "insurable",
};

export function roundToNickel(value: number): number {
  return Math.round(value * 20) / 20;
}

export function formatRate(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${roundToNickel(value).toFixed(2)}%`;
}

export function formatSpread(spread: number | null | undefined): string {
  if (spread == null || Number.isNaN(spread)) return "—";
  const rounded = roundToNickel(spread);
  if (rounded === 0) return "in line with";
  const pts = `${Math.abs(rounded).toFixed(2)} pts`;
  return rounded > 0 ? `${pts} below` : `${pts} above`;
}

export function formatAsOf(iso: string = communityRates.asOf): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatWeekLabel(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function lenderName(slug: string | null | undefined): string {
  if (!slug) return "a lender";
  return communityRates.lenderNames[slug] ?? slug;
}

export function termLabel(termMonths: number): string {
  if (termMonths % 12 === 0) {
    const years = termMonths / 12;
    return `${years}-year`;
  }
  return `${termMonths}-month`;
}

export function productLabel(product: {
  termMonths: number;
  rateType: string;
  insured?: string;
}): string {
  const insured = product.insured ? INSURED_LABEL[product.insured] ?? product.insured : "";
  const base = `${termLabel(product.termMonths)} ${product.rateType}`;
  return insured ? `${base} · ${insured}` : base;
}

export function productsFor(windowKey: WindowKey): ProductCell[] {
  return communityRates.windows[windowKey].products;
}

export function publicProducts(windowKey: WindowKey = "30d"): ProductCell[] {
  return productsFor(windowKey)
    .filter((product) => product.n >= PUBLIC_MIN_N)
    .sort(compareProducts);
}

export function chartProducts(windowKey: WindowKey = "30d"): ProductCell[] {
  return productsFor(windowKey)
    .filter((product) => product.n >= CHART_MIN_N)
    .filter((product) => product.insured === "insured" || product.insured === "uninsured")
    .sort(compareProducts);
}

function compareProducts(a: ProductCell, b: ProductCell): number {
  if (a.termMonths !== b.termMonths) return b.termMonths - a.termMonths;
  if (a.rateType !== b.rateType) return a.rateType === "fixed" ? -1 : 1;
  if (a.insured === b.insured) return 0;
  return a.insured === "uninsured" ? -1 : 1;
}

export function distributionFor(
  termMonths: number,
  rateType: RateType,
  insured: InsuredStatus,
): Distribution | undefined {
  return communityRates.distributions.find(
    (row) => row.termMonths === termMonths && row.rateType === rateType && row.insured === insured,
  );
}

export function lenderBySlug(slug: string): LenderBlock | undefined {
  return communityRates.lenders.find((lender) => lender.slug === slug);
}

export function isBig5(slug: string): boolean {
  return (BIG5_SLUGS as readonly string[]).includes(slug);
}

export function chartLenderProducts(lender: LenderBlock): LenderProduct[] {
  return lender.products
    .filter((product) => product.n >= CHART_MIN_N && product.postedRate != null)
    .sort(compareLenderProducts);
}

export function publicLenderProducts(lender: LenderBlock): LenderProduct[] {
  return lender.products
    .filter((product) => product.n >= PUBLIC_MIN_N && product.postedRate != null)
    .sort(compareLenderProducts);
}

function compareLenderProducts(a: LenderProduct, b: LenderProduct): number {
  if (a.termMonths !== b.termMonths) return b.termMonths - a.termMonths;
  if (a.rateType === b.rateType) return 0;
  return a.rateType === "fixed" ? -1 : 1;
}

export function omittedForMissingPosted(lender: LenderBlock): LenderProduct[] {
  return lender.products.filter((product) => product.n >= CHART_MIN_N && product.postedRate == null);
}

/** Nearest-rank percentile. `rates` may be unsorted. */
export function nearestRank(rates: number[], pct: number): number | null {
  if (rates.length === 0) return null;
  const sorted = [...rates].sort((a, b) => a - b);
  const rank = Math.min(sorted.length, Math.max(1, Math.ceil((pct / 100) * sorted.length)));
  return sorted[rank - 1];
}

/** Share of reports with a rate at or below `offer`, from 0 to 100. Lower is a better rate. */
export function percentileAtOrBelow(rates: number[], offer: number): number {
  if (rates.length === 0) return 0;
  const count = rates.filter((rate) => rate <= offer).length;
  return (count / rates.length) * 100;
}

/** Share of reports with a strictly higher rate, from 0 to 100. */
export function percentBetterThan(rates: number[], offer: number): number {
  if (rates.length === 0) return 0;
  const count = rates.filter((rate) => rate > offer).length;
  return (count / rates.length) * 100;
}

export interface RateBin {
  start: number;
  end: number;
  count: number;
}

export function binRates(rates: number[], width = 0.1): RateBin[] {
  if (rates.length === 0) return [];
  const min = Math.floor(Math.min(...rates) / width) * width;
  const max = Math.max(...rates);
  const bins: RateBin[] = [];
  for (let start = min; start <= max + width / 2; start = roundToWidth(start + width, width)) {
    const end = roundToWidth(start + width, width);
    bins.push({
      start: roundToWidth(start, width),
      end,
      count: rates.filter((rate) => rate >= start && rate < end).length,
    });
    if (bins.length > 80) break;
  }
  const last = bins[bins.length - 1];
  if (last && rates.some((rate) => rate >= last.end)) {
    last.count += rates.filter((rate) => rate >= last.end).length;
  }
  return bins.filter((bin) => bin.count > 0 || bin.start <= max);
}

function roundToWidth(value: number, width: number): number {
  const places = width >= 0.1 ? 1 : 2;
  return Number(value.toFixed(places));
}

export type Verdict = "great" | "fair" | "negotiate" | "insufficient";

export interface ScoreInput {
  lenderSlug: string | null;
  termMonths: number;
  rateType: RateType;
  insured: "insured" | "uninsured" | "all";
  offerRate: number;
}

export interface ScoreResult {
  verdict: Verdict;
  sample: "bank" | "exact" | "all-statuses" | "none";
  n: number;
  median: number | null;
  p25: number | null;
  p75: number | null;
  percentile: number | null;
  percentBeating: number | null;
  big5PostedMedian: number | null;
  lowestPosted: number | null;
  lowestPostedLender: string | null;
  bankPosted: number | null;
  bankN: number | null;
  bankMedian: number | null;
  marketN: number | null;
  marketMedian: number | null;
  vsMedianPts: number | null;
  vsBankPostedPts: number | null;
  vsBig5Pts: number | null;
  vsLowestPts: number | null;
}

export function scoreOffer(input: ScoreInput): ScoreResult {
  const exact = input.insured === "all"
    ? undefined
    : distributionFor(input.termMonths, input.rateType, input.insured);
  const all = distributionFor(input.termMonths, input.rateType, "all");
  let market: Distribution | undefined;
  let marketSample: ScoreResult["sample"] = "none";
  if (input.insured === "all") {
    if (all && all.n >= PUBLIC_MIN_N) {
      market = all;
      marketSample = "exact";
    }
  } else if (exact && exact.n >= PUBLIC_MIN_N) {
    market = exact;
    marketSample = "exact";
  } else if (all && all.n >= PUBLIC_MIN_N) {
    market = all;
    marketSample = "all-statuses";
  }

  const lender = input.lenderSlug ? lenderBySlug(input.lenderSlug) : undefined;
  const bankProduct = lender?.products.find(
    (product) => product.termMonths === input.termMonths && product.rateType === input.rateType,
  );
  const bankUsable = Boolean(bankProduct && bankProduct.n >= PUBLIC_MIN_N);

  const primaryRates = bankUsable && bankProduct
    ? bankProduct.rates
    : market?.rates;
  const sample: ScoreResult["sample"] = bankUsable ? "bank" : market ? marketSample : "none";
  const n = primaryRates?.length ?? 0;
  const median = bankUsable && bankProduct
    ? bankProduct.reportedMedian
    : market?.median ?? null;
  const p25 = primaryRates ? nearestRank(primaryRates, 25) : null;
  const p75 = primaryRates ? nearestRank(primaryRates, 75) : null;

  let verdict: Verdict = "insufficient";
  if (primaryRates && n >= PUBLIC_MIN_N && median != null && p25 != null) {
    if (input.offerRate <= p25) verdict = "great";
    else if (input.offerRate <= median) verdict = "fair";
    else verdict = "negotiate";
  }

  const big5 = market?.big5PostedMedian ?? null;
  const lowest = market?.lowestPosted ?? null;
  const bankPosted = bankProduct?.postedRate ?? null;

  return {
    verdict,
    sample,
    n: primaryRates && n >= PUBLIC_MIN_N ? n : (primaryRates?.length ?? market?.n ?? bankProduct?.n ?? 0),
    median: verdict === "insufficient" ? median : median,
    p25,
    p75,
    percentile: primaryRates && verdict !== "insufficient"
      ? percentileAtOrBelow(primaryRates, input.offerRate)
      : null,
    percentBeating: primaryRates && verdict !== "insufficient"
      ? percentBetterThan(primaryRates, input.offerRate)
      : null,
    big5PostedMedian: big5,
    lowestPosted: lowest,
    lowestPostedLender: market?.lowestPostedLender ?? null,
    bankPosted,
    bankN: bankProduct?.n ?? null,
    bankMedian: bankProduct?.reportedMedian ?? null,
    marketN: market?.n ?? null,
    marketMedian: market?.median ?? null,
    vsMedianPts: median != null && verdict !== "insufficient" ? input.offerRate - median : null,
    vsBankPostedPts: bankPosted != null ? input.offerRate - bankPosted : null,
    vsBig5Pts: big5 != null ? input.offerRate - big5 : null,
    vsLowestPts: lowest != null ? input.offerRate - lowest : null,
  };
}

export function illustrativeMonthlySavings(
  higherRate: number,
  lowerRate: number,
  principal = 500_000,
  amortizationYears = 25,
): number {
  const high = calculateMonthlyPayment(principal, roundToNickel(higherRate), amortizationYears);
  const low = calculateMonthlyPayment(principal, roundToNickel(lowerRate), amortizationYears);
  return Math.max(0, high - low);
}

export function buildTakeaways(): string[] {
  const lines: string[] = [];
  const comparable = publicProducts("30d").filter(
    (product) =>
      product.spreadVsBig5Median != null &&
      (product.insured === "insured" || product.insured === "uninsured"),
  );
  const widest = [...comparable].sort(
    (a, b) => (b.spreadVsBig5Median ?? 0) - (a.spreadVsBig5Median ?? 0),
  )[0];
  if (widest?.spreadVsBig5Median != null) {
    lines.push(
      `Among insured and uninsured products with at least ${PUBLIC_MIN_N} reports, the widest gap versus Big-5 posted rates is ${productLabel(widest)}: the reported median is ${formatRate(widest.median)} (N = ${widest.n}), ${formatSpread(widest.spreadVsBig5Median)} the Big-5 posted median of ${formatRate(widest.big5PostedMedian)}.`,
    );
  }

  const fixed = distributionFor(60, "fixed", "all");
  const variable = distributionFor(60, "variable", "all");
  if (fixed && variable && fixed.shareBelowBig5 != null && variable.shareBelowBig5 != null) {
    lines.push(
      `Counting every insured status, the median 5-year fixed rate people report is ${formatRate(fixed.median)} (N = ${fixed.n}) and the median 5-year variable rate is ${formatRate(variable.median)} (N = ${variable.n}). ${Math.round(fixed.shareBelowBig5 * 100)}% of those 5-year fixed reports are below the Big-5 posted median of ${formatRate(fixed.big5PostedMedian)}, and ${Math.round(variable.shareBelowBig5 * 100)}% of 5-year variable reports are below ${formatRate(variable.big5PostedMedian)}.`,
    );
  }

  const lowest = [...publicProducts("30d")].sort((a, b) => a.median - b.median)[0];
  if (lowest) {
    lines.push(
      `The lowest reported median we can publish (N at least ${PUBLIC_MIN_N}) is ${formatRate(lowest.median)} on ${productLabel(lowest)} (N = ${lowest.n}).`,
    );
  }

  let best: { name: string; product: LenderProduct } | undefined;
  for (const lender of communityRates.lenders) {
    for (const product of publicLenderProducts(lender)) {
      if (product.spreadVsPosted == null) continue;
      if (!best || product.spreadVsPosted > (best.product.spreadVsPosted ?? -Infinity)) {
        best = { name: lenderName(lender.slug), product };
      }
    }
  }
  if (best?.product.spreadVsPosted != null) {
    lines.push(
      `At ${best.name}, the widest gap we can publish is ${termLabel(best.product.termMonths)} ${best.product.rateType}: posted ${formatRate(best.product.postedRate)} versus a reported median of ${formatRate(best.product.reportedMedian)} (N = ${best.product.n}), ${formatSpread(best.product.spreadVsPosted)} that bank's own posted rate.`,
    );
  }

  return lines;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqs(): FaqItem[] {
  const fixed = distributionFor(60, "fixed", "all");
  const variable = distributionFor(60, "variable", "all");
  const window30 = communityRates.windows["30d"];
  const takeaways = buildTakeaways();
  const variableAnswer = variable
    ? `Over the ${window30.from} to ${window30.to} window, the median 5-year variable rate self-reported by Canadian borrowers online is ${formatRate(variable.median)} (N = ${variable.n}, all insured statuses). The median 5-year fixed report is ${fixed ? `${formatRate(fixed.median)} (N = ${fixed.n})` : "not published"}. These are medians of unverified reports, rounded to the nearest 0.05, not offers.`
    : "See the table on this page for every product with at least 10 reports.";
  const realistic = takeaways[0] ?? variableAnswer;

  return [
    {
      question: "What mortgage rate are people getting in Canada right now?",
      answer: variableAnswer,
    },
    {
      question: "What is a realistic mortgage rate in Canada?",
      answer: `A realistic rate is closer to what borrowers report receiving than to a Big-5 posted median. ${realistic} Compare your own number with the renewal offer checker, and read how the medians are built on the methodology page.`,
    },
    {
      question: "How far below a posted rate do people actually negotiate?",
      answer: takeaways[3]
        ? takeaways[3]
        : "We publish a bank gap only when at least 10 people report a rate from that bank for the same term and type, and the snapshot includes that bank's posted rate.",
    },
    {
      question: "Why do some products show no number?",
      answer: `A public cell is shown only when N is at least ${PUBLIC_MIN_N}. Charts may include a cell with ${CHART_MIN_N} to ${PUBLIC_MIN_N - 1} reports when the label says the sample is small. Insured status is often unstated, so many reports sit in a separate "insured status not stated" row instead of the insured or uninsured row.`,
    },
    {
      question: "Are these community rates a rate offer?",
      answer: `${communityRates.disclaimer} They were ${communityRates.attribution}. They are not a commitment from any lender, and they are not financial advice. Confirm any rate with the lender before you rely on it. Prime used for variable effective rates in this file is ${formatRate(communityRates.prime)}.`,
    },
  ];
}

export function negotiationTips(score: ScoreResult, input: ScoreInput): string[] {
  const tips: string[] = [];
  const label = productLabel({
    termMonths: input.termMonths,
    rateType: input.rateType,
    insured: input.insured,
  });
  if (score.verdict === "insufficient") {
    tips.push(
      `This file does not have ${PUBLIC_MIN_N} reports for ${label}${input.lenderSlug ? ` at ${lenderName(input.lenderSlug)}` : ""}, so there is no percentile to quote. Ask the lender how the offer compares with its posted rate and get a second quote before you accept a renewal.`,
    );
  } else if (score.median != null) {
    tips.push(
      `People in this comparison report a median of ${formatRate(score.median)} (N = ${score.n}). Your offer is ${formatSpread(score.median - input.offerRate)} that median.`,
    );
  }
  if (score.bankPosted != null) {
    tips.push(
      `${input.lenderSlug ? lenderName(input.lenderSlug) : "The bank"} posts ${formatRate(score.bankPosted)} for this term and type in the current snapshot. Ask them to explain any gap between that posted rate, your offer, and the reported median.`,
    );
  }
  if (score.lowestPosted != null) {
    tips.push(
      `The lowest posted rate we track for the market comparison is ${formatRate(score.lowestPosted)} at ${lenderName(score.lowestPostedLender)}. A competing quote near that level is the number to take back to your bank.`,
    );
  }
  tips.push(
    "Get the renewal in writing, then compare prepayment terms and the penalty, not only the rate. A lower rate with a harsh break fee can cost more if you move.",
  );
  return tips.slice(0, 4);
}
