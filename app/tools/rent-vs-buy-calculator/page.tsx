import { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RentVsBuyCalculator from "../../components/RentVsBuyCalculator";
import HowToSchema from "../../components/HowToSchema";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";
import CalculatorRelatedTools from "../../components/CalculatorRelatedTools";
import FAQSection from "../../components/FAQSection";

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

        <CalculatorRelatedTools currentTool="/tools/rent-vs-buy-calculator" />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <FAQSection
            faqs={[
              {
                question: "Is it better to rent or buy in Canada right now?",
                answer: "It depends on your local market, financial situation, and lifestyle. In many Canadian cities with high prices (Toronto, Vancouver), renting and investing the difference can build more wealth short-term. In more affordable markets (Calgary, Edmonton), buying often wins. Use our calculator with your specific numbers to see which option builds more wealth over your planned timeframe.",
              },
              {
                question: "What is the 5% rule for rent vs buy?",
                answer: "The 5% rule is a quick guideline: multiply your home's value by 5% and divide by 12. If your monthly rent is less than this amount, renting is likely better financially. For a $600,000 home: $600,000 × 5% = $30,000/year ÷ 12 = $2,500/month. If you can rent for less than $2,500, renting may be the smarter choice.",
              },
              {
                question: "How long should I plan to stay in a home for buying to make sense?",
                answer: "Generally 5-7 years minimum. The break-even point depends on closing costs, mortgage penalties, maintenance, and appreciation. In the first few years, most of your mortgage payment goes to interest, not equity. If you might move within 3-4 years, renting is usually better due to transaction costs. Our calculator shows your exact break-even timeline.",
              },
              {
                question: "What hidden costs of homeownership should I consider?",
                answer: "Beyond mortgage payments, homeowners pay: property tax (0.5-2.5% of value annually), maintenance (1-3% of value annually), insurance ($800-2,000/year), utilities (often higher than rentals), condo fees (if applicable), and potential special assessments. These can add $500-1,500+ monthly on top of your mortgage. Our calculator includes these in the comparison.",
              },
              {
                question: "Can I build more wealth by renting and investing?",
                answer: "Often yes, if you invest the difference between renting and owning costs. For example, if owning costs $3,500/month and renting costs $2,200, investing the $1,300 difference at 7% annually builds significant wealth. However, this requires financial discipline to actually invest the savings. Homeownership forces savings through equity buildup. Our calculator compares both scenarios with investment returns.",
              },
            ]}
          />
        </div>

        <Footer />
      </main>
    </>
  );
}
