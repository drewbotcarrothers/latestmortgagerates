"use client";

import { useState, useMemo } from 'react';

interface ComparisonResult {
  currentLender: {
    monthlyPayment: number;
    totalInterest: number;
    totalCost: number;
  };
  newLender: {
    monthlyPayment: number;
    totalInterest: number;
    totalCost: number;
  };
  savings: {
    monthly: number;
    totalInterest: number;
    overTerm: number;
  };
}

export default function MortgageRenewalCalculator() {
  // Current mortgage details
  const [currentBalance, setCurrentBalance] = useState<number>(400000);
  const [currentRate, setCurrentRate] = useState<number>(4.89);
  const [timeRemaining, setTimeRemaining] = useState<number>(20); // years
  const [paymentFrequency, setPaymentFrequency] = useState<string>('monthly');
  
  // Renewal details
  const [renewalRate, setRenewalRate] = useState<number>(3.64);
  const [renewalTerm, setRenewalTerm] = useState<number>(5); // years
  const [switchingCosts, setSwitchingCosts] = useState<number>(500); // appraisal, legal, etc
  const [currentLenderSwitch, setCurrentLenderSwitch] = useState<number>(0); // can be $0

  const calculateMortgage = (
    principal: number,
    annualRate: number,
    yearsRemaining: number,
    amortizationYears: number
  ) => {
    const monthlyRate = annualRate / 100 / 12;
    const totalPayments = amortizationYears * 12;
    const paymentsMade = (amortizationYears - yearsRemaining) * 12;
    const remainingPayments = yearsRemaining * 12;
    
    // Calculate monthly payment based on original amortization
    const monthlyPayment = principal * (
      (monthlyRate * Math.pow(1 + monthlyRate, remainingPayments)) /
      (Math.pow(1 + monthlyRate, remainingPayments) - 1)
    );
    
    const totalCost = monthlyPayment * remainingPayments;
    const totalInterest = totalCost - principal;
    
    return { monthlyPayment, totalInterest, totalCost };
  };

  const results = useMemo<ComparisonResult>(() => {
    // Current lender renewal (often at posted rate)
    const currentLender = calculateMortgage(
      currentBalance,
      currentRate,
      renewalTerm,
      timeRemaining
    );
    
    // New lender (competitive rate)
    const newLender = calculateMortgage(
      currentBalance,
      renewalRate,
      renewalTerm,
      timeRemaining
    );
    
    const monthlySavings = currentLender.monthlyPayment - newLender.monthlyPayment;
    const totalInterestSavings = currentLender.totalInterest - newLender.totalInterest;
    const savingsOverTerm = (monthlySavings * 12 * renewalTerm) - switchingCosts;
    
    return {
      currentLender,
      newLender,
      savings: {
        monthly: monthlySavings,
        totalInterest: totalInterestSavings,
        overTerm: savingsOverTerm
      }
    };
  }, [currentBalance, currentRate, renewalRate, renewalTerm, timeRemaining, switchingCosts]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="card-default overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-6">
        <h2 className="text-2xl font-bold">Mortgage Renewal Calculator</h2>
        <p className="text-teal-100 mt-1">
          Compare staying with your current lender vs shopping for a better rate
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Input Section */}
        <div className="p-6 border-r border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold">1</span>
            Your Current Mortgage
          </h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Current Mortgage Balance
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input
                  type="number"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="400000"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Amount remaining on your mortgage</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Current Interest Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={currentRate}
                  onChange={(e) => setCurrentRate(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="4.89"
                />
                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-500">%</span>
              </div>
              <p className="text-sm text-amber-600 mt-1">
                ⚠️ Posted rates are often higher than market rates
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Years Remaining on Amortization
              </label>
              <select
                value={timeRemaining}
                onChange={(e) => setTimeRemaining(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                {[5, 10, 15, 20, 25].map(years => (
                  <option key={years} value={years}>{years} years</option>
                ))}
              </select>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold">2</span>
            Renewal Options
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Available Market Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={renewalRate}
                  onChange={(e) => setRenewalRate(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="3.64"
                />
                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-500">%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Current best rate you could qualify for</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Renewal Term
              </label>
              <select
                value={renewalTerm}
                onChange={(e) => setRenewalTerm(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value={1}>1 Year</option>
                <option value={2}>2 Years</option>
                <option value={3}>3 Years</option>
                <option value={4}>4 Years</option>
                <option value={5}>5 Years</option>
                <option value={7}>7 Years</option>
                <option value={10}>10 Years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Switching Costs (if changing lenders)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input
                  type="number"
                  value={switchingCosts}
                  onChange={(e) => setSwitchingCosts(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Appraisal ($300-400) + Legal ($800-1000) - often covered by new lender
              </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Comparison Results</h3>
          
          {/* Side-by-side comparison */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
              <h4 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Current Lender
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">Rate</p>
                  <p className="text-lg font-bold text-slate-800">{currentRate.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Monthly Payment</p>
                  <p className="text-lg font-bold text-slate-800">{formatCurrency(results.currentLender.monthlyPayment)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Interest ({renewalTerm}y)</p>
                  <p className="text-lg font-bold text-red-600">{formatCurrency(results.currentLender.totalInterest)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-emerald-200">
              <h4 className="font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                New Lender
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">Rate</p>
                  <p className="text-lg font-bold text-emerald-600">{renewalRate.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Monthly Payment</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(results.newLender.monthlyPayment)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Interest ({renewalTerm}y)</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(results.newLender.totalInterest)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Summary */}
          <div className="bg-emerald-600 text-white rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Your Potential Savings
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{formatCurrency(results.savings.monthly)}</p>
                <p className="text-emerald-100 text-sm">/month</p>
              </div>
              <div className="text-center border-x border-emerald-500">
                <p className="text-3xl font-bold">{formatCurrency(results.savings.totalInterest)}</p>
                <p className="text-emerald-100 text-sm">interest saved</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{formatCurrency(results.savings.overTerm)}</p>
                <p className="text-emerald-100 text-sm">total ({renewalTerm}-yr)</p>
              </div>
            </div>
          </div>

          {/* Break-even analysis */}
          <div className="bg-white rounded-lg p-4 border border-slate-200 mb-4">
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Break-even Analysis
            </h4>
            {results.savings.monthly > 0 ? (
              <>
                <p className="text-sm text-slate-600">
                  With switching costs of {formatCurrency(switchingCosts)}, you'll break even in{' '}
                  <span className="font-bold text-teal-600">
                    {Math.ceil(switchingCosts / results.savings.monthly)} months
                  </span>
                </p>
                <div className="mt-3 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-teal-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (switchingCosts / (results.savings.monthly * 12 * renewalTerm)) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {results.savings.overTerm > 0 
                    ? '✅ Switching saves you money despite the costs'
                    : '❌ Switching costs exceed savings - consider negotiating with current lender'}
                </p>
              </>
            ) : (
              <p className="text-sm text-amber-600">
                The market rate is higher than your current rate. Staying with your current lender is better.
              </p>
            )}
          </div>

          {/* Action Items */}
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Recommended Actions
            </h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Shop your renewal 4-6 months before it expires</li>
              <li>• Get quotes from at least 3-5 lenders</li>
              <li>• Ask your current lender to match the best rate</li>
              <li>• Consider a mortgage broker for access to monoline rates</li>
              <li>• Review prepayment privileges and portability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
