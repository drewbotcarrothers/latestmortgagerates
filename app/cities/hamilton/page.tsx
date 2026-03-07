import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";

export const dynamic = "force-static";

// Hamilton-specific FAQs
const hamiltonFaqs = [
  {
    question: "What are current mortgage rates in Hamilton?",
    answer: "Current Hamilton mortgage rates are competitive with 5-year fixed rates starting from 4.19% and 5-year variable rates from 3.85%. Hamilton offers value with average home prices around $800,000 - significantly less than Toronto's $1.2M average.",
  },
  {
    question: "Is Hamilton part of the GTA?",
    answer: "Hamilton is part of the Greater Toronto and Hamilton Area (GTHA) but not the GTA proper. It's about 70km from Toronto with GO Train service. Many Toronto workers moved here for affordability while commuting to the city.",
  },
  {
    question: "Is Hamilton good for first-time buyers?",
    answer: "Hamilton offers a middle ground - more affordable than Toronto ($800K vs $1.2M) with city amenities. Strong rental demand makes it popular for investors. First-time buyers get access to all Ontario first-time buyer programs.",
  },
  {
    question: "How is Hamilton's real estate market?",
    answer: "Hamilton's market cooled from 2021 peaks but remains stable. Significant development along the waterfront and in the downtown core. Growing tech scene and life sciences sector at McMaster Innovation Park.",
  },
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Hamilton 2025 | Toronto Alternative",
  description: "Find the lowest mortgage rates in Hamilton for 2025. GTA alternative, average home price $800K. Compare Ontario lenders. 5-year fixed from 4.19%. GO Train to Toronto.",
  keywords: "Hamilton mortgage rates, Hamilton mortgage broker, best rates Hamilton, Hamilton home buyer, GTA mortgage, Toronto commuter",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/hamilton",
  },
  openGraph: {
    title: "Best Mortgage Rates Hamilton 2025 | Toronto Alternative",
    description: "Hamilton mortgage rates - GTA living, Toronto prices! Average $800K. 5-year fixed from 4.19%.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/hamilton",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates Hamilton 2025",
    description: "Hamilton - Toronto alternative! $800K average homes. 5-year fixed from 4.19%.",
  },
};

export default function HamiltonPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Hamilton",
            description: "Best mortgage rates in Hamilton, Ontario",
            areaServed: {
              "@type": "City",
              name: "Hamilton",
              containedIn: "Ontario",
            },
            url: "https://latestmortgagerates.ca/cities/hamilton",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: hamiltonFaqs.map((faq) => ({
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
              <li className="text-gray-900 font-medium">Hamilton</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>🚆 GO Train to Toronto</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Hamilton 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">The affordable GTA alternative. $800K average vs $1.2M in Toronto. Find your rate.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Hamilton Mortgage Rates</h2>
              
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
                  <strong>Hamilton Advantage:</strong> $800K average saves $400K+ vs Toronto. 
                  GO Train commuter service to Union Station (70 min).
                </p>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Buyer Programs</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Ontario LTT Rebate</h3>
                  <p className="text-gray-700">Up to $4,000 rebate on Ontario land transfer tax for first-time buyers.</p>
                </div>                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">FHSA + HBP</h3>
                  <p className="text-gray-700">Combine First Home Savings Account ($40K) with Home Buyers' Plan ($35K) for $75K down payment.</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hamilton Market Factors</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">GO Transit Connection</h3>
                  <p className="text-gray-700">Regular train service to Toronto. Many residents commute while enjoying lower home prices.</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">McMaster University</h3>
                  <p className="text-gray-700">Top-ranked research university drives innovation and talent. Strong student rental market.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Waterfront Development</h3>
                  <p className="text-gray-700">Regeneration of the west harbour area with new condos, parks, and amenities.</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Why Hamilton?</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">$400K+ savings vs Toronto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">GO Train to Toronto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Strong rental market</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Waterfront development</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/oshawa" className="text-blue-600 hover:underline">Oshawa Rates</Link></li>
                <li><Link href="/cities/barrie" className="text-blue-600 hover:underline">Barrie Rates</Link></li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Compare Hamilton Rates</h3>
              <p className="text-gray-600 text-sm mb-4">See rates from Hamilton mortgage brokers.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                View Rates
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Share Hamilton Rates</h3>
              <p className="text-gray-600 text-sm mb-4">Know someone buying in Hamilton?</p>
              <SocialShare 
                url="https://latestmortgagerates.ca/cities/hamilton"
                title="Best Mortgage Rates in Hamilton 2025"
                description="Toronto alternative! $800K average homes, GO Train access. 5-year fixed from 4.19%."
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
