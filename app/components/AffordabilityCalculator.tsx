"use client";

import { useState, useMemo } from "react";

export default function AffordabilityCalculator() {
  const [annualIncome, setAnnualIncome] = useState(80000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(50000);
  const [stressRate, setStressRate] = useState(5.25);
  const [amortization, setAmortization] = useState(25);

  const maxAffordable = useMemo(() => {
    // GDS ratio: 39% max for housing
    // TDS ratio: 44% max for total debt service (housing + other debts)
    const monthlyIncome = annualIncome / 12;
    const gdsMax = monthlyIncome * 0.39;
    const tdsMax = monthlyIncome * 0.44;
    
    // Available for mortgage payment (lower of the two)
    const availableForMortgage = Math.min(
      gdsMax,
      tdsMax - monthlyDebts
    );
    
    if (availableForMortgage <= 0) return 0;
    
    // Calculate mortgage amount using stress test rate
    const monthlyRate = stressRate / 100 / 12;
    const numPayments = amortization * 12;
    
    // PV = PMT * [(1 - (1 + r)^-n) / r]
    const mortgageAmount = 
      availableForMortgage * 
      ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);
    
    return Math.floor(mortgageAmount + downPayment);
  }, [annualIncome, monthlyDebts, downPayment, stressRate, amortization]);

  const mortgageNeeded = Math.max(0, maxAffordable - downPayment);
  const loanToValue = maxAffordable > 0 ? (mortgageNeeded / maxAffordable) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Affordability Calculator</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Annual Household Income
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Debt Payments (car, credit cards, etc.)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={monthlyDebts}
              onChange={(e) => setMonthlyDebts(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Down Payment Available
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stress Test Rate
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={stressRate}
                onChange={(e) => setStressRate(Number(e.target.value))}
                className="w-full px-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amortization
            </label>
            <select
              value={amortization}
              onChange={(e) => setAmortization(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={25}>25 years</option>
              <option value={30}>30 years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Maximum Home Price</p>
          <p className="text-3xl font-bold text-blue-700">
            ${maxAffordable.toLocaleString()}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-200">
          <div>
            <p className="text-xs text-gray-500">Mortgage Required</p>
            <p className="font-semibold text-gray-900">${mortgageNeeded.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Loan-to-Value</p>
            <p className="font-semibold text-gray-900">{loanToValue.toFixed(1)}%</p>
          </div>
        </div>

        {loanToValue > 80 && (
          <div className="mt-3 text-xs text-amber-700 bg-amber-50 p-2 rounded">
            ⚠️ Down payment is less than 20%. CMHC mortgage insurance will be required.
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Based on GDS 39% / TDS 44% ratios. Actual approval depends on credit score and lender criteria.
      </p>
    </div>
  );
}
