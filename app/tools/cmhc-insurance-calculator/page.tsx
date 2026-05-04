import { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CMHCCalculator from "../../components/CMHCCalculator";
import HowToSchema from "../../components/HowToSchema";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";
import CalculatorRelatedTools from "../../components/CalculatorRelatedTools";
import FAQSection from "../../components/FAQSection";
import GuideCTA from "../../components/GuideCTA";

export const metadata: Metadata = {
  title: "CMHC Mortgage Insurance Calculator Canada | Premium Rates 2026",
  description: "Calculate your CMHC mortgage insurance premium. See how your down payment affects insurance costs. Updated with 2026 CMHC premium rates for Canada.",
  keywords: "CMHC calculator, mortgage insurance calculator Canada, CMHC premium rates, mortgage default insurance, high ratio mortgage calculator",
  alternates: {
    canonical: "https://latestmortgagerates.ca/tools/cmhc-insurance-calculator",
  },
  openGraph: {
    title: "CMHC Mortgage Insurance Calculator Canada | Premium Rates 2026",
    description: "Calculate your CMHC mortgage insurance premium based on your down payment and home price.",
    url: "https://latestmortgagerates.ca/tools/cmhc-insurance-calculator",
    siteName: "Latest Mortgage Rates Canada",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CMHC Calculator Canada",
    description: "Calculate mortgage insurance premiums",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function CMHCCalculatorPage() {
  return (
    <>
      <HowToSchema
        name="How to Calculate CMHC Mortgage Insurance"
        description="Calculate your CMHC mortgage default insurance premium based on your home price and down payment"
        totalTime="PT3M"
        steps={[
          {
            name: "Enter Home Price",
            text: "Input the purchase price of the home you're considering.",
          },
          {
            name: "Enter Down Payment",
            text: "Enter your down payment amount (must be at least 5% for CMHC insurance).",
          },
          {
            name: "Select Province",
            text: "Choose your province for applicable sales tax calculation.",
          },
          {
            name: "Review Premium",
            text: "See your CMHC premium, taxes, and total insurance cost added to your mortgage.",
          },
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "CMHC Insurance Calculator" },
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
                <span>CMHC Insurance Calculator</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                CMHC Mortgage Insurance Calculator
              </h1>
              <p className="text-xl text-slate-300">
                Calculate your mortgage default insurance premium.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <CMHCCalculator />
          <div className="mt-8 max-w-md mx-auto">
            <GuideCTA variant="compact" />
          </div>
        </div>

        <CalculatorRelatedTools currentTool="/tools/cmhc-insurance-calculator" />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <FAQSection
            faqs={[
              {
                question: "What is CMHC mortgage insurance?",
                answer: "CMHC (Canada Mortgage and Housing Corporation) mortgage insurance protects lenders if you default on your mortgage. It's required in Canada when your down payment is less than 20% of the purchase price. The premium is added to your mortgage amount and paid over the life of the loan.",
              },
              {
                question: "How much does CMHC insurance cost?",
                answer: "CMHC premiums range from 0.6% to 4.0% of your mortgage amount depending on your down payment. With 5% down, you pay 4.0%. With 10% down, 3.1%. With 15% down, 2.8%. The premium decreases as your down payment increases. Use our calculator to see your exact premium.",
              },
              {
                question: "Is CMHC insurance mandatory?",
                answer: "CMHC insurance is mandatory for high-ratio mortgages (less than 20% down) from federally regulated lenders. If you put 20% or more down, you avoid CMHC insurance entirely. Some credit unions and private lenders may have different requirements.",
              },
              {
                question: "Can I avoid CMHC insurance?",
                answer: "Yes, by making a down payment of 20% or more. Other options include getting a gifted down payment to reach 20%, using the Home Buyers' Plan to withdraw from your RRSP, or purchasing a less expensive home. Some alternative lenders also offer no-CMHC options with higher rates.",
              },
              {
                question: "Is CMHC insurance tax deductible?",
                answer: "No, CMHC insurance premiums are not tax deductible. However, in some provinces (Ontario, Quebec, Manitoba), provincial sales tax on the CMHC premium may be eligible for rebates or credits. The premium itself is rolled into your mortgage and paid over time with interest.",
              },
            ]}
          />
        </div>

        <Footer />
      </main>
    </>
  );
}
