/**
 * Shared Canadian mortgage calculator formulas.
 *
 * Payments use remaining amortization (not the contract term).
 * The 3-month interest penalty is interest on the outstanding balance,
 * not 3 × the blended monthly payment.
 */

export function monthlyInterestRate(annualRatePercent: number): number {
  return annualRatePercent / 100 / 12;
}

export function calculateMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  amortizationYears: number
): number {
  if (principal <= 0 || amortizationYears <= 0) return 0;
  const n = amortizationYears * 12;
  const r = monthlyInterestRate(annualRatePercent);
  if (r === 0) return principal / n;
  const factor = Math.pow(1 + r, n);
  return (principal * (r * factor)) / (factor - 1);
}

/** Three months of interest on the outstanding balance: rate/12 × balance × 3. */
export function threeMonthInterestOnBalance(
  balance: number,
  annualRatePercent: number
): number {
  if (balance <= 0 || annualRatePercent <= 0) return 0;
  return balance * (annualRatePercent / 100) * (3 / 12);
}

/**
 * Discounted IRD: (contract rate − comparison rate) × remaining years × balance.
 * Returns 0 when comparison rates are higher than the contract rate.
 */
export function calculateIrd(
  balance: number,
  contractRatePercent: number,
  comparisonRatePercent: number,
  monthsRemaining: number
): number {
  const differential = contractRatePercent - comparisonRatePercent;
  if (balance <= 0 || differential <= 0 || monthsRemaining <= 0) return 0;
  return balance * (differential / 100) * (monthsRemaining / 12);
}

export function interestPaidOverMonths(
  principal: number,
  annualRatePercent: number,
  monthlyPayment: number,
  months: number
): { interest: number; endingBalance: number } {
  const r = monthlyInterestRate(annualRatePercent);
  let balance = principal;
  let interest = 0;
  const periods = Math.max(0, Math.floor(months));
  for (let i = 0; i < periods && balance > 0.01; i++) {
    const monthInterest = balance * r;
    interest += monthInterest;
    balance = Math.max(0, balance - (monthlyPayment - monthInterest));
  }
  return { interest, endingBalance: balance };
}

export interface RenewalComparisonInput {
  balance: number;
  currentRate: number;
  marketRate: number;
  amortizationYears: number;
  renewalTermYears: number;
  switchingCosts: number;
}

export interface RenewalComparisonResult {
  currentLender: { monthlyPayment: number; totalInterest: number; totalCost: number };
  newLender: { monthlyPayment: number; totalInterest: number; totalCost: number };
  savings: { monthly: number; totalInterest: number; overTerm: number };
}

export function calculateRenewalComparison(
  input: RenewalComparisonInput
): RenewalComparisonResult {
  const termMonths = input.renewalTermYears * 12;
  const currentPayment = calculateMonthlyPayment(
    input.balance,
    input.currentRate,
    input.amortizationYears
  );
  const newPayment = calculateMonthlyPayment(
    input.balance,
    input.marketRate,
    input.amortizationYears
  );

  const currentInterest = interestPaidOverMonths(
    input.balance,
    input.currentRate,
    currentPayment,
    termMonths
  ).interest;
  const newInterest = interestPaidOverMonths(
    input.balance,
    input.marketRate,
    newPayment,
    termMonths
  ).interest;

  const monthlySavings = currentPayment - newPayment;
  const totalInterestSavings = currentInterest - newInterest;

  return {
    currentLender: {
      monthlyPayment: currentPayment,
      totalInterest: currentInterest,
      totalCost: currentPayment * termMonths,
    },
    newLender: {
      monthlyPayment: newPayment,
      totalInterest: newInterest,
      totalCost: newPayment * termMonths,
    },
    savings: {
      monthly: monthlySavings,
      totalInterest: totalInterestSavings,
      overTerm: totalInterestSavings - input.switchingCosts,
    },
  };
}

export interface RefinanceCalcInput {
  currentBalance: number;
  currentRate: number;
  currentTermRemainingYears: number;
  remainingAmortizationYears: number;
  newRate: number;
  penaltyType: "three_month" | "ird";
  postedRate: number;
  closingCosts: number;
}

export interface RefinanceCalcResult {
  currentMonthlyPayment: number;
  newMonthlyPayment: number;
  monthlySavings: number;
  penaltyAmount: number;
  totalCost: number;
  breakEvenMonths: number;
  totalSavings: number;
  remainingInterestCurrent: number;
  remainingInterestNew: number;
  interestSavings: number;
  comparisonMonths: number;
  worthIt: boolean;
}

export function calculateRefinance(input: RefinanceCalcInput): RefinanceCalcResult {
  const amortYears = Math.max(input.remainingAmortizationYears, input.currentTermRemainingYears);
  const currentMonthlyPayment = calculateMonthlyPayment(
    input.currentBalance,
    input.currentRate,
    amortYears
  );
  const newMonthlyPayment = calculateMonthlyPayment(
    input.currentBalance,
    input.newRate,
    amortYears
  );
  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;

  const monthsRemaining = Math.round(input.currentTermRemainingYears * 12);
  const threeMonth = threeMonthInterestOnBalance(input.currentBalance, input.currentRate);
  const ird = calculateIrd(
    input.currentBalance,
    input.currentRate,
    input.postedRate,
    monthsRemaining
  );
  const penaltyAmount =
    input.penaltyType === "three_month" ? threeMonth : Math.max(threeMonth, ird);

  const totalCost = penaltyAmount + input.closingCosts;
  const breakEvenMonths =
    monthlySavings > 0 ? Math.ceil(totalCost / monthlySavings) : Number.POSITIVE_INFINITY;

  const remainingInterestCurrent = interestPaidOverMonths(
    input.currentBalance,
    input.currentRate,
    currentMonthlyPayment,
    monthsRemaining
  ).interest;
  const remainingInterestNew = interestPaidOverMonths(
    input.currentBalance,
    input.newRate,
    newMonthlyPayment,
    monthsRemaining
  ).interest;
  const interestSavings = remainingInterestCurrent - remainingInterestNew;

  // Payment-delta savings over the remaining term, net of break costs.
  // Same horizon as monthly savings / break-even so the three figures agree.
  const totalSavings = monthlySavings * monthsRemaining - totalCost;
  const worthIt =
    totalSavings > 0 &&
    Number.isFinite(breakEvenMonths) &&
    breakEvenMonths <= monthsRemaining;

  return {
    currentMonthlyPayment,
    newMonthlyPayment,
    monthlySavings,
    penaltyAmount,
    totalCost,
    breakEvenMonths,
    totalSavings,
    remainingInterestCurrent,
    remainingInterestNew,
    interestSavings,
    comparisonMonths: monthsRemaining,
    worthIt,
  };
}

export interface PenaltyCalcInput {
  mortgageBalance: number;
  currentRate: number;
  mortgageType: "fixed" | "variable";
  monthsRemaining: number;
  postedRate: number;
  lenderType: "bank" | "monoline";
}

export interface PenaltyCalcResult {
  threeMonthInterest: number;
  irdAmount: number;
  finalPenalty: number;
  penaltyType: "3 Months Interest" | "Interest Rate Differential (IRD)";
  monthlyInterest: number;
  explanation: string;
}

function formatCad(value: number): string {
  return `$${Math.round(value).toLocaleString("en-CA")}`;
}

export function calculateMortgagePenalty(input: PenaltyCalcInput): PenaltyCalcResult {
  const threeMonthInterest = threeMonthInterestOnBalance(
    input.mortgageBalance,
    input.currentRate
  );
  const monthlyInterest = threeMonthInterest / 3;

  let irdAmount = 0;
  if (input.mortgageType === "fixed") {
    irdAmount = calculateIrd(
      input.mortgageBalance,
      input.currentRate,
      input.postedRate,
      input.monthsRemaining
    );
  }

  const finalPenalty =
    input.mortgageType === "variable"
      ? threeMonthInterest
      : Math.max(threeMonthInterest, irdAmount);

  let penaltyType: PenaltyCalcResult["penaltyType"] = "3 Months Interest";
  let explanation = "";

  if (input.mortgageType === "variable") {
    penaltyType = "3 Months Interest";
      explanation =
        "Variable-rate mortgages typically charge 3 months of interest on the outstanding balance (rate / 12 × balance × 3).";
  } else if (irdAmount > threeMonthInterest) {
    penaltyType = "Interest Rate Differential (IRD)";
    explanation = `Your IRD (${formatCad(irdAmount)}) is higher than 3 months' interest (${formatCad(threeMonthInterest)}). Lenders charge the greater of the two.`;
    if (input.lenderType === "bank") {
      explanation +=
        " Big banks may charge more if they use posted rates from origination rather than your discounted contract rate.";
    }
  } else {
    penaltyType = "3 Months Interest";
    explanation = `3 months' interest on your balance (${formatCad(threeMonthInterest)}) is higher than your IRD (${formatCad(irdAmount)}).`;
  }

  return {
    threeMonthInterest,
    irdAmount: input.mortgageType === "variable" ? 0 : irdAmount,
    finalPenalty,
    penaltyType,
    monthlyInterest,
    explanation,
  };
}

/**
 * B.C. Property Transfer Tax and first-time home buyers’ exemption.
 *
 * Default thresholds are for registrations on or after 1 April 2024.
 * Source: https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax/exemptions/first-time-home-buyers/current-amount
 *
 * Models a 100%-eligible transfer on a property smaller than 0.5 hectares
 * with no non-residential improvements. Does not model additional foreign-buyer PTT.
 */
export const BC_PTT_FTHB_FULL_EXEMPTION_FMV = 500_000;
export const BC_PTT_FTHB_MAX_EXEMPTION = 8_000;
/** Qualifying FMV for the full $8,000 exemption band (on/after 1 April 2024). */
export const BC_PTT_FTHB_FULL_PROGRAM_FMV = 835_000;
/** Exemption is $0 at this FMV and above (on/after 1 April 2024). */
export const BC_PTT_FTHB_PHASE_OUT_END_FMV = 860_000;

export function calculateBcPropertyTransferTax(fairMarketValue: number): number {
  if (fairMarketValue <= 0) return 0;
  if (fairMarketValue <= 200_000) return fairMarketValue * 0.01;
  if (fairMarketValue <= 2_000_000) {
    return 200_000 * 0.01 + (fairMarketValue - 200_000) * 0.02;
  }
  if (fairMarketValue <= 3_000_000) {
    return 200_000 * 0.01 + 1_800_000 * 0.02 + (fairMarketValue - 2_000_000) * 0.03;
  }
  return (
    200_000 * 0.01 +
    1_800_000 * 0.02 +
    1_000_000 * 0.03 +
    (fairMarketValue - 3_000_000) * 0.05
  );
}

/**
 * First-time home buyers’ exemption for registrations on or after 1 April 2024.
 * Full exemption on PTT for FMV at or below $500,000; $8,000 cap through $835,000;
 * proportional reduction between $835,000 and $860,000; $0 at $860,000+.
 */
export function calculateBcFthbExemption(fairMarketValue: number): number {
  if (fairMarketValue <= 0) return 0;
  const ptt = calculateBcPropertyTransferTax(fairMarketValue);
  if (fairMarketValue <= BC_PTT_FTHB_FULL_EXEMPTION_FMV) {
    return ptt;
  }
  if (fairMarketValue <= BC_PTT_FTHB_FULL_PROGRAM_FMV) {
    return BC_PTT_FTHB_MAX_EXEMPTION;
  }
  if (fairMarketValue < BC_PTT_FTHB_PHASE_OUT_END_FMV) {
    const remainingShare =
      (BC_PTT_FTHB_PHASE_OUT_END_FMV - fairMarketValue) /
      (BC_PTT_FTHB_PHASE_OUT_END_FMV - BC_PTT_FTHB_FULL_PROGRAM_FMV);
    return BC_PTT_FTHB_MAX_EXEMPTION * remainingShare;
  }
  return 0;
}

export function calculateBcPttPayableAfterFthb(fairMarketValue: number): number {
  return Math.max(
    0,
    calculateBcPropertyTransferTax(fairMarketValue) - calculateBcFthbExemption(fairMarketValue)
  );
}

/** Ontario provincial land transfer tax. Toronto MLTT is a second pass of the same brackets. */
export function ontarioProvincialLandTransferTax(price: number): number {
  if (price <= 0) return 0;
  if (price <= 55_000) return price * 0.005;
  if (price <= 250_000) return 55_000 * 0.005 + (price - 55_000) * 0.01;
  if (price <= 400_000) return 55_000 * 0.005 + 195_000 * 0.01 + (price - 250_000) * 0.015;
  if (price <= 2_000_000) {
    return 55_000 * 0.005 + 195_000 * 0.01 + 150_000 * 0.015 + (price - 400_000) * 0.02;
  }
  return (
    55_000 * 0.005 +
    195_000 * 0.01 +
    150_000 * 0.015 +
    1_600_000 * 0.02 +
    (price - 2_000_000) * 0.025
  );
}

export const ONTARIO_FTB_REBATE_CAP = 4_000;
export const TORONTO_FTB_REBATE_CAP = 4_475;

/** Provincial refund up to $4,000 plus, in Toronto only, a municipal refund up to $4,475. */
export function ontarioFirstTimeRebates(provincialTax: number, municipalTax: number): {
  provincial: number;
  municipal: number;
  total: number;
} {
  const provincial = Math.min(ONTARIO_FTB_REBATE_CAP, Math.max(0, provincialTax));
  const municipal = Math.min(TORONTO_FTB_REBATE_CAP, Math.max(0, municipalTax));
  return { provincial, municipal, total: provincial + municipal };
}

/**
 * Quebec welcome-tax brackets used by the calculators outside Montreal.
 * This is a planning estimate, not Revenu Québec’s first-home credit.
 */
export function quebecWelcomeTaxOutsideMontreal(price: number): number {
  if (price <= 0) return 0;
  if (price <= 55_500) return price * 0.005;
  if (price <= 255_000) return 55_500 * 0.005 + (price - 55_500) * 0.01;
  return 55_500 * 0.005 + 199_500 * 0.01 + (price - 255_000) * 0.015;
}

/** Manitoba land transfer tax as modelled in the closing-costs calculator. */
export function manitobaLandTransferTax(price: number): number {
  if (price <= 30_000) return 0;
  if (price <= 90_000) return (price - 30_000) * 0.005;
  if (price <= 150_000) return 300 + (price - 90_000) * 0.01;
  if (price <= 200_000) return 900 + (price - 150_000) * 0.015;
  return 1_650 + (price - 200_000) * 0.02;
}

/** P.E.I. model in the closing-costs calculator: no tax at or below $30,000, then 1%. */
export function peiTransferTax(price: number): number {
  if (price <= 30_000) return 0;
  return price * 0.01;
}

/**
 * Alberta Land Titles registration fee for submissions on or after 1 October 2026:
 * $50 plus $5 per $5,000 or part. A mortgage is a separate instrument.
 */
export function albertaLandTitlesFee(amount: number): number {
  if (amount <= 0) return 0;
  return 50 + 5 * Math.ceil(amount / 5_000);
}

/** Newfoundland and Labrador registration-style fee used by the closing-costs calculator. */
export function newfoundlandRegistrationFee(price: number): number {
  if (price <= 0) return 0;
  return 100 + (price > 500 ? (price - 500) * 0.004 : 0);
}

/** Equivalent monthly rate when a Canadian fixed rate compounds semi-annually. */
export function semiAnnualMonthlyRate(annualRatePercent: number): number {
  const semi = annualRatePercent / 100 / 2;
  return Math.pow(1 + semi, 1 / 6) - 1;
}

export function calculateMonthlyPaymentSemiAnnual(
  principal: number,
  annualRatePercent: number,
  amortizationYears: number
): number {
  if (principal <= 0 || amortizationYears <= 0) return 0;
  const n = amortizationYears * 12;
  const r = semiAnnualMonthlyRate(annualRatePercent);
  if (r === 0) return principal / n;
  const factor = Math.pow(1 + r, n);
  return (principal * r * factor) / (factor - 1);
}

export interface AmortizationYearRow {
  year: number;
  interest: number;
  principalPaid: number;
  balance: number;
}

/**
 * Year-by-year principal and interest using the same monthly rate as
 * calculateMonthlyPayment (annual rate ÷ 12), which is what the calculator uses.
 */
export function amortizationByYear(
  principal: number,
  annualRatePercent: number,
  amortizationYears: number,
  yearsToShow = 5
): AmortizationYearRow[] {
  if (principal <= 0 || amortizationYears <= 0) return [];
  const payment = calculateMonthlyPayment(principal, annualRatePercent, amortizationYears);
  const r = monthlyInterestRate(annualRatePercent);
  let balance = principal;
  const rows: AmortizationYearRow[] = [];
  const show = Math.min(yearsToShow, amortizationYears);
  for (let year = 1; year <= show; year++) {
    let interest = 0;
    let principalPaid = 0;
    for (let month = 0; month < 12 && balance > 0.005; month++) {
      const monthInterest = balance * r;
      const principalPart = Math.min(balance, Math.max(0, payment - monthInterest));
      interest += monthInterest;
      principalPaid += principalPart;
      balance = Math.max(0, balance - principalPart);
    }
    rows.push({ year, interest, principalPaid, balance });
  }
  return rows;
}
