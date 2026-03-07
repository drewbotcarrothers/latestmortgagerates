import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates St. John's 2025 | Latest Mortgage Rates Canada",
  description: "Find the lowest mortgage rates in St. John's. Compare rates from top Newfoundland and Labrador lenders, understand St. John's market conditions, and connect with local mortgage brokers.",
  keywords: "St John's mortgage rates, Newfoundland mortgage rates, St John's mortgage broker, best rates St. John's, St. John's home buyer",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/st-johns",
  },
  openGraph: {
    title: "Best Mortgage Rates St. John's 2025",
    description: "Compare the lowest mortgage rates from St. John's top lenders",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/st-johns",
  },
};

export default function StJohnsPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - St. John's",
            description: "Best mortgage rates in St. John's and Newfoundland",
            areaServed: {
              "@type": "City",
              name: "St. John's",
              containedIn: "Newfoundland and Labrador",
            },
            url: "https://latestmortgagerates.ca/cities/st-johns",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">St. John's</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in St. John's 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Compare the lowest rates from Newfoundland lenders and find your perfect mortgage</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current St. John's Mortgage Rates</h2>
              <p className="text-gray-600 mb-6">Updated daily with the best rates from Newfoundland lenders including major banks, credit unions, and online lenders.</p>
              
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
                  Compare All St. John's Rates →
                </Link>
              </div>
            </section>

            {/* Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">St. John's Housing Market Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">$315K</p>
                  <p className="text-sm text-gray-600">Average Home Price</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">2.5%</p>
                  <p className="text-sm text-gray-600">YoY Price Change</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">65</p>
                  <p className="text-sm text-gray-600">Days on Market</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                St. John's offers Atlantic Canada's most affordable housing market for a capital city, with average home prices around $315,000. 
                The market has stabilized following offshore oil industry adjustments, creating opportunities for buyers seeking affordable 
                coastal living.
              </p>
              <p className="text-gray-600">
                The city combines rich cultural heritage with modern amenities and stunning natural beauty. With a growing tech sector 
                and diversified economy, St. John's presents excellent value for first-time buyers and investors seeking affordable 
                Canadian real estate.
              </p>
            </section>

            {/* First-Time Buyers */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Home Buyers in St. John's</h2>
              <p className="text-gray-600 mb-4">
                St. John's offers one of Canada's most affordable entry points to homeownership. With average prices well below national 
                averages and government first-time buyer programs, the city is ideal for new buyers seeking affordable coastal living.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Minimum Down Payment (5%)</p>
                  <p className="text-2xl font-bold text-blue-600">~$15,750</p>
                  <p className="text-xs text-gray-500">Based on $315K average</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Recommended Down Payment (10%)</p>
                  <p className="text-2xl font-bold text-green-600">~$31,500</p>
                  <p className="text-xs text-gray-500">Reduces mortgage insurance</p>
                </div>
              </div>
              <p className="text-gray-600">
                Newfoundland buyers can access federal programs plus unique provincial incentives. Local lenders understand the 
                Newfoundland market and offer flexible terms for first-time buyers entering this affordable coastal market.
              </p>
            </section>

            {/* Regional Lender Highlights */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured St. John's Lenders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Newfoundland & Labrador Credit Union</h3>
                  <p className="text-sm text-gray-600">Province's largest credit union with deep local knowledge and competitive rates for St. John's buyers.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">St. John's Brokers</h3>
                  <p className="text-sm text-gray-600">Local mortgage professionals with specialized knowledge of the Newfoundland market and lender relationships.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">Regional Banks</h3>
                  <p className="text-sm text-gray-600">Atlantic-focused banks offering competitive rates tailored to Newfoundland homebuyers.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                  <h3 className="font-semibold text-gray-900">National Lenders</h3>
                  <p className="text-sm text-gray-600">Major banks and online lenders competing for St. John's business with Atlantic region rates.</p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>Why are St. John's prices so affordable?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    St. John's offers excellent value due to its geographic location and market cycles. After oil industry adjustments, 
                    prices have stabilized at affordable levels while the economy diversifies. Lower land costs and steady development 
                    maintain this affordability.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>Should I get a fixed or variable rate in St. John's?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    With St. John's affordable prices, both options are viable. Fixed rates provide payment certainty in a recovering market, 
                    while variable offers lower initial costs. Local brokers can help assess which suits your risk tolerance.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>Are St. John's lenders competitive?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    Newfoundland lenders are very competitive, with provincial credit unions offering rates matching or beating 
                    national banks. The smaller market means more personalized service and flexible terms.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>What neighborhoods are best in St. John's?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">
                    Popular areas include Paradise and Mount Pearl for families, Torbay Road area for convenience, and downtown 
                    for character homes. The city offers diverse neighborhoods at very affordable prices compared to mainland Canada.
                  </p>
                </details>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div className="bg-blue-600 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Need a St. John's Mortgage Expert?</h3>
              <p className="text-blue-100 mb-4">Connect with local brokers who know the Newfoundland market.</p>
              <Link href="/#contact" className="block text-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition">
                Get Free Quotes
              </Link>
            </div>

            {/* Rate Calculator */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Payment Calculator</h3>
              <p className="text-gray-600 text-sm mb-4">Estimate your monthly payments for St. John's homes.</p>
              <div className="bg-gray-50 rounded p-3 mb-3">
                <p className="text-sm text-gray-600">Example: $315K home, 10% down</p>
                <p className="text-xl font-bold text-blue-600">~$1,530/month</p>
                <p className="text-xs text-gray-500">Based on 4.19% 5-year fixed</p>
              </div>
              <Link href="/#calculator" className="block text-center text-blue-600 hover:text-blue-800 font-medium">
                Full Calculator →
              </Link>
            </div>

            {/* Related Cities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Atlantic Canada</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/cities/halifax" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Halifax Mortgage Rates</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Related Cities</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/cities/moncton" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Moncton (Coming Soon)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cities/charlottetown" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Charlottetown (Coming Soon)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cities/fredericton" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <span>→</span>
                    <span className="ml-2">Fredericton (Coming Soon)</span>
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
