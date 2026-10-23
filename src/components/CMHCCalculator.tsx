"use client";

import { useState, useMemo } from "react";

import {
  calculateCmhcPremium,
  CMHC_LONG_AMORTIZATION_SURCHARGE,
  CMHC_PREMIUM_TIERS,
  INSURED_PRICE_LIMIT,
  minimumDownPayment,
} from "@/lib/cmhcPremium";

export default function CMHCCalculator() {
  const [homePrice, setHomePrice] = useState(600000);
  const [downPayment, setDownPayment] = useState(60000);

  const results = useMemo(
    () => calculateCmhcPremium(homePrice, downPayment),
    [homePrice, downPayment],
  );

  const minDownPayment = useMemo(() => minimumDownPayment(homePrice), [homePrice]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4">CMHC Mortgage Insurance Calculator</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Home Purchase Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
            <input
              type="number"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Down Payment
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val <= homePrice) setDownPayment(val);
              }}
              max={homePrice}
              className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          {minDownPayment < homePrice * 0.2 && (
            <p className="text-xs text-amber-600 mt-1">
              Minimum for this price: ${minDownPayment.toLocaleString(undefined, {maximumFractionDigits: 0})} ({(minDownPayment / homePrice * 100).toFixed(1)}%). That is 5% of the first $500,000 and 10% of the rest.
            </p>
          )}
        </div>

        {/* Visual Down Payment Slider */}
        <div>
          <div className="flex justify-between text-sm text-slate-600 mb-1">
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
          <div className="mt-1 text-center text-sm text-slate-600">
            {results.downPaymentPercent.toFixed(1)}% down payment
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 space-y-4">
        {results.aboveInsuredCap && results.downPaymentPercent < 20 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-semibold text-amber-900">Default insurance is not available at this price</p>
            <p className="text-sm text-amber-800 mt-2">
              Insured mortgages are for a purchase price under ${INSURED_PRICE_LIMIT.toLocaleString("en-CA")}. At $1,500,000 or more, the minimum down payment is 20% (${minDownPayment.toLocaleString("en-CA", { maximumFractionDigits: 0 })} on this price).
            </p>
          </div>
        ) : !results.isRequired ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-green-900">No CMHC Insurance Required</p>
                <p className="text-sm text-green-700">
                  With {results.downPaymentPercent.toFixed(1)}% down, you have a conventional mortgage.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-semibold text-amber-900 mb-3">CMHC Insurance Required</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-600">Mortgage Amount</p>
                <p className="font-semibold text-slate-900">${results.mortgageAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Loan-to-Value (LTV)</p>
                <p className="font-semibold text-slate-900">{results.ltv.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Premium Rate</span>
                <span className="font-semibold text-slate-900">{results.premiumRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200">
                <span className="text-slate-900 font-medium">Premium Amount</span>
                <span className="text-xl font-bold text-amber-700">${results.premiumAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-600">Total Mortgage</p>
                <p className="font-bold text-slate-900">${results.totalMortgage.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">New LTV with Premium</p>
                <p className="font-bold text-slate-900">{results.newLTV.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-slate-500">
        <p><strong>CMHC traditional homeowner premiums, 25 years or less:</strong></p>
        <ul className="mt-1 space-y-1">
          {CMHC_PREMIUM_TIERS.map((tier) => (
            <li key={tier.ltvMax}>
              {tier.ltvMin === 0 ? "Up to" : `${tier.ltvMin.toFixed(2)}% to`} {tier.ltvMax}% LTV: {tier.rate.toFixed(2)}%
            </li>
          ))}
        </ul>
        <p className="mt-2">
          An amortization longer than 25 years adds {CMHC_LONG_AMORTIZATION_SURCHARGE.toFixed(2)} points on CMHC&apos;s schedule. This tool does not add that surcharge, and it does not add provincial sales tax. Ontario, Quebec, and Saskatchewan tax the premium. That tax cannot be added to the loan. A non-traditional down payment in the top band is higher. Purchases of $1,500,000 or more are not eligible.
        </p>
      </div>
    </div>
  );
}
