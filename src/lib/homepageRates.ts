import metadata from "../../data/metadata.json";
import {
  CHART_MIN_N,
  communityRates,
  distributionFor,
  formatRate,
  formatWeekLabel,
  PUBLIC_MIN_N,
  roundToNickel,
  type Distribution,
  type ProductCell,
} from "./communityRates";
import { calculateMonthlyPaymentSemiAnnual } from "./mortgageMath";
import { INSURED_SHORT_LABEL, mortgageTypeShortLabel, UNINSURED_SHORT_LABEL } from "./mortgageTypeCopy";
import { publishedRates, type PublishedRate } from "./publishedRates";
import { rateSnapshot } from "./rateSnapshot";
import { countsTowardUninsuredHeadline } from "./uninsuredHeadline";

export const INITIAL_PAGE_SIZE = 10;
export const PAYMENT_PRINCIPAL = 500_000;
export const PAYMENT_YEARS = 25;
export const HOMEPAGE_H1 = "Canada's Lowest Mortgage Rates Today";

export interface HomepageFilters {
  term: string;
  rateType: string;
  mortgageType: string;
  lenderQuery: string;
}

export const DEFAULT_HOMEPAGE_FILTERS: HomepageFilters = {
  term: "60",
  rateType: "all",
  mortgageType: "all",
  lenderQuery: "",
};

export interface BorrowerMedian {
  rate: number;
  label: string;
  n: number;
  sample: "exact" | "all-statuses" | "small-sample";
  smallSample: boolean;
}

export interface MedianSource {
  products: readonly Pick<ProductCell, "termMonths" | "rateType" | "insured" | "n" | "median">[];
  distributions: readonly Pick<Distribution, "termMonths" | "rateType" | "insured" | "n" | "median">[];
}

const liveMedianSource = (): MedianSource => ({
  products: communityRates.windows["30d"].products,
  distributions: communityRates.distributions,
});

function toMedian(
  raw: number,
  n: number,
  sample: BorrowerMedian["sample"],
  smallSample: boolean,
): BorrowerMedian {
  const rate = roundToNickel(raw);
  return { rate, label: formatRate(raw), n, sample, smallSample };
}

/**
 * 30-day borrower-reported median for one insured/uninsured bucket.
 * Publishes the exact bucket at N >= 10. Below that, falls back to the
 * all-statuses median when that sample is publishable. A 5–9 report bucket
 * is shown only when neither sample clears the public threshold, and it is
 * labelled a small sample. Smaller buckets are omitted.
 */
export function borrowerMedianForBucket(
  rateType: "fixed" | "variable",
  insured: "insured" | "uninsured",
  source: MedianSource = liveMedianSource(),
): BorrowerMedian | null {
  const exact = source.products.find(
    (product) => product.termMonths === 60 && product.rateType === rateType && product.insured === insured,
  );
  const all = source.distributions.find(
    (product) => product.termMonths === 60 && product.rateType === rateType && product.insured === "all",
  );

  if (exact && exact.n >= PUBLIC_MIN_N) return toMedian(exact.median, exact.n, "exact", false);
  if (all && all.n >= PUBLIC_MIN_N) return toMedian(all.median, all.n, "all-statuses", false);
  if (exact && exact.n >= CHART_MIN_N) return toMedian(exact.median, exact.n, "small-sample", true);
  return null;
}

export function reportedMedianLine(median: BorrowerMedian | null): string | null {
  if (!median) return null;
  const note =
    median.sample === "all-statuses" ? ", all down payments" : median.smallSample ? ", small sample" : "";
  return `30-day reported median ${median.label} (n=${median.n}${note})`;
}

export interface HeroCardModel {
  key: string;
  title: string;
  rateType: "fixed" | "variable";
  mortgageType: "insured" | "uninsured";
  badge: string;
  href: string;
  seeAllHref: string;
  rows: PublishedRate[];
  lenderCount: number;
  reported: BorrowerMedian | null;
}

const CARD_DEFS: readonly {
  rateType: "fixed" | "variable";
  mortgageType: "insured" | "uninsured";
  title: string;
  href: string;
  seeAllHref: string;
}[] = [
  {
    rateType: "fixed",
    mortgageType: "insured",
    title: "5-Year Fixed",
    href: "/rates/5-year-fixed/",
    seeAllHref: "/rates/insured/",
  },
  {
    rateType: "fixed",
    mortgageType: "uninsured",
    title: "5-Year Fixed",
    href: "/rates/5-year-fixed/",
    seeAllHref: "/rates/uninsured/",
  },
  {
    rateType: "variable",
    mortgageType: "insured",
    title: "5-Year Variable",
    href: "/rates/variable/",
    seeAllHref: "/rates/variable/",
  },
  {
    rateType: "variable",
    mortgageType: "uninsured",
    title: "5-Year Variable",
    href: "/rates/variable/",
    seeAllHref: "/rates/variable/",
  },
];

function eligibleCardRow(rate: PublishedRate, mortgageType: "insured" | "uninsured"): boolean {
  if (mortgageType === "uninsured") return countsTowardUninsuredHeadline(rate);
  return rate.mortgage_type === "insured";
}

export function heroCards(rates: readonly PublishedRate[] = publishedRates): HeroCardModel[] {
  return CARD_DEFS.map((def) => {
    const rows = sortByRate(
      rates.filter(
        (rate) =>
          rate.term_months === 60 &&
          rate.rate_type === def.rateType &&
          eligibleCardRow(rate, def.mortgageType),
      ),
    );
    return {
      ...def,
      key: `${def.rateType}-${def.mortgageType}`,
      badge: def.mortgageType === "insured" ? INSURED_SHORT_LABEL : UNINSURED_SHORT_LABEL,
      rows,
      lenderCount: new Set(rows.map((row) => row.lender_slug)).size,
      reported: borrowerMedianForBucket(def.rateType, def.mortgageType),
    };
  });
}

export interface RangeBarModel {
  rateType: "fixed" | "variable";
  title: string;
  lowest: number | null;
  lowestLabel: string | null;
  reported: BorrowerMedian | null;
  big5: number | null;
  big5Label: string | null;
  /** Big Five posted median minus the rounded borrower median, in percentage points. */
  gap: number | null;
  /** Position of the borrower median between the lowest special and the Big Five posted median. */
  markerPercent: number | null;
}

export function pointsBelow(big5: number, median: number): number {
  return Number((big5 - median).toFixed(2));
}

export function markerPercent(lowest: number, median: number, high: number): number {
  const span = high - lowest;
  if (!Number.isFinite(span) || span === 0) return 50;
  const raw = ((median - lowest) / span) * 100;
  return Math.min(96, Math.max(4, Number(raw.toFixed(2))));
}

export function big5GapLabel(gap: number | null): string | null {
  if (gap == null || Number.isNaN(gap)) return null;
  if (gap === 0) return "in line with Big 5 posted";
  const points = `${Math.abs(gap).toFixed(2)}%`;
  return gap > 0 ? `${points} below Big 5 posted` : `${points} above Big 5 posted`;
}

function aggregateMedian(rateType: "fixed" | "variable"): BorrowerMedian | null {
  const all = distributionFor(60, rateType, "all");
  if (!all) return null;
  if (all.n >= PUBLIC_MIN_N) return toMedian(all.median, all.n, "exact", false);
  if (all.n >= CHART_MIN_N) return toMedian(all.median, all.n, "small-sample", true);
  return null;
}

export function buildRangeBar(rateType: "fixed" | "variable"): RangeBarModel {
  const side = rateType === "fixed" ? rateSnapshot.fixed : rateSnapshot.variable;
  const reported = aggregateMedian(rateType);
  const lowest = side.lowest?.rate ?? null;
  const big5 = side.big5Posted ? Number(side.big5Posted.rate.toFixed(2)) : null;
  const gap = reported && big5 != null ? pointsBelow(big5, reported.rate) : null;
  const marker =
    reported && lowest != null && big5 != null ? markerPercent(lowest, reported.rate, big5) : null;
  return {
    rateType,
    title: rateType === "fixed" ? "5-Year Fixed" : "5-Year Variable",
    lowest,
    lowestLabel: lowest == null ? null : `${lowest.toFixed(2)}%`,
    reported,
    big5,
    big5Label: big5 == null ? null : `${big5.toFixed(2)}%`,
    gap,
    markerPercent: marker,
  };
}

export function buildRangeBars(): RangeBarModel[] {
  return [buildRangeBar("fixed"), buildRangeBar("variable")];
}

export interface PaymentHookModel {
  principal: number;
  years: number;
  rate: number;
  rateLabel: string;
  lenderName: string;
  mortgageTypeLabel: string;
  monthly: number;
  monthlyLabel: string;
}

export function formatCad(amount: number): string {
  const negative = amount < 0;
  const [dollars, cents] = Math.abs(amount).toFixed(2).split(".");
  const withCommas = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${negative ? "-" : ""}$${withCommas}.${cents}`;
}

export function buildPaymentHook(rates: readonly PublishedRate[] = publishedRates): PaymentHookModel | null {
  const pool = rates.filter(
    (rate) =>
      rate.term_months === 60 &&
      rate.rate_type === "fixed" &&
      (rate.mortgage_type === "uninsured" ? countsTowardUninsuredHeadline(rate) : true),
  );
  if (pool.length === 0) return null;
  const lowest = sortByRate(pool)[0];
  const monthly = Number(calculateMonthlyPaymentSemiAnnual(PAYMENT_PRINCIPAL, lowest.rate, PAYMENT_YEARS).toFixed(2));
  return {
    principal: PAYMENT_PRINCIPAL,
    years: PAYMENT_YEARS,
    rate: lowest.rate,
    rateLabel: `${lowest.rate.toFixed(2)}%`,
    lenderName: lowest.lender_name,
    mortgageTypeLabel: mortgageTypeShortLabel(lowest.mortgage_type),
    monthly,
    monthlyLabel: formatCad(monthly),
  };
}

export function formatUpdatedEt(iso: string): string {
  const normalized = /(?:Z|[+-]\d{2}:?\d{2})$/.test(iso) ? iso : `${iso}Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return "";
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(/\u202f/g, " ");
  return `${formatted} ET`;
}

export function freshnessLine(rateCount: number, lenderCount: number, iso: string = metadata.last_updated): string {
  return `Updated ${formatUpdatedEt(iso)} · ${rateCount} rates from ${lenderCount} Canadian lenders`;
}

export function borrowerWindowLabel(
  from: string = communityRates.windows["30d"].from,
  to: string = communityRates.windows["30d"].to,
): string {
  const fromLabel = formatWeekLabel(from);
  const toLabel = formatWeekLabel(to);
  const fromYear = from.slice(0, 4);
  const toYear = to.slice(0, 4);
  if (fromYear === toYear) return `${fromLabel}–${toLabel}, ${toYear}`;
  return `${fromLabel}, ${fromYear}–${toLabel}, ${toYear}`;
}

export function borrowerCreditLine(): string {
  return `30-day medians, ${borrowerWindowLabel()} · ${communityRates.attribution}`;
}

const PREFERRED_TERMS = [60, 36, 24, 12, 6, 48, 30, 72, 84, 120];

export function termChipLabel(months: number): string {
  if (months % 12 === 0) return `${months / 12}-Year`;
  return `${months}-Month`;
}

export function termAnalyticsValue(term: string): string {
  if (term === "all") return "all";
  const months = Number(term);
  if (!Number.isFinite(months)) return term;
  return termChipLabel(months).toLowerCase();
}

export function termFilterChips(rates: readonly { term_months: number }[]): { value: string; label: string }[] {
  const present = new Set(rates.map((rate) => rate.term_months));
  const ordered = PREFERRED_TERMS.filter((months) => present.has(months));
  const rest = [...present].filter((months) => !PREFERRED_TERMS.includes(months)).sort((a, b) => a - b);
  return [...ordered, ...rest].map((months) => ({
    value: String(months),
    label: termChipLabel(months),
  }));
}

export function tableHeading(term: string): string {
  if (term === "all") return "Today's mortgage rates";
  return `Today's ${termAnalyticsValue(term)} mortgage rates`;
}

export function tableSummary(visible: number, total: number, term: string): string {
  const what = term === "all" ? "rates" : `${termAnalyticsValue(term)} rates`;
  return `Showing ${visible} of ${total} ${what}, lowest first.`;
}

export function showAllLabel(total: number, term: string, expanded: boolean, pageSize = INITIAL_PAGE_SIZE): string | null {
  if (expanded || total <= pageSize) return null;
  const what = term === "all" ? "rates" : `${termAnalyticsValue(term)} rates`;
  return `Show all ${total} ${what}`;
}

export function filterPublishedRates<T extends PublishedRate>(rates: readonly T[], filters: HomepageFilters): T[] {
  const query = filters.lenderQuery.trim().toLowerCase();
  return rates.filter((rate) => {
    if (filters.term !== "all" && rate.term_months !== Number(filters.term)) return false;
    if (filters.rateType !== "all" && rate.rate_type !== filters.rateType) return false;
    if (filters.mortgageType !== "all" && rate.mortgage_type !== filters.mortgageType) return false;
    if (query) {
      const name = (rate.lender_name ?? "").toLowerCase();
      const slug = (rate.lender_slug ?? "").toLowerCase();
      if (!name.includes(query) && !slug.includes(query)) return false;
    }
    return true;
  });
}

export function sortByRate<T extends { rate: number; lender_name?: string }>(rates: readonly T[]): T[] {
  return [...rates].sort(
    (a, b) => a.rate - b.rate || (a.lender_name ?? "").localeCompare(b.lender_name ?? ""),
  );
}

export function pageOfRates<T>(rates: readonly T[], expanded: boolean, pageSize = INITIAL_PAGE_SIZE): T[] {
  if (expanded || rates.length <= pageSize) return [...rates];
  return rates.slice(0, pageSize);
}

export interface FilterChange {
  filter_type: "term" | "down_payment" | "rate_type" | "search";
  filter_value: string;
}

export function changedFilter(prev: HomepageFilters, next: HomepageFilters): FilterChange | null {
  if (prev.term !== next.term) return { filter_type: "term", filter_value: termAnalyticsValue(next.term) };
  if (prev.mortgageType !== next.mortgageType) {
    return { filter_type: "down_payment", filter_value: next.mortgageType };
  }
  if (prev.rateType !== next.rateType) return { filter_type: "rate_type", filter_value: next.rateType };
  if (prev.lenderQuery !== next.lenderQuery) return { filter_type: "search", filter_value: next.lenderQuery };
  return null;
}
