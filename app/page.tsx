"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import RateFilters from "./components/RateFilters";
import RateComparisonTable from "./components/RateComparisonTable";
import MortgageCalculator from "./components/MortgageCalculator";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import StructuredData from "./components/StructuredData";
import SocialShare from "./components/SocialShare";
import RateAlertForm from "./components/RateAlertForm";
import RateTrends from "./components/RateTrends";

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

// Calculate market stats for a rate category
function calcMarketStats(rateList: Rate[]) {
  if (rateList.length === 0) return null;
  const sorted = [...rateList].sort((a, b) => a.rate - b.rate);
  const lowest = sorted[0];
  const highest = sorted[sorted.length - 1];
  const avg = sorted.reduce((acc, r) => acc + r.rate, 0) / sorted.length;
  const spread = highest.rate - lowest.rate;
  
  return {
    top3: sorted.slice(0, 3),
    lowest,
    avg: avg.toFixed(2),
    count: sorted.length,
    spread: spread.toFixed(2),
  };
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

  // Get market stats for display
  const marketStats = useMemo(() => {
    const fixed5yr = (ratesData as Rate[])
      .filter(r => r.term_months === 60 && r.rate_type === "fixed" && r.mortgage_type === "uninsured");
    
    const variable5yr = (ratesData as Rate[])
      .filter(r => r.term_months === 60 && r.rate_type === "variable" && r.mortgage_type === "uninsured");

    return {
      fixed: calcMarketStats(fixed5yr),
      variable: calcMarketStats(variable5yr),
    };
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
    <main className="min-h-screen bg-slate-50">
      {/* JSON-LD Structured Data */}
      <StructuredData rates={ratesData as Rate[]} lastUpdated={lastUpdatedDate} />
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Latest Mortgage Rates Canada"
                  width={70}
                  height={70}
                  className="rounded-lg"
                  priority
                />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Latest Mortgage Rates Canada
                </h1>
                <p className="text-slate-500 text-sm max-w-xl">
                  Compare current rates from Canada's top lenders including Big 6 Banks and monoline lenders. Updated twice daily.
                </p>
              </div>
            </div>
            <Navigation currentPage="rates" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last updated: <LastUpdated /></span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Tracking {ratesData.length} rates from {lenders.length} lenders</span>
            </div>
          </div>
        </div>
      </header>

      {/* Today's Best Rates - Consolidated Section */}
      <div className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-lg font-medium text-slate-200 tracking-wide uppercase">Today's Best Mortgage Rates</h2>
            <p className="text-sm text-slate-400 mt-1 md:mt-0">Top lenders ranked by lowest rate</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fixed Rates Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-teal-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  5-Year Fixed Uninsured
                </h3>
                {marketStats.fixed && (
                  <span className="text-xs text-slate-400">{marketStats.fixed.count} lenders</span>
                )}
              </div>
              
              {/* Top 3 Rankings */}
              <div className="space-y-3">
                {marketStats.fixed?.top3.map((rate, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Link href={`/lenders/${rate.lender_slug}`} className="flex items-center gap-3 hover:opacity-80 transition">
                      <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shadow-lg ${
                        i === 0 ? 'rank-best' : i === 1 ? 'rank-good bg-teal-500 text-white shadow-teal-500/30' : 'rank-avg'
                      }`}>
                        {i + 1}
                      </div>
                      <span className="text-slate-100">{rate.lender_name}</span>
                    </Link>
                    <div className="text-right">
                      <span className="text-xl font-bold text-emerald-300">{rate.rate.toFixed(2)}%</span>
                      {rate.apr && <span className="text-xs text-slate-300 ml-2">APR {rate.apr}%</span>}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Market Context */}
              {marketStats.fixed && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Market Average</span>
                    <span className="text-slate-200 font-medium">{marketStats.fixed.avg}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-slate-400">Potential Savings</span>
                    <span className="text-emerald-300 font-medium">{marketStats.fixed.spread}%</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Variable Rates Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-teal-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  5-Year Variable Uninsured
                </h3>
                {marketStats.variable && (
                  <span className="text-xs text-slate-400">{marketStats.variable.count} lenders</span>
                )}
              </div>
              
              {/* Top 3 Rankings */}
              <div className="space-y-3">
                {marketStats.variable?.top3.map((rate, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Link href={`/lenders/${rate.lender_slug}`} className="flex items-center gap-3 hover:opacity-80 transition">
                      <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shadow-lg ${
                        i === 0 ? 'rank-best' : i === 1 ? 'rank-good bg-teal-500 text-white shadow-teal-500/30' : 'rank-avg'
                      }`}>
                        {i + 1}
                      </div>
                      <span className="text-slate-100">{rate.lender_name}</span>
                    </Link>
                    <div className="text-right">
                      <span className="text-xl font-bold text-teal-300">{rate.rate.toFixed(2)}%</span>
                      {rate.spread_to_prime && (
                        <span className="text-xs text-slate-300 ml-2">{rate.spread_to_prime}</span>
                      )}
                    </div>
                  </div>
                ))}
                {(!marketStats.variable || marketStats.variable.top3.length === 0) && (
                  <p className="text-slate-300 text-sm">No variable rates currently available</p>
                )}
              </div>
              
              {/* Market Context */}
              {marketStats.variable && marketStats.variable.top3.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Market Average</span>
                    <span className="text-slate-200 font-medium">{marketStats.variable.avg}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-slate-400">Potential Savings</span>
                    <span className="text-teal-300 font-medium">{marketStats.variable.spread}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rate Trends Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <RateTrends rates={ratesData as Rate[]} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 pb-12">
        {/* Filters */}
        <div className="mb-6">
          <RateFilters 
            onFilterChange={handleFilterChange}
            lenders={lenders}
          />
        </div>

        {/* Rate Table */}
        <div className="card-default overflow-hidden">
          <RateComparisonTable rates={filteredRates} />
        </div>

        {/* Download CSV Section */}
        <div className="mt-8 card-default p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Download Rate Data</h2>
              <p className="text-slate-500 text-sm">
                Download the complete rate dataset in CSV format for your own analysis.
              </p>
            </div>
            <a 
              href="/api/rates" 
              download="mortgage-rates.csv"
              className="btn-primary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download CSV
            </a>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="mt-8 card-default p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Share These Rates</h2>
              <p className="text-slate-500 text-sm">
                Found a great rate? Share it with friends and family.
              </p>
            </div>
            <SocialShare 
              url="https://latestmortgagerates.ca"
              title="Latest Mortgage Rates Canada"
              description={`Compare ${ratesData.length} mortgage rates from ${lenders.length} Canadian lenders. Best 5-year fixed: ${marketStats.fixed?.lowest.rate}% from ${marketStats.fixed?.lowest.lender_name}`}
            />
          </div>
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
