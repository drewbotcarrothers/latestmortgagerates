import { round2 } from "./dataFormat";

export const BIG5_SLUGS = ["rbc", "td", "scotiabank", "bmo", "cibc"] as const;

export interface SpreadRate {
  lender_name?: string;
  lender_slug?: string;
  term_months?: number;
  rate_type?: string;
  rate?: number | null;
  mortgage_type?: string | null;
  raw_data?: { is_open?: boolean; product?: string; term_text?: string } | null;
}

export interface FixedQuote {
  lenderName: string;
  lenderSlug: string;
  rate: number;
  mortgageType: string;
}

export interface FixedBenchmarks {
  lowest: FixedQuote | null;
  big5Median: number | null;
  big5Quotes: FixedQuote[];
}

function isOpen(row: SpreadRate): boolean {
  if (row.raw_data?.is_open) return true;
  const name = `${row.raw_data?.product || ""} ${row.raw_data?.term_text || ""}`;
  return /\bopen\b/i.test(name);
}

/** Lowest closed 5-year fixed in the file, and the median of Big Five uninsured specials. */
export function fiveYearFixedBenchmarks(rows: readonly SpreadRate[]): FixedBenchmarks {
  const quotes: FixedQuote[] = [];
  for (const row of rows) {
    if (row.term_months !== 60 || row.rate_type !== "fixed" || isOpen(row)) continue;
    if (typeof row.rate !== "number" || !row.lender_slug) continue;
    quotes.push({
      lenderName: row.lender_name || row.lender_slug,
      lenderSlug: row.lender_slug,
      rate: row.rate,
      mortgageType: row.mortgage_type || "unspecified",
    });
  }
  const lowest = quotes.reduce<FixedQuote | null>(
    (best, quote) => (best == null || quote.rate < best.rate ? quote : best),
    null,
  );

  const bestByBank = new Map<string, FixedQuote>();
  for (const quote of quotes) {
    if (quote.mortgageType !== "uninsured") continue;
    if (!(BIG5_SLUGS as readonly string[]).includes(quote.lenderSlug)) continue;
    const current = bestByBank.get(quote.lenderSlug);
    if (!current || quote.rate < current.rate) bestByBank.set(quote.lenderSlug, quote);
  }
  const big5Quotes = [...bestByBank.values()].sort((a, b) => a.rate - b.rate);
  return {
    lowest,
    big5Median: median(big5Quotes.map((quote) => quote.rate)),
    big5Quotes,
  };
}

/** Middle value when the count is odd. Average of the two middle values when it is even. */
export function median(values: readonly number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid];
  return round2((sorted[mid - 1] + sorted[mid]) / 2);
}

/** Mortgage rate minus the bond yield, in percentage points. */
export function spreadOverYield(mortgageRate: number, bondYield: number): number {
  return round2(mortgageRate - bondYield);
}
