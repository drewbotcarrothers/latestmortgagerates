"use client";

import { useState } from "react";

interface FilterState {
  term: string;
  rateType: string;
  mortgageType: string;
  lender: string;
}

interface RateFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  lenders: string[];
}

// Inline SVG icons
const SlidersHorizontalIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function RateFilters({ onFilterChange, lenders }: RateFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    term: "all",
    rateType: "all",
    mortgageType: "all",
    lender: "all",
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const newFilters = {
      term: "all",
      rateType: "all",
      mortgageType: "all",
      lender: "all",
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== "all");
  const activeFilterCount = Object.values(filters).filter(v => v !== "all").length;

  return (
    <div className="card-default overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-50 rounded-lg">
            <SlidersHorizontalIcon />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Filter Rates</h2>
            <p className="text-sm text-slate-500">Find your perfect mortgage rate</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              <XIcon />
              Clear ({activeFilterCount})
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-secondary text-sm"
          >
            {isExpanded ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      {/* Filter Form */}
      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
        <div className="p-4 bg-slate-50/50 border-t border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Term Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Term
              </label>
              <select
                value={filters.term}
                onChange={(e) => handleChange("term", e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              >
                <option value="all">All Terms</option>
                <option value="6">6 Months</option>
                <option value="12">1 Year</option>
                <option value="24">2 Years</option>
                <option value="36">3 Years</option>
                <option value="48">4 Years</option>
                <option value="60">5 Years</option>
                <option value="84">7 Years</option>
                <option value="120">10 Years</option>
              </select>
            </div>

            {/* Rate Type Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Rate Type
              </label>
              <select
                value={filters.rateType}
                onChange={(e) => handleChange("rateType", e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              >
                <option value="all">All Types</option>
                <option value="fixed">Fixed Rate</option>
                <option value="variable">Variable Rate</option>
              </select>
            </div>

            {/* Mortgage Type Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Mortgage Type
              </label>
              <select
                value={filters.mortgageType}
                onChange={(e) => handleChange("mortgageType", e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              >
                <option value="all">All Types</option>
                <option value="insured">Insured (≤20% down)</option>
                <option value="uninsured">Uninsured (&gt;20% down)</option>
              </select>
            </div>

            {/* Lender Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Lender
              </label>
              <select
                value={filters.lender}
                onChange={(e) => handleChange("lender", e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              >
                <option value="all">All Lenders</option>
                {lenders.map((lender) => (
                  <option key={lender} value={lender}>
                    {lender.charAt(0).toUpperCase() + lender.slice(1).replace(/-/g, " ")}
                  </option>
                ))}
              </select>
              <div className="text-xs text-slate-500 mt-1">
                {lenders.length} lenders available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
