import { calculateIrd, threeMonthInterestOnBalance } from "./mortgageMath";
import { formatCad, formatPct, latestScrapeDate, round2, wordCount } from "./dataFormat";

export const BREAK_BALANCE = 400_000;
export const BREAK_MONTHS = 36;

export const BIG5_BREAK = [
  { slug: "rbc", name: "RBC" },
  { slug: "td", name: "TD" },
  { slug: "scotiabank", name: "Scotiabank" },
  { slug: "bmo", name: "BMO" },
  { slug: "cibc", name: "CIBC" },
] as const;

export const FCAC_PENALTY_URL =
  "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/reduce-prepayment-penalties.html";

export interface RateRow {
  lender_name?: string;
  lender_slug?: string;
  term_months?: number;
  rate_type?: string;
  rate?: number | null;
  mortgage_type?: string | null;
  posted_rate?: number | null;
  source_url?: string | null;
  scraped_at?: string | null;
  raw_data?: {
    section?: string;
    product?: string;
    term_text?: string;
    is_open?: boolean;
  } | null;
}

export interface BreakExample {
  slug: string;
  lenderName: string;
  sourceUrl: string | null;
  contractRate: number | null;
  originalPosted: number | null;
  comparisonPosted: number | null;
  discount: number | null;
  comparisonRate: number | null;
  ird: number | null;
  threeMonth: number | null;
  penalty: number | null;
  binding: "ird" | "three_months" | null;
  complete: boolean;
  reason: string;
}

function isOpen(row: RateRow): boolean {
  if (row.raw_data?.is_open) return true;
  const name = `${row.raw_data?.product || ""} ${row.raw_data?.term_text || ""}`;
  return /\bopen\b/i.test(name);
}

function isPostedShelf(row: RateRow): boolean {
  if (row.raw_data?.section === "posted") return true;
  const name = `${row.raw_data?.product || ""} ${row.raw_data?.term_text || ""}`;
  return /posted/i.test(name);
}

function closedFixed(rows: readonly RateRow[], slug: string, term: number): RateRow[] {
  return rows.filter(
    (row) =>
      row.lender_slug === slug &&
      row.rate_type === "fixed" &&
      row.term_months === term &&
      row.mortgage_type === "uninsured" &&
      typeof row.rate === "number" &&
      !isOpen(row),
  );
}

function specialRow(rows: RateRow[]): RateRow | null {
  const specials = rows.filter((row) => !isPostedShelf(row) || typeof row.posted_rate === "number");
  const pool = specials.length ? specials : rows;
  if (!pool.length) return null;
  return pool.reduce((best, row) => ((row.rate as number) < (best.rate as number) ? row : best));
}

function postedForTerm(rows: RateRow[]): number | null {
  const withField = rows.find((row) => typeof row.posted_rate === "number");
  if (withField && typeof withField.posted_rate === "number") return withField.posted_rate;
  const shelf = rows.find((row) => isPostedShelf(row));
  return shelf && typeof shelf.rate === "number" ? shelf.rate : null;
}

/**
 * Posted-rate IRD on a $400,000 balance with 36 months left.
 * The original discount is assumed to equal today's posted-to-special gap.
 * Thirty-six months matches a 3-year posted term, so no term rounding is applied.
 */
export function postedIrdExample(input: {
  balance: number;
  monthsRemaining: number;
  contractRate: number;
  originalPosted: number;
  comparisonPosted: number;
}): {
  discount: number;
  comparisonRate: number;
  ird: number;
  threeMonth: number;
  penalty: number;
  binding: "ird" | "three_months";
} {
  const contractRate = round2(input.contractRate);
  const originalPosted = round2(input.originalPosted);
  const comparisonPosted = round2(input.comparisonPosted);
  const discount = round2(originalPosted - contractRate);
  const comparisonRate = round2(comparisonPosted - discount);
  const ird = Math.round(calculateIrd(input.balance, contractRate, comparisonRate, input.monthsRemaining));
  const threeMonth = Math.round(threeMonthInterestOnBalance(input.balance, contractRate));
  const binding = ird > threeMonth ? "ird" : "three_months";
  return {
    discount,
    comparisonRate,
    ird,
    threeMonth,
    penalty: Math.max(ird, threeMonth),
    binding,
  };
}

export function buildBreakExamples(rows: readonly RateRow[]): BreakExample[] {
  return BIG5_BREAK.map((bank) => {
    const fiveYear = closedFixed(rows, bank.slug, 60);
    const threeYear = closedFixed(rows, bank.slug, 36);
    const special = specialRow(fiveYear);
    const contractRate = special && typeof special.rate === "number" ? special.rate : null;
    const originalPosted =
      special && typeof special.posted_rate === "number" ? special.posted_rate : postedForTerm(fiveYear);
    const comparisonPosted = postedForTerm(threeYear);
    const sourceUrl = special?.source_url ?? fiveYear[0]?.source_url ?? null;
    const base = {
      slug: bank.slug,
      lenderName: bank.name,
      sourceUrl,
      contractRate,
      originalPosted,
      comparisonPosted,
      discount: null,
      comparisonRate: null,
      ird: null,
      threeMonth: contractRate == null ? null : Math.round(threeMonthInterestOnBalance(BREAK_BALANCE, contractRate)),
      penalty: null,
      binding: null as BreakExample["binding"],
      complete: false,
      reason: "",
    };

    if (contractRate == null) {
      base.reason = "The rate file has no uninsured closed 5-year fixed for this bank.";
      return base;
    }
    if (originalPosted == null || comparisonPosted == null) {
      base.reason =
        "The rate file has the 5-year special, but not both a 5-year posted shelf and a 3-year posted shelf. The posted-rate IRD is left blank rather than filled with a neighbouring term.";
      base.penalty = base.threeMonth;
      base.binding = "three_months";
      return base;
    }

    const computed = postedIrdExample({
      balance: BREAK_BALANCE,
      monthsRemaining: BREAK_MONTHS,
      contractRate,
      originalPosted,
      comparisonPosted,
    });
    return {
      ...base,
      discount: computed.discount,
      comparisonRate: computed.comparisonRate,
      ird: computed.ird,
      threeMonth: computed.threeMonth,
      penalty: computed.penalty,
      binding: computed.binding,
      complete: true,
      reason:
        "Compared with today's 3-year posted rate minus the assumed original discount. Thirty-six months is an exact 3-year term, so the remainder is not rounded.",
    };
  });
}

export function breakFileDate(rows: readonly RateRow[]): string | null {
  const slugs = new Set(BIG5_BREAK.map((bank) => bank.slug));
  return latestScrapeDate(rows.filter((row) => row.lender_slug && slugs.has(row.lender_slug)));
}

function joinNames(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export function breakLead(examples: readonly BreakExample[], asOf: string): string {
  const done = examples.filter((example) => example.complete && example.penalty != null);
  const incomplete = examples.filter((example) => !example.complete).map((example) => example.lenderName);
  if (!done.length) {
    return `The ${asOf} rate file does not contain a 5-year posted shelf and a 3-year posted shelf for any Big Five bank, so this page does not publish a posted-rate IRD. Three months' interest is shown only where an uninsured 5-year special is in the file.`;
  }
  const priced = done
    .map((example) => `${formatCad(example.penalty)} at ${example.lenderName}`)
    .join(" and ");
  const binding = done.every((example) => example.binding === "three_months")
    ? "In each completed row, three months' interest is higher than the posted-rate IRD."
    : "The figure for each bank is the greater of the posted-rate IRD and three months' interest.";
  const missing = incomplete.length
    ? ` ${joinNames(incomplete)} ${incomplete.length === 1 ? "is" : "are"} in the same file without a 3-year posted shelf, so no posted IRD is invented for ${incomplete.length === 1 ? "that bank" : "those banks"}.`
    : "";
  return `On a $400,000 balance with three years left, the illustrative break cost using today's posted rates is ${priced}. ${binding}${missing}`;
}

export function breakExplanation(examples: readonly BreakExample[], asOf: string): string[] {
  const bySlug = new Map(examples.map((example) => [example.slug, example]));
  const td = bySlug.get("td");
  const cibc = bySlug.get("cibc");
  const walk = (example: BreakExample | undefined) => {
    if (!example?.complete) return "";
    return `${example.lenderName}'s uninsured 5-year special in the file is ${formatPct(example.contractRate)} and its 5-year posted rate is ${formatPct(example.originalPosted)}, so the assumed original discount is ${formatPct(example.discount)}. The 3-year posted rate is ${formatPct(example.comparisonPosted)}. The comparison rate is ${formatPct(example.comparisonPosted)} minus ${formatPct(example.discount)}, which is ${formatPct(example.comparisonRate)}. The interest rate differential is ${formatCad(example.ird)}. Three months' interest is ${formatCad(example.threeMonth)}. The greater figure, and the one this illustration would treat as the charge, is ${formatCad(example.penalty)}.`;
  };

  const partials = examples
    .filter((example) => !example.complete && example.threeMonth != null)
    .map(
      (example) =>
        `${example.lenderName} at ${formatPct(example.contractRate)} (${formatCad(example.threeMonth)} for three months' interest)`,
    );

  return [
    `A closed fixed-rate mortgage in Canada can usually be paid out before the term ends, and the lender charges for that. The Financial Consumer Agency of Canada describes the usual prepayment charge as the higher of three months' interest on the amount still owing and an interest rate differential. Three months' interest in this example is the balance times the contract rate times 3/12. It is not three blended monthly payments. The differential compares the contract rate with a rate the lender uses for the time left on the term.`,
    `Big-bank contracts often build that comparison from posted rates. The outline used here follows the pattern FCAC describes. The original discount is the posted rate for the term that was taken, minus the rate in the contract. The comparison rate is today's posted rate for a term matching the time remaining, minus that same discount. The differential is the contract rate minus the comparison rate, multiplied by the balance and by the years left. If that gap is zero or negative, the differential is zero and the charge falls back to three months' interest. The penalty in the table is the greater of the two figures. An administration fee or a discharge fee is not included.`,
    `Every row uses the same labelled assumptions, so the banks can be compared. The balance is ${formatCad(BREAK_BALANCE)}. The remaining term is ${BREAK_MONTHS} months, three years left on a five-year fixed. The contract rate is that bank's current uninsured five-year fixed special in the ${asOf} rate file. The original discount is assumed to equal today's gap between that bank's five-year posted rate and that special. That is an assumption. The file does not contain the posted rate from the day the mortgage was funded. The comparison posted rate is the bank's current three-year posted rate. Thirty-six months is an exact three-year term, so the example does not round the remainder up or down to a neighbouring posted term.`,
    `Some contracts do round a leftover term, for example to the next shorter posted term or the next longer one that the bank publishes. Those rounding rules are not applied on this page. They are not stored in the rate file, and this example does not need a rounded term when a three-year posted rate is present. Where the file has no three-year posted rate, the differential is left blank. Borrowing a two-year or a four-year posted rate and calling it the three-year comparison would be a guess about that bank's method.`,
    `On the ${asOf} file, ${walk(td)} ${walk(cibc)} In the completed rows, read the binding column before treating the differential as the charge. The posted-rate method is quiet when today's posted curve, after the discount is removed, sits at or above the contract rate. It becomes the larger number when the contract rate sits well above that comparison rate. Someone who locked a higher fixed rate in 2023 or 2024 and wants out now is often in that second group. This page does not invent that older contract rate. It uses the special in today's file, and it says so.`,
    partials.length
      ? `The same file does include uninsured five-year specials for the banks whose posted IRD is blank: ${partials.join("; ")}. Three months' interest on those rates uses the same $400,000 balance. The posted differential is blank because the file does not include both shelves the formula needs. RBC's fixed rows are stored as specials and the posted-rate field is empty. BMO's three-year fixed row is a special, while the rows whose names say posted are other terms. Scotiabank's current file has a five-year special and no other fixed term. Those are facts about the scrape, not a claim that the banks have no posted rates on their own sites.`
      : `Where a bank's posted shelves are missing from the file, the differential is blank. Three months' interest is still shown when the uninsured five-year special is present.`,
    `Treat every dollar figure as an illustration, not a payout quote. The mortgage contract's information box is the formula the lender will use, and the original discount on a real mortgage is the one from the funding day, which may not match today's special. A prepayment privilege, if the lender still allows it before a full payout, reduces the balance the charge multiplies. Ask the lender for a written payout that shows the comparison rate. The penalty calculator on this site runs the same three-month and differential arithmetic on numbers you type. The prepayment penalties guide sets the posted method next to the discounted method and cites FCAC and the Interest Act.`,
  ];
}

export function breakExplanationWords(examples: readonly BreakExample[], asOf: string): number {
  return wordCount(breakExplanation(examples, asOf).join(" "));
}
