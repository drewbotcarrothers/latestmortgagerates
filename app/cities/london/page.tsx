import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";

export const dynamic = "force-static";

const londonFaqs = [
  {
    question: "What are current mortgage rates in London?",
    answer: "Current London Ontario mortgage rates are competitive with 5-year fixed rates starting from 4.19% and 5-year variable rates from 3.85%. London offers excellent value with average home prices around $680,000 - perfect for families and students.",
  },
  {
    question: "Is London Ontario a good place to buy?",
    answer: "Absolutely! London is known as 'The Forest City' with affordable housing, major healthcare and education sectors, and reasonable cost of living. Average prices ~$680K make it very accessible for first-time buyers and families.",
  },
  {
    question: "Why invest in London real estate?",
    answer: "Strong rental demand from Western University and Fanshawe College students plus healthcare workers (5+ major hospitals). Stable tenant base. Good cash flow potential with reasonable entry prices. Hospital expansion continues.",
  },
  {
    question: "What drives London's economy?",
    answer: "Education (Western University, Fanshawe College) and healthcare (London Health Sciences Centre, St. Joseph's) are anchors. Major research hub. Manufacturing also plays a role. Stable, recession-resistant economy.",
  },
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates London ON 2025 | Forest City Value",
  description: "Find the lowest mortgage rates in London Ontario for 2025. The Forest City, average home price $680K. Compare Ontario lenders. 5-year fixed from 4.19%.",
  keywords: "London mortgage rates, London Ontario mortgage, Forest City mortgage, best rates London, Western University housing",
  alternates: { canonical: "https://latestmortgagerates.ca/cities/london" },
  openGraph: {
    title: "Best Mortgage Rates London 2025 | Forest City",
    description: "The Forest City! Affordable family homes, strong rental market. 5-year fixed from 4.19%.",
    url: "https://latestmortgagerates.ca/cities/london", type: "website", locale: "en_CA",
  },
  twitter: { card: "summary_large_image", title: "Best Mortgage Rates London 2025", description: "Forest City rates! $680K average, university town. 5-year fixed from 4.19%." },
};

export default function LondonPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "LocalBusiness",
          name: "Latest Mortgage Rates Canada - London", description: "Best mortgage rates in London, Ontario",
          areaServed: { "@type": "City", name: "London", containedIn: "Ontario" },
          url: "https://latestmortgagerates.ca/cities/london",
        }),
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          mainEntity: londonFaqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
        }),
      }} />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">London</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>🌳 The Forest City</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in London 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Affordable housing, top universities, strong healthcare sector. Perfect for families.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current London Mortgage Rates</h2>
              
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
                  <strong>Forest City Advantage:</strong> ~$680K average = affordable family homes. 
                  Strong rental demand from 50,000+ students.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Buyer Programs</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Ontario LTT Rebate</h3>
                  <p className="text-gray-700">Up to $4,000 rebate. Full coverage on homes to $368K.</p>
                </div>                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Affordable Entry</h3>
                  <p className="text-gray-700">$680K average makes first homes accessible. Many starter homes under $600K.</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">London Market Factors</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Education Hub</h3>
                  <p className="text-gray-700">Western University + Fanshawe College = 50,000+ students. 
                  Constant rental demand near campus.</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Healthcare Anchor</h3>
                  <p className="text-gray-700">London Health Sciences Centre and 5+ hospitals. 
                  Largest employer in the region. Stable healthcare jobs.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Research Hub</h3>
                  <p className="text-gray-700">Robarts Research Institute and medical research drive innovation 
                  and high-paying jobs.</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Why London?</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Affordable family homes</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Strong student rental market</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Major healthcare employers</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Green space everywhere</span></li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/kitchener" className="text-blue-600 hover:underline">Kitchener Rates</Link></li>
                <li><Link href="/cities/hamilton" className="text-blue-600 hover:underline">Hamilton Rates</Link></li>
                <li><Link href="/cities/windsor" className="text-blue-600 hover:underline">Windsor Rates</Link></li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Compare London Rates</h3>
              <p className="text-gray-600 text-sm mb-4">See rates from London mortgage brokers.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                View Rates
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Share London Rates</h3>
              <p className="text-gray-600 text-sm mb-4">Know someone buying in London?</p>
              <SocialShare url="https://latestmortgagerates.ca/cities/london"
                title="Best Mortgage Rates London 2025"
                description="The Forest City! Affordable homes, university town. 5-year fixed from 4.19%."
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
