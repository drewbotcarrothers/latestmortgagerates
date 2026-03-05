import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Vancouver 2025 | Latest Mortgage Rates Canada",
  description: "Find the lowest mortgage rates in Vancouver and Greater Vancouver Area. Compare rates from top BC lenders, understand Vancouver market conditions.",
  keywords: "Vancouver mortgage rates, GVA mortgage rates, BC mortgage rates, Vancouver mortgage broker, Vancouver home buyer",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/vancouver",
  },
  openGraph: {
    title: "Best Mortgage Rates Vancouver 2025",
    description: "Compare the lowest mortgage rates from Vancouver's top lenders",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/vancouver",
  },
};

export default function VancouverPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Vancouver",
            description: "Best mortgage rates in Vancouver and Greater Vancouver Area",
            areaServed: {
              "@type": "City",
              name: "Vancouver",
              containedIn: "British Columbia",
            },
            url: "https://latestmortgagerates.ca/cities/vancouver",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Vancouver</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Vancouver 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Compare rates for Vancouver and the Greater Vancouver Area</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Rates Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Vancouver Mortgage Rates</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">5-Year Fixed Rate</p>
                  <p className="text-3xl font-bold text-blue-600">4.14%</p>
                  <p className="text-sm text-gray-500">Starting from</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">5-Year Variable Rate</p>
                  <p className="text-3xl font-bold text-green-600">3.80%</p>
                  <p className="text-sm text-gray-500">Starting from</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">Vancouver lenders often offer slightly lower rates than the national average due to competitive market conditions.</p>
              
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All Vancouver Rates →
                </Link>
              </div>
            </section>

            {/* Vancouver Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vancouver Housing Market Overview</h2>
              
              <p className="text-gray-700 mb-4">
                The Greater Vancouver Area (GVA) is Canada's most expensive housing market. Average home prices reflect the region's desirability, limited land, and strong demand.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Average Home Prices (2025)</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Detached Homes</p>
                  <p className="text-xl font-bold text-gray-900">$2,100,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Townhouses</p>
                  <p className="text-xl font-bold text-gray-900">$1,200,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Condos</p>
                  <p className="text-xl font-bold text-gray-900">$750,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Apartments</p>
                  <p className="text-xl font-bold text-gray-900">$580,000</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">BC Property Transfer Tax</h3>
              
              <p className="text-gray-700 mb-4">
                British Columbia's Property Transfer Tax calculation:
              </p>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>1% on first $200,000</li>
                <li>2% on $200,000 to $2,000,000</li>
                <li>3% on $2,000,000 to $3,000,000</li>
                <li>5% on amounts over $3,000,000</li>
              </ul>
              
              <p className="text-gray-700 mt-4">
                <strong>First-Time Buyer Exemption:</strong> Full exemption on properties under $500,000; partial exemption up to $525,000.
              </p>
            </section>

            {/* Vancouver-Specific Considerations */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vancouver Market Factors</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Foreign Buyer Ban</h3>
                  <p className="text-gray-700">Non-Canadians cannot purchase residential property for 2+ years, affecting demand.</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Speculation Tax</h3>
                  <p className="text-gray-700">The BC Speculation and Vacancy Tax applies to certain areas for properties not occupied as primary residences.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Credit Union Strength</h3>
                  <p className="text-gray-700">Vancouver has strong credit unions like Vancity offering competitive rates and programs.</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Environmental Factors</h3>
                  <p className="text-gray-700">Some lenders offer green mortgage incentives for energy-efficient homes.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Vancouver Mortgage Insights</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Credit unions often have best rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">30-year amortization common for 20%+ down</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">First-time buyer exemptions available</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Related Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog/closing-costs-canada" className="text-blue-600 hover:underline">BC Closing Costs</Link></li>
                <li><Link href="/blog/best-mortgage-rates-vancouver" className="text-blue-600 hover:underline">Vancouver Rates Guide</Link></li>
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Compare: Toronto</Link></li>
                <li><Link href="/cities/calgary" className="text-blue-600 hover:underline">Compare: Calgary</Link></li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Compare Vancouver Rates</h3>
              <p className="text-gray-600 text-sm mb-4">See rates from credit unions, banks, and online lenders.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                View Rates
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
