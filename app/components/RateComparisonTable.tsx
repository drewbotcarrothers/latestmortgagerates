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

// Inline SVG icons
const ArrowUpDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default function RateComparisonTable({ rates }: RateComparisonTableProps) {
  const [sortField, setSortField] = useState<keyof Rate>("rate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

  const getTermLabel = (months: number) => {
    if (months < 12) return `${months}m`;
    if (months === 12) return "1yr";
    return `${months / 12}yr`;
  };

  const getRateTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      fixed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      variable: "bg-teal-50 text-teal-700 border-teal-200",
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[type] || "bg-slate-100 text-slate-700"}`}>
        {type === "fixed" ? "Fixed" : "Variable"}
      </span>
    );
  };

  const getMortgageTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      insured: "bg-amber-50 text-amber-700 border-amber-200",
      uninsured: "bg-slate-50 text-slate-600 border-slate-200",
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[type] || "bg-slate-100 border-slate-200"}`}>
        {type === "insured" ? "Insured" : "Uninsured"}
      </span>
    );
  };

  const SortIcon = ({ field }: { field: keyof Rate }) => {
    if (sortField !== field) return <ArrowUpDownIcon />;
    return sortDirection === "asc" ? 
      <span className="text-teal-600"><ArrowUpIcon /></span> : 
      <span className="text-teal-600"><ArrowDownIcon /></span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
              <button
                onClick={() => handleSort("lender_name")}
                className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
              >
                Lender
                <SortIcon field="lender_name" />
              </button>
            </th>
            <th className="text-left py-4 px-3 font-semibold text-slate-700 text-sm">
              <button
                onClick={() => handleSort("term_months")}
                className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
              >
                Term
                <SortIcon field="term_months" />
              </button>
            </th>
            <th className="text-left py-4 px-3 font-semibold text-slate-700 text-sm">
              Type
            </th>
            <th className="text-left py-4 px-3 font-semibold text-slate-700 text-sm">
              <button
                onClick={() => handleSort("rate")}
                className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
              >
                Rate
                <SortIcon field="rate" />
              </button>
            </th>
            <th className="text-left py-4 px-3 font-semibold text-slate-700 text-sm hidden sm:table-cell">
              Details
            </th>
            <th className="text-right py-4 px-4 font-semibold text-slate-700 text-sm">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {sortedRates.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-slate-500">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">No rates found</p>
                  <p className="text-sm text-slate-400">Try adjusting your filters</p>
                </div>
              </td>
            </tr>
          ) : (
            sortedRates.map((rate, index) => (
              <tr
                key={index}
                className="group hover:bg-slate-50/80 transition-colors"
              >
                <td className="py-4 px-4">
                  <Link
                    href={`/lenders/${rate.lender_slug}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <LenderLogo lenderSlug={rate.lender_slug} size="sm" />
                  </Link>
                </td>
                
                <td className="py-4 px-3">
                  <span className="font-medium text-slate-900">{getTermLabel(rate.term_months)}</span>
                </td>
                
                <td className="py-4 px-3">
                  <div className="flex flex-wrap gap-1.5">
                    {getRateTypeBadge(rate.rate_type)}
                    {getMortgageTypeBadge(rate.mortgage_type)}
                  </div>
                </td>
                
                <td className="py-4 px-3">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-emerald-600">
                      {rate.rate.toFixed(2)}%
                    </span>
                    {rate.posted_rate && (
                      <span className="text-xs text-slate-400 line-through">
                        {rate.posted_rate.toFixed(2)}%
                      </span>
                    )}
                  </div>
                </td>
                
                <td className="py-4 px-3 hidden sm:table-cell">
                  <div className="text-sm text-slate-500">
                    {(rate.apr || rate.spread_to_prime) ? (
                      <div className="space-y-0.5">
                        {rate.apr && <div>APR: {rate.apr}%</div>}
                        {rate.spread_to_prime && <div>{rate.spread_to_prime}</div>}
                      </div>
                    ) : (
                      <span className="text-slate-400">--</span>
                    )}
                  </div>
                </td>
                
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/lenders/${rate.lender_slug}`}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      View
                      <ChevronRightIcon />
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500 flex items-center justify-between">
        <span>Showing {sortedRates.length} rates</span>
        <span className="text-xs text-slate-400">
          Sorted by {sortField}
        </span>
      </div>
    </div>
  );
}
