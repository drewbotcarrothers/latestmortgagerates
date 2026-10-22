/** Premium bands applied by the CMHC insurance calculator on this site. */
export const CMHC_PREMIUM_TIERS = [
  { ltvMin: 65.01, ltvMax: 80, rate: 2.25 },
  { ltvMin: 80.01, ltvMax: 85, rate: 3.35 },
  { ltvMin: 85.01, ltvMax: 90, rate: 4.25 },
  { ltvMin: 90.01, ltvMax: 95, rate: 5.65 },
  { ltvMin: 95.01, ltvMax: 97, rate: 6.75 },
] as const;

export interface CmhcPremiumResult {
  mortgageAmount: number;
  downPaymentPercent: number;
  ltv: number;
  premiumRate: number;
  premiumAmount: number;
  totalMortgage: number;
  newLTV: number;
  isRequired: boolean;
}

/**
 * Canada minimum down payment used by the calculator:
 * 5% on the first $500,000, 10% on the portion above $500,000 up to $1,000,000,
 * and 20% on a price above $1,000,000 (default insurance is not available).
 */
export function minimumDownPayment(homePrice: number): number {
  if (homePrice <= 500000) return homePrice * 0.05;
  if (homePrice <= 1000000) return 500000 * 0.05 + (homePrice - 500000) * 0.1;
  return homePrice * 0.2;
}

/** Same math as the calculator. Premium is still computed when insurance is not required; the page hides it. */
export function calculateCmhcPremium(homePrice: number, downPayment: number): CmhcPremiumResult {
  const mortgageAmount = homePrice - downPayment;
  const downPaymentPercent = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
  const ltv = homePrice > 0 ? ((homePrice - downPayment) / homePrice) * 100 : 0;
  const tier = CMHC_PREMIUM_TIERS.find((item) => ltv >= item.ltvMin && ltv <= item.ltvMax);
  const premiumRate = tier?.rate || 0;
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
    isRequired: downPaymentPercent < 20,
  };
}
