import SocialShare from "@/components/SocialShare";
import CityLendersSidebar from "@/components/CityLendersSidebar";
import CityTools from "@/components/CityTools";


// Toronto-specific FAQs for Schema markup
const torontoFaqs = [
  {
    question: "What are current mortgage rates in Toronto?",
    answer: "Current Toronto mortgage rates are competitive with 5-year fixed rates starting from 4.19% and 5-year variable rates from 3.85%. Rates vary by lender including major banks like RBC, TD, Scotiabank, BMO, CIBC, as well as monoline lenders and credit unions.",
  },
  {
    question: "Are mortgage rates higher in Toronto than other cities?",
    answer: "No, Toronto's mortgage rates are consistent with national rates. The difference is that Toronto's high home prices ($1.2M+ average) require larger mortgages, making even small rate differences more impactful on monthly payments.",
  },
  {
    question: "What is the Toronto land transfer tax?",
    answer: "Toronto homebuyers pay both Ontario provincial land transfer tax and Toronto municipal LTT. First-time buyers get rebates up to $4,000 provincial and $4,475 municipal (total $8,475). On a $700,000 home, expect to pay approximately $20,000-$23,000 in land transfer taxes before rebates.",
  },
  {
    question: "Which lenders offer the best rates in Toronto?",
    answer: "The best mortgage rates in Toronto often come from monoline lenders like MCAP, First National, and CMLS, as well as online lenders like Tangerine and EQ Bank. Big 5 banks (RBC, TD, Scotiabank, BMO, CIBC) may match competitive rates for existing customers.",
  },
];


export default function TorontoPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* LocalBusiness Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - Toronto",
            description: "Best mortgage rates in Toronto and GTA",
            areaServed: {
              "@type": "City",
              name: "Toronto",
              containedIn: "Ontario",
            },
            url: "https://latestmortgagerates.ca/cities/toronto",
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
            mainEntity: torontoFaqs.map((faq) => ({
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
              <li><a href="/" className="hover:text-teal-600">Home</a></li>
              <li><span className="text-slate-400">/</span></li>
              <li className="text-slate-900 font-medium">Toronto</li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Best Mortgage Rates in Toronto 2025</h1>
              <p className="text-slate-600 mt-2 text-lg">Compare the lowest rates from GTA lenders and find your perfect mortgage</p>
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Current Toronto Mortgage Rates</h2>
              <p className="text-slate-600 mb-6">Updated daily with the best rates from Toronto-area lenders including major banks, credit unions, and online lenders.</p>
              
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
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-700">3-Year Fixed</span>
                  <span className="font-semibold text-slate-900">4.39%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-700">10-Year Fixed</span>
                  <span className="font-semibold text-slate-900">4.54%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-700">1-Year Fixed</span>
                  <span className="font-semibold text-slate-900">5.49%</span>
                </div>
              </div>
              
              <div className="mt-6">
                <a href="/" className="block text-center px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Compare All Toronto Rates →
                </a>
              </div>
            </section>

            {/* Toronto Market Overview */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Toronto Housing Market Overview</h2>
              
              <div className="prose max-w-none">
                <p className="text-slate-700 mb-4">
                  The Greater Toronto Area (GTA) remains Canada's largest and most expensive housing market. Average home prices in Toronto hover around $1.1-1.2 million, making mortgage rates critical to affordability.
                </p>
                
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Average Home Prices (2025)</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Detached Homes</p>
                    <p className="text-xl font-bold text-slate-900">$1,450,000</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Semi-Detached</p>
                    <p className="text-xl font-bold text-slate-900">$1,050,000</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Townhouses</p>
                    <p className="text-xl font-bold text-slate-900">$890,000</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Condos</p>
                    <p className="text-xl font-bold text-slate-900">$720,000</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Toronto-Specific Considerations</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  <li><strong>Land Transfer Tax:</strong> Toronto buyers pay both provincial and municipal LTT, effectively doubling the cost</li>
                  <li><strong>First-Time Buyer Rebates:</strong> Up to $4,000 provincial plus $4,475 municipal rebate available</li>
                  <li><strong>Condo Market:</strong> Toronto has extensive condo inventory with different lending considerations</li>
                  <li><strong>Transit Premium:</strong> Properties near subway lines often qualify for better rates</li>
                  <li><strong>Foreign Buyer Ban:</strong> Non-residents cannot purchase residential property</li>
                </ul>
              </div>
            </section>

            {/* First-Time Buyers Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">First-Time Home Buyers in Toronto</h2>
              
              <p className="text-slate-700 mb-4">
                Toronto presents unique challenges for first-time buyers due to high prices. Here are specific strategies for Toronto buyers:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Maximize Rebates</h3>
                  <p className="text-slate-700">Apply for both provincial ($4,000) and Toronto municipal ($4,475) land transfer tax rebates.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Consider the FHSA</h3>
                  <p className="text-slate-700">Use the First Home Savings Account for tax-free savings up to $40,000.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Explore Co-Ownership</h3>
                  <p className="text-slate-700">Many Toronto buyers purchase with family members or friends to enter the market.</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Look Beyond Downtown</h3>
                  <p className="text-slate-700">Suburban areas like Scarborough, Etobicoke, and North York offer better value.</p>
                </div>
              </div>
            </section>

            {/* Lenders Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Top Toronto Mortgage Lenders</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 transition">
                  <h3 className="font-semibold text-slate-900">Major Banks</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    <a href="/lenders/rbc/" className="text-teal-600 hover:underline">RBC</a>,{" "}
                    <a href="/lenders/td/" className="text-teal-600 hover:underline">TD</a>, Scotiabank, BMO, CIBC
                  </p>
                  <p className="text-sm text-slate-700 mt-2">Widely available, relationship pricing, branch access</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 transition">
                  <h3 className="font-semibold text-slate-900">Credit Unions</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    <a href="/lenders/meridian/" className="text-teal-600 hover:underline">Meridian Credit Union</a>
                  </p>
                  <p className="text-sm text-slate-700 mt-2">Competitive Ontario rates, local focus, flexible terms</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 transition">
                  <h3 className="font-semibold text-slate-900">Monoline Lenders</h3>
                  <p className="text-sm text-slate-600 mt-1">MCAP, First National, CMLS</p>
                  <p className="text-sm text-slate-700 mt-2">Often lowest rates, broker-only access</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 transition">
                  <h3 className="font-semibold text-slate-900">Online / digital</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Tangerine, EQ Bank,{" "}
                    <a href="/lenders/wealthsimple/" className="text-teal-600 hover:underline">Wealthsimple</a>
                  </p>
                  <p className="text-sm text-slate-700 mt-2">Digital-first, competitive rates, fast approval</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-slate-900 mb-4">Toronto Mortgage Calculator</h3>
              <p className="text-slate-600 text-sm mb-4">Calculate your monthly payments for Toronto home prices.</p>
              <a href="/tools/mortgage-calculator/" className="block text-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                Calculate Payments
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-slate-900 mb-4">Related Toronto Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/tools/closing-costs-calculator/" className="text-teal-600 hover:underline">Toronto Closing Costs Guide</a></li>
                <li><a href="/cities/toronto/" className="text-teal-600 hover:underline">Toronto Rates Deep Dive</a></li>
                <li><a href="/blog/first-time-buyer-guide-2026/" className="text-teal-600 hover:underline">First-Time Buyer Guide</a></li>
                <li><a href="/cities/vancouver/" className="text-teal-600 hover:underline">Compare: Vancouver</a></li>
                <li><a href="/cities/calgary/" className="text-teal-600 hover:underline">Compare: Calgary</a></li>
              </ul>
            </div>

            <div className="bg-teal-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-slate-900 mb-2">Need Toronto Mortgage Help?</h3>
              <p className="text-slate-600 text-sm mb-4">Connect with Toronto mortgage specialists who understand the local market.</p>
              <a href="/" className="block text-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                Get Started
              </a>
            </div>

            <CityLendersSidebar cityName="Toronto" />
          </aside>
        </div>
      </div>

      {/* Social Sharing Section */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-slate-900 mb-2">Share Toronto Mortgage Rates</h3>
          <p className="text-slate-600 text-sm mb-4">
            Know someone buying in Toronto? Share these rates with them.
          </p>
          <SocialShare 
            url="https://latestmortgagerates.ca/cities/toronto/"
            title="Best Mortgage Rates in Toronto 2025"
            description="Compare the lowest mortgage rates in Toronto and GTA. 5-year fixed from 4.19%."
          />
        </div>
      </div>

      <CityTools cityName="Toronto" province="Ontario" />
    </main>
  );
}
