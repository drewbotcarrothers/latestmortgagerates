import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import RentVsBuyCalculator from "../../components/RentVsBuyCalculator";

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator Canada | Should I Rent or Buy?",
  description: "Compare renting vs buying a home in Canada. Calculate break-even points, net worth projections, and see which option makes more financial sense for your situation.",
  keywords: "rent vs buy calculator Canada, should I rent or buy, renting vs buying home, rent buy comparison, home ownership calculator",
  openGraph: {
    title: "Rent vs Buy Calculator Canada | Should I Rent or Buy?",
    description: "Compare the financial impact of renting vs buying a home in Canada. See your break-even point and long-term net worth.",
    type: "website",
  },
};

export default function RentVsBuyPage() {
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
              Rent vs Buy Calculator
            </h1>
            
            <p className="text-xl text-slate-300 mb-8">
              Should you rent or buy? Compare the long-term financial impact of both options 
              and see your break-even point.
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
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
                Net worth projections
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Includes appreciation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <RentVsBuyCalculator />
      </div>

      {/* Info Section */}
      <div className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                How to Use This Calculator
              </h2>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <strong>Enter home details:</strong> Purchase price, down payment, and expected interest rate
                </li>
                <li>
                  <strong>Add monthly costs:</strong> Property tax, maintenance, insurance, and utilities
                </li>
                <li>
                  <strong>Enter rent:</strong> Your current or expected monthly rent
                </li>
                <li>
                  <strong>Set assumptions:</strong> Home appreciation and investment return rates
                </li>
                <li>
                  <strong>Review results:</strong> See which option builds more wealth over time
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Factors to Consider
              </h2>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <strong>Flexibility:</strong> Renting offers more mobility for job changes
                </li>
                <li>
                  <strong>Maintenance:</strong> Homeowners pay 1-3% of value annually
                </li>
                <li>
                  <strong>Appreciation:</strong> Historically 3-5% annually in Canada
                </li>
                <li>
                  <strong>Opportunity cost:</strong> Down payment could be invested elsewhere
                </li>
                <li>
                  <strong>Lifestyle:</strong> Stability vs flexibility preferences
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
            <Link href="/tools/affordability-calculator" className="card-default p-6 hover:border-teal-300">
              <h3 className="font-semibold text-slate-900 mb-2">Affordability Calculator</h3>
              <p className="text-slate-600 text-sm">Find out how much house you can afford</p>
            </Link>
            
            <Link href="/tools/closing-costs-calculator" className="card-default p-6 hover:border-teal-300">
              <h3 className="font-semibold text-slate-900 mb-2">Closing Costs Calculator</h3>
              <p className="text-slate-600 text-sm">Calculate total cash needed to buy a home</p>
            </Link>
            
            <Link href="/tools/mortgage-calculator" className="card-default p-6 hover:border-teal-300">
              <h3 className="font-semibold text-slate-900 mb-2">Mortgage Calculator</h3>
              <p className="text-slate-600 text-sm">Calculate monthly mortgage payments</p>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
