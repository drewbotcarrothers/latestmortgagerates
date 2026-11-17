import { lenderCountLabel } from "./lenderCount";
import { publishedRates } from "./publishedRates";

function lowestInsuredFiveYear(rateType: "fixed" | "variable"): number | null {
  const rows = publishedRates.filter(
    (row) => row.term_months === 60 && row.rate_type === rateType && row.mortgage_type === "insured",
  );
  if (!rows.length) return null;
  return Math.min(...rows.map((row) => row.rate));
}

function pct(rate: number | null): string {
  return rate == null ? "" : `${rate.toFixed(2)}%`;
}

/** Lowest insured 5-year fixed in the rate file. */
export const HOME_INSURED_FIVE_YEAR_FIXED = lowestInsuredFiveYear("fixed");

/** Lowest insured 5-year variable in the rate file. */
export const HOME_INSURED_FIVE_YEAR_VARIABLE = lowestInsuredFiveYear("variable");

const headlineRates = [HOME_INSURED_FIVE_YEAR_FIXED, HOME_INSURED_FIVE_YEAR_VARIABLE].filter(
  (rate): rate is number => rate != null,
);
const lowestHeadline = headlineRates.length ? Math.min(...headlineRates) : null;

/** Homepage <title>. The rate is the lowest insured 5-year quote in the rate file. */
export const HOME_TITLE = lowestHeadline
  ? `Best Mortgage Rates in Canada from ${pct(lowestHeadline)}`
  : `Compare Mortgage Rates in Canada: ${lenderCountLabel} Lenders, Updated Daily`;

export const HOME_DESCRIPTION = `Today's lowest insured 5-year variable is ${pct(HOME_INSURED_FIVE_YEAR_VARIABLE)} and the lowest insured 5-year fixed is ${pct(HOME_INSURED_FIVE_YEAR_FIXED)}, from ${lenderCountLabel} Canadian lenders, updated daily.`;
