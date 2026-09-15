"use client";

import { useState, useMemo } from "react";

interface PenaltyParams {
  mortgageBalance: number;
  currentRate: number;
  mortgageType: 'fixed' | 'variable';
  monthsRemaining: number;
  originalTerm: number;
  postedRate: number;
  lenderType: 'bank' | 'monoline';
}

interface PenaltyResult {
  threeMonthInterest: number;
  irdAmount: number;
  finalPenalty: number;
  penaltyType: string;
  monthlyPayment: number;
  explanation: string;
}

export default function MortgagePenaltyCalculator() {
  const [params, setParams] = useState<PenaltyParams>({
    mortgageBalance: 400000,
    currentRate: 5.5,
    mortgageType: 'fixed',
    monthsRemaining: 24,
    originalTerm: 60,
    postedRate: 6.5,
    lenderType: 'bank',
  });

  const formatCurrency = (value: number) => 
    `$${value.toLocaleString('en-CA', { maximumFractionDigits: 0 })}`;

  const results = useMemo((): PenaltyResult => {
    const monthlyRate = params.currentRate / 100 / 12;
    
    // Calculate monthly payment (assuming 25-year amortization)
    const amortizationMonths = 25 * 12;
    const monthlyPayment = params.mortgageBalance * 
      (monthlyRate * Math.pow(1 + monthlyRate, amortizationMonths)) /
      (Math.pow(1 + monthlyRate, amortizationMonths) - 1);
    
    // Calculate 3 months interest
    const threeMonthInterest = monthlyPayment * 3;
    
    // Calculate IRD
    // IRD = (Current Rate - Posted Rate for similar term) x Balance x (Months Remaining / 12)
    let irdAmount = 0;
    
    if (params.mortgageType === 'fixed') {
      // Determine comparable term based on months remaining
      let comparableTerm = 5;
      if (params.monthsRemaining <= 12) comparableTerm = 1;
      else if (params.monthsRemaining <= 24) comparableTerm = 2;
      else if (params.monthsRemaining <= 36) comparableTerm = 3;
      else if (params.monthsRemaining <= 48) comparableTerm = 4;
      
      // Calculate rate differential
      const rateDifferential = params.currentRate - params.postedRate;
      
      if (rateDifferential > 0) {
        // Standard IRD calculation
        irdAmount = params.mortgageBalance * (rateDifferential / 100) * (params.monthsRemaining / 12);
        
        // Big banks often use a more punitive formula (posted rate at discount)
        if (params.lenderType === 'bank') {
          // This is a simplified version - banks often use complex formulas
          // that compare to their posted rates at time of origination
          irdAmount = Math.max(irdAmount, threeMonthInterest * 2);
        }
      }
    }
    
    // Final penalty is the greater of 3 months interest or IRD
    const finalPenalty = Math.max(threeMonthInterest, irdAmount);
    
    let penaltyType = '3 Months Interest';
    let explanation = '';
    
    if (params.mortgageType === 'variable') {
      penaltyType = '3 Months Interest';
      explanation = 'Variable rate mortgages typically charge 3 months interest as a penalty.';
    } else if (irdAmount > threeMonthInterest) {
      penaltyType = 'Interest Rate Differential (IRD)';
      explanation = `Your IRD (${formatCurrency(irdAmount)}) is higher than 3 months interest (${formatCurrency(threeMonthInterest)}).`;
    } else {
      penaltyType = '3 Months Interest';
      explanation = `3 months interest (${formatCurrency(threeMonthInterest)}) is higher than your IRD (${formatCurrency(irdAmount)}).`;
    }
    
    return {
      threeMonthInterest: Math.round(threeMonthInterest),
      irdAmount: Math.round(irdAmount),
      finalPenalty: Math.round(finalPenalty),
      penaltyType,
      monthlyPayment: Math.round(monthlyPayment),
      explanation,
    };
  }, [params]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-sm">🏠</span>
              Mortgage Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Balance</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.mortgageBalance}
                    onChange={(e) => setParams({ ...params, mortgageBalance: Number(e.target.value) })}
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Mortgage Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setParams({ ...params, mortgageType: 'fixed' })}
                    className={`px-4 py-2 rounded-lg border transition ${
                      params.mortgageType === 'fixed'
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-teal-300'
                    }`}
                  >
                    Fixed Rate
                  </button>
                  <button
                    onClick={() => setParams({ ...params, mortgageType: 'variable' })}
                    className={`px-4 py-2 rounded-lg border transition ${
                      params.mortgageType === 'variable'
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-teal-300'
                    }`}
                  >
                    Variable Rate
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-sm">⏱️</span>
              Term Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Months Remaining</label>
                <select
                  value={params.monthsRemaining}
                  onChange={(e) => setParams({ ...params, monthsRemaining: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value={6}>6 months</option>
                  <option value={12}>1 year</option>
                  <option value={18}>1.5 years</option>
                  <option value={24}>2 years</option>
                  <option value={30}>2.5 years</option>
                  <option value={36}>3 years</option>
                  <option value={48}>4 years</option>
                  <option value={60}>5 years</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Original Term</label>
                <select
                  value={params.originalTerm}
                  onChange={(e) => setParams({ ...params, originalTerm: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value={12}>1 year</option>
                  <option value={24}>2 years</option>
                  <option value={36}>3 years</option>
                  <option value={48}>4 years</option>
                  <option value={60}>5 years</option>
                  <option value={84}>7 years</option>
                  <option value={120}>10 years</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - IRD Details */}
        <div className="space-y-6">
          {params.mortgageType === 'fixed' && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-sm">📊</span>
                IRD Calculation (Fixed Rate)
              </h3>
              
              <div className="space-y-4">
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
                  <p className="text-xs text-slate-500 mt-1">
                    Your lender's current posted rate for a similar term
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lender Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setParams({ ...params, lenderType: 'bank' })}
                      className={`px-4 py-2 rounded-lg border transition ${
                        params.lenderType === 'bank'
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-teal-300'
                      }`}
                    >
                      Big Bank
                    </button>
                    <button
                      onClick={() => setParams({ ...params, lenderType: 'monoline' })}
                      className={`px-4 py-2 rounded-lg border transition ${
                        params.lenderType === 'monoline'
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-teal-300'
                      }`}
                    >
                      Monoline
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Big banks often use more punitive IRD formulas
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-2">💡 About Penalties</h4>
            <ul className="space-y-2 text-sm text-amber-800">
              <li>• <strong>3 Months Interest:</strong> Standard for variable rates</li>
              <li>• <strong>IRD:</strong> Often applies to fixed rates</li>
              <li>• <strong>Big Banks:</strong> May use posted rate at origination (higher penalty)</li>
              <li>• <strong>Monolines:</strong> Often use fairer IRD calculations</li>
              <li>• <strong>Porting:</strong> May avoid penalty when buying new home</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="mt-8">
        <div className="bg-slate-900 text-white rounded-2xl p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Estimated Penalty</h3>
            <p className="text-5xl font-bold text-red-400">{formatCurrency(results.finalPenalty)}</p>
            <p className="text-slate-400 mt-2">{results.penaltyType}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-slate-300 mb-1">3 Months Interest</p>
              <p className="text-xl font-bold">{formatCurrency(results.threeMonthInterest)}</p>
              <p className="text-xs text-slate-400">Based on your monthly payment</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-slate-300 mb-1">IRD Amount</p>
              <p className="text-xl font-bold">{formatCurrency(results.irdAmount)}</p>
              <p className="text-xs text-slate-400">
                {params.mortgageType === 'variable' ? 'N/A for variable rates' : 'Interest Rate Differential'}
              </p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-slate-300">{results.explanation}</p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Monthly Payment</span>
              <span className="text-xl font-bold">{formatCurrency(results.monthlyPayment)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-teal-50 border border-teal-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2">⚠️ Important Notes</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• This is an estimate. Contact your lender for exact penalty amount.</li>
            <li>• Some lenders use different IRD calculation methods.</li>
            <li>• Prepayment privileges may reduce your penalty.</li>
            <li>• Porting your mortgage to a new property may avoid penalties.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
