import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import AffordabilityCalculator from "../components/AffordabilityCalculator";
import CMHCCalculator from "../components/CMHCCalculator";
import LandTransferTaxCalculator from "../components/LandTransferCalculator";
import SocialShare from "../components/SocialShare";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Mortgage Affordability Calculator Canada | Free Tools 2025",
  description: "Free Canadian mortgage calculators. Calculate how much house you can afford, CMHC insurance premiums, and land transfer tax by province. Updated with 2025 stress test rates.",
  keywords: ["mortgage affordability calculator Canada", "how much mortgage can I afford", "CMHC calculator", "land transfer tax calculator", "mortgage stress test calculator", "GDS TDS calculator"],
  alternates: {
    canonical: "https://latestmortgagerates.ca/tools",
  },
  openGraph: {
    title: "Mortgage Affordability Calculator Canada | Free Tools",
    description: "Calculate how much house you can afford in Canada. Free affordability, CMHC, and land transfer tax calculators.",
    type: "website",
    url: "https://latestmortgagerates.ca/tools",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortgage Affordability Calculator Canada",
    description: "Free Canadian mortgage calculators. Find out how much you can afford.",
  },
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How much mortgage can I afford in Canada?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "In Canada, lenders use GDS (Gross Debt Service) and TDS (Total Debt Service) ratios. Your GDS ratio (housing costs) should be under 39% of gross income, and TDS ratio (total debts) under 44%. Use our affordability calculator to find your maximum home price based on income, debts, and down payment.",
                },
              },
              {
                "@type": "Question",
                name: "What is the mortgage stress test in Canada?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The mortgage stress test requires you to qualify at the higher of: your contract rate + 2%, or 5.25% (the floor rate). This means even if you get a 4% mortgage, you must prove you can afford payments at 6.25%. Our calculator uses this rule automatically.",
                },
              },
              {
                "@type": "Question",
                name: "How much is CMHC insurance?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "CMHC insurance premiums range from 2.80% to 4.00% of your mortgage amount depending on down payment: 4.00% for 5-9.99% down, 3.10% for 10-14.99% down, and 2.80% for 15-19.99% down. With 20%+ down, no insurance is needed.",
                },
              },
              {
                "@type": "Question",
                name: "What is land transfer tax?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Land transfer tax is a provincial tax paid when buying property. Rates vary by province: Ontario 0.5-2%, BC 1-5%, Alberta has no LTT. Some provinces offer first-time buyer rebates. Use our calculator to estimate your costs.",
                },
              },
            ],
          }),
        }}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-teal-600 transition">Home</Link></li>
              <li><span className="text-slate-400">/</span></li>
              <li className="text-slate-900 font-medium">Tools</li>
            </ol>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Mortgage Calculators
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Free tools to calculate affordability, CMHC premiums, and closing costs
              </p>
            </div>
            <Navigation currentPage="tools" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Affordability Calculator - Full Width */}
        <section className="mb-8">
          <AffordabilityCalculator />
        </section>

        {/* Secondary Calculators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CMHCCalculator />
          <LandTransferTaxCalculator />
        </div>

        {/* Educational Section */}
        <section className="mt-12 bg-white rounded-xl border border-slate-200 shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Why Use Our Mortgage Tools?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Accurate Calculations</h3>
              <p className="text-slate-600 text-sm">
                Uses current Canadian mortgage rules including the stress test (5.25% floor), GDS/TDS ratios, and provincial variations.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Compare Scenarios</h3>
              <p className="text-slate-600 text-sm">
                Test different down payments, amortization periods (25 vs 30 years), and income levels to find your sweet spot.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Plan Ahead</h3>
              <p className="text-slate-600 text-sm">
                Know your numbers before approaching lenders. Understand closing costs including CMHC premiums and land transfer tax.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-12 bg-white rounded-xl border border-slate-200 shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">How much mortgage can I afford in Canada?</h3>
              <p className="text-slate-600">
                Canadian lenders use two key ratios: <strong>GDS (39% max)</strong> covers housing costs (mortgage + property tax + heating + 50% condo fees), while <strong>TDS (44% max)</strong> includes all debts. Use our calculator above to get your personalized maximum.
              </p>
            </div>
            
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">What is the mortgage stress test?</h3>
              <p className="text-slate-600">
                The stress test requires you to qualify at the higher of: your contract rate + 2%, or 5.25% (whichever is higher). Even if you get a 4% rate, you must prove you can afford payments at 6.25%. This protects you from rate increases.
              </p>
            </div>
            
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">How much down payment do I need?</h3>
              <p className="text-slate-600">
                - Under $500K: <strong>5% minimum</strong><br/>
                - $500K-$999K: 5% on first $500K + 10% on remainder<br/>
                - $1M+: <strong>20% minimum</strong>
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Should I choose 25 or 30-year amortization?</h3>
              <p className="text-slate-600">
                <strong>25 years:</strong> Lower rates, pay off faster, less interest overall.<br/>
                <strong>30 years:</strong> Lower monthly payments, ~8% more buying power.<br/>
                Note: 30-year amortization only available with 20%+ down payment (uninsured mortgages).
              </p>
            </div>
          </div>
        </section>

        {/* Social Sharing */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-lg p-6">
          <h3 className="font-bold text-slate-900 mb-2">Share These Calculators</h3>
          <p className="text-slate-600 text-sm mb-4">Help friends and family calculate their mortgage affordability.</p>
          <SocialShare 
            url="https://latestmortgagerates.ca/tools"
            title="Free Mortgage Affordability Calculator Canada"
            description="Calculate how much house you can afford. Free Canadian mortgage calculators with stress test rules."
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}
