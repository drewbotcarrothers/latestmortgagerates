"use client";

import { useState } from "react";
import Link from "next/link";
import LenderLogo from "./LenderLogo";

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
  source_url?: string | null;
}

interface RateComparisonTableProps {
  rates: Rate[];
}

export default function RateComparisonTable({ rates }: RateComparisonTableProps) {
  const [sortField, setSortField] = useState<keyof Rate>("rate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRates, setSelectedRates] = useState<Set<number>>(new Set());

  const handleSort = (field: keyof Rate) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedRates = [...rates].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const toggleSelection = (index: number) => {
    const newSelected = new Set(selectedRates);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRates(newSelected);
  };

  const getTermLabel = (months: number) => {
    if (months < 12) return `${months}m`;
    if (months === 12) return "1yr";
    return `${months / 12}yr`;
  };

  const getRateTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      fixed: "bg-green-100 text-green-800",
      variable: "bg-blue-100 text-blue-800",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${colors[type] || "bg-gray-100"}`}>
        {type === "fixed" ? "Fixed" : "Variable"}
      </span>
    );
  };

  const getMortgageTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      insured: "bg-purple-100 text-purple-800",
      uninsured: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${colors[type] || "bg-gray-100"}`}>
        {type === "insured" ? "Insured" : "Uninsured"}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Comparison Summary */}
      {selectedRates.size > 0 && (
        <div className="bg-blue-50 p-3 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium text-sm">
              {selectedRates.size} rate{selectedRates.size > 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() => setSelectedRates(new Set())}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRates(new Set(sortedRates.map((_, i) => i)));
                    } else {
                      setSelectedRates(new Set());
                    }
                  }}
                  checked={selectedRates.size === sortedRates.length && sortedRates.length > 0}
                  className="rounded border-gray-300"
                />
              </th>
              <th 
                className="p-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 text-sm"
                onClick={() => handleSort("lender_name")}
              >
                Lender {sortField === "lender_name" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th 
                className="p-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 text-sm"
                onClick={() => handleSort("term_months")}
              >
                Term {sortField === "term_months" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-3 text-left font-semibold text-gray-700 text-sm">Type</th>
              <th className="p-3 text-left font-semibold text-gray-700 text-sm">Mortgage</th>
              <th 
                className="p-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 text-sm"
                onClick={() => handleSort("rate")}
              >
                Rate {sortField === "rate" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-3 text-left font-semibold text-gray-700 text-sm">Details</th>
              <th className="p-3 text-left font-semibold text-gray-700 text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedRates.map((rate, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-100 hover:bg-gray-50 ${
                  selectedRates.has(index) ? "bg-blue-50" : ""
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedRates.has(index)}
                    onChange={() => toggleSelection(index)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-3">
                  <Link href={`/lenders/${rate.lender_slug}`} className="flex items-center gap-2 hover:opacity-80 transition">
                    <LenderLogo lenderSlug={rate.lender_slug} size="sm" />
                    <div>
                      <div className="font-medium text-gray-900 hover:text-blue-600 transition text-sm">{rate.lender_name}</div>
                    </div>
                  </Link>
                </td>
                <td className="p-3">
                  <span className="font-medium text-sm">{getTermLabel(rate.term_months)}</span>
                  {rate.term_months === 60 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">Popular</span>
                  )}
                </td>
                <td className="p-3">{getRateTypeBadge(rate.rate_type)}</td>
                <td className="p-3">{getMortgageTypeBadge(rate.mortgage_type)}</td>
                <td className="p-3">
                  <div className="text-xl font-bold text-green-600">
                    {rate.rate.toFixed(2)}%
                  </div>
                  {rate.posted_rate && (
                    <div className="text-xs text-gray-500 line-through">
                      Posted: {rate.posted_rate.toFixed(2)}%
                    </div>
                  )}
                  {rate.apr && (
                    <div className="text-xs text-gray-600">
                      APR: {rate.apr}%
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <div className="text-xs text-gray-600">
                    {rate.ltv_tier && (
                      <div>LTV: {rate.ltv_tier}</div>
                    )}
                    {rate.spread_to_prime && (
                      <div>Spread: {rate.spread_to_prime}</div>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <a
                    href={rate.source_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition whitespace-nowrap"
                  >
                    View Rate
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {sortedRates.map((rate, index) => (
          <div 
            key={index}
            className={`p-4 border-b border-gray-100 ${selectedRates.has(index) ? "bg-blue-50" : "bg-white"}`}
          >
            {/* Header: Lender + Rate */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedRates.has(index)}
                  onChange={() => toggleSelection(index)}
                  className="rounded border-gray-300 mr-1"
                />
                <Link href={`/lenders/${rate.lender_slug}`} className="flex items-center gap-2 hover:opacity-80">
                  <LenderLogo lenderSlug={rate.lender_slug} size="sm" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm leading-tight">{rate.lender_name}</div>
                    <div className="text-xs text-gray-500">{getTermLabel(rate.term_months)} {rate.term_months === 60 && <span className="text-yellow-600">★</span>}</div>
                  </div>
                </Link>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 leading-none">{rate.rate.toFixed(2)}%</div>
                {rate.posted_rate && (
                  <div className="text-xs text-gray-500 line-through">{rate.posted_rate.toFixed(2)}%</div>
                )}
              </div>
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap gap-2 mb-2">
              {getRateTypeBadge(rate.rate_type)}
              {getMortgageTypeBadge(rate.mortgage_type)}
            </div>

            {/* Details */}
            <div className="text-xs text-gray-600 mb-3 space-y-0.5">
              {rate.apr && <div>APR: {rate.apr}%</div>}
              {rate.ltv_tier && <div>LTV: {rate.ltv_tier}</div>}
              {rate.spread_to_prime && <div>Spread: {rate.spread_to_prime}</div>}
            </div>

            {/* Action Button */}
            <a
              href={rate.source_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              View Rate
            </a>
          </div>
        ))}
      </div>

      {sortedRates.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No rates found matching your criteria.
        </div>
      )}
    </div>
  );
}
