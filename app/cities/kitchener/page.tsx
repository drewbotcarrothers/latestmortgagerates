import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Kitchener-Waterloo 2025 | Tech Hub Mortgages",
  description: "Find the lowest mortgage rates in Kitchener-Waterloo. Compare rates from Ontario's fastest-growing tech region.",
  keywords: "Kitchener mortgage rates, Waterloo mortgage rates, Kitchener-Waterloo mortgage broker, KW mortgage, Cambridge mortgage",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/kitchener",
  },
  openGraph: {
    title: "Best Mortgage Rates Kitchener-Waterloo 2025",
    description: "Compare Kitchener-Waterloo mortgage rates. Canada's Silicon Valley with high-paying tech jobs.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/kitchener",
  },
};

export default function KitchenerPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Kitchener-Waterloo",
            description: "Best mortgage rates in Kitchener-Waterloo, Ontario",
            areaServed: {
              "@type": "City",
              name: "Kitchener-Waterloo",
              containedIn: "Ontario",
            },
            url: "https://latestmortgagerates.ca/cities/kitchener",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Kitchener-Waterloo</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>💻 Canada's Silicon Valley</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Kitchener-Waterloo 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Tech jobs, innovation and affordable housing in Ontario's tech triangle</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Kitchener-Waterloo Mortgage Rates</h2>
              
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
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-purple-900 mb-2">💻 Tech Triangle Advantage</h3>
                <p className="text-purple-800">
                  With Google, Shopify, OpenText, Communitech, and hundreds of startups, KW has some of Canada's highest-paying tech jobs. Higher incomes mean better mortgage qualification for tech workers.
                </p>
              </div>
              
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All KW Rates →
                </Link>
              </div>
            </section>

            {/* KW Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Kitchener-Waterloo Market Overview</h2>
              
              <p className="text-gray-700 mb-4">
                Canada's premier tech hub offers the perfect blend of innovation, good jobs, and relatively affordable housing compared to Toronto. The "Tech Triangle" (Kitchener-Waterloo-Cambridge) attracts talent from around the world.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Average Home Prices (2025)</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Detached - Waterloo</p>
                  <p className="text-xl font-bold text-gray-900">$885,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Detached - Kitchener</p>
                  <p className="text-xl font-bold text-gray-900">$795,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Detached - Cambridge</p>
                  <p className="text-xl font-bold text-gray-900">$765,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Condos (Region)</p>
                  <p className="text-xl font-bold text-gray-900">$485,000</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Why Choose KW?</h3>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Tech Jobs:</strong> Google, Shopify, OpenText, D2L, top employers</li>
                <li><strong>High Incomes:</strong> Tech salaries average $95K-150K</li>
                <li><strong>Startup Culture:</strong> Communitech hub supports entrepreneurship</li>
                <li><strong>Universities:</strong> University of Waterloo (top tech), Wilfrid Laurier</li>
                <li><strong>GO Train:</strong> Express train to Toronto in ~90 mins</li>
                <li><strong>Value:</strong> $200K+ cheaper than Toronto for same tech salary</li>
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">KW Highlights</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Top tech employers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">High-tech salaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Cheaper than Toronto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Startup ecosystem</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/hamilton" className="text-blue-600 hover:underline">Hamilton Rates</Link></li>
                <li><Link href="/cities/london" className="text-blue-600 hover:underline">London Rates</Link></li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 mt-6 border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">Tech Worker Bonus</h3>
              <p className="text-purple-800 text-sm">
                Many tech companies offer relocation bonuses and mortgage assistance programs. Ask your HR department if purchasing a home qualifies for benefits!
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
