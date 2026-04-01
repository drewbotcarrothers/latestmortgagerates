import { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ClosingCostsCalculator from "../../components/ClosingCostsCalculator";
import HowToSchema from "../../components/HowToSchema";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";

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

        <Footer />
      </main>
    </>
  );
}
