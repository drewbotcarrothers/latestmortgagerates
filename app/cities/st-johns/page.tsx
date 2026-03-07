import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";

export const dynamic = "force-static";

const stJohnsFaqs = [
  { question: "What are current mortgage rates in St. John's?", answer: "Current St. John's mortgage rates are competitive with 5-year fixed rates from 4.19% and variable from 3.85%. St. John's offers exceptional value with average home prices around $315,000 - the most affordable major city in Canada." },
  { question: "Does Newfoundland have land transfer tax?", answer: "No! Newfoundland and Labrador does not have land transfer tax. You only pay legal fees (~$800-1,500) for closing. This is one of the lowest cost closing provinces in Canada." },
  { question: "Is St. John's a good place for first-time buyers?", answer: "Extremely good! At ~$315K average it's Canada's most affordable major city. No land transfer tax. Low property taxes. You can buy a beautiful home in a city center for under $400K." },
  { question: "What drives St. John's economy?", answer: "Oil and gas offshore are major drivers (Hibernia, Hebron, Terra Nova). Memorial University is significant. Provincial government. Ocean research and fishing. Economy fluctuates with oil but has diversified." },
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates St. John's 2025 | Canada's Cheapest City",
  description: "Find the lowest mortgage rates in St. John's for 2025. No land transfer tax! Average home price $315K. Canada's most affordable major city. 5-year fixed from 4.19%.",
  keywords: "St. Johns mortgage rates, Newfoundland mortgage, St. John's mortgage broker, best rates St. John's",
  alternates: { canonical: "https://latestmortgagerates.ca/cities/st-johns" },
  openGraph: { title: "Best Mortgage Rates St. John's 2025 | Canada's Cheapest", description: "Canada's lowest prices! $315K average. 5-year fixed from 4.19%.", url: "https://latestmortgagerates.ca/cities/st-johns", type: "website", locale: "en_CA" },
  twitter: { card: "summary_large_image", title: "Best Mortgage Rates St. John's 2025", description: "$315K average! Canada's cheapest big city. 5-year fixed from 4.19%." },
};

export default function StJohnsPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", name: "Latest Mortgage Rates Canada - St. John's", description: "Best mortgage rates in St. John's", areaServed: { "@type": "City", name: "St. John's", containedIn: "Newfoundland" }, url: "https://latestmortgagerates.ca/cities/st-johns" }),
      }} />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: stJohnsFaqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }),
      }} />

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
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3"><span>🏠 Canada's Most Affordable City!</span></div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in St. John's 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Atlantic Canada's oldest city. $315K average! No land transfer tax. Find your rate.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current St. John's Mortgage Rates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4"><p className="text-sm text-gray-600">5-Year Fixed</p><p className="text-3xl font-bold text-blue-600">4.19%</p><p className="text-sm text-gray-500">Best available rate</p></div>
                <div className="bg-green-50 rounded-lg p-4"><p className="text-sm text-gray-600">5-Year Variable</p><p className="text-3xl font-bold text-green-600">3.85%</p><p className="text-sm text-gray-500">Prime -0.60%</p></div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-700"><strong>Eastern Value:</strong> ~$315K average = Canada's cheapest major city. Historic colorful houses!</p></div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Newfoundland Programs</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4"><h3 className="font-semibold text-gray-900">No Land Transfer Tax</h3><p className="text-gray-700">Only legal fees apply. Lowest closing costs in Canada.</p></div>
                <div className="border-l-4 border-blue-500 pl-4"><h3 className="font-semibold text-gray-900">Home Purchase Program</h3><p className="text-gray-700">Provincial grants for first-time buyers available.</p></div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">St. John's Market Factors</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4"><h3 className="font-semibold text-gray-900">Jellybean Row Houses</h3><p className="text-gray-700">Colorful historic homes in downtown. Unique character properties.</p></div>
                <div className="border-l-4 border-blue-500 pl-4"><h3 className="font-semibold text-gray-900">Signal Hill</h3><p className="text-gray-700">Historic landmark with stunning harbor views. Tourism and culture hub.</p></div>
                <div className="border-l-4 border-purple-500 pl-4"><h3 className="font-semibold text-gray-900">Memorial University</h3><p className="text-gray-700">Affordable tuition attracts 18,000+ students. Strong rental market.</p></div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Why St. John's?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">$315K average homes</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">NO land transfer tax</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Colorful Jellybean Row</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Rich history and culture</span></li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/halifax" className="text-blue-600 hover:underline">Halifax Rates</Link></li>
                <li><Link href="/cities/moncton" className="text-blue-600 hover:underline">Moncton Rates</Link></li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Compare St. John's Rates</h3>
              <p className="text-gray-600 text-sm mb-4">See rates from Newfoundland lenders.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">View Rates</Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Share St. John's Rates</h3>
              <SocialShare url="https://latestmortgagerates.ca/cities/st-johns"
                title="Best Mortgage Rates St. John's 2025"
                description="Canada's cheapest major city! $315K average, Jellybean Row houses. 5-year fixed from 4.19%."
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
