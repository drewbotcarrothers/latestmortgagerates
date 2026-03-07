import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";

export const dynamic = "force-static";

// Ottawa-specific FAQs
const ottawaFaqs = [
  {
    question: "What are current mortgage rates in Ottawa?",
    answer: "Current Ottawa mortgage rates are competitive with 5-year fixed rates starting from 4.19% and 5-year variable rates from 3.85%. Ottawa offers a balanced market with average home prices around $650,000 - more affordable than Toronto but with strong government job stability.",
  },
  {
    question: "Is Ottawa a good market for first-time buyers?",
    answer: "Yes! Ottawa is ideal for first-time buyers with stable government employment, reasonable home prices ($650K average vs $1.2M Toronto), and Ontario's first-time buyer rebates including up to $4,000 for land transfer tax.",
  },
  {
    question: "How is Ottawa's real estate market different?",
    answer: "Ottawa's market is heavily influenced by government employment, creating stability. Prices grew steadily during the pandemic and have stabilized. The tech sector (Kanata) is booming, adding demand. Average commute times are lower than Toronto.",
  },
  {
    question: "Which areas of Ottawa are most affordable?",
    answer: "Barrhaven, Orleans, and Kanata offer good value. Downtown condos are pricier per sqft. Consider Gatineau (QC side) for lower prices but remember Quebec's different tax structure and welcome tax (taxe de bienvenue).",
  },
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Ottawa 2025 | Government City Value",
  description: "Find the lowest mortgage rates in Ottawa for 2025. Stable government employment, average home price $650K. Compare rates from Ontario lenders. 5-year fixed from 4.19%.",
  keywords: "Ottawa mortgage rates, Ottawa mortgage broker, best rates Ottawa, Ottawa home buyer, Ottawa real estate, capital region mortgage",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/ottawa",
  },
  openGraph: {
    title: "Best Mortgage Rates Ottawa 2025 | Government City Value",
    description: "Ottawa mortgage rates. Stable government jobs, affordable housing. Average $650K - compare Toronto! 5-year fixed from 4.19%.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/ottawa",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates Ottawa 2025",
    description: "Ottawa mortgage rates - stable market, government jobs! 5-year fixed from 4.19%.",
  },
};

export default function OttawaPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* LocalBusiness Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Ottawa",
            description: "Best mortgage rates in Ottawa, Ontario",
            areaServed: {
              "@type": "City",
              name: "Ottawa",
              containedIn: "Ontario",
            },
            url: "https://latestmortgagerates.ca/cities/ottawa",
          }),
        }}
      />

      {/* FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: ottawaFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
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
                <span>Stable Government Employment</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Ottawa 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Canada's capital offers stable employment and affordable homes. Find the lowest mortgage rates.</p>
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
                  <p className="text-sm text-gray-600">5-Year Fixed</p>
                  <p className="text-3xl font-bold text-blue-600">4.19%</p>
                  <p className="text-sm text-gray-500">Best available rate</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">5-Year Variable</p>
                  <p className="text-3xl font-bold text-green-600">3.85%</p>
                  <p className="text-sm text-gray-500">Prime -0.60%</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Ottawa Market Insight:</strong> Ottawa's government-driven economy provides 
                  stability. Average home price $650K vs $1.2M in Toronto.
                </p>
              </div>
            </section>

            {/* First-time Buyer Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Buyer Programs</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Ontario Land Transfer Tax Rebate</h3>
                  <p className="text-gray-700">First-time buyers can receive up to $4,000 rebate, 
                  covering the full tax on homes up to $368,000.</p>
                </div>                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">First Home Savings Account (FHSA)</h3>
                  <p className="text-gray-700">The FHSA combines RRSP tax deductions with TFSA-like withdrawals for your first home.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Home Buyers' Plan (HBP)</h3>
                  <p className="text-gray-700">Withdraw up to $35,000 from your RRSP ($70K for couples) for your down payment, tax-free.</p>
                </div>
              </div>
            </section>

            {/* Ottawa Market Factors */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ottawa Market Factors</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Government Employment Stability</h3>
                  <p className="text-gray-700">Federal government is largest employer, providing steady demand during economic downturns.</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Tech Sector Growth</h3>
                  <p className="text-gray-700">Kanata tech hub (Silicon Valley North) is booming with Shopify, Nokia, and startups.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Bilingual Advantage</h3>
                  <p className="text-gray-700">Access to both Ontario and Quebec job markets. Consider Gatineau for lower prices.</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Lower Commute Times</h3>
                  <p className="text-gray-700">Average commute ~30 min vs 60+ minutes in Toronto. Better work-life balance.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Why Ottawa?</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Stable government jobs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">More affordable than Toronto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Growing tech sector</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Shorter commute times</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">First-time buyer friendly</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/montreal" className="text-blue-600 hover:underline">Montreal Rates</Link></li>
                <li><Link href="/cities/calgary" className="text-blue-600 hover:underline">Calgary Rates</Link></li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Compare Ottawa Rates</h3>
              <p className="text-gray-600 text-sm mb-4">See rates from Ottawa mortgage brokers and lenders.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                View Rates
              </Link>
            </div>
          </aside>
        </div>

        {/* Social Sharing Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-2">Share Ottawa Mortgage Rates</h3>
          <p className="text-gray-600 text-sm mb-4">
            Know someone buying in Ottawa? Share these rates!
          </p>
          <SocialShare 
            url="https://latestmortgagerates.ca/cities/ottawa"
            title="Best Mortgage Rates in Ottawa 2025"
            description="Stable government jobs, affordable housing in Canada's capital. Compare the lowest mortgage rates. 5-year fixed from 4.19%."
          />
        </div>
      </div>
    </main>
  );
}
