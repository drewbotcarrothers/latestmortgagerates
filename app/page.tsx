"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RateFilters from "./components/RateFilters";
import RateComparisonTable from "./components/RateComparisonTable";
import MortgageCalculator from "./components/MortgageCalculator";
import RateStats from "./components/RateStats";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import StructuredData from "./components/StructuredData";
import SocialShare from "./components/SocialShare";
import RateAlertForm from "./components/RateAlertForm";

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
  scraped_at?: string;
}

// Import rates and metadata from JSON files
import ratesData from "../data/rates.json";
import metadata from "../data/metadata.json";

// Format the last updated date from metadata
function LastUpdated() {
  const [date, setDate] = useState<string>("");
  useEffect(() => {
    if (metadata?.last_updated) {
      const d = new Date(metadata.last_updated);
      setDate(d.toLocaleString('en-CA', { 
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));
    }
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

  // Get last updated date for structured data
  const lastUpdatedDate = metadata?.last_updated || new Date().toISOString();

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* JSON-LD Structured Data */}
      <StructuredData rates={ratesData as Rate[]} lastUpdated={lastUpdatedDate} />
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Latest Mortgage Rates Canada
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Compare current rates from Big 5 banks and monoline lenders
              </p>
            </div>
            <Navigation currentPage="rates" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last updated: <LastUpdated /></span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>{ratesData.length} rates from {lenders.length} lenders</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Top Rates */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white">
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
                        i === 0 ? 'bg-green-500' : i === 1 ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
                        {i + 1}
                      </div>
                      <span>{rate.lender_name}</span>
                    </Link>
                    <div className="text-right">
                      <span className="text-lg font-bold">{rate.rate}%</span>
                      {rate.apr && <span className="text-xs text-white/70 ml-1">APR {rate.apr}%</span>}
                    </div>
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
                        i === 0 ? 'bg-green-500' : i === 1 ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
                        {i + 1}
                      </div>
                      <span>{rate.lender_name}</span>
                    </Link>
                    <div className="text-right">
                      <span className="text-lg font-bold">{rate.rate}%</span>
                      {rate.spread_to_prime && (
                        <span className="text-xs text-white/70 ml-1">{rate.spread_to_prime}</span>
                      )}
                    </div>
                  </div>
                ))}
                {topRates.variable5yr.length === 0 && (
                  <p className="text-white/70 text-sm">No variable rates currently available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <RateStats rates={ratesData as Rate[]} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Filters */}
        <div className="mb-6">
          <RateFilters 
            onFilterChange={handleFilterChange}
            lenders={lenders}
          />
        </div>

        {/* Rate Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <RateComparisonTable rates={filteredRates} />
        </div>

        {/* Download CSV Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Download Rate Data</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Download the complete rate dataset in CSV format for your own analysis.
          </p>
          <a 
            href="/api/rates" 
            download="mortgage-rates.csv"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download CSV
          </a>
        </div>

        {/* Social Sharing */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Share These Rates</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Found a great rate? Share it with friends and family.
          </p>
          <SocialShare 
            url="https://latestmortgagerates.ca"
            title="Latest Mortgage Rates Canada"
            description={`Compare ${ratesData.length} mortgage rates from ${lenders.length} Canadian lenders. Best 5-year fixed: ${topRates.fixed5yr[0]?.rate}% from ${topRates.fixed5yr[0]?.lender_name}`}
          />
        </div>

        {/* Mortgage Calculator */}
        <div className="mt-8">
          <MortgageCalculator />
        </div>
      </div>

      {/* Rate Alert Subscription */}
      <RateAlertForm />

      <Footer />
    </main>
  );
}
