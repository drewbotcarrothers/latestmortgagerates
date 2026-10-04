import rawRates from "../../data/rates.json";
import { labelButlerRatesInsured, type LenderRate } from "./lenderOverview";

export type PublishedRate = LenderRate & {
  lender_name: string;
  lender_slug: string;
  scraped_at?: string;
  raw_data?: unknown;
};

/** Rates the site renders. Butler rows with no mortgage type are insured. */
export const publishedRates: PublishedRate[] = labelButlerRatesInsured(rawRates as PublishedRate[]);
