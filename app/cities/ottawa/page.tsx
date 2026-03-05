import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Ottawa 2025 | Parliament Hill Mortgages",
  description: "Find the lowest mortgage rates in Ottawa and Gatineau. Compare rates from Ottawa lenders and learn about government employee mortgage programs.",
  keywords: "Ottawa mortgage rates, Ottawa mortgage broker, government employee mortgage, Gatineau mortgage, Ottawa home buyer",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/ottawa",
  },
  openGraph: {
    title: "Best Mortgage Rates Ottawa 2025",
    description: "Compare Ottawa mortgage rates from top lenders. Special programs for government workers.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/ottawa",
  },
};

export default function OttawaPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Ottawa",
            description: "Best mortgage rates in Ottawa and Gatineau",
            areaServed: {
              "@type": "City",
              name: "Ottawa",
              containedIn: "Ontario",
            },
            url: "https://latestmortgagerates.ca/cities/ottawa",
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Ottawa</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>🏛️ Government Employee Programs Available</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Ottawa 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Nation's capital with stable employment and affordable housing</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Ottawa Mortgage Rates</h2>
              
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
                <h3 className="font-semibold text-blue-900 mb-2">🎯 Ottawa's Government Employee Advantage</h3>
                <p className="text-blue-800">
                  Federal employees in Ottawa often qualify for special mortgage programs with lower rates, higher income multipliers, and flexible qualifying criteria.
                </p>
              </div>
              
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All Ottawa Rates →
                </Link>
              </div>
            </section>

            {/* Ottawa Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ottawa Housing Market Overview</h2>
              
              <p className="text-gray-700 mb-4">
                Ottawa offers some of the best value among major Canadian cities. With stable federal employment and consistent population growth, the Ottawa market is known for its predictability and steady appreciation.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Average Home Prices (2025)</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Detached Homes</p>
                  <p className="text-xl font-bold text-gray-900">$750,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Semi-Detached</p>
                  <p className="text-xl font-bold text-gray-900">$585,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Townhouses</p>
                  <p className="text-xl font-bold text-gray-900">$495,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Condos</p>
                  <p className="text-xl font-bold text-gray-900">$425,000</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Why Ottawa is a Great Place to Buy</h3>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Stable Employment:</strong> Federal government is the largest employer</li>
                <li><strong>Lower Prices:</strong> 30-40% cheaper than Toronto</li>
                <li><strong>No Municipal LTT:</strong> Only provincial land transfer tax applies</li>
                <li><strong>Growing Tech Sector:</strong> Kanata "Silicon Valley North"</li>
                <li><strong>Quality of Life:</strong> Ranked best city in Canada for quality of life</li>
                <li><strong>Bilingual Advantage:</strong> French proficiency can help with government jobs</li>
              </ul>
            </section>

            {/* Government Employee Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mortgages for Government Employees</h2>
              
              <p className="text-gray-700 mb-4">
                Over 40% of Ottawa's workforce is employed by the federal government. Several lenders offer special programs:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Higher Income Multipliers</h3>
                  <p className="text-gray-700">Some lenders use gross income x 5 instead of x 4 for government employees with stable positions.</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Pension Income Counted 100%</h3>
                  <p className="text-gray-700">Your future defined benefit pension counts fully toward qualifying income.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Union Membership Benefits</h3>
                  <p className="text-gray-700">Many credit unions (like Meridian) offer special rates to federal employees.</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Security of Employment</h3>
                  <p className="text-gray-700">Government jobs are viewed as low-risk, which can mean easier approvals.</p>
                </div>
              </div>
            </section>

            {/* Ottawa vs Gatineau */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ottawa vs Gatineau: Cross-Border Considerations</h2>
              
              <p className="text-gray-700 mb-4">
                Many Ottawa workers consider buying in Gatineau, QC for lower prices. Here's what to know:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <h3 className="font-semibold text-green-900 mb-2">Gatineau Advantages</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Lower home prices (15-20%)</li>
                    <li>• Cheaper daycare ($8/day)</li>
                    <li>• Lower car insurance</li>
                    <li>• French immersion schools</li>
                  </ul>
                </div>
                <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <h3 className="font-semibold text-orange-900 mb-2">Ottawa Advantages</h3>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Higher income potential</li>
                    <li>• More job opportunities</li>
                    <li>• English services</li>
                    <li>• Better infrastructure</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Living in Quebec means paying Quebec income tax and dealing with different mortgage regulations. Calculate carefully!
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-blue-50 rounded-lg shadow-md p-6 sticky top-4 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-4">Are You a Government Employee?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span className="text-blue-800">Special qualification programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span className="text-blue-800">Pension income fully counted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span className="text-blue-800">Union member discounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span className="text-blue-800">Secure employment premiums</span>
                </li>
              </ul>
              <Link href="/" className="block text-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                Get Government Rates
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/montreal" className="text-blue-600 hover:underline">Montreal Rates</Link></li>
                <li><Link href="/cities/calgary" className="text-blue-600 hover:underline">Calgary Rates</Link></li>
                <li><Link href="/cities/vancouver" className="text-blue-600 hover:underline">Vancouver Rates</Link></li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Ottawa Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog/first-time-home-buyer-guide-canada" className="text-blue-600 hover:underline">First-Time Buyer Guide</Link></li>
                <li><Link href="/blog/closing-costs-canada" className="text-blue-600 hover:underline">Ottawa Closing Costs</Link></li>
                <li><Link href="/tools" className="text-blue-600 hover:underline">Mortgage Calculator</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
