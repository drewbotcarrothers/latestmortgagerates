import { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RefinanceCalculator from "../../components/RefinanceCalculator";
import HowToSchema from "../../components/HowToSchema";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";
import CalculatorRelatedTools from "../../components/CalculatorRelatedTools";
import FAQSection from "../../components/FAQSection";

export const metadata: Metadata = {
  title: "Mortgage Refinance Calculator Canada | Break-Even Analysis",
  description: "Calculate if refinancing your mortgage makes sense. Compare your current rate vs new rates, estimate penalties, and see your break-even point and total savings.",
  keywords: "mortgage refinance calculator Canada, refinance break even, mortgage penalty calculator, should I refinance, refinance savings",
  alternates: {
    canonical: "https://latestmortgagerates.ca/tools/refinance-calculator",
  },
  openGraph: {
    title: "Mortgage Refinance Calculator Canada | Break-Even Analysis",
    description: "See if refinancing makes sense. Calculate penalties, break-even point, and total savings.",
    url: "https://latestmortgagerates.ca/tools/refinance-calculator",
    siteName: "Latest Mortgage Rates Canada",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refinance Calculator Canada",
    description: "Calculate if refinancing makes sense",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function RefinancePage() {
  return (
    <>
      <HowToSchema
        name="How to Calculate Mortgage Refinance Savings"
        description="Calculate your potential savings from refinancing, including penalties and break-even point"
        totalTime="PT5M"
        steps={[
          {
            name: "Enter Current Mortgage Details",
            text: "Input your current mortgage balance, rate, and remaining term.",
          },
          {
            name: "Enter New Rate",
            text: "Input the new mortgage rate you're considering.",
          },
          {
            name: "Calculate Penalty",
            text: "Estimate your mortgage penalty for breaking early.",
          },
          {
            name: "Review Savings",
            text: "See your monthly savings, break-even point, and total savings.",
          },
        ]}
      />
      
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Refinance Calculator" },
        ]}
      />
      
      <main className="min-h-screen bg-slate-50">
        <Header currentPage="tools" />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-teal-300 mb-4">
                <Link href="/tools" className="hover:text-white transition-colors">
                  Tools
                </Link>
                <span>/</span>
                <span>Refinance Calculator</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Refinance Calculator
              </h1>
              <p className="text-xl text-slate-300">
                Calculate if refinancing your mortgage makes sense.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <RefinanceCalculator />
        </div>

        <CalculatorRelatedTools currentTool="/tools/refinance-calculator" />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <FAQSection
            faqs={[
              {
                question: "When does it make sense to refinance my mortgage?",
                answer: "Refinancing makes sense when you can secure a rate at least 0.5-1% lower than your current rate, when you need to access home equity for renovations or investments, when you want to consolidate high-interest debt, or when your financial situation has improved and you qualify for better terms. Use our calculator to see your break-even point and total savings.",
              },
              {
                question: "What are the costs to refinance a mortgage?",
                answer: "Refinancing costs typically include: appraisal fee ($300-500), legal fees ($800-1,500), title insurance ($200-500), discharge fee from current lender ($200-400), and potentially a mortgage registration fee. Total costs usually range from $1,500 to $3,000. Some lenders offer to cover these costs as an incentive to switch.",
              },
              {
                question: "How long does it take to break even on refinancing?",
                answer: "Break-even point depends on your penalty, new rate, and mortgage balance. Typically 12-36 months. For example, if refinancing costs $3,000 in penalties and fees, and you save $200/month on payments, your break-even is 15 months. After that, every month is pure savings. Our calculator shows your exact break-even timeline.",
              },
              {
                question: "Can I refinance with bad credit?",
                answer: "Yes, but options are more limited. Alternative and B-lenders work with lower credit scores (550-650) but charge higher rates (typically 1-3% above prime). If your credit has worsened since your original mortgage, you may face challenges. Consider improving your credit score first or working with a mortgage broker who specializes in alternative lending.",
              },
              {
                question: "Should I refinance or get a HELOC?",
                answer: "Refinance when you want a lower rate on your entire mortgage balance or need a large lump sum. A HELOC (Home Equity Line of Credit) is better for ongoing access to funds or smaller amounts. HELOCs have variable rates and interest-only payments, while refinances give you a fixed rate and structured payments. Many homeowners do a 'refinance plus HELOC' combination.",
              },
            ]}
          />
        </div>

        <Footer />
      </main>
    </>
  );
}
