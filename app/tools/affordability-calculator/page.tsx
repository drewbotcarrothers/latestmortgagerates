import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import AffordabilityCalculator from "../../../components/AffordabilityCalculator";

export const metadata: Metadata = {
  title: "Mortgage Affordability Calculator Canada | How Much Can You Afford?",
  description: "Calculate how much mortgage you can afford in Canada. Based on income, debts, and down payment. Includes GDS/TDS ratio calculations and stress test requirements.",
  keywords: "mortgage affordability calculator Canada, how much mortgage can I afford, GDS TDS calculator, mortgage qualification calculator, stress test calculator",
  openGraph: {
    title: "Mortgage Affordability Calculator Canada | How Much Can You Afford?",
    description: "Find out your maximum home price and mortgage amount based on your income, debts, and down payment.",
    type: "website",
  },
};

export default function AffordabilityCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Latest Mortgage Rates Canada"
                  width={48}
                  height={48}
                  className="rounded-lg"
                  priority
                />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Latest Mortgage Rates Canada
                </h1>
              </div>
            </div>
            <Navigation currentPage="tools" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-teal-300 mb-4">
              <Link href="/tools" className="hover:text-white transition-colors">
                Tools
              </Link>
              <span>/</span>
              <span>Affordability Calculator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mortgage Affordability Calculator
            </h1>
            <p className="text-xl text-slate-300">
              Find out how much house you can afford based on your income, debts, and down payment. 
              Includes Canada's mortgage stress test requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AffordabilityCalculator />
      </div>

      {/* Information Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="card-default p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                How Much Mortgage Can You Afford?
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  Our affordability calculator helps you determine your maximum home purchase price based on 
                  Canadian mortgage qualification rules. We calculate both your Gross Debt Service (GDS) and 
                  Total Debt Service (TDS) ratios to ensure you meet lender requirements.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">What You'll Need:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li><strong>Annual Income:</strong> Your gross household income before taxes</li>
                  <li><strong>Monthly Debts:</strong> Car payments, credit cards, student loans, etc.</li>
                  <li><strong>Down Payment:</strong> How much you have saved for a down payment</li>
                  <li><strong>Property Expenses:</strong> Estimated property taxes, heating, and condo fees</li>
                </ul>
              </div>
            </section>

            <section className="card-default p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Understanding GDS and TDS Ratios
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  Canadian lenders use two key ratios to determine how much you can borrow:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-slate-50 p-5 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">GDS Ratio (Gross Debt Service)</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Maximum 39% of your gross monthly income can go toward housing costs.
                    </p>
                    <div className="text-sm bg-white p-3 rounded border">
                      <strong>Includes:</strong> Mortgage payment + Property taxes + Heating + 50% of condo fees
                    </div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">TDS Ratio (Total Debt Service)</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Maximum 44% of your gross monthly income can go toward all debts.
                    </p>
                    <div className="text-sm bg-white p-3 rounded border">
                      <strong>Includes:</strong> Housing costs + Car payments + Credit cards + Student loans + Other debts
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="card-default p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                The Mortgage Stress Test
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  Since 2018, Canadian homebuyers must qualify at a higher interest rate than their actual contract rate. 
                  This "stress test" ensures you can afford your mortgage even if rates rise.
                </p>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-4">
                  <p className="text-amber-800 font-medium mb-2">Current Stress Test Rate:</p>
                  <p className="text-amber-700">
                    The higher of: <strong>5.25%</strong> OR your contract rate + <strong>2.00%</strong>
                  </p>
                </div>
                <p className="text-slate-600">
                  For example, if you're offered a 4.5% mortgage rate, you must qualify at 6.5% (4.5% + 2%). 
                  This reduces the amount you can borrow but protects you from future rate increases.
                </p>
              </div>
            </section>

            <section className="card-default p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Does this calculator include the stress test?</h3>
                  <p className="text-slate-600">
                    Yes, our calculator applies the Canadian mortgage stress test rules using the current qualifying rate 
                    of 5.25% or your entered rate + 2%, whichever is higher.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">What if my down payment is less than 20%?</h3>
                  <p className="text-slate-600">
                    If your down payment is less than 20%, you'll need mortgage default insurance (CMHC/Genworth/Canada Guaranty). 
                    The calculator includes this premium in your total mortgage amount.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Can I afford more if I have a co-signer?</h3>
                  <p className="text-slate-600">
                    Yes, adding a co-signer with income can increase your affordability. Include their annual income in the 
                    calculator, but remember their debts will also be included in the TDS calculation.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card-default p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Related Tools</h3>
              <div className="space-y-3">
                <Link href="/tools/mortgage-calculator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="text-2xl">🧮</span>
                  <div>
                    <p className="font-medium text-slate-900">Payment Calculator</p>
                    <p className="text-sm text-slate-500">Calculate monthly payments</p>
                  </div>
                </Link>
                <Link href="/tools/cmhc-insurance-calculator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <p className="font-medium text-slate-900">CMHC Calculator</p>
                    <p className="text-sm text-slate-500">Calculate insurance premiums</p>
                  </div>
                </Link>
                <Link href="/tools/land-transfer-tax-calculator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="font-medium text-slate-900">Land Transfer Tax</p>
                    <p className="text-sm text-slate-500">Calculate closing costs</p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Ready to Get Pre-Approved?</h3>
              <p className="text-teal-100 text-sm mb-4">
                Compare rates from 31+ lenders and find the best mortgage for your budget.
              </p>
              <Link
                href="/"
                className="inline-flex items-center text-sm font-semibold text-white hover:text-teal-100"
              >
                View Current Rates
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
