import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Barrie 2025 | Latest Mortgage Rates Canada",
  description: "Find the lowest mortgage rates in Barrie. Compare rates from top Ontario lenders, understand Barrie market conditions, and connect with local mortgage brokers.",
  keywords: "Barrie mortgage rates, Ontario mortgage rates, Barrie mortgage broker, best rates Barrie, Barrie home buyer",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/barrie",
  },
  openGraph: {
    title: "Best Mortgage Rates Barrie 2025",
    description: "Compare the lowest mortgage rates from Barrie's top lenders",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/barrie",
  },
};

export default function BarriePage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Barrie",
            description: "Best mortgage rates in Barrie and Simcoe County",
            areaServed: {
              "@type": "City",
              name: "Barrie",
              containedIn: "Ontario",
            },
            url: "https://latestmortgagerates.ca/cities/barrie",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Barrie</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Barrie 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Compare the lowest rates from Simcoe County lenders and find your perfect mortgage</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Barrie Mortgage Rates</h2>
              <p className="text-gray-600 mb-6">Updated daily with the best rates from Barrie-area lenders including major banks, credit unions, and online lenders.</p>
              
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
                  Compare All Barrie Rates →
                </Link>
              </div>
            </section>

            {/* Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Barrie Housing Market Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">$750K</p>
                  <p className="text-sm text-gray-600">Average Home Price</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">3.5%</p>
                  <p className="text-sm text-gray-600">YoY Price Change</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">30</p>
                  <p className="text-sm text-gray-600">Days on Market</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Barrie serves as a major bedroom community for Toronto, offering significant savings compared to GTA prices 
                while maintaining GO Train connectivity. The city has transformed from a cottage town to a thriving urban center 
                with strong employment and amenities.
              </p>
              <p className="text-gray-600">
                The Simcoe County real estate market attracts families seeking affordability, waterfront properties, and 
                a balanced lifestyle. With continuous development in south Barrie and strong rental demand, the city offers 
                solid investment potential.
              </p>
            </section>

            {/* First-Time Buyers */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Home Buyers in Barrie</h2>
              <p className="text-gray-600 mb-4">
                Barrie attracts GTA commuters seeking affordable homeownership closer to Toronto. While prices are higher 
                than northern Ontario cities, significant savings over Toronto make it popular for first-time buyers.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Minimum Down Payment (5%)</p>
                  <p className="text-2xl font-bold text-blue-600">~$37,500</p>
                  <p className="text-xs text-gray-500">Based on $750K average</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Recommended Down Payment (10%)</p>
                  <p className="text-2xl font-bold text-green-600">~$75,000</p>
                  <p className="text-xs text-gray-500">Reduces mortgage insurance</p>
                </div>
              </div>
              <p className="text-gray-600">
                Barrie buyers benefit from the city designation, allowing RRSP Home Buyers' Plan access. Multiple programs 
                support first-time buyers in Ontario, and Barrie's steady property appreciation makes it attractive for 
                building equity.
              </p>
            </section>

            {/* Regional Lender Highlights */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Barrie Lenders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Simcoe County Credit Unions</h3>
                  <p className="text-sm text-gray-600">Regional credit unions with competitive rates and local knowledge of the Barrie market.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Barrie Mortgage Brokers</h3>
                  <p className="text-sm text-gray-600">Local experts specializing in commuter mortgages and understanding the unique needs of GTA transplants.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Digital Lenders</h3>
                  <p className="text-sm text-gray-600">Online banks offering convenient pre-approvals and quick closings for the Barrie market.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Major Banks</h3>
                  <p className="text-sm text-gray-600">National banks with strong Barrie branch networks and competitive rates for qualified buyers.</p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>Is Barrie cheaper than Toronto?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    Significantly! Barrie average home prices (~$750K) are 30-40% lower than Toronto. Combined with lower 
                    property taxes and commuting options, many GTA buyers find substantial savings in Barrie.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>Should I get fixed or variable in Barrie?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    Both are popular in Barrie. Fixed provides payment certainty during your commute transition, while variable 
                    offers lower initial rates. Many buyers choose 5-year fixed for stability.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>Is the commute to Toronto feasible?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    Yes! The GO Train provides regular service to Union Station in ~1 hour. Many Barrie residents use the 
                    train daily. For those driving, Highways 400 and 407 provide access, though traffic can extend travel times.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>What neighborhoods should I consider?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    North Barrie (Holly, Ardagh) offers newer homes near amenities. South Barrie provides waterfront living 
                    near downtown. The GO Train station area appeals to commuters. Your broker can assess affordability by neighborhood.
                  </p>
                </details>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div className="bg-blue-600 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Need a Barrie Mortgage Expert?</h3>
              <p className="text-blue-100 mb-4">Connect with local brokers who know the Simcoe County market.</p>
              <Link href="/#contact" className="block text-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition">
                Get Free Quotes
              </Link>
            </div>

            {/* Rate Calculator */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Payment Calculator</h3>
              <p className="text-gray-600 text-sm mb-4">Estimate your monthly payments for Barrie homes.</p>
              <div className="bg-gray-50 rounded p-3 mb-3">
                <p className="text-sm text-gray-600">Example: $750K home, 10% down</p>
                <p className="text-xl font-bold text-blue-600">~$3,650/month</p>
                <p className="text-xs text-gray-500">Based on 4.19% 5-year fixed</p>
              </div>
              <Link href="/#calculator" className="block text-center text-blue-600 hover:text-blue-800 font-medium">
                Full Calculator →
              </Link>
            </div>

            {/* Related Cities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Commuter Cities</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/cities/oshawa" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Oshawa Mortgage Rates</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cities/hamilton" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Hamilton Mortgage Rates</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cities/kitchener" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Kitchener Mortgage Rates</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Related Cities</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/cities/toronto" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Toronto Mortgage Rates</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cities/mississauga" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Mississauga (Coming Soon)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cities/niagara" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Niagara Region (Coming Soon)</span>
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
