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
      "Variable-rate mortgages typically charge 3 months of interest on the outstanding balance (rate ÷ 12 × balance × 3).";
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
