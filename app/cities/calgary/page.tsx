import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";
import CityLendersSidebar from "../../components/CityLendersSidebar";

export const dynamic = "force-static";

// Calgary-specific FAQs
const calgaryFaqs = [
  {
    question: "What are current mortgage rates in Calgary?",
    answer: "Current Calgary mortgage rates are competitive with 5-year fixed rates starting from 4.19% and 5-year variable rates from 3.85%. Calgary's market is more affordable than Toronto or Vancouver, with average home prices around $540,000.",
  },
  {
    question: "Does Alberta have land transfer tax?",
    answer: "No! Alberta is one of the few provinces with no land transfer tax. This saves homebuyers thousands compared to Ontario or BC. You only pay a small property registration fee of approximately $300-500 depending on property value.",
  },
  {
    question: "Is Calgary a good place to buy a home?",
    answer: "Calgary offers excellent value with average home prices around $540,000 - significantly lower than Toronto ($1.2M) or Vancouver ($2M). The energy sector drives the economy, and there's no provincial sales tax on goods.",
  },
  {
    question: "Which lenders offer the best rates in Calgary?",
    answer: "Calgary has strong representation from major banks, credit unions (Servus, Connect First), and online lenders. Due to no land transfer tax, homebuyers can often qualify for better rates with larger down payments.",
  },
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Calgary 2025 | Alberta's Most Affordable Market",
  description: "Find the lowest mortgage rates in Calgary for 2025. Compare rates from Alberta lenders. No land transfer tax! 5-year fixed from 4.19%. Average home price $540K.",
  keywords: "Calgary mortgage rates, Alberta mortgage rates, Calgary mortgage broker, best rates Calgary, Calgary home buyer, no land transfer tax Alberta, Alberta mortgage",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/calgary",
  },
  openGraph: {
    title: "Best Mortgage Rates Calgary 2025 | No Land Transfer Tax!",
    description: "Compare Calgary mortgage rates from Alberta lenders. No land transfer tax! 5-year fixed from 4.19%. Average home price $540K.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/calgary",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates Calgary 2025",
    description: "Calgary mortgage rates - no land transfer tax! 5-year fixed from 4.19%.",
  },
};

export default function CalgaryPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* LocalBusiness Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Calgary",
            description: "Best mortgage rates in Calgary, Alberta",
            areaServed: {
              "@type": "City",
              name: "Calgary",
              containedIn: "Alberta",
            },
            url: "https://latestmortgagerates.ca/cities/calgary",
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
            mainEntity: calgaryFaqs.map((faq) => ({
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
              <li className="text-slate-900 font-medium">Calgary</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>No Land Transfer Tax in Alberta!</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Best Mortgage Rates in Calgary 2025</h1>
              <p className="text-slate-600 mt-2 text-lg">Enjoy lower closing costs and competitive rates in Alberta's largest city</p>
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Current Calgary Mortgage Rates</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-teal-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">5-Year Fixed Rate</p>
                  <p className="text-3xl font-bold text-teal-600">4.19%</p>
                  <p className="text-sm text-slate-500">Starting from</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">5-Year Variable Rate</p>
                  <p className="text-3xl font-bold text-emerald-600">3.85%</p>
                  <p className="text-sm text-slate-500">Starting from</p>
                </div>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-900 mb-2">💰 Alberta Advantage: No Land Transfer Tax</h3>
                <p className="text-green-800">
                  Unlike Ontario and BC, Alberta has no land transfer tax. On a $500,000 home, you save $8,000-$10,000 compared to Toronto buyers!
                </p>
              </div>
              
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All Calgary Rates →
                </Link>
              </div>
            </section>

            {/* Calgary Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Calgary Housing Market Overview</h2>
              
              <p className="text-slate-700 mb-4">
                Calgary offers exceptional value compared to Toronto and Vancouver. With average home prices around $540,000 and no land transfer tax, Calgary is one of Canada's most affordable major cities for homebuyers.
              </p>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Average Home Prices (2025)</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600">Detached Homes</p>
                  <p className="text-xl font-bold text-slate-900">$680,000</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600">Semi-Detached</p>
                  <p className="text-xl font-bold text-slate-900">$485,000</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600">Townhouses</p>
                  <p className="text-xl font-bold text-slate-900">$410,000</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600">Apartments</p>
                  <p className="text-xl font-bold text-slate-900">$295,000</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Alberta's Housing Market Advantages</h3>
              
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li><strong>No Land Transfer Tax:</strong> Save thousands on closing costs</li>
                <li><strong>No Provincial Sales Tax on CMHC:</strong> Unlike Ontario and Quebec</li>
                <li><strong>Higher Median Income:</strong> $72,000 vs $56,000 national average</li>
                <li><strong>Lower Overall Costs:</strong> Utilities, insurance, and property taxes tend to be lower</li>
                <li><strong>Strong Economy:</strong> Diversifying beyond energy with tech and finance growth</li>
              </ul>
            </section>

            {/* First-Time Buyers Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">First-Time Buyers in Calgary</h2>
              
              <p className="text-slate-700 mb-4">
                Calgary is an excellent market for first-time buyers. Here's why:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Affordable Entry Point</h3>
                  <p className="text-slate-700">With average prices 50% lower than Toronto, your down payment goes much further.</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Lower Closing Costs</h3>
                  <p className="text-slate-700">No land transfer tax means you keep thousands for your down payment or home improvements.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Competitive Mortgage Market</h3>
                  <p className="text-slate-700">Many lenders compete aggressively for Calgary mortgages, keeping rates competitive.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-slate-900 mb-4">Why Calgary?</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-slate-700">No land transfer tax</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-slate-700">Affordable home prices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-slate-700">High median incomes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-slate-700">Low property taxes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-slate-700">Growing tech sector</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-slate-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/toronto" className="text-teal-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/vancouver" className="text-teal-600 hover:underline">Vancouver Rates</Link></li>
                <li><Link href="/cities/montreal" className="text-teal-600 hover:underline">Montreal Rates</Link></li>
              </ul>
            </div>
          <CityLendersSidebar cityName="Calgary" />
          </aside>
        </div>

        {/* Social Sharing Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-slate-900 mb-2">Share Calgary Mortgage Rates</h3>
          <p className="text-slate-600 text-sm mb-4">
            Know someone buying in Calgary? Share these rates with them.
          </p>
          <SocialShare 
            url="https://latestmortgagerates.ca/cities/calgary"
            title="Best Mortgage Rates in Calgary 2025"
            description="No land transfer tax in Calgary! Compare the lowest mortgage rates from Alberta lenders. 5-year fixed from 4.19%."
          />
        </div>
      </div>
    </main>
  );
}
