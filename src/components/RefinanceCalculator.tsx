"use client";

import { useState, useMemo } from "react";

interface RefinanceParams {
  currentBalance: number;
  currentRate: number;
  currentTermRemaining: number;
  newRate: number;
  newTerm: number;
  penaltyType: 'three_month' | 'ird';
  postedRate: number;
  closingCosts: number;
}

interface RefinanceResult {
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
  worthIt: boolean;
}

export default function RefinanceCalculator() {
  const [params, setParams] = useState<RefinanceParams>({
    currentBalance: 400000,
    currentRate: 5.5,
    currentTermRemaining: 3,
    newRate: 4.2,
    newTerm: 5,
    penaltyType: 'ird',
    postedRate: 6.5,
    closingCosts: 2000,
  });

  const results = useMemo((): RefinanceResult => {
    const monthlyRateCurrent = params.currentRate / 100 / 12;
    const monthlyRateNew = params.newRate / 100 / 12;
    const monthsRemaining = params.currentTermRemaining * 12;
    const newTermMonths = params.newTerm * 12;
    
    // Calculate current monthly payment (assuming original 25-year amortization)
    const originalAmortizationMonths = 25 * 12;
    const currentMonthlyPayment = params.currentBalance * 
      (monthlyRateCurrent * Math.pow(1 + monthlyRateCurrent, originalAmortizationMonths)) /
      (Math.pow(1 + monthlyRateCurrent, originalAmortizationMonths) - 1);
    
    // Calculate new monthly payment
    const newMonthlyPayment = params.currentBalance * 
      (monthlyRateNew * Math.pow(1 + monthlyRateNew, newTermMonths)) /
      (Math.pow(1 + monthlyRateNew, newTermMonths) - 1);
    
    const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
    
    // Calculate penalty
    let penaltyAmount = 0;
    if (params.penaltyType === 'three_month') {
      penaltyAmount = currentMonthlyPayment * 3;
    } else {
      // IRD calculation (simplified)
      const rateDiff = params.postedRate - params.currentRate;
      const monthsLeft = monthsRemaining;
      penaltyAmount = params.currentBalance * (rateDiff / 100) * (monthsLeft / 12);
      penaltyAmount = Math.max(penaltyAmount, currentMonthlyPayment * 3); // Minimum 3 months
    }
    
    // Total cost to refinance
    const totalCost = penaltyAmount + params.closingCosts;
    
    // Break-even
    const breakEvenMonths = monthlySavings > 0 
      ? Math.ceil(totalCost / monthlySavings) 
      : Infinity;
    
    // Calculate remaining interest under current mortgage
    let remainingInterestCurrent = 0;
    let balance = params.currentBalance;
    for (let i = 0; i < monthsRemaining; i++) {
      const interest = balance * monthlyRateCurrent;
      const principal = currentMonthlyPayment - interest;
      remainingInterestCurrent += interest;
      balance -= principal;
      if (balance <= 0) break;
    }
    
    // Calculate interest under new mortgage
    let remainingInterestNew = 0;
    balance = params.currentBalance;
    for (let i = 0; i < newTermMonths; i++) {
      const interest = balance * monthlyRateNew;
      const principal = newMonthlyPayment - interest;
      remainingInterestNew += interest;
      balance -= principal;
      if (balance <= 0) break;
    }
    
    const interestSavings = remainingInterestCurrent - remainingInterestNew;
    const totalSavings = interestSavings - totalCost;
    const worthIt = totalSavings > 0 && breakEvenMonths <= 24; // Worth it if break-even within 2 years
    
    return {
      currentMonthlyPayment: Math.round(currentMonthlyPayment),
      newMonthlyPayment: Math.round(newMonthlyPayment),
      monthlySavings: Math.round(monthlySavings),
      penaltyAmount: Math.round(penaltyAmount),
      totalCost: Math.round(totalCost),
      breakEvenMonths: breakEvenMonths === Infinity ? 0 : breakEvenMonths,
      totalSavings: Math.round(totalSavings),
      remainingInterestCurrent: Math.round(remainingInterestCurrent),
      remainingInterestNew: Math.round(remainingInterestNew),
      interestSavings: Math.round(interestSavings),
      worthIt,
    };
  }, [params]);

  const formatCurrency = (value: number) => 
    `$${value.toLocaleString('en-CA', { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Mortgage */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-sm">📋</span>
              Current Mortgage
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Remaining Balance</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.currentBalance}
                    onChange={(e) => setParams({ ...params, currentBalance: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    step="10000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Interest Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    value={params.currentRate}
                    onChange={(e) => setParams({ ...params, currentRate: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Term Remaining</label>
                <select
                  value={params.currentTermRemaining}
                  onChange={(e) => setParams({ ...params, currentTermRemaining: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value={1}>1 year</option>
                  <option value={2}>2 years</option>
                  <option value={3}>3 years</option>
                  <option value={4}>4 years</option>
                  <option value={5}>5 years</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-sm">💰</span>
              Penalty Estimate
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Penalty Type</label>
                <select
                  value={params.penaltyType}
                  onChange={(e) => setParams({ ...params, penaltyType: e.target.value as 'three_month' | 'ird' })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="three_month">3 Months Interest</option>
                  <option value="ird">Interest Rate Differential (IRD)</option>
                </select>
              </div>
              
              {params.penaltyType === 'ird' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Posted Rate</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={params.postedRate}
                      onChange={(e) => setParams({ ...params, postedRate: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      step="0.01"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Your lender's current posted rate for similar term</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Closing Costs</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.closingCosts}
                    onChange={(e) => setParams({ ...params, closingCosts: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    step="100"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Legal fees, appraisal, etc.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* New Mortgage */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-sm">✨</span>
              New Mortgage
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Interest Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    value={params.newRate}
                    onChange={(e) => setParams({ ...params, newRate: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Term</label>
                <select
                  value={params.newTerm}
                  onChange={(e) => setParams({ ...params, newTerm: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value={1}>1 year</option>
                  <option value={2}>2 years</option>
                  <option value={3}>3 years</option>
                  <option value={4}>4 years</option>
                  <option value={5}>5 years</option>
                  <option value={7}>7 years</option>
                  <option value={10}>10 years</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Quick Summary */}
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <h4 className="font-semibold text-emerald-900 mb-3">Current Best Rates</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-emerald-700">5-Year Fixed</span>
                <span className="font-bold text-emerald-900">~3.64%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">5-Year Variable</span>
                <span className="font-bold text-emerald-900">~3.40%</span>
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-3">
              Rates as of March 2026. Check current rates for accurate calculations.
            </p>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="mt-8">
        <div className={`rounded-2xl p-6 ${
          results.worthIt 
            ? 'bg-emerald-50 border-2 border-emerald-200' 
            : 'bg-amber-50 border-2 border-amber-200'
        }`}>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {results.worthIt ? '✅ Refinancing Makes Sense' : '⚠️ Consider Carefully'}
            </h3>
            <p className="text-slate-600">
              {results.worthIt 
                ? `You'll save ${formatCurrency(results.totalSavings)} over the new term`
                : `Break-even is ${results.breakEvenMonths} months - longer than your remaining term`
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <p className="text-sm text-slate-600 mb-1">Monthly Savings</p>
              <p className={`text-2xl font-bold ${
                results.monthlySavings > 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {results.monthlySavings > 0 ? '+' : ''}{formatCurrency(results.monthlySavings)}
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <p className="text-sm text-slate-600 mb-1">Break-Even</p>
              <p className="text-2xl font-bold text-slate-900">
                {results.breakEvenMonths > 0 ? `${results.breakEvenMonths} months` : 'N/A'}
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <p className="text-sm text-slate-600 mb-1">Total Savings</p>
              <p className={`text-2xl font-bold ${
                results.totalSavings > 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {formatCurrency(results.totalSavings)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold text-slate-900 mb-3">Cost Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Penalty</span>
                  <span className="font-medium text-red-600">{formatCurrency(results.penaltyAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Closing Costs</span>
                  <span className="font-medium">{formatCurrency(params.closingCosts)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-900 font-medium">Total Cost</span>
                  <span className="font-bold text-red-600">{formatCurrency(results.totalCost)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold text-slate-900 mb-3">Interest Comparison</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Current (remaining)</span>
                  <span className="font-medium">{formatCurrency(results.remainingInterestCurrent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">New (full term)</span>
                  <span className="font-medium">{formatCurrency(results.remainingInterestNew)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-900 font-medium">Interest Savings</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(results.interestSavings)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
