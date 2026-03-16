"use client";

import { useState, useMemo } from "react";

interface RentVsBuyParams {
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

interface RentVsBuyResult {
  rentTotal: number;
  buyTotal: number;
  monthlyMortgage: number;
  homeValue: number;
  equity: number;
  netWorthBuy: number;
  netWorthRent: number;
  winner: 'rent' | 'buy' | 'tie';
  difference: number;
  breakEvenYear: number | null;
}

export default function RentVsBuyCalculator() {
  const [params, setParams] = useState<RentVsBuyParams>({
    monthlyRent: 2500,
    homePrice: 800000,
    downPayment: 160000,
    interestRate: 4.5,
    propertyTax: 400,
    maintenance: 300,
    homeInsurance: 100,
    monthlyUtilities: 200,
    annualAppreciation: 3,
    investmentReturn: 6,
    years: 10,
  });

  const results = useMemo((): RentVsBuyResult => {
    const mortgageAmount = params.homePrice - params.downPayment;
    const monthlyRate = params.interestRate / 100 / 12;
    const numPayments = 25 * 12; // Standard amortization
    
    // Monthly mortgage payment
    const monthlyMortgage = mortgageAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    // Monthly costs for buying
    const monthlyBuyCosts = monthlyMortgage + params.propertyTax + 
      params.maintenance + params.homeInsurance + params.monthlyUtilities;
    
    // Initial opportunity cost of down payment
    let downPaymentOpportunityCost = params.downPayment;
    
    // Calculate year by year
    let rentTotal = 0;
    let buyTotal = params.downPayment; // Initial investment
    let homeValue = params.homePrice;
    let mortgageBalance = mortgageAmount;
    let investmentValue = params.downPayment; // What renter invests instead
    
    let breakEvenYear: number | null = null;
    let previousNetDifference = 0;
    
    for (let year = 1; year <= params.years; year++) {
      // Rent scenario
      const yearlyRent = params.monthlyRent * 12 * Math.pow(1.025, year - 1); // 2.5% annual rent increase
      rentTotal += yearlyRent;
      
      // Renter invests the difference (if buying costs more)
      const yearlyBuyCosts = monthlyBuyCosts * 12;
      const monthlyDifference = yearlyBuyCosts - yearlyRent;
      
      if (monthlyDifference > 0) {
        // Renter saves money, invests it
        investmentValue = investmentValue * (1 + params.investmentReturn / 100) + monthlyDifference;
      } else {
        // Buyer saves money, but already accounted for in home equity
        investmentValue = investmentValue * (1 + params.investmentReturn / 100);
      }
      
      // Buy scenario
      buyTotal += yearlyBuyCosts;
      homeValue = homeValue * (1 + params.annualAppreciation / 100);
      
      // Pay down mortgage
      for (let month = 0; month < 12; month++) {
        const interestPayment = mortgageBalance * monthlyRate;
        const principalPayment = monthlyMortgage - interestPayment;
        mortgageBalance = Math.max(0, mortgageBalance - principalPayment);
      }
      
      // Check break-even
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
    let winner: 'rent' | 'buy' | 'tie' = 'tie';
    if (netWorthBuy > netWorthRent + 1000) winner = 'buy';
    else if (netWorthRent > netWorthBuy + 1000) winner = 'rent';
    
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
  }, [params]);

  const formatCurrency = (value: number) => 
    `$${value.toLocaleString('en-CA', { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">🏠</span>
              Home Purchase
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Home Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.homePrice}
                    onChange={(e) => setParams({ ...params, homePrice: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    step="10000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Down Payment</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.downPayment}
                    onChange={(e) => setParams({ ...params, downPayment: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    step="5000"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {((params.downPayment / params.homePrice) * 100).toFixed(1)}% of home price
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Interest Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    value={params.interestRate}
                    onChange={(e) => setParams({ ...params, interestRate: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-sm">📊</span>
              Monthly Costs
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Property Tax</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.propertyTax}
                    onChange={(e) => setParams({ ...params, propertyTax: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Maintenance</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.maintenance}
                    onChange={(e) => setParams({ ...params, maintenance: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Insurance</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.homeInsurance}
                    onChange={(e) => setParams({ ...params, homeInsurance: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Utilities</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.monthlyUtilities}
                    onChange={(e) => setParams({ ...params, monthlyUtilities: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm">🏢</span>
              Renting
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Rent</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.monthlyRent}
                    onChange={(e) => setParams({ ...params, monthlyRent: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    step="100"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">📈</span>
              Assumptions
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Home Appreciation (Annual)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={params.annualAppreciation}
                    onChange={(e) => setParams({ ...params, annualAppreciation: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    step="0.5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Investment Return (Annual)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={params.investmentReturn}
                    onChange={(e) => setParams({ ...params, investmentReturn: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    step="0.5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Return on down payment if invested</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time Period</label>
                <select
                  value={params.years}
                  onChange={(e) => setParams({ ...params, years: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value={5}>5 years</option>
                  <option value={10}>10 years</option>
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={25}>25 years</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="mt-8">
        <div className={`rounded-2xl p-6 ${
          results.winner === 'buy' ? 'bg-emerald-50 border-2 border-emerald-200' :
          results.winner === 'rent' ? 'bg-blue-50 border-2 border-blue-200' :
          'bg-slate-50 border-2 border-slate-200'
        }`}>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {results.winner === 'buy' && '🏠 Buying Wins'}
              {results.winner === 'rent' && '🏢 Renting Wins'}
              {results.winner === 'tie' && '⚖️ Nearly Equal'}
            </h3>
            <p className="text-slate-600">
              Over {params.years} years, {results.winner === 'buy' ? 'buying' : 'renting'} leaves you with{' '}
              <span className="font-bold">{formatCurrency(results.difference)}</span> more
            </p>
            {results.breakEvenYear && (
              <p className="text-sm text-slate-500 mt-2">
                Break-even point: Year {results.breakEvenYear}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold text-slate-900 mb-3">Buying Scenario</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly Mortgage</span>
                  <span className="font-medium">{formatCurrency(results.monthlyMortgage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Spent</span>
                  <span className="font-medium">{formatCurrency(results.buyTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Home Value</span>
                  <span className="font-medium text-emerald-600">{formatCurrency(results.homeValue)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-900 font-medium">Net Worth</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(results.netWorthBuy)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold text-slate-900 mb-3">Renting Scenario</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly Rent</span>
                  <span className="font-medium">{formatCurrency(params.monthlyRent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Rent Paid</span>
                  <span className="font-medium">{formatCurrency(results.rentTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Investment Growth</span>
                  <span className="font-medium text-blue-600">{formatCurrency(results.netWorthRent)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-900 font-medium">Net Worth</span>
                  <span className="font-bold text-blue-600">{formatCurrency(results.netWorthRent)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
