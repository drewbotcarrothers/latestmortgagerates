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
    const fixed5yrUninsured = (ratesData as Rate[])
      .filter(r => r.term_months === 60 && r.rate_type === "fixed" && r.mortgage_type === "uninsured");
    
    const fixed5yrInsured = (ratesData as Rate[])
      .filter(r => r.term_months === 60 && r.rate_type === "fixed" && r.mortgage_type === "insured");
    
    const variable5yrUninsured = (ratesData as Rate[])
      .filter(r => r.term_months === 60 && r.rate_type === "variable" && r.mortgage_type === "uninsured");

    const variable5yrInsured = (ratesData as Rate[])
      .filter(r => r.term_months === 60 && r.rate_type === "variable" && r.mortgage_type === "insured");

    return {
      fixedUninsured: calcMarketStats(fixed5yrUninsured),
      fixedInsured: calcMarketStats(fixed5yrInsured),
      variableUninsured: calcMarketStats(variable5yrUninsured),
      variableInsured: calcMarketStats(variable5yrInsured),
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Fixed Insured Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-teal-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  5-Year Fixed
                </h3>
                <span className="text-xs text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">Insured</span>
              </div>
              {marketStats.fixedInsured?.top3.length ? (
                <div className="space-y-2">
                  {marketStats.fixedInsured.top3.map((rate, i) => (
                    <Link key={i} href={`/lenders/${rate.lender_slug}`} className="flex items-center justify-between hover:opacity-80 transition">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          i === 0 ? 'bg-emerald-500 text-white' : 'bg-white/20 text-slate-300'
                        }`}>{i + 1}</span>
                        <span className="text-slate-100 text-sm truncate">{rate.lender_name}</span>
                      </div>
                      <span className={`font-bold ${i === 0 ? 'text-emerald-300 text-lg' : 'text-slate-200'}`}>{rate.rate.toFixed(2)}%</span>
                    </Link>
                  ))}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10 mt-2">
                    <span>{marketStats.fixedInsured.count} lenders</span>
                    <span>Avg {marketStats.fixedInsured.avg}%</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-300 text-sm">No rates available</p>
              )}
            </div>

            {/* Fixed Uninsured Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-teal-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  5-Year Fixed
                </h3>
                <span className="text-xs text-slate-300 bg-slate-500/20 px-2 py-0.5 rounded">Uninsured</span>
              </div>
              {marketStats.fixedUninsured?.top3.length ? (
                <div className="space-y-2">
                  {marketStats.fixedUninsured.top3.map((rate, i) => (
                    <Link key={i} href={`/lenders/${rate.lender_slug}`} className="flex items-center justify-between hover:opacity-80 transition">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          i === 0 ? 'bg-emerald-500 text-white' : 'bg-white/20 text-slate-300'
                        }`}>{i + 1}</span>
                        <span className="text-slate-100 text-sm truncate">{rate.lender_name}</span>
                      </div>
                      <span className={`font-bold ${i === 0 ? 'text-emerald-300 text-lg' : 'text-slate-200'}`}>{rate.rate.toFixed(2)}%</span>
                    </Link>
                  ))}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10 mt-2">
                    <span>{marketStats.fixedUninsured.count} lenders</span>
                    <span>Avg {marketStats.fixedUninsured.avg}%</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-300 text-sm">No rates available</p>
              )}
            </div>

            {/* Variable Insured Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-teal-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  5-Year Variable
                </h3>
                <span className="text-xs text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded">Insured</span>
              </div>
              {marketStats.variableInsured?.top3.length ? (
                <div className="space-y-2">
                  {marketStats.variableInsured.top3.map((rate, i) => (
                    <Link key={i} href={`/lenders/${rate.lender_slug}`} className="flex items-center justify-between hover:opacity-80 transition">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          i === 0 ? 'bg-teal-500 text-white' : 'bg-white/20 text-slate-300'
                        }`}>{i + 1}</span>
                        <span className="text-slate-100 text-sm truncate">{rate.lender_name}</span>
                      </div>
                      <span className={`font-bold ${i === 0 ? 'text-teal-300 text-lg' : 'text-slate-200'}`}>{rate.rate.toFixed(2)}%</span>
                    </Link>
                  ))}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10 mt-2">
                    <span>{marketStats.variableInsured.count} lenders</span>
                    <span>Avg {marketStats.variableInsured.avg}%</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-300 text-sm">No rates available</p>
              )}
            </div>

            {/* Variable Uninsured Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-teal-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  5-Year Variable
                </h3>
                <span className="text-xs text-slate-300 bg-slate-500/20 px-2 py-0.5 rounded">Uninsured</span>
              </div>
              {marketStats.variableUninsured?.top3.length ? (
                <div className="space-y-2">
                  {marketStats.variableUninsured.top3.map((rate, i) => (
                    <Link key={i} href={`/lenders/${rate.lender_slug}`} className="flex items-center justify-between hover:opacity-80 transition">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          i === 0 ? 'bg-teal-500 text-white' : 'bg-white/20 text-slate-300'
                        }`}>{i + 1}</span>
                        <span className="text-slate-100 text-sm truncate">{rate.lender_name}</span>
                      </div>
                      <span className={`font-bold ${i === 0 ? 'text-teal-300 text-lg' : 'text-slate-200'}`}>{rate.rate.toFixed(2)}%</span>
                    </Link>
                  ))}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10 mt-2">
                    <span>{marketStats.variableUninsured.count} lenders</span>
                    <span>Avg {marketStats.variableUninsured.avg}%</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-300 text-sm">No rates available</p>
              )}
            </div>
          </div>
        </div>
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
              description={`Compare ${ratesData.length} mortgage rates from ${lenders.length} Canadian lenders. Best 5-year fixed: ${marketStats.fixedUninsured?.lowest.rate}% from ${marketStats.fixedUninsured?.lowest.lender_name}`}
            />
          </div>
        </div>

        {/* Mortgage Calculator */}
        <div className="mt-8">
          <MortgageCalculator />
        </div>

        {/* Ebook Promotion */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
                <h2 className="text-xl font-bold text-slate-900">Get the Best Deal on Your Next Mortgage</h2>
              </div>
              <p className="text-slate-600 mb-4">
                Don't overpay on your mortgage. Our comprehensive guide shows you exactly how to negotiate better rates, 
                avoid common mistakes, and save thousands over the life of your loan.
              </p>
              <ul className="text-sm text-slate-600 space-y-1 mb-4">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Insider secrets that banks do not want you to know
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save thousands by negotiating smarter
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Avoid costly penalties first-time buyers miss
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center gap-3 md:w-64">
              <div className="text-center">
                <span className="text-3xl font-bold text-amber-600">$29</span>
                <span className="text-slate-400 line-through ml-2">$49</span>
              </div>
              <Link 
                href="/mortgage-guide/" 
                className="btn-primary bg-amber-500 hover:bg-amber-600 text-white w-full text-center"
              >
                Get the Guide
              </Link>
              <p className="text-xs text-slate-500">Instant PDF download</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Alert Subscription */}
      <RateAlertForm />

      <Footer />
    </main>
  );
}
