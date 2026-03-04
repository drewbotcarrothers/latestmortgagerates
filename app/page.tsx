"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RateFilters from "./components/RateFilters";
import RateComparisonTable from "./components/RateComparisonTable";
import MortgageCalculator from "./components/MortgageCalculator";
import RateStats from "./components/RateStats";

interface FilterState {
  term: string;
  rateType: string;
  mortgageType: string;
  lender: string;
}

interface Rate {
  lender_name: string;
  lender_slug: string;
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type: string;
  apr?: string | null;
  posted_rate?: number | null;
  ltv_tier?: string | null;
  spread_to_prime?: string | null;
  source_url: string;
}

// Import rates from JSON file
import ratesData from "../data/rates.json";

// Static date component to avoid hydration mismatch
function CurrentDate() {
  const [date, setDate] = useState<string>("");
  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-CA'));
  }, []);
  return <span>{date || "-"}</span>;
}

function CurrentDateTime() {
  const [date, setDate] = useState<string>("");
  useEffect(() => {
    setDate(new Date().toLocaleString('en-CA'));
  }, []);
  return <span>{date || "-"}</span>;
}

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    term: "all",
    rateType: "all",
    mortgageType: "all",
    lender: "all",
  });

  // Get unique lenders for filter dropdown
  const lenders = useMemo(() => {
    const uniqueLenders = [...new Set((ratesData as Rate[]).map(r => r.lender_slug))];
    return uniqueLenders.sort();
  }, []);

  // Filter rates based on current filters
  const filteredRates = useMemo(() => {
    return (ratesData as Rate[]).filter((rate) => {
      if (filters.term !== "all" && rate.term_months !== parseInt(filters.term)) return false;
      if (filters.rateType !== "all" && rate.rate_type !== filters.rateType) return false;
      if (filters.mortgageType !== "all" && rate.mortgage_type !== filters.mortgageType) return false;
      if (filters.lender !== "all" && rate.lender_slug !== filters.lender) return false;
      return true;
    });
  }, [filters]);

  // Get top rates for display
  const topRates = useMemo(() => {
    const fiveYearFixed = (ratesData as Rate[])
      .filter(r => r.term_months === 60 && r.rate_type === "fixed" && r.mortgage_type === "uninsured")
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 3);
    
    const fiveYearVariable = (ratesData as Rate[])
      .filter(r => r.term_months === 60 && r.rate_type === "variable" && r.mortgage_type === "uninsured")
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 3);

    return { fixed5yr: fiveYearFixed, variable5yr: fiveYearVariable };
  }, []);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      term: "all",
      rateType: "all",
      mortgageType: "all",
      lender: "all",
    });
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Latest Mortgage Rates Canada
              </h1>
              <p className="text-gray-600 mt-2">
                Compare current rates from Big 5 banks and monoline lenders
              </p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>Rates updated: <CurrentDate /></div>
              <div>{ratesData.length} rates from {lenders.length} lenders</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Top Rates */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold mb-4">Top Rates Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">5-Year Fixed Uninsured</h3>
              <div className="space-y-2">
                {topRates.fixed5yr.map((rate, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Link href={`/lenders/${rate.lender_slug}`} className="flex items-center gap-2 hover:opacity-80 transition">
                      <div className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                        rate.lender_slug === 'nesto' ? 'bg-emerald-500 text-white' :
                        rate.lender_slug === 'tangerine' ? 'bg-orange-500 text-white' :
                        rate.lender_slug === 'cibc' ? 'bg-red-600 text-white' :
                        rate.lender_slug === 'rbc' ? 'bg-blue-700 text-yellow-400' :
                        rate.lender_slug === 'bmo' ? 'bg-red-700 text-white' :
                        rate.lender_slug === 'td' ? 'bg-green-600 text-white' :
                        rate.lender_slug === 'scotiabank' ? 'bg-red-500 text-white' :
                        'bg-gray-400 text-white'
                      }`}>
                        {rate.lender_slug === 'td' ? 'TD' : rate.lender_slug.charAt(0).toUpperCase()}
                      </div>
                      <span className="hover:underline">{rate.lender_name}</span>
                    </Link>
                    <span className="text-2xl font-bold">{rate.rate.toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">5-Year Variable Uninsured</h3>
              <div className="space-y-2">
                {topRates.variable5yr.map((rate, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Link href={`/lenders/${rate.lender_slug}`} className="flex items-center gap-2 hover:opacity-80 transition">
                      <div className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                        rate.lender_slug === 'nesto' ? 'bg-emerald-500 text-white' :
                        rate.lender_slug === 'tangerine' ? 'bg-orange-500 text-white' :
                        rate.lender_slug === 'cibc' ? 'bg-red-600 text-white' :
                        rate.lender_slug === 'rbc' ? 'bg-blue-700 text-yellow-400' :
                        rate.lender_slug === 'bmo' ? 'bg-red-700 text-white' :
                        rate.lender_slug === 'td' ? 'bg-green-600 text-white' :
                        rate.lender_slug === 'scotiabank' ? 'bg-red-500 text-white' :
                        'bg-gray-400 text-white'
                      }`}>
                        {rate.lender_slug === 'td' ? 'TD' : rate.lender_slug.charAt(0).toUpperCase()}
                      </div>
                      <span className="hover:underline">{rate.lender_name}</span>
                    </Link>
                    <span className="text-2xl font-bold">{rate.rate.toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <MortgageCalculator />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            
            {/* Statistics */}
            <RateStats rates={ratesData as Rate[]} />

            {/* Filters */}
            <RateFilters onFilterChange={handleFilterChange} lenders={lenders} />

            {/* Results Count & Reset */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600">
                Showing {filteredRates.length} of {ratesData.length} rates
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded hover:bg-blue-50"
              >
                Reset Filters
              </button>
            </div>

            {/* Rate Comparison Table */}
            <RateComparisonTable rates={filteredRates} />

            {/* Footer Info */}
            <footer className="mt-12 text-center text-sm text-gray-500">
              <p>Rates are for comparison purposes only. Actual rates may vary based on your specific situation.</p>
              <p className="mt-2">Data sources: RBC, TD, BMO, Scotiabank, CIBC, nesto, Tangerine</p>
              <p className="mt-2 text-xs">Last updated: <CurrentDateTime /></p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
