import catalog from "./staleSpecials.json";

/**
 * Last scraped specials used only when data/rates.json is missing that row.
 * RBC rows are the 2026-11-26 19:54 UTC scrape (commit a3f44a97). TD and CIBC
 * rows are the 2026-11-27 scrape. Nothing here is a guessed rate.
 */
export type CatalogSpecial = {
  lender_slug: string;
  lender_name: string;
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type: string;
  posted_rate: number | null;
  scraped_at?: string;
  source_url?: string;
  raw_data?: {
    section?: string;
    product?: string;
    source?: string;
    stale?: boolean;
  };
};

const rows = catalog as CatalogSpecial[];

export function staleGuideSpecial(
  slug: string,
  termMonths: number,
  rateType: string,
  mortgageType: string,
): CatalogSpecial | null {
  const row = rows.find(
    (item) =>
      item.lender_slug === slug &&
      item.term_months === termMonths &&
      item.rate_type === rateType &&
      item.mortgage_type === mortgageType,
  );
  if (!row) return null;
  return {
    ...row,
    raw_data: {
      ...row.raw_data,
      stale: true,
    },
  };
}
