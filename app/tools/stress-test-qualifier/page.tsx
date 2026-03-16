import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import StressTestQualifier from "../../components/StressTestQualifier";

export const metadata: Metadata = {
  title: "Mortgage Stress Test Qualifier Canada | 2026 Rules",
  description: "Check if you qualify for a mortgage under Canada's stress test rules. Calculate GDS and TDS ratios at the stress test rate to see if you can get approved.",
  keywords: "mortgage stress test calculator Canada, stress test qualifier, GDS TDS calculator, mortgage qualification, stress test rules 2026",
  openGraph: {
    title: "Mortgage Stress Test Qualifier Canada | 2026 Rules",
    description: "See if you qualify under Canada's mortgage stress test. Check your GDS and TDS ratios.",
    type: "website",
  },
};

export default function StressTestPage() {
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
              Stress Test Qualifier
            </h1>

            <p className="text-xl text-slate-300 mb-8">
              Will you pass the mortgage stress test? Check if you qualify for a mortgage
              under Canada&apos;s current rules. See your GDS and TDS ratios instantly.
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                GDS/TDS Ratios
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                5.25% Benchmark
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Instant Results
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <StressTestQualifier />
      </div>

      <div className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Understanding the Stress Test
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  <strong>What is it?</strong> The mortgage stress test requires you to
                  qualify at a higher interest rate than you&apos;ll actually pay. This ensures
                  you can handle rate increases.
                </p>
                <p>
                  <strong>The Rate:</strong> You must qualify at the <em>higher</em> of:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>The Bank of Canada benchmark rate (currently 5.25%)</li>
                  <li>Your contract rate + 2%</li>
                </ul>
                <p>
                  <strong>Example:</strong> If you get a 4.5% mortgage, you must
                  prove you can afford payments at 6.5% (4.5% + 2%). Since 6.5% &gt; 5.25%,
                  you&apos;d qualify at 6.5%.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                GDS vs TDS Explained
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  <strong>GDS (Gross Debt Service):</strong> The percentage of your
                  income that goes toward housing costs. Includes mortgage payments,
                  property tax, heating, and 50% of condo fees.
                </p>
                <p>
                  <strong>TDS (Total Debt Service):</strong> The percentage of your
                  income that goes toward <em>all</em> debt payments. Includes housing
                  costs plus car loans, credit cards, student loans, etc.
                </p>
                <p>
                  <strong>Limits:</strong> Most lenders require GDS &le; 39% and TDS &le; 44%.
                  Some may allow slightly higher with strong credit or larger down payments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">What if I don&apos;t qualify?</h3>
              <p className="text-slate-600">
                You have options: increase your down payment to reduce the mortgage amount,
                pay off existing debts to lower your TDS, add a co-applicant with income,
                or look at a less expensive property. You can also wait and save more.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Does the stress test apply to all mortgages?</h3>
              <p className="text-slate-600">
                The stress test applies to all insured mortgages (less than 20% down) and
                most uninsured mortgages at federally regulated lenders. Credit unions
                and some alternative lenders may have different rules.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Can I get an exemption?</h3>
              <p className="text-slate-600">
                Some lenders offer exemptions for certain situations, such as switching
                lenders at renewal with no changes to the mortgage. However, most new
                mortgages and refinances require the stress test.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">How accurate is this calculator?</h3>
              <p className="text-slate-600">
                This calculator provides a good estimate based on standard rules. However,
                lenders may use slightly different calculations or have additional requirements.
                Always consult with a mortgage professional for pre-approval.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Tools</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/tools/affordability-calculator" className="card-default p-6 hover:border-teal-300">
              <h3 className="font-semibold text-slate-900 mb-2">Affordability Calculator</h3>
              <p className="text-slate-600 text-sm">See how much mortgage you can afford</p>
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
