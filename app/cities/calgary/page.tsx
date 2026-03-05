import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Calgary 2025 | Latest Mortgage Rates Canada",
  description: "Find the lowest mortgage rates in Calgary. Compare rates from Alberta lenders, enjoy no land transfer tax, and lower closing costs.",
  keywords: "Calgary mortgage rates, Alberta mortgage rates, Calgary mortgage broker, best rates Calgary, Calgary home buyer",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/calgary",
  },
  openGraph: {
    title: "Best Mortgage Rates Calgary 2025",
    description: "Compare the lowest mortgage rates from Calgary lenders - no land transfer tax in Alberta!",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/calgary",
  },
};

export default function CalgaryPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Calgary",
            description: "Best mortgage rates in Calgary, Alberta",
            areaServed: {
              "@type": "City",
              name: "Calgary",
              containedIn: "Alberta",
            },
            url: "https://latestmortgagerates.ca/cities/calgary",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Calgary</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>No Land Transfer Tax in Alberta!</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Calgary 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Enjoy lower closing costs and competitive rates in Alberta's largest city</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Calgary Mortgage Rates</h2>
              
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
                <h3 className="font-semibold text-green-900 mb-2">💰 Alberta Advantage: No Land Transfer Tax</h3>
                <p className="text-green-800">
                  Unlike Ontario and BC, Alberta has no land transfer tax. On a $500,000 home, you save $8,000-$10,000 compared to Toronto buyers!
                </p>
              </div>
              
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All Calgary Rates →
                </Link>
              </div>
            </section>

            {/* Calgary Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Calgary Housing Market Overview</h2>
              
              <p className="text-gray-700 mb-4">
                Calgary offers exceptional value compared to Toronto and Vancouver. With average home prices around $540,000 and no land transfer tax, Calgary is one of Canada's most affordable major cities for homebuyers.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Average Home Prices (2025)</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Detached Homes</p>
                  <p className="text-xl font-bold text-gray-900">$680,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Semi-Detached</p>
                  <p className="text-xl font-bold text-gray-900">$485,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Townhouses</p>
                  <p className="text-xl font-bold text-gray-900">$410,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Apartments</p>
                  <p className="text-xl font-bold text-gray-900">$295,000</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Alberta's Housing Market Advantages</h3>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>No Land Transfer Tax:</strong> Save thousands on closing costs</li>
                <li><strong>No Provincial Sales Tax on CMHC:</strong> Unlike Ontario and Quebec</li>
                <li><strong>Higher Median Income:</strong> $72,000 vs $56,000 national average</li>
                <li><strong>Lower Overall Costs:</strong> Utilities, insurance, and property taxes tend to be lower</li>
                <li><strong>Strong Economy:</strong> Diversifying beyond energy with tech and finance growth</li>
              </ul>
            </section>

            {/* First-Time Buyers Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Buyers in Calgary</h2>
              
              <p className="text-gray-700 mb-4">
                Calgary is an excellent market for first-time buyers. Here's why:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Affordable Entry Point</h3>
                  <p className="text-gray-700">With average prices 50% lower than Toronto, your down payment goes much further.</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Lower Closing Costs</h3>
                  <p className="text-gray-700">No land transfer tax means you keep thousands for your down payment or home improvements.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Competitive Mortgage Market</h3>
                  <p className="text-gray-700">Many lenders compete aggressively for Calgary mortgages, keeping rates competitive.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Why Calgary?</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">No land transfer tax</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Affordable home prices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">High median incomes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Low property taxes</span>
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
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/vancouver" className="text-blue-600 hover:underline">Vancouver Rates</Link></li>
                <li><Link href="/cities/montreal" className="text-blue-600 hover:underline">Montreal Rates</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
