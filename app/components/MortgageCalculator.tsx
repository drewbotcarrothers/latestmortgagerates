"use client";

import { useState, useMemo } from "react";

export default function MortgageCalculator() {
  const [mortgageAmount, setMortgageAmount] = useState<number>(500000);
  const [rate, setRate] = useState<number>(4.5);
  const [amortizationYears, setAmortizationYears] = useState<number>(25);
  const [termYears, setTermYears] = useState<number>(5);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);

  const calculateAmortization = () => {
    const principal = mortgageAmount;
    const monthlyRate = rate / 100 / 12;
    const totalPayments = amortizationYears * 12;

    // Monthly payment
    const monthlyPayment = 
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    // Term payments
    const termPayments = termYears * 12;
    
    // Calculate remaining balance after term
    let balance = principal;
    let totalInterestPaid = 0;
    
    for (let i = 0; i < termPayments; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      totalInterestPaid += interestPayment;
    }

    const totalPaid = monthlyPayment * termPayments;
    const principalPaid = totalPaid - totalInterestPaid;

    return {
      monthlyPayment,
      totalInterestPaid,
      totalPaid,
      principalPaid,
      remainingBalance: balance,
      termPayments,
    };
  };

  const results = useMemo(() => calculateAmortization(), [mortgageAmount, rate, amortizationYears, termYears]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Mortgage Calculator</h2>
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          {showCalculator ? "Hide Calculator" : "Show Calculator"}
        </button>
      </div>

      {showCalculator && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mortgage Amount ($)
              </label>
              <input
                type="number"
                value={mortgageAmount}
                onChange={(e) => setMortgageAmount(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="10000"
                step="10000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (%)
              </label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0.1"
                max="20"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amortization (years)
              </label>
              <select
                value={amortizationYears}
                onChange={(e) => setAmortizationYears(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="5">5 years</option>
                <option value="10">10 years</option>
                <option value="15">15 years</option>
                <option value="20">20 years</option>
                <option value="25">25 years</option>
                <option value="30">30 years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Term (years)
              </label>
              <select
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5">5 years</option>
                <option value="7">7 years</option>
                <option value="10">10 years</option>
              </select>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 mb-1">Monthly Payment</div>
              <div className="text-4xl font-bold text-blue-600">
                ${results.monthlyPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Total Paid ({termYears}yr)</div>
                <div className="text-xl font-semibold text-gray-900">
                  ${results.totalPaid.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Principal Paid</div>
                <div className="text-xl font-semibold text-green-600">
                  ${results.principalPaid.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Interest Paid</div>
                <div className="text-xl font-semibold text-red-600">
                  ${results.totalInterestPaid.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Remaining Balance</div>
                <div className="text-xl font-semibold text-gray-900">
                  ${results.remainingBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              This is an estimate. Actual payments may vary based on lender fees, insurance, and other factors.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
