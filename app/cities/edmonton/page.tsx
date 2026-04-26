import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";
import CityLendersSidebar from "../../components/CityLendersSidebar";

export const dynamic = "force-static";

// Edmonton-specific FAQs
const edmontonFaqs = [
  {
    question: "What are current mortgage rates in Edmonton?",
    answer: "Current Edmonton mortgage rates are competitive with 5-year fixed rates starting from 4.19% and 5-year variable rates from 3.85%. Edmonton offers excellent value with average home prices around $390,000 - one of Canada's most affordable major cities.",
  },
  {
    question: "Does Edmonton have land transfer tax?",
    answer: "No! Like all of Alberta, Edmonton has NO land transfer tax. You only pay a small property registration fee of approximately $300-500. This saves buyers thousands compared to Ontario or BC. It's one of Edmonton's biggest advantages.",
  },
  {
    question: "Is Edmonton affordable for first-time buyers?",
    answer: "Yes! Edmonton is extremely affordable with average home prices around $390K - you can buy a detached home for what a Toronto condo costs. No land transfer tax and reasonable property taxes make it ideal for first-time buyers.",
  },
  {
    question: "How is Edmonton's job market?",
    answer: "Edmonton has diversified beyond oil with strong healthcare, education, government, and tech sectors. The University of Alberta and major hospitals are significant employers. While energy drives Alberta, Edmonton's economy is more stable than Calgary's.",
  },
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Edmonton 2025 | Alberta's Affordable Capital",
  description: "Find the lowest mortgage rates in Edmonton for 2025. No land transfer tax! Average home price $390K. Compare rates from Alberta lenders. 5-year fixed from 4.19%.",
  keywords: "Edmonton mortgage rates, Alberta mortgage rates, Edmonton mortgage broker, best rates Edmonton, Edmonton home buyer, no land transfer tax Alberta",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/edmonton",
  },
  openGraph: {
    title: "Best Mortgage Rates Edmonton 2025 | No Land Transfer Tax!",
    description: "Edmonton mortgage rates - no land transfer tax! Average $390K - most affordable major city. 5-year fixed from 4.19%.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/edmonton",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates Edmonton 2025",
    description: "Edmonton mortgage rates - no LTT, $390K average homes! 5-year fixed from 4.19%.",
  },
};

export default function EdmontonPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* LocalBusiness Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Edmonton",
            description: "Best mortgage rates in Edmonton, Alberta",
            areaServed: {
              "@type": "City",
              name: "Edmonton",
              containedIn: "Alberta",
            },
            url: "https://latestmortgagerates.ca/cities/edmonton",
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
            mainEntity: edmontonFaqs.map((faq) => ({
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
              <li className="text-gray-900 font-medium">Edmonton</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>No Land Transfer Tax + Lowest Prices!</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Edmonton 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Alberta's capital: no land transfer tax and Canada's most affordable major city. Find the lowest rates.</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Edmonton Mortgage Rates</h2>
              
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
                  <strong>Edmonton Advantage:</strong> Average home price $390K, no land transfer tax, 
                  affordable property taxes. You can buy a detached home here for the price of a Toronto condo.
                </p>
              </div>
            </section>

            {/* First-time Buyer Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Buyer Advantage</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Alberta: No Land Transfer Tax</h3>
                  <p className="text-gray-700">Unlike Ontario and BC, Alberta has no land transfer tax. 
                  You save $5,000-$15,000+ in closing costs. Only a small registration fee (~$300-500) applies.</p>
                </div>                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">First Home Savings Account (FHSA)</h3>
                  <p className="text-gray-700">Save up to $40,000 tax-free for your first home. Contributions are tax-deductible, 
                  and withdrawals for home purchase are tax-free.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Home Buyers' Plan (HBP)</h3>
                  <p className="text-gray-700">Withdraw up to $35,000 from your RRSP ($70K for couples) for your down payment.</p>
                </div>
              </div>
            </section>

            {/* Edmonton Market Factors */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Edmonton Market Factors</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Most Affordable Major City</h3>
                  <p className="text-gray-700">Average home price ~$390K. Detached homes under $500K are common. First-time buyers can afford detached homes.</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Diversified Economy</h3>
                  <p className="text-gray-700">Healthcare, education, government, and tech sectors provide stability beyond oil and gas.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">World-Class Infrastructure</h3>
                  <p className="text-gray-700">Anthony Henday Drive ring road, LRT expansion, and excellent healthcare facilities.</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900">River Valley Parks</h3>
                  <p className="text-gray-700">North America's largest urban park system - 22x the size of New York's Central Park.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Why Edmonton?</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">NO land transfer tax</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Most affordable major city</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Detached homes under $500K</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Low property taxes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Diversified economy</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/calgary" className="text-blue-600 hover:underline">Calgary Rates</Link></li>
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/vancouver" className="text-blue-600 hover:underline">Vancouver Rates</Link></li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Compare Edmonton Rates</h3>
              <p className="text-gray-600 text-sm mb-4">See rates from Edmonton mortgage brokers.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                View Rates
              </Link>
            </div>
          <CityLendersSidebar cityName="Edmonton" />
          </aside>
        </div>

        {/* Social Sharing Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-2">Share Edmonton Mortgage Rates</h3>
          <p className="text-gray-600 text-sm mb-4">
            Know someone buying in Edmonton? Share these rates!
          </p>
          <SocialShare 
            url="https://latestmortgagerates.ca/cities/edmonton"
            title="Best Mortgage Rates in Edmonton 2025"
            description="No land transfer tax + Canada's most affordable major city! Compare the lowest mortgage rates. Average home $390K."
          />
        </div>
      </div>
    </main>
  );
}
