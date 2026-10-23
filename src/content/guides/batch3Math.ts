import { communityRates, PUBLIC_MIN_N } from "../../lib/communityRates";
import {
  CMHC_LONG_AMORTIZATION_SURCHARGE,
  CMHC_PREMIUM_TIERS,
  INSURED_PRICE_LIMIT,
  calculateCmhcPremium,
  minimumDownPayment,
} from "../../lib/cmhcPremium";
import {
  calculateMonthlyPayment,
  interestPaidOverMonths,
  threeMonthInterestOnBalance,
} from "../../lib/mortgageMath";
import { BOC_POLICY_RATE, PRIME_RATE, PRIME_SPREAD } from "../../lib/primeRate";
import { RATE_SHEET, REPORTED, cad, pct } from "./shared";

export function cadCents(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  if (Math.abs(rounded - Math.round(rounded)) < 0.001) return cad(rounded);
  return `$${rounded.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function parsed(formatted: string): number {
  return Number(formatted.replace("%", ""));
}

function distribution(termMonths: number, rateType: "fixed" | "variable", insured: string) {
  const row = communityRates.distributions.find(
    (item) => item.termMonths === termMonths && item.rateType === rateType && item.insured === insured,
  );
  if (!row) throw new Error(`Reported-rate file is missing ${termMonths} ${rateType} ${insured}.`);
  return row;
}

const insuredFixedSample = distribution(60, "fixed", "insured");
const uninsuredFixedSample = distribution(60, "fixed", "uninsured");

export const TAX = { ontario: 0.08, quebec: 0.09, quebecAfter2026: 0.09975, saskatchewan: 0.06 };

function insuredRow(price: number) {
  const down = minimumDownPayment(price);
  const eligible = price < INSURED_PRICE_LIMIT;
  const quote = eligible ? calculateCmhcPremium(price, down) : null;
  return {
    price,
    down,
    eligible,
    loan: quote?.mortgageAmount ?? price - down,
    ltv: quote?.ltv ?? (price > 0 ? ((price - down) / price) * 100 : 0),
    rate: quote?.premiumRate ?? 0,
    premium: quote?.premiumAmount ?? 0,
    total: quote?.totalMortgage ?? price - down,
    downPct: price > 0 ? (down / price) * 100 : 0,
  };
}

const priceRows = [500_000, 700_000, 1_000_000, 1_200_000, 1_499_999].map(insuredRow);
const capRow = insuredRow(1_500_000);

export const DOWN_PAYMENT_TABLE = {
  caption: "Minimum down payment at the prices that change the rule. Premium is CMHC's traditional 25-year rate on that loan.",
  headers: ["Price", "Minimum down", "Share", "Loan before premium", "Premium"],
  rows: [
    ...priceRows.map((row) => [
      cad(row.price),
      cadCents(row.down),
      `${row.downPct.toFixed(2)}%`,
      cadCents(row.loan),
      `${row.rate.toFixed(2)}%, ${cadCents(row.premium)}`,
    ]),
    [cad(capRow.price), cad(capRow.down), "20%", "Not eligible", "None"],
  ],
};

const halfMillion = insuredRow(500_000);
const million = insuredRow(1_000_000);

export const PREMIUM_TABLE = {
  caption: "CMHC traditional homeowner premium on the total loan. The longer-amortization column adds 0.20 points and, above 80% loan-to-value, matches CMHC Home Start.",
  headers: ["Loan-to-value", "25 years or less", "Longer than 25 years"],
  rows: [
    ...CMHC_PREMIUM_TIERS.map((tier) => {
      const label = tier.ltvMin === 0 ? `Up to ${tier.ltvMax}%` : `${tier.ltvMin.toFixed(2)}% to ${tier.ltvMax}%`;
      const longer = tier.ltvMax <= 80 ? "Not an insured 30-year band" : `${(tier.rate + CMHC_LONG_AMORTIZATION_SURCHARGE).toFixed(2)}%`;
      return [label, `${tier.rate.toFixed(2)}%`, longer];
    }),
    ["90.01% to 95%, non-traditional down payment", "4.50%", "4.70%"],
  ],
};

export const PREMIUM_TAX = {
  price: halfMillion.price,
  down: halfMillion.down,
  loan: halfMillion.loan,
  premium: halfMillion.premium,
  ontario: halfMillion.premium * TAX.ontario,
  quebec: halfMillion.premium * TAX.quebec,
  quebecLater: halfMillion.premium * TAX.quebecAfter2026,
  saskatchewan: halfMillion.premium * TAX.saskatchewan,
  millionPremium: million.premium,
  millionOntario: million.premium * TAX.ontario,
};

const reportedFixed = REPORTED.fixedMedianNumber;
const reportedUninsured = parsed(REPORTED.fixedUninsuredMedian);
const rbcInsured = RATE_SHEET.rbcInsured;
const rbcUninsured = RATE_SHEET.rbcFixed;

function compareStructures(balance: number, rate: number, years: number) {
  const payment = calculateMonthlyPayment(balance, rate, years);
  const five = interestPaidOverMonths(balance, rate, payment, 60);
  const full = interestPaidOverMonths(balance, rate, payment, years * 12);
  return { balance, rate, years, payment, five, full };
}

const insuredBalance = million.total;
const conventionalBalance = 1_000_000 * 0.8;
const yearsCompared = 25;
const shelfInsured = compareStructures(insuredBalance, rbcInsured, yearsCompared);
const shelfConventional = compareStructures(conventionalBalance, rbcUninsured, yearsCompared);
const reportedConventional = compareStructures(conventionalBalance, reportedUninsured, yearsCompared);

export const TWENTY_DOWN = {
  price: 1_000_000,
  insuredDown: million.down,
  insuredLoan: million.loan,
  insuredLtv: million.ltv,
  premium: million.premium,
  insuredBalance,
  conventionalDown: 1_000_000 - conventionalBalance,
  conventionalBalance,
  extraCash: 1_000_000 - conventionalBalance - million.down,
  ontarioTax: million.premium * TAX.ontario,
  rbcInsured,
  rbcUninsured,
  reportedUninsured,
  reportedUninsuredN: REPORTED.fixedUninsuredN,
  shelfInsured,
  shelfConventional,
  reportedConventional,
  shelfPaymentGap: shelfInsured.payment - shelfConventional.payment,
  reportedPaymentGap: shelfInsured.payment - reportedConventional.payment,
  shelfInterestGap: shelfInsured.full.interest - shelfConventional.full.interest,
  reportedInterestGap: shelfInsured.full.interest - reportedConventional.full.interest,
  shelfFiveGap: shelfInsured.five.interest - shelfConventional.five.interest,
  reportedFiveGap: shelfInsured.five.interest - reportedConventional.five.interest,
  insuredSampleN: insuredFixedSample.n,
  insuredSamplePublished: insuredFixedSample.n >= PUBLIC_MIN_N,
  publicMinN: PUBLIC_MIN_N,
  uninsuredSampleN: uninsuredFixedSample.n,
};

const stretchPrice = 1_100_000;
const stretchDown = minimumDownPayment(stretchPrice);
const stretchBase = calculateCmhcPremium(stretchPrice, stretchDown);
const premium30Rate = stretchBase.premiumRate + CMHC_LONG_AMORTIZATION_SURCHARGE;
const premium30 = stretchBase.mortgageAmount * (premium30Rate / 100);
const balance25 = stretchBase.totalMortgage;
const balance30 = stretchBase.mortgageAmount + premium30;
const contract = rbcInsured;
const pay25 = calculateMonthlyPayment(balance25, contract, 25);
const pay30 = calculateMonthlyPayment(balance30, contract, 30);
const interest25 = interestPaidOverMonths(balance25, contract, pay25, 300);
const interest30 = interestPaidOverMonths(balance30, contract, pay30, 360);
const five25 = interestPaidOverMonths(balance25, contract, pay25, 60);
const five30 = interestPaidOverMonths(balance30, contract, pay30, 60);
const sameBalancePay25 = calculateMonthlyPayment(balance30, contract, 25);
const sameBalanceInterest25 = interestPaidOverMonths(balance30, contract, sameBalancePay25, 300);
const qualifying = Math.max(contract + 2, 5.25);
const taxBill = 500;
const heatBill = 175;
const qualify25 = calculateMonthlyPayment(balance25, qualifying, 25);
const qualify30 = calculateMonthlyPayment(balance30, qualifying, 30);
function incomeAt39(payment: number): number {
  return ((payment + taxBill + heatBill) / 0.39) * 12;
}
const cashPremiumPayment = calculateMonthlyPayment(stretchBase.mortgageAmount, contract, 30);
const cashPremiumInterest = interestPaidOverMonths(stretchBase.mortgageAmount, contract, cashPremiumPayment, 360);

export const STRETCH = {
  price: stretchPrice,
  down: stretchDown,
  downPct: (stretchDown / stretchPrice) * 100,
  base: stretchBase.mortgageAmount,
  ltv: stretchBase.ltv,
  premium25Rate: stretchBase.premiumRate,
  premium25: stretchBase.premiumAmount,
  premium30Rate,
  premium30,
  extraPremium: premium30 - stretchBase.premiumAmount,
  balance25,
  balance30,
  contract,
  pay25,
  pay30,
  paymentSave: pay25 - pay30,
  interest25: interest25.interest,
  interest30: interest30.interest,
  extraInterest: interest30.interest - interest25.interest,
  fiveInterestGap: five30.interest - five25.interest,
  fiveBalanceGap: five30.endingBalance - five25.endingBalance,
  sameBalancePay25,
  extraMonthly: sameBalancePay25 - pay30,
  sameBalanceInterestSaved: interest30.interest - sameBalanceInterest25.interest,
  qualifying,
  qualify25,
  qualify30,
  qualifySave: qualify25 - qualify30,
  taxBill,
  heatBill,
  income25: incomeAt39(qualify25),
  income30: incomeAt39(qualify30),
  incomeSave: incomeAt39(qualify25) - incomeAt39(qualify30),
  cashPremium: premium30,
  cashPremiumPayment,
  cashPaymentSave: pay30 - cashPremiumPayment,
  cashInterestSaved: interest30.interest - cashPremiumInterest.interest,
  ontarioTax: premium30 * TAX.ontario,
  balanceAfterFive25: five25.endingBalance,
  balanceAfterFive30: five30.endingBalance,
  renewalExampleRate: contract + 1,
  renewalPay25: calculateMonthlyPayment(five25.endingBalance, contract + 1, 20),
  renewalPay30: calculateMonthlyPayment(five30.endingBalance, contract + 1, 25),
  renewalPay30Matched: calculateMonthlyPayment(five30.endingBalance, contract + 1, 20),
};

const vrmBalance = 440_000;
const vrmYears = 25;
const vrmRate = RATE_SHEET.rbcVariableInsured;
const vrmDiscount = Math.round((PRIME_RATE - vrmRate) * 100) / 100;
const vrmPayment = calculateMonthlyPayment(vrmBalance, vrmRate, vrmYears);
const triggerRate = (vrmPayment * 12 / vrmBalance) * 100;
function monthInterest(balance: number, rate: number): number {
  return balance * (rate / 100) / 12;
}
const upQuarter = vrmRate + 0.25;
const upPoint = vrmRate + 1;
const armQuarter = calculateMonthlyPayment(vrmBalance, upQuarter, vrmYears);
const armPoint = calculateMonthlyPayment(vrmBalance, upPoint, vrmYears);
const coverQuarter = vrmPayment - monthInterest(vrmBalance, upQuarter);
const coverPoint = vrmPayment - monthInterest(vrmBalance, upPoint);
const exampleOldRate = 1.5;
const exampleOldPayment = calculateMonthlyPayment(vrmBalance, exampleOldRate, vrmYears);
const exampleTrigger = (exampleOldPayment * 12 / vrmBalance) * 100;
const exampleNowRate = 5.5;
const exampleShortfall = monthInterest(vrmBalance, exampleNowRate) - exampleOldPayment;

export const DECISION = {
  policy: BOC_POLICY_RATE,
  bankRate: 2.5,
  depositRate: 2.2,
  prime: PRIME_RATE,
  spread: PRIME_SPREAD,
  balance: vrmBalance,
  years: vrmYears,
  rate: vrmRate,
  discount: vrmDiscount,
  payment: vrmPayment,
  triggerRate,
  roomToTrigger: triggerRate - vrmRate,
  upQuarter,
  upPoint,
  armQuarter,
  armPoint,
  quarterPaymentIncrease: armQuarter - vrmPayment,
  pointPaymentIncrease: armPoint - vrmPayment,
  coverQuarter,
  coverPoint,
  exampleOldRate,
  exampleOldPayment,
  exampleTrigger,
  exampleNowRate,
  exampleShortfall,
  dates: [
    ["January 28", "Announcement and Monetary Policy Report"],
    ["March 18", "Announcement"],
    ["April 29", "Announcement and Monetary Policy Report"],
    ["June 10", "Announcement"],
    ["July 15", "Announcement and Monetary Policy Report"],
    ["September 2", "Announcement"],
    ["October 28", "Announcement and Monetary Policy Report"],
    ["December 9", "Announcement"],
  ] as [string, string][],
};

const home = 750_000;
const owing = 465_000;
const yearsLeft = 18;
const combinedLimit = home * 0.8;
const revolvingLimit = home * 0.65;
const renewRate = reportedFixed;
const refinanceRate = reportedUninsured;
const renewPay = calculateMonthlyPayment(owing, renewRate, yearsLeft);
const refiSame = calculateMonthlyPayment(combinedLimit, refinanceRate, yearsLeft);
const refiLong = calculateMonthlyPayment(combinedLimit, refinanceRate, 30);
const refiQualifying = Math.max(refinanceRate + 2, 5.25);
const refiQualifyPay = calculateMonthlyPayment(combinedLimit, refiQualifying, 30);
const renewInterest = interestPaidOverMonths(owing, renewRate, renewPay, 60);
const refiInterest = interestPaidOverMonths(combinedLimit, refinanceRate, refiLong, 60);
const penaltyRate = renewRate;
const threeMonths = threeMonthInterestOnBalance(owing, penaltyRate);
const helocMargin = 1;
const helocRate = PRIME_RATE + helocMargin;
const helocRoom = revolvingLimit - owing;
const helocMonthly = monthInterest(helocRoom, helocRate);
const helocIfPrimeRises = monthInterest(helocRoom, helocRate + 0.25) - helocMonthly;

export const CHOICE = {
  home,
  owing,
  yearsLeft,
  ltv: (owing / home) * 100,
  combinedLimit,
  revolvingLimit,
  cashTo80: combinedLimit - owing,
  helocRoom,
  sliceAbove65: combinedLimit - revolvingLimit,
  renewRate,
  refinanceRate,
  renewPay,
  refiSame,
  refiLong,
  refiQualifying,
  refiQualifyPay,
  paymentJumpSameAm: refiSame - renewPay,
  paymentChangeLong: refiLong - renewPay,
  extraInterestFiveYears: refiInterest.interest - renewInterest.interest,
  extraBalanceFiveYears: refiInterest.endingBalance - renewInterest.endingBalance,
  penaltyRate,
  threeMonths,
  helocMargin,
  helocRate,
  helocMonthly,
  helocIfPrimeRises,
  reportedFixedN: REPORTED.fixedN,
  reportedUninsuredN: REPORTED.fixedUninsuredN,
};

export const RATE_FILE_DATE = RATE_SHEET.scrapedAt;
export const REPORTED_AS_OF = REPORTED.asOf;
export const REPORTED_FIXED = REPORTED.fixedMedian;
export const REPORTED_VARIABLE = REPORTED.variableMedian;
export const REPORTED_FIXED_N = REPORTED.fixedN;
export const REPORTED_VARIABLE_N = REPORTED.variableN;
export const REPORTED_FROM = REPORTED.from;
export const REPORTED_TO = REPORTED.to;

export function gapPhrase(gap: number, unit: "a month" | "over the amortization" | "over five years"): string {
  const size = cad(Math.abs(gap));
  if (Math.abs(gap) < 1) return `about the same ${unit}`;
  return gap > 0 ? `${size} higher ${unit}` : `${size} lower ${unit}`;
}

export { cad, pct, INSURED_PRICE_LIMIT, PUBLIC_MIN_N };
