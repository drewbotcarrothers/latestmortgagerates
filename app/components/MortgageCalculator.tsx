"use client";

import { useState, useMemo } from "react";

// Type Definitions
type PaymentFrequency = "monthly" | "bi-weekly" | "weekly" | "accelerated-bi-weekly" | "accelerated-weekly";
type ScheduleView = "yearly" | "monthly";

interface MortgageParams {
  mortgageAmount: number;
  rate: number;
  amortizationYears: number;
  termYears: number;
  paymentFrequency: PaymentFrequency;
  annualLumpSum: number;
  monthlyIncreasePercent: number;
}

interface PaymentResult {
  regularPayment: number;
  actualPayment: number;
  totalPayments: number;
  totalInterestPaid: number;
  totalPaid: number;
  principalPaid: number;
  remainingBalance: number;
  interestSavings: number;
  payoffYears: number;
  schedule: AmortizationEntry[];
}

interface AmortizationEntry {
  period: number;
  payment: number;
  principalPayment: number;
  interestPayment: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

interface YearlySummary {
  year: number;
  payments: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
}

// Tooltip Component
function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-help"
      >
        {children}
        <span className="ml-1 text-gray-400 hover:text-gray-600">ⓘ</span>
      </div>
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-50 max-w-xs text-center">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
}

// Input Field Component with Tooltip
function InputField({
  label,
  tooltip,
  value,
  onChange,
  type = "number",
  min,
  max,
  step,
  suffix,
  prefix,
}: {
  label: string;
  tooltip: string;
  value: number | string;
  onChange: (value: number) => void;
  type?: "number" | "select";
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  prefix?: string;
  options?: { value: string | number; label: string }[];
}) {
  return (
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
        <Tooltip text={tooltip}>{label}</Tooltip>
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
            prefix ? "pl-8" : ""
          } ${suffix ? "pr-8" : ""}`}
          min={min}
          max={max}
          step={step}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function SelectField({
  label,
  tooltip,
  value,
  onChange,
  options,
}: {
  label: string;
  tooltip: string;
  value: string | number;
  onChange: (value: any) => void;
  options: { value: string | number; label: string }[];
}) {
  return (
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
        <Tooltip text={tooltip}>{label}</Tooltip>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Calculate payment based on frequency
function calculatePaymentFromMonthly(monthlyPayment: number, frequency: PaymentFrequency): number {
  switch (frequency) {
    case "monthly":
      return monthlyPayment;
    case "bi-weekly":
      return (monthlyPayment * 12) / 26;
    case "weekly":
      return (monthlyPayment * 12) / 52;
    case "accelerated-bi-weekly":
      return monthlyPayment / 2;
    case "accelerated-weekly":
      return monthlyPayment / 4;
    default:
      return monthlyPayment;
  }
}

function getPaymentsPerYear(frequency: PaymentFrequency): number {
  switch (frequency) {
    case "monthly":
      return 12;
    case "bi-weekly":
    case "accelerated-bi-weekly":
      return 26;
    case "weekly":
    case "accelerated-weekly":
      return 52;
    default:
      return 12;
  }
}

function getPaymentLabel(frequency: PaymentFrequency): string {
  switch (frequency) {
    case "monthly":
      return "Monthly";
    case "bi-weekly":
      return "Bi-Weekly";
    case "weekly":
      return "Weekly";
    case "accelerated-bi-weekly":
      return "Accelerated Bi-Weekly";
    case "accelerated-weekly":
      return "Accelerated Weekly";
    default:
      return "Monthly";
  }
}

// Main Mortgage Calculation Function
function calculateMortgage(params: MortgageParams): PaymentResult {
  const { mortgageAmount, rate, amortizationYears, termYears, paymentFrequency, annualLumpSum, monthlyIncreasePercent } = params;
  
  const monthlyRate = rate / 100 / 12;
  const paymentsPerYear = getPaymentsPerYear(paymentFrequency);
  const periodRate = rate / 100 / paymentsPerYear;
  const totalPayments = amortizationYears * paymentsPerYear;
  
  // Calculate base monthly payment using standard amortization formula
  const baseMonthlyPayment =
    (mortgageAmount * monthlyRate * Math.pow(1 + monthlyRate, amortizationYears * 12)) /
    (Math.pow(1 + monthlyRate, amortizationYears * 12) - 1);
  
  const regularPayment = calculatePaymentFromMonthly(baseMonthlyPayment, paymentFrequency);
  const increasedPayment = regularPayment * (1 + monthlyIncreasePercent / 100);
  
  // === SCENARIO 1: Full amortization WITHOUT prepayments (baseline) ===
  let balanceNoPrepay = mortgageAmount;
  let totalInterestNoPrepay = 0;
  let paymentsNoPrepay = 0;
  
  while (balanceNoPrepay > 0 && paymentsNoPrepay < totalPayments * 2) {
    paymentsNoPrepay++;
    const interestPayment = balanceNoPrepay * periodRate;
    const principalPayment = regularPayment - interestPayment;
    
    if (principalPayment >= balanceNoPrepay) {
      // Final payment - only pay remaining balance + interest
      totalInterestNoPrepay += balanceNoPrepay * periodRate;
      break;
    }
    
    balanceNoPrepay -= principalPayment;
    totalInterestNoPrepay += interestPayment;
  }
  
  // === SCENARIO 2: Full amortization WITH prepayments ===
  let balance = mortgageAmount;
  let totalInterestWithPrepay = 0;
  let totalPaidWithPrepay = 0;
  let paymentCount = 0;
  const schedule: AmortizationEntry[] = [];
  let yearlyLumpSumApplied = false;
  let currentYear = 1;
  
  while (balance > 0 && paymentCount < totalPayments * 2) {
    paymentCount++;
    const currentYearNum = Math.ceil(paymentCount / paymentsPerYear);
    
    // Apply annual lump sum at the beginning of each year (after year 1)
    if (currentYearNum > currentYear && annualLumpSum > 0 && !yearlyLumpSumApplied) {
      balance = Math.max(0, balance - annualLumpSum);
      yearlyLumpSumApplied = true;
      currentYear = currentYearNum;
    } else if (currentYearNum === currentYear) {
      yearlyLumpSumApplied = false;
    }
    
    if (balance <= 0) break;
    
    const interestPayment = balance * periodRate;
    let principalPayment = increasedPayment - interestPayment;
    
    // Adjust final payment
    if (principalPayment >= balance) {
      principalPayment = balance;
      balance = 0;
    } else {
      balance -= principalPayment;
    }
    
    const actualPayment = principalPayment + interestPayment;
    totalInterestWithPrepay += interestPayment;
    totalPaidWithPrepay += actualPayment;
    
    schedule.push({
      period: paymentCount,
      payment: actualPayment,
      principalPayment,
      interestPayment,
      balance: Math.max(0, balance),
      cumulativeInterest: totalInterestWithPrepay,
      cumulativePrincipal: mortgageAmount - balance,
    });
    
    if (balance <= 0) break;
  }
  
  // === Calculate term-specific values (from WITH prepay schedule) ===
  const termPayments = termYears * paymentsPerYear;
  const termSchedule = schedule.slice(0, Math.min(termPayments, schedule.length));
  
  const termTotalPaid = termSchedule.reduce((sum, entry) => sum + entry.payment, 0);
  const termTotalInterest = termSchedule.reduce((sum, entry) => sum + entry.interestPayment, 0);
  const termPrincipalPaid = termSchedule.length > 0 
    ? mortgageAmount - termSchedule[termSchedule.length - 1].balance 
    : 0;
  const termRemainingBalance = termSchedule.length > 0 
    ? termSchedule[termSchedule.length - 1].balance 
    : mortgageAmount;
  
  // === Interest savings over full amortization ===
  const interestSavings = totalInterestNoPrepay - totalInterestWithPrepay;
  const payoffYears = paymentCount / paymentsPerYear;
  
  return {
    regularPayment,
    actualPayment: schedule[0]?.payment || regularPayment,
    totalPayments: paymentCount,
    totalInterestPaid: termTotalInterest,  // Interest paid during term only
    totalPaid: termTotalPaid,  // Total paid during term only
    principalPaid: termPrincipalPaid,  // Principal paid during term only
    remainingBalance: termRemainingBalance,  // Balance at end of term
    interestSavings,
    payoffYears,
    schedule: termSchedule,
  };
}

function getYearlySummary(schedule: AmortizationEntry[], paymentsPerYear: number): YearlySummary[] {
  const summaries: YearlySummary[] = [];
  let currentYear = 1;
  let yearPrincipal = 0;
  let yearInterest = 0;
  let yearPayments = 0;
  
  schedule.forEach((entry, index) => {
    const entryYear = Math.ceil(entry.period / paymentsPerYear);
    
    if (entryYear !== currentYear) {
      summaries.push({
        year: currentYear,
        payments: yearPayments,
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        endingBalance: schedule[index - 1]?.balance || 0,
      });
      currentYear = entryYear;
      yearPrincipal = 0;
      yearInterest = 0;
      yearPayments = 0;
    }
    
    yearPrincipal += entry.principalPayment;
    yearInterest += entry.interestPayment;
    yearPayments++;
  });
  
  // Add last year
  if (yearPayments > 0) {
    summaries.push({
      year: currentYear,
      payments: yearPayments,
      principalPaid: yearPrincipal,
      interestPaid: yearInterest,
      endingBalance: schedule[schedule.length - 1]?.balance || 0,
    });
  }
  
  return summaries;
}

// Result Card Component
function ResultCard({
  label,
  value,
  color = "gray",
  tooltip,
  prefix = "$",
  suffix,
}: {
  label: string;
  value: number | string;
  color?: "gray" | "blue" | "green" | "red" | "purple";
  tooltip: string;
  prefix?: string;
  suffix?: string;
}) {
  const colorClasses = {
    gray: "text-gray-900",
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    purple: "text-purple-600",
  };

  const formattedValue = typeof value === "number" ? value.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value;

  return (
    <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-2">
        <Tooltip text={tooltip}>{label}</Tooltip>
      </div>
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>
        {prefix}{formattedValue}{suffix}
      </div>
    </div>
  );
}

// Main Component
export default function MortgageCalculator() {
  const [showCalculator, setShowCalculator] = useState<boolean>(true);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);
  const [scheduleView, setScheduleView] = useState<ScheduleView>("yearly");
  const [showComparison, setShowComparison] = useState<boolean>(false);
  
  // Scenario 1 State
  const [params1, setParams1] = useState<MortgageParams>({
    mortgageAmount: 500000,
    rate: 4.5,
    amortizationYears: 25,
    termYears: 5,
    paymentFrequency: "monthly",
    annualLumpSum: 0,
    monthlyIncreasePercent: 0,
  });
  
  // Scenario 2 State (for comparison)
  const [params2, setParams2] = useState<MortgageParams>({
    mortgageAmount: 500000,
    rate: 5.5,
    amortizationYears: 25,
    termYears: 5,
    paymentFrequency: "monthly",
    annualLumpSum: 0,
    monthlyIncreasePercent: 0,
  });
  
  const results1 = useMemo(() => calculateMortgage(params1), [params1]);
  const results2 = useMemo(() => calculateMortgage(params2), [params2]);
  
  const yearlySummary = useMemo(
    () => getYearlySummary(results1.schedule, getPaymentsPerYear(params1.paymentFrequency)),
    [results1.schedule, params1.paymentFrequency]
  );
  
  const updateParam1 = <K extends keyof MortgageParams>(key: K, value: MortgageParams[K]) => {
    setParams1((prev) => ({ ...prev, [key]: value }));
  };
  
  const updateParam2 = <K extends keyof MortgageParams>(key: K, value: MortgageParams[K]) => {
    setParams2((prev) => ({ ...prev, [key]: value }));
  };
  
  const formatCurrency = (value: number) => `$${value.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  const paymentFrequencyOptions = [
    { value: "monthly", label: "Monthly (12/yr)" },
    { value: "bi-weekly", label: "Bi-Weekly (26/yr)" },
    { value: "accelerated-bi-weekly", label: "Accelerated Bi-Weekly" },
    { value: "weekly", label: "Weekly (52/yr)" },
    { value: "accelerated-weekly", label: "Accelerated Weekly" },
  ];
  
  const amortizationOptions = [5, 10, 15, 20, 25, 30].map((y) => ({ value: y, label: `${y} years` }));
  const termOptions = [1, 2, 3, 4, 5, 7, 10].map((y) => ({ value: y, label: `${y} year${y > 1 ? "s" : ""}` }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Enhanced Mortgage Calculator</h2>
          <p className="text-sm text-gray-500 mt-1">Calculate payments, view amortization schedules, and compare scenarios</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showComparison
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {showComparison ? "Single View" : "Compare Scenarios"}
          </button>
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
          >
            {showCalculator ? "Hide Calculator" : "Show Calculator"}
          </button>
        </div>
      </div>

      {showCalculator && (
        <>
          {/* Scenario 1 Inputs */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <h3 className="text-lg font-semibold text-gray-800">
                {showComparison ? "Scenario 1" : "Mortgage Details"}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <InputField
                label="Mortgage Amount"
                tooltip="The total amount of your mortgage loan"
                value={params1.mortgageAmount}
                onChange={(v) => updateParam1("mortgageAmount", v)}
                min={10000}
                step={1000}
                prefix="$"
              />
              <InputField
                label="Interest Rate"
                tooltip="Annual interest rate for your mortgage"
                value={params1.rate}
                onChange={(v) => updateParam1("rate", v)}
                min={0.1}
                max={25}
                step={0.01}
                suffix="%"
              />
              <SelectField
                label="Amortization"
                tooltip="The total length of time to pay off your mortgage completely"
                value={params1.amortizationYears}
                onChange={(v) => updateParam1("amortizationYears", Number(v))}
                options={amortizationOptions}
              />
              <SelectField
                label="Term"
                tooltip="The length of your current mortgage agreement with the lender"
                value={params1.termYears}
                onChange={(v) => updateParam1("termYears", Number(v))}
                options={termOptions}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SelectField
                label="Payment Frequency"
                tooltip="How often you make mortgage payments. Accelerated options help you pay off faster"
                value={params1.paymentFrequency}
                onChange={(v) => updateParam1("paymentFrequency", v as PaymentFrequency)}
                options={paymentFrequencyOptions}
              />
              <InputField
                label="Annual Lump Sum"
                tooltip="Extra payment applied once per year to reduce principal faster"
                value={params1.annualLumpSum}
                onChange={(v) => updateParam1("annualLumpSum", v)}
                min={0}
                step={1000}
                prefix="$"
              />
              <InputField
                label="Payment Increase"
                tooltip="Percentage to increase your regular payment amount"
                value={params1.monthlyIncreasePercent}
                onChange={(v) => updateParam1("monthlyIncreasePercent", v)}
                min={0}
                max={100}
                step={5}
                suffix="%"
              />
            </div>
          </div>

          {/* Scenario 2 Inputs (if comparison enabled) */}
          {showComparison && (
            <div className="mb-8 p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <h3 className="text-lg font-semibold text-gray-800">Scenario 2</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <InputField
                  label="Mortgage Amount"
                  tooltip="The total amount of your mortgage loan"
                  value={params2.mortgageAmount}
                  onChange={(v) => updateParam2("mortgageAmount", v)}
                  min={10000}
                  step={1000}
                  prefix="$"
                />
                <InputField
                  label="Interest Rate"
                  tooltip="Annual interest rate for your mortgage"
                  value={params2.rate}
                  onChange={(v) => updateParam2("rate", v)}
                  min={0.1}
                  max={25}
                  step={0.01}
                  suffix="%"
                />
                <SelectField
                  label="Amortization"
                  tooltip="The total length of time to pay off your mortgage completely"
                  value={params2.amortizationYears}
                  onChange={(v) => updateParam2("amortizationYears", Number(v))}
                  options={amortizationOptions}
                />
                <SelectField
                  label="Term"
                  tooltip="The length of your current mortgage agreement with the lender"
                  value={params2.termYears}
                  onChange={(v) => updateParam2("termYears", Number(v))}
                  options={termOptions}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SelectField
                  label="Payment Frequency"
                  tooltip="How often you make mortgage payments"
                  value={params2.paymentFrequency}
                  onChange={(v) => updateParam2("paymentFrequency", v as PaymentFrequency)}
                  options={paymentFrequencyOptions}
                />
                <InputField
                  label="Annual Lump Sum"
                  tooltip="Extra payment applied once per year"
                  value={params2.annualLumpSum}
                  onChange={(v) => updateParam2("annualLumpSum", v)}
                  min={0}
                  step={1000}
                  prefix="$"
                />
                <InputField
                  label="Payment Increase"
                  tooltip="Percentage to increase your regular payment"
                  value={params2.monthlyIncreasePercent}
                  onChange={(v) => updateParam2("monthlyIncreasePercent", v)}
                  min={0}
                  max={100}
                  step={5}
                  suffix="%"
                />
              </div>
            </div>
          )}

          {/* Results Section */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
            {/* Primary Payment Display */}
            <div className="text-center mb-8">
              <div className="text-sm text-gray-600 mb-2">
                {getPaymentLabel(params1.paymentFrequency)} Payment
                {params1.monthlyIncreasePercent > 0 && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    +{params1.monthlyIncreasePercent}%
                  </span>
                )}
              </div>
              <div className="text-5xl font-bold text-blue-600">
                {formatCurrency(results1.actualPayment)}
              </div>
              {params1.monthlyIncreasePercent > 0 && (
                <div className="text-sm text-gray-500 mt-1">
                  Base: {formatCurrency(results1.regularPayment)}
                </div>
              )}
            </div>

            {/* Comparison Results */}
            {showComparison ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Scenario 1 Results */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <h4 className="font-semibold text-gray-800">Scenario 1</h4>
                  </div>
                  <ResultCard
                    label="Total Interest"
                    value={results1.totalInterestPaid}
                    color="red"
                    tooltip="Total interest paid over the mortgage term"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard
                      label="Principal Paid"
                      value={results1.principalPaid}
                      color="green"
                      tooltip="Amount of principal paid off during the term"
                    />
                    <ResultCard
                      label="Remaining"
                      value={results1.remainingBalance}
                      color="gray"
                      tooltip="Outstanding balance at end of term"
                    />
                  </div>
                  {results1.interestSavings > 0 && (
                    <div className="bg-green-100 border border-green-200 rounded-lg p-3 text-center">
                      <span className="text-green-700 font-semibold">
                        💰 Interest Saved: {formatCurrency(results1.interestSavings)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Scenario 2 Results */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <h4 className="font-semibold text-gray-800">Scenario 2</h4>
                  </div>
                  <ResultCard
                    label="Total Interest"
                    value={results2.totalInterestPaid}
                    color="red"
                    tooltip="Total interest paid over the mortgage term"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard
                      label="Principal Paid"
                      value={results2.principalPaid}
                      color="green"
                      tooltip="Amount of principal paid off during the term"
                    />
                    <ResultCard
                      label="Remaining"
                      value={results2.remainingBalance}
                      color="gray"
                      tooltip="Outstanding balance at end of term"
                    />
                  </div>
                  {results2.interestSavings > 0 && (
                    <div className="bg-green-100 border border-green-200 rounded-lg p-3 text-center">
                      <span className="text-green-700 font-semibold">
                        💰 Interest Saved: {formatCurrency(results2.interestSavings)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Comparison Summary */}
                <div className="md:col-span-2 bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3 text-center">Comparison Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Payment Difference</div>
                      <div className={`text-lg font-bold ${results1.actualPayment < results2.actualPayment ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(Math.abs(results1.actualPayment - results2.actualPayment))}
                      </div>
                      <div className="text-xs text-gray-500">
                        {results1.actualPayment < results2.actualPayment ? "Scenario 1 saves" : "Scenario 2 saves"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Interest Difference</div>
                      <div className={`text-lg font-bold ${results1.totalInterestPaid < results2.totalInterestPaid ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(Math.abs(results1.totalInterestPaid - results2.totalInterestPaid))}
                      </div>
                      <div className="text-xs text-gray-500">
                        {results1.totalInterestPaid < results2.totalInterestPaid ? "Scenario 1 saves" : "Scenario 2 saves"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Balance Difference</div>
                      <div className={`text-lg font-bold ${results1.remainingBalance < results2.remainingBalance ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(Math.abs(results1.remainingBalance - results2.remainingBalance))}
                      </div>
                      <div className="text-xs text-gray-500">
                        {results1.remainingBalance < results2.remainingBalance ? "Scenario 1 owes less" : "Scenario 2 owes less"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Single Scenario Results */
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <ResultCard
                  label={`Total Paid (${params1.termYears}yr)`}
                  value={results1.totalPaid}
                  color="blue"
                  tooltip="Total amount paid during the term including principal and interest"
                />
                <ResultCard
                  label="Principal Paid"
                  value={results1.principalPaid}
                  color="green"
                  tooltip="Amount of principal paid off during the term"
                />
                <ResultCard
                  label="Interest Paid"
                  value={results1.totalInterestPaid}
                  color="red"
                  tooltip="Total interest paid during the term"
                />
                <ResultCard
                  label="Remaining Balance"
                  value={results1.remainingBalance}
                  color="gray"
                  tooltip="Outstanding mortgage balance at end of term"
                />
              </div>
            )}

            {/* Interest Savings Banner */}
            {!showComparison && results1.interestSavings > 100 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 mb-6 text-center">
                <div className="text-lg font-semibold">
                  💰 You\'ll save {formatCurrency(results1.interestSavings)} in interest!
                </div>
                <div className="text-sm opacity-90 mt-1">
                  Pay off your mortgage in {results1.payoffYears.toFixed(1)} years instead of {params1.amortizationYears} years
                </div>
              </div>
            )}

            {/* Amortization Schedule Toggle */}
            <div className="mt-6">
              <button
                onClick={() => setShowAmortization(!showAmortization)}
                className="w-full py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <span>{showAmortization ? "Hide" : "Show"} Amortization Schedule</span>
                <svg
                  className={`w-5 h-5 transition-transform ${showAmortization ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showAmortization && (
                <div className="mt-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* View Toggle */}
                  <div className="flex gap-2 p-4 border-b border-gray-100">
                    <button
                      onClick={() => setScheduleView("yearly")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        scheduleView === "yearly"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Yearly View
                    </button>
                    <button
                      onClick={() => setScheduleView("monthly")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        scheduleView === "monthly"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Monthly View
                    </button>
                  </div>

                  {/* Schedule Table */}
                  <div className="overflow-x-auto">
                    {scheduleView === "yearly" ? (
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Year</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Payments</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Principal</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Interest</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Ending Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {yearlySummary.map((year) => (
                            <tr key={year.year} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{year.year}</td>
                              <td className="px-4 py-3 text-right text-gray-600">{year.payments}</td>
                              <td className="px-4 py-3 text-right text-green-600 font-medium">
                                {formatCurrency(year.principalPaid)}
                              </td>
                              <td className="px-4 py-3 text-right text-red-600">
                                {formatCurrency(year.interestPaid)}
                              </td>
                              <td className="px-4 py-3 text-right font-medium text-gray-900">
                                {formatCurrency(year.endingBalance)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Payment</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Principal</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Interest</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Remaining</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {results1.schedule.slice(0, 60).map((entry) => (
                            <tr key={entry.period} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{entry.period}</td>
                              <td className="px-4 py-3 text-right text-gray-600">
                                {formatCurrency(entry.payment)}
                              </td>
                              <td className="px-4 py-3 text-right text-green-600">
                                {formatCurrency(entry.principalPayment)}
                              </td>
                              <td className="px-4 py-3 text-right text-red-600">
                                {formatCurrency(entry.interestPayment)}
                              </td>
                              <td className="px-4 py-3 text-right font-medium text-gray-900">
                                {formatCurrency(entry.balance)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  
                  {scheduleView === "monthly" && results1.schedule.length > 60 && (
                    <div className="p-4 text-center text-sm text-gray-500 border-t border-gray-100">
                      Showing first 60 payments of {results1.schedule.length}. Switch to yearly view to see full schedule.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center mt-6">
            This calculator provides estimates for informational purposes only. Actual mortgage payments may vary 
            based on lender fees, property taxes, insurance, and other factors. Please consult with a mortgage 
            professional for accurate figures.
          </p>
        </>
      )}
    </div>
  );
}
