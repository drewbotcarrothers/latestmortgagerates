import { formatBuildDateLong } from "./buildDate";

export interface LenderRateRow {
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type?: string | null;
  scraped_at?: string | null;
  posted_rate?: number | null;
  raw_data?: { product?: string } | null;
}

/** Search-facing short names. The on-page H1 still uses the full lender name. */
const SHORT_NAMES: Record<string, string> = {
  alterna: "Alterna",
  atb: "ATB",
  bmo: "BMO",
  butlermortgage: "Butler Mortgage",
  cibc: "CIBC",
  cmls: "CMLS",
  coastcapital: "Coast Capital",
  desjardins: "Desjardins",
  equitable: "Equitable",
  firstnational: "First National",
  hometrust: "Home Trust",
  manulife: "Manulife",
  meridian: "Meridian",
  nationalbank: "National Bank",
  nesto: "nesto",
  rbc: "RBC",
  rfa: "RFA",
  scotiabank: "Scotiabank",
  simplii: "Simplii",
  tangerine: "Tangerine",
  td: "TD",
  truenorth: "True North Mortgage",
  vancity: "Vancity",
  wealthsimple: "Wealthsimple",
};

const DESCRIPTION_TAILS: Record<string, string> = {
  manulife: "Manulife One is a separate all-in-one account, not a closed Select term.",
  coastcapital: "A B.C. credit union, not a Big 5 bank.",
  meridian: "An Ontario credit union.",
  wealthsimple: "Insured quotes through brokers, not a Big 5 branch.",
  td: "Ask how a refinance quote differs from a straight renewal.",
  truenorth: "A brokerage grid, not a promise of the lowest rate.",
  butlermortgage: "An Ontario brokerage. Rows on this site are labelled Insured (<20% down).",
};

const TITLE_LIMIT = 60;

const MANULIFE_RATES_URL = "https://www.manulifebank.ca/current-rates.html";

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

function titleLabel(slug: string, lenderName: string): string {
  return lenderRatesHeading(SHORT_NAMES[slug] ?? lenderName);
}

function bestRate(rates: LenderRateRow[], months: number, type: string): number | null {
  const rows = rates.filter((row) => row.term_months === months && row.rate_type === type);
  if (!rows.length) return null;
  return Math.min(...rows.map((row) => row.rate));
}

function lowestOverall(rates: LenderRateRow[]): LenderRateRow | null {
  if (!rates.length) return null;
  return rates.reduce((best, row) => (row.rate < best.rate ? row : best));
}

function pct(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

function termPhrase(months: number): string {
  if (months % 12 === 0) return `${months / 12}-year`;
  return `${months}-month`;
}

function latestScrapedAt(rates: LenderRateRow[]): Date | null {
  let latest: number | null = null;
  for (const row of rates) {
    if (!row.scraped_at) continue;
    const time = Date.parse(row.scraped_at);
    if (Number.isNaN(time)) continue;
    if (latest == null || time > latest) latest = time;
  }
  return latest == null ? null : new Date(latest);
}

export function lenderUpdateLabel(rates: LenderRateRow[]): string | null {
  const date = latestScrapedAt(rates);
  return date ? formatBuildDateLong(date) : null;
}

function rateClause(rates: LenderRateRow[]): string | null {
  const fiveYear = rates.filter((row) => row.term_months === 60);
  const pool = fiveYear.length ? fiveYear : rates;
  const fixed = bestRate(pool, 60, "fixed");
  const lowest = lowestOverall(pool);
  if (fixed == null && lowest == null) return null;
  const bits: string[] = [];
  if (fixed != null) bits.push(`5-year fixed from ${pct(fixed)}`);
  if (lowest && (fixed == null || lowest.rate < fixed - 0.001)) {
    bits.push(`lowest is ${pct(lowest.rate)} (${termPhrase(lowest.term_months)} ${lowest.rate_type})`);
  }
  return bits.join("; ");
}

/**
 * `<Lender> Mortgage Rates Today (<Month Year>): 5-Yr Fixed from X.XX%`,
 * shortened until it fits in 60 characters. Omits a 5-year fixed claim when that row is absent.
 */
export function lenderSeoTitle(
  slug: string,
  lenderName: string,
  monthYear: string,
  storedTitle?: string,
  rates: LenderRateRow[] = [],
): string {
  const label = titleLabel(slug, lenderName);
  const fixed = bestRate(rates, 60, "fixed");
  const lowest = lowestOverall(rates);
  const candidates: string[] = [];
  if (fixed != null) {
    const rate = pct(fixed);
    candidates.push(`${label} Today (${monthYear}): 5-Yr Fixed from ${rate}`);
    candidates.push(`${label} (${monthYear}): 5-Yr Fixed from ${rate}`);
    candidates.push(`${label} Today (${monthYear}): from ${rate}`);
    candidates.push(`${label}: 5-Yr Fixed from ${rate}`);
    candidates.push(`${label} from ${rate}`);
  } else if (lowest) {
    const rate = pct(lowest.rate);
    candidates.push(`${label} Today (${monthYear}): from ${rate}`);
    candidates.push(`${label} (${monthYear}): from ${rate}`);
    candidates.push(`${label} from ${rate}`);
  }
  candidates.push(`${label} Today (${monthYear})`);
  candidates.push(label);
  const fit = candidates.find((title) => title.length <= TITLE_LIMIT && !hasDoubledWord(title));
  if (fit) return fit;
  if (storedTitle && storedTitle.length <= TITLE_LIMIT && !hasDoubledWord(storedTitle)) return storedTitle;
  return label.length <= TITLE_LIMIT ? label : label.slice(0, TITLE_LIMIT);
}

export function lenderSeoDescription(input: {
  slug: string;
  lenderName: string;
  stored?: string;
  tagline?: string;
  rates: LenderRateRow[];
}): string {
  const { slug, lenderName, rates } = input;
  const clause = rateClause(rates);
  const updated = lenderUpdateLabel(rates);
  const lead = clause
    ? `${lenderRatesKeyword(lenderName)} today: ${clause}.`
    : `Compare current ${lenderRatesKeyword(lenderName)}.`;
  const dated = updated ? ` Updated ${updated}.` : "";
  const tail = DESCRIPTION_TAILS[slug] ?? "Figures are the latest scrape, not a commitment.";
  return `${lead}${dated} ${tail}`.replace(/\s+/g, " ").trim();
}

/** One-sentence answer under the H1, using only rates in the scrape. */
export function lenderDirectAnswer(lenderName: string, rates: LenderRateRow[]): string {
  const clause = rateClause(rates);
  const updated = lenderUpdateLabel(rates);
  if (!clause) return `See the live table for ${lenderRatesKeyword(lenderName)}.`;
  const dated = updated ? ` Updated ${updated}.` : "";
  return `${lenderRatesHeading(lenderName)} in the latest scrape: ${clause}.${dated} Those figures are published offers, not a commitment.`;
}

export interface LenderFaq {
  question: string;
  answer: string;
}

/**
 * Manulife One facts from manulifebank.ca/current-rates.html, current as of November 16, 2026,
 * plus the One and Select rows in the scrape. No standing "prime plus" formula is invented:
 * the page prices One off its own base rate and Select off Manulife Bank prime.
 */
export function manulifeOneParagraphs(rates: LenderRateRow[]): string[] {
  const oneFixed = rates
    .filter(
      (row) =>
        row.term_months === 60 &&
        row.rate_type === "fixed" &&
        /manulife one/i.test(row.raw_data?.product ?? ""),
    )
    .sort((a, b) => a.rate - b.rate)[0];
  const selectVariable = rates.find(
    (row) => row.rate_type === "variable" && /prime \+ 0\.00%/i.test(row.raw_data?.product ?? ""),
  );
  const oneSentence = oneFixed
    ? ` The new-client Manulife One 5-year closed fixed in this scrape is ${pct(oneFixed.rate)}${
        oneFixed.posted_rate != null ? `, beside a posted rate of ${pct(oneFixed.posted_rate)}` : ""
      }.`
    : "";
  const selectSentence = selectVariable
    ? ` Select's 5-year closed variable in this scrape is ${pct(selectVariable.rate)}, and the product name on the rate page is Manulife Bank prime + 0.00%.`
    : "";
  return [
    `Manulife One is an all-in-one mortgage. <a href="${MANULIFE_RATES_URL}">Manulife Bank's rate page</a> says it combines your mortgage with your bank accounts, short-term savings, income, and other debts. It is not a Manulife Bank Select closed term, and it is not the separate Access Line of Credit.`,
    `One's variable sub-account follows the Manulife One Base Rate, not Manulife Bank Prime. On that page, current as of November 16, 2026, the Base Rate is 5.20% and the 5-year open sub-account is Base Rate plus 0%, also 5.20%. The same page lists Manulife Bank Prime at 4.70%.${selectSentence} Variable sub-account interest is compounded monthly on the daily closing balance. Fixed sub-account interest is compounded semi-annually.`,
    `A paycheque left in the account reduces the balance that interest is charged on. That is why a closed-mortgage payment is the wrong model for One.${oneSentence} The <a href="/tools/mortgage-calculator/">mortgage payment calculator</a> estimates a closed Canadian payment. It is not a Manulife One calculator. The Access Line of Credit/Plus on the same rate page was 5.70% as of November 16, 2026.`,
  ];
}

/** Small live FAQ. Stored lender FAQs stay rate-free; these answers read the scrape. */
export function lenderSnippetFaqs(slug: string, lenderName: string, rates: LenderRateRow[]): LenderFaq[] {
  const direct = lenderDirectAnswer(lenderName, rates);
  const faqs: LenderFaq[] = [
    {
      question: `What are ${lenderRatesKeyword(lenderName)} today?`,
      answer: direct,
    },
  ];
  if (slug === "meridian") {
    faqs.push({
      question: "What are Meridian Credit Union mortgage rates?",
      answer: `${direct} Meridian is an Ontario credit union, and membership is part of the application.`,
    });
  }
  if (slug === "coastcapital") {
    faqs.push({
      question: "What are Coast Capital Savings mortgage rates?",
      answer: `${direct} Coast Capital is a B.C. federal credit union, not a Big 5 bank.`,
    });
  }
  if (slug === "butlermortgage") {
    faqs.push({
      question: "Does this page review Butler Mortgage?",
      answer:
        "No. This page does not publish star ratings or customer reviews. It publishes the rates scraped from Butler's own rate page. Butler Mortgage is an Ontario brokerage, and every Butler row here is labelled Insured (<20% down). The funding lender is the name on the commitment.",
    });
  }
  if (slug === "truenorth") {
    faqs.push({
      question: "Are True North Mortgage rates the rate you sign?",
      answer: `${direct} True North is a brokerage. The lender named on the commitment sets the penalty and the privilege.`,
    });
  }
  if (slug === "manulife") {
    faqs.push(
      {
        question: "What is the Manulife One interest rate?",
        answer:
          "Manulife One's variable sub-account is priced off the Manulife One Base Rate, not Manulife Bank Prime. On Manulife Bank's rate page, current as of November 16, 2026, that Base Rate is 5.20% and the 5-year open sub-account is Base Rate plus 0%. The same page lists Manulife Bank Prime at 4.70%, which is the reference for Select variable pricing. Fixed One sub-accounts are separate rates in the table on this page.",
      },
      {
        question: "Is Manulife One a line of credit?",
        answer:
          "Manulife describes One as an all-in-one mortgage that combines the mortgage with bank accounts, savings, income, and other debts. It is not the Access Line of Credit. That separate line was listed at 5.70% on the rate page as of November 16, 2026.",
      },
      {
        question: "Is there a Manulife One payment calculator?",
        answer:
          "Not on this site. One charges interest on the daily closing balance, so deposits change the interest. The mortgage payment calculator estimates a closed Canadian payment, including payment frequency. Ask Manulife to model a One balance.",
      },
    );
  }
  return faqs;
}
