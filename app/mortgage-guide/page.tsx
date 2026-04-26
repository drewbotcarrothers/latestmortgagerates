import { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HowToSchema from "../components/HowToSchema";

export const metadata: Metadata = {
  title: "Guide to Getting the Best Deal on Your Next Mortgage | $29",
  description: "The ultimate Canadian mortgage guide. Learn insider secrets to negotiate better rates, time the market, and save thousands on your mortgage. Instant PDF download.",
  keywords: "mortgage guide Canada, how to get best mortgage rate, mortgage negotiation guide, Canadian mortgage ebook",
  alternates: {
    canonical: "https://latestmortgagerates.ca/mortgage-guide",
  },
  openGraph: {
    title: "Guide to Getting the Best Deal on Your Next Mortgage",
    description: "Insider secrets to save thousands on your Canadian mortgage. Instant PDF download.",
    url: "https://latestmortgagerates.ca/mortgage-guide",
    siteName: "Latest Mortgage Rates Canada",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortgage Negotiation Guide",
    description: "Save thousands on your next mortgage",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const benefits = [
  {
    icon: "💰",
    title: "Save $5,000-$25,000",
    description: "Learn the exact negotiation tactics that can reduce your rate by 0.5-1%, saving thousands over your term.",
  },
  {
    icon: "⏰",
    title: "Perfect Timing",
    description: "Know when to lock in rates and when to wait. Master the Bank of Canada cycle for optimal timing.",
  },
  {
    icon: "🏦",
    title: "Bank Secrets Revealed",
    description: "Understand posted vs contract rates, how brokers really get paid, and which lenders to target.",
  },
  {
    icon: "🛡️",
    title: "Avoid Costly Mistakes",
    description: "Common traps that cost borrowers thousands: IRD penalties, renewal auto-pilot, and fine print gotchas.",
  },
  {
    icon: "✅",
    title: "Pre-Approval Strategy",
    description: "Get pre-approved without hurting your credit. Position yourself as a serious buyer lenders compete for.",
  },
  {
    icon: "📊",
    title: "Real Rate Data",
    description: "Access historical rate trends and benchmarks so you know what a good deal actually looks like.",
  },
];

const chapters = [
  { num: "01", title: "The Hidden Mortgage Market", desc: "Why the rate you see is not the rate you should pay" },
  { num: "02", title: "Timing is Everything", desc: "Bank of Canada decisions, bond yields, and rate forecasting" },
  { num: "03", title: "The Negotiation Playbook", desc: "Word-for-word scripts to negotiate with banks and brokers" },
  { num: "04", title: "Fixed vs Variable: The Real Math", desc: "When to lock in and when to float" },
  { num: "05", title: "Shopping Strategies That Work", desc: "How to get 5+ quotes without destroying your credit score" },
  { num: "06", title: "First-Time Buyer Advantages", desc: "Leverage programs and subsidies for maximum savings" },
  { num: "07", title: "Renewal Revolution", desc: "Do not let your bank auto-renew" },
  { num: "08", title: "The Fine Print Protection Guide", desc: "Prepays, porting, penalties, and portability clause secrets" },
  { num: "09", title: "2026 Rate Forecast", desc: "Expert predictions and what they mean for your mortgage timing" },
  { num: "10", title: "Your Action Plan", desc: "Step-by-step checklist from shopping to closing" },
];

const faqs = [
  {
    q: "Is this guide for first-time buyers only?",
    a: "Not at all. While first-time buyers will find it invaluable, the negotiation tactics, renewal strategies, and refinance optimizations work for anyone with a mortgage.",
  },
  {
    q: "How is this different from free online resources?",
    a: "This guide compiles insider knowledge that is not publicly shared. Bank posted vs contract rates, broker commission structures, and negotiation scripts are not discussed openly.",
  },
  {
    q: "Can I really save thousands?",
    a: "On a $500,000 mortgage, a 0.5% rate reduction saves approximately $2,500/year or $12,500 over a 5-year term.",
  },
  {
    q: "What format is the ebook?",
    a: "You will receive a beautifully designed PDF that works on any device - computer, tablet, or phone.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes. If you do not find at least one tactic that saves you money, email us within 30 days for a full refund.",
  },
  {
    q: "How current is the information?",
    a: "The guide is updated quarterly with the latest rate data and market forecasts. Your purchase includes free updates for 12 months.",
  },
];

export default function EbookLandingPage() {
  return (
    <>
      <HowToSchema
        name="How to Get the Best Mortgage Deal"
        description="Learn insider strategies to negotiate better mortgage rates and save thousands"
        steps={[
          { name: "Understand the Market", text: "Learn how posted vs contract rates work" },
          { name: "Time Your Application", text: "Use Bank of Canada cycles to lock in at optimal times" },
          { name: "Get Multiple Quotes", text: "Shop 5+ lenders strategically" },
          { name: "Negotiate Like a Pro", text: "Use scripts and leverage points" },
          { name: "Protect Yourself", text: "Understand prepayment privileges and penalties" },
        ]}
      />
      
      <main className="min-h-screen bg-slate-50">
        <Header currentPage="guides" />

        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 text-teal-300 rounded-full text-sm font-medium mb-8">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Trusted by Canadian homebuyers</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                The Guide to Getting the Best Deal on Your Next Mortgage
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Insider secrets that banks do not want you to know. Save thousands by negotiating smarter.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <a
                  href="https://buy.stripe.com/7sY4gz8ZtbAqg2s8nw9oc00"
                  className="inline-flex items-center justify-center px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold text-lg rounded-lg transition-colors w-full sm:w-auto"
                >
                  Get Instant Access — $29 CAD
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">What is Inside the Guide</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">10 Chapters of Actionable Intel</h2>
            </div>

            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <span className="text-teal-600 font-mono font-bold text-lg">{chapter.num}</span>
                  <div>
                    <h3 className="font-bold text-slate-900">{chapter.title}</h3>
                    <p className="text-sm text-slate-600">{chapter.desc}</p>
                  </div>
                </div>
              ))}
            </div>          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Free Tools &amp; Resources</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Use these free calculators and guides alongside the book to maximize your savings.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/tools/mortgage-calculator" className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all">
                <span className="text-3xl mb-3 block">&#x1f9ee;</span>
                <h3 className="font-bold text-slate-900 mb-2">Payment Calculator</h3>
                <p className="text-sm text-slate-600">Calculate monthly payments for any mortgage amount and rate.</p>
              </Link>
              <Link href="/tools/affordability-calculator" className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all">
                <span className="text-3xl mb-3 block">&#x1f3e0;</span>
                <h3 className="font-bold text-slate-900 mb-2">Affordability Calculator</h3>
                <p className="text-sm text-slate-600">Find out exactly how much mortgage you qualify for.</p>
              </Link>
              <Link href="/tools/cmhc-insurance-calculator" className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all">
                <span className="text-3xl mb-3 block">&#x1f6e1;</span>
                <h3 className="font-bold text-slate-900 mb-2">CMHC Calculator</h3>
                <p className="text-sm text-slate-600">See how much mortgage insurance will cost with your down payment.</p>
              </Link>
              <Link href="/glossary" className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all">
                <span className="text-3xl mb-3 block">&#x1f4da;</span>
                <h3 className="font-bold text-slate-900 mb-2">Mortgage Glossary</h3>
                <p className="text-sm text-slate-600">Understand every term before you negotiate. 50+ definitions.</p>
              </Link>
              <Link href="/" className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all">
                <span className="text-3xl mb-3 block">&#x1f4ca;</span>
                <h3 className="font-bold text-slate-900 mb-2">Compare Rates</h3>
                <p className="text-sm text-slate-600">See live rates from 31+ Canadian lenders to benchmark your offer.</p>
              </Link>
              <Link href="/blog" className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all">
                <span className="text-3xl mb-3 block">&#x1f4f0;</span>
                <h3 className="font-bold text-slate-900 mb-2">Rate News &amp; Analysis</h3>
                <p className="text-sm text-slate-600">Weekly market updates and rate predictions from our experts.</p>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>          </div>
        </section>

        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Stop Overpaying?</h2>
            
            <div className="flex flex-col items-center gap-4">
              <a
                href="https://buy.stripe.com/7sY4gz8ZtbAqg2s8nw9oc00"
                className="inline-flex items-center justify-center px-10 py-5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xl rounded-lg"
              >
                Buy the Guide — $29 CAD
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
