import type { ComparisonPage, CompareFaq, CompareKind, CompareSide } from "@/content/comparisons";
import { COMPARISONS } from "@/content/comparisons";
import { COMPARE_INDEX_HREF } from "./siteLinks";

export type { ComparisonPage, CompareFaq, CompareKind, CompareSide };
export { COMPARISONS, COMPARE_INDEX_HREF };

export interface MortgageRate {
  lender_name: string;
  lender_slug: string;
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type: string;
}

export interface RatePick {
  rate: number;
  lender_name: string;
  lender_slug: string;
  term_months: number;
  rate_type: string;
  mortgage_type: string;
}

export interface LenderRateSnapshot {
  slug: string;
  name: string;
  href: string;
  fixed5Insured: RatePick | null;
  fixed5Uninsured: RatePick | null;
  variable5Insured: RatePick | null;
  variable5Uninsured: RatePick | null;
  lowest: RatePick | null;
}

export interface CompareRateContext {
  bestFixed5Insured: RatePick | null;
  bestFixed5Uninsured: RatePick | null;
  bestVariable5Insured: RatePick | null;
  bestVariable5Uninsured: RatePick | null;
  leftLender: LenderRateSnapshot | null;
  rightLender: LenderRateSnapshot | null;
}

export function compareHref(slug: string): string {
  return `/compare/${slug}/`;
}

export function getComparison(slug: string): ComparisonPage | undefined {
  return COMPARISONS.find((page) => page.slug === slug);
}

export function comparisonsForLender(slug: string): ComparisonPage[] {
  return COMPARISONS.filter(
    (page) => page.kind === "lender" && (page.left.lenderSlug === slug || page.right.lenderSlug === slug)
  );
}

export function productComparisons(): ComparisonPage[] {
  return COMPARISONS.filter((page) => page.kind === "product");
}

export function lenderComparisons(): ComparisonPage[] {
  return COMPARISONS.filter((page) => page.kind === "lender");
}

export function toPick(rate: MortgageRate | undefined): RatePick | null {
  if (!rate || typeof rate.rate !== "number" || Number.isNaN(rate.rate)) return null;
  return {
    rate: rate.rate,
    lender_name: rate.lender_name,
    lender_slug: rate.lender_slug,
    term_months: rate.term_months,
    rate_type: rate.rate_type,
    mortgage_type: rate.mortgage_type,
  };
}

export function bestRate(
  rates: MortgageRate[],
  filter: {
    termMonths?: number;
    rateType?: string;
    mortgageType?: string;
    lenderSlug?: string;
  }
): RatePick | null {
  const match = rates
    .filter((rate) => {
      if (filter.termMonths != null && rate.term_months !== filter.termMonths) return false;
      if (filter.rateType && rate.rate_type !== filter.rateType) return false;
      if (filter.mortgageType && rate.mortgage_type !== filter.mortgageType) return false;
      if (filter.lenderSlug && rate.lender_slug !== filter.lenderSlug) return false;
      return typeof rate.rate === "number" && !Number.isNaN(rate.rate);
    })
    .sort((a, b) => a.rate - b.rate)[0];
  return toPick(match);
}

export function lenderSnapshot(rates: MortgageRate[], slug: string): LenderRateSnapshot {
  const rows = rates.filter((rate) => rate.lender_slug === slug);
  const name = rows[0]?.lender_name || slug;
  return {
    slug,
    name,
    href: `/lenders/${slug}/`,
    fixed5Insured: bestRate(rows, { termMonths: 60, rateType: "fixed", mortgageType: "insured" }),
    fixed5Uninsured: bestRate(rows, { termMonths: 60, rateType: "fixed", mortgageType: "uninsured" }),
    variable5Insured: bestRate(rows, { termMonths: 60, rateType: "variable", mortgageType: "insured" }),
    variable5Uninsured: bestRate(rows, { termMonths: 60, rateType: "variable", mortgageType: "uninsured" }),
    lowest: bestRate(rows, {}),
  };
}

export function compareContext(rates: MortgageRate[], page?: ComparisonPage): CompareRateContext {
  return {
    bestFixed5Insured: bestRate(rates, { termMonths: 60, rateType: "fixed", mortgageType: "insured" }),
    bestFixed5Uninsured: bestRate(rates, { termMonths: 60, rateType: "fixed", mortgageType: "uninsured" }),
    bestVariable5Insured: bestRate(rates, { termMonths: 60, rateType: "variable", mortgageType: "insured" }),
    bestVariable5Uninsured: bestRate(rates, { termMonths: 60, rateType: "variable", mortgageType: "uninsured" }),
    leftLender: page?.left.lenderSlug ? lenderSnapshot(rates, page.left.lenderSlug) : null,
    rightLender: page?.right.lenderSlug ? lenderSnapshot(rates, page.right.lenderSlug) : null,
  };
}

export function formatPct(pick: RatePick | null | undefined): string {
  if (!pick) return "N/A";
  return `${pick.rate.toFixed(2)}%`;
}

/** Human sentence fragment for FAQs — never invents a percentage. */
export function ratePhrase(pick: RatePick | null | undefined): string {
  if (!pick) return "not currently listed in our daily feed";
  return `${pick.rate.toFixed(2)}% from ${pick.lender_name}`;
}

export function lowerToday(a: RatePick | null, b: RatePick | null): string {
  if (!a && !b) return "—";
  if (a && !b) return a.lender_name;
  if (!a && b) return b.lender_name;
  if (a!.rate < b!.rate) return a!.lender_name;
  if (b!.rate < a!.rate) return b!.lender_name;
  return "Tied";
}

export function seoDescription(page: ComparisonPage, ctx: CompareRateContext): string {
  const live = liveSummary(page, ctx);
  const combined = live ? `${page.seoDescription} ${live}` : page.seoDescription;
  if (combined.length <= 160) return combined;
  // Keep a complete sentence rather than truncating a live-rate fragment mid-word.
  return page.seoDescription.length <= 160
    ? page.seoDescription
    : `${page.seoDescription.slice(0, 157).trimEnd()}...`;
}

export function liveSummary(page: ComparisonPage, ctx: CompareRateContext): string {
  if (page.slug === "fixed-vs-variable") {
    const parts = [
      ctx.bestFixed5Uninsured ? `Best 5-year fixed uninsured: ${ratePhrase(ctx.bestFixed5Uninsured)}.` : "",
      ctx.bestVariable5Uninsured ? `Best 5-year variable uninsured: ${ratePhrase(ctx.bestVariable5Uninsured)}.` : "",
    ].filter(Boolean);
    return parts.join(" ");
  }
  if (page.slug === "insured-vs-uninsured") {
    const parts = [
      ctx.bestFixed5Insured ? `Best insured 5-year fixed: ${ratePhrase(ctx.bestFixed5Insured)}.` : "",
      ctx.bestFixed5Uninsured ? `Best uninsured 5-year fixed: ${ratePhrase(ctx.bestFixed5Uninsured)}.` : "",
    ].filter(Boolean);
    return parts.join(" ");
  }
  const left = ctx.leftLender;
  const right = ctx.rightLender;
  if (!left || !right) return "";
  const leftRate = left.fixed5Insured || left.fixed5Uninsured || left.lowest;
  const rightRate = right.fixed5Insured || right.fixed5Uninsured || right.lowest;
  if (!leftRate && !rightRate) return "Live rates are in the table on this page.";
  const bits: string[] = [];
  if (leftRate) bits.push(`${left.name} from ${formatPct(leftRate)}`);
  if (rightRate) bits.push(`${right.name} from ${formatPct(rightRate)}`);
  return bits.length ? `Live 5-year highlights: ${bits.join(" vs ")}.` : "";
}

export const REQUIRED_COMPARE_LINKS = [
  "/rates/5-year-fixed/",
  "/rates/variable/",
  "/rates/insured/",
  "/rates/uninsured/",
  "/tools/stress-test-qualifier/",
  "/tools/affordability-calculator/",
  "/tools/mortgage-calculator/",
  "/mortgage-guide/",
  COMPARE_INDEX_HREF,
] as const;
