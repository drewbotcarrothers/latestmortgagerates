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

const filteredRates = (ratesData as Rate[]).filter((r) => r.mortgage_type === "insured");

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
  title: "Insured Mortgage Rates Canada | High-Ratio & CMHC Rates",
  description: `Compare insured mortgage rates in Canada. Best 5-year fixed: ${bestFixed5yr?.rate.toFixed(2) || "N/A"}%, best variable: ${bestVariable5yr?.rate.toFixed(2) || "N/A"}%. For down payments under 20%.`,
  keywords: "insured mortgage rates canada, high ratio mortgage rates, cmhc rates, low down payment mortgage",
  alternates: {
    canonical: "https://latestmortgagerates.ca/rates/insured",
  },
  openGraph: {
    title: "Insured Mortgage Rates Canada | High-Ratio & CMHC Rates",
    description: `Best insured rates: ${bestFixed5yr?.rate.toFixed(2) || "N/A"}% fixed, ${bestVariable5yr?.rate.toFixed(2) || "N/A"}% variable. For under 20% down.`,
    type: "website",
    url: "https://latestmortgagerates.ca/rates/insured",
    locale: "en_CA",
  },
  twitter: {
    card: "summary",
    title: "Insured Mortgage Rates",
    description: `Best: ${bestFixed5yr?.rate.toFixed(2) || "N/A"}% fixed. For down payments under 20%.`,
  },
  robots: { index: true, follow: true },
};

export default function InsuredRatesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://latestmortgagerates.ca" },
          { name: "Insured Rates" },
        ]}
      />

      <main className="min-h-screen bg-slate-50">
        <Header currentPage="rates" />

        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-blue-300 mb-4">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span>Insured Rates</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Insured Mortgage Rates Canada
              </h1>
              <p className="text-xl text-slate-300">
                Best rates for mortgages with less than 20% down payment. Compare high-ratio and CMHC-insured rates from {new Set(filteredRates.map((r) => r.lender_slug)).size}+ lenders.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-600">Best 5-Year Fixed</p>
              <p className="text-3xl font-bold text-blue-600">{bestFixed5yr?.rate.toFixed(2) || "N/A"}%</p>
              <p className="text-sm text-slate-500">{bestFixed5yr?.lender_name || "Various lenders"}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-600">Best 5-Year Variable</p>
              <p className="text-3xl font-bold text-blue-600">{bestVariable5yr?.rate.toFixed(2) || "N/A"}%</p>
              <p className="text-sm text-slate-500">{bestVariable5yr?.lender_name || "Various lenders"}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-600">Average Insured Rate</p>
              <p className="text-3xl font-bold text-slate-700">{avgRate}%</p>
              <p className="text-sm text-slate-500">Across {filteredRates.length} rates</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Compare all mortgage types</h2>
                <p className="text-slate-600">See insured, uninsured, fixed, and variable side by side.</p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Full Comparison →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Current Insured Rates</h2>
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
                      <td className="px-6 py-4 text-sm font-bold text-blue-600">{rate.rate.toFixed(2)}%</td>
                      <td className="px-6 py-4 text-sm">
                        <Link href={`/lenders/${rate.lender_slug}`} className="text-blue-600 hover:text-blue-700 font-medium">
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
                question: "What is an insured mortgage?",
                answer: "An insured mortgage (also called high-ratio) is required when your down payment is less than 20% of the purchase price. You pay mortgage default insurance (CMHC, Sagen, or Canada Guaranty) to protect the lender. The insurance premium is typically added to your mortgage balance.",
              },
              {
                question: "Why are insured rates lower than uninsured rates?",
                answer: "Insured rates are 0.2-0.5% lower because the lender faces less risk. If you default, the insurer pays the lender. This government-backed protection allows lenders to offer better rates on insured mortgages.",
              },
              {
                question: "How much is CMHC insurance?",
                answer: "CMHC premiums range from 0.6% to 4.0% of your mortgage amount, depending on your down payment percentage. With 5% down, you pay 4.0%. With 15% down, you pay 2.8%. The premium is usually added to your mortgage and paid over the life of the loan.",
              },
              {
                question: "Can I get rid of mortgage insurance?",
                answer: "Yes — once you have 20% equity in your home, you can refinance to an uninsured mortgage. However, you'll pay closing costs and may face a higher interest rate. The savings on insurance premiums need to outweigh these costs.",
              },
              {
                question: "Do I qualify for an insured mortgage?",
                answer: "To qualify: minimum 5% down payment (10% for homes $500k-$999k, 20% for $1M+), credit score 600+, maximum amortization 25 years, GDS ≤ 39%, TDS ≤ 44%, and the home must be your primary residence.",
              },
            ]}
          />

          <CalculatorRelatedTools currentTool="/rates/insured" />
        </div>

        <Footer />
      </main>
    </>
  );
}
