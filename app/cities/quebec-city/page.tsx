import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";
import CityLendersSidebar from "../../components/CityLendersSidebar";

export const dynamic = "force-static";

const quebecCityFaqs = [
  {
    question: "What are current mortgage rates in Quebec City?",
    answer: "Current Quebec City mortgage rates are competitive with 5-year fixed rates starting from 4.19% and 5-year variable rates from 3.85%. Quebec City offers excellent value with average home prices around $360,000 - one of Canada's most affordable major cities.",
  },
  {
    question: "Is Quebec City affordable for first-time buyers?",
    answer: "Extremely! With average prices around $360K, Quebec City is among Canada's most affordable major cities. Combine provincial programs (RQAP), federal programs (FHSA), and Quebec's unique mortgage rules for best results.",
  },
  {
    question: "How does the mortgage process differ in Quebec?",
    answer: "Quebec mortgages (hypothèques) require notary involvement and use civil law vs common law. The closing process is different. Welcome tax (taxe de bienvenue) applies, but rates are reasonable. French proficiency helps but isn't required for mortgages.",
  },
  {
    question: "Who are the main employers in Quebec City?",
    answer: "Provincial government is the largest employer. Other major employers include Laval University, CHU de Québec (hospitals), and growing tech/animation sectors. Very stable economy with low unemployment.",
  },
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Quebec City 2025 | Historic Capital",
  description: "Find the lowest mortgage rates in Quebec City for 2025. Historic capital, average home price $360K. Compare Quebec lenders. 5-year fixed from 4.19%.",
  keywords: "Quebec City mortgage rates, Quebec mortgage, hypotheque Quebec City, best rates Quebec City, Quebec City home buyer",
  alternates: { canonical: "https://latestmortgagerates.ca/cities/quebec-city" },
  openGraph: {
    title: "Best Mortgage Rates Quebec City 2025 | Historic Capital",
    description: "Historic charm, modern prices! Average $360K. 5-year fixed from 4.19%.",
    url: "https://latestmortgagerates.ca/cities/quebec-city", type: "website", locale: "en_CA",
  },
  twitter: { card: "summary_large_image", title: "Best Mortgage Rates Quebec City 2025", description: "Historic capital! $360K average homes. 5-year fixed from 4.19%." },
};

export default function QuebecCityPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", name: "Latest Mortgage Rates Canada - Quebec City", description: "Best mortgage rates in Quebec City", areaServed: { "@type": "City", name: "Quebec City", containedIn: "Quebec" }, url: "https://latestmortgagerates.ca/cities/quebec-city" }),
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: quebecCityFaqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }),
      }} />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Quebec City</li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>🏛️ UNESCO World Heritage Site</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Quebec City 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Historic charm meets modern affordability. Average home just $360K. Find your rate.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Quebec City Mortgage Rates</h2>
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
                <p className="text-sm text-gray-700"><strong>Historic Value:</strong> ~$360K average. Buy in a UNESCO World Heritage site for less than a Toronto condo.</p>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quebec First-Time Buyer Programs</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">RQAP (Régime d'accès à la propriété)</h3>
                  <p className="text-gray-700">Quebec's homeownership program helps buyers with down payments. Specific eligibility rules apply.</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Welcome Tax Exemptions</h3>
                  <p className="text-gray-700">First-time buyers may qualify for municipal welcome tax exemptions or rebates depending on the municipality.</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quebec City Market Factors</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Incredible Affordability</h3>
                  <p className="text-gray-700">$360K average in a major Canadian city. Detached homes under $400K common. First-time buyers can afford houses here.</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Tourism Economy</h3>
                  <p className="text-gray-700">Historic Old Quebec, Winter Carnival, and cruise ship port drive tourism jobs and short-term rental demand.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Provincial Capital</h3>
                  <p className="text-gray-700">Stable government employment anchors the economy. Unlike resource towns, job market stays consistent year-round.</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Why Quebec City?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">UNESCO World Heritage</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">$360K average homes</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Historic European charm</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Lowest unemployment in Canada</span></li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/montreal" className="text-blue-600 hover:underline">Montreal Rates</Link></li>
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/halifax" className="text-blue-600 hover:underline">Halifax Rates</Link></li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Compare Quebec City Rates</h3>
              <p className="text-gray-600 text-sm mb-4">See rates from Quebec lenders.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">View Rates</Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Share Quebec City Rates</h3>
              <p className="text-gray-600 text-sm mb-4">Know someone buying?</p>
              <SocialShare url="https://latestmortgagerates.ca/cities/quebec-city"
                title="Best Mortgage Rates Quebec City 2025"
                description="UNESCO World Heritage site, $360K average homes! 5-year fixed from 4.19%."
              />
            </div>
          <CityLendersSidebar cityName="Quebec City" />
          </aside>
        </div>
      </div>
    </main>
  );
}
