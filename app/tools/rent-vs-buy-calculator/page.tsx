import { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RentVsBuyCalculator from "../../components/RentVsBuyCalculator";
import HowToSchema from "../../components/HowToSchema";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator Canada | Should You Buy or Rent?",
  description: "Compare the financial impact of renting vs buying a home in Canada. See your break-even point and long-term net worth with each option.",
  keywords: "rent vs buy calculator Canada, should I buy or rent, rent vs buy analysis, home buying vs renting",
  alternates: {
    canonical: "https://latestmortgagerates.ca/tools/rent-vs-buy-calculator",
  },
  openGraph: {
    title: "Rent vs Buy Calculator Canada | Should You Buy or Rent?",
    description: "Compare renting vs buying. See your break-even point and which builds more wealth.",
    url: "https://latestmortgagerates.ca/tools/rent-vs-buy-calculator",
    siteName: "Latest Mortgage Rates Canada",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rent vs Buy Calculator Canada",
    description: "Compare renting vs buying a home",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function RentVsBuyPage() {
  return (
    <>
      <HowToSchema
        name="How to Compare Rent vs Buy"
        description="Compare the financial impact of renting versus buying a home over time"
        totalTime="PT5M"
        steps={[
          {
            name: "Enter Monthly Rent",
            text: "Input your current or expected monthly rent payment.",
          },
          {
            name: "Enter Home Purchase Details",
            text: "Input purchase price, down payment, and mortgage rate.",
          },
          {
            name: "Set Appreciation Rates",
            text: "Estimate home appreciation and investment returns.",
          },
          {
            name: "Compare Results",
            text: "See break-even point and which option builds more wealth.",
          },
        ]}
      />
      
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Rent vs Buy Calculator" },
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
                <span>Rent vs Buy Calculator</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Rent vs Buy Calculator</h1>
              <p className="text-xl text-slate-300">Compare the financial impact of renting vs buying a home.</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <RentVsBuyCalculator />
        </div>

        <Footer />
      </main>
    </>
  );
}
