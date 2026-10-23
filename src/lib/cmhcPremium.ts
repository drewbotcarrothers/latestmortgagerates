/**
 * Traditional homeowner premiums from CMHC's schedule for an amortization of
 * 25 years or less. A longer amortization adds CMHC_LONG_AMORTIZATION_SURCHARGE
 * on CMHC's own schedule. This module does not add that surcharge.
 *
 * Source: https://www.cmhc-schl.gc.ca/professionals/industry-innovation-and-leadership/industry-expertise/resources-for-mortgage-professionals/mortgage-loan-insurance-and-premiums
 */
export const CMHC_PREMIUM_TIERS = [
  { ltvMin: 0, ltvMax: 65, rate: 0.6 },
  { ltvMin: 65.01, ltvMax: 75, rate: 1.7 },
  { ltvMin: 75.01, ltvMax: 80, rate: 2.4 },
  { ltvMin: 80.01, ltvMax: 85, rate: 2.8 },
  { ltvMin: 85.01, ltvMax: 90, rate: 3.1 },
  { ltvMin: 90.01, ltvMax: 95, rate: 4 },
] as const;

/** Added by CMHC when the amortization is longer than 25 years. Not applied by calculateCmhcPremium. */
export const CMHC_LONG_AMORTIZATION_SURCHARGE = 0.2;

/**
 * High-ratio insured mortgages require a property value below this amount.
 * At $1,500,000 the loan is not eligible for default insurance.
 */
export const INSURED_PRICE_LIMIT = 1_500_000;

export interface CmhcPremiumResult {
  mortgageAmount: number;
  downPaymentPercent: number;
  ltv: number;
  premiumRate: number;
  premiumAmount: number;
  totalMortgage: number;
  newLTV: number;
  isRequired: boolean;
  /** True when the purchase price is $1,500,000 or more. */
  aboveInsuredCap: boolean;
}

/**
 * Minimum down payment for a purchase:
 * 5% of the first $500,000 and 10% of the rest, while the price is under
 * $1,500,000. At $1,500,000 or more, default insurance is unavailable and the
 * minimum is 20%.
 */
export function minimumDownPayment(homePrice: number): number {
  if (homePrice <= 0) return 0;
  if (homePrice >= INSURED_PRICE_LIMIT) return homePrice * 0.2;
  if (homePrice <= 500_000) return homePrice * 0.05;
  return 500_000 * 0.05 + (homePrice - 500_000) * 0.1;
}

export function premiumRateForLtv(ltv: number): number {
  const tier = CMHC_PREMIUM_TIERS.find((item) => ltv >= item.ltvMin && ltv <= item.ltvMax);
  return tier?.rate ?? 0;
}

/**
 * Same math as the calculator. Premium is still computed when the down payment
 * is 20% or more and the price is under the cap; the page hides it.
 * A price at or above the cap produces no premium.
 */
export function calculateCmhcPremium(homePrice: number, downPayment: number): CmhcPremiumResult {
  const aboveInsuredCap = homePrice >= INSURED_PRICE_LIMIT;
  const mortgageAmount = homePrice - downPayment;
  const downPaymentPercent = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
  const ltv = homePrice > 0 ? ((homePrice - downPayment) / homePrice) * 100 : 0;
  const premiumRate = aboveInsuredCap ? 0 : premiumRateForLtv(ltv);
  const premiumAmount = (mortgageAmount * premiumRate) / 100;
  const totalMortgage = mortgageAmount + premiumAmount;
  const newLTV = homePrice > 0 ? (totalMortgage / homePrice) * 100 : 0;
  return {
    mortgageAmount,
    downPaymentPercent,
    ltv,
    premiumRate,
    premiumAmount,
    totalMortgage,
    newLTV,
    isRequired: !aboveInsuredCap && downPaymentPercent < 20,
    aboveInsuredCap,
  };
}
