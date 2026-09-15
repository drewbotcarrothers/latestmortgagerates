import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateBcFthbExemption,
  calculateBcPropertyTransferTax,
  calculateBcPttPayableAfterFthb,
  calculateMonthlyPayment,
  calculateMortgagePenalty,
  calculateRefinance,
  calculateRenewalComparison,
  threeMonthInterestOnBalance,
} from "./mortgageMath.ts";

function assertBcFthbRow(
  fairMarketValue: number,
  tax: number,
  exemption: number,
  payable: number
) {
  assert.equal(calculateBcPropertyTransferTax(fairMarketValue), tax);
  assert.equal(calculateBcFthbExemption(fairMarketValue), exemption);
  assert.equal(calculateBcPttPayableAfterFthb(fairMarketValue), payable);
}

describe("calculateMonthlyPayment", () => {
  it("amortizes a $400k balance at 4.89% over remaining 20 years (~$2.6k, not the 5-year term)", () => {
    const payment = calculateMonthlyPayment(400000, 4.89, 20);
    assert.ok(payment > 2500 && payment < 2700, `got ${payment}`);
    // Bug was amortizing over the 5-year renewal term (~$7,528)
    assert.ok(payment < 4000);
  });
});

describe("threeMonthInterestOnBalance", () => {
  it("uses interest on the outstanding balance, not 3 × monthly payment", () => {
    const threeMonth = threeMonthInterestOnBalance(400000, 5.5);
    assert.equal(threeMonth, 5500);
    const paymentBased = calculateMonthlyPayment(400000, 5.5, 25) * 3;
    assert.ok(paymentBased > 7000, "precondition: payment×3 was the old overstated figure");
    assert.ok(threeMonth < paymentBased);
  });
});

describe("calculateRenewalComparison", () => {
  it("uses remaining amortization for both lenders and reports term interest, not payoff interest", () => {
    const result = calculateRenewalComparison({
      balance: 400000,
      currentRate: 4.89,
      marketRate: 3.64,
      amortizationYears: 20,
      renewalTermYears: 5,
      switchingCosts: 500,
    });

    assert.ok(result.currentLender.monthlyPayment > 2500 && result.currentLender.monthlyPayment < 2700);
    assert.ok(result.newLender.monthlyPayment > 2200 && result.newLender.monthlyPayment < 2500);
    assert.ok(result.savings.monthly > 0);
    assert.ok(result.savings.totalInterest > 0);
    assert.equal(
      Math.round(result.savings.overTerm),
      Math.round(result.savings.totalInterest - 500)
    );
    // Interest over 5 years is far less than paying off the whole $400k
    assert.ok(result.currentLender.totalInterest < 120000);
  });
});

describe("calculateRefinance", () => {
  it("keeps monthly savings, break-even, and total savings internally consistent", () => {
    const result = calculateRefinance({
      currentBalance: 400000,
      currentRate: 5.5,
      currentTermRemainingYears: 3,
      remainingAmortizationYears: 25,
      newRate: 4.2,
      penaltyType: "three_month",
      postedRate: 6.5,
      closingCosts: 2000,
    });

    assert.ok(result.monthlySavings > 0, `monthly savings should be positive, got ${result.monthlySavings}`);
    assert.ok(Number.isFinite(result.breakEvenMonths) && result.breakEvenMonths > 0);
    assert.equal(
      Math.round(result.totalSavings),
      Math.round(result.monthlySavings * result.comparisonMonths - result.totalCost)
    );
    assert.equal(result.penaltyAmount, 5500);
    assert.ok(result.interestSavings > 0);
    assert.equal(result.comparisonMonths, 36);
    assert.ok(result.breakEvenMonths <= result.comparisonMonths || result.totalSavings <= 0);
  });

  it("does not amortize the new mortgage over the 5-year term", () => {
    const result = calculateRefinance({
      currentBalance: 400000,
      currentRate: 5.5,
      currentTermRemainingYears: 3,
      remainingAmortizationYears: 25,
      newRate: 4.2,
      penaltyType: "ird",
      postedRate: 6.5,
      closingCosts: 2000,
    });
    const fiveYearPayoff = calculateMonthlyPayment(400000, 4.2, 5);
    assert.ok(result.newMonthlyPayment < 3000);
    assert.ok(result.newMonthlyPayment < fiveYearPayoff / 2);
    // Posted rate above contract rate → IRD is $0, so penalty is 3-month interest
    assert.equal(Math.round(result.penaltyAmount), 5500);
  });
});

describe("calculateMortgagePenalty", () => {
  it("defaults to ~$5,500 of 3-month interest on $400k at 5.5%", () => {
    const result = calculateMortgagePenalty({
      mortgageBalance: 400000,
      currentRate: 5.5,
      mortgageType: "fixed",
      monthsRemaining: 24,
      postedRate: 6.5,
      lenderType: "bank",
    });
    assert.equal(result.threeMonthInterest, 5500);
    assert.equal(result.irdAmount, 0);
    assert.equal(result.finalPenalty, 5500);
    assert.equal(result.penaltyType, "3 Months Interest");
  });

  it("uses IRD when contract rate is above the comparison rate", () => {
    const result = calculateMortgagePenalty({
      mortgageBalance: 400000,
      currentRate: 5.5,
      mortgageType: "fixed",
      monthsRemaining: 24,
      postedRate: 4.0,
      lenderType: "monoline",
    });
    assert.equal(result.irdAmount, 400000 * 0.015 * 2);
    assert.ok(result.irdAmount > result.threeMonthInterest);
    assert.equal(result.penaltyType, "Interest Rate Differential (IRD)");
    assert.equal(result.finalPenalty, result.irdAmount);
  });

  it("variable mortgages use only the 3-month interest path", () => {
    const result = calculateMortgagePenalty({
      mortgageBalance: 400000,
      currentRate: 5.5,
      mortgageType: "variable",
      monthsRemaining: 24,
      postedRate: 4.0,
      lenderType: "bank",
    });
    assert.equal(result.irdAmount, 0);
    assert.equal(result.finalPenalty, 5500);
    assert.equal(result.penaltyType, "3 Months Interest");
  });
});

describe("BC property transfer tax (standard brackets)", () => {
  it("matches the provincial 1% / 2% / 3% / 5% brackets", () => {
    assert.equal(calculateBcPropertyTransferTax(200_000), 2_000);
    assert.equal(calculateBcPropertyTransferTax(2_000_000), 38_000);
    assert.equal(calculateBcPropertyTransferTax(3_000_000), 68_000);
    assert.equal(calculateBcPropertyTransferTax(3_500_000), 93_000);
  });
});

describe("BC first-time home buyers' exemption (on or after 1 April 2024)", () => {
  // Table rows from:
  // https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax/exemptions/first-time-home-buyers/current-amount
  it("returns $0 payable at or below $500,000 (full exemption)", () => {
    assertBcFthbRow(400_000, 6_000, 6_000, 0);
    assertBcFthbRow(500_000, 8_000, 8_000, 0);
  });

  it("caps the exemption at $8,000 from over $500,000 through $835,000", () => {
    assertBcFthbRow(550_000, 9_000, 8_000, 1_000);
    assertBcFthbRow(600_000, 10_000, 8_000, 2_000);
    assertBcFthbRow(700_000, 12_000, 8_000, 4_000);
    assertBcFthbRow(800_000, 14_000, 8_000, 6_000);
    assertBcFthbRow(835_000, 14_700, 8_000, 6_700);
  });

  it("phases the $8,000 exemption out between $835,000 and $860,000", () => {
    assertBcFthbRow(836_000, 14_720, 7_680, 7_040);
    assertBcFthbRow(850_000, 15_000, 3_200, 11_800);
    assertBcFthbRow(859_000, 15_180, 320, 14_860);
  });

  it("charges full PTT with $0 exemption at $860,000 and above", () => {
    assertBcFthbRow(860_000, 15_200, 0, 15_200);
    assertBcFthbRow(1_000_000, 18_000, 0, 18_000);
  });

  it("does not use the retired $500k / $525k phase-out as the current program", () => {
    // Pre-April 2024 calculators zeroed the exemption above $525k.
    assert.equal(calculateBcFthbExemption(550_000), 8_000);
    assert.equal(calculateBcPttPayableAfterFthb(550_000), 1_000);
    // At $510k the old formula reduced the full tax; current program still caps at $8,000.
    assert.equal(calculateBcFthbExemption(510_000), 8_000);
    assert.equal(calculateBcPttPayableAfterFthb(510_000), 200);
  });
});
