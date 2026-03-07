import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Saskatoon 2025 | Latest Mortgage Rates Canada",
  description: "Find the lowest mortgage rates in Saskatoon. Compare rates from top Saskatchewan lenders, understand Saskatoon market conditions, and connect with local mortgage brokers.",
  keywords: "Saskatoon mortgage rates, Saskatchewan mortgage rates, Saskatoon mortgage broker, best rates Saskatoon, Saskatoon home buyer",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/saskatoon",
  },
  openGraph: {
    title: "Best Mortgage Rates Saskatoon 2025",
    description: "Compare the lowest mortgage rates from Saskatoon's top lenders",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/saskatoon",
  },
};

export default function SaskatoonPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Saskatoon",
            description: "Best mortgage rates in Saskatoon and Saskatchewan",
            areaServed: {
              "@type": "City",
              name: "Saskatoon",
              containedIn: "Saskatchewan",
            },
            url: "https://latestmortgagerates.ca/cities/saskatoon",
          }),
        }}
      />

      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Saskatoon</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Saskatoon 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Compare the lowest rates from Saskatchewan lenders and find your perfect mortgage</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Saskatoon Mortgage Rates</h2>
              <p className="text-gray-600 mb-6">Updated daily with the best rates from Saskatoon-area lenders including major banks, credit unions, and online lenders.</p>
              
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
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">3-Year Fixed</span>
                  <span className="font-semibold text-gray-900">4.39%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">10-Year Fixed</span>
                  <span className="font-semibold text-gray-900">4.54%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">1-Year Fixed</span>
                  <span className="font-semibold text-gray-900">5.49%</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All Saskatoon Rates →
                </Link>
              </div>
            </section>

            {/* Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Saskatoon Housing Market Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">$380K</p>
                  <p className="text-sm text-gray-600">Average Home Price</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">3.2%</p>
                  <p className="text-sm text-gray-600">YoY Price Change</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">45</p>
                  <p className="text-sm text-gray-600">Days on Market</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Saskatoon's housing market offers excellent value compared to major Canadian cities. With an average home price around $380,000, 
                the city provides affordable homeownership opportunities while maintaining steady growth. The market benefits from a diverse economy 
                including agriculture, mining, and technology sectors.
              </p>
              <p className="text-gray-600">
                First-time buyers find Saskatoon particularly attractive due to lower entry prices and the city&apos;s strong rental market 
                for future investment potential. The steady population growth and economic stability make it an ideal location for 
                long-term real estate investment.
              </p>
            </section>

            {/* First-Time Buyers */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Home Buyers in Saskatoon</h2>
              <p className="text-gray-600 mb-4">
                Saskatoon is one of Canada&apos;s most affordable cities for first-time home buyers. With average home prices significantly lower 
                than national averages, buyers can enter the market with more manageable down payments.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Minimum Down Payment (5%)</p>
                  <p className="text-2xl font-bold text-blue-600">~$19,000</p>
                  <p className="text-xs text-gray-500">Based on $380K average</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Recommended Down Payment (10%)</p>
                  <p className="text-2xl font-bold text-green-600">~$38,000</p>
                  <p className="text-xs text-gray-500">Reduces mortgage insurance</p>
                </div>
              </div>
              <p className="text-gray-600">
                Saskatchewan offers additional first-time buyer programs, including the Saskatchewan First Home Plan which provides 
                repayable assistance. Combined with federal programs, Saskatoon buyers have multiple pathways to homeownership.
              </p>
            </section>

            {/* Regional Lender Highlights */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Saskatoon Lenders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Conexus Credit Union</h3>
                  <p className="text-sm text-gray-600">Saskatchewan-based credit union with competitive rates and local expertise. Offers exclusive member benefits and flexible mortgage terms.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Affinity Credit Union</h3>
                  <p className="text-sm text-gray-600">Strong local presence across Saskatchewan with competitive pricing and personalized service for Saskatoon residents.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Saskatoon Brokers</h3>
                  <p className="text-sm text-gray-600">Local mortgage brokers with deep knowledge of the Saskatoon market and relationships with multiple lenders.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">National Lenders</h3>
                  <p className="text-sm text-gray-600">Major banks and online lenders competing for Saskatoon business with competitive rates and digital convenience.</p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>Why are Saskatoon mortgage rates competitive?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    Saskatoon benefits from strong competition between Saskatchewan credit unions, national banks, and mortgage brokers. 
                    The affordable housing market and stable economy encourage lenders to offer attractive rates to qualified borrowers.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>Should I choose fixed or variable rates in Saskatoon?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    With Saskatoon&apos;s affordable home prices, both options work well. Variable rates offer lower initial payments and flexibility, 
                    while fixed rates provide payment certainty. Many local lenders offer hybrid options combining both.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>Are Saskatoon credit unions better than banks?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    Saskatchewan credit unions often offer competitive rates and community-focused service. However, national banks may provide 
                    better rates on certain products. Always compare offers from both credit unions and banks to find your best rate.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>What&apos;s the best neighborhood to buy in Saskatoon?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    Popular neighborhoods include Stonebridge, Evergreen, and The Meadows for newer homes. The Caswell Hill and Varsity View 
                    areas offer character homes with established communities. Your mortgage broker can help assess affordability in different areas.
                  </p>
                </details>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div className="bg-blue-600 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Need a Saskatoon Mortgage Expert?</h3>
              <p className="text-blue-100 mb-4">Connect with local brokers who know the Saskatoon market.</p>
              <Link href="/#contact" className="block text-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition">
                Get Free Quotes
              </Link>
            </div>

            {/* Rate Calculator */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Payment Calculator</h3>
              <p className="text-gray-600 text-sm mb-4">Estimate your monthly payments for Saskatoon homes.</p>
              <div className="bg-gray-50 rounded p-3 mb-3">
                <p className="text-sm text-gray-600">Example: $380K home, 10% down</p>
                <p className="text-xl font-bold text-blue-600">~$1,850/month</p>
                <p className="text-xs text-gray-500">Based on 4.19% 5-year fixed</p>
              </div>
              <Link href="/#calculator" className="block text-center text-blue-600 hover:text-blue-800 font-medium">
                Full Calculator →
              </Link>
            </div>

            {/* Related Cities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Other Saskatchewan Cities</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/cities/regina" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Regina Mortgage Rates</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Related Cities</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/cities/edmonton" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Edmonton Mortgage Rates</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cities/calgary" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Calgary Mortgage Rates</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cities/winnipeg" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Winnipeg Mortgage Rates</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
