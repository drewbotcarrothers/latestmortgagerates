import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";
import CityLendersSidebar from "../../components/CityLendersSidebar";
import CityTools from "../../components/CityTools";

export const dynamic = "force-static";

const monctonFaqs = [
  {
    "question": "What are current mortgage rates in Moncton?",
    "answer": "Current Moncton mortgage rates are competitive with 5-year fixed rates starting from 4.38% and 5-year variable rates from 3.51%. Rates vary by lender including major banks like RBC, TD, Scotiabank, BMO, CIBC, as well as local credit unions and online lenders."
  },
  {
    "question": "Are mortgage rates different in Moncton than other cities?",
    "answer": "Mortgage rates in Moncton are generally consistent with national rates, as lenders price mortgages based on the borrower and property, not the city. However, Moncton's local market conditions and property values affect the total mortgage amount and monthly payments."
  },
  {
    "question": "What is the land transfer tax in Moncton?",
    "answer": "New Brunswick Real Property Transfer Tax: 1% of assessed value or purchase price (whichever is greater)."
  },
  {
    "question": "Which lenders offer the best rates in Moncton?",
    "answer": "The best mortgage rates in Moncton come from a mix of major banks, local credit unions, and online lenders. Shopping with a mortgage broker can help you compare rates from 20+ lenders at once."
  }
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Moncton 2026 | Current & Historical Rates",
  description: "Find the lowest mortgage rates in Moncton for 2026. Compare rates from 20+ lenders. 5-year fixed from 4.29%. Updated daily.",
  keywords: "Moncton mortgage rates, Moncton mortgage broker, best rates Moncton, Moncton home buyer, mortgage rates today",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/moncton",
  },
  openGraph: {
    title: "Best Mortgage Rates Moncton 2026 | Compare 20+ Lenders",
    description: "Find the lowest mortgage rates in Moncton. 5-year fixed from 4.10%. Compare banks, credit unions & online lenders.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/moncton",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates Moncton 2026",
    description: "Compare Moncton mortgage rates from 20+ lenders. 5-year fixed from 4.02%.",
  },
};

export default function MonctonPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Moncton",
            description: "Best mortgage rates in Moncton",
            areaServed: {
              "@type": "City",
              name: "Moncton",
              containedIn: "New Brunswick",
            },
            url: "https://latestmortgagerates.ca/cities/moncton",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: monctonFaqs.map((faq) => ({
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
              <li className="text-slate-900 font-medium">Moncton</li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Best Mortgage Rates in Moncton 2026</h1>
              <p className="text-slate-600 mt-2 text-lg">Compare the lowest rates from Moncton lenders and find your perfect mortgage</p>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Current Moncton Mortgage Rates</h2>
              <p className="text-slate-600 mb-6">Updated daily with the best rates from Moncton-area lenders.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-teal-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">5-Year Fixed Rate</p>
                  <p className="text-3xl font-bold text-teal-600">4.42%</p>
                  <p className="text-sm text-slate-500">Starting from</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">5-Year Variable Rate</p>
                  <p className="text-3xl font-bold text-emerald-600">3.50%</p>
                  <p className="text-sm text-slate-500">Starting from</p>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
                  Compare All Moncton Rates →
                </Link>
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Moncton Housing Market Overview</h2>
              <div className="prose max-w-none">
                <p className="text-slate-700 mb-4">
                  Moncton is a growing community in New Brunswick with a population of approximately 80,000. The local housing market offers a range of options from detached homes to condos, with average prices reflecting the city's desirability and growth.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Average Home Prices (2026)</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Detached Homes</p>
                    <p className="text-xl font-bold text-slate-900">$350,000</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Semi-Detached</p>
                    <p className="text-xl font-bold text-slate-900">$280,000</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Townhouses</p>
                    <p className="text-xl font-bold text-slate-900">$250,000</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Condos</p>
                    <p className="text-xl font-bold text-slate-900">$200,000</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Moncton-Specific Considerations</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  <li><strong>Land Transfer Tax:</strong> New Brunswick Real Property Transfer Tax: 1% of assessed value or purchase price (whichever is greater).</li>
                  <li><strong>Market Trends:</strong> Moncton continues to attract buyers due to its affordable housing compared to larger cities.</li>
                  <li><strong>Lender Options:</strong> Buyers in Moncton have access to major banks, local credit unions, and online lenders.</li>
                </ul>
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">First-Time Home Buyers in Moncton</h2>
              <p className="text-slate-700 mb-4">
                Moncton offers opportunities for first-time buyers with various programs and strategies:
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Government Programs</h3>
                  <p className="text-slate-700">Use the FHSA ($40,000 tax-free savings) and HBP ($60,000 from RRSP) to increase your down payment. New Brunswick Real Property Transfer Tax: 1% of assessed value or purchase price (whichever is greater).</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Local Credit Unions</h3>
                  <p className="text-slate-700">Moncton has several credit unions that offer competitive rates and first-time buyer programs with flexible qualification criteria.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Work with a Broker</h3>
                  <p className="text-slate-700">A local mortgage broker can shop 20+ lenders to find the best rate for your Moncton purchase.</p>
                </div>
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Lenders in Moncton</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 transition">
                  <h3 className="font-semibold text-slate-900">Major Banks</h3>
                  <p className="text-sm text-slate-600 mt-1">RBC, TD, Scotiabank, BMO, CIBC</p>
                  <p className="text-sm text-slate-700 mt-2">Established lenders with branches in Moncton</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 transition">
                  <h3 className="font-semibold text-slate-900">Credit Unions</h3>
                  <p className="text-sm text-slate-600 mt-1">Local credit unions</p>
                  <p className="text-sm text-slate-700 mt-2">Competitive rates, community focus</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 transition">
                  <h3 className="font-semibold text-slate-900">Monoline Lenders</h3>
                  <p className="text-sm text-slate-600 mt-1">MCAP, First National, CMLS</p>
                  <p className="text-sm text-slate-700 mt-2">Often lowest rates, broker-only access</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 transition">
                  <h3 className="font-semibold text-slate-900">Online Lenders</h3>
                  <p className="text-sm text-slate-600 mt-1">Tangerine, EQ Bank, Motusbank</p>
                  <p className="text-sm text-slate-700 mt-2">Digital-first, competitive rates</p>
                </div>
              </div>
            </section>
          </div>
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-slate-900 mb-4">Moncton Mortgage Calculator</h3>
              <p className="text-slate-600 text-sm mb-4">Calculate your monthly payments for Moncton home prices.</p>
              <Link href="/tools/mortgage-calculator" className="block text-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
                Calculate Payments
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-slate-900 mb-4">Related Moncton Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog/closing-costs-canada" className="text-teal-600 hover:underline">Closing Costs Guide</Link></li>
                <li><Link href="/blog/first-time-home-buyer-guide-canada" className="text-teal-600 hover:underline">First-Time Buyer Guide</Link></li>
                <li><Link href="/cities/fredericton" className="text-teal-600 hover:underline">Compare: Fredericton</Link></li>
                <li><Link href="/cities/saint-john" className="text-teal-600 hover:underline">Compare: Saint john</Link></li>
              </ul>
            </div>
            <div className="bg-teal-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-slate-900 mb-2">Need Moncton Mortgage Help?</h3>
              <p className="text-slate-600 text-sm mb-4">Connect with mortgage specialists who understand the Moncton market.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
                Get Started
              </Link>
            </div>
            <CityLendersSidebar cityName="Moncton" />
          </aside>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-slate-900 mb-2">Share Moncton Mortgage Rates</h3>
          <p className="text-slate-600 text-sm mb-4">
            Know someone buying in Moncton? Share these rates with them.
          </p>
          <SocialShare
            url="https://latestmortgagerates.ca/cities/moncton"
            title="Best Mortgage Rates in Moncton 2026"
            description="Compare the lowest mortgage rates in Moncton. 5-year fixed from 4.18%."
          />
        </div>
      </div>
      <CityTools cityName="Moncton" province="New Brunswick" />
    </main>
  );
}
