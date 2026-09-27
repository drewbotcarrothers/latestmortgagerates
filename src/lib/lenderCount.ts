import ratesData from "../../data/rates.json";

interface RateRow {
  lender_slug?: string | null;
}

const rows: RateRow[] = Array.isArray(ratesData) ? (ratesData as RateRow[]) : [];

/** Distinct lender_slug values in data/rates.json. */
export const LENDER_COUNT = new Set(
  rows.map((row) => row.lender_slug).filter((slug): slug is string => Boolean(slug)),
).size;

/** Marketing label such as "25+". */
export const lenderCountLabel = `${LENDER_COUNT}+`;
