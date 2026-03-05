import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Montreal 2025 | Latest Mortgage Rates Canada",
  description: "Find the lowest mortgage rates in Montreal. Compare rates from Quebec lenders, understand the Quebec mortgage market, and find local mortgage brokers.",
  keywords: "Montreal mortgage rates, Quebec mortgage rates, Montreal mortgage broker, best rates Montreal, Montreal home buyer, hypotheque Montreal",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/montreal",
  },
  openGraph: {
    title: "Best Mortgage Rates Montreal 2025",
    description: "Compare the lowest mortgage rates from Montreal and Quebec lenders",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/montreal",
  },
};

export default function MontrealPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Montreal",
            description: "Best mortgage rates in Montreal, Quebec",
            areaServed: {
              "@type": "City",
              name: "Montreal",
              containedIn: "Quebec",
            },
            url: "https://latestmortgagerates.ca/cities/montreal",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Montreal</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Montreal 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Compare rates from Quebec lenders and understand the unique Montreal market</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Montreal Mortgage Rates</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">5-Year Fixed Rate</p>
                  <p className="text-3xl font-bold text-blue-600">4.24%</p>
                  <p className="text-sm text-gray-500">Starting from</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">5-Year Variable Rate</p>
                  <p className="text-3xl font-bold text-green-600">3.90%</p>
                  <p className="text-sm text-gray-500">Starting from</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All Montreal Rates →
                </Link>
              </div>
            </section>

            {/* Montreal Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Montreal Housing Market Overview</h2>
              
              <p className="text-gray-700 mb-4">
                Montreal offers relative affordability compared to Toronto and Vancouver. The market has unique characteristics including a higher prevalence of multiplex housing and strong credit union presence.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Average Home Prices (2025)</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Single Family</p>
                  <p className="text-xl font-bold text-gray-900">$580,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Condo</p>
                  <p className="text-xl font-bold text-gray-900">$420,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Plex (2-5 units)</p>
                  <p className="text-xl font-bold text-gray-900">$750,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Overall Average</p>
                  <p className="text-xl font-bold text-gray-900">$540,000</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Quebec Mortgage Market Characteristics</h3>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Welcome Tax (Taxe de Bienvenue):</strong> Progressive rates based on property value</li>
                <li><strong>Strong Credit Union Presence:</strong> Caisses populaires (Desjardins) are very competitive</li>
                <li><strong>Multiplex Housing:</strong> Duplexes, triplexes, and quadruplexes are common</li>
                <li><strong>Different Qualification Rules:</strong> Some lenders have unique Quebec-specific criteria</li>
                <li><strong>First-Time Buyer Programs:</strong> R&eacute;noVert and other provincial programs available</li>
              </ul>
            </section>

            {/* Welcome Tax Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quebec Welcome Tax (Taxe de Bienvenue)</h2>
              
              <p className="text-gray-700 mb-4">
                Quebec's Property Transfer Tax (commonly called Welcome Tax) applies to property purchases:
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700">First $55,000</span>
                  <span className="font-semibold">0.5%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700">$55,000 - $250,000</span>
                  <span className="font-semibold">1.0%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700">$250,000 - $500,000</span>
                  <span className="font-semibold">1.5%</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">Over $500,000</span>
                  <span className="font-semibold">3.0%</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm">
                *Montreal has additional municipal taxes on higher-value properties
              </p>
            </section>

            {/* Credit Union Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Credit Union Advantage in Quebec</h2>
              
              <p className="text-gray-700 mb-4">
                Quebec's credit union network (Desjardins caisses populaires) offers unique benefits:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Competitive Rates</h3>
                  <p className="text-gray-700">Desjardins and other caisses often beat big bank rates.</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Local Knowledge</h3>
                  <p className="text-gray-700">Deep understanding of the Quebec market and regulations.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Member Benefits</h3>
                  <p className="text-gray-700">Dividends and profit-sharing for members.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Montreal Quick Facts</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Affordable vs Toronto/Vancouver</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Strong credit union options</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Multiplex housing available</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Vibrant rental market</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto</Link></li>
                <li><Link href="/cities/vancouver" className="text-blue-600 hover:underline">Vancouver</Link></li>
                <li><Link href="/cities/calgary" className="text-blue-600 hover:underline">Calgary</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
