"use client";

import { useState, useMemo } from "react";
import RateFilters from "@/components/RateFilters";
import RateComparisonTable from "@/components/RateComparisonTable";
import MortgageCalculator from "@/components/MortgageCalculator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import SocialShare from "@/components/SocialShare";
import RateAlertForm from "@/components/RateAlertForm";
import RateDropBanner from "@/components/RateDropBanner";
import RateTableSchema from "@/components/RateTableSchema";
import RateHubLinks from "@/components/RateHubLinks";
import CommunityCallout from "@/components/community/CommunityCallout";
import CompareLinks from "@/components/CompareLinks";
import GuideCTA from "@/components/GuideCTA";
import AdUnit from "@/components/AdUnit";
import StrikingDistanceLenderLinks from "@/components/StrikingDistanceLenderLinks";

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
import ratesData from "@data/rates.json";
import metadata from "@data/metadata.json";

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
      {/* Rate Drop Banner */}
      <RateDropBanner />

      {/* JSON-LD Structured Data */}
      <StructuredData rates={ratesData as Rate[]} lastUpdated={lastUpdatedDate} />
      
      <Header
        currentPage="rates"
        showStats
        lastUpdated={metadata?.last_updated}
        rateCount={ratesData.length}
        lenderCount={lenders.length}
      />

      {/* Today's Best Rates - Consolidated Section */}
      <div className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h1 className="text-lg font-medium text-slate-200 tracking-wide uppercase">Today's Best Mortgage Rates</h1>
            <p className="text-sm text-slate-400 mt-1 md:mt-0">Top lenders ranked by lowest rate</p>
          </div>
          <RateHubLinks variant="pills" showToolsIndex className="mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Fixed Insured Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-teal-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <a href="/rates/5-year-fixed/" className="hover:text-white transition">5-Year Fixed</a>
                </h3>
                <a href="/rates/insured/" className="text-xs text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded hover:bg-emerald-500/30">Insured</a>
              </div>
              {marketStats.fixedInsured?.top3.length ? (
                <div className="space-y-2">
                  {marketStats.fixedInsured.top3.map((rate, i) => (
                    <a key={i} href={`/lenders/${rate.lender_slug}/`} className="flex items-center justify-between gap-3 hover:opacity-80 transition">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-5 h-5 shrink-0 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          i === 0 ? 'bg-emerald-500 text-white' : 'bg-white/20 text-slate-300'
                        }`}>{i + 1}</span>
                        <span className="text-slate-100 text-sm leading-5 truncate">{rate.lender_name}</span>
                      </div>
                      <span className={`shrink-0 font-bold tabular-nums ${i === 0 ? 'text-emerald-300 text-lg' : 'text-slate-200'}`}>{rate.rate.toFixed(2)}%</span>
                    </a>
                  ))}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10 mt-2">
                    <span>{marketStats.fixedInsured.count} lenders</span>
                    <a href="/rates/insured/" className="text-teal-200 hover:text-white">See all →</a>
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
                  <a href="/rates/5-year-fixed/" className="hover:text-white transition">5-Year Fixed</a>
                </h3>
                <a href="/rates/uninsured/" className="text-xs text-slate-300 bg-slate-500/20 px-2 py-0.5 rounded hover:bg-slate-500/30">Uninsured</a>
              </div>
              {marketStats.fixedUninsured?.top3.length ? (
                <div className="space-y-2">
                  {marketStats.fixedUninsured.top3.map((rate, i) => (
                    <a key={i} href={`/lenders/${rate.lender_slug}/`} className="flex items-center justify-between gap-3 hover:opacity-80 transition">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-5 h-5 shrink-0 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          i === 0 ? 'bg-emerald-500 text-white' : 'bg-white/20 text-slate-300'
                        }`}>{i + 1}</span>
                        <span className="text-slate-100 text-sm leading-5 truncate">{rate.lender_name}</span>
                      </div>
                      <span className={`shrink-0 font-bold tabular-nums ${i === 0 ? 'text-emerald-300 text-lg' : 'text-slate-200'}`}>{rate.rate.toFixed(2)}%</span>
                    </a>
                  ))}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10 mt-2">
                    <span>{marketStats.fixedUninsured.count} lenders</span>
                    <a href="/rates/uninsured/" className="text-teal-200 hover:text-white">See all →</a>
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
                  <a href="/rates/variable/" className="hover:text-white transition">5-Year Variable</a>
                </h3>
                <a href="/rates/insured/" className="text-xs text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded hover:bg-teal-500/30">Insured</a>
              </div>
              {marketStats.variableInsured?.top3.length ? (
                <div className="space-y-2">
                  {marketStats.variableInsured.top3.map((rate, i) => (
                    <a key={i} href={`/lenders/${rate.lender_slug}/`} className="flex items-center justify-between gap-3 hover:opacity-80 transition">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-5 h-5 shrink-0 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          i === 0 ? 'bg-teal-500 text-white' : 'bg-white/20 text-slate-300'
                        }`}>{i + 1}</span>
                        <span className="text-slate-100 text-sm leading-5 truncate">{rate.lender_name}</span>
                      </div>
                      <span className={`shrink-0 font-bold tabular-nums ${i === 0 ? 'text-teal-300 text-lg' : 'text-slate-200'}`}>{rate.rate.toFixed(2)}%</span>
                    </a>
                  ))}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10 mt-2">
                    <span>{marketStats.variableInsured.count} lenders</span>
                    <a href="/rates/variable/" className="text-teal-200 hover:text-white">See all →</a>
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
                  <a href="/rates/variable/" className="hover:text-white transition">5-Year Variable</a>
                </h3>
                <a href="/rates/uninsured/" className="text-xs text-slate-300 bg-slate-500/20 px-2 py-0.5 rounded hover:bg-slate-500/30">Uninsured</a>
              </div>
              {marketStats.variableUninsured?.top3.length ? (
                <div className="space-y-2">
                  {marketStats.variableUninsured.top3.map((rate, i) => (
                    <a key={i} href={`/lenders/${rate.lender_slug}/`} className="flex items-center justify-between gap-3 hover:opacity-80 transition">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-5 h-5 shrink-0 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          i === 0 ? 'bg-teal-500 text-white' : 'bg-white/20 text-slate-300'
                        }`}>{i + 1}</span>
                        <span className="text-slate-100 text-sm leading-5 truncate">{rate.lender_name}</span>
                      </div>
                      <span className={`shrink-0 font-bold tabular-nums ${i === 0 ? 'text-teal-300 text-lg' : 'text-slate-200'}`}>{rate.rate.toFixed(2)}%</span>
                    </a>
                  ))}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10 mt-2">
                    <span>{marketStats.variableUninsured.count} lenders</span>
                    <a href="/rates/variable/" className="text-teal-200 hover:text-white">See all →</a>
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

        <RateTableSchema
          rates={filteredRates}
          lastUpdated={metadata.last_updated}
          termLabel={filters.term === "all" ? "All Terms" : `${parseInt(filters.term) / 12}-Year`}
          rateTypeLabel={filters.rateType === "all" ? "Fixed & Variable" : filters.rateType === "fixed" ? "Fixed" : "Variable"}
          mortgageTypeLabel={filters.mortgageType === "all" ? "Insured & Uninsured" : filters.mortgageType === "insured" ? "Insured" : "Uninsured"}
        />

        <RateHubLinks className="mt-8" />

        <CommunityCallout className="mt-8" />

        <CompareLinks className="mt-8" />

        <StrikingDistanceLenderLinks className="mt-8" />

        <AdUnit format="display" className="mt-8" />

        {/* Download CSV Section */}
        <div className="mt-8 card-default p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Download Rate Data</h2>
              <p className="text-slate-500 text-sm">
                Download the current 5-year fixed rates as JSON for your own analysis.
              </p>
            </div>
            <a 
              href="/api/rates.json" 
              download="mortgage-rates.json"
              className="btn-primary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download JSON
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

        <AdUnit format="display" className="mt-8" />

        {/* More Calculators */}
        <div className="mt-8 card-default p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">More Mortgage Calculators</h2>
          <p className="text-slate-600 mb-6">
            Explore our full suite of{" "}
            <a href="/tools/" className="text-teal-600 hover:underline font-medium">free Canadian mortgage tools</a>
            {" "}to plan every aspect of your home purchase.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="/tools/mortgage-calculator/" className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 hover:bg-white hover:shadow-md border border-slate-200 transition-all group">
              <span className="text-2xl">🧮</span>
              <div>
                <p className="font-medium text-slate-900 group-hover:text-teal-600">Payment Calculator</p>
                <p className="text-sm text-slate-500">Monthly payments and amortization</p>
              </div>
            </a>
            <a href="/tools/affordability-calculator/" className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 hover:bg-white hover:shadow-md border border-slate-200 transition-all group">
              <span className="text-2xl">🏠</span>
              <div>
                <p className="font-medium text-slate-900 group-hover:text-teal-600">Affordability Calculator</p>
                <p className="text-sm text-slate-500">How much home can you afford?</p>
              </div>
            </a>
            <a href="/tools/land-transfer-tax-calculator/" className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 hover:bg-white hover:shadow-md border border-slate-200 transition-all group">
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-medium text-slate-900 group-hover:text-teal-600">Land Transfer Tax</p>
                <p className="text-sm text-slate-500">Calculate provincial &amp; municipal taxes</p>
              </div>
            </a>
            <a href="/tools/cmhc-insurance-calculator/" className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 hover:bg-white hover:shadow-md border border-slate-200 transition-all group">
              <span className="text-2xl">🛡️</span>
              <div>
                <p className="font-medium text-slate-900 group-hover:text-teal-600">CMHC Calculator</p>
                <p className="text-sm text-slate-500">Mortgage default insurance premiums</p>
              </div>
            </a>
            <a href="/tools/closing-costs-calculator/" className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 hover:bg-white hover:shadow-md border border-slate-200 transition-all group">
              <span className="text-2xl">💰</span>
              <div>
                <p className="font-medium text-slate-900 group-hover:text-teal-600">Closing Costs</p>
                <p className="text-sm text-slate-500">Total fees to close your purchase</p>
              </div>
            </a>
            <a href="/tools/rent-vs-buy-calculator/" className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 hover:bg-white hover:shadow-md border border-slate-200 transition-all group">
              <span className="text-2xl">⚖️</span>
              <div>
                <p className="font-medium text-slate-900 group-hover:text-teal-600">Rent vs Buy</p>
                <p className="text-sm text-slate-500">Which saves more long-term?</p>
              </div>
            </a>
            <a href="/tools/stress-test-qualifier/" className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 hover:bg-white hover:shadow-md border border-slate-200 transition-all group">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-medium text-slate-900 group-hover:text-teal-600">Stress Test Qualifier</p>
                <p className="text-sm text-slate-500">Check if you qualify at stress rate</p>
              </div>
            </a>
          </div>
        </div>

        <GuideCTA variant="full" className="mt-8" />
      </div>

      {/* Rate Alert Subscription */}
      <div id="rate-alert-section" className="max-w-7xl mx-auto px-4 py-12 pb-16">
        <RateAlertForm />
      </div>

      <Footer />
    </main>
  );
}
