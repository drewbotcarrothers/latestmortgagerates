import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Hamilton 2025 | Ontario Steel City",
  description: "Find the lowest mortgage rates in Hamilton. Compare rates from Golden Horseshoe lenders in this growing alternative to Toronto.",
  keywords: "Hamilton mortgage rates, Hamilton mortgage broker, Golden Horseshoe mortgage, Toronto alternative, Hamilton home buyer",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/hamilton",
  },
  openGraph: {
    title: "Best Mortgage Rates Hamilton 2025",
    description: "Compare Hamilton mortgage rates. Affordable alternative to Toronto in the Golden Horseshoe.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/hamilton",
  },
};

export default function HamiltonPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Hamilton",
            description: "Best mortgage rates in Hamilton, Ontario",
            areaServed: {
              "@type": "City",
              name: "Hamilton",
              containedIn: "Ontario",
            },
            url: "https://latestmortgagerates.ca/cities/hamilton",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Hamilton</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>🏭 Toronto Alternative - 40% Cheaper!</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Hamilton 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">The Golden Horseshoe's hidden gem for affordable homeownership</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Hamilton Mortgage Rates</h2>
              
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
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-900 mb-2">💰 Hamilton vs Toronto Price Gap</h3>
                <p className="text-green-800">
                  Hamilton homes are 40-50% cheaper than Toronto. A Toronto buyer can buy in Hamilton with $200K+ left over - enough to pay off a significant portion of their mortgage!
                </p>
              </div>
              
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All Hamilton Rates →
                </Link>
              </div>
            </section>

            {/* Hamilton Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hamilton Housing Market Overview</h2>
              
              <p className="text-gray-700 mb-4">
                Once known as Canada's steel town, Hamilton has transformed into a diverse, arts-focused city with incredible water access along Lake Ontario. Downtown revitalization and GO Train access to Toronto have made it a premier destination for escaping Toronto prices.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Average Home Prices (2025)</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Detached Homes</p>
                  <p className="text-xl font-bold text-gray-900">$825,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Semi-Detached</p>
                  <p className="text-xl font-bold text-gray-900">$725,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Townhouses</p>
                  <p className="text-xl font-bold text-gray-900">$685,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Condos</p>
                  <p className="text-xl font-bold text-gray-900">$475,000</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Why Choose Hamilton?  </h3>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>GO Train Access:</strong> 1 hour to Toronto Union Station</li>
                <li><strong>Waterfront Living:</strong> Beach access, waterfront trail, harbor</li>
                <li><strong>Arts District:</strong> James Street North, galleries, festivals</li>
                <li><strong>Healthcare Hub:</strong> McMaster University teaching hospital</li>
                <li><strong>Nature:</strong> Niagara Escarpment, conservation areas</li>
                <li><strong>Value:</strong> Better house for your money than GTA</li>
              </ul>
            </section>

            {/* Hamilton vs Toronto */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hamilton vs Toronto: Commuter Comparison</h2>
              
              <p className="text-gray-700 mb-4">
                Many Hamilton residents commute to Toronto. Is it worth it? Let's break down the numbers:
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-semibold text-gray-900">Factor</th>
                      <th className="p-3 text-left font-semibold text-blue-900">Hamilton</th>
                      <th className="p-3 text-left font-semibold text-purple-900">Toronto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="p-3 text-gray-700">Avg Detached Price</td>
                      <td className="p-3 text-blue-700 font-semibold">$825,000</td>
                      <td className="p-3 text-purple-700">$1,450,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">Monthly Payment (20% down)</td>
                      <td className="p-3 text-blue-700 font-semibold">$4,250</td>
                      <td className="p-3 text-purple-700">$7,485</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">Minimum Down Payment (10%)</td>
                      <td className="p-3 text-blue-700 font-semibold">$82,500</td>
                      <td className="p-3 text-purple-700">$145,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">GO Train Monthly Pass</td>
                      <td className="p-3 text-blue-700">$433</td>
                      <td className="p-3 text-purple-700">$0</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="p-3 text-gray-700 font-semibold">Total Monthly Cost</td>
                      <td className="p-3 text-green-700 font-bold">$4,683</td>
                      <td className="p-3 text-purple-700">$7,485</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800">
                  <strong>Bottom Line:</strong> Even with commuting costs, you save $2,800+/month buying in Hamilton vs Toronto. That's $33,600/year!
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Hamilton Highlights</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">40-50% cheaper than Toronto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">GO Train to Toronto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Lake Ontario waterfront</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Downtown revitalization</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/ottawa" className="text-blue-600 hover:underline">Ottawa Rates</Link></li>
                <li><Link href="/cities/london" className="text-blue-600 hover:underline">London Rates</Link></li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">First-Time Buyer</h3>
              <p className="text-blue-800 text-sm">
                Hamilton is excellent for first-time buyers escaping Toronto. You get a real house (not a condo) for $600K-$800K!
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
