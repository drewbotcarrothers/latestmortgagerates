"use client";

import { useState, useMemo } from "react";

interface AffordabilityResult {
  maxHomePrice: number;
  mortgageNeeded: number;
  monthlyPayment: number;
  gdsRatio: number;
  tdsRatio: number;
  downPaymentPercent: number;
  loanToValue: number;
  cmhcPremium: number;
  needsInsurance: boolean;
}

export default function AffordabilityCalculator() {
  const [annualIncome, setAnnualIncome] = useState(100000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(50000);
  const [propertyTax, setPropertyTax] = useState(400);
  const [heatingCosts, setHeatingCosts] = useState(150);
  const [condoFees, setCondoFees] = useState(0);
  const [stressRate, setStressRate] = useState(5.25);
  const [amortization, setAmortization] = useState(25);
  const [compareAmortization, setCompareAmortization] = useState(30);

  const calculateAffordability = (years: number): AffordabilityResult => {
    const monthlyIncome = annualIncome / 12;
    const monthlyRate = (stressRate / 100) / 12;
    const numPayments = years * 12;
    
    // Maximum housing costs (GDS 39%)
    const maxGDS = monthlyIncome * 0.39;
    
    // Maximum total debt (TDS 44%)
    const maxTDS = monthlyIncome * 0.44;
    
    // Available for mortgage (lower of GDS limit or TDS limit minus existing debts)
    const availableForMortgage = Math.min(
      maxGDS - propertyTax - heatingCosts - (condoFees * 0.5),
      maxTDS - monthlyDebts - propertyTax - heatingCosts - (condoFees * 0.5)
    );
    
    if (availableForMortgage <= 0) {
      return {
        maxHomePrice: 0,
        mortgageNeeded: 0,
        monthlyPayment: 0,
        gdsRatio: 0,
        tdsRatio: 0,
        downPaymentPercent: 0,
        loanToValue: 0,
        cmhcPremium: 0,
        needsInsurance: false,
      };
    }
    
    // Calculate max mortgage using PV formula
    const maxMortgage = availableForMortgage * 
      ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);
    
    const maxHomePrice = maxMortgage + downPayment;
    const mortgageNeeded = Math.max(0, maxMortgage);
    const loanToValue = maxHomePrice > 0 ? (mortgageNeeded / maxHomePrice) * 100 : 0;
    
    // CMHC Premium calculation
    let cmhcPremium = 0;
    if (loanToValue > 80) {
      const downPaymentPercent = 100 - loanToValue;
      if (downPaymentPercent < 10) {
        cmhcPremium = mortgageNeeded * 0.04; // 4%
      } else if (downPaymentPercent < 15) {
        cmhcPremium = mortgageNeeded * 0.031; // 3.10%
      } else {
        cmhcPremium = mortgageNeeded * 0.028; // 2.80%
      }
    }
    
    const totalMortgageWithInsurance = mortgageNeeded + cmhcPremium;
    const monthlyPaymentWithInsurance = totalMortgageWithInsurance * 
      (monthlyRate / (1 - Math.pow(1 + monthlyRate, -numPayments)));
    
    // Recalculate actual ratios with insurance
    const totalMonthlyHousing = monthlyPaymentWithInsurance + propertyTax + heatingCosts + (condoFees * 0.5);
    const totalMonthlyExpenses = totalMonthlyHousing + monthlyDebts;
    
    return {
      maxHomePrice: Math.floor(maxHomePrice),
      mortgageNeeded: Math.floor(mortgageNeeded),
      monthlyPayment: Math.floor(monthlyPaymentWithInsurance),
      gdsRatio: (totalMonthlyHousing / monthlyIncome) * 100,
      tdsRatio: (totalMonthlyExpenses / monthlyIncome) * 100,
      downPaymentPercent: 100 - loanToValue,
      loanToValue,
      cmhcPremium: Math.floor(cmhcPremium),
      needsInsurance: loanToValue > 80,
    };
  };

  const primaryResult = useMemo(() => calculateAffordability(amortization), 
    [annualIncome, monthlyDebts, downPayment, propertyTax, heatingCosts, condoFees, stressRate, amortization]);
  
  const compareResult = useMemo(() => calculateAffordability(compareAmortization),
    [annualIncome, monthlyDebts, downPayment, propertyTax, heatingCosts, condoFees, stressRate, compareAmortization]);

  const getAffordabilityLevel = (gds: number, tds: number) => {
    if (gds <= 32 && tds <= 40) return { level: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50" };
    if (gds <= 35 && tds <= 42) return { level: "Good", color: "text-emerald-500", bg: "bg-emerald-50" };
    if (gds <= 39 && tds <= 44) return { level: "Maximum", color: "text-amber-600", bg: "bg-amber-50" };
    return { level: "Overextended", color: "text-red-600", bg: "bg-red-50" };
  };

  const affordabilityStatus = getAffordabilityLevel(primaryResult.gdsRatio, primaryResult.tdsRatio);

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-4">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <div>
            <h2 className="text-xl font-bold">How Much Can I Afford?</h2>
            <p className="text-slate-300 text-sm">Based on Canadian GDS/TDS ratios and stress test rules</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-5">
            <div className="bg-white rounded-lg p-5 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">1</span>
                Your Income & Debts
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Annual Household Income
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                  </div>
                  <input
                    type="range"
                    min="40000"
                    max="300000"
                    step="5000"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="w-full mt-2 accent-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Monthly Debt Payments
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={monthlyDebts}
                      onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Car loans, credit cards, student loans</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">2</span>
                Down Payment & Mortgage
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Down Payment Available
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Stress Test Rate
                    </label>
                    <select
                      value={stressRate}
                      onChange={(e) => setStressRate(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value={5.25}>5.25% (Standard)</option>
                      <option value={6.0}>6.00% (Buffer)</option>
                      <option value={7.0}>7.00% (Conservative)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Amortization
                    </label>
                    <select
                      value={amortization}
                      onChange={(e) => setAmortization(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value={25}>25 years</option>
                      <option value={30}>30 years</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">3</span>
                Property Costs
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Property Tax</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={propertyTax}
                      onChange={(e) => setPropertyTax(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Heating</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={heatingCosts}
                      onChange={(e) => setHeatingCosts(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Condo Fees (if applicable)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={condoFees}
                    onChange={(e) => setCondoFees(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Only 50% counts towards GDS ratio</p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 shadow-lg">
              <div className="text-center mb-6">
                <p className="text-slate-300 text-sm uppercase tracking-wide mb-2">Maximum Home Price</p>
                <p className="text-5xl font-bold text-emerald-400">
                  ${primaryResult.maxHomePrice.toLocaleString()}
                </p>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mt-3 ${affordabilityStatus.bg}`}>
                  <span className={`font-medium ${affordabilityStatus.color}`}>{affordabilityStatus.level}</span>
                  <span className="text-slate-600">Affordability</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-700">
                <div>
                  <p className="text-slate-400 text-xs">GDS Ratio</p>
                  <p className={`text-lg font-bold ${primaryResult.gdsRatio <= 39 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {primaryResult.gdsRatio.toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500">Max: 39%</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">TDS Ratio</p>
                  <p className={`text-lg font-bold ${primaryResult.tdsRatio <= 44 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {primaryResult.tdsRatio.toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500">Max: 44%</p>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white rounded-lg p-5 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-4">Mortgage Breakdown</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Down Payment</span>
                  <span className="font-medium text-slate-900">${downPayment.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Down Payment %</span>
                  <span className="font-medium text-slate-900">{primaryResult.downPaymentPercent.toFixed(1)}%</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Mortgage Required</span>
                  <span className="font-medium text-slate-900">${primaryResult.mortgageNeeded.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Monthly Payment</span>
                  <span className="font-medium text-slate-900">${primaryResult.monthlyPayment.toLocaleString()}</span>
                </div>
                
                {primaryResult.needsInsurance && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">CMHC Premium</span>
                    <span className="font-medium text-amber-600">+${primaryResult.cmhcPremium.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-slate-700">Loan-to-Value</span>
                  <span className={`font-bold ${primaryResult.loanToValue > 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {primaryResult.loanToValue.toFixed(1)}%
                  </span>
                </div>
              </div>

              {primaryResult.needsInsurance && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-amber-800">CMHC Insurance Required</p>
                      <p className="text-xs text-amber-700 mt-1">
                        With less than 20% down, you'll pay ${primaryResult.cmhcPremium.toLocaleString()} in premiums 
                        (added to your mortgage balance).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!primaryResult.needsInsurance && downPayment >= 20000 && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-emerald-800">Conventional Mortgage</p>
                      <p className="text-xs text-emerald-700 mt-1">
                        With 20%+ down, you avoid CMHC premiums and get more flexibility!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Comparison Toggle */}
            <div className="bg-white rounded-lg p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-900">Compare Scenarios</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={compareAmortization === 30}
                    onChange={(e) => setCompareAmortization(e.target.checked ? 30 : 25)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-slate-600">Show 30-year option</span>
                </label>
              </div>
              
              {compareAmortization === 30 && compareResult.maxHomePrice > 0 && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-50 rounded">
                    <p className="font-medium text-slate-900">25 Years</p>
                    <p className="text-emerald-600 font-bold">${primaryResult.maxHomePrice.toLocaleString()}</p>
                    <p className="text-slate-500">${primaryResult.monthlyPayment.toLocaleString()}/mo</p>
                  </div>
                  <div className="p-3 bg-teal-50 rounded border border-teal-200">
                    <p className="font-medium text-slate-900">30 Years</p>
                    <p className="text-teal-600 font-bold">${compareResult.maxHomePrice.toLocaleString()}</p>
                    <p className="text-slate-500">${compareResult.monthlyPayment.toLocaleString()}/mo</p>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-slate-500 mt-3">
                💡 30-year amortization increases affordability by ~8% but costs more in interest over time.
              </p>
            </div>
          </div>
        </div>

        {/* Rules Info */}
        <div className="mt-6 p-4 bg-slate-100 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-2">How It Works</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div>
              <p className="font-medium text-slate-700 mb-1">GDS Ratio (39% max)</p>
              <p>Mortgage + Property Tax + Heating + 50% Condo Fees</p>
            </div>
            <div>
              <p className="font-medium text-slate-700 mb-1">TDS Ratio (44% max)</p>
              <p>All Housing Costs + Other Debt Payments</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            * Calculations use the mortgage stress test (current rate + 2% or 5.25%, whichever is higher). 
            Actual approval depends on credit score, employment history, and lender-specific criteria.
          </p>
        </div>
      </div>
    </div>
  );
}
