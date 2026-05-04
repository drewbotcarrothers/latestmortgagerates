import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";
import FAQSection from "../../components/FAQSection";
import CalculatorRelatedTools from "../../components/CalculatorRelatedTools";
import ratesData from "../../../data/rates.json";

export const dynamic = "force-static";

interface Rate {
  lender_name: string;
  lender_slug: string;
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type: string;
}

const filteredRates = (ratesData as Rate[]).filter((r) => r.mortgage_type === "uninsured");

const bestFixed5yr = filteredRates
  .filter((r) => r.term_months === 60 && r.rate_type === "fixed")
  .sort((a, b) => a.rate - b.rate)[0];

const bestVariable5yr = filteredRates
  .filter((r) => r.term_months === 60 && r.rate_type === "variable")
  .sort((a, b) => a.rate - b.rate)[0];

const avgRate = filteredRates.length > 0
  ? (filteredRates.reduce((sum, r) => sum + r.rate, 0) / filteredRates.length).toFixed(2)
  : "N/A";

export const metadata: Metadata = {
  title: "Uninsured Mortgage Rates Canada | 20%+ Down Payment Rates",
  description: `Compare uninsured mortgage rates in Canada. Best 5-year fixed: ${bestFixed5yr?.rate.toFixed(2) || "N/A"}%, best variable: ${bestVariable5yr?.rate.toFixed(2) || "N/A"}%. For conventional mortgages with 20%+ down.`,
  keywords: "uninsured mortgage rates canada, conventional mortgage rates, 20 down payment rates, no cmhc mortgage",
  alternates: {
    canonical: "https://latestmortgagerates.ca/rates/uninsured",
  },
  openGraph: {
    title: "Uninsured Mortgage Rates Canada | 20%+ Down Payment",
    description: `Best uninsured rates: ${bestFixed5yr?.rate.toFixed(2) || "N/A"}% fixed, ${bestVariable5yr?.rate.toFixed(2) || "N/A"}% variable. No CMHC required.`,
    type: "website",
    url: "https://latestmortgagerates.ca/rates/uninsured",
    locale: "en_CA",
  },
  twitter: {
    card: "summary",
    title: "Uninsured Mortgage Rates",
    description: `Best: ${bestFixed5yr?.rate.toFixed(2) || "N/A"}% fixed. No CMHC insurance needed.`,
  },
  robots: { index: true, follow: true },
};

export default function UninsuredRatesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://latestmortgagerates.ca" },
          { name: "Uninsured Rates" },
        ]}
      />

      <main className="min-h-screen bg-slate-50">
        <Header currentPage="rates" />

        <div className="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-emerald-300 mb-4">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span>Uninsured Rates</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Uninsured Mortgage Rates Canada
              </h1>
              <p className="text-xl text-slate-300">
                Best rates for conventional mortgages with 20% or more down payment. No CMHC insurance required. Compare {new Set(filteredRates.map((r) => r.lender_slug)).size}+ lenders.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-600">Best 5-Year Fixed</p>
              <p className="text-3xl font-bold text-emerald-600">{bestFixed5yr?.rate.toFixed(2) || "N/A"}%</p>
              <p className="text-sm text-slate-500">{bestFixed5yr?.lender_name || "Various lenders"}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-600">Best 5-Year Variable</p>
              <p className="text-3xl font-bold text-emerald-600">{bestVariable5yr?.rate.toFixed(2) || "N/A"}%</p>
              <p className="text-sm text-slate-500">{bestVariable5yr?.lender_name || "Various lenders"}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-600">Average Rate</p>
              <p className="text-3xl font-bold text-slate-700">{avgRate}%</p>
              <p className="text-sm text-slate-500">Across {filteredRates.length} rates</p>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Compare all mortgage types</h2>
                <p className="text-slate-600">See insured, uninsured, fixed, and variable side by side.</p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
              >
                Full Comparison →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Current Uninsured Rates</h2>
              <span className="text-sm text-slate-500">{filteredRates.length} rates found</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Lender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Term</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRates.slice(0, 20).map((rate, i) => (
                    <tr key={`${rate.lender_slug}-${rate.term_months}-${rate.rate_type}-${i}`} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{rate.lender_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{rate.term_months / 12}-Year</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{rate.rate_type === "fixed" ? "Fixed" : "Variable"}</td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">{rate.rate.toFixed(2)}%</td>
                      <td className="px-6 py-4 text-sm">
                        <Link href={`/lenders/${rate.lender_slug}`} className="text-emerald-600 hover:text-emerald-700 font-medium">
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <FAQSection
            faqs={[
              {
                question: "What is an uninsured (conventional) mortgage?",
                answer: "An uninsured mortgage requires at least 20% down payment. You don't pay CMHC insurance premiums, and you can amortize up to 30 years instead of 25. These mortgages offer more flexibility for refinancing and accessing home equity.",
              },
              {
                question: "Why are uninsured rates higher than insured rates?",
                answer: "Uninsured rates are typically 0.2-0.5% higher because the lender takes on more risk without insurance protection. However, you save the CMHC premium (0.6-4.0% of the mortgage), which often outweighs the slightly higher rate.",
              },
              {
                question: "Should I put 20% down to avoid CMHC?",
                answer: "It depends. With 20% down you avoid CMHC premiums (~$10,000-$20,000 savings) and get a 30-year amortization option. But if you only have exactly 20%, keeping some cash for emergencies or investments may be smarter. Run the numbers with our calculators.",
              },
              {
                question: "Can I switch from insured to uninsured?",
                answer: "Yes, once you have 20% equity, you can refinance to an uninsured mortgage at renewal. This removes CMHC restrictions and may give you better terms. However, you'll face the then-current interest rates and closing costs.",
              },
              {
                question: "What are the benefits of an uninsured mortgage?",
                answer: "Benefits include: no CMHC premiums, 30-year amortization (lower payments), easier refinancing, ability to access up to 80% of home equity (vs. 65% for insured), and no insurance restrictions on property type or use.",
              },
            ]}
          />

          <CalculatorRelatedTools currentTool="/rates/uninsured" />
        </div>

        <Footer />
      </main>
    </>
  );
}
