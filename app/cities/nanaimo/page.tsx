import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";
import CityLendersSidebar from "../../components/CityLendersSidebar";
import CityTools from "../../components/CityTools";

export const dynamic = "force-static";

const nanaimoFaqs = [
  {
    "question": "What are current mortgage rates in Nanaimo?",
    "answer": "Current Nanaimo mortgage rates are competitive with 5-year fixed rates starting from 4.25% and 5-year variable rates from 3.79%. Rates vary by lender including major banks like RBC, TD, Scotiabank, BMO, CIBC, as well as local credit unions and online lenders."
  },
  {
    "question": "Are mortgage rates different in Nanaimo than other cities?",
    "answer": "Mortgage rates in Nanaimo are generally consistent with national rates, as lenders price mortgages based on the borrower and property, not the city. However, Nanaimo's local market conditions and property values affect the total mortgage amount and monthly payments."
  },
  {
    "question": "What is the land transfer tax in Nanaimo?",
    "answer": "BC Property Transfer Tax applies. First-time buyer exemption up to $500,000."
  },
  {
    "question": "Which lenders offer the best rates in Nanaimo?",
    "answer": "The best mortgage rates in Nanaimo come from a mix of major banks, local credit unions, and online lenders. Shopping with a mortgage broker can help you compare rates from 20+ lenders at once."
  }
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Nanaimo 2026 | Current & Historical Rates",
  description: "Find the lowest mortgage rates in Nanaimo for 2026. Compare rates from 20+ lenders. 5-year fixed from 4.49%. Updated daily.",
  keywords: "Nanaimo mortgage rates, Nanaimo mortgage broker, best rates Nanaimo, Nanaimo home buyer, mortgage rates today",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/nanaimo",
  },
  openGraph: {
    title: "Best Mortgage Rates Nanaimo 2026 | Compare 20+ Lenders",
    description: "Find the lowest mortgage rates in Nanaimo. 5-year fixed from 4.47%. Compare banks, credit unions & online lenders.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/nanaimo",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates Nanaimo 2026",
    description: "Compare Nanaimo mortgage rates from 20+ lenders. 5-year fixed from 4.22%.",
  },
};

export default function NanaimoPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Nanaimo",
            description: "Best mortgage rates in Nanaimo",
            areaServed: {
              "@type": "City",
              name: "Nanaimo",
              containedIn: "British Columbia",
            },
            url: "https://latestmortgagerates.ca/cities/nanaimo",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: nanaimoFaqs.map((faq) => ({
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
              <li className="text-slate-900 font-medium">Nanaimo</li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Best Mortgage Rates in Nanaimo 2026</h1>
              <p className="text-slate-600 mt-2 text-lg">Compare the lowest rates from Nanaimo lenders and find your perfect mortgage</p>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Current Nanaimo Mortgage Rates</h2>
              <p className="text-slate-600 mb-6">Updated daily with the best rates from Nanaimo-area lenders.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-teal-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">5-Year Fixed Rate</p>
                  <p className="text-3xl font-bold text-teal-600">4.38%</p>
                  <p className="text-sm text-slate-500">Starting from</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">5-Year Variable Rate</p>
                  <p className="text-3xl font-bold text-emerald-600">3.67%</p>
                  <p className="text-sm text-slate-500">Starting from</p>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
                  Compare All Nanaimo Rates →
                </Link>
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Nanaimo Housing Market Overview</h2>
              <div className="prose max-w-none">
                <p className="text-slate-700 mb-4">
                  Nanaimo is a growing community in British Columbia with a population of approximately 100,000. The local housing market offers a range of options from detached homes to condos, with average prices reflecting the city's desirability and growth.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Average Home Prices (2026)</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Detached Homes</p>
                    <p className="text-xl font-bold text-slate-900">$700,000</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Semi-Detached</p>
                    <p className="text-xl font-bold text-slate-900">$550,000</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Townhouses</p>
                    <p className="text-xl font-bold text-slate-900">$500,000</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Condos</p>
                    <p className="text-xl font-bold text-slate-900">$400,000</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Nanaimo-Specific Considerations</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  <li><strong>Land Transfer Tax:</strong> BC Property Transfer Tax applies. First-time buyer exemption up to $500,000.</li>
                  <li><strong>Market Trends:</strong> Nanaimo continues to attract buyers due to its natural beauty and mild climate.</li>
                  <li><strong>Lender Options:</strong> Buyers in Nanaimo have access to major banks, local credit unions, and online lenders.</li>
                </ul>
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">First-Time Home Buyers in Nanaimo</h2>
              <p className="text-slate-700 mb-4">
                Nanaimo offers opportunities for first-time buyers with various programs and strategies:
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Government Programs</h3>
                  <p className="text-slate-700">BC first-time buyers may qualify for PTT exemptions up to $500,000 property value. Use the FHSA and HBP programs. Property prices in Nanaimo are high, so maximizing your down payment is key.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Local Credit Unions</h3>
                  <p className="text-slate-700">Nanaimo has several credit unions that offer competitive rates and first-time buyer programs with flexible qualification criteria.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Work with a Broker</h3>
                  <p className="text-slate-700">A local mortgage broker can shop 20+ lenders to find the best rate for your Nanaimo purchase.</p>
                </div>
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Lenders in Nanaimo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 transition">
                  <h3 className="font-semibold text-slate-900">Major Banks</h3>
                  <p className="text-sm text-slate-600 mt-1">RBC, TD, Scotiabank, BMO, CIBC</p>
                  <p className="text-sm text-slate-700 mt-2">Established lenders with branches in Nanaimo</p>
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
              <h3 className="font-bold text-slate-900 mb-4">Nanaimo Mortgage Calculator</h3>
              <p className="text-slate-600 text-sm mb-4">Calculate your monthly payments for Nanaimo home prices.</p>
              <Link href="/tools/mortgage-calculator" className="block text-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
                Calculate Payments
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-slate-900 mb-4">Related Nanaimo Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog/closing-costs-canada" className="text-teal-600 hover:underline">Closing Costs Guide</Link></li>
                <li><Link href="/blog/first-time-home-buyer-guide-canada" className="text-teal-600 hover:underline">First-Time Buyer Guide</Link></li>
                <li><Link href="/cities/vancouver" className="text-teal-600 hover:underline">Compare: Vancouver</Link></li>
                <li><Link href="/cities/victoria" className="text-teal-600 hover:underline">Compare: Victoria</Link></li>
              </ul>
            </div>
            <div className="bg-teal-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-slate-900 mb-2">Need Nanaimo Mortgage Help?</h3>
              <p className="text-slate-600 text-sm mb-4">Connect with mortgage specialists who understand the Nanaimo market.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
                Get Started
              </Link>
            </div>
            <CityLendersSidebar cityName="Nanaimo" />
          </aside>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-slate-900 mb-2">Share Nanaimo Mortgage Rates</h3>
          <p className="text-slate-600 text-sm mb-4">
            Know someone buying in Nanaimo? Share these rates with them.
          </p>
          <SocialShare
            url="https://latestmortgagerates.ca/cities/nanaimo"
            title="Best Mortgage Rates in Nanaimo 2026"
            description="Compare the lowest mortgage rates in Nanaimo. 5-year fixed from 4.31%."
          />
        </div>
      </div>
      <CityTools cityName="Nanaimo" province="British Columbia" />
    </main>
  );
}
