"use client";

import { useState, useMemo } from "react";

interface PremiumTier {
  ltvMin: number;
  ltvMax: number;
  rate: number;
}

const premiumTiers: PremiumTier[] = [
  { ltvMin: 65.01, ltvMax: 80, rate: 2.25 },
  { ltvMin: 80.01, ltvMax: 85, rate: 3.35 },
  { ltvMin: 85.01, ltvMax: 90, rate: 4.25 },
  { ltvMin: 90.01, ltvMax: 95, rate: 5.65 },
  { ltvMin: 95.01, ltvMax: 97, rate: 6.75 },
];

export default function CMHCCalculator() {
  const [homePrice, setHomePrice] = useState(600000);
  const [downPayment, setDownPayment] = useState(60000);

  const results = useMemo(() => {
    const mortgageAmount = homePrice - downPayment;
    const downPaymentPercent = (downPayment / homePrice) * 100;
    const ltv = ((homePrice - downPayment) / homePrice) * 100;

    // Find premium tier
    const tier = premiumTiers.find(
      (t) => ltv >= t.ltvMin && ltv <= t.ltvMax
    );

    const premiumRate = tier?.rate || 0;
    const premiumAmount = (mortgageAmount * premiumRate) / 100;
    const totalMortgage = mortgageAmount + premiumAmount;
    const newLTV = (totalMortgage / homePrice) * 100;

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
  }, [homePrice, downPayment]);

  const minDownPayment = useMemo(() => {
    // Canada minimum down payment rules:
    // 5% on first $500K
    // 10% on amount above $500K up to $1M
    // 20% on amounts above $1M (no insurance available)
    if (homePrice <= 500000) {
      return homePrice * 0.05;
    } else if (homePrice <= 1000000) {
      return 500000 * 0.05 + (homePrice - 500000) * 0.10;
    }
    return homePrice * 0.20; // No CMHC allowed above $1M
  }, [homePrice]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">CMHC Mortgage Insurance Calculator</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Home Purchase Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Down Payment
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val <= homePrice) setDownPayment(val);
              }}
              max={homePrice}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {minDownPayment < homePrice * 0.2 && (
            <p className="text-xs text-amber-600 mt-1">
              Minimum required: ${minDownPayment.toLocaleString(undefined, {maximumFractionDigits: 0})} ({(minDownPayment/homePrice*100).toFixed(0)}%)
            </p>
          )}
        </div>

        {/* Visual Down Payment Slider */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>5%</span>
            <span>10%</span>
            <span>15%</span>
            <span>20%</span>
          </div>
          <input
            type="range"
            min={minDownPayment}
            max={homePrice * 0.25}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="mt-1 text-center text-sm text-gray-600">
            {results.downPaymentPercent.toFixed(1)}% down payment
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 space-y-4">
        {!results.isRequired ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-green-900">No CMHC Insurance Required</p>
                <p className="text-sm text-green-700">
                  With {results.downPaymentPercent.toFixed(0)}% down, you have a conventional mortgage.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-semibold text-amber-900 mb-3">CMHC Insurance Required</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-600">Mortgage Amount</p>
                <p className="font-semibold text-gray-900">${results.mortgageAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Loan-to-Value (LTV)</p>
                <p className="font-semibold text-gray-900">{results.ltv.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Premium Rate</span>
                <span className="font-semibold text-gray-900">{results.premiumRate}%</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <span className="text-gray-900 font-medium">Premium Amount</span>
                <span className="text-xl font-bold text-amber-700">${results.premiumAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Total Mortgage</p>
                <p className="font-bold text-gray-900">${results.totalMortgage.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">New LTV with Premium</p>
                <p className="font-bold text-gray-900">{results.newLTV.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p><strong>CMHC Premium Rates (2025):</strong></p>
        <ul className="mt-1 space-y-1">
          <li>65% - 80% LTV: 2.25%</li>
          <li>80% - 85% LTV: 3.35%</li>
          <li>85% - 90% LTV: 4.25%</li>
          <li>90% - 95% LTV: 5.65%</li>
          <li>95% - 97% LTV: 6.75%</li>
        </ul>
        <p className="mt-2">Provincial sales tax (HST/QST) may apply on top of the premium.</p>
      </div>
    </div>
  );
}
