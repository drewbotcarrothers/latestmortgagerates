export interface LenderRateRow {
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type?: string | null;
}

const TITLE_OVERRIDES: Record<string, (monthYear: string) => string> = {
  atb: (monthYear) =>
    `ATB Mortgage Rates Today (${monthYear}) – ATB Financial Fixed, Variable & HELOC`,
  vancity: (monthYear) =>
    `Vancity Mortgage Rates Today (${monthYear}) – BC Fixed & Variable vs Banks`,
  truenorth: () => `True North Mortgage Rates Today – Fixed & Variable vs Big Banks`,
  td: (monthYear) =>
    `TD Mortgage Rates Today – Fixed, Variable & Special Offers (${monthYear})`,
};

/** Titles rewritten for queries that get impressions and no clicks. Kept to 60 characters. */
const CTR_LABELS: Record<string, string> = {
  manulife: "Manulife Mortgage Rates",
  coastcapital: "Coast Capital Mortgage Rates",
  meridian: "Meridian Mortgage Rates",
  wealthsimple: "Wealthsimple Mortgage Rates",
};

const CTR_TAILS: Record<string, string> = {
  manulife: "Manulife One is a separate all-in-one account.",
  coastcapital: "A B.C. credit union, not a Big 5 bank.",
  meridian: "An Ontario credit union.",
  wealthsimple: "Insured quotes through brokers, not a Big 5 branch.",
};

/** 5-year fixed and variable, lowest scraped quote, in a title of at most 60 characters. */
export function ctrLenderTitle(label: string, rates: LenderRateRow[]): string {
  const fixed = bestRate(rates, 60, "fixed");
  const variable = bestRate(rates, 60, "variable");
  const bits: string[] = [];
  if (fixed != null) bits.push(`${pct(fixed)} Fixed`);
  if (variable != null) bits.push(`${pct(variable)} Var`);
  const withPair = bits.length ? `${label}: ${bits.join(", ")}` : label;
  if (withPair.length <= 60) return withPair;
  const available = [fixed, variable].filter((rate): rate is number => rate != null);
  if (available.length) {
    const short = `${label} from ${pct(Math.min(...available))}`;
    if (short.length <= 60) return short;
  }
  return label.length <= 60 ? label : label.slice(0, 60);
}

export function ctrLenderDescription(slug: string, lenderName: string, rates: LenderRateRow[]): string {
  const fixed = bestRate(rates, 60, "fixed");
  const variable = bestRate(rates, 60, "variable");
  const bits: string[] = [];
  if (fixed != null) bits.push(`5-year fixed from ${pct(fixed)}`);
  if (variable != null) bits.push(`5-year variable from ${pct(variable)}`);
  const lead = bits.length
    ? `${lenderName} mortgage rates today: ${bits.join(" and ")}.`
    : `Compare current ${lenderRatesKeyword(lenderName)}.`;
  const tail = CTR_TAILS[slug] ?? "Figures are the latest scrape, not a commitment.";
  return `${lead} ${tail}`;
}

/** Consecutive repeated words, e.g. "Mortgage Mortgage". */
export function hasDoubledWord(text: string): boolean {
  return /\b([A-Za-z][A-Za-z'-]*)\s+\1\b/i.test(text);
}

export function defaultLenderTitle(lenderName: string): string {
  return `${lenderRatesHeading(lenderName)} | Latest Mortgage Rates Canada`;
}

/** Avoid "True North Mortgage Mortgage Rates" when the lender name already includes Mortgage. */
export function lenderRatesHeading(lenderName: string): string {
  const name = lenderName.trim();
  if (/\bmortgages?\b/i.test(name)) return `${name} Rates`;
  return `${name} Mortgage Rates`;
}

/** Keyword phrase that does not repeat "mortgage" when it is already in the lender name. */
export function lenderRatesKeyword(lenderName: string): string {
  const name = lenderName.trim();
  if (/\bmortgages?\b/i.test(name)) return `${name} rates`;
  return `${name} mortgage rates`;
}

export function lenderSeoTitle(
  slug: string,
  lenderName: string,
  monthYear: string,
  storedTitle?: string,
  rates: LenderRateRow[] = []
): string {
  const ctrLabel = CTR_LABELS[slug];
  if (ctrLabel) return ctrLenderTitle(ctrLabel, rates);
  const override = TITLE_OVERRIDES[slug];
  if (override) return override(monthYear);
  if (storedTitle && !hasDoubledWord(storedTitle)) return storedTitle;
  return defaultLenderTitle(lenderName);
}

function bestRate(rates: LenderRateRow[], months: number, type: string): number | null {
  const rows = rates.filter((row) => row.term_months === months && row.rate_type === type);
  if (!rows.length) return null;
  return Math.min(...rows.map((row) => row.rate));
}

function pct(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

/** Live 5-year sentence. Omits a percentage when that product is absent from the scrape. */
export function liveFiveYearSentence(lenderName: string, rates: LenderRateRow[]): string {
  const fixed = bestRate(rates, 60, "fixed");
  const variable = bestRate(rates, 60, "variable");
  if (fixed == null && variable == null) {
    return `See the live table for ${lenderName} fixed and variable quotes.`;
  }
  const bits: string[] = [];
  if (fixed != null) bits.push(`lowest 5-year fixed is ${pct(fixed)}`);
  if (variable != null) bits.push(`lowest 5-year variable is ${pct(variable)}`);
  return `In the latest scrape, ${lenderName}'s ${bits.join(" and the ")}.`;
}

export function trueNorthDescription(rates: LenderRateRow[]): string {
  return `True North mortgage rates today: fixed and variable quotes versus the big banks. ${liveFiveYearSentence("True North", rates)} Those figures are scraped offers, not a guarantee and not a promise of Canada's lowest rate.`;
}

const TD_DESCRIPTION =
  "Compare TD mortgage rates today: fixed, variable, and special offers from our latest scrape, including how TD bank refinance rates differ from a straight renewal. The table is the rate source — confirm the contract with TD.";

export function lenderSeoDescription(input: {
  slug: string;
  lenderName: string;
  stored?: string;
  tagline?: string;
  rates: LenderRateRow[];
}): string {
  const { slug, lenderName, stored, tagline, rates } = input;
  if (CTR_LABELS[slug]) return ctrLenderDescription(slug, lenderName, rates);
  if (slug === "truenorth") return trueNorthDescription(rates);
  if (slug === "td") return TD_DESCRIPTION;
  if (stored && !/guaranteed/i.test(stored) && !/\d+\.\d{2}\s*%/.test(stored)) {
    return stored;
  }
  const safeTagline = tagline && !/guaranteed/i.test(tagline) ? ` ${tagline}` : "";
  return `Compare current ${lenderRatesKeyword(lenderName)} in Canada. ${liveFiveYearSentence(lenderName, rates)}${safeTagline} Updated from our latest scrape.`;
}

export const TD_SEO_DESCRIPTION = TD_DESCRIPTION;
