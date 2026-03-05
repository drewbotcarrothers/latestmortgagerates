import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Edmonton 2025 | Alberta Capital Mortgages",
  description: "Find the lowest mortgage rates in Edmonton. Compare rates from Alberta lenders and enjoy no land transfer tax in Edmonton.",
  keywords: "Edmonton mortgage rates, Edmonton mortgage broker, Alberta mortgage rates, Edmonton home buyer, no land transfer tax Alberta",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/edmonton",
  },
  openGraph: {
    title: "Best Mortgage Rates Edmonton 2025",
    description: "Compare Edmonton mortgage rates. No land transfer tax and affordable housing in Alberta's capital.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/edmonton",
  },
};

export default function EdmontonPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Edmonton",
            description: "Best mortgage rates in Edmonton, Alberta",
            areaServed: {
              "@type": "City",
              name: "Edmonton",
              containedIn: "Alberta",
            },
            url: "https://latestmortgagerates.ca/cities/edmonton",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Edmonton</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>💰 No Land Transfer Tax - Alberta Advantage!</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Edmonton 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Alberta's capital with affordable homes and major savings on closing costs</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Edmonton Mortgage Rates</h2>
              
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
                <h3 className="font-semibold text-green-900 mb-2">🎯 Edmonton Housing Affordability</h3>
                <p className="text-green-800">
                  Edmonton remains one of Canada's most affordable major cities. With no land transfer tax and average home prices 40% below Calgary, first-time buyers can enter the market with much smaller down payments.
                </p>
              </div>
              
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All Edmonton Rates →
                </Link>
              </div>
            </section>

            {/* Edmonton Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Edmonton Housing Market Overview</h2>
              
              <p className="text-gray-700 mb-4">
                Edmonton offers exceptional value in Canada's housing market. As Alberta's capital and a major hub for government, healthcare, and education employment, the city provides stable housing demand without the premium prices of Calgary.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Average Home Prices (2025)</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Detached Homes</p>
                  <p className="text-xl font-bold text-gray-900">$485,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Semi-Detached</p>
                  <p className="text-xl font-bold text-gray-900">$375,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Townhouses</p>
                  <p className="text-xl font-bold text-gray-900">$285,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Condos</p>
                  <p className="text-xl font-bold text-gray-900">$175,000</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Why Buy in Edmonton?</h3>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Most Affordable Major City:</strong> Lowest average prices among Canada's 6 largest metros</li>
                <li><strong>No Land Transfer Tax:</strong> Keep thousands when you buy</li>
                <li><strong>Stable Government Jobs:</strong> Provincial capital with consistent employment</li>
                <li><strong>Major Healthcare Hub:</strong> UofA Hospital attracts medical professionals</li>
                <li><strong>Education Center:</strong> University of Alberta and NAIT</li>
                <li><strong>Lower Cost of Living:</strong> Cheaper utilities, insurance, and groceries</li>
                <li><strong>River Valley:</strong> North America's largest urban park system</li>
              </ul>
            </section>

            {/* Edmonton vs Calgary */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Edmonton vs Calgary: Choosing Alberta's City</h2>
              
              <p className="text-gray-700 mb-4">
                Both Alberta cities offer no land transfer tax, but they differ significantly in housing costs:
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-semibold text-gray-900">Factor</th>
                      <th className="p-3 text-left font-semibold text-blue-900">Edmonton</th>
                      <th className="p-3 text-left font-semibold text-purple-900">Calgary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="p-3 text-gray-700">Average Home Price</td>
                      <td className="p-3 text-blue-700 font-semibold">$485,000</td>
                      <td className="p-3 text-purple-700">$540,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">Detached Price</td>
                      <td className="p-3 text-blue-700 font-semibold">$485,000</td>
                      <td className="p-3 text-purple-700">$680,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">Condo Price</td>
                      <td className="p-3 text-blue-700 font-semibold">$175,000</td>
                      <td className="p-3 text-purple-700">$295,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">Average Income</td>
                      <td className="p-3 text-blue-700 font-semibold">$62,000</td>
                      <td className="p-3 text-purple-700">$72,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">Economic Focus</td>
                      <td className="p-3 text-blue-700">Government, Healthcare, Education</td>
                      <td className="p-3 text-purple-700">Energy, Finance, Tech</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>Both cities offer no land transfer tax, making them significantly cheaper than Ontario or BC markets. Choose Edmonton for affordability, Calgary for faster income growth.</p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Edmonton Highlights</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">No land transfer tax</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Most affordable major city</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Stable government jobs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Big city amenities</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/calgary" className="text-blue-600 hover:underline">Calgary Rates</Link></li>
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/vancouver" className="text-blue-600 hover:underline">Vancouver Rates</Link></li>
                <li><Link href="/cities/winnipeg" className="text-blue-600 hover:underline">Winnipeg Rates</Link></li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6 mt-6 border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">💰 Edmonton Savings Example</h3>
              <p className="text-green-800 text-sm mb-4">
                Buying a $500,000 home in Edmonton vs Vancouver:
              </p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>🏠 Home price: ~$415K less</li>
                <li>💸 No land transfer tax</li>
                <li>💳 Lower closing costs</li>
              </ul>
              <p className="text-green-900 font-semibold mt-3 text-sm">
                Total savings: ~$430,000!
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
