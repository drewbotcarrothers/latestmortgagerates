import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";
import CityLendersSidebar from "../../components/CityLendersSidebar";

export const dynamic = "force-static";

// Winnipeg-specific FAQs
const winnipegFaqs = [
  {
    question: "What are current mortgage rates in Winnipeg?",
    answer: "Current Winnipeg mortgage rates are competitive with 5-year fixed rates starting from 4.19% and 5-year variable rates from 3.85%. Winnipeg offers incredible value with average home prices around $360,000 - one of Canada's most affordable cities.",
  },
  {
    question: "Does Winnipeg have land transfer tax?",
    answer: "No land transfer tax in Manitoba! However, there is a Land Titles registration fee of approximately $350-600 depending on property value. This is significantly lower than Ontario's land transfer tax, saving buyers thousands.",
  },
  {
    question: "Is Winnipeg a good place to buy a home?",
    answer: "Winnipeg is excellent for first-time buyers with average home prices around $360K. You get way more house for your money compared to Toronto or Vancouver. Strong rental market, affordable property taxes, and solid infrastructure make it attractive.",
  },
  {
    question: "How is Winnipeg's economy and job market?",
    answer: "Winnipeg has a stable, diversified economy with major employers in agriculture, manufacturing, transportation (CentrePort), healthcare, and government. Less volatile than resource-dependent cities. Growing tech sector with several incubators.",
  },
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Winnipeg 2025 | Manitoba's Affordable City",
  description: "Find the lowest mortgage rates in Winnipeg for 2025. No land transfer tax! Average home price $360K. Compare rates from Manitoba lenders. 5-year fixed from 4.19%.",
  keywords: "Winnipeg mortgage rates, Manitoba mortgage rates, Winnipeg mortgage broker, best rates Winnipeg, Winnipeg home buyer, affordable housing Winnipeg",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/winnipeg",
  },
  openGraph: {
    title: "Best Mortgage Rates Winnipeg 2025 | Canada's Most Affordable!",
    description: "Winnipeg mortgage rates - average $360K! Compare Manitoba lenders. 5-year fixed from 4.19%.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/winnipeg",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates Winnipeg 2025",
    description: "Winnipeg mortgage rates - $360K average homes! 5-year fixed from 4.19%.",
  },
};

export default function WinnipegPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* LocalBusiness Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Winnipeg",
            description: "Best mortgage rates in Winnipeg, Manitoba",
            areaServed: {
              "@type": "City",
              name: "Winnipeg",
              containedIn: "Manitoba",
            },
            url: "https://latestmortgagerates.ca/cities/winnipeg",
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
            mainEntity: winnipegFaqs.map((faq) => ({
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
              <li className="text-gray-900 font-medium">Winnipeg</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>Canada's Most Affordable City!</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Winnipeg 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Get incredible value in Manitoba's capital. Average home price just $360K! Find the lowest rates.</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Winnipeg Mortgage Rates</h2>
              
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
                  <strong>Winnipeg Value Proposition:</strong> Average home price ~$360K - you can buy 
                  a beautiful home here for 1/3 the price of Toronto. Great for first-time buyers!
                </p>
              </div>
            </section>

            {/* First-time Buyer Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Buyer Advantage</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Incredible Affordability</h3>
                  <p className="text-gray-700">$360K average means detached homes under $400K. 
                  You can own a house with significantly lower income than required in Toronto or Vancouver.</p>
                </div>                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Manitoba First-Time Home Buyers' Tax Credit</h3>
                  <p className="text-gray-700">$10,000 provincial tax credit for qualifying first-time buyers. 
                  Combined with federal programs, first-time buyers get significant support.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">First Home Savings Account (FHSA)</h3>
                  <p className="text-gray-700">Save up to $40,000 tax-free. In Winnipeg, that could be your entire down payment!</p>
                </div>
              </div>
            </section>

            {/* Winnipeg Market Factors */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Winnipeg Market Factors</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">CentrePort Canada</h3>
                  <p className="text-gray-700">North America's largest trimodal inland port (air, rail, truck) 
                  driving logistics and trade jobs.</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Affordable Property Taxes</h3>
                  <p className="text-gray-700">Winnipeg has reasonable property taxes compared to other Canadian cities. Lower carrying costs.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Cultural Scene</h3>
                  <p className="text-gray-700">The Exchange District, Folklorama, and thriving arts scene make Winnipeg culturally rich despite its size.</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Four Seasons Living</h3>
                  <p className="text-gray-700">Experience true seasons. Winter activities (Festival du Voyageur) and beautiful summers by the lakes.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Why Winnipeg?</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Most affordable in Canada</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Detached homes from $300K</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">$10K first-time buyer credit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Diversified economy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">No land transfer tax</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/edmonton" className="text-blue-600 hover:underline">Edmonton Rates</Link></li>
                <li><Link href="/cities/calgary" className="text-blue-600 hover:underline">Calgary Rates</Link></li>
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Compare Winnipeg Rates</h3>
              <p className="text-gray-600 text-sm mb-4">See rates from Manitoba mortgage brokers.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                View Rates
              </Link>
            </div>
          <CityLendersSidebar cityName="Winnipeg" />
          </aside>
        </div>

        {/* Social Sharing Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-2">Share Winnipeg Mortgage Rates</h3>
          <p className="text-gray-600 text-sm mb-4">
            Know someone buying in Winnipeg? Share Canada's most affordable rates!
          </p>
          <SocialShare 
            url="https://latestmortgagerates.ca/cities/winnipeg"
            title="Best Mortgage Rates in Winnipeg 2025"
            description="Canada's most affordable city! Average home $360K. Compare the lowest mortgage rates in Manitoba."
          />
        </div>
      </div>
    </main>
  );
}
