import { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MortgagePenaltyCalculator from "../../components/MortgagePenaltyCalculator";
import HowToSchema from "../../components/HowToSchema";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Mortgage Penalty Calculator Canada | Break Fee Estimator",
  description: "Calculate your mortgage penalty for breaking early. Estimate 3-month interest or IRD penalties for fixed and variable rate mortgages in Canada.",
  keywords: "mortgage penalty calculator Canada, break mortgage penalty, IRD calculator, 3 months interest penalty, mortgage break fee",
  alternates: {
    canonical: "https://latestmortgagerates.ca/tools/mortgage-penalty-calculator",
  },
  openGraph: {
    title: "Mortgage Penalty Calculator Canada | Break Fee Estimator",
    description: "Estimate your mortgage penalty for breaking early. Calculate 3-month interest or IRD penalties.",
    url: "https://latestmortgagerates.ca/tools/mortgage-penalty-calculator",
    siteName: "Latest Mortgage Rates Canada",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortgage Penalty Calculator Canada",
    description: "Calculate mortgage break penalties",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function MortgagePenaltyPage() {
  return (
    <>
      <HowToSchema
        name="How to Calculate Mortgage Penalty"
        description="Calculate your mortgage penalty for breaking your mortgage contract early"
        totalTime="PT3M"
        steps={[
          {
            name: "Enter Mortgage Details",
            text: "Input your current mortgage balance, rate, and original amount.",
          },
          {
            name: "Select Rate Type",
            text: "Choose fixed or variable rate (affects penalty calculation).",
          },
          {
            name: "Enter Comparison Rate",
            text: "Input current posted rate for IRD calculation (fixed only).",
          },
          {
            name: "View Penalty",
            text: "See your estimated penalty and which calculation method applies.",
          },
        ]}
      />
      
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Mortgage Penalty Calculator" },
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
                <span>Penalty Calculator</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Mortgage Penalty Calculator</h1>
              <p className="text-xl text-slate-300">Calculate your mortgage penalty for breaking early.</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <MortgagePenaltyCalculator />
        </div>

        <Footer />
      </main>
    </>
  );
}
