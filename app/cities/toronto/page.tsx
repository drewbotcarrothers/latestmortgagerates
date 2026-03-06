import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Toronto 2025 | Latest Mortgage Rates Canada",
  description: "Find the lowest mortgage rates in Toronto and GTA. Compare rates from top Canadian lenders, understand Toronto market conditions, and connect with local mortgage brokers.",
  keywords: "Toronto mortgage rates, GTA mortgage rates, Toronto mortgage broker, best rates Toronto, Toronto home buyer",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/toronto",
  },
  openGraph: {
    title: "Best Mortgage Rates Toronto 2025",
    description: "Compare the lowest mortgage rates from Toronto's top lenders",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/toronto",
  },
};

export default function TorontoPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Toronto",
            description: "Best mortgage rates in Toronto and GTA",
            areaServed: {
              "@type": "City",
              name: "Toronto",
              containedIn: "Ontario",
            },
            url: "https://latestmortgagerates.ca/cities/toronto",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Toronto</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Toronto 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Compare the lowest rates from GTA lenders and find your perfect mortgage</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Toronto Mortgage Rates</h2>
              <p className="text-gray-600 mb-6">Updated daily with the best rates from Toronto-area lenders including major banks, credit unions, and online lenders.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">5-Year Fixed Rate</p>
                  <p className="text-3xl font-bold text-blue-600">4.19%</p>
                  <p className="text-sm text-gray-500">Starting from</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">5-Year Variable Rate</p>
                  <p className="text-3xl font-bold text-green-600">3.85%</p>
                  <p className="text-sm text-gray-500">Starting from</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">3-Year Fixed</span>
                  <span className="font-semibold text-gray-900">4.39%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">10-Year Fixed</span>
                  <span className="font-semibold text-gray-900">4.54%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">1-Year Fixed</span>
                  <span className="font-semibold text-gray-900">5.49%</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All Toronto Rates →
                </Link>
              </div>
            </section>

            {/* Toronto Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Toronto Housing Market Overview</h2>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  The Greater Toronto Area (GTA) remains Canada's largest and most expensive housing market. Average home prices in Toronto hover around $1.1-1.2 million, making mortgage rates critical to affordability.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Average Home Prices (2025)</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Detached Homes</p>
                    <p className="text-xl font-bold text-gray-900">$1,450,000</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Semi-Detached</p>
                    <p className="text-xl font-bold text-gray-900">$1,050,000</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Townhouses</p>
                    <p className="text-xl font-bold text-gray-900">$890,000</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Condos</p>
                    <p className="text-xl font-bold text-gray-900">$720,000</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Toronto-Specific Considerations</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li><strong>Land Transfer Tax:</strong> Toronto buyers pay both provincial and municipal LTT, effectively doubling the cost</li>
                  <li><strong>First-Time Buyer Rebates:</strong> Up to $4,000 provincial plus $4,475 municipal rebate available</li>
                  <li><strong>Condo Market:</strong> Toronto has extensive condo inventory with different lending considerations</li>
                  <li><strong>Transit Premium:</strong> Properties near subway lines often qualify for better rates</li>
                  <li><strong>Foreign Buyer Ban:</strong> Non-residents cannot purchase residential property</li>
                </ul>
              </div>
            </section>

            {/* First-Time Buyers Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Home Buyers in Toronto</h2>
              
              <p className="text-gray-700 mb-4">
                Toronto presents unique challenges for first-time buyers due to high prices. Here are specific strategies for Toronto buyers:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Maximize Rebates</h3>
                  <p className="text-gray-700">Apply for both provincial ($4,000) and Toronto municipal ($4,475) land transfer tax rebates.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Consider the FHSA</h3>
                  <p className="text-gray-700">Use the First Home Savings Account for tax-free savings up to $40,000.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Explore Co-Ownership</h3>
                  <p className="text-gray-700">Many Toronto buyers purchase with family members or friends to enter the market.</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Look Beyond Downtown</h3>
                  <p className="text-gray-700">Suburban areas like Scarborough, Etobicoke, and North York offer better value.</p>
                </div>
              </div>
            </section>

            {/* Lenders Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Toronto Mortgage Lenders</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                  <h3 className="font-semibold text-gray-900">Major Banks</h3>
                  <p className="text-sm text-gray-600 mt-1">RBC, TD, Scotiabank, BMO, CIBC</p>
                  <p className="text-sm text-gray-700 mt-2">Widely available, relationship pricing, branch access</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                  <h3 className="font-semibold text-gray-900">Credit Unions</h3>
                  <p className="text-sm text-gray-600 mt-1">Meridian, Vancity (Toronto branch)</p>
                  <p className="text-sm text-gray-700 mt-2">Competitive rates, local focus, flexible terms</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                  <h3 className="font-semibold text-gray-900">Monoline Lenders</h3>
                  <p className="text-sm text-gray-600 mt-1">MCAP, First National, CMLS</p>
                  <p className="text-sm text-gray-700 mt-2">Often lowest rates, broker-only access</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                  <h3 className="font-semibold text-gray-900">Online Lenders</h3>
                  <p className="text-sm text-gray-600 mt-1">Tangerine, EQ Bank, Motusbank</p>
                  <p className="text-sm text-gray-700 mt-2">Digital-first, competitive rates, fast approval</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Toronto Mortgage Calculator</h3>
              <p className="text-gray-600 text-sm mb-4">Calculate your monthly payments for Toronto home prices.</p>
              <Link href="/tools#payment-calculator" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                Calculate Payments
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Related Toronto Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog/closing-costs-canada" className="text-blue-600 hover:underline">Toronto Closing Costs Guide</Link></li>
                <li><Link href="/blog/best-mortgage-rates-toronto" className="text-blue-600 hover:underline">Toronto Rates Deep Dive</Link></li>
                <li><Link href="/blog/first-time-home-buyer-guide-canada" className="text-blue-600 hover:underline">First-Time Buyer Guide</Link></li>
                <li><Link href="/cities/vancouver" className="text-blue-600 hover:underline">Compare: Vancouver</Link></li>
                <li><Link href="/cities/calgary" className="text-blue-600 hover:underline">Compare: Calgary</Link></li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Need Toronto Mortgage Help?</h3>
              <p className="text-gray-600 text-sm mb-4">Connect with Toronto mortgage specialists who understand the local market.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                Get Started
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
