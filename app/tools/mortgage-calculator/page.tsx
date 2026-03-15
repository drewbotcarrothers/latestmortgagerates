import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import MortgageCalculator from "../components/MortgageCalculator";

export const metadata: Metadata = {
  title: "Mortgage Payment Calculator Canada | Calculate Monthly Payments",
  description: "Free Canadian mortgage payment calculator. Calculate monthly payments, amortization schedule, total interest, and compare payment frequencies. Updated with current Canadian mortgage rates.",
  keywords: "mortgage payment calculator Canada, mortgage calculator, monthly mortgage payment, amortization schedule, mortgage interest calculator, Canadian mortgage rates",
  openGraph: {
    title: "Mortgage Payment Calculator Canada | Calculate Monthly Payments",
    description: "Calculate your monthly mortgage payments, amortization schedule, and total interest with our free Canadian mortgage calculator.",
    type: "website",
  },
};

export default function MortgageCalculatorPage() {
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
              <span>Mortgage Calculator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mortgage Payment Calculator
            </h1>
            <p className="text-xl text-slate-300">
              Calculate your monthly mortgage payments, amortization schedule, and see how much interest you'll pay over the life of your loan.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <MortgageCalculator />
      </div>

      {/* Information Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="card-default p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                How to Use This Mortgage Calculator
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  Our Canadian mortgage payment calculator helps you estimate your monthly mortgage payments 
                  and understand the total cost of your mortgage over time. Simply enter your mortgage details 
                  to see your payment breakdown.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Key Features:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li><strong>Payment Frequency:</strong> Compare monthly, bi-weekly, weekly, and accelerated payment options</li>
                  <li><strong>Amortization Schedule:</strong> See your full payment breakdown over the life of your mortgage</li>
                  <li><strong>Prepayment Options:</strong> Calculate how extra payments reduce your mortgage faster</li>
                  <li><strong>Interest Savings:</strong> See exactly how much interest you'll pay</li>
                </ul>
              </div>
            </section>

            <section className="card-default p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Understanding Your Mortgage Payment
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  Your mortgage payment consists of two main components: <strong>principal</strong> and <strong>interest</strong>. 
                  In the early years of your mortgage, a larger portion of your payment goes toward interest. 
                  As you pay down the principal, more of each payment goes toward reducing your balance.
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Payment Frequency Options:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Monthly</h4>
                    <p className="text-sm text-slate-600">12 payments per year. Standard option with higher individual payments.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Bi-Weekly</h4>
                    <p className="text-sm text-slate-600">26 payments per year. Aligns with most Canadian pay schedules.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Accelerated Bi-Weekly</h4>
                    <p className="text-sm text-slate-600">26 payments per year (half monthly amount). Saves years off your mortgage.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Weekly</h4>
                    <p className="text-sm text-slate-600">52 payments per year. Lowest individual payment amount.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="card-default p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">What is mortgage amortization?</h3>
                  <p className="text-slate-600">
                    Amortization is the total length of time it takes to pay off your mortgage completely. 
                    In Canada, common amortization periods are 25 years (for insured mortgages) and 30 years 
                    (for conventional mortgages with 20%+ down payment).
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">How can I pay off my mortgage faster?</h3>
                  <p className="text-slate-600">
                    You can pay off your mortgage faster by: increasing your payment frequency (accelerated options), 
                    making lump sum payments, increasing your regular payment amount, or choosing a shorter amortization period.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">What's the difference between term and amortization?</h3>
                  <p className="text-slate-600">
                    The <strong>term</strong> is the length of your current mortgage contract (typically 1-5 years), 
                    while <strong>amortization</strong> is the total time to pay off your mortgage (typically 25-30 years).
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
                <Link href="/tools/affordability-calculator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <p className="font-medium text-slate-900">Affordability Calculator</p>
                    <p className="text-sm text-slate-500">How much can you afford?</p>
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
              <h3 className="text-lg font-bold mb-2">Compare Today's Rates</h3>
              <p className="text-teal-100 text-sm mb-4">
                See the best mortgage rates from 31+ Canadian lenders.
              </p>
              <Link
                href="/"
                className="inline-flex items-center text-sm font-semibold text-white hover:text-teal-100"
              >
                View Rates
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
