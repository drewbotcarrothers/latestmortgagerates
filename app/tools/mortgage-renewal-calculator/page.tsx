import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import MortgageRenewalCalculator from "../../components/MortgageRenewalCalculator";

export const metadata: Metadata = {
  title: "Mortgage Renewal Calculator | Compare Current vs New Lender Rates",
  description: "Should you renew with your current lender or shop around? Calculate your potential savings, compare rates, and see your break-even point when renewing your Canadian mortgage.",
  keywords: "mortgage renewal calculator, mortgage renewal savings, should I switch mortgage lenders, mortgage renewal rates Canada, renewal vs switch calculator",
  alternates: {
    canonical: "https://latestmortgagerates.ca/tools/mortgage-renewal-calculator",
  },
  openGraph: {
    title: "Mortgage Renewal Calculator | Compare Current vs New Lender Rates",
    description: "Calculate your savings when renewing your mortgage. Compare staying with your current lender vs shopping for a better rate. Includes break-even analysis.",
    type: "website",
    url: "https://latestmortgagerates.ca/tools/mortgage-renewal-calculator",
    locale: "en_CA",
    siteName: "Latest Mortgage Rates Canada",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortgage Renewal Calculator | Compare Current vs New Lender Rates",
    description: "Calculate your savings when renewing your mortgage. Compare staying with your current lender vs shopping for a better rate.",
  },
};

// FAQ for structured data
const faqs = [
  {
    question: "Should I renew with my current lender or shop around?",
    answer: "You should always shop around before renewing. Your current lender's 'posted rate' is often higher than market rates. Get quotes from 3-5 lenders, then ask your current lender to match. Shopping around could save you thousands over your renewal term.",
  },
  {
    question: "How much could I save by switching mortgage lenders?",
    answer: "Savings depend on your mortgage balance and rate difference. For example, on a $400,000 balance, negotiating from 4.89% to 3.64% could save approximately $5,000 per year or $25,000 over a 5-year term. Use our calculator to see your exact potential savings.",
  },
  {
    question: "What are the costs of switching mortgage lenders?",
    answer: "Switching costs typically include appraisal ($300-400), legal fees ($800-1,000), and sometimes discharge fees ($200-400). However, many lenders offer to cover these costs for new customers as an incentive. Calculate if the savings exceed these one-time costs.",
  },
  {
    question: "When should I start shopping for my mortgage renewal?",
    answer: "Start shopping 4-6 months before your renewal date. This gives you time to get multiple quotes, negotiate, and complete any paperwork. Most lenders can hold a rate for 90-120 days, so you can lock in a good rate early.",
  },
  {
    question: "Will my credit score affect my renewal rate?",
    answer: "With your current lender, credit score typically doesn't matter for a simple renewal (no new money). But when switching lenders, they will check your credit score. Ensure your score is in good shape before shopping around.",
  },
];

export default function MortgageRenewalCalculatorPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
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

      <main className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Latest Mortgage Rates Canada"
                    width={70}
                    height={70}
                    className="rounded-lg"
                    priority
                  />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Latest Mortgage Rates Canada
                  </h1>
                </div>
              </div>
              <Navigation currentPage="tools" />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-3xl">
              <nav className="text-sm text-slate-300 mb-4">
                <ol className="flex items-center space-x-2" itemScope itemType="https://schema.org/BreadcrumbList">
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <Link href="/" itemProp="item" className="hover:text-white transition">
                      <span itemProp="name">Home</span>
                    </Link>
                    <meta itemProp="position" content="1" />
                  </li>
                  <li className="text-slate-500">/</li>
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <Link href="/tools" itemProp="item" className="hover:text-white transition">
                      <span itemProp="name">Tools</span>
                    </Link>
                    <meta itemProp="position" content="2" />
                  </li>
                  <li className="text-slate-500">/</li>
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <span itemProp="name" className="text-slate-300">Renewal Calculator</span>
                    <meta itemProp="position" content="3" />
                  </li>
                </ol>
              </nav>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Mortgage Renewal Calculator
              </h1>
              <p className="text-xl text-slate-300">
                Should you stay with your current lender or shop around? Calculate your potential savings 
                when renewing your Canadian mortgage. Compare rates and see your break-even analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <MortgageRenewalCalculator />
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Frequently Asked Questions About Mortgage Renewals
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/tools/mortgage-payment-calculator"
              className="card-default p-6 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-slate-900 mb-2">Mortgage Payment Calculator</h3>
              <p className="text-sm text-slate-600">Calculate your monthly payments with any rate</p>
            </Link>
            <Link
              href="/tools/refinance-calculator"
              className="card-default p-6 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-slate-900 mb-2">Refinance Calculator</h3>
              <p className="text-sm text-slate-600">See if refinancing makes sense for you</p>
            </Link>
            <Link
              href="/tools/affordability-calculator"
              className="card-default p-6 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-slate-900 mb-2">Affordability Calculator</h3>
              <p className="text-sm text-slate-600">Find out how much you can afford</p>
            </Link>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
