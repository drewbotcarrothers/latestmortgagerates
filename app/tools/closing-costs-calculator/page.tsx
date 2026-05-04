import { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ClosingCostsCalculator from "../../components/ClosingCostsCalculator";
import HowToSchema from "../../components/HowToSchema";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";
import CalculatorRelatedTools from "../../components/CalculatorRelatedTools";
import FAQSection from "../../components/FAQSection";
import GuideCTA from "../../components/GuideCTA";

export const metadata: Metadata = {
  title: "Closing Costs Calculator Canada | Home Buying Fees",
  description: "Calculate total closing costs for buying a home in Canada. Includes land transfer tax, legal fees, and other expenses. See province-specific rebates for first-time buyers.",
  keywords: "closing costs calculator Canada, home buying fees, land transfer tax calculator, first time buyer rebates, closing costs estimate",
  alternates: {
    canonical: "https://latestmortgagerates.ca/tools/closing-costs-calculator",
  },
  openGraph: {
    title: "Closing Costs Calculator Canada | Home Buying Fees",
    description: "Calculate total cash needed to close on your home purchase. Includes all province-specific taxes and rebates.",
    url: "https://latestmortgagerates.ca/tools/closing-costs-calculator",
    siteName: "Latest Mortgage Rates Canada",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Closing Costs Calculator Canada",
    description: "Calculate total closing costs for buying a home",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function ClosingCostsPage() {
  return (
    <>
      <HowToSchema
        name="How to Calculate Closing Costs"
        description="Calculate all closing costs including land transfer tax, legal fees, and other expenses when buying a home"
        totalTime="PT5M"
        steps={[
          {
            name: "Enter Purchase Price",
            text: "Input the purchase price of the home.",
          },
          {
            name: "Select Province",
            text: "Choose your province for applicable taxes and rebates.",
          },
          {
            name: "Enter Down Payment",
            text: "Input your down payment amount.",
          },
          {
            name: "Add Additional Costs",
            text: "Include legal fees, inspection costs, and other expenses.",
          },
          {
            name: "Review Total",
            text: "See your total closing costs and cash required.",
          },
        ]}
      />
      
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Closing Costs Calculator" },
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
                <span>Closing Costs Calculator</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Closing Costs Calculator
              </h1>
              <p className="text-xl text-slate-300">
                Calculate total closing costs for buying a home in Canada. Includes land transfer tax, legal fees, and other expenses.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ClosingCostsCalculator />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <FAQSection
            faqs={[
              {
                question: "What are closing costs when buying a home in Canada?",
                answer: "Closing costs are the fees and expenses you pay when finalizing a home purchase. They typically include land transfer tax (1-3% of purchase price), legal fees ($800-1,500), title insurance ($200-500), home inspection ($400-600), and appraisal fees ($300-500). Total closing costs usually range from 1.5% to 4% of the purchase price.",
              },
              {
                question: "How much should I budget for closing costs?",
                answer: "Budget 1.5% to 4% of your purchase price for closing costs. On a $500,000 home, expect $7,500 to $20,000. First-time buyers may qualify for rebates on land transfer tax in most provinces. Use our calculator to get a precise estimate based on your province and purchase price.",
              },
              {
                question: "Do first-time buyers get closing cost rebates?",
                answer: "Yes, first-time homebuyers are eligible for land transfer tax rebates in most provinces. Ontario offers up to $4,000, British Columbia up to $8,000, and Toronto buyers can get an additional $4,475 municipal rebate. Our calculator automatically applies these rebates when you indicate you're a first-time buyer.",
              },
              {
                question: "Are closing costs different in each province?",
                answer: "Yes, land transfer tax rates vary significantly by province. Ontario, British Columbia, and Quebec have the highest rates, while Alberta and Saskatchewan have much lower fees. Some provinces like Manitoba and Nova Scotia also have provincial-specific transfer taxes. Use our calculator to see exact costs for your province.",
              },
              {
                question: "Can closing costs be added to my mortgage?",
                answer: "Generally no — closing costs must be paid upfront in cash. However, some lenders offer 'cash back' mortgages where you receive a lump sum at closing that can offset these costs. CMHC insurance cannot cover closing costs. It's important to budget for these expenses separately from your down payment.",
              },
            ]}
          />
        </div>

        <CalculatorRelatedTools currentTool="/tools/closing-costs-calculator" />


        <Footer />
      </main>
    </>
  );
}
