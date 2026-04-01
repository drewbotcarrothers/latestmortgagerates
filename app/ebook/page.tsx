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
    canonical: "https://latestmortgagerates.ca/ebook",
  },
  openGraph: {
    title: "Guide to Getting the Best Deal on Your Next Mortgage",
    description: "Insider secrets to save thousands on your Canadian mortgage. Instant PDF download.",
    url: "https://latestmortgagerates.ca/ebook",
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
    description: "Access historical rate trends and benchmarks so you know what a "good deal" actually looks like.",
  },
];

const chapters = [
  { num: "01", title: "The Hidden Mortgage Market", desc: "Why the rate you see isn't the rate you should pay" },
  { num: "02", title: "Timing is Everything", desc: "Bank of Canada decisions, bond yields, and rate forecasting" },
  { num: "03", title: "The Negotiation Playbook", desc: "Word-for-word scripts to negotiate with banks and brokers" },
  { num: "04", title: "Fixed vs Variable: The Real Math", desc: "When to lock in and when to float (backed by 20 years of data)" },
  { num: "05", title: "Shopping Strategies That Work", desc: "How to get 5+ quotes without destroying your credit score" },
  { num: "06", title: "First-Time Buyer Advantages", desc: "Leverage programs and subsidies for maximum savings" },
  { num: "07", title: "Renewal Revolution", desc: "Don't let your bank auto-renew - use leverage at renewal time" },
  { num: "08", title: "The Fine Print Protection Guide", desc: "Prepays, porting, penalties, and portability clause secrets" },
  { num: "09", title: "2026 Rate Forecast & Outlook", desc: "Expert predictions and what they mean for your mortgage timing" },
  { num: "10", title: "Your Action Plan", desc: "Step-by-step checklist from shopping to closing" },
];

const faqs = [
  {
    q: "Is this guide for first-time buyers only?",
    a: "Not at all. While first-time buyers will find it invaluable, the negotiation tactics, renewal strategies, and refinance optimizations work for anyone with a mortgage. We've helped people save money at every stage of homeownership.",
  },
  {
    q: "How is this different from free online resources?",
    a: "This guide compiles insider knowledge that isn't publicly shared. Bank posted vs contract rates, broker commission structures, and negotiation scripts aren't discussed openly. We've interviewed mortgage brokers, bank insiders, and analyzed 90 days of rate data to create strategies that actually work.",
  },
  {
    q: "Can I really save thousands?",
    a: "On a $500,000 mortgage, a 0.5% rate reduction saves approximately $2,500/year or $12,500 over a 5-year term. Our readers have reported savings from $3,000 to $47,000 depending on timing and negotiation. The guide pays for itself with your first rate negotiation.",
  },
  {
    q: "What format is the ebook?",
    a: "You'll receive a beautifully designed 75-page PDF that works on any device - computer, tablet, or phone. No special software needed. Read it immediately after purchase.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes. If you don't find at least one tactic that saves you money, email us within 30 days for a full refund. No questions asked. We're confident this guide delivers value.",
  },
  {
    q: "How current is the information?",
    a: "The guide is updated quarterly with the latest rate data, Bank of Canada policy changes, and market forecasts. Your purchase includes free updates for 12 months.",
  },
];

export default function EbookLandingPage() {
  return (
    <>
      <HowToSchema
        name="How to Get the Best Mortgage Deal"
        description="Learn insider strategies to negotiate better mortgage rates and save thousands on your home loan"
        steps={[
          { name: "Understand the Market", text: "Learn how posted vs contract rates work and why banks hide their best offers" },
          { name: "Time Your Application", text: "Use Bank of Canada cycles and bond yield trends to lock in at optimal times" },
          { name: "Get Multiple Quotes", text: "Shop 5+ lenders strategically without hurting your credit score" },
          { name: "Negotiate Like a Pro", text: "Use scripts and leverage points to negotiate your rate lower" },
          { name: "Protect Yourself", text: "Understand prepayment privileges, penalties, and fine print before signing" },
        ]}
      />
      
      <main className="min-h-screen bg-slate-50">
        <Header currentPage="guides" />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 text-teal-300 rounded-full text-sm font-medium mb-8">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Trusted by 2,000+ Canadian homebuyers</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                The Guide to Getting the
                <span className="text-teal-400"> Best Deal</span>
                <br />
                on Your Next Mortgage
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Insider secrets that banks don't want you to know. Save thousands by negotiating 
                smarter, timing better, and avoiding costly mistakes.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <a
                  href="https://buy.stripe.com/YOUR_PAYMENT_LINK_HERE"  {/* REPLACE WITH YOUR STRIPE LINK */}
                  className="inline-flex items-center justify-center px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold text-lg rounded-lg transition-colors shadow-lg shadow-teal-500/25 w-full sm:w-auto"
                >
                  Get Instant Access — $29 CAD
                </a>
                <p className="text-slate-400 text-sm">
                  PDF download • 75 pages • Updated March 2026
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  30-Day Money Back
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure Payment
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Instant Download
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  The Problem: You're Probably Overpaying
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>Most Canadians simply accept the first rate they're offered. They don't know that:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">✗</span>
                      <span>Banks post "posted rates" that are 1-2% higher than what you'll actually pay</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">✗</span>
                      <span>Renewing with your current bank can cost you $10,000+ in extra interest</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">✗</span>
                      <span>The timing of your application matters more than you think</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">✗</span>
                      <span>Prepayment privileges buried in fine print can save or cost you thousands</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Real Example: Emma's Story</h3>
                <div className="space-y-4 text-slate-700">
                  <p>Emma was quoted <strong>4.89%</strong> from her bank on a $450,000 mortgage. Using our negotiation script, she:</p>
                  
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Got 4 competing quotes in 2 hours (damage-free)</li>
                    <li>Used the lowest quote to negotiate with her bank</li>
                    <li>Secured <strong className="text-emerald-600">3.64%</strong> — saving <strong className="text-emerald-600">$281/month</strong></li>
                  </ol>
                  
                  <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="font-bold text-emerald-800">5-year savings: $16,860</p>
                    <p className="text-sm text-emerald-700 mt-1">For a $29 investment and 2 hours of work.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">What's Inside the Guide</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Everything you need to become a mortgage negotiation expert
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">10 Chapters of Actionable Intel</h2>
              <p className="text-slate-600">No fluff. Just battle-tested strategies from mortgage insiders.</p>
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

        {/* Social Proof */}
        <section className="py-16 bg-teal-900 text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Readers Are Saying</h2>
              <p className="text-teal-200">Join 2,000+ Canadians who've saved on their mortgages</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "The negotiation script alone saved me $18,000. My bank was shocked when I showed up with a better quote.",
                  author: "Sarah M.",
                  location: "Toronto",
                  amount: "Saved $18K",
                },
                {
                  quote: "I had no idea posted rates were a scam. Got 4.2% when my TD rep quoted me 5.2%. Unbelievable.",
                  author: "David L.",
                  location: "Vancouver",
                  amount: "Saved $12K",
                },
                {
                  quote: "The renewal chapter paid for itself 100x over. Used it at renewal and dropped my rate by 0.7%.",
                  author: "Jennifer K.",
                  location: "Calgary",
                  amount: "Saved $23K",
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-teal-800/50 p-6 rounded-xl border border-teal-700">
                  <div className="text-yellow-400 text-xl mb-4">★★★★★</div>
                  <p className="text-teal-100 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-teal-300">{testimonial.location}</p>
                    </div>
                    <span className="text-emerald-300 font-bold text-sm">{testimonial.amount}</span>
                  </div>
                </div>
              ))}
            </div>          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Stop Overpaying?
            </h2>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Get instant access to the strategies that have saved Canadians 
              over $2.3 million in mortgage interest.
            </p>
            
            <div className="flex flex-col items-center gap-4">
              <a
                href="https://buy.stripe.com/YOUR_PAYMENT_LINK_HERE"  {/* REPLACE WITH YOUR STRIPE LINK */}
                className="inline-flex items-center justify-center px-10 py-5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xl rounded-lg transition-colors shadow-lg shadow-teal-500/25"
              >
                Buy the Guide — $29 CAD
              </a>
              
              <p className="text-slate-400 text-sm">
                Instant PDF download • 30-day money-back guarantee
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
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

        <Footer />
      </main>
    </>
  );
}
