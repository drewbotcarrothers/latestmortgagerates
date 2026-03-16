import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import ClosingCostsCalculator from "../../components/ClosingCostsCalculator";

export const metadata: Metadata = {
  title: "Closing Costs Calculator Canada | Home Buying Fees",
  description: "Calculate total closing costs for buying a home in Canada. Includes land transfer tax, legal fees, and other expenses. See province-specific rebates for first-time buyers.",
  keywords: "closing costs calculator Canada, home buying fees, land transfer tax calculator, first time buyer rebates, closing costs estimate",
  openGraph: {
    title: "Closing Costs Calculator Canada | Home Buying Fees",
    description: "Calculate total cash needed to close on your home purchase. Includes all province-specific taxes and rebates.",
    type: "website",
  },
};

export default function ClosingCostsPage() {
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
              Closing Costs Calculator
            </h1>
            
            <p className="text-xl text-slate-300 mb-8">
              Calculate the total cash you'll need to close on your home purchase. 
              Includes land transfer tax, legal fees, and all province-specific costs.
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                All provinces
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                First-time buyer rebates
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Toronto municipal tax
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ClosingCostsCalculator />
      </div>

      {/* Info Section */}
      <div className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                What's Included in Closing Costs?
              </h2>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <strong>Land Transfer Tax:</strong> Provincial (and sometimes municipal) 
                  tax based on purchase price
                </li>
                <li>
                  <strong>Legal Fees:</strong> Lawyer or notary fees for closing the transaction
                </li>
                <li>
                  <strong>Title Insurance:</strong> Protects against title defects and fraud
                </li>
                <li>
                  <strong>Home Inspection:</strong> Optional but recommended pre-purchase inspection
                </li>
                <li>
                  <strong>Appraisal Fee:</strong> Required by most lenders for mortgage approval
                </li>
                <li>
                  <strong>Moving Costs:</strong> Professional movers or truck rental
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                First-Time Buyer Rebates
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  <strong>Ontario:</strong> Up to $4,000 rebate on provincial LTT. 
                  Toronto buyers can get up to $4,475 total (including municipal rebate).
                </p>
                <p>
                  <strong>British Columbia:</strong> Full exemption on properties under $500,000. 
                  Partial exemption up to $525,000.
                </p>
                <p>
                  <strong>PEI:</strong> Full exemption for first-time buyers on properties 
                  under $200,000.
                </p>
                <p>
                  <strong>Eligibility:</strong> Generally must be 18+, Canadian citizen or permanent 
                  resident, and never owned a home before.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Tools */}
      <div className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/tools/land-transfer-tax-calculator" className="card-default p-6 hover:border-teal-300">
              <h3 className="font-semibold text-slate-900 mb-2">Land Transfer Tax Calculator</h3>
              <p className="text-slate-600 text-sm">Detailed LTT calculation with rebates</p>
            </Link>
            
            <Link href="/tools/affordability-calculator" className="card-default p-6 hover:border-teal-300">
              <h3 className="font-semibold text-slate-900 mb-2">Affordability Calculator</h3>
              <p className="text-slate-600 text-sm">How much house can you afford?</p>
            </Link>
            
            <Link href="/tools/rent-vs-buy-calculator" className="card-default p-6 hover:border-teal-300">
              <h3 className="font-semibold text-slate-900 mb-2">Rent vs Buy Calculator</h3>
              <p className="text-slate-600 text-sm">Compare renting vs buying costs</p>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
