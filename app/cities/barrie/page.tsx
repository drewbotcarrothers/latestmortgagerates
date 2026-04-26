import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";
import CityLendersSidebar from "../../components/CityLendersSidebar";

export const dynamic = "force-static";

const barrieFaqs = [
  { question: "What are current mortgage rates in Barrie?", answer: "Current Barrie mortgage rates are competitive with 5-year fixed rates from 4.19% and variable from 3.85%. Barrie offers good value with average home prices around $750,000 - popular for Toronto commuters.", },
  { question: "Is Barrie part of the GTA?", answer: "Barrie is part of the Greater Golden Horseshoe but not the GTA proper. It's 90km north of Toronto with GO Train service. Many residents commute to Toronto while enjoying lakefront living.", },
  { question: "Is Barrie good for families?", answer: "Excellent for families. Kempenfelt Bay on Lake Simcoe offers beaches and recreation. Lower prices than Toronto ($750K vs $1.2M). Good schools, family communities, and growing tech sector.", },
  { question: "Why is Barrie growing so fast?", answer: "Toronto commuters seeking affordability. Waterfront location on Lake Simcoe. Growing tech sector. Expansion of the 400 highway made commuting easier. Strong rental demand from commuters.", },
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Barrie 2025 | Lake Simcoe Living",
  description: "Find the lowest mortgage rates in Barrie for 2025. Lakefront living, GO Train to Toronto. Average home price $750K. 5-year fixed from 4.19%.",
  keywords: "Barrie mortgage rates, Simcoe County mortgage, Barrie mortgage broker, best rates Barrie, Toronto commuter mortgage",
  alternates: { canonical: "https://latestmortgagerates.ca/cities/barrie" },
  openGraph: { title: "Best Mortgage Rates Barrie 2025 | Lake Simcoe", description: "Lakefront living, GO Train access! Average $750K. 5-year fixed from 4.19%.", url: "https://latestmortgagerates.ca/cities/barrie", type: "website", locale: "en_CA" },
  twitter: { card: "summary_large_image", title: "Best Mortgage Rates Barrie 2025", description: "Lake Simcoe living. GO Train to Toronto! 5-year fixed from 4.19%." },
};

export default function BarriePage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", name: "Latest Mortgage Rates Canada - Barrie", description: "Best mortgage rates in Barrie", areaServed: { "@type": "City", name: "Barrie", containedIn: "Ontario" }, url: "https://latestmortgagerates.ca/cities/barrie" }),
      }} />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: barrieFaqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }),
      }} />

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
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3"><span>🏖️ Lake Simcoe Waterfront</span></div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Barrie 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Lakefront living with Toronto access. GO Train commuter hub. Find your rate.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Barrie Mortgage Rates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4"><p className="text-sm text-gray-600">5-Year Fixed</p><p className="text-3xl font-bold text-blue-600">4.19%</p><p className="text-sm text-gray-500">Best available rate</p></div>
                <div className="bg-green-50 rounded-lg p-4"><p className="text-sm text-gray-600">5-Year Variable</p><p className="text-3xl font-bold text-green-600">3.85%</p><p className="text-sm text-gray-500">Prime -0.60%</p></div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-700"><strong>Lakefront Value:</strong> ~$750K average. Save $450K vs Toronto with lake access!</p></div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Buyer Programs</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4"><h3 className="font-semibold text-gray-900">Ontario LTT Rebate</h3><p className="text-gray-700">Up to $4,000 rebate.</p></div>
                <div className="border-l-4 border-blue-500 pl-4"><h3 className="font-semibold text-gray-900">GO Train Commuter</h3><p className="text-gray-700">Barrie Line connects to Toronto Union. Many residents commute.</p></div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Barrie Market Factors</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4"><h3 className="font-semibold text-gray-900">Kempenfelt Bay</h3><p className="text-gray-700">Lake Simcoe waterfront with beaches, marina, and waterfront trail.</p></div>
                <div className="border-l-4 border-blue-500 pl-4"><h3 className="font-semibold text-gray-900">Toronto Commuter Town</h3><p className="text-gray-700">GO Train expansion made Barrie accessible. 90km to Toronto.</p></div>
                <div className="border-l-4 border-purple-500 pl-4"><h3 className="font-semibold text-gray-900">Growing Tech Hub</h3><p className="text-gray-700">Tech companies choosing Barrie for lower costs while keeping Toronto access.</p></div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Why Barrie?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Lake Simcoe waterfront</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">GO Train to Toronto</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">$750K vs $1.2M Toronto</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Family-friendly</span></li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/oshawa" className="text-blue-600 hover:underline">Oshawa Rates</Link></li>
                <li><Link href="/cities/hamilton" className="text-blue-600 hover:underline">Hamilton Rates</Link></li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 mt-6"><h3 className="font-bold text-gray-900 mb-2">Compare Barrie Rates</h3><p className="text-gray-600 text-sm mb-4">See rates from Simcoe County lenders.</p><Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">View Rates</Link></div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mt-6"><h3 className="font-bold text-gray-900 mb-2">Share Barrie Rates</h3><SocialShare url="https://latestmortgagerates.ca/cities/barrie"
                title="Best Mortgage Rates Barrie 2025"
                description="Lake Simcoe living with Toronto GO Train access! $750K average. 5-year fixed from 4.19%."
              /></div>
          <CityLendersSidebar cityName="Barrie" />
          </aside>
        </div>
      </div>
    </main>
  );
}
