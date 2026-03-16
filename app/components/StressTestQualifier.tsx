"use client";

import { useState, useMemo } from "react";

interface StressTestParams {
  annualIncome: number;
  coApplicantIncome: number;
  monthlyDebts: number;
  propertyTax: number;
  heating: number;
  condoFees: number;
  mortgageAmount: number;
  contractRate: number;
  amortization: number;
}

interface StressTestResult {
  stressTestRate: number;
  monthlyPayment: number;
  gds: number;
  tds: number;
  qualifies: boolean;
  maxGds: number;
  maxTds: number;
  gdsGap: number;
  tdsGap: number;
  maxMortgage: number;
  incomeNeeded: number;
}

export default function StressTestQualifier() {
  const [params, setParams] = useState<StressTestParams>({
    annualIncome: 80000,
    coApplicantIncome: 0,
    monthlyDebts: 500,
    propertyTax: 300,
    heating: 100,
    condoFees: 0,
    mortgageAmount: 400000,
    contractRate: 4.5,
    amortization: 25,
  });

  const formatCurrency = (value: number) => 
    `$${value.toLocaleString('en-CA', { maximumFractionDigits: 0 })}`;

  const results = useMemo((): StressTestResult => {
    // Bank of Canada benchmark rate (as of 2026)
    const benchmarkRate = 5.25;
    
    // Stress test rate is the higher of: benchmark rate OR contract rate + 2%
    const contractPlusTwo = params.contractRate + 2;
    const stressTestRate = Math.max(benchmarkRate, contractPlusTwo);
    
    // Calculate monthly payment at stress test rate
    const monthlyRate = stressTestRate / 100 / 12;
    const numPayments = params.amortization * 12;
    const monthlyPayment = params.mortgageAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    // Total monthly housing costs
    const monthlyHousing = monthlyPayment + params.propertyTax + params.heating + params.condoFees;
    
    // Total monthly debt obligations
    const monthlyDebtTotal = monthlyHousing + params.monthlyDebts;
    
    // Total annual income
    const totalIncome = params.annualIncome + params.coApplicantIncome;
    const monthlyIncome = totalIncome / 12;
    
    // Calculate ratios
    const gds = (monthlyHousing / monthlyIncome) * 100;
    const tds = (monthlyDebtTotal / monthlyIncome) * 100;
    
    // Maximum ratios (standard Canadian guidelines)
    const maxGds = 39;
    const maxTds = 44;
    
    // Check qualification
    const qualifies = gds <= maxGds && tds <= maxTds;
    
    // Calculate gaps
    const gdsGap = maxGds - gds;
    const tdsGap = maxTds - tds;
    
    // Calculate maximum mortgage they could qualify for
    // Working backwards from max GDS
    const maxMonthlyHousing = monthlyIncome * (maxGds / 100);
    const maxMonthlyPayment = maxMonthlyHousing - params.propertyTax - params.heating - params.condoFees;
    
    // Calculate max mortgage using stress test rate
    let maxMortgage = 0;
    if (maxMonthlyPayment > 0) {
      maxMortgage = maxMonthlyPayment * 
        (Math.pow(1 + monthlyRate, numPayments) - 1) /
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
    }
    
    // Calculate income needed for current mortgage
    const minMonthlyIncome = monthlyDebtTotal / (maxTds / 100);
    const incomeNeeded = minMonthlyIncome * 12;
    
    return {
      stressTestRate: Math.round(stressTestRate * 100) / 100,
      monthlyPayment: Math.round(monthlyPayment),
      gds: Math.round(gds * 10) / 10,
      tds: Math.round(tds * 10) / 10,
      qualifies,
      maxGds,
      maxTds,
      gdsGap: Math.round(gdsGap * 10) / 10,
      tdsGap: Math.round(tdsGap * 10) / 10,
      maxMortgage: Math.round(maxMortgage),
      incomeNeeded: Math.round(incomeNeeded),
    };
  }, [params]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Income & Debts */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">💰</span>
              Income
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Annual Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.annualIncome}
                    onChange={(e) => setParams({ ...params, annualIncome: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    step="1000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Co-Applicant Income (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.coApplicantIncome}
                    onChange={(e) => setParams({ ...params, coApplicantIncome: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    step="1000"
                  />
                </div>
              </div>
              
              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Annual Income</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(params.annualIncome + params.coApplicantIncome)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-sm">📊</span>
              Monthly Debt Payments
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Car Loans, Credit Cards, etc.</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.monthlyDebts}
                    onChange={(e) => setParams({ ...params, monthlyDebts: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    step="50"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Exclude rent/mortgage payments</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Property & Mortgage */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">🏠</span>
              Property Costs
            </h3>
            
            <div className="space-y-4">
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Heating</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={params.heating}
                      onChange={(e) => setParams({ ...params, heating: Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Condo Fees (if applicable)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.condoFees}
                    onChange={(e) => setParams({ ...params, condoFees: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm">🏦</span>
              Mortgage Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mortgage Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.mortgageAmount}
                    onChange={(e) => setParams({ ...params, mortgageAmount: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    step="10000"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contract Rate</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={params.contractRate}
                      onChange={(e) => setParams({ ...params, contractRate: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      step="0.01"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amortization</label>
                  <select
                    value={params.amortization}
                    onChange={(e) => setParams({ ...params, amortization: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value={25}>25 years</option>
                    <option value={30}>30 years</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="mt-8">
        <div className={`rounded-2xl p-6 ${
          results.qualifies 
            ? 'bg-emerald-50 border-2 border-emerald-200' 
            : 'bg-red-50 border-2 border-red-200'
        }`}>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {results.qualifies ? '✅ You Qualify!' : '❌ Does Not Qualify'}
            </h3>
            
            <div className="flex justify-center gap-4 mt-4">
              <div className="text-center">
                <p className="text-sm text-slate-600">Stress Test Rate</p>
                <p className="text-2xl font-bold text-slate-900">{results.stressTestRate}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-600">Monthly Payment</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(results.monthlyPayment)}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className={`bg-white rounded-xl p-4 shadow-sm ${
              results.gds <= results.maxGds ? 'border-l-4 border-emerald-500' : 'border-l-4 border-red-500'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-900">GDS Ratio</span>
                <span className={`text-lg font-bold ${
                  results.gds <= results.maxGds ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {results.gds}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    results.gds <= results.maxGds ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(results.gds / results.maxGds * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Max: {results.maxGds}% | {results.gdsGap >= 0 ? '+' : ''}{results.gdsGap}%
              </p>
            </div>
            
            <div className={`bg-white rounded-xl p-4 shadow-sm ${
              results.tds <= results.maxTds ? 'border-l-4 border-emerald-500' : 'border-l-4 border-red-500'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-900">TDS Ratio</span>
                <span className={`text-lg font-bold ${
                  results.tds <= results.maxTds ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {results.tds}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    results.tds <= results.maxTds ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(results.tds / results.maxTds * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Max: {results.maxTds}% | {results.tdsGap >= 0 ? '+' : ''}{results.tdsGap}%
              </p>
            </div>
          </div>
          
          {!results.qualifies && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold text-slate-900 mb-3">To Qualify, You Need:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">More Annual Income</span>
                  <span className="font-medium">{formatCurrency(results.incomeNeeded)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Or Reduce Mortgage To</span>
                  <span className="font-medium">{formatCurrency(results.maxMortgage)}</span>
                </div>
              </div>            
            </div>
          )}
        </div>
        
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2">ℹ️ About the Stress Test</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• You must qualify at the higher of: 5.25% OR your contract rate + 2%</li>
            <li>• GDS (Gross Debt Service): Housing costs should be ≤ 39% of income</li>
            <li>• TDS (Total Debt Service): All debts should be ≤ 44% of income</li>
            <li>• Some lenders may have stricter requirements</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
