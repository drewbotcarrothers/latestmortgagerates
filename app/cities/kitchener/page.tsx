import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";

export const dynamic = "force-static";

const kitchenerFaqs = [
  {
    question: "What are current mortgage rates in Kitchener-Waterloo?",
    answer: "Current Kitchener-Waterloo mortgage rates are competitive with 5-year fixed rates starting from 4.19% and 5-year variable rates from 3.85%. Kitchener offers strong value with average home prices around $750,000 - part of Canada's fastest-growing tech corridor.",
  },
  {
    question: "Is Kitchener-Waterloo part of the GTA?",
    answer: "No, Kitchener-Waterloo is the anchor of the separate "Tech Triangle" region about 100km from Toronto. With GO Train expansion and easy highway access, it's becoming a popular alternative for Toronto commuters seeking more affordable housing.",
  },
  {
    question: "Why is Kitchener-Waterloo called the 'Tech Triangle'?",
    answer: "Home to the University of Waterloo (world-renowned engineering), Wilfrid Laurier University, and major tech employers like Google, Shopify, and hundreds of startups. The region has the highest density of startups per capita in Canada.",
  },
  {
    question: "Is Kitchener-Waterloo good for tech workers?",
    answer: "Excellent for tech workers. High-paying jobs, affordable housing (vs Toronto), and a thriving tech ecosystem. Many tech workers live here while working remotely or commuting to Toronto. Strong rental demand from students and tech workers.",
  },
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Kitchener 2025 | Canada's Tech Triangle",
  description: "Find the lowest mortgage rates in Kitchener-Waterloo for 2025. Tech hub of Canada, average home price $750K. Compare Ontario lenders. 5-year fixed from 4.19%.",
  keywords: "Kitchener mortgage rates, Waterloo mortgage rates, KW mortgage broker, best rates Kitchener, Tech Triangle mortgage",
  alternates: { canonical: "https://latestmortgagerates.ca/cities/kitchener" },
  openGraph: {
    title: "Best Mortgage Rates Kitchener 2025 | Tech Hub",
    description: "Canada's Tech Triangle! High incomes, affordable homes. 5-year fixed from 4.19%.",
    url: "https://latestmortgagerates.ca/cities/kitchener", type: "website", locale: "en_CA",
  },
  twitter: { card: "summary_large_image", title: "Best Mortgage Rates Kitchener 2025", description: "Tech Triangle rates! $750K average, startup hub. 5-year fixed from 4.19%." },
};

export default function KitchenerPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "LocalBusiness",
          name: "Latest Mortgage Rates Canada - Kitchener-Waterloo", description: "Best mortgage rates in Kitchener-Waterloo",
          areaServed: { "@type": "City", name: "Kitchener", containedIn: "Ontario" },
          url: "https://latestmortgagerates.ca/cities/kitchener",
        }),
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          mainEntity: kitchenerFaqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
        }),
      }} />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Kitchener-Waterloo</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>💻 Canada's Tech Hub</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Kitchener-Waterloo 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">High-tech salaries, reasonable housing. The Silicon Valley of the North. Find your rate.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Kitchener-Waterloo Mortgage Rates</h2>
              
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
                  <strong>Tech Hub Advantage:</strong> ~$750K average with high-tech salaries. 
                  GO Train expansion connecting to Toronto coming soon.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Buyer Programs</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Ontario LTT Rebate</h3>
                  <p className="text-gray-700">Up to $4,000 rebate. Covers full tax on homes up to $368K.</p>
                </div>                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Tech Worker Salaries</h3>
                  <p className="text-gray-700">High incomes relative to housing costs. Many first-time buyers qualify with tech/startup salaries.</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Kitchener-Waterloo Market Factors</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Google, Shopify, Startups</h3>
                  <p className="text-gray-700">Major tech employers + 1,700+ startups. Highest startup density in Canada.</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">University of Waterloo</h3>
                  <p className="text-gray-700">World-renowned engineering program feeds talent pipeline directly to local tech companies.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Coming GO Train Expansion</h3>
                  <p className="text-gray-700">Two-way all-day GO service will connect Kitchener to Toronto, expected to boost home values.</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Why Kitchener-Waterloo?</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Highest startup density</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">High tech salaries</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Affordable vs Toronto</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Top universities</span></li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/hamilton" className="text-blue-600 hover:underline">Hamilton Rates</Link></li>
                <li><Link href="/cities/london" className="text-blue-600 hover:underline">London Rates</Link></li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Compare KW Rates</h3>
              <p className="text-gray-600 text-sm mb-4">See rates from local mortgage brokers.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                View Rates
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Share KW Rates</h3>
              <p className="text-gray-600 text-sm mb-4">Know a tech worker buying?</p>
              <SocialShare url="https://latestmortgagerates.ca/cities/kitchener"
                title="Best Mortgage Rates Kitchener-Waterloo 2025"
                description="Canada's Tech Triangle! High incomes, $750K average homes. 5-year fixed from 4.19%."
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
