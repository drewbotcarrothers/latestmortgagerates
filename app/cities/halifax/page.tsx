import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";
import CityLendersSidebar from "../../components/CityLendersSidebar";

export const dynamic = "force-static";

// Halifax-specific FAQs
const halifaxFaqs = [
  {
    question: "What are current mortgage rates in Halifax?",
    answer: "Current Halifax mortgage rates are competitive with 5-year fixed rates starting from 4.19% and 5-year variable rates from 3.85%. Halifax offers excellent value with average home prices around $520,000 - one of the most affordable major cities in Canada.",
  },
  {
    question: "Does Nova Scotia have land transfer tax?",
    answer: "Nova Scotia uses a Deed Transfer Tax which varies by municipality - typically 1-1.5% of property value. Halifax Regional Municipality charges 1.5%. First-time buyers may be eligible for rebates depending on the municipality.",
  },
  {
    question: "Is Halifax a good market for first-time buyers?",
    answer: "Yes! Halifax is very affordable with average prices ~$520K compared to $1.2M in Toronto. Strong population growth, growing tech sector, and ocean access make it attractive. Atlantic Immigration Program brings new residents.",
  },
  {
    question: "How is Halifax's economy?",
    answer: "Halifax has a stable, diversified economy with government (provincial capital), military (largest Canadian Forces base), universities (6 major institutions), healthcare, and growing tech/film sectors. Population growing 2%+ annually.",
  },
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Halifax 2025 | Atlantic Canada's Hub",
  description: "Find the lowest mortgage rates in Halifax for 2025. Affordable housing, average home price $520K. Compare rates from Nova Scotia lenders. 5-year fixed from 4.19%.",
  keywords: "Halifax mortgage rates, Nova Scotia mortgage rates, Halifax mortgage broker, best rates Halifax, Halifax home buyer, Atlantic Canada mortgage",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/halifax",
  },
  openGraph: {
    title: "Best Mortgage Rates Halifax 2025 | Atlantic Canada",
    description: "Halifax mortgage rates - affordable Atlantic living! Average $520K. 5-year fixed from 4.19%.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/halifax",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates Halifax 2025",
    description: "Halifax mortgage rates - ocean living, affordable prices! 5-year fixed from 4.19%.",
  },
};

export default function HalifaxPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* LocalBusiness Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Halifax",
            description: "Best mortgage rates in Halifax, Nova Scotia",
            areaServed: {
              "@type": "City",
              name: "Halifax",
              containedIn: "Nova Scotia",
            },
            url: "https://latestmortgagerates.ca/cities/halifax",
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
            mainEntity: halifaxFaqs.map((faq) => ({
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
          <nav className="text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-teal-600">Home</Link></li>
              <li><span className="text-slate-400">/</span></li>
              <li className="text-slate-900 font-medium">Halifax</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>🌊 Ocean Living, Affordable Prices!</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Best Mortgage Rates in Halifax 2025</h1>
              <p className="text-slate-600 mt-2 text-lg">Atlantic Canada's fastest-growing city. Affordable homes by the ocean. Find your rate.</p>
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Current Halifax Mortgage Rates</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-teal-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">5-Year Fixed</p>
                  <p className="text-3xl font-bold text-teal-600">4.19%</p>
                  <p className="text-sm text-slate-500">Best available rate</p>
                </div>
                
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">5-Year Variable</p>
                  <p className="text-3xl font-bold text-emerald-600">3.85%</p>
                  <p className="text-sm text-slate-500">Prime -0.60%</p>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-700">
                  <strong>Halifax Advantage:</strong> Average home price ~$520K. 
                  Live by the ocean without Toronto prices. Population growing 2%+ annually.
                </p>
              </div>
            </section>

            {/* First-time Buyer Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">First-Time Buyer Programs</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Affordable Entry Point</h3>
                  <p className="text-slate-700">$520K average means entry-level homes under $400K are common. 
                  More affordable than any other major Canadian city.</p>
                </div>                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Atlantic Immigration Program</h3>
                  <p className="text-slate-700">Federal program fast-tracks permanent residence for skilled workers 
                  and international graduates who want to stay in Atlantic Canada.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-slate-900">First Home Savings Account</h3>
                  <p className="text-slate-700">Save up to $40,000 tax-free. In Halifax, that's a significant portion of your down payment!</p>
                </div>
              </div>
            </section>

            {/* Halifax Market Factors */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Halifax Market Factors</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Fast Population Growth</h3>
                  <p className="text-slate-700">Halifax is one of Canada's fastest-growing cities. 
                  Remote workers from Toronto and Vancouver are relocating for affordability.</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Military Presence</h3>
                  <p className="text-slate-700">Home to CFB Halifax, Canada's largest military base. 
                  Military buyers often get special mortgage programs.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Education Hub</h3>
                  <p className="text-slate-700">Six major universities bring students and staff. 
                  Strong rental demand makes it good for investors.</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Quality of Life</h3>
                  <p className="text-slate-700">Coastal lifestyle, short commutes, lower cost of living, 
                  vibrant food scene, and welcoming community.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-slate-900 mb-4">Why Halifax?</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-slate-700">Ocean access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-slate-700">Fastest growing Atlantic city</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-slate-700">Affordable vs major cities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-slate-700">Strong rental market</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-slate-700">No provincial sales tax on insurance</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-slate-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/toronto" className="text-teal-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/montreal" className="text-teal-600 hover:underline">Montreal Rates</Link></li>
                <li><Link href="/cities/ottawa" className="text-teal-600 hover:underline">Ottawa Rates</Link></li>
              </ul>
            </div>

            <div className="bg-teal-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-slate-900 mb-2">Compare Halifax Rates</h3>
              <p className="text-slate-600 text-sm mb-4">See rates from Nova Scotia lenders.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                View Rates
              </Link>
            </div>
          <CityLendersSidebar cityName="Halifax" />
          </aside>
        </div>

        {/* Social Sharing Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-slate-900 mb-2">Share Halifax Mortgage Rates</h3>
          <p className="text-slate-600 text-sm mb-4">
            Know someone moving to Halifax? Share these affordable rates!
          </p>
          <SocialShare 
            url="https://latestmortgagerates.ca/cities/halifax"
            title="Best Mortgage Rates in Halifax 2025"
            description="Ocean living at affordable prices! Average home $520K. Compare the lowest mortgage rates in Atlantic Canada."
          />
        </div>
      </div>
    </main>
  );
}
