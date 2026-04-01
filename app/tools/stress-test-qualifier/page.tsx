import { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import StressTestQualifier from "../../components/StressTestQualifier";
import HowToSchema from "../../components/HowToSchema";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";

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
              <p className="text-xl text-slate-300">Check if you qualify under Canada's mortgage stress test rules.</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <StressTestQualifier />
        </div>

        <Footer />
      </main>
    </>
  );
}
