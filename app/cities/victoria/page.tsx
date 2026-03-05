import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Victoria 2025 | BC Capital Mortgages",
  description: "Find the lowest mortgage rates in Victoria BC. Compare rates from Vancouver Island lenders in British Columbia's capital.",
  keywords: "Victoria mortgage rates, Victoria mortgage broker, Vancouver Island mortgage, BC mortgage rates, Victoria home buyer",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/victoria",
  },
  openGraph: {
    title: "Best Mortgage Rates Victoria 2025",
    description: "Compare Victoria mortgage rates. Island living with mild climate in BC's capital.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/victoria",
  },
};

export default function VictoriaPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Victoria",
            description: "Best mortgage rates in Victoria, British Columbia",
            areaServed: {
              "@type": "City",
              name: "Victoria",
              containedIn: "British Columbia",
            },
            url: "https://latestmortgagerates.ca/cities/victoria",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Victoria</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>🌲 Vancouver Island - Canada's Garden City</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Victoria 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Mild weather, island lifestyle, and high quality of life</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Victoria Mortgage Rates</h2>
              
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
                <h3 className="font-semibold text-blue-900 mb-2">🌲 The Victoria Lifestyle</h3>
                <p className="text-blue-800">
                  Victoria offers the mildest climate in Canada, with less than 30cm of snow annually. Golf year-round, enjoy ocean activities, and skip the -30°C winters of the Prairies.
                </p>
              </div>
              
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All Victoria Rates →
                </Link>
              </div>
            </section>

            {/* Victoria Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Victoria Housing Market Overview</h2>
              
              <p className="text-gray-700 mb-4">
                Victoria combines island charm with urban amenities. British Columbia's capital has seen significant price growth as retirees and remote workers discover the mild climate and high quality of life.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Average Home Prices (2025)</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Detached Homes</p>
                  <p className="text-xl font-bold text-gray-900">$945,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Semi-Detached</p>
                  <p className="text-xl font-bold text-gray-900">$785,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Townhouses</p>
                  <p className="text-xl font-bold text-gray-900">$695,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Condos</p>
                  <p className="text-xl font-bold text-gray-900">$525,000</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Why Move to Victoria?</h3>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Best Climate:</strong> Mildest in Canada - rarely hits freezing</li>
                <li><strong>Garden City:</strong> Flowers bloom year-round, minimal winter</li>
                <li><strong>Ocean Lifestyle:</strong> Sailing, kayaking, whale watching</li>
                <li><strong>Retirement Friendly:</strong> Popular destination for retirees</li>
                <li><strong>Tech Hub:</strong> Tech sector growing significantly</li>
                <li><strong>Tourism & Government:</strong> Stable employment sectors</li>
              </ul>
            </section>

            {/* Victoria vs Vancouver */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Victoria vs Vancouver Island Living</h2>
              
              <p className="text-gray-700 mb-4">
                How does Victoria compare to Vancouver across the strait?
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-semibold text-gray-900">Factor</th>
                      <th className="p-3 text-left font-semibold text-green-900">Victoria</th>
                      <th className="p-3 text-left font-semibold text-blue-900">Vancouver</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="p-3 text-gray-700">Avg Detached Price</td>
                      <td className="p-3 text-green-700 font-semibold">$945,000</td>
                      <td className="p-3 text-blue-700">$2,350,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">Avg Condo Price</td>
                      <td className="p-3 text-green-700 font-semibold">$525,000</td>
                      <td className="p-3 text-blue-700">$775,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">Population</td>
                      <td className="p-3 text-green-700">393,000</td>
                      <td className="p-3 text-blue-700">2.6M metro</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">Annual Snow</td>
                      <td className="p-3 text-green-700">27cm</td>
                      <td className="p-3 text-blue-700">44cm</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">Commute</td>
                      <td className="p-3 text-green-700">15-20 min</td>
                      <td className="p-3 text-blue-700">45-60 min</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                <p className="text-amber-800">
                  <strong>Trade-off:</strong> Victoria has lower prices than Vancouver but BC's Property Transfer Tax still applies (up to 3% over $2M). Also, ferry travel to the mainland can be expensive ($75+ each way with car).
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Victoria Highlights</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Best Canadian climate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Island lifestyle</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">More affordable than Vancouver</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Year-round outdoor activities</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/vancouver" className="text-blue-600 hover:underline">Vancouver Rates</Link></li>
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/calgary" className="text-blue-600 hover:underline">Calgary Rates</Link></li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6 mt-6 border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">Island Living Costs</h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• BC Ferry: $17-$75 one way</li>
                <li>• Lower heating bills</li>
                <li>• Higher food costs (transport)</li>
                <li>• No bridge tolls</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
