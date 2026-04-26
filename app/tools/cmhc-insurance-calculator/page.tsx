import { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CMHCCalculator from "../../components/CMHCCalculator";
import HowToSchema from "../../components/HowToSchema";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";
import GuideCTA from "../../components/GuideCTA";

export const metadata: Metadata = {
  title: "CMHC Mortgage Insurance Calculator Canada | Premium Rates 2024",
  description: "Calculate your CMHC mortgage insurance premium. See how your down payment affects insurance costs. Updated with 2024 CMHC premium rates for Canada.",
  keywords: "CMHC calculator, mortgage insurance calculator Canada, CMHC premium rates, mortgage default insurance, high ratio mortgage calculator",
  alternates: {
    canonical: "https://latestmortgagerates.ca/tools/cmhc-insurance-calculator",
  },
  openGraph: {
    title: "CMHC Mortgage Insurance Calculator Canada | Premium Rates 2024",
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

        <Footer />
      </main>
    </>
  );
}
