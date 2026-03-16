import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import MortgagePenaltyCalculator from "../../components/MortgagePenaltyCalculator";

export const metadata: Metadata = {
  title: "Mortgage Penalty Calculator Canada | Break Fee Estimator",
  description: "Calculate your mortgage penalty for breaking early. Estimate 3-month interest or IRD penalties for fixed and variable rate mortgages in Canada.",
  keywords: "mortgage penalty calculator Canada, break mortgage penalty, IRD calculator, 3 months interest penalty, mortgage break fee",
  openGraph: {
    title: "Mortgage Penalty Calculator Canada | Break Fee Estimator",
    description: "Estimate your mortgage penalty for breaking early. Calculate 3-month interest or IRD penalties.",
    type: "website",
  },
};

export default function MortgagePenaltyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
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

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-teal-300 mb-4">
              <Link href="/tools" className="hover:text-white transition">
                ← Back to Tools
              </Link>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Mortgage Penalty Calculator
            </h1>

            <p className="text-xl text-slate-300 mb-8">
              Thinking of breaking your mortgage? Calculate your estimated penalty
              for fixed and variable rate mortgages in Canada.
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                3 Months Interest
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                IRD Calculation
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bank vs Monoline
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <MortgagePenaltyCalculator />
      </div>

      <div className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                How Mortgage Penalties Work
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  <strong>3 Months Interest:</strong> This is the most common penalty
                  for variable-rate mortgages and some fixed-rate mortgages. It is calculated
                  as three times your current monthly mortgage payment.
                </p>
                <p>
                  <strong>Interest Rate Differential (IRD):</strong> This applies to most
                  fixed-rate mortgages. It calculates the difference between your current rate
                  and the lender&apos;s current posted rate for a similar term, multiplied by your
                  remaining balance and time left.
                </p>
                <p>
                  <strong>Which applies?</strong> You&apos;ll pay the <em>greater</em> of
                  the two amounts. For variable rates, it&apos;s almost always 3 months interest.
                  For fixed rates, IRD can be significantly higher, especially with big banks.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Ways to Reduce or Avoid Penalties
              </h2>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <strong>Port your mortgage:</strong> Transfer your mortgage to a new
                  property when you move
                </li>
                <li>
                  <strong>Prepayment privileges:</strong> Use annual prepayment options
                  to reduce your balance before calculating penalty
                </li>
                <li>
                  <strong>Blend and extend:</strong> Blend your current rate with a new
                  rate and extend your term
                </li>
                <li>
                  <strong>Wait it out:</strong> Penalties decrease as you get closer to
                  your renewal date
                </li>
                <li>
                  <strong>Assign/sell your mortgage:</strong> Some lenders allow you to
                  transfer your mortgage to a buyer
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Why are bank penalties higher than monoline lenders?</h3>
              <p className="text-slate-600">
                Big banks often use a more punitive IRD formula that compares your discounted rate
                to their posted rate at origination, rather than current posted rates. Monoline
                lenders typically use fairer calculations based on current rates.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Can I negotiate my penalty?</h3>
              <p className="text-slate-600">
                Sometimes. If you&apos;re staying with the same lender for a new mortgage, they may
                reduce or waive the penalty. It never hurts to ask, especially if you&apos;re a
                long-time customer.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Does selling my house trigger a penalty?</h3>
              <p className="text-slate-600">
                Only if you don&apos;t port your mortgage to a new property. Most lenders allow you
                to transfer (port) your mortgage to a new home without penalty, as long as you
                complete the purchase within a certain timeframe (usually 30-120 days).
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Tools</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/tools/refinance-calculator" className="card-default p-6 hover:border-teal-300">
              <h3 className="font-semibold text-slate-900 mb-2">Refinance Calculator</h3>
              <p className="text-slate-600 text-sm">See if refinancing makes sense with your penalty</p>
            </Link>

            <Link href="/tools/mortgage-calculator" className="card-default p-6 hover:border-teal-300">
              <h3 className="font-semibold text-slate-900 mb-2">Mortgage Calculator</h3>
              <p className="text-slate-600 text-sm">Calculate monthly payments</p>
            </Link>

            <Link href="/" className="card-default p-6 hover:border-teal-300">
              <h3 className="font-semibold text-slate-900 mb-2">Current Rates</h3>
              <p className="text-slate-600 text-sm">Compare today&apos;s best mortgage rates</p>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
