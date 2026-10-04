/**
 * Lender-page rate overview.
 *
 * The table used to keep only mortgage_type "insured" and "uninsured".
 * Rows with a missing type (Butler, before they were labelled) became an
 * all-dash grid even though the lender had rates. Missing posted_rate is
 * display-only and must not drop the row.
 */

export interface LenderRate {
  lender_name?: string;
  lender_slug?: string;
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type?: string | null;
  posted_rate?: number | null;
  spread_to_prime?: string | null;
  source_url?: string | null;
  apr?: string | null;
  ltv_tier?: string | null;
}

export interface OverviewRow {
  term: number;
  label: string;
  fixedInsured?: LenderRate;
  fixedUninsured?: LenderRate;
  fixedUnstated?: LenderRate;
  variableInsured?: LenderRate;
  variableUninsured?: LenderRate;
  variableUnstated?: LenderRate;
}

/** Butler's advertised sheet is high-ratio (default-insured). */
export const BUTLER_SLUG = "butlermortgage";

export function mortgageTypeMissing(type: string | null | undefined): boolean {
  return type == null || String(type).trim() === "";
}

/**
 * Butler rows that do not already say insured or uninsured are insured.
 * An explicit label is kept. Other lenders are unchanged.
 */
export function labelButlerRatesInsured<T extends { lender_slug?: string; mortgage_type?: string | null }>(
  rates: readonly T[],
): T[] {
  return rates.map((rate) => {
    if (rate.lender_slug !== BUTLER_SLUG) return rate;
    if (rate.mortgage_type === "insured" || rate.mortgage_type === "uninsured") return rate;
    if (!mortgageTypeMissing(rate.mortgage_type)) return rate;
    return { ...rate, mortgage_type: "insured" };
  });
}

export function formatPostedRate(posted: number | null | undefined): string | null {
  if (posted == null) return null;
  const value = typeof posted === "number" ? posted : Number(posted);
  if (!Number.isFinite(value)) return null;
  return `${value.toFixed(2)}%`;
}

export function termLabel(months: number): string {
  if (months < 12) return `${months} months`;
  if (months === 12) return "1 year";
  return `${months / 12} years`;
}

function lowest(rates: LenderRate[]): LenderRate | undefined {
  if (rates.length === 0) return undefined;
  return rates.reduce((best, rate) => (rate.rate < best.rate ? rate : best));
}

function pick(rates: LenderRate[], rateType: string, kind: "insured" | "uninsured" | "unstated"): LenderRate | undefined {
  return lowest(
    rates.filter((rate) => {
      if (rate.rate_type !== rateType) return false;
      if (kind === "unstated") return mortgageTypeMissing(rate.mortgage_type);
      return rate.mortgage_type === kind;
    }),
  );
}

/** One row per term. Unlabelled rates stay visible in the "not stated" cells. */
export function buildRateOverview(rates: readonly LenderRate[]): OverviewRow[] {
  const terms = [...new Set(rates.map((rate) => rate.term_months))].sort((a, b) => a - b);
  return terms.map((term) => {
    const termRates = rates.filter((rate) => rate.term_months === term);
    return {
      term,
      label: termLabel(term),
      fixedInsured: pick(termRates, "fixed", "insured"),
      fixedUninsured: pick(termRates, "fixed", "uninsured"),
      fixedUnstated: pick(termRates, "fixed", "unstated"),
      variableInsured: pick(termRates, "variable", "insured"),
      variableUninsured: pick(termRates, "variable", "uninsured"),
      variableUnstated: pick(termRates, "variable", "unstated"),
    };
  });
}

export function overviewRates(row: OverviewRow): LenderRate[] {
  return [
    row.fixedInsured,
    row.fixedUninsured,
    row.fixedUnstated,
    row.variableInsured,
    row.variableUninsured,
    row.variableUnstated,
  ].filter((rate): rate is LenderRate => Boolean(rate));
}
