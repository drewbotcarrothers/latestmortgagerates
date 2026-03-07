import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Regina 2025 | Latest Mortgage Rates Canada",
  description: "Find the lowest mortgage rates in Regina. Compare rates from top Saskatchewan lenders, understand Regina market conditions, and connect with local mortgage brokers.",
  keywords: "Regina mortgage rates, Saskatchewan mortgage rates, Regina mortgage broker, best rates Regina, Regina home buyer",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/regina",
  },
  openGraph: {
    title: "Best Mortgage Rates Regina 2025",
    description: "Compare the lowest mortgage rates from Regina's top lenders",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/regina",
  },
};

export default function ReginaPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Regina",
            description: "Best mortgage rates in Regina and Saskatchewan",
            areaServed: {
              "@type": "City",
              name: "Regina",
              containedIn: "Saskatchewan",
            },
            url: "https://latestmortgagerates.ca/cities/regina",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Regina</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Regina 2025</h1>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Regina Mortgage Rates</h2>
              <p className="text-gray-600 mb-6">Updated daily with the best rates from Regina-area lenders including major banks, credit unions, and online lenders.</p>
              
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
                  Compare All Regina Rates →
                </Link>
              </div>
            </section>

            {/* Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Regina Housing Market Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">$330K</p>
                  <p className="text-sm text-gray-600">Average Home Price</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">2.8%</p>
                  <p className="text-sm text-gray-600">YoY Price Change</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">52</p>
                  <p className="text-sm text-gray-600">Days on Market</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Regina offers Canada&apos;s most affordable capital city housing market with an average home price around $330,000. 
                The market has seen steady growth driven by strong government employment, agriculture sector stability, and increasing 
                diversification into technology and energy sectors.
              </p>
              <p className="text-gray-600">
                The Queen City continues to attract first-time buyers from across Canada seeking affordable homeownership. 
                With lower property taxes than many major cities and excellent community amenities, Regina provides exceptional 
                value for both primary residences and investment properties.
              </p>
            </section>

            {/* First-Time Buyers */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Home Buyers in Regina</h2>
              <p className="text-gray-600 mb-4">
                Regina is consistently ranked as one of Canada&apos;s most affordable cities for first-time home buyers. 
                With the lowest average home price of any Canadian capital city, buyers can enter the market with minimal barriers.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Minimum Down Payment (5%)</p>
                  <p className="text-2xl font-bold text-blue-600">~$16,500</p>
                  <p className="text-xs text-gray-500">Based on $330K average</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Recommended Down Payment (10%)</p>
                  <p className="text-2xl font-bold text-green-600">~$33,000</p>
                  <p className="text-xs text-gray-500">Reduces mortgage insurance</p>
                </div>
              </div>
              <p className="text-gray-600">
                Saskatchewan offers first-time buyer incentives including the Saskatchewan First Home Plan. Combined with 
                federal programs like the First-Time Home Buyer Incentive, Regina buyers have multiple pathways to affordable 
                homeownership in one of Canada&apos;s most budget-friendly markets.
              </p>
            </section>

            {/* Regional Lender Highlights */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Regina Lenders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Conexus Credit Union</h3>
                  <p className="text-sm text-gray-600">One of Saskatchewan&apos;s largest credit unions with competitive rates and multiple Regina branches.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Affinity Credit Union</h3>
                  <p className="text-sm text-gray-600">Strong local presence with competitive pricing and personalized service for Regina residents.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Regina Mortgage Brokers</h3>
                  <p className="text-sm text-gray-600">Local experts with deep knowledge of the Regina market and relationships with multiple lenders.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">National Lenders</h3>
                  <p className="text-sm text-gray-600">Major banks and online lenders competing for Regina business with competitive rates.</p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>Why is Regina so affordable compared to other capital cities?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    Regina maintains affordability through steady development, lower land costs than coastal cities, and strong 
                    municipal planning. The city&apos;s diverse economy and stable population growth prevent the extreme 
                    price spikes seen in Toronto or Vancouver while providing consistent value appreciation.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>Should I choose fixed or variable rates in Regina?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    With Regina&apos;s affordable prices, both options work well. Variable rates offer lower initial payments, 
                    while fixed rates provide payment certainty. Many Regina buyers choose shorter fixed terms (3-5 years) 
                    to take advantage of renewal flexibility.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>Are Regina credit unions competitive with big banks?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    Absolutely. Saskatchewan credit unions are highly competitive, often matching or beating bank rates while 
                    offering superior local service. Their community focus and lower overhead can translate to better deals 
                    for Regina borrowers.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>What&apos;s the best neighborhood to buy in Regina?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    Popular neighborhoods include Harbour Landing and Eastbrook for newer homes, Cathedral for character 
                    properties, and Greens on Gardiner for family-friendly options. Your mortgage broker can assess affordability 
                    across Regina&apos;s diverse neighborhoods.
                  </p>
                </details>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div className="bg-blue-600 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Need a Regina Mortgage Expert?</h3>
              <p className="text-blue-100 mb-4">Connect with local brokers who know the Regina market.</p>
              <Link href="/#contact" className="block text-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition">
                Get Free Quotes
              </Link>
            </div>

            {/* Rate Calculator */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Payment Calculator</h3>
              <p className="text-gray-600 text-sm mb-4">Estimate your monthly payments for Regina homes.</p>
              <div className="bg-gray-50 rounded p-3 mb-3">
                <p className="text-sm text-gray-600">Example: $330K home, 10% down</p>
                <p className="text-xl font-bold text-blue-600">~$1,600/month</p>
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
                  <Link href="/cities/saskatoon" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Saskatoon Mortgage Rates</span>
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
