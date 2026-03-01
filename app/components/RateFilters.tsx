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

export default function RateFilters({ onFilterChange, lenders }: RateFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    term: "all",
    rateType: "all",
    mortgageType: "all",
    lender: "all",
  });

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Find Your Rate</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Term Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Term
          </label>
          <select
            value={filters.term}
            onChange={(e) => handleChange("term", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Terms</option>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate Type
          </label>
          <select
            value={filters.rateType}
            onChange={(e) => handleChange("rateType", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="fixed">Fixed</option>
            <option value="variable">Variable</option>
          </select>
        </div>

        {/* Mortgage Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mortgage Type
          </label>
          <select
            value={filters.mortgageType}
            onChange={(e) => handleChange("mortgageType", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="insured">Insured (LTV 80%)</option>
            <option value="uninsured">Uninsured</option>
          </select>
        </div>

        {/* Lender Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lender
          </label>
          <select
            value={filters.lender}
            onChange={(e) => handleChange("lender", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Lenders</option>
            {lenders.map((lender) => (
              <option key={lender} value={lender}>
                {lender.charAt(0).toUpperCase() + lender.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-600">Quick filters:</span>
        <button
          onClick={() => {
            const newFilters = { term: "60", rateType: "fixed", mortgageType: "uninsured", lender: "all" };
            setFilters(newFilters);
            onFilterChange(newFilters);
          }}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          5-Year Fixed Uninsured
        </button>
        <button
          onClick={() => {
            const newFilters = { term: "60", rateType: "variable", mortgageType: "uninsured", lender: "all" };
            setFilters(newFilters);
            onFilterChange(newFilters);
          }}
          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
        >
          5-Year Variable Uninsured
        </button>
        <button
          onClick={() => {
            const newFilters = { term: "60", rateType: "fixed", mortgageType: "insured", lender: "all" };
            setFilters(newFilters);
            onFilterChange(newFilters);
          }}
          className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
        >
          5-Year Fixed Insured
        </button>
      </div>
    </div>
  );
}
