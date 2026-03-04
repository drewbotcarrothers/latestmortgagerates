import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Mortgage Tools & Calculators | Latest Mortgage Rates Canada",
  description: "Free mortgage calculators and tools for Canadian homebuyers. Calculate your mortgage payments, affordability, and more.",
  keywords: ["mortgage calculator", "mortgage payment calculator", "affordability calculator", "mortgage tools"],
  alternates: {
    canonical: "https://latestmortgagerates.ca/tools",
  },
  openGraph: {
    title: "Mortgage Tools & Calculators",
    description: "Free mortgage calculators for Canadian homebuyers",
    type: "website",
    url: "https://latestmortgagerates.ca/tools",
  },
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Tools</li>
            </ol>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mortgage Tools & Calculators
              </h1>
              <p className="text-gray-600 mt-2">
                Free tools to help you plan your mortgage
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition">Rates</Link>
              <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition">Guides</Link>
              <Link href="/glossary" className="text-gray-600 hover:text-blue-600 transition">Glossary</Link>
              <Link href="/tools" className="text-blue-600 font-medium border-b-2 border-blue-600">Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Mortgage Calculator */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h3.01M9 7V4m6 3V4m-6 3h6m-6 3h6m-6 3h6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Mortgage Payment Calculator</h2>
            <p className="text-gray-600 mb-4">
              Calculate your monthly mortgage payments based on loan amount, interest rate, and amortization period.
            </p>
            <Link 
              href="/#calculator" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Use Calculator
            </Link>
          </div>

          {/* Affordability Calculator */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Affordability Calculator</h2>
            <p className="text-gray-600 mb-4">
              Find out how much house you can afford based on your income, expenses, and down payment.
            </p>
            <span className="inline-block px-4 py-2 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed">
              Coming Soon
            </span>
          </div>

          {/* Renewal Calculator */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Mortgage Renewal Calculator</h2>
            <p className="text-gray-600 mb-4">
              Compare your current mortgage rate with today's best rates to see potential savings at renewal.
            </p>
            <Link 
              href="/" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Compare Rates
            </Link>
          </div>

          {/* CMHC Calculator */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">CMHC Premium Calculator</h2>
            <p className="text-gray-600 mb-4">
              Calculate your mortgage default insurance premium for down payments less than 20%.
            </p>
            <span className="inline-block px-4 py-2 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed">
              Coming Soon
            </span>
          </div>

          {/* Land Transfer Tax */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Land Transfer Tax Calculator</h2>
            <p className="text-gray-600 mb-4">
              Calculate land transfer taxes for your province, including municipal taxes for Toronto and other cities.
            </p>
            <span className="inline-block px-4 py-2 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed">
              Coming Soon
            </span>
          </div>

          {/* Closing Costs */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Closing Costs Calculator</h2>
            <p className="text-gray-600 mb-4">
              Estimate all the costs involved in closing your mortgage, including legal fees, inspections, and more.
            </p>
            <span className="inline-block px-4 py-2 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed">
              Coming Soon
            </span>
          </div>

        </div>

        {/* Educational Section */}
        <section className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Use Our Mortgage Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Accurate Calculations</h3>
              <p className="text-gray-600 text-sm">
                Our calculators use up-to-date formulas and Canadian mortgage rules to give you precise estimates.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Compare Scenarios</h3>
              <p className="text-gray-600 text-sm">
                Test different mortgage amounts, rates, and terms to find what works best for your budget.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Plan Ahead</h3>
              <p className="text-gray-600 text-sm">
                Understand your costs before speaking with a lender so you can negotiate with confidence.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 mt-8 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          Calculators are for estimation purposes only. Consult a mortgage professional for exact figures.
        </p>
      </footer>
    </main>
  );
}
