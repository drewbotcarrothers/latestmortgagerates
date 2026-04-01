import { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RefinanceCalculator from "../../components/RefinanceCalculator";
import HowToSchema from "../../components/HowToSchema";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";

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

        <Footer />
      </main>
    </>
  );
}
