import Link from "next/link";

// Import rates data
import ratesData from "../../data/rates.json";

interface Rate {
  lender_name: string;
  lender_slug: string;
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type: string;
}

interface CityLendersSidebarProps {
  cityName: string;
  maxLenders?: number;
}

export default function CityLendersSidebar({ cityName, maxLenders = 6 }: CityLendersSidebarProps) {
  // Get best 5-year fixed rates from unique lenders
  const rates = (ratesData as Rate[])
    .filter((r) => r.term_months === 60 && r.rate_type === "fixed")
    .sort((a, b) => a.rate - b.rate);

  // Get unique lenders with their best rate
  const seen = new Set<string>();
  const bestRates = rates.filter((r) => {
    if (seen.has(r.lender_slug)) return false;
    seen.add(r.lender_slug);
    return true;
  }).slice(0, maxLenders);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"/>
        </svg>
        <h3 className="font-bold text-gray-900">Top Lenders in {cityName}</h3>
      </div>

      <p className="text-sm text-gray-500 mb-4">Best 5-year fixed rates available today</p>

      <div className="space-y-3">
        {bestRates.map((rate) => (
          <Link
            key={rate.lender_slug}
            href={`/lenders/${rate.lender_slug}`}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900 group-hover:text-teal-700 text-sm">{rate.lender_name}</p>
              <p className="text-xs text-gray-500">{rate.mortgage_type === "insured" ? "Insured" : "Uninsured"}</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-600">{rate.rate.toFixed(2)}%</span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-teal-600 hover:text-teal-700"
      >
        View All Lenders
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg>
      </Link>
    </div>
  );
}
