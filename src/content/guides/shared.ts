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
import historicalFile from "../../../data/historical_rates.json";
import rawRatesFile from "../../../data/rates.json";

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
  /** First publication date. Falls back to reviewedIso when omitted. */
  publishedIso?: string;
  /** Last substantive update. Falls back to reviewedIso when omitted. Shown as "Updated". */
  updatedDate?: string;
  sections: EditorialSection[];
  faqs: GuideFaq[];
  howTo?: GuideHowTo;
}

/** Noon UTC stays on October 22 in Toronto when the byline formats the date. */
export const GUIDE_REVIEWED_ISO = "2026-10-22T12:00:00Z";

/** Noon Eastern on October 23. The batch-2 pages were checked against the sources that day. */
export const GUIDE_REVIEWED_ISO_BATCH2 = "2026-10-23T16:00:00Z";

/** Late afternoon Eastern on October 23. The batch-3 pages were checked against the sources that day. */
export const GUIDE_REVIEWED_ISO_BATCH3 = "2026-10-23T20:00:00Z";

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

type HistDay = {
  date: string;
  fixed_uninsured_best_rate: number;
  fixed_insured_best_rate: number;
  variable_uninsured_best_rate: number;
  variable_insured_best_rate: number;
  prime_rate: number;
};

type ScrapedRate = {
  lender_slug: string;
  lender_name: string;
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type: string;
  posted_rate: number | null;
  scraped_at?: string;
  raw_data?: { section?: string };
};

function histRange(pick: (day: HistDay) => number): { min: number; max: number; first: number; last: number } {
  const days = (historicalFile as { data: HistDay[] }).data;
  const values = days.map(pick);
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    first: values[0],
    last: values[values.length - 1],
  };
}

function scrapedSpecial(slug: string, termMonths: number, rateType: string, mortgageType: string): ScrapedRate {
  const row = (rawRatesFile as ScrapedRate[]).find(
    (item) =>
      item.lender_slug === slug &&
      item.term_months === termMonths &&
      item.rate_type === rateType &&
      item.mortgage_type === mortgageType &&
      item.raw_data?.section === "special",
  );
  if (!row) throw new Error(`Rate file is missing ${slug} ${termMonths} ${rateType} ${mortgageType}.`);
  return row;
}

function weekMedian(weekStarting: string): { fixed: number; fixedN: number; variable: number; variableN: number } {
  const week = communityRates.weekly.weeks.find((item) => item.weekStarting === weekStarting);
  if (!week?.fixed.median || !week.variable.median) throw new Error(`Missing weekly medians for ${weekStarting}.`);
  return {
    fixed: week.fixed.median,
    fixedN: week.fixed.n,
    variable: week.variable.median,
    variableN: week.variable.n,
  };
}

function shareBelow(rateType: "fixed" | "variable"): { share: number; n: number } {
  const row = communityRates.distributions.find(
    (item) => item.termMonths === 60 && item.rateType === rateType && item.insured === "unknown",
  );
  if (!row || row.shareBelowBig5 == null) throw new Error(`Missing share for ${rateType}.`);
  return { share: row.shareBelowBig5, n: row.n };
}

function simulateAdjustable(
  balance: number,
  amortizationYears: number,
  steps: { months: number; rate: number }[],
): { interest: number; endingBalance: number; payments: { rate: number; payment: number; months: number }[] } {
  let remaining = balance;
  let interest = 0;
  let elapsed = 0;
  const payments: { rate: number; payment: number; months: number }[] = [];
  for (const step of steps) {
    const yearsLeft = amortizationYears - elapsed / 12;
    const payment = calculateMonthlyPayment(remaining, step.rate, yearsLeft);
    payments.push({ rate: step.rate, payment, months: step.months });
    const monthly = step.rate / 100 / 12;
    for (let i = 0; i < step.months; i++) {
      const monthInterest = remaining * monthly;
      interest += monthInterest;
      remaining = Math.max(0, remaining - (payment - monthInterest));
    }
    elapsed += step.months;
  }
  return { interest, endingBalance: remaining, payments };
}

const fixedHist = histRange((day) => day.fixed_uninsured_best_rate);
const insuredFixedHist = histRange((day) => day.fixed_insured_best_rate);
const variableHist = histRange((day) => day.variable_uninsured_best_rate);
const insuredVariableHist = histRange((day) => day.variable_insured_best_rate);
const histDays = (historicalFile as { metadata: { total_days: number }; data: HistDay[] });

export const POSTED_HISTORY = {
  days: histDays.metadata.total_days,
  from: histDays.data[0].date,
  to: histDays.data[histDays.data.length - 1].date,
  prime: histDays.data[histDays.data.length - 1].prime_rate,
  fixedUninsuredBestMin: fixedHist.min,
  fixedUninsuredBestMax: fixedHist.max,
  fixedUninsuredBestLast: fixedHist.last,
  fixedInsuredBestMin: insuredFixedHist.min,
  fixedInsuredBestMax: insuredFixedHist.max,
  variableUninsuredBestMin: variableHist.min,
  variableUninsuredBestMax: variableHist.max,
  variableInsuredBestMin: insuredVariableHist.min,
  variableInsuredBestMax: insuredVariableHist.max,
  variableInsuredBestLast: insuredVariableHist.last,
};

const earlyWeek = weekMedian("2026-09-14");
const lateWeek = weekMedian("2026-10-12");
const fixedShare = shareBelow("fixed");
const variableShare = shareBelow("variable");

export const SPREAD = {
  fixedMedian: REPORTED.fixedMedianNumber,
  variableMedian: REPORTED.variableMedianNumber,
  gap: REPORTED.fixedMedianNumber - REPORTED.variableMedianNumber,
  prime: PRIME_RATE,
  discount: Math.round((PRIME_RATE - REPORTED.variableMedianNumber) * 100) / 100,
  fixedShare: fixedShare.share,
  fixedShareN: fixedShare.n,
  variableShare: variableShare.share,
  variableShareN: variableShare.n,
  earlyWeek,
  lateWeek,
};

export const TERM_CHOICE = (() => {
  const balance = 500_000;
  const years = 25;
  const fixed = SPREAD.fixedMedian;
  const variable = SPREAD.variableMedian;
  const flat = simulateAdjustable(balance, years, [{ months: 60, rate: variable }]);
  const matched = simulateAdjustable(balance, years, [{ months: 60, rate: fixed }]);
  const gradual = simulateAdjustable(balance, years, [
    { months: 12, rate: variable },
    { months: 12, rate: variable + 0.25 },
    { months: 12, rate: variable + 0.5 },
    { months: 12, rate: variable + 0.75 },
    { months: 12, rate: variable + 1 },
  ]);
  const cut = simulateAdjustable(balance, years, [{ months: 60, rate: variable - 0.5 }]);
  const qualifyingVariable = Math.max(variable + 2, 5.25);
  const qualifyingFixed = Math.max(fixed + 2, 5.25);
  const openingPayment = flat.payments[0].payment;
  const triggerRate = (openingPayment * 12 / balance) * 100;
  return {
    balance,
    years,
    fixed,
    variable,
    flat,
    matched,
    gradual,
    cut,
    paymentGap: matched.payments[0].payment - flat.payments[0].payment,
    interestGap: matched.interest - flat.interest,
    balanceGap: matched.endingBalance - flat.endingBalance,
    gradualInterestSaved: matched.interest - gradual.interest,
    cutInterestSaved: flat.interest - cut.interest,
    qualifyingVariable,
    qualifyingFixed,
    qualifyingVariablePayment: calculateMonthlyPayment(balance, qualifyingVariable, years),
    qualifyingFixedPayment: calculateMonthlyPayment(balance, qualifyingFixed, years),
    triggerRate,
    triggerPrime: triggerRate + SPREAD.discount,
    primeRiseToTrigger: triggerRate + SPREAD.discount - PRIME_RATE,
  };
})();

const tdFixed = scrapedSpecial("td", 60, "fixed", "uninsured");
const tdFixed3 = scrapedSpecial("td", 36, "fixed", "uninsured");
const cibcFixed = scrapedSpecial("cibc", 60, "fixed", "uninsured");
const cibcInsured = scrapedSpecial("cibc", 60, "fixed", "insured");
const rbcFixed = scrapedSpecial("rbc", 60, "fixed", "uninsured");
const rbcInsured = scrapedSpecial("rbc", 60, "fixed", "insured");
const rbcVariable = scrapedSpecial("rbc", 60, "variable", "uninsured");
const rbcVariableInsured = scrapedSpecial("rbc", 60, "variable", "insured");

if (tdFixed.posted_rate == null || tdFixed3.posted_rate == null || cibcFixed.posted_rate == null || cibcInsured.posted_rate == null) {
  throw new Error("A bank row used as a rate-sheet example is missing its posted rate.");
}

export const RATE_SHEET = {
  scrapedAt: (tdFixed.scraped_at ?? "").slice(0, 10),
  tdFixedSpecial: tdFixed.rate,
  tdFixedPosted: tdFixed.posted_rate,
  tdFixedDiscount: tdFixed.posted_rate - tdFixed.rate,
  tdThreePosted: tdFixed3.posted_rate,
  tdThreeSpecial: tdFixed3.rate,
  cibcPosted: cibcFixed.posted_rate,
  cibcSpecial: cibcFixed.rate,
  cibcDiscount: cibcFixed.posted_rate - cibcFixed.rate,
  cibcInsuredSpecial: cibcInsured.rate,
  cibcInsuredDiscount: cibcInsured.posted_rate - cibcInsured.rate,
  rbcFixed: rbcFixed.rate,
  rbcInsured: rbcInsured.rate,
  rbcVariable: rbcVariable.rate,
  rbcVariableInsured: rbcVariableInsured.rate,
};

/** Posted-rate IRD on TD's own October 2026 row, plus three months' interest on a labelled balance. */
export const SHEET_PENALTY = (() => {
  const balance = 400_000;
  const contract = RATE_SHEET.tdFixedSpecial;
  const discount = RATE_SHEET.tdFixedDiscount;
  const comparison = RATE_SHEET.tdThreePosted - discount;
  const months = 36;
  return {
    balance,
    contract,
    discount,
    comparison,
    ird: calculateIrd(balance, contract, comparison, months),
    threeMonths: threeMonthInterestOnBalance(balance, contract),
    months,
  };
})();

export const SWITCH_MATH = (() => {
  const balance = 480_000;
  const yearsLeft = 20;
  const letter = RATE_SHEET.rbcFixed;
  const market = REPORTED.fixedMedianNumber;
  const letterPayment = calculateMonthlyPayment(balance, letter, yearsLeft);
  const marketPayment = calculateMonthlyPayment(balance, market, yearsLeft);
  const uncovered = 1_500;
  const monthlySave = letterPayment - marketPayment;
  return {
    balance,
    yearsLeft,
    letter,
    market,
    letterPayment,
    marketPayment,
    monthlySave,
    termSave: monthlySave * 60,
    uncovered,
    netIfUncovered: monthlySave * 60 - uncovered,
    monthsToRecover: monthlySave > 0 ? uncovered / monthlySave : 0,
  };
})();

export function ontarioLandTransferTax(price: number): number {
  if (price <= 0) return 0;
  const bands: [number, number][] = [
    [55_000, 0.005],
    [250_000, 0.01],
    [400_000, 0.015],
    [2_000_000, 0.02],
    [Number.POSITIVE_INFINITY, 0.025],
  ];
  let tax = 0;
  let previous = 0;
  for (const [cap, rate] of bands) {
    const slice = Math.min(price, cap) - previous;
    if (slice > 0) tax += slice * rate;
    if (price <= cap) break;
    previous = cap;
  }
  return tax;
}

/** Alberta Land Titles schedule for submissions on or after October 1, 2026: $50 plus $5 per $5,000 or part. */
export function albertaRegistrationFee(amount: number): number {
  if (amount <= 0) return 0;
  return 50 + 5 * Math.ceil(amount / 5_000);
}

function fthbFederalGst(consideration: number): { gst: number; rebate: number } {
  const gst = consideration * 0.05;
  if (consideration >= 1_500_000) return { gst, rebate: 0 };
  const cap = Math.min(50_000, gst);
  if (consideration <= 1_000_000) return { gst, rebate: cap };
  return { gst, rebate: cap * ((1_500_000 - consideration) / 500_000) };
}

export const BUYER_MATH = (() => {
  const price = 700_000;
  const down = 500_000 * 0.05 + (price - 500_000) * 0.1;
  const base = price - down;
  const premium25 = base * 0.04;
  const premium30 = base * 0.042;
  const balance25 = base + premium25;
  const balance30 = base + premium30;
  const rate = REPORTED.fixedMedianNumber;
  const pay25 = calculateMonthlyPayment(balance25, rate, 25);
  const pay30 = calculateMonthlyPayment(balance30, rate, 30);
  const interest25 = interestPaidOverMonths(balance25, rate, pay25, 60);
  const interest30 = interestPaidOverMonths(balance30, rate, pay30, 60);
  const modest = fthbFederalGst(price);
  const phased = fthbFederalGst(1_250_000);
  const ontario = ontarioLandTransferTax(price);
  const ontarioRefund = Math.min(4_000, ontario);
  const toronto = ontario;
  const torontoRefund = Math.min(4_475, toronto);
  const bcTax = 12_000;
  const bcExemption = 8_000;
  return {
    price,
    down,
    base,
    ltv: (base / price) * 100,
    premium25,
    premium30,
    balance25,
    balance30,
    rate,
    pay25,
    pay30,
    paymentSave: pay25 - pay30,
    extraPremium: premium30 - premium25,
    extraInterest: interest30.interest - interest25.interest,
    extraBalance: interest30.endingBalance - interest25.endingBalance,
    fhsaAnnual: 8_000,
    fhsaLifetime: 40_000,
    fhsaYears: 5,
    fhsaDeductionIllustration: 8_000 * 0.3,
    hbpLimit: 60_000,
    hbpAnnualRepayment: 60_000 / 15,
    coupleFhsa: 80_000,
    coupleHbp: 120_000,
    coupleCash: 200_000,
    modestGst: modest.gst,
    modestRebate: modest.rebate,
    phasedPrice: 1_250_000,
    phasedGst: phased.gst,
    phasedRebate: phased.rebate,
    phasedNet: phased.gst - phased.rebate,
    ontario,
    ontarioRefund,
    ontarioNet: ontario - ontarioRefund,
    toronto,
    torontoRefund,
    torontoNet: toronto - torontoRefund,
    combinedTransfer: ontario + toronto,
    combinedNet: ontario - ontarioRefund + (toronto - torontoRefund),
    bcTax,
    bcExemption,
    bcPayable: bcTax - bcExemption,
    albertaTransfer: albertaRegistrationFee(price),
    albertaMortgage: albertaRegistrationFee(balance25),
    quebecMaxCredit: 5_875,
    quebecPhaseExample: 5_875 - 0.0235 * 50_000,
  };
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
  bocPolicy: "https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/",
  cdic: "https://www.cdic.ca/depositors/whats-covered/",
  osfiStraightSwitch: "https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/osfi-exempts-uninsured-mortgage-straight-switches-prescribed-mqr-implements-portfolio-lti-limits",
  fcacDischarge: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/mortgage-discharge.html",
  fcacBreak: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/break-mortgage-contract.html",
  fhsaWithdraw: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account/withdrawals-transfers-out-your-fhsas.html",
  hbp: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan.html",
  hbpWithdraw: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan/withdraw-funds-rrsp-s-under-home-buyers-plan.html",
  hbpRepay: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan/repay-funds-withdrawn-rrsp-s-under-home-buyers-plan.html",
  homeBuyersAmount: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-31270-home-buyers-amount.html",
  gstRebate: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/gst-hst-rebates/first-time-home-buyers-gst-hst-rebate/what-rebate.html",
  gstWho: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/gst-hst-rebates/first-time-home-buyers-gst-hst-rebate/who-can-apply.html",
  gstMemo: "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/19-3-10/first-time-home-buyers-gst-hst-rebate.html",
  cmhcHomeStart: "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/home-start",
  ontarioLtt: "https://www.ontario.ca/document/land-transfer-tax/land-transfer-tax-refunds-first-time-homebuyers",
  torontoMltt: "https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/municipal-land-transfer-tax-mltt-rebate-opportunities/",
  bcPtt: "https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax/exemptions/first-time-home-buyers",
  bcPttAmounts: "https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax/exemptions/first-time-home-buyers/current-amount",
  peiTransfer: "https://princeedwardisland.ca/en/information/finance/real-property-transfer-tax-first-time-home-buyers-exemption",
  quebecCredit: "https://www.revenuquebec.ca/en/press-room/tax-news/details/2026-04-21/introduction-of-a-refundable-tax-credit-for-access-to-homeownership/",
  albertaFees: "https://www.alberta.ca/system/files/sartr-land-titles-and-surveys-common-documents-fee-schedule.pdf",
  financeParameters: "https://www.canada.ca/en/department-finance/news/2024/09/delivering-the-boldest-mortgage-reforms-in-decades.html",
  insurableRegs: "https://laws-lois.justice.gc.ca/eng/regulations/SOR-2012-282/FullText.html",
  financeStraightSwitch: "https://www.canada.ca/en/department-finance/news/2024/12/straight-switches-and-portfolio-insurance.html",
  osfiHeloc: "https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/clarification-treatment-innovative-real-estate-secured-lending-products-under-guideline-b-20",
  bocSchedule: "https://www.bankofcanada.ca/2025/08/bank-canada-publishes-2026-schedule-policy-interest-rate-announcements-other-major-publications/",
  fcacTrigger: "https://www.canada.ca/en/financial-consumer-agency/services/interest-rates-rise.html",
  fcacRenew: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/renew-mortgage.html",
  fcacHeloc: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/home-equity-line-credit.html",
  fcacVariableBox: "https://www.canada.ca/en/financial-consumer-agency/services/rights-responsibilities/rights-mortgages/applying-for-mortgage.html",
  ontarioRst: "https://www.ontario.ca/document/retail-sales-tax",
  quebecPremiumTax: "https://www.revenuquebec.ca/en/citizens/consumption-taxes/taxable-zero-rated-or-tax-exempt-goods-and-services/tax-on-insurance-premiums/",
  quebecPremiumTax2027: "https://www.revenuquebec.ca/en/press-room/tax-news/details/2026-04-09/harmonization-of-the-insurance-premiums-tax-rate-with-the-qst-rate/",
  saskatchewanPst: "https://www.saskatchewan.ca/business/taxes-licensing-and-reporting/provincial-taxes-policies-and-bulletins",
  cmhcPurchase: "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/purchase",
  cmhcExplained: "https://www.cmhc-schl.gc.ca/observer/2025/cmhc-mortgage-loan-insurance-explained",
} as const;
