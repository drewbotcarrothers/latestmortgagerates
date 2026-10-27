import { communityRates, formatAsOf, formatRate } from "../../lib/communityRates";

/** Editorial pass that added the answer-first lead and the discount table. */
const CONTENT_REFRESH = "2026-10-27";

function reportedFiveYearFixed() {
  const cell = communityRates.windows["30d"].products.find(
    (product) => product.termMonths === 60 && product.rateType === "fixed" && product.insured === "unknown",
  );
  if (!cell || cell.big5PostedMedian == null) {
    throw new Error("Negotiate guide is missing the 5-year fixed reported cell.");
  }
  return cell;
}

/** Two sentences. The first is the quotable comparison. The second is the methodology. */
export function negotiateAnswerLead(): { first: string; second: string; text: string } {
  const cell = reportedFiveYearFixed();
  const first = `As of ${formatAsOf(communityRates.asOf)}, the median 5-year fixed rate borrowers report, where insured status was not stated, is ${formatRate(cell.median)} (N = ${cell.n}), against a Big Five posted median of ${formatRate(cell.big5PostedMedian)}.`;
  const second = `Both rates are rounded to the nearest 0.05, and the figures are ${communityRates.attribution}, unverified, and not a mortgage offer.`;
  return { first, second, text: `${first} ${second}` };
}

const lead = negotiateAnswerLead();

/** Dates for the negotiate guide. updatedDate follows the reported-rate file, and not before this refresh. */
export const negotiateGuide = {
  slug: "negotiate-mortgage-rate",
  path: "/guides/negotiate-mortgage-rate/",
  headline: "How much below posted can you negotiate?",
  description: lead.text,
  publishedIso: "2026-10-18",
  /** Noon Eastern on the day this explanation was reviewed. */
  reviewedIso: "2026-10-27T16:00:00Z",
  updatedDate: communityRates.asOf >= CONTENT_REFRESH ? communityRates.asOf : CONTENT_REFRESH,
  sourcesLine:
    "Sources: the 30-day reported-rate file on this site and the uninsured posted shelf in the rate snapshot. Confirm the contract rate, the penalty method, and the prepayment terms with the lender.",
};
