import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Quebec City 2025 | Ville de Québec Mortgages",
  description: "Find the lowest mortgage rates in Quebec City. Compare rates from lenders in Ville de Québec, La Capitale-Nationale region.",
  keywords: "Quebec City mortgage rates, Ville de Québec mortgage, Quebec City mortgage broker, QC mortgage, Ville de Québec home buyer",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/quebec-city",
  },
  openGraph: {
    title: "Best Mortgage Rates Quebec City 2025",
    description: "Compare Quebec City mortgage rates. Historic beauty meets affordability in Canada's francophone capital.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/quebec-city",
  },
};

export default function QuebecCityPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Quebec City",
            description: "Best mortgage rates in Quebec City",
            areaServed: {
              "@type": "City",
              name: "Quebec City",
              containedIn: "Quebec",
            },
            url: "https://latestmortgagerates.ca/cities/quebec-city",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Quebec City</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>🏰 Historic Beauty - World Heritage Site</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Quebec City 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">UNESCO heritage, European charm, and affordable francophone living</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Quebec City Mortgage Rates</h2>
              
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
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-yellow-900 mb-2">🏰 UNESCO World Heritage Living</h3>
                <p className="text-yellow-800">
                  Quebec City's historic Old Town is a UNESCO World Heritage Site. Own a piece of history while enjoying North American safety, healthcare, and infrastructure with European charm.
                </p>
              </div>
              
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All Quebec City Rates →
                </Link>
              </div>
            </section>

            {/* QC Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quebec City Housing Market Overview</h2>
              
              <p className="text-gray-700 mb-4">
                North America's only fortified city offers a unique blend of Old World charm and modern convenience. As Quebec's government and tourism capital, it provides stable employment and a high quality of life.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Average Home Prices (2025)</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Detached Homes</p>
                  <p className="text-xl font-bold text-gray-900">$495,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Semi-Detached</p>
                  <p className="text-xl font-bold text-gray-900">$385,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Townhouses</p>
                  <p className="text-xl font-bold text-gray-900">$335,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Condos</p>
                  <p className="text-xl font-bold text-gray-900">$265,000</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Why Live in Quebec City?</h3>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Affordable Living:</strong> Lower prices than Montreal, fraction of Toronto/Vancouver costs</li>
                <li><strong>Historic Beauty:</strong> UNESCO World Heritage Old Town</li>
                <li><strong>Government Hub:</strong> Provincial capital with stable jobs</li>
                <li><strong>Tourism:</strong> $10B+ industry creates service jobs</li>
                <li><strong>Winter Wonderland:</strong> Carnival, skiing, and snow activities</li>
                <li><strong>Bilingual:</strong> French-speaking but English widely available</li>
                <li><strong>Education:</strong> Laval University, ENAP major institutions</li>
              </ul>
            </section>

            {/* QC Considerations */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quebec Home Buying Considerations</h2>
              
              <p className="text-gray-700 mb-4">
                Buying in Quebec differs from other provinces:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Welcome Tax (Taxe de Bienvenue)</h3>
                  <p className="text-gray-700">Quebec's version of land transfer tax. Similar to Ontario but municipalities set the rates. Quebec City charges progressive rates (0.5-1.5%).</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Notary vs Lawyer</h3>
                  <p className="text-gray-700">In Quebec, notaries (notaires) handle real estate transactions instead of lawyers. They ensure legal compliance.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">French Language</h3>
                  <p className="text-gray-700">All legal documents are in French. While many professionals are bilingual, knowing French is helpful. Most government jobs require French.</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Property Assessment</h3>
                  <p className="text-gray-700">Cities assess properties differently. Check with Ville de Québec for current tax rolls and assessment values.</p>
                </div>
              </div>
            </section>

            {/* QC vs MTL */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quebec City vs Montreal</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-semibold text-gray-900">Factor</th>
                      <th className="p-3 text-left font-semibold text-yellow-900">Quebec City</th>
                      <th className="p-3 text-left font-semibold text-green-900">Montreal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="p-3 text-gray-700">Avg Home Price</td>
                      <td className="p-3 text-yellow-700 font-semibold">$495,000</td>
                      <td className="p-3 text-green-700">$575,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">Population</td>
                      <td className="p-3 text-yellow-700">550,000</td>
                      <td className="p-3 text-green-700">1.8M</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">Vibe</td>
                      <td className="p-3 text-yellow-700">Historic, small-city</td>
                      <td className="p-3 text-green-700">Cosmopolitan, big-city</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">Employment</td>
                      <td className="p-3 text-yellow-700">Government, tourism</td>
                      <td className="p-3 text-green-700">Diverse, tech, finance</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-gray-700">English Services</td>
                      <td className="p-3 text-yellow-700">Less available</td>
                      <td className="p-3 text-green-700">Widely available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Quebec City Highlights</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">UNESCO heritage site</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Most affordable major QC city</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Government employment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Historic beauty</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/montreal" className="text-blue-600 hover:underline">Montreal Rates</Link></li>
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/ottawa" className="text-blue-600 hover:underline">Ottawa Rates</Link></li>
              </ul>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6 mt-6 border border-yellow-200">
              <h3 className="font-bold text-yellow-900 mb-2">French Language</h3>
              <p className="text-yellow-800 text-sm">
                While many services are available in English, learning French significantly improves the Quebec City experience. Consider language classes if moving here!
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
