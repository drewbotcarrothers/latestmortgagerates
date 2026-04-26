import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";
import CityLendersSidebar from "../../components/CityLendersSidebar";

export const dynamic = "force-static";

const reginaFaqs = [
  { question: "What are current mortgage rates in Regina?", answer: "Current Regina mortgage rates are competitive with 5-year fixed rates from 4.19% and variable from 3.85%. Regina offers outstanding value with average home prices around $330,000 - the most affordable provincial capital in Canada." },
  { question: "Does Regina have land transfer tax?", answer: "No! Like all of Saskatchewan, Regina has no land transfer tax. Only a small title registration fee applies (~$350). This saves buyers thousands compared to provinces with LTT. With $330K average prices, Regina is incredibly affordable." },
  { question: "Is Regina a good place for first-time buyers?", answer: "Extremely good! $330K average = detached homes under $400K. No land transfer tax. Strong government employment. Arguably the most affordable major city for first-time buyers in Canada." },
  { question: "What drives Regina's economy?", answer: "Provincial government is the largest employer. Agriculture, potash mining, and manufacturing also significant. Very stable economy - government work doesn't fluctuate with resource cycles. Saskatchewan Roughriders bring tourism." },
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Regina 2025 | Canada's Most Affordable Capital",
  description: "Find the lowest mortgage rates in Regina for 2025. No land transfer tax! Average home price $330K. Most affordable provincial capital. 5-year fixed from 4.19%.",
  keywords: "Regina mortgage rates, Saskatchewan mortgage, Regina mortgage broker, best rates Regina, affordable housing Regina",
  alternates: { canonical: "https://latestmortgagerates.ca/cities/regina" },
  openGraph: { title: "Best Mortgage Rates Regina 2025 | Most Affordable Capital", description: "Canada's cheapest capital! $330K average, no LTT. 5-year fixed from 4.19%.", url: "https://latestmortgagerates.ca/cities/regina", type: "website", locale: "en_CA" },
  twitter: { card: "summary_large_image", title: "Best Mortgage Rates Regina 2025", description: "$330K average! Cheapest capital city. 5-year fixed from 4.19%." },
};

export default function ReginaPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", name: "Latest Mortgage Rates Canada - Regina", description: "Best mortgage rates in Regina", areaServed: { "@type": "City", name: "Regina", containedIn: "Saskatchewan" }, url: "https://latestmortgagerates.ca/cities/regina" }),
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: reginaFaqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }),
      }} />

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
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3"><span>👑 Canada's Most Affordable Capital!</span></div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Regina 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Provincial capital with prairie prices. No land transfer tax! Average home $330K.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Regina Mortgage Rates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4"><p className="text-sm text-gray-600">5-Year Fixed</p><p className="text-3xl font-bold text-blue-600">4.19%</p><p className="text-sm text-gray-500">Best available rate</p></div>
                <div className="bg-green-50 rounded-lg p-4"><p className="text-sm text-gray-600">5-Year Variable</p><p className="text-3xl font-bold text-green-600">3.85%</p><p className="text-sm text-gray-500">Prime -0.60%</p></div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-700"><strong>Capital Advantage:</strong> ~$330K average = Canada's cheapest provincial capital. No land transfer tax!</p></div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Saskatchewan Programs</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4"><h3 className="font-semibold text-gray-900">No Land Transfer Tax</h3><p className="text-gray-700">Save $5,000-15,000 vs provinces with LTT.</p></div>
                <div className="border-l-4 border-blue-500 pl-4"><h3 className="font-semibold text-gray-900">First-Time Home Buyers' Tax Credit</h3><p className="text-gray-700">Provincial tax credits available.</p></div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Regina Market Factors</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4"><h3 className="font-semibold text-gray-900">Most Affordable Capital</h3><p className="text-gray-700">$330K average = detached homes under $400K. Best value capital city in Canada.</p></div>
                <div className="border-l-4 border-blue-500 pl-4"><h3 className="font-semibold text-gray-900">Government Employment</h3><p className="text-gray-700">Provincial capital = stable government jobs. Unlike resource cities, employment stays steady.</p></div>
                <div className="border-l-4 border-purple-500 pl-4"><h3 className="font-semibold text-gray-900">Wascana Centre</h3><p className="text-gray-700">Larger than NYC's Central Park. Urban park surrounds provincial legislature.</p></div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Why Regina?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Cheapest capital city</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">$330K average homes</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">NO land transfer tax</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Stable government jobs</span></li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/saskatoon" className="text-blue-600 hover:underline">Saskatoon Rates</Link></li>
                <li><Link href="/cities/winnipeg" className="text-blue-600 hover:underline">Winnipeg Rates</Link></li>
                <li><Link href="/cities/edmonton" className="text-blue-600 hover:underline">Edmonton Rates</Link></li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 mt-6"><h3 className="font-bold text-gray-900 mb-2">Compare Regina Rates</h3><p className="text-gray-600 text-sm mb-4">See rates from Saskatchewan lenders.</p><Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">View Rates</Link></div>
            <div className="bg-white rounded-lg shadow-md p-6 mt-6"><h3 className="font-bold text-gray-900 mb-2">Share Regina Rates</h3><SocialShare url="https://latestmortgagerates.ca/cities/regina"
                title="Best Mortgage Rates Regina 2025"
                description="Canada's cheapest capital! $330K average, no property transfer tax. 5-year fixed from 4.19%."
              /></div>
          <CityLendersSidebar cityName="Regina" />
          </aside>
        </div>
      </div>
    </main>
  );
}
