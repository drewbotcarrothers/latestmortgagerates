import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Halifax 2025 | Nova Scotia Mortgages",
  description: "Find the lowest mortgage rates in Halifax. Compare rates from Atlantic Canada lenders in this growing maritime city.",
  keywords: "Halifax mortgage rates, Halifax mortgage broker, Nova Scotia mortgage, Atlantic Canada mortgage, Halifax home buyer",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/halifax",
  },
  openGraph: {
    title: "Best Mortgage Rates Halifax 2025",
    description: "Compare Halifax mortgage rates. Atlantic Canada's fastest-growing city with affordable coastal living.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/halifax",
  },
};

export default function HalifaxPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Halifax",
            description: "Best mortgage rates in Halifax, Nova Scotia",
            areaServed: {
              "@type": "City",
              name: "Halifax",
              containedIn: "Nova Scotia",
            },
            url: "https://latestmortgagerates.ca/cities/halifax",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Halifax</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>🌊 Atlantic Canada's Growth Hub</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Halifax 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Coastal living meets affordability in Nova Scotia's capital</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Halifax Mortgage Rates</h2>
              
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
                <h3 className="font-semibold text-blue-900 mb-2">🌊 The Halifax Boom</h3>
                <p className="text-blue-800">
                  Halifax is Atlantic Canada's fastest-growing city, attracting newcomers from across Canada with affordable coastal living, job growth, and ocean access.
                </p>
              </div>
              
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All Halifax Rates →
                </Link>
              </div>
            </section>

            {/* Halifax Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Halifax Housing Market Overview</h2>
              
              <p className="text-gray-700 mb-4">
                Halifax has experienced unprecedented growth since 2020, with record numbers of Canadians moving from Ontario to Nova Scotia. The city offers urban amenities with small-town charm.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Average Home Prices (2025)</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Detached Homes</p>
                  <p className="text-xl font-bold text-gray-900">$545,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Semi-Detached</p>
                  <p className="text-xl font-bold text-gray-900">$485,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Townhouses</p>
                  <p className="text-xl font-bold text-gray-900">$425,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Condos</p>
                  <p className="text-xl font-bold text-gray-900">$385,000</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Why Move to Halifax?</h3>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Affordable Coastal Living:</strong> Oceanfront homes at a fraction of Vancouver prices</li>
                <li><strong>Population Growth:</strong> Canada&apos;s fastest-growing population</li>
                <li><strong>Tech Hub:</strong> IBM, Microsoft, other tech employers</li>
                <li><strong>Universities:</strong> Dalhousie, Saint Mary's, Mount Saint Vincent</li>
                <li><strong>Quality of Life:</strong> Short commutes, ocean access, affordable dining</li>
                <li><strong>No Provincial Sales Tax on Insurance:</strong> Lower home insurance costs</li>
              </ul>
            </section>

            {/* Nova Scotia Considerations */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nova Scotia Home Buying Considerations</h2>
              
              <p className="text-gray-700 mb-4">
                Buying in Nova Scotia comes with unique factors to consider:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Deed Transfer Tax</h3>
                  <p className="text-gray-700">Nova Scotia calls it "Deed Transfer Tax" and municipalities set their rates. Halifax charges 1.5% for residential properties.</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Property Tax</h3>
                  <p className="text-gray-700">Halifax property tax rate is around 1.03%, competitive with other major cities.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">First-Time Buyer Rebate</h3>
                  <p className="text-gray-700">First-time buyers receive a rebate of the Deed Transfer Tax up to $3,000.</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Heating Costs</h3>
                  <p className="text-gray-700">Winters are milder than the Prairies but heating oil is common. Consider heat pump installation.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Halifax Highlights</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Ocean access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Fastest-growing population</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Tech job growth</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Affordable vs Toronto</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/montreal" className="text-blue-600 hover:underline">Montreal Rates</Link></li>
                <li><Link href="/cities/vancouver" className="text-blue-600 hover:underline">Vancouver Rates</Link></li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">Relocation Tip</h3>
              <p className="text-blue-800 text-sm">
                Many Halifax newcomers sell homes in Toronto and buy mortgage-free in Halifax while keeping significant equity. Consider this strategy!
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
