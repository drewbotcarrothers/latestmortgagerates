import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "../components/Navigation";
import AffordabilityCalculator from "../components/AffordabilityCalculator";
import CMHCCalculator from "../components/CMHCCalculator";
import LandTransferTaxCalculator from "../components/LandTransferCalculator";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Mortgage Tools & Calculators | Latest Mortgage Rates Canada",
  description: "Free mortgage calculators and tools for Canadian homebuyers. Calculate affordability, CMHC premiums, land transfer tax, and more.",
  keywords: ["mortgage calculator", "canadian mortgage calculator", "affordability calculator", "cmhc calculator", "land transfer tax"],
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
                Free tools to help you plan your mortgage (made for Canadian homebuyers)
              </p>
            </div>
            <Navigation currentPage="tools" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Affordability Calculator */}
          <AffordabilityCalculator />
          
          {/* CMHC Calculator */}
          <CMHCCalculator />
          
          {/* Land Transfer Tax Calculator - Full Width */}
          <div className="lg:col-span-2">
            <LandTransferTaxCalculator />
          </div>
          
        </div>

        {/* Educational Section */}
        <section className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Use Our Mortgage Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Accurate Calculations</h3>
              <p className="text-gray-600 text-sm">
                Our calculators use up-to-date Canadian mortgage rules, including the stress test and provincial variations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Compare Scenarios</h3>
              <p className="text-gray-600 text-sm">
                Test different down payments, amortization periods, and income levels to find what works best.
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
