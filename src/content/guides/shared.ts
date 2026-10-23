import type { EditorialSection } from "../editorialPages";
import { editorialWordCount } from "../editorialPages";
import {
  calculateIrd,
  calculateMonthlyPayment,
  interestPaidOverMonths,
  threeMonthInterestOnBalance,
} from "../../lib/mortgageMath";
import {
  communityRates,
  formatAsOf,
  formatRate,
  type ProductCell,
} from "../../lib/communityRates";
import { BOC_POLICY_RATE, PRIME_RATE, PRIME_SPREAD } from "../../lib/primeRate";

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideHowTo {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}

export interface InDepthGuide {
  slug: string;
  path: string;
  metaTitle: string;
  description: string;
  keywords: string;
  cardTitle: string;
  cardDescription: string;
  h1: string;
  dek: string;
  sourcesLine: string;
  reviewedIso: string;
  sections: EditorialSection[];
  faqs: GuideFaq[];
  howTo?: GuideHowTo;
}

/** Noon UTC stays on October 22 in Toronto when the byline formats the date. */
export const GUIDE_REVIEWED_ISO = "2026-10-22T12:00:00Z";

export function cad(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-CA")}`;
}

export function pct(amount: number, digits = 2): string {
  return `${amount.toFixed(digits)}%`;
}

export function guideWordCount(guide: Pick<InDepthGuide, "sections" | "faqs">): number {
  const faqText = guide.faqs.flatMap((faq) => [faq.question, faq.answer]);
  const sectionWords = editorialWordCount(guide.sections);
  const faqWords = faqText.join(" ").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return sectionWords + faqWords;
}

function cell(termMonths: number, rateType: "fixed" | "variable", insured: string): ProductCell | undefined {
  return communityRates.windows["30d"].products.find(
    (product) =>
      product.termMonths === termMonths &&
      product.rateType === rateType &&
      product.insured === insured &&
      product.n >= communityRates.thresholds.publicMinN,
  );
}

const fixedUnknown = cell(60, "fixed", "unknown");
const variableUnknown = cell(60, "variable", "unknown");
const fixedUninsured = cell(60, "fixed", "uninsured");
const rateWindow = communityRates.windows["30d"];

if (!fixedUnknown || !variableUnknown || !fixedUninsured) {
  throw new Error("Reported-rate file is missing a public 5-year cell the guides cite.");
}

/** Rounded the same way the real-mortgage-rates charts round. */
export const REPORTED = {
  asOf: formatAsOf(),
  from: formatAsOf(rateWindow.from),
  to: formatAsOf(rateWindow.to),
  records: rateWindow.usableRecords,
  fixedMedian: formatRate(fixedUnknown.median),
  fixedMedianNumber: Number(formatRate(fixedUnknown.median).replace("%", "")),
  fixedN: fixedUnknown.n,
  fixedBig5: formatRate(fixedUnknown.big5PostedMedian),
  variableMedian: formatRate(variableUnknown.median),
  variableMedianNumber: Number(formatRate(variableUnknown.median).replace("%", "")),
  variableN: variableUnknown.n,
  variableBig5: formatRate(variableUnknown.big5PostedMedian),
  fixedUninsuredMedian: formatRate(fixedUninsured.median),
  fixedUninsuredN: fixedUninsured.n,
  attribution: communityRates.attribution,
  disclaimer: communityRates.disclaimer,
};

export const RATE_CONTEXT = `The Bank of Canada held its target for the overnight rate at ${pct(BOC_POLICY_RATE)} on September 2, 2026. The Bank Rate is 2.50% and the deposit rate is 2.20%. The next scheduled announcement is October 28, 2026. Big-bank prime on this site is ${pct(PRIME_RATE)}, which is the policy rate plus ${pct(PRIME_SPREAD)}. TD publishes its own mortgage prime, so a variable discount off "prime" is only meaningful once you know which prime the contract uses.`;

export function reportedRatesParagraph(): string {
  return `In the reported-rate file dated ${REPORTED.asOf}, covering ${REPORTED.from} to ${REPORTED.to} (${REPORTED.records.toLocaleString("en-CA")} usable reports), the 30-day median 5-year fixed rate where insured status was not stated is ${REPORTED.fixedMedian} after rounding to the nearest 0.05 (N = ${REPORTED.fixedN}). The Big Five posted median beside that cell is ${REPORTED.fixedBig5}. The 5-year variable median in the same window, insured status not stated, is ${REPORTED.variableMedian} (N = ${REPORTED.variableN}), against a Big Five posted median of ${REPORTED.variableBig5}. A separate uninsured 5-year fixed cell, where people stated that status, is ${REPORTED.fixedUninsuredMedian} (N = ${REPORTED.fixedUninsuredN}). These figures are ${REPORTED.attribution}. ${REPORTED.disclaimer} Posted rates on the <a href="/">homepage</a>, the <a href="/rates/5-year-fixed/">5-year fixed</a> page, and the <a href="/rates/variable/">variable</a> page are a different dataset. Do not average them together.`;
}

export const RENEWAL_EXAMPLE = (() => {
  const balance = 480_000;
  const yearsLeft = 20;
  const oldRate = 2.09;
  const fixedRate = REPORTED.fixedMedianNumber;
  const variableRate = REPORTED.variableMedianNumber;
  const oldPayment = calculateMonthlyPayment(balance, oldRate, yearsLeft);
  const fixedPayment = calculateMonthlyPayment(balance, fixedRate, yearsLeft);
  const variablePayment = calculateMonthlyPayment(balance, variableRate, yearsLeft);
  const oldInterest = interestPaidOverMonths(balance, oldRate, oldPayment, 60);
  const fixedInterest = interestPaidOverMonths(balance, fixedRate, fixedPayment, 60);
  const blend = (oldRate * 24 + fixedRate * 36) / 60;
  const blendRounded = Math.round(blend * 100) / 100;
  const blendPayment = calculateMonthlyPayment(balance, blendRounded, yearsLeft);
  const threeMonths = threeMonthInterestOnBalance(balance, oldRate);
  return {
    balance,
    yearsLeft,
    oldRate,
    fixedRate,
    variableRate,
    oldPayment,
    fixedPayment,
    variablePayment,
    extraFixedPayment: fixedPayment - oldPayment,
    extraVariablePayment: variablePayment - oldPayment,
    extraFixedInterest: fixedInterest.interest - oldInterest.interest,
    oldEndBalance: oldInterest.endingBalance,
    fixedEndBalance: fixedInterest.endingBalance,
    blend,
    blendRounded,
    blendPayment,
    extraBlendVsStay24: (blendPayment - oldPayment) * 24,
    saveBlendVsMarket60: (fixedPayment - blendPayment) * 60,
    threeMonths,
  };
})();

/** FCAC's published illustration, reproduced so the arithmetic can be checked. */
export const FCAC_PENALTY = {
  balance: 200_000,
  rate: 6,
  months: 36,
  comparison: 4,
  threeMonths: threeMonthInterestOnBalance(200_000, 6),
  ird: calculateIrd(200_000, 6, 4, 36),
};

/**
 * Illustration of the posted-rate IRD and a discounted-rate IRD on the same balance.
 * The posted and discounted comparison rates are labelled examples, not today's grid.
 */
export const IRD_ILLUSTRATION = (() => {
  const balance = 400_000;
  const contract = 5.49;
  const originalPosted = 6.79;
  const discount = originalPosted - contract;
  const currentPosted = 5.09;
  const postedComparison = currentPosted - discount;
  const discountedComparison = 4.19;
  const months = 36;
  const postedIrd = calculateIrd(balance, contract, postedComparison, months);
  const fairIrd = calculateIrd(balance, contract, discountedComparison, months);
  const threeMonths = threeMonthInterestOnBalance(balance, contract);
  const prepaidBalance = 325_000;
  const prepaidIrd = calculateIrd(prepaidBalance, contract, postedComparison, months);
  return {
    balance,
    contract,
    originalPosted,
    discount,
    currentPosted,
    postedComparison,
    discountedComparison,
    months,
    postedIrd,
    fairIrd,
    threeMonths,
    prepaidBalance,
    prepayment: balance - prepaidBalance,
    prepaidIrd,
    prepaidThreeMonths: threeMonthInterestOnBalance(prepaidBalance, contract),
    irdSaved: postedIrd - prepaidIrd,
    methodGap: postedIrd - fairIrd,
  };
})();

export const LENDER_RATE_GAP = (() => {
  const balance = 500_000;
  const years = 25;
  const low = 4.15;
  const high = 4.35;
  const lowPayment = calculateMonthlyPayment(balance, low, years);
  const highPayment = calculateMonthlyPayment(balance, high, years);
  const lowInterest = interestPaidOverMonths(balance, low, lowPayment, 60);
  const highInterest = interestPaidOverMonths(balance, high, highPayment, 60);
  return {
    balance,
    years,
    low,
    high,
    lowPayment,
    highPayment,
    paymentGap: highPayment - lowPayment,
    interestGap: highInterest.interest - lowInterest.interest,
  };
})();

export interface StressCase {
  income: number;
  payment: number;
  contractPayment: number;
  gds: number;
  tds: number;
  passes: boolean;
  maxPayment: number;
  maxMortgage: number;
  binding: "GDS" | "TDS";
}

function principalForPayment(payment: number, annualRatePercent: number, amortizationYears: number): number {
  const r = annualRatePercent / 100 / 12;
  const n = amortizationYears * 12;
  if (r === 0) return payment * n;
  return (payment * (1 - Math.pow(1 + r, -n))) / r;
}

export const STRESS = (() => {
  const mortgage = 600_000;
  const years = 25;
  const contract = REPORTED.fixedMedianNumber;
  const floor = 5.25;
  const qualifying = Math.max(contract + 2, floor);
  const tax = 350;
  const heat = 150;
  const other = 450;
  const payment = calculateMonthlyPayment(mortgage, qualifying, years);
  const contractPayment = calculateMonthlyPayment(mortgage, contract, years);
  const incomes = [85_000, 130_000, 190_000];
  const cases: StressCase[] = incomes.map((income) => {
    const monthly = income / 12;
    const gds = ((payment + tax + heat) / monthly) * 100;
    const tds = ((payment + tax + heat + other) / monthly) * 100;
    const gdsRoom = monthly * 0.39 - tax - heat;
    const tdsRoom = monthly * 0.44 - tax - heat - other;
    const maxPayment = Math.min(gdsRoom, tdsRoom);
    return {
      income,
      payment,
      contractPayment,
      gds,
      tds,
      passes: gds <= 39 && tds <= 44,
      maxPayment,
      maxMortgage: principalForPayment(maxPayment, qualifying, years),
      binding: gdsRoom <= tdsRoom ? "GDS" : "TDS",
    };
  });
  const lowContract = 2.99;
  const lowQualifying = Math.max(lowContract + 2, floor);
  const lowPayment = calculateMonthlyPayment(mortgage, lowQualifying, years);
  const midIncome = 130_000;
  const lowGds = ((lowPayment + tax + heat) / (midIncome / 12)) * 100;
  const lowTds = ((lowPayment + tax + heat + other) / (midIncome / 12)) * 100;
  const variableContract = REPORTED.variableMedianNumber;
  const variableQualifying = Math.max(variableContract + 2, floor);
  return {
    mortgage,
    years,
    contract,
    floor,
    qualifying,
    tax,
    heat,
    other,
    cases,
    lowContract,
    lowQualifying,
    lowPayment,
    lowGds,
    lowTds,
    lowPasses: lowGds <= 39 && lowTds <= 44,
    variableContract,
    variableQualifying,
    floorBindsBelow: floor - 2,
  };
})();

export const INSURED_EXAMPLE = (() => {
  const price = 700_000;
  const down = 500_000 * 0.05 + (price - 500_000) * 0.1;
  const base = price - down;
  const ltv = (base / price) * 100;
  const premiumRate = 0.04;
  const premium = base * premiumRate;
  const surchargeRate = 0.042;
  const surchargePremium = base * surchargeRate;
  return { price, down, base, ltv, premiumRate, premium, total: base + premium, surchargeRate, surchargePremium, surchargeTotal: base + surchargePremium };
})();

export const SOURCES = {
  osfiMqr: "https://www.osfi-bsif.gc.ca/en/supervision/financial-institutions/banks/minimum-qualifying-rate-uninsured-mortgages",
  osfiSwitch: "https://www.osfi-bsif.gc.ca/en/news/backgrounder-minimum-qualifying-rate-mqr",
  financeReforms: "https://www.canada.ca/en/department-finance/news/2024/09/government-announces-boldest-mortgage-reforms-in-decades-to-unlock-homeownership-for-more-canadians.html",
  cmhcQualify: "https://www.cmhc-schl.gc.ca/consumers/home-buying/mortgage-loan-insurance-for-consumers/what-are-the-general-requirements-to-qualify-for-homeowner-mortgage-loan-insurance",
  cmhcGds: "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/calculating-gds-tds",
  cmhcPremiums: "https://www.cmhc-schl.gc.ca/professionals/industry-innovation-and-leadership/industry-expertise/resources-for-mortgage-professionals/mortgage-loan-insurance-and-premiums",
  cmhcPremiumCalculator: "https://www.cmhc-schl.gc.ca/consumers/home-buying/calculators/mortgage-loan-insurance-premium-calculator",
  fcacPenalty: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/reduce-prepayment-penalties.html",
  fcacPrepare: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/preparing-mortgage.html",
  fcacDeposit: "https://www.canada.ca/en/financial-consumer-agency/services/banking/deposit-insurance.html",
  interestAct: "https://laws-lois.justice.gc.ca/eng/acts/I-15/section-10.html",
  fhsa: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html",
  fhsaRoom: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account/contributing-your-fhsa.html",
  fhsaAct: "https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-146.6.html",
  boc: "https://www.bankofcanada.ca/2026/09/fad-press-release-2026-09-02/",
  cdic: "https://www.cdic.ca/depositors/whats-covered/",
} as const;
