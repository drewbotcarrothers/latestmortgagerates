import { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import StressTestQualifier from "../../components/StressTestQualifier";
import HowToSchema from "../../components/HowToSchema";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";
import CalculatorRelatedTools from "../../components/CalculatorRelatedTools";
import FAQSection from "../../components/FAQSection";

export const metadata: Metadata = {
  title: "Mortgage Stress Test Qualifier Canada | 2026 Rules",
  description: "Check if you qualify for a mortgage under Canada's stress test rules. Calculate GDS and TDS ratios at the stress test rate to see if you can get approved.",
  keywords: "mortgage stress test calculator Canada, stress test qualifier, GDS TDS calculator, mortgage qualification, stress test rules 2026",
  alternates: {
    canonical: "https://latestmortgagerates.ca/tools/stress-test-qualifier",
  },
  openGraph: {
    title: "Mortgage Stress Test Qualifier Canada | 2026 Rules",
    description: "See if you qualify under Canada's mortgage stress test. Check your GDS and TDS ratios.",
    url: "https://latestmortgagerates.ca/tools/stress-test-qualifier",
    siteName: "Latest Mortgage Rates Canada",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stress Test Qualifier Canada",
    description: "Check mortgage qualification under stress test rules",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function StressTestPage() {
  return (
    <>
      <HowToSchema
        name="How to Check Mortgage Stress Test Qualification"
        description="Verify if you qualify for a mortgage under Canada's stress test rules"
        totalTime="PT5M"
        steps={[
          {
            name: "Enter Income",
            text: "Input your gross annual household income.",
          },
          {
            name: "Enter Property Details",
            text: "Input purchase price and down payment amount.",
          },
          {
            name: "Add Monthly Debts",
            text: "Enter existing monthly debt payments.",
          },
          {
            name: "Select Interest Rate",
            text: "Choose your expected mortgage rate.",
          },
          {
            name: "Check Results",
            text: "See if you pass the stress test at the higher qualifying rate.",
          },
        ]}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Stress Test Qualifier" },
        ]}
      />

      <main className="min-h-screen bg-slate-50">
        <Header currentPage="tools" />
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-teal-300 mb-4">
                <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
                <span>/</span>
                <span>Stress Test Qualifier</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Stress Test Qualifier</h1>
              <p className="text-xl text-slate-300">Check if you qualify under Canada&apos;s mortgage stress test rules.</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <StressTestQualifier />
        </div>

        <CalculatorRelatedTools currentTool="/tools/stress-test-qualifier" />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <FAQSection
            faqs={[
              {
                question: "What is the mortgage stress test in Canada?",
                answer: "The mortgage stress test requires lenders to qualify borrowers at a higher interest rate than their actual mortgage rate. As of 2026, you must qualify at the greater of: the Bank of Canada 5-year benchmark rate (currently 5.25%) OR your contract rate + 2%. This ensures you can afford payments if rates rise. Our calculator shows if you pass at the stress test rate.",
              },
              {
                question: "What are GDS and TDS ratios?",
                answer: "GDS (Gross Debt Service) is the percentage of your gross income spent on housing costs (mortgage, property tax, heating, condo fees). It must be ≤ 39%. TDS (Total Debt Service) includes housing costs PLUS all other debt payments (car loans, credit cards, student loans). It must be ≤ 44%. Both are calculated using the stress test rate, not your actual rate.",
              },
              {
                question: "What happens if I fail the stress test?",
                answer: "If you fail the stress test, you have several options: increase your down payment to reduce the mortgage amount, pay off existing debts to lower your TDS ratio, add a co-signer with income, choose a less expensive property, or wait and improve your financial situation. Some alternative lenders have more flexible requirements but charge higher rates.",
              },
              {
                question: "Does the stress test apply to all mortgages?",
                answer: "The stress test applies to all mortgages from federally regulated lenders (banks, credit unions under federal jurisdiction). Some provincially regulated credit unions and private lenders may not require it, but they typically charge higher rates. Renewals with your current lender usually don't require re-qualification, but switching lenders does.",
              },
              {
                question: "How can I improve my chances of passing the stress test?",
                answer: "Improve your chances by: paying down debts to lower TDS ratio, increasing your down payment (reduces mortgage and may avoid CMHC), increasing income (second job, side business, co-signer), choosing a longer amortization (lowers payments but increases interest), or targeting a less expensive property. Pre-approval helps you understand your limits before house hunting.",
              },
            ]}
          />
        </div>

        <Footer />
      </main>
    </>
  );
}
