export interface RentVsBuyInput {
  monthlyRent: number;
  homePrice: number;
  downPayment: number;
  interestRate: number;
  propertyTax: number;
  maintenance: number;
  homeInsurance: number;
  monthlyUtilities: number;
  annualAppreciation: number;
  investmentReturn: number;
  years: number;
}

export interface RentVsBuyResult {
  rentTotal: number;
  buyTotal: number;
  monthlyMortgage: number;
  homeValue: number;
  equity: number;
  netWorthBuy: number;
  netWorthRent: number;
  winner: "rent" | "buy" | "tie";
  difference: number;
  breakEvenYear: number | null;
}

/**
 * Worksheet used by the rent-vs-buy calculator.
 * Mortgage interest uses a monthly rate (annual rate / 12) over a 25-year amortization.
 * Rent grows 2.5% a year. The renter's investment starts as the down payment.
 */
export function calculateRentVsBuy(params: RentVsBuyInput): RentVsBuyResult {
  const mortgageAmount = params.homePrice - params.downPayment;
  const monthlyRate = params.interestRate / 100 / 12;
  const numPayments = 25 * 12;

  const monthlyMortgage =
    mortgageAmount *
    ((monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1));

  const monthlyBuyCosts =
    monthlyMortgage + params.propertyTax + params.maintenance + params.homeInsurance + params.monthlyUtilities;

  let rentTotal = 0;
  let buyTotal = params.downPayment;
  let homeValue = params.homePrice;
  let mortgageBalance = mortgageAmount;
  let investmentValue = params.downPayment;

  let breakEvenYear: number | null = null;
  let previousNetDifference = 0;

  for (let year = 1; year <= params.years; year++) {
    const yearlyRent = params.monthlyRent * 12 * Math.pow(1.025, year - 1);
    rentTotal += yearlyRent;

    const yearlyBuyCosts = monthlyBuyCosts * 12;
    const monthlyDifference = yearlyBuyCosts - yearlyRent;

    if (monthlyDifference > 0) {
      investmentValue = investmentValue * (1 + params.investmentReturn / 100) + monthlyDifference;
    } else {
      investmentValue = investmentValue * (1 + params.investmentReturn / 100);
    }

    buyTotal += yearlyBuyCosts;
    homeValue = homeValue * (1 + params.annualAppreciation / 100);

    for (let month = 0; month < 12; month++) {
      const interestPayment = mortgageBalance * monthlyRate;
      const principalPayment = monthlyMortgage - interestPayment;
      mortgageBalance = Math.max(0, mortgageBalance - principalPayment);
    }

    const equity = homeValue - mortgageBalance;
    const netWorthBuy = equity;
    const netWorthRent = investmentValue - rentTotal;

    if (breakEvenYear === null && netWorthBuy > netWorthRent && previousNetDifference <= 0) {
      breakEvenYear = year;
    }
    previousNetDifference = netWorthBuy - netWorthRent;
  }

  const finalEquity = homeValue - mortgageBalance;
  const netWorthBuy = finalEquity;
  const netWorthRent = investmentValue;
  const difference = Math.abs(netWorthBuy - netWorthRent);
  let winner: RentVsBuyResult["winner"] = "tie";
  if (netWorthBuy > netWorthRent + 1000) winner = "buy";
  else if (netWorthRent > netWorthBuy + 1000) winner = "rent";

  return {
    rentTotal: Math.round(rentTotal),
    buyTotal: Math.round(buyTotal),
    monthlyMortgage: Math.round(monthlyMortgage),
    homeValue: Math.round(homeValue),
    equity: Math.round(finalEquity),
    netWorthBuy: Math.round(netWorthBuy),
    netWorthRent: Math.round(netWorthRent),
    winner,
    difference: Math.round(difference),
    breakEvenYear,
  };
}
