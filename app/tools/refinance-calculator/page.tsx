import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import RefinanceCalculator from "../../components/RefinanceCalculator";

export const metadata: Metadata = {
  title: "Mortgage Refinance Calculator Canada | Break-Even Analysis",
  description: "Calculate if refinancing your mortgage makes sense. Compare your current rate vs new rates, estimate penalties, and see your break-even point and total savings.",
  keywords: "mortgage refinance calculator Canada, refinance break even, mortgage penalty calculator, should I refinance, refinance savings",
  openGraph: {
    title: "Mortgage Refinance Calculator Canada | Break-Even Analysis",
    description: "See if refinancing makes sense. Calculate penalties, break-even point, and total savings.",
    type: "website",
  },
};

export default function RefinancePage() {
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
                  width={56}
                  height={56}
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
              <Link href="/tools" className="hover:text-white transition">
                ← Back to Tools
              </Link>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Refinance Calculator
            </h1>
            
            <p className="text-xl text-slate-300 mb-8">
              Should you refinance your mortgage? Calculate your penalty, break-even point, 
              and total savings to make an informed decision.
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Penalty estimates
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Break-even analysis
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Interest savings
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <RefinanceCalculator />
      </div>

      {/* Info Section */}
      <div className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Understanding Mortgage Penalties
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  <strong>3 Months Interest:</strong> The most common penalty calculation. 
                  Typically applies to variable-rate mortgages and some fixed-rate mortgages.
                </p>
                <p>
                  <strong>Interest Rate Differential (IRD):</strong> The difference between your 
                  current rate and the lender's posted rate for a similar term. Can be much higher 
                  than 3 months interest, especially with big banks.
                </p>
                <p>
                  <strong>Tip:</strong> Monoline lenders (like MCAP, First National) often have 
                  lower penalties than big banks due to fairer IRD calculations.
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                When to Consider Refinancing
              </h2>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <strong>Rate drop of 1%+:</strong> Generally worth exploring
                </li>
                <li>
                  <strong>Remaining term > 2 years:</strong> More time to recover costs
                </li>
                <li>
                  <strong>Home value increased:</strong> May eliminate CMHC insurance
                </li>
                <li>
                  <strong>Need equity:</strong> Access cash for renovations or investments
                </li>
                <li>
                  <strong>Consolidating debt:</strong> Lower interest than credit cards
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related Tools */}
      <div className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/tools/mortgage-calculator" className="card-default p-6 hover:border-teal-300">
              <h3 className="font-semibold text-slate-900 mb-2">Mortgage Calculator</h3>
              <p className="text-slate-600 text-sm">Calculate monthly payments and amortization</p>
            </Link>
            
            <Link href="/tools/affordability-calculator" className="card-default p-6 hover:border-teal-300">
              <h3 className="font-semibold text-slate-900 mb-2">Affordability Calculator</h3>
              <p className="text-slate-600 text-sm">See how much mortgage you qualify for</p>
            </Link>
            
            <Link href="/" className="card-default p-6 hover:border-teal-300">
              <h3 className="font-semibold text-slate-900 mb-2">Current Rates</h3>
              <p className="text-slate-600 text-sm">Compare today's best mortgage rates</p>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
