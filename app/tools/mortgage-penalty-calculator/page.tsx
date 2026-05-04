import { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MortgagePenaltyCalculator from "../../components/MortgagePenaltyCalculator";
import HowToSchema from "../../components/HowToSchema";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";
import CalculatorRelatedTools from "../../components/CalculatorRelatedTools";
import FAQSection from "../../components/FAQSection";

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

        <CalculatorRelatedTools currentTool="/tools/mortgage-penalty-calculator" />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <FAQSection
            faqs={[
              {
                question: "How is mortgage penalty calculated in Canada?",
                answer: "Canadian lenders calculate penalties using one of two methods: 3 months' interest or the Interest Rate Differential (IRD). You pay whichever is HIGHER. The IRD is the difference between your current rate and the rate the lender could charge today for the remaining term, multiplied by your balance and remaining term. Fixed-rate mortgages typically use IRD; variable-rate usually uses 3 months' interest.",
              },
              {
                question: "What's the difference between 3 months interest and IRD?",
                answer: "3 months' interest is simply your monthly interest payment × 3. IRD (Interest Rate Differential) is more complex: it's the difference between your mortgage rate and the lender's current posted rate for a term similar to your remaining term, multiplied by your mortgage balance and remaining time. IRD penalties are almost always much higher than 3 months' interest and can reach tens of thousands of dollars.",
              },
              {
                question: "Can I avoid paying a mortgage penalty?",
                answer: "Yes, in some situations: port your mortgage to a new property (same lender), blend and extend your rate, wait until your renewal date, or use prepayment privileges to reduce your balance before calculating the penalty. Some lenders also offer 'portable' mortgages that move with you. Always ask your lender about penalty-reduction options.",
              },
              {
                question: "Is it worth breaking my mortgage early?",
                answer: "It depends on your savings versus the penalty. Generally, if you can save more in interest over the remaining term than the penalty costs, it's worth it. For example, if your penalty is $5,000 but you'll save $8,000 in interest by switching to a lower rate, you come out ahead. Use our calculator to compare your exact numbers.",
              },
              {
                question: "Do all lenders charge the same penalties?",
                answer: "No, penalty calculations vary significantly between lenders. Some credit unions and monoline lenders use more favorable IRD formulas than big banks. Big banks often use 'posted rate' IRD calculations that result in much higher penalties. Always ask your lender for the exact penalty formula before signing. This can save you thousands if you need to break early.",
              },
            ]}
          />
        </div>

        <Footer />
      </main>
    </>
  );
}
