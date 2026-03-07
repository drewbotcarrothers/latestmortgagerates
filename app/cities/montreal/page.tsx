import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";

export const dynamic = "force-static";

// Montreal-specific FAQs
const montrealFaqs = [
  {
    question: "What are current mortgage rates in Montreal?",
    answer: "Current Montreal mortgage rates are competitive with 5-year fixed rates starting from 4.19% and 5-year variable rates from 3.85%. Montreal offers some of the most affordable housing in major Canadian cities, with average home prices around $540,000.",
  },
  {
    question: "How does Quebec's mortgage system differ from other provinces?",
    answer: "In Quebec, mortgages are called 'hypothèques' and require notary involvement for closings. The process is similar but French language rights apply. Some lenders (especially credit unions) operate only in Quebec. Welcome tax (taxe de bienvenue) applies at municipal level.",
  },
  {
    question: "Is Montreal affordable for first-time buyers?",
    answer: "Yes! Montreal is one of Canada's most affordable major cities. Average home prices ($540K) are half of Toronto ($1.2M). Strong tenant protections make it attractive for landlords too. The Quebec Home Buyers' Plan (RAP) offers additional benefits.",
  },
  {
    question: "Which lenders offer the best rates in Montreal?",
    answer: "Montreal has excellent rate options from major banks (TD, RBC, BMO, CIBC, Scotiabank), Quebec credit unions (Desjardins, Caisse populaire), online lenders, and mortgage brokers who shop the entire Quebec market.",
  },
];

export const metadata: Metadata = {
  title: "Best Mortgage Rates Montreal 2025 | Quebec's Most Affordable City",
  description: "Find the lowest mortgage rates in Montreal for 2025. Compare rates from Quebec lenders. Average home price $540K - half of Toronto! 5-year fixed from 4.19%.",
  keywords: "Montreal mortgage rates, Quebec mortgage rates, Montreal mortgage broker, best rates Montreal, Montreal home buyer, hypotheque Montreal, Quebec home buyers plan",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/montreal",
  },
  openGraph: {
    title: "Best Mortgage Rates Montreal 2025 | Quebec's Most Affordable City",
    description: "Montreal mortgage rates. Compare Quebec lenders. Affordable housing - half of Toronto's prices! 5-year fixed from 4.19%.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/montreal",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates Montreal 2025",
    description: "Montreal mortgage rates - affordable housing! 5-year fixed from 4.19%.",
  },
};

export default function MontrealPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* LocalBusiness Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Montreal",
            description: "Best mortgage rates in Montreal, Quebec",
            areaServed: {
              "@type": "City",
              name: "Montreal",
              containedIn: "Quebec",
            },
            url: "https://latestmortgagerates.ca/cities/montreal",
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
            mainEntity: montrealFaqs.map((faq) => ({
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
              <li className="text-gray-900 font-medium">Montreal</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span>Most Affordable Major City!</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Montreal 2025</h1>
              <p className="text-gray-600 mt-2 text-lg">Half the price of Toronto but all the culture. Find the lowest mortgage rates in Quebec's largest city.</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Montreal Mortgage Rates</h2>
              
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
                  <strong>Quebec Market Insight:</strong> Montreal offers some of Canada's best value, 
                  with home prices approximately 50% lower than Toronto and 75% lower than Vancouver.
                </p>
              </div>
            </section>

            {/* First-time Buyer Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Buyer Programs in Quebec</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Quebec Home Buyers' Plan (RAP)</h3>
                  <p className="text-gray-700">
                    The Québec RAP provides refundable tax credits for first-time buyers. 
                    Combined with the federal FHSA and HBP programs, Quebec offers generous incentives.
                  </p>
                </div>                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Welcome Tax (Taxe de Bienvenue)</h3>
                  <p className="text-gray-700">
                    Municipal welcome tax applies to property transfers in Quebec. 
                    Montreal offers some exemptions for first-time buyers under certain conditions.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Strong Tenant Protections</h3>
                  <p className="text-gray-700">
                    Quebec has some of North America's strongest tenant protections, 
                    making rental properties attractive investments for landlords.
                  </p>
                </div>
              </div>
            </section>

            {/* Montreal Market Factors */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Montreal Market Factors</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Affordable Housing</h3>
                  <p className="text-gray-700">Average home price ~$540K vs $1.2M in Toronto and $2M in Vancouver.</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Growing Tech Hub</h3>
                  <p className="text-gray-700">Montreal is becoming Canada's AI capital with major tech companies establishing presence.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Unique Culture</h3>
                  <p className="text-gray-700">Distinct francophone culture attracts international buyers and keeps locals rooted.</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Excellent Public Transit</h3>
                  <p className="text-gray-700">The Metro system makes car-free living possible, reducing overall housing costs.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Why Montreal?</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Most affordable major city</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Half of Toronto's prices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Strong first-time buyer programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Excellent transit system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Vibrant tech sector</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
                <li><Link href="/cities/vancouver" className="text-blue-600 hover:underline">Vancouver Rates</Link></li>
                <li><Link href="/cities/calgary" className="text-blue-600 hover:underline">Calgary Rates</Link></li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Compare Montreal Rates</h3>
              <p className="text-gray-600 text-sm mb-4">See rates from Quebec credit unions, banks, and online lenders.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                View Rates
              </Link>
            </div>
          </aside>
        </div>

        {/* Social Sharing Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-2">Share Montreal Mortgage Rates</h3>
          <p className="text-gray-600 text-sm mb-4">
            Know someone buying in Montreal? Share these affordable rates!
          </p>
          <SocialShare 
            url="https://latestmortgagerates.ca/cities/montreal"
            title="Best Mortgage Rates in Montreal 2025"
            description="Montreal mortgage rates - half the price of Toronto! Compare the lowest rates from Quebec lenders. 5-year fixed from 4.19%."
          />
        </div>
      </div>
    </main>
  );
}
