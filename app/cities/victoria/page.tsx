import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";
import CityLendersSidebar from "../../components/CityLendersSidebar";

export const dynamic = "force-static";

// Victoria-specific FAQs
const victoriaFaqs = [
  {
    question: "What are current mortgage rates in Victoria?",
    answer: "Current Victoria mortgage rates are competitive with 5-year fixed rates starting from 4.19% and 5-year variable rates from 3.85%. Victoria's market has average home prices around $1,050,000 - high but lower than Vancouver's $2M average.",
  },
  {
    question: "Is Victoria cheaper than Vancouver?",
    answer: "Yes - Victoria is more affordable than Vancouver with average prices ~$1.05M vs $2M in Metro Vancouver. You get a more relaxed lifestyle, milder climate, and still have ocean access. The ferry adds some cost but many find the trade-off worth it.",
  },
  {
    question: "Does Victoria have the BC Speculation Tax?",
    answer: "Victoria is exempt from the BC Speculation and Vacancy Tax. However, the regular Property Transfer Tax applies. First-time buyers may qualify for the First Time Home Buyers' Program to reduce or eliminate this tax.",
  },
  {
    question: "Who moves to Victoria?",
    answer: "Three main groups: retirees seeking mild weather, remote workers from expensive markets, and BC residents trading Vancouver prices for Island lifestyle. Strong tech sector with companies like Revenue Canada, BC Government hub.",
  },
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Victoria 2025 | Vancouver Island Living",
  description: "Find the lowest mortgage rates in Victoria for 2025. Vancouver Island's capital, average home price $1.05M. Compare BC lenders. 5-year fixed from 4.19%. No speculation tax.",
  keywords: "Victoria mortgage rates, Victoria mortgage broker, best rates Victoria, Victoria home buyer, Vancouver Island mortgage, BC mortgage rates",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/victoria",
  },
  openGraph: {
    title: "Best Mortgage Rates Victoria 2025 | Island Living",
    description: "Victoria mortgage rates - Vancouver Island's capital! Average $1.05M. 5-year fixed from 4.19%.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/victoria",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates Victoria 2025",
    description: "Vancouver Island living! $1.05M average, no speculation tax. 5-year fixed from 4.19%.",
  },
};

export default function VictoriaPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Victoria",
            description: "Best mortgage rates in Victoria, BC",
            areaServed: {
              "@type": "City",
              name: "Victoria",
              containedIn: "British Columbia",
            },
            url: "https://latestmortgagerates.ca/cities/victoria",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: victoriaFaqs.map((faq) => ({
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
              <li className="text-gray-900 font-medium">Victoria</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>🌊 Vancouver Island Living</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Victoria 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">BC's capital without Vancouver prices. Mild climate, ocean views. Find your rate.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Victoria Mortgage Rates</h2>
              
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
                  <strong>Victoria Advantage:</strong> ~$1M average saves $1M+ vs Vancouver. 
                  No speculation tax. Warmest major city in Canada.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Buyer Programs</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">BC First Time Home Buyers' Program</h3>
                  <p className="text-gray-700">Property Transfer Tax exemption on homes up to $500K. Partial exemption up to $835K.</p>
                </div>                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">BC Home Owner Mortgage Program</h3>
                  <p className="text-gray-700">First-time buyers in Victoria may qualify for property tax deferment.</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Victoria Market Factors</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">No Speculation Tax</h3>
                  <p className="text-gray-700">Victoria is exempt from BC's Speculation and Vacancy Tax. 
                  Unlike Vancouver, there's no annual tax on vacant or foreign-owned properties.</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Government Employment</h3>
                  <p className="text-gray-700">Provincial capital with major BC government presence. 
                  Stable employment base unlike resource-dependent cities.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Mediterranean Climate</h3>
                  <p className="text-gray-700">Canada's most mild climate - warm summers, minimal snow in winter. 
                  Attracts retirees and remote workers.</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Why Victoria?</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">50% cheaper than Vancouver</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">No speculation tax</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Warmest climate in Canada</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Island lifestyle</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/vancouver" className="text-blue-600 hover:underline">Vancouver Rates</Link></li>
                <li><Link href="/cities/kelowna" className="text-blue-600 hover:underline">Kelowna Rates</Link></li>
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Compare Victoria Rates</h3>
              <p className="text-gray-600 text-sm mb-4">See rates from Vancouver Island lenders.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                View Rates
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Share Victoria Rates</h3>
              <p className="text-gray-600 text-sm mb-4">Know someone moving to Victoria?</p>
              <SocialShare 
                url="https://latestmortgagerates.ca/cities/victoria"
                title="Best Mortgage Rates in Victoria 2025"
                description="Vancouver Island living! $1.05M average, no speculation tax, mildest climate. 5-year fixed from 4.19%."
              />
            </div>
          <CityLendersSidebar cityName="Victoria" />
          </aside>
        </div>
      </div>
    </main>
  );
}
