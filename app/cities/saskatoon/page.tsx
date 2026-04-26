import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";
import CityLendersSidebar from "../../components/CityLendersSidebar";

export const dynamic = "force-static";

const saskatoonFaqs = [
  { question: "What are current mortgage rates in Saskatoon?", answer: "Current Saskatoon mortgage rates are competitive with 5-year fixed rates from 4.19% and variable from 3.85%. Saskatoon offers excellent value with average home prices around $380,000 - one of Canada's most affordable growing cities." },
  { question: "Does Saskatoon have land transfer tax?", answer: "No! Saskatchewan has no land transfer tax. Only a small land title registration fee (~$350-500). This saves buyers thousands compared to Ontario and BC. Combined with affordable prices, Saskatoon is perfect for first-time buyers." },
  { question: "Is Saskatoon a good city to buy in?", answer: "Absolutely! Saskatoon is one of Canada's fastest-growing cities with affordable housing ($380K average), strong job market in agriculture/tech/healthcare, and excellent quality of life. Called the 'Paris of the Prairies' for its bridges and university." },
  { question: "What drives Saskatoon's economy?", answer: "Agriculture and potash mining are traditional anchors. Growing tech sector (tech incubator), University of Saskatchewan (research powerhouse), and healthcare. Stable economy during resource cycles." },
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Saskatoon 2025 | Paris of the Prairies",
  description: "Find the lowest mortgage rates in Saskatoon for 2025. No land transfer tax! Average home price $380K. Fast-growing prairie city. 5-year fixed from 4.19%.",
  keywords: "Saskatoon mortgage rates, Saskatchewan mortgage, Saskatoon mortgage broker, best rates Saskatoon",
  alternates: { canonical: "https://latestmortgagerates.ca/cities/saskatoon" },
  openGraph: { title: "Best Mortgage Rates Saskatoon 2025 | Prairies", description: "Paris of the Prairies! No land transfer tax. 5-year fixed from 4.19%.", url: "https://latestmortgagerates.ca/cities/saskatoon", type: "website", locale: "en_CA" },
  twitter: { card: "summary_large_image", title: "Best Mortgage Rates Saskatoon 2025", description: "$380K average, no LTT! 5-year fixed from 4.19%." },
};

export default function SaskatoonPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", name: "Latest Mortgage Rates Canada - Saskatoon", description: "Best mortgage rates in Saskatoon", areaServed: { "@type": "City", name: "Saskatoon", containedIn: "Saskatchewan" }, url: "https://latestmortgagerates.ca/cities/saskatoon" }),
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: saskatoonFaqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }),
      }} />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Saskatoon</li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-3"><span>🌾 Paris of the Prairies</span></div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Saskatoon 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Fast-growing prairie city. No land transfer tax! Average home $380K.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Saskatoon Mortgage Rates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4"><p className="text-sm text-gray-600">5-Year Fixed</p><p className="text-3xl font-bold text-blue-600">4.19%</p><p className="text-sm text-gray-500">Best available rate</p></div>
                <div className="bg-green-50 rounded-lg p-4"><p className="text-sm text-gray-600">5-Year Variable</p><p className="text-3xl font-bold text-green-600">3.85%</p><p className="text-sm text-gray-500">Prime -0.60%</p></div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-700"><strong>Prairie Advantage:</strong> ~$380K average, no LTT. Fast-growing economy with university and ag-tech.</p></div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Saskatchewan Programs</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4"><h3 className="font-semibold text-gray-900">No Land Transfer Tax</h3><p className="text-gray-700">Save thousands in closing costs. Only small registration fee applies.</p></div>
                <div className="border-l-4 border-blue-500 pl-4"><h3 className="font-semibold text-gray-900">First-Time Home Buyers' Tax Credit</h3><p className="text-gray-700">Saskatchewan offers tax credits for first-time buyers.</p></div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Saskatoon Market Factors</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4"><h3 className="font-semibold text-gray-900">University of Saskatchewan</h3><p className="text-gray-700">Research powerhouse driving innovation economy. Strong rental demand from students.</p></div>
                <div className="border-l-4 border-blue-500 pl-4"><h3 className="font-semibold text-gray-900">Agriculture Tech Hub</h3><p className="text-gray-700">Global ag-tech research center. Innovations in crop science and ag automation.</p></div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Why Saskatoon?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">NO land transfer tax</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">$380K average homes</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Research university</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Growing tech sector</span></li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/regina" className="text-blue-600 hover:underline">Regina Rates</Link></li>
                <li><Link href="/cities/edmonton" className="text-blue-600 hover:underline">Edmonton Rates</Link></li>
                <li><Link href="/cities/calgary" className="text-blue-600 hover:underline">Calgary Rates</Link></li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Compare Saskatoon Rates</h3>
              <p className="text-gray-600 text-sm mb-4">See rates from Saskatchewan lenders.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">View Rates</Link>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Share Saskatoon Rates</h3>
              <SocialShare url="https://latestmortgagerates.ca/cities/saskatoon"
                title="Best Mortgage Rates Saskatoon 2025"
                description="Paris of the Prairies! No land transfer tax, $380K average. 5-year fixed from 4.19%."
              />
            </div>
          <CityLendersSidebar cityName="Saskatoon" />
          </aside>
        </div>
      </div>
    </main>
  );
}
