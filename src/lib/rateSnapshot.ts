import metadata from "../../data/metadata.json";
import { communityRates, formatAsOf, formatRate, PUBLIC_MIN_N } from "./communityRates";
import { publishedRates, type PublishedRate } from "./publishedRates";

const BIG5 = ["td", "rbc", "cibc", "bmo", "scotiabank"] as const;

export interface LowestRate {
  rate: number;
  label: string;
  lenders: string[];
  mortgageType: string;
}

export interface PostedMedian {
  /** Median of one posted rate per Big Five bank that actually has posted_rate. */
  rate: number;
  label: string;
  banks: { slug: string; name: string; posted: number }[];
  missing: string[];
}

export interface ReportedMedian {
  label: string;
  n: number;
}

export interface RateSnapshot {
  asOfLabel: string;
  reportedAsOfLabel: string;
  attribution: string;
  fixed: {
    lowest: LowestRate | null;
    big5Posted: PostedMedian | null;
    reported: ReportedMedian | null;
  };
  variable: {
    lowest: LowestRate | null;
    big5Posted: PostedMedian | null;
    reported: ReportedMedian | null;
  };
}

function formatPosted(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

function formatIsoDate(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid];
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

function rowsFor(rateType: "fixed" | "variable"): PublishedRate[] {
  return publishedRates.filter(
    (row) => row.term_months === 60 && row.rate_type === rateType && typeof row.rate === "number"
  );
}

function lowestOf(rows: PublishedRate[]): LowestRate | null {
  if (rows.length === 0) return null;
  const rate = Math.min(...rows.map((row) => row.rate));
  const tied = rows.filter((row) => row.rate === rate);
  const lenders = [...new Set(tied.map((row) => row.lender_name))];
  return {
    rate,
    label: formatPosted(rate),
    lenders,
    mortgageType: tied[0].mortgage_type,
  };
}

function postedForBank(rows: PublishedRate[], slug: string): number | null {
  const bankRows = rows.filter((row) => row.lender_slug === slug && typeof row.posted_rate === "number");
  if (bankRows.length === 0) return null;
  const uninsured = bankRows.filter((row) => row.mortgage_type === "uninsured");
  const pool = uninsured.length > 0 ? uninsured : bankRows;
  const chosen = [...pool].sort((a, b) => a.rate - b.rate)[0];
  return chosen.posted_rate as number;
}

function big5Posted(rows: PublishedRate[]): PostedMedian | null {
  const banks: PostedMedian["banks"] = [];
  const missing: string[] = [];
  for (const slug of BIG5) {
    const posted = postedForBank(rows, slug);
    const name = rows.find((row) => row.lender_slug === slug)?.lender_name ?? slug.toUpperCase();
    if (posted == null) {
      missing.push(name);
      continue;
    }
    banks.push({ slug, name, posted });
  }
  const rate = median(banks.map((bank) => bank.posted));
  if (rate == null) return null;
  return { rate, label: formatPosted(rate), banks, missing };
}

function reported(rateType: "fixed" | "variable"): ReportedMedian | null {
  const cell = communityRates.windows["30d"].products.find(
    (product) =>
      product.termMonths === 60 && product.rateType === rateType && product.insured === "unknown"
  );
  if (!cell || cell.n < PUBLIC_MIN_N) return null;
  return { label: formatRate(cell.median), n: cell.n };
}

export function buildRateSnapshot(): RateSnapshot {
  const fixedRows = rowsFor("fixed");
  const variableRows = rowsFor("variable");
  return {
    asOfLabel: formatIsoDate(metadata.last_updated),
    reportedAsOfLabel: formatAsOf(communityRates.asOf),
    attribution: communityRates.attribution,
    fixed: {
      lowest: lowestOf(fixedRows),
      big5Posted: big5Posted(fixedRows),
      reported: reported("fixed"),
    },
    variable: {
      lowest: lowestOf(variableRows),
      big5Posted: big5Posted(variableRows),
      reported: reported("variable"),
    },
  };
}

export const rateSnapshot = buildRateSnapshot();

export function lenderList(lenders: string[]): string {
  if (lenders.length === 0) return "a lender in today's file";
  if (lenders.length === 1) return lenders[0];
  if (lenders.length === 2) return `${lenders[0]} and ${lenders[1]}`;
  return `${lenders.slice(0, -1).join(", ")}, and ${lenders[lenders.length - 1]}`;
}

export function postedSentence(kind: "5-year fixed" | "5-year variable", posted: PostedMedian | null): string {
  if (!posted) {
    return `Today's file has no Big Five posted rate on ${kind}.`;
  }
  const included = posted.banks.map((bank) => `${bank.name} ${formatPosted(bank.posted)}`).join(" and ");
  const missing =
    posted.missing.length > 0
      ? ` ${posted.missing.join(", ")} ${posted.missing.length === 1 ? "has" : "have"} no posted rate on that row, so ${posted.missing.length === 1 ? "that bank is" : "those banks are"} left out of the median.`
      : "";
  return `The Big Five posted median on ${kind} is ${posted.label}, from the posted rates in the file (${included}).${missing}`;
}
