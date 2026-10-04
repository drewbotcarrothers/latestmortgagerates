export interface ScrapedRate {
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type?: string | null;
  posted_rate?: number | null;
}

export interface TodayProduct {
  label: string;
  months: number;
  rateType: "fixed" | "variable";
}

export const TODAY_PRODUCTS: TodayProduct[] = [
  { label: "1-year fixed", months: 12, rateType: "fixed" },
  { label: "3-year fixed", months: 36, rateType: "fixed" },
  { label: "5-year fixed", months: 60, rateType: "fixed" },
  { label: "5-year variable", months: 60, rateType: "variable" },
];

/** Lender pages that get the dated "Today's rates" table. */
export const STRIKING_DISTANCE_SLUGS = ["atb", "wealthsimple", "vancity", "meridian"] as const;

export interface TodayRateRow {
  label: string;
  insured: number | null;
  uninsured: number | null;
  unlabeled: number | null;
  posted: number | null;
  /** Posted minus the discounted rate on the same scraped row, in percentage points. */
  gap: number | null;
}

function lowestOf(rows: ScrapedRate[]): number | null {
  if (!rows.length) return null;
  return Math.min(...rows.map((row) => row.rate));
}

export function buildTodayRows(rates: ScrapedRate[]): TodayRateRow[] {
  return TODAY_PRODUCTS.map((product) => {
    const rows = rates.filter(
      (row) => row.term_months === product.months && row.rate_type === product.rateType
    );
    const insured = lowestOf(rows.filter((row) => row.mortgage_type === "insured"));
    const uninsured = lowestOf(rows.filter((row) => row.mortgage_type === "uninsured"));
    const unlabeled = lowestOf(
      rows.filter((row) => row.mortgage_type !== "insured" && row.mortgage_type !== "uninsured")
    );
    const withPosted = rows.filter(
      (row) => typeof row.posted_rate === "number" && (row.posted_rate as number) > row.rate
    );
    let posted: number | null = null;
    let gap: number | null = null;
    if (withPosted.length) {
      const best = withPosted.reduce((left, right) => (left.rate <= right.rate ? left : right));
      posted = best.posted_rate as number;
      gap = Math.round((posted - best.rate) * 100) / 100;
    }
    return { label: product.label, insured, uninsured, unlabeled, posted, gap };
  });
}

export function formatGap(gap: number | null): string {
  if (gap == null) return "—";
  return `${gap.toFixed(2)} pts`;
}

export function formatCell(rate: number | null): string {
  if (rate == null) return "—";
  return `${rate.toFixed(2)}%`;
}
