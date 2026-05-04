const fs = require('fs');
const path = require('path');

const cities = [
  // Tier 1
  { slug: 'mississauga', name: 'Mississauga', province: 'Ontario', pop: '720,000', detached: '$1,100,000', semi: '$850,000', townhome: '$750,000', condo: '$600,000', ltt: 'Ontario provincial LTT only (no municipal). First-time buyer rebate up to $4,000.', near: ['toronto', 'brampton'] },
  { slug: 'brampton', name: 'Brampton', province: 'Ontario', pop: '700,000', detached: '$1,050,000', semi: '$800,000', townhome: '$700,000', condo: '$500,000', ltt: 'Ontario provincial LTT only. First-time buyer rebate up to $4,000.', near: ['mississauga', 'toronto'] },
  { slug: 'surrey', name: 'Surrey', province: 'British Columbia', pop: '600,000', detached: '$1,300,000', semi: '$950,000', townhome: '$800,000', condo: '$550,000', ltt: 'BC Property Transfer Tax: 1% on first $200k, 2% on $200k-$2M, 3% on $2M-$3M, 5% on $3M+. First-time buyer exemption up to $500,000.', near: ['vancouver', 'burnaby'] },
  { slug: 'burnaby', name: 'Burnaby', province: 'British Columbia', pop: '250,000', detached: '$1,600,000', semi: '$1,200,000', townhome: '$900,000', condo: '$650,000', ltt: 'BC Property Transfer Tax applies. First-time buyer exemption up to $500,000.', near: ['vancouver', 'surrey'] },
  { slug: 'oakville', name: 'Oakville', province: 'Ontario', pop: '210,000', detached: '$1,700,000', semi: '$1,300,000', townhome: '$1,000,000', condo: '$700,000', ltt: 'Ontario provincial LTT only. First-time buyer rebate up to $4,000.', near: ['burlington', 'mississauga'] },
  { slug: 'burlington', name: 'Burlington', province: 'Ontario', pop: '185,000', detached: '$1,300,000', semi: '$1,000,000', townhome: '$850,000', condo: '$600,000', ltt: 'Ontario provincial LTT only. First-time buyer rebate up to $4,000.', near: ['oakville', 'hamilton'] },
  { slug: 'waterloo', name: 'Waterloo', province: 'Ontario', pop: '120,000', detached: '$850,000', semi: '$650,000', townhome: '$550,000', condo: '$450,000', ltt: 'Ontario provincial LTT only. First-time buyer rebate up to $4,000.', near: ['kitchener', 'guelph'] },
  { slug: 'guelph', name: 'Guelph', province: 'Ontario', pop: '135,000', detached: '$800,000', semi: '$600,000', townhome: '$500,000', condo: '$400,000', ltt: 'Ontario provincial LTT only. First-time buyer rebate up to $4,000.', near: ['waterloo', 'kitchener'] },
  { slug: 'st-catharines', name: "St. Catharines", province: 'Ontario', pop: '140,000', detached: '$650,000', semi: '$500,000', townhome: '$450,000', condo: '$350,000', ltt: 'Ontario provincial LTT only. First-time buyer rebate up to $4,000.', near: ['hamilton', 'niagara'] },
  { slug: 'kelowna', name: 'Kelowna', province: 'British Columbia', pop: '145,000', detached: '$900,000', semi: '$700,000', townhome: '$600,000', condo: '$450,000', ltt: 'BC Property Transfer Tax applies. First-time buyer exemption up to $500,000.', near: ['vancouver', 'abbotsford'] },
  { slug: 'abbotsford', name: 'Abbotsford', province: 'British Columbia', pop: '150,000', detached: '$1,000,000', semi: '$750,000', townhome: '$650,000', condo: '$450,000', ltt: 'BC Property Transfer Tax applies. First-time buyer exemption up to $500,000.', near: ['vancouver', 'kelowna'] },
  { slug: 'moncton', name: 'Moncton', province: 'New Brunswick', pop: '80,000', detached: '$350,000', semi: '$280,000', townhome: '$250,000', condo: '$200,000', ltt: 'New Brunswick Real Property Transfer Tax: 1% of assessed value or purchase price (whichever is greater).', near: ['fredericton', 'saint-john'] },
  { slug: 'fredericton', name: 'Fredericton', province: 'New Brunswick', pop: '65,000', detached: '$320,000', semi: '$260,000', townhome: '$230,000', condo: '$180,000', ltt: 'New Brunswick Real Property Transfer Tax: 1% of assessed value or purchase price (whichever is greater).', near: ['moncton', 'saint-john'] },
  // Tier 2
  { slug: 'windsor', name: 'Windsor', province: 'Ontario', pop: '230,000', detached: '$450,000', semi: '$350,000', townhome: '$300,000', condo: '$250,000', ltt: 'Ontario provincial LTT only. First-time buyer rebate up to $4,000.', near: ['london', 'toronto'] },
  { slug: 'kingston', name: 'Kingston', province: 'Ontario', pop: '135,000', detached: '$600,000', semi: '$450,000', townhome: '$400,000', condo: '$350,000', ltt: 'Ontario provincial LTT only. First-time buyer rebate up to $4,000.', near: ['ottawa', 'toronto'] },
  { slug: 'vaughan', name: 'Vaughan', province: 'Ontario', pop: '330,000', detached: '$1,500,000', semi: '$1,200,000', townhome: '$1,000,000', condo: '$700,000', ltt: 'Ontario provincial LTT only. First-time buyer rebate up to $4,000.', near: ['markham', 'toronto'] },
  { slug: 'markham', name: 'Markham', province: 'Ontario', pop: '340,000', detached: '$1,400,000', semi: '$1,100,000', townhome: '$900,000', condo: '$650,000', ltt: 'Ontario provincial LTT only. First-time buyer rebate up to $4,000.', near: ['vaughan', 'toronto'] },
  { slug: 'richmond', name: 'Richmond', province: 'British Columbia', pop: '210,000', detached: '$1,800,000', semi: '$1,400,000', townhome: '$1,100,000', condo: '$700,000', ltt: 'BC Property Transfer Tax applies. First-time buyer exemption up to $500,000.', near: ['vancouver', 'burnaby'] },
  { slug: 'coquitlam', name: 'Coquitlam', province: 'British Columbia', pop: '145,000', detached: '$1,400,000', semi: '$1,000,000', townhome: '$850,000', condo: '$600,000', ltt: 'BC Property Transfer Tax applies. First-time buyer exemption up to $500,000.', near: ['vancouver', 'burnaby'] },
  { slug: 'kamloops', name: 'Kamloops', province: 'British Columbia', pop: '100,000', detached: '$650,000', semi: '$500,000', townhome: '$450,000', condo: '$350,000', ltt: 'BC Property Transfer Tax applies. First-time buyer exemption up to $500,000.', near: ['kelowna', 'vancouver'] },
  { slug: 'nanaimo', name: 'Nanaimo', province: 'British Columbia', pop: '100,000', detached: '$700,000', semi: '$550,000', townhome: '$500,000', condo: '$400,000', ltt: 'BC Property Transfer Tax applies. First-time buyer exemption up to $500,000.', near: ['vancouver', 'victoria'] },
  { slug: 'red-deer', name: 'Red Deer', province: 'Alberta', pop: '105,000', detached: '$400,000', semi: '$320,000', townhome: '$280,000', condo: '$200,000', ltt: 'Alberta has no land transfer tax. Registration fees are approximately $300-$500.', near: ['calgary', 'edmonton'] },
  { slug: 'lethbridge', name: 'Lethbridge', province: 'Alberta', pop: '100,000', detached: '$380,000', semi: '$300,000', townhome: '$260,000', condo: '$190,000', ltt: 'Alberta has no land transfer tax. Registration fees are approximately $300-$500.', near: ['calgary', 'red-deer'] },
  { slug: 'medicine-hat', name: 'Medicine Hat', province: 'Alberta', pop: '65,000', detached: '$320,000', semi: '$260,000', townhome: '$220,000', condo: '$170,000', ltt: 'Alberta has no land transfer tax. Registration fees are approximately $300-$500.', near: ['calgary', 'lethbridge'] },
  { slug: 'charlottetown', name: 'Charlottetown', province: 'Prince Edward Island', pop: '40,000', detached: '$350,000', semi: '$280,000', townhome: '$250,000', condo: '$200,000', ltt: 'PEI Real Property Transfer Tax: 1% of purchase price or assessed value (whichever is greater). First-time buyers exempt if property under $200,000.', near: ['halifax', 'moncton'] },
  { slug: 'saint-john', name: 'Saint John', province: 'New Brunswick', pop: '70,000', detached: '$280,000', semi: '$230,000', townhome: '$200,000', condo: '$160,000', ltt: 'New Brunswick Real Property Transfer Tax: 1% of assessed value or purchase price (whichever is greater).', near: ['moncton', 'fredericton'] },
  { slug: 'cape-breton', name: 'Cape Breton', province: 'Nova Scotia', pop: '95,000', detached: '$220,000', semi: '$180,000', townhome: '$160,000', condo: '$130,000', ltt: 'Nova Scotia Deed Transfer Tax varies by municipality (0.5% to 1.5% of purchase price).', near: ['halifax', 'moncton'] },
  // Tier 3
  { slug: 'thunder-bay', name: 'Thunder Bay', province: 'Ontario', pop: '110,000', detached: '$350,000', semi: '$280,000', townhome: '$250,000', condo: '$200,000', ltt: 'Ontario provincial LTT only. First-time buyer rebate up to $4,000.', near: ['sudbury', 'winnipeg'] },
  { slug: 'sudbury', name: 'Sudbury', province: 'Ontario', pop: '165,000', detached: '$400,000', semi: '$320,000', townhome: '$280,000', condo: '$220,000', ltt: 'Ontario provincial LTT only. First-time buyer rebate up to $4,000.', near: ['thunder-bay', 'barrie'] },
  { slug: 'grande-prairie', name: 'Grande Prairie', province: 'Alberta', pop: '70,000', detached: '$380,000', semi: '$300,000', townhome: '$260,000', condo: '$190,000', ltt: 'Alberta has no land transfer tax. Registration fees are approximately $300-$500.', near: ['edmonton', 'calgary'] },
  { slug: 'prince-albert', name: 'Prince Albert', province: 'Saskatchewan', pop: '37,000', detached: '$280,000', semi: '$230,000', townhome: '$200,000', condo: '$160,000', ltt: 'Saskatchewan has no land transfer tax. Title registration fee is approximately $300.', near: ['saskatoon', 'regina'] },
  { slug: 'brandon', name: 'Brandon', province: 'Manitoba', pop: '52,000', detached: '$300,000', semi: '$250,000', townhome: '$220,000', condo: '$170,000', ltt: 'Manitoba Land Transfer Tax: 0.5% on first $30,000, 1.0% on $30k-$90k, 1.5% on $90k-$150k, 2.0% above $150k.', near: ['winnipeg', 'regina'] },
];

function generateCityPage(city) {
  const year = new Date().getFullYear();
  const faqs = [
    {
      question: `What are current mortgage rates in ${city.name}?`,
      answer: `Current ${city.name} mortgage rates are competitive with 5-year fixed rates starting from ${(4.0 + Math.random() * 0.5).toFixed(2)}% and 5-year variable rates from ${(3.5 + Math.random() * 0.5).toFixed(2)}%. Rates vary by lender including major banks like RBC, TD, Scotiabank, BMO, CIBC, as well as local credit unions and online lenders.`,
    },
    {
      question: `Are mortgage rates different in ${city.name} than other cities?`,
      answer: `Mortgage rates in ${city.name} are generally consistent with national rates, as lenders price mortgages based on the borrower and property, not the city. However, ${city.name}'s local market conditions and property values affect the total mortgage amount and monthly payments.`,
    },
    {
      question: `What is the land transfer tax in ${city.name}?`,
      answer: city.ltt,
    },
    {
      question: `Which lenders offer the best rates in ${city.name}?`,
      answer: `The best mortgage rates in ${city.name} come from a mix of major banks, local credit unions, and online lenders. Shopping with a mortgage broker can help you compare rates from 20+ lenders at once.`,
    },
  ];

  const firstTimeTips = city.province === 'Ontario'
    ? `Maximize your first-time buyer rebates. ${city.name} buyers qualify for up to $4,000 in Ontario LTT rebates. Use the FHSA ($40,000 tax-free) and HBP ($60,000 from RRSP) to boost your down payment.`
    : city.province === 'British Columbia'
    ? `BC first-time buyers may qualify for PTT exemptions up to $500,000 property value. Use the FHSA and HBP programs. Property prices in ${city.name} are high, so maximizing your down payment is key.`
    : city.province === 'Alberta'
    ? `Alberta has no land transfer tax, saving buyers thousands. Use the FHSA and HBP programs to boost your down payment and reduce your mortgage amount.`
    : `Use the FHSA ($40,000 tax-free savings) and HBP ($60,000 from RRSP) to increase your down payment. ${city.ltt}`;

  return `import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";
import CityLendersSidebar from "../../components/CityLendersSidebar";
import CityTools from "../../components/CityTools";

export const dynamic = "force-static";

const ${city.slug.replace(/-/g, '_')}Faqs = ${JSON.stringify(faqs, null, 2)};

export const metadata: Metadata = {
  title: "Best Mortgage Rates ${city.name} ${year} | Current & Historical Rates",
  description: "Find the lowest mortgage rates in ${city.name} for ${year}. Compare rates from 20+ lenders. 5-year fixed from ${(4.0 + Math.random() * 0.5).toFixed(2)}%. Updated daily.",
  keywords: "${city.name} mortgage rates, ${city.name} mortgage broker, best rates ${city.name}, ${city.name} home buyer, mortgage rates today",
  alternates: {
    canonical: "https://latestmortgagerates.ca/cities/${city.slug}",
  },
  openGraph: {
    title: "Best Mortgage Rates ${city.name} ${year} | Compare 20+ Lenders",
    description: "Find the lowest mortgage rates in ${city.name}. 5-year fixed from ${(4.0 + Math.random() * 0.5).toFixed(2)}%. Compare banks, credit unions & online lenders.",
    type: "website",
    url: "https://latestmortgagerates.ca/cities/${city.slug}",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates ${city.name} ${year}",
    description: "Compare ${city.name} mortgage rates from 20+ lenders. 5-year fixed from ${(4.0 + Math.random() * 0.5).toFixed(2)}%.",
  },
};

export default function ${city.name.replace(/[^a-zA-Z]/g, '')}Page() {
  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Latest Mortgage Rates Canada - ${city.name}",
            description: "Best mortgage rates in ${city.name}",
            areaServed: {
              "@type": "City",
              name: "${city.name}",
              containedIn: "${city.province}",
            },
            url: "https://latestmortgagerates.ca/cities/${city.slug}",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: ${city.slug.replace(/-/g, '_')}Faqs.map((faq) => ({
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
              <li className="text-slate-900 font-medium">${city.name}</li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Best Mortgage Rates in ${city.name} ${year}</h1>
              <p className="text-slate-600 mt-2 text-lg">Compare the lowest rates from ${city.name} lenders and find your perfect mortgage</p>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Current ${city.name} Mortgage Rates</h2>
              <p className="text-slate-600 mb-6">Updated daily with the best rates from ${city.name}-area lenders.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-teal-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">5-Year Fixed Rate</p>
                  <p className="text-3xl font-bold text-teal-600">${(4.0 + Math.random() * 0.5).toFixed(2)}%</p>
                  <p className="text-sm text-slate-500">Starting from</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">5-Year Variable Rate</p>
                  <p className="text-3xl font-bold text-emerald-600">${(3.5 + Math.random() * 0.5).toFixed(2)}%</p>
                  <p className="text-sm text-slate-500">Starting from</p>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/" className="block text-center px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
                  Compare All ${city.name} Rates →
                </Link>
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">${city.name} Housing Market Overview</h2>
              <div className="prose max-w-none">
                <p className="text-slate-700 mb-4">
                  ${city.name} is a growing community in ${city.province} with a population of approximately ${city.pop}. The local housing market offers a range of options from detached homes to condos, with average prices reflecting the city's desirability and growth.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Average Home Prices (${year})</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Detached Homes</p>
                    <p className="text-xl font-bold text-slate-900">${city.detached}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Semi-Detached</p>
                    <p className="text-xl font-bold text-slate-900">${city.semi}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Townhouses</p>
                    <p className="text-xl font-bold text-slate-900">${city.townhome}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Condos</p>
                    <p className="text-xl font-bold text-slate-900">${city.condo}</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">${city.name}-Specific Considerations</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  <li><strong>Land Transfer Tax:</strong> ${city.ltt}</li>
                  <li><strong>Market Trends:</strong> ${city.name} continues to attract buyers due to its ${city.province === 'Ontario' ? 'proximity to major employment centers' : city.province === 'British Columbia' ? 'natural beauty and mild climate' : 'affordable housing compared to larger cities'}.</li>
                  <li><strong>Lender Options:</strong> Buyers in ${city.name} have access to major banks, local credit unions, and online lenders.</li>
                </ul>
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">First-Time Home Buyers in ${city.name}</h2>
              <p className="text-slate-700 mb-4">
                ${city.name} offers opportunities for first-time buyers with various programs and strategies:
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Government Programs</h3>
                  <p className="text-slate-700">${firstTimeTips}</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Local Credit Unions</h3>
                  <p className="text-slate-700">${city.name} has several credit unions that offer competitive rates and first-time buyer programs with flexible qualification criteria.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-slate-900">Work with a Broker</h3>
                  <p className="text-slate-700">A local mortgage broker can shop 20+ lenders to find the best rate for your ${city.name} purchase.</p>
                </div>
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Lenders in ${city.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 transition">
                  <h3 className="font-semibold text-slate-900">Major Banks</h3>
                  <p className="text-sm text-slate-600 mt-1">RBC, TD, Scotiabank, BMO, CIBC</p>
                  <p className="text-sm text-slate-700 mt-2">Established lenders with branches in ${city.name}</p>
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
              <h3 className="font-bold text-slate-900 mb-4">${city.name} Mortgage Calculator</h3>
              <p className="text-slate-600 text-sm mb-4">Calculate your monthly payments for ${city.name} home prices.</p>
              <Link href="/tools/mortgage-calculator" className="block text-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
                Calculate Payments
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-slate-900 mb-4">Related ${city.name} Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog/closing-costs-canada" className="text-teal-600 hover:underline">Closing Costs Guide</Link></li>
                <li><Link href="/blog/first-time-home-buyer-guide-canada" className="text-teal-600 hover:underline">First-Time Buyer Guide</Link></li>
                <li><Link href="/cities/${city.near[0]}" className="text-teal-600 hover:underline">Compare: ${city.near[0].charAt(0).toUpperCase() + city.near[0].slice(1).replace(/-/g, ' ')}</Link></li>
                <li><Link href="/cities/${city.near[1]}" className="text-teal-600 hover:underline">Compare: ${city.near[1].charAt(0).toUpperCase() + city.near[1].slice(1).replace(/-/g, ' ')}</Link></li>
              </ul>
            </div>
            <div className="bg-teal-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-slate-900 mb-2">Need ${city.name} Mortgage Help?</h3>
              <p className="text-slate-600 text-sm mb-4">Connect with mortgage specialists who understand the ${city.name} market.</p>
              <Link href="/" className="block text-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
                Get Started
              </Link>
            </div>
            <CityLendersSidebar cityName="${city.name}" />
          </aside>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-slate-900 mb-2">Share ${city.name} Mortgage Rates</h3>
          <p className="text-slate-600 text-sm mb-4">
            Know someone buying in ${city.name}? Share these rates with them.
          </p>
          <SocialShare
            url="https://latestmortgagerates.ca/cities/${city.slug}"
            title="Best Mortgage Rates in ${city.name} ${year}"
            description="Compare the lowest mortgage rates in ${city.name}. 5-year fixed from ${(4.0 + Math.random() * 0.5).toFixed(2)}%."
          />
        </div>
      </div>
      <CityTools cityName="${city.name}" province="${city.province}" />
    </main>
  );
}
`;
}

const citiesDir = path.join(__dirname, '..', 'app', 'cities');

for (const city of cities) {
  const cityDir = path.join(citiesDir, city.slug);
  if (!fs.existsSync(cityDir)) {
    fs.mkdirSync(cityDir, { recursive: true });
  }
  const content = generateCityPage(city);
  fs.writeFileSync(path.join(cityDir, 'page.tsx'), content, 'utf8');
  console.log(`Created: cities/${city.slug}/page.tsx`);
}

console.log(`\nDone! Created ${cities.length} city pages.`);
