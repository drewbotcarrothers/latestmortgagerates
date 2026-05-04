import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";
import CityLendersSidebar from "../../components/CityLendersSidebar";
import CityTools from "../../components/CityTools";

export const dynamic = "force-static";

const waterlooFaqs = [
  {
    "question": "What are current mortgage rates in Waterloo?",
    "answer": "Current Waterloo mortgage rates are competitive with 5-year fixed rates starting from 4.46% and 5-year variable rates from 3.98%. Rates vary by lender including major banks like RBC, TD, Scotiabank, BMO, CIBC, as well as local credit unions and online lenders."
  },
  {
    "question": "Are mortgage rates different in Waterloo than other cities?",
    "answer": "Mortgage rates in Waterloo are generally consistent with national rates, as lenders price mortgages based on the borrower and property, not the city. However, Waterloo's local market conditions and property values affect the total mortgage amount and monthly payments."
  },
  {
    "question": "What is the land transfer tax in Waterloo?",
    "answer": "Ontario provincial LTT only. First-time buyer rebate up to $4,000."
  },
  {
    "question": "Which lenders offer the best rates in Waterloo?",
    "answer": "The best mortgage rates in Waterloo come from a mix of major banks, local credit unions, and online lenders. Shopping with a mortgage broker can help you compare rates from 20+ lenders at once."
  }
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Waterloo 2026 | Current & Historical Rates",
  description: "Find the lowest mortgage rates in Waterloo for 2026. Compare rates from 20+ lenders. 5-year fixed from 4.16%. Updated daily.",
  keywords: "Waterloo mortgage rates, Waterloo mortgage broker, best rates Waterloo, Waterloo home buyer, mortgage rates today",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/waterloo",
  },
  openGraph: {
    title: "Best Mortgage Rates Waterloo 2026 | Compare 20+ Lenders",
    description: "Find the lowest mortgage rates in Waterloo. 5-year fixed from 4.39%. Compare banks, credit unions & online lenders.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/waterloo",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates Waterloo 2026",
    description: "Compare Waterloo mortgage rates from 20+ lenders. 5-year fixed from 4.08%.",
  },
};

export default function WaterlooPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Waterloo",
            description: "Best mortgage rates in Waterloo",
            areaServed: {
              "@type": "City",
              name: "Waterloo",
              containedIn: "Ontario",
            },
            url: "https://latestmortgagerates.ca/cities/waterloo",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: waterlooFaqs.map((faq) => ({
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
              <li className="text-slate-900 font-medium">Waterloo</li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Best Mortgage Rates in Waterloo 2026</h1>
              <p className="text-slate-600 mt-2 text-lg">Compare the lowest rates from Waterloo lenders and find your perfect mortgage</p>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Current Waterloo Mortgage Rates</h2>
              <p className="text-slate-600 mb-6">Updated daily with the best rates from Waterloo-area lenders.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-teal-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">5-Year Fixed Rate</p>
                  <p className="text-3xl font-bold text-teal-600">4.24%</p>
                  <p className="text-sm text-slate-500">Starting from</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">5-Year Variable Rate</p>
                  <p className="text-3xl font-bold text-emerald-600">3.71%</p>
                  <p className="text-sm text-slate-500">Starting from</p>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
                  Compare All Waterloo Rates →
                </Link>
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Waterloo Housing Market Overview</h2>
              <div className="prose max-w-none">
                <p className="text-slate-700 mb-4">
                  Waterloo is a growing community in Ontario with a population of approximately 120,000. The local housing market offers a range of options from detached homes to condos, with average prices reflecting the city's desirability and growth.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Average Home Prices (2026)</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Detached Homes</p>
                    <p className="text-xl font-bold text-slate-900">$850,000</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Semi-Detached</p>
                    <p className="text-xl font-bold text-slate-900">$650,000</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Townhouses</p>
                    <p className="text-xl font-bold text-slate-900">$550,000</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Condos</p>
                    <p className="text-xl font-bold text-slate-900">$450,000</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Waterloo-Specific Considerations</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  <li><strong>Land Transfer Tax:</strong> Ontario provincial LTT only. First-time buyer rebate up to $4,000.</li>
                  <li><strong>Market Trends:</strong> Waterloo continues to attract buyers due to its proximity to major employment centers.</li>
                  <li><strong>Lender Options:</strong> Buyers in Waterloo have access to major banks, local credit unions, and online lenders.</li>
                </ul>
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">First-Time Home Buyers in Waterloo</h2>
              <p className="text-slate-700 mb-4">
                Waterloo offers opportunities for first-time buyers with various programs and strategies:
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Government Programs</h3>
                  <p className="text-slate-700">Maximize your first-time buyer rebates. Waterloo buyers qualify for up to $4,000 in Ontario LTT rebates. Use the FHSA ($40,000 tax-free) and HBP ($60,000 from RRSP) to boost your down payment.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Local Credit Unions</h3>
                  <p className="text-slate-700">Waterloo has several credit unions that offer competitive rates and first-time buyer programs with flexible qualification criteria.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Work with a Broker</h3>
                  <p className="text-slate-700">A local mortgage broker can shop 20+ lenders to find the best rate for your Waterloo purchase.</p>
                </div>
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Lenders in Waterloo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 transition">
                  <h3 className="font-semibold text-slate-900">Major Banks</h3>
                  <p className="text-sm text-slate-600 mt-1">RBC, TD, Scotiabank, BMO, CIBC</p>
                  <p className="text-sm text-slate-700 mt-2">Established lenders with branches in Waterloo</p>
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
              <h3 className="font-bold text-slate-900 mb-4">Waterloo Mortgage Calculator</h3>
              <p className="text-slate-600 text-sm mb-4">Calculate your monthly payments for Waterloo home prices.</p>
              <Link href="/tools/mortgage-calculator" className="block text-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
                Calculate Payments
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-slate-900 mb-4">Related Waterloo Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog/closing-costs-canada" className="text-teal-600 hover:underline">Closing Costs Guide</Link></li>
                <li><Link href="/blog/first-time-home-buyer-guide-canada" className="text-teal-600 hover:underline">First-Time Buyer Guide</Link></li>
                <li><Link href="/cities/kitchener" className="text-teal-600 hover:underline">Compare: Kitchener</Link></li>
                <li><Link href="/cities/guelph" className="text-teal-600 hover:underline">Compare: Guelph</Link></li>
              </ul>
            </div>
            <div className="bg-teal-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-slate-900 mb-2">Need Waterloo Mortgage Help?</h3>
              <p className="text-slate-600 text-sm mb-4">Connect with mortgage specialists who understand the Waterloo market.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
                Get Started
              </Link>
            </div>
            <CityLendersSidebar cityName="Waterloo" />
          </aside>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-slate-900 mb-2">Share Waterloo Mortgage Rates</h3>
          <p className="text-slate-600 text-sm mb-4">
            Know someone buying in Waterloo? Share these rates with them.
          </p>
          <SocialShare
            url="https://latestmortgagerates.ca/cities/waterloo"
            title="Best Mortgage Rates in Waterloo 2026"
            description="Compare the lowest mortgage rates in Waterloo. 5-year fixed from 4.39%."
          />
        </div>
      </div>
      <CityTools cityName="Waterloo" province="Ontario" />
    </main>
  );
}
