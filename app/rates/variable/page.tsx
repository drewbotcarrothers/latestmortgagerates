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
  spread_to_prime?: string | null;
}

const filteredRates = (ratesData as Rate[]).filter(
  (r) => r.term_months === 60 && r.rate_type === "variable"
);

const bestUninsured = filteredRates
  .filter((r) => r.mortgage_type === "uninsured")
  .sort((a, b) => a.rate - b.rate)[0];

const bestInsured = filteredRates
  .filter((r) => r.mortgage_type === "insured")
  .sort((a, b) => a.rate - b.rate)[0];

const avgRate = filteredRates.length > 0
  ? (filteredRates.reduce((sum, r) => sum + r.rate, 0) / filteredRates.length).toFixed(2)
  : "N/A";

export const metadata: Metadata = {
  title: "5-Year Variable Mortgage Rates Canada | Prime - Discount",
  description: `Compare the best 5-year variable mortgage rates in Canada. Best uninsured: ${bestUninsured?.rate.toFixed(2) || "N/A"}%, best insured: ${bestInsured?.rate.toFixed(2) || "N/A"}%. Prime-based rates updated daily.`,
  keywords: "variable mortgage rates canada, 5 year variable rates, prime minus mortgage, floating rate comparison",
  alternates: {
    canonical: "https://latestmortgagerates.ca/rates/variable",
  },
  openGraph: {
    title: "5-Year Variable Mortgage Rates Canada | Prime - Discount",
    description: `Best 5-year variable: ${bestUninsured?.rate.toFixed(2) || "N/A"}% uninsured, ${bestInsured?.rate.toFixed(2) || "N/A"}% insured. Compare prime-based rates.`,
    type: "website",
    url: "https://latestmortgagerates.ca/rates/variable",
    locale: "en_CA",
  },
  twitter: {
    card: "summary",
    title: "Variable Rates Canada",
    description: `Best: ${bestUninsured?.rate.toFixed(2) || "N/A"}% (uninsured). Prime-based rates.`,
  },
  robots: { index: true, follow: true },
};

export default function VariableRatesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://latestmortgagerates.ca" },
          { name: "Variable Rates" },
        ]}
      />

      <main className="min-h-screen bg-slate-50">
        <Header currentPage="rates" />

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-emerald-300 mb-4">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span>Variable Rates</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                5-Year Variable Mortgage Rates Canada
              </h1>
              <p className="text-xl text-slate-300">
                Compare prime-based variable rates from {new Set(filteredRates.map((r) => r.lender_slug)).size}+ Canadian lenders. Rates move with the Bank of Canada.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-600">Best Uninsured</p>
              <p className="text-3xl font-bold text-emerald-600">{bestUninsured?.rate.toFixed(2) || "N/A"}%</p>
              <p className="text-sm text-slate-500">{bestUninsured?.lender_name || "Various lenders"}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-600">Best Insured</p>
              <p className="text-3xl font-bold text-emerald-600">{bestInsured?.rate.toFixed(2) || "N/A"}%</p>
              <p className="text-sm text-slate-500">{bestInsured?.lender_name || "Various lenders"}</p>
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
                <h2 className="text-xl font-bold text-slate-900">Compare all rate types</h2>
                <p className="text-slate-600">See fixed, variable, and all terms side by side.</p>
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
              <h2 className="text-lg font-semibold text-slate-900">Current Variable Rates</h2>
              <span className="text-sm text-slate-500">{filteredRates.length} rates found</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Lender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Spread to Prime</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRates.slice(0, 20).map((rate, i) => (
                    <tr key={`${rate.lender_slug}-${rate.mortgage_type}-${i}`} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{rate.lender_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${rate.mortgage_type === "insured" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"}`}>
                          {rate.mortgage_type === "insured" ? "Insured" : "Uninsured"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">{rate.rate.toFixed(2)}%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{rate.spread_to_prime || "N/A"}</td>
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
                question: "What is a variable mortgage rate?",
                answer: "A variable rate mortgage has an interest rate that fluctuates with your lender's prime rate. When the Bank of Canada changes its overnight rate, lenders adjust their prime rate, which affects your mortgage rate. Your payment typically stays the same, but the amount going to principal vs. interest changes.",
              },
              {
                question: "Should I choose variable or fixed in 2026?",
                answer: "Variable rates are currently competitive with fixed rates and offer potential savings if rates fall further. However, they carry risk if rates rise. Fixed rates provide payment certainty. The choice depends on your risk tolerance and financial stability.",
              },
              {
                question: "What does 'Prime - 1.05%' mean?",
                answer: "It means your mortgage rate is 1.05 percentage points below the lender's prime rate. If prime is 5.45%, your rate would be 4.40%. The discount (or 'spread') is locked in for your term, but the actual rate moves with prime.",
              },
              {
                question: "How often do variable rates change?",
                answer: "Variable rates change whenever the Bank of Canada adjusts its overnight target rate, which happens at 8 predetermined dates per year. Between these dates, rates typically stay stable. Lenders usually pass rate changes through within 1-2 business days.",
              },
              {
                question: "What happens if I break a variable mortgage early?",
                answer: "Variable mortgages typically have lower penalties than fixed. The standard penalty is 3 months' interest (not the higher IRD calculation). This makes variable mortgages more flexible if you might sell, refinance, or move before the term ends.",
              },
            ]}
          />

          <CalculatorRelatedTools currentTool="/rates/variable" />
        </div>

        <Footer />
      </main>
    </>
  );
}
