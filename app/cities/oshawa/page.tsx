import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Oshawa 2025 | Latest Mortgage Rates Canada",
  description: "Find the lowest mortgage rates in Oshawa. Compare rates from top Ontario lenders, understand Oshawa market conditions, and connect with local mortgage brokers.",
  keywords: "Oshawa mortgage rates, Durham mortgage rates, Oshawa mortgage broker, best rates Oshawa, Oshawa home buyer",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/oshawa",
  },
  openGraph: {
    title: "Best Mortgage Rates Oshawa 2025",
    description: "Compare the lowest mortgage rates from Oshawa's top lenders",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/oshawa",
  },
};

export default function OshawaPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Oshawa",
            description: "Best mortgage rates in Oshawa and Durham Region",
            areaServed: {
              "@type": "City",
              name: "Oshawa",
              containedIn: "Ontario",
            },
            url: "https://latestmortgagerates.ca/cities/oshawa",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Oshawa</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Oshawa 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Compare the lowest rates from Durham Region lenders and find your perfect mortgage</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Oshawa Mortgage Rates</h2>
              <p className="text-gray-600 mb-6">Updated daily with the best rates from Durham Region lenders including major banks, credit unions, and online lenders.</p>
              
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
                  Compare All Oshawa Rates →
                </Link>
              </div>
            </section>

            {/* Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Oshawa Housing Market Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">$720K</p>
                  <p className="text-sm text-gray-600">Average Home Price</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">3.8%</p>
                  <p className="text-sm text-gray-600">YoY Price Change</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">25</p>
                  <p className="text-sm text-gray-600">Days on Market</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Oshawa serves as Durham Region's largest city and a major commuter hub for Toronto via GO Train and Highway 401. 
                With the LRT under construction and GM's continued presence as a major employer, the city offers stability with 
                growth potential.
              </p>
              <p className="text-gray-600">
                The Durham real estate market attracts buyers seeking 905 area affordability with rapid transit access. 
                With the future LRT connecting to the new Courtice GO Station, Oshawa offers excellent connectivity for commuters 
                while maintaining a lower cost of living than the inner GTA.
              </p>
            </section>

            {/* First-Time Buyers */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Home Buyers in Oshawa</h2>
              <p className="text-gray-600 mb-4">
                Oshawa provides the most affordable entry to the GTA for first-time buyers. Located within the Greater 
                Toronto and Hamilton Area, Oshawa qualifies for federal first-time buyer programs while offering significant 
                savings over Toronto proper.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Minimum Down Payment (5%)</p>
                  <p className="text-2xl font-bold text-blue-600">~$36,000</p>
                  <p className="text-xs text-gray-500">Based on $720K average</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Recommended Down Payment (10%)</p>
                  <p className="text-2xl font-bold text-green-600">~$72,000</p>
                  <p className="text-xs text-gray-500">Reduces mortgage insurance</p>
                </div>
              </div>
              <p className="text-gray-600">
                Oshawa buyers benefit from all Ontario first-time buyer programs including the land transfer tax rebate. 
                With fast-moving inventory and quick market turnover, getting pre-approved is essential for competing in this 
                active market.
              </p>
            </section>

            {/* Regional Lender Highlights */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Oshawa Lenders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Durham Region Credit Unions</h3>
                  <p className="text-sm text-gray-600">Regional credit unions with competitive rates and local knowledge of the Durham market.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Oshawa Mortgage Brokers</h3>
                  <p className="text-sm text-gray-600">Local experts specializing in Durham mortgages with relationships at multiple lenders.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Digital Lenders</h3>
                  <p className="text-sm text-gray-600">Online platforms offering quick approvals and competitive rates for Oshawa's fast market.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Major Banks</h3>
                  <p className="text-sm text-gray-600">National banks with strong Durham branch networks serving the booming 905 market.</p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>How's the commute to Toronto from Oshawa?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    The GO Train Lakeshore East line reaches Union Station in about 50 minutes from Oshawa GO. Highway 401 
                    provides driving access, though traffic increases closer to Toronto. The upcoming LRT will improve local 
                    transit connectivity.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>Should I get fixed or variable in Oshawa?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    In Oshawa's fast-moving market, fixed rates provide stability during your transition. However, variable 
                    rates offer lower initial payments. Most buyers choose 5-year fixed for longer-term stability.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>Is Oshawa a good investment?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    Yes! Oshawa offers strong fundamentals: transit expansion, GM investments, university growth, and 
                    relative affordability compared to Toronto. The rental market is strong due to UOIT and Durham College students.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>What neighborhoods should I consider?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    North Oshawa offers newer developments near the university. Downtown provides character homes and amenities. 
                    East and West Oshawa give established family neighborhoods. Courtice and Bowmanville are nearby options.
                  </p>
                </details>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div className="bg-blue-600 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Need an Oshawa Mortgage Expert?</h3>
              <p className="text-blue-100 mb-4">Connect with local brokers who know the Durham Region market.</p>
              <Link href="/#contact" className="block text-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition">
                Get Free Quotes
              </Link>
            </div>

            {/* Rate Calculator */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Payment Calculator</h3>
              <p className="text-gray-600 text-sm mb-4">Estimate your monthly payments for Oshawa homes.</p>
              <div className="bg-gray-50 rounded p-3 mb-3">
                <p className="text-sm text-gray-600">Example: $720K home, 10% down</p>
                <p className="text-xl font-bold text-blue-600">~$3,500/month</p>
                <p className="text-xs text-gray-500">Based on 4.19% 5-year fixed</p>
              </div>
              <Link href="/#calculator" className="block text-center text-blue-600 hover:text-blue-800 font-medium">
                Full Calculator →
              </Link>
            </div>

            {/* Related Cities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Durham Region</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/cities/whitby" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Whitby (Coming Soon)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cities/courtice" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Courtice (Coming Soon)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cities/ajax" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Ajax (Coming Soon)</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Related Cities</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/cities/toronto" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Toronto Mortgage Rates</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cities/barrie" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Barrie Mortgage Rates</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cities/hamilton" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Hamilton Mortgage Rates</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
