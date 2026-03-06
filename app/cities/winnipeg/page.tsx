import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Winnipeg 2025 | Manitoba Mortgages",
  description: "Find the lowest mortgage rates in Winnipeg. Compare rates from Manitoba lenders and enjoy affordable housing in the Prairies.",
  keywords: "Winnipeg mortgage rates, Winnipeg mortgage broker, Manitoba mortgage rates, Winnipeg home buyer, affordable housing Winnipeg",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/winnipeg",
  },
  openGraph: {
    title: "Best Mortgage Rates Winnipeg 2025",
    description: "Compare Winnipeg mortgage rates. Affordable housing and low cost of living in Manitoba.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/winnipeg",
  },
};

export default function WinnipegPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Winnipeg",
            description: "Best mortgage rates in Winnipeg, Manitoba",
            areaServed: {
              "@type": "City",
              name: "Winnipeg",
              containedIn: "Manitoba",
            },
            url: "https://latestmortgagerates.ca/cities/winnipeg",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Winnipeg</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>🌾 Affordable Prairie Living</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Winnipeg 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Canada's most affordable major city with quality of life</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Winnipeg Mortgage Rates</h2>
              
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
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">🏡 Winnipeg Housing Market</h3>
                <p className="text-blue-800">
                  Winnipeg consistently ranks as Canada's most affordable major city. With average home prices around $370,000, homeownership is achievable for many families earning median income.
                </p>
              </div>
              
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All Winnipeg Rates →
                </Link>
              </div>
            </section>

            {/* Winnipeg Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Winnipeg Housing Market Overview</h2>
              
              <p className="text-gray-700 mb-4">
                As the gateway to the West and Manitoba's capital, Winnipeg offers a unique combination of big-city amenities and small-town affordability. The city's diverse economy and cultural scene make it an attractive place to call home.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Average Home Prices (2025)</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Detached Homes</p>
                  <p className="text-xl font-bold text-gray-900">$425,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Semi-Detached</p>
                  <p className="text-xl font-bold text-gray-900">$315,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Townhouses</p>
                  <p className="text-xl font-bold text-gray-900">$285,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Condos</p>
                  <p className="text-xl font-bold text-gray-900">$225,000</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Why Buy in Winnipeg?</h3>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Most Affordable:</strong> Lowest home prices of major Canadian cities</li>
                <li><strong>Land Transfer Tax:</strong> Manitoba has lower LTT than Ontario/BC</li>
                <li><strong>Diverse Economy:</strong> Manufacturing, agriculture, tech, healthcare</li>
                <li><strong>Arts & Culture:</strong> Cultural Capital of Canada designation</li>
                <li><strong>Low Cost of Living:</strong> Utilities, insurance, food all affordable</li>
              </ul>
            </section>

            {/* Land Transfer Tax */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Manitoba Land Transfer Tax</h2>
              
              <p className="text-gray-700 mb-4">
                Manitoba uses a tiered land transfer tax system that's more affordable than Ontario or BC:
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-semibold text-gray-900">Property Value</th>
                      <th className="p-3 text-left font-semibold text-gray-900">Tax Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="p-3 text-gray-700">First $30,000</td>
                      <td className="p-3 text-green-700 font-semibold">No tax</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">$30,000 - $90,000</td>
                      <td className="p-3 text-gray-700">0.5%</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">$90,000 - $150,000</td>
                      <td className="p-3 text-gray-700">1.0%</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">$150,000 - $200,000</td>
                      <td className="p-3 text-gray-700">1.5%</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">Over $200,000</td>
                      <td className="p-3 text-gray-700">2.0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800">
                  <strong>Example:</strong> On a $400,000 home, Manitoba LTT = $5,720
                  <br/>
                  Same home in Toronto = $11,425 (provincial + municipal)
                  <br/>
                  Same home in Vancouver = $6,000+
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Winnipeg Highlights</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Most affordable big city</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Low land transfer tax</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Diverse economy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Growing tech sector</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/calgary" className="text-blue-600 hover:underline">Calgary Rates</Link></li>
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/vancouver" className="text-blue-600 hover:underline">Vancouver Rates</Link></li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6 mt-6 border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">First-Time Buyer Benefit</h3>
              <p className="text-green-800 text-sm">
                First-time buyers in Manitoba can claim a $2,000 tax credit toward land transfer tax. On a $200,000 home, this often covers the entire tax!
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
