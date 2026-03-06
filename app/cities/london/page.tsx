import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates London Ontario 2025 | Forest City Mortgages",
  description: "Find the lowest mortgage rates in London Ontario. Compare rates from Southwestern Ontario lenders in this affordable university city.",
  keywords: "London Ontario mortgage rates, London mortgage broker, Forest City mortgage, Western University, London home buyer",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/london",
  },
  openGraph: {
    title: "Best Mortgage Rates London Ontario 2025",
    description: "Compare London Ontario mortgage rates. Affordable university city with growing healthcare sector.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/london",
  },
};

export default function LondonPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - London Ontario",
            description: "Best mortgage rates in London, Ontario",
            areaServed: {
              "@type": "City",
              name: "London",
              containedIn: "Ontario",
            },
            url: "https://latestmortgagerates.ca/cities/london",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">London</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>🏫 Forest City - University Town</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in London, Ontario 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Affordable living, top universities, and growing healthcare sector</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current London Ontario Mortgage Rates</h2>
              
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
                <h3 className="font-semibold text-blue-900 mb-2">🏫 Education Economy</h3>
                <p className="text-blue-800">
                  Home to Western University, Fanshawe College, and major teaching hospitals. Education and healthcare are London's economic pillars, creating stable employment.
                </p>
              </div>
              
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All London Rates →
                </Link>
              </div>
            </section>

            {/* London Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">London Housing Market Overview</h2>
              
              <p className="text-gray-700 mb-4">
                The Forest City offers exceptional affordability in Southwestern Ontario. With quality universities, teaching hospitals, and manufacturing employers, London has a stable economy well-suited for first-time buyers.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Average Home Prices (2025)</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Detached Homes</p>
                  <p className="text-xl font-bold text-gray-900">$655,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Semi-Detached</p>
                  <p className="text-xl font-bold text-gray-900">$550,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Townhouses</p>
                  <p className="text-xl font-bold text-gray-900">$485,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Condos</p>
                  <p className="text-xl font-bold text-gray-900">$365,000</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Why Choose London?</h3>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Most Affordable:</strong> Best value in Southwestern Ontario</li>
                <li><strong>Top University:</strong> Western University ranks in Canada's top 10</li>
                <li><strong>Healthcare Hub:</strong> LHSC, St. Joseph's major employers</li>
                <li><strong>Low Crime:</strong> Consistently among Ontario's safest cities</li>
                <li><strong>Short Commutes:</strong> Average 15-20 minutes city-wide</li>
                <li><strong>To Toronto:</strong> 2 hours by car, VIA Rail available</li>
              </ul>
            </section>

            {/* London vs Toronto */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">London vs Toronto: What Your Money Buys</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">$750,000 in London</h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>✓ 3-4 bedroom detached home</li>
                    <li>✓ Large lot (50+ ft frontage)</li>
                    <li>✓ Double garage</li>
                    <li>✓ Finished basement</li>
                    <li>✓ Family neighborhood</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-3">$750,000 in Toronto</h3>
                  <ul className="text-sm text-purple-800 space-y-2">
                    <li>• 1-2 bedroom condo</li>
                    <li>• 600-800 sq ft</li>
                    <li>• Monthly maintenance fees</li>
                    <li>• Parking extra ($50K+)</li>
                    <li>• Downtown or suburban</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800">
                  <strong>Bottom Line:</strong> In London, you get a family home instead of a condo. For remote workers or those who don't need daily Toronto access, London can be life-changing.
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">London Highlights</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Affordable compared to Toronto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Top universities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Major hospitals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Safe, family-friendly</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/kitchener" className="text-blue-600 hover:underline">Kitchener-Waterloo Rates</Link></li>
                <li><Link href="/cities/hamilton" className="text-blue-600 hover:underline">Hamilton Rates</Link></li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">Remote Worker Friendly</h3>
              <p className="text-blue-800 text-sm">
                London is increasingly popular with remote workers who can keep Toronto salaries while enjoying significantly lower home prices and cost of living.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
