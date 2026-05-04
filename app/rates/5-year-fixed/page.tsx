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
  apr?: string | null;
  posted_rate?: number | null;
}

const filteredRates = (ratesData as Rate[]).filter(
  (r) => r.term_months === 60 && r.rate_type === "fixed"
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
  title: "5-Year Fixed Mortgage Rates Canada | Best Rates & Comparison",
  description: `Compare the best 5-year fixed mortgage rates in Canada. Best uninsured: ${bestUninsured?.rate.toFixed(2) || "N/A"}%, best insured: ${bestInsured?.rate.toFixed(2) || "N/A"}%. Updated daily from 30+ lenders.`,
  keywords: "5 year fixed mortgage rates canada, 5 year fixed rates, best 5 year mortgage, fixed rate comparison",
  alternates: {
    canonical: "https://latestmortgagerates.ca/rates/5-year-fixed",
  },
  openGraph: {
    title: "5-Year Fixed Mortgage Rates Canada | Best Rates & Comparison",
    description: `Best 5-year fixed: ${bestUninsured?.rate.toFixed(2) || "N/A"}% uninsured, ${bestInsured?.rate.toFixed(2) || "N/A"}% insured. Compare 30+ Canadian lenders.`,
    type: "website",
    url: "https://latestmortgagerates.ca/rates/5-year-fixed",
    locale: "en_CA",
  },
  twitter: {
    card: "summary",
    title: "5-Year Fixed Rates Canada",
    description: `Best: ${bestUninsured?.rate.toFixed(2) || "N/A"}% (uninsured). Compare 30+ lenders.`,
  },
  robots: { index: true, follow: true },
};

export default function FiveYearFixedPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://latestmortgagerates.ca" },
          { name: "5-Year Fixed Rates" },
        ]}
      />

      <main className="min-h-screen bg-slate-50">
        <Header currentPage="rates" />

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-teal-300 mb-4">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span>5-Year Fixed Rates</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                5-Year Fixed Mortgage Rates Canada
              </h1>
              <p className="text-xl text-slate-300">
                Compare the best 5-year fixed rates from {new Set(filteredRates.map((r) => r.lender_slug)).size}+ Canadian lenders. Updated daily.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-600">Best Uninsured Rate</p>
              <p className="text-3xl font-bold text-teal-600">{bestUninsured?.rate.toFixed(2) || "N/A"}%</p>
              <p className="text-sm text-slate-500">{bestUninsured?.lender_name || "Various lenders"}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-600">Best Insured Rate</p>
              <p className="text-3xl font-bold text-teal-600">{bestInsured?.rate.toFixed(2) || "N/A"}%</p>
              <p className="text-sm text-slate-500">{bestInsured?.lender_name || "Various lenders"}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-600">Average Rate</p>
              <p className="text-3xl font-bold text-slate-700">{avgRate}%</p>
              <p className="text-sm text-slate-500">Across {filteredRates.length} rates</p>
            </div>
          </div>

          {/* Full Comparison CTA */}
          <div className="bg-teal-50 rounded-lg border border-teal-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Want to compare all rates?</h2>
                <p className="text-slate-600">See our full comparison with filters, lender details, and more.</p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
              >
                Compare All Rates →
              </Link>
            </div>
          </div>

          {/* Rate Table */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Current 5-Year Fixed Rates</h2>
              <span className="text-sm text-slate-500">{filteredRates.length} rates found</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Lender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Rate</th>
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
                      <td className="px-6 py-4 text-sm font-bold text-teal-600">{rate.rate.toFixed(2)}%</td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/lenders/${rate.lender_slug}`}
                          className="text-teal-600 hover:text-teal-700 font-medium"
                        >
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
                question: "What is the current best 5-year fixed mortgage rate in Canada?",
                answer: `The best 5-year fixed rate is currently ${bestUninsured?.rate.toFixed(2) || "around 4.0"}% for uninsured mortgages from ${bestUninsured?.lender_name || "various lenders"}, and ${bestInsured?.rate.toFixed(2) || "around 3.5"}% for insured mortgages from ${bestInsured?.lender_name || "various lenders"}. Rates change daily, so check back often.`,
              },
              {
                question: "Should I choose a 5-year fixed rate now?",
                answer: "A 5-year fixed rate provides payment stability for 5 years. It's ideal if you want budgeting certainty and believe rates may rise. Currently, fixed rates are competitive with variable rates, making them attractive for risk-averse borrowers.",
              },
              {
                question: "What is the difference between insured and uninsured 5-year fixed rates?",
                answer: "Insured rates are for mortgages with less than 20% down payment (requiring CMHC insurance). They are typically 0.2-0.5% lower than uninsured rates because the lender has protection against default. Uninsured rates are for mortgages with 20%+ down payment.",
              },
              {
                question: "Can I break a 5-year fixed mortgage early?",
                answer: "Yes, but you'll pay a prepayment penalty. For fixed-rate mortgages, this is typically the greater of 3 months' interest or the Interest Rate Differential (IRD). Use our Penalty Calculator to estimate your cost.",
              },
              {
                question: "How do I qualify for the best 5-year fixed rate?",
                answer: "To get the best rate: have good credit (680+), stable income, low debt-to-income ratios (GDS ≤ 39%, TDS ≤ 44%), and 20%+ down payment (for uninsured rates). Shop with multiple lenders or use a mortgage broker.",
              },
            ]}
          />

          <CalculatorRelatedTools currentTool="/rates/5-year-fixed" />
        </div>

        <Footer />
      </main>
    </>
  );
}
