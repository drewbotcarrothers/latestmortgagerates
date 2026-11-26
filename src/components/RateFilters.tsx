"use client";

import { useState } from "react";
import { INSURED_SHORT_LABEL, UNINSURED_SHORT_LABEL } from "@/lib/mortgageTypeCopy";
import {
  DEFAULT_HOMEPAGE_FILTERS,
  termFilterChips,
  type HomepageFilters,
} from "@/lib/homepageRates";

interface RateFiltersProps {
  onFilterChange: (filters: HomepageFilters) => void;
  terms: readonly { term_months: number }[];
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[0.8125rem] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 ${
        active
          ? "border-cyan-300 bg-cyan-50 font-semibold text-cyan-950 dark:border-cyan-700 dark:bg-cyan-950 dark:text-cyan-100"
          : "border-slate-200 bg-white font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

export default function RateFilters({ onFilterChange, terms }: RateFiltersProps) {
  const [filters, setFilters] = useState<HomepageFilters>(DEFAULT_HOMEPAGE_FILTERS);
  const termChips = termFilterChips(terms);

  const update = (key: keyof HomepageFilters, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
  };

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="w-full shrink-0 text-xs font-semibold text-slate-600 sm:w-[108px] dark:text-slate-300">Term</div>
        <div className="flex flex-1 flex-wrap gap-1.5" role="group" aria-label="Term">
          {termChips.map((chip) => (
            <Chip key={chip.value} active={filters.term === chip.value} onClick={() => update("term", chip.value)}>
              {chip.label}
            </Chip>
          ))}
          <Chip active={filters.term === "all"} onClick={() => update("term", "all")}>
            All
          </Chip>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="w-full shrink-0 text-xs font-semibold text-slate-600 sm:w-[108px] dark:text-slate-300">
          Down payment
        </div>
        <div className="flex flex-1 flex-wrap gap-1.5" role="group" aria-label="Down payment">
          <Chip active={filters.mortgageType === "all"} onClick={() => update("mortgageType", "all")}>
            All
          </Chip>
          <Chip active={filters.mortgageType === "insured"} onClick={() => update("mortgageType", "insured")}>
            {INSURED_SHORT_LABEL}
          </Chip>
          <Chip active={filters.mortgageType === "uninsured"} onClick={() => update("mortgageType", "uninsured")}>
            {UNINSURED_SHORT_LABEL}
          </Chip>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="w-full shrink-0 text-xs font-semibold text-slate-600 sm:w-[108px] dark:text-slate-300">Type</div>
        <div className="flex flex-1 flex-wrap gap-1.5" role="group" aria-label="Rate type">
          <Chip active={filters.rateType === "all"} onClick={() => update("rateType", "all")}>
            All
          </Chip>
          <Chip active={filters.rateType === "fixed"} onClick={() => update("rateType", "fixed")}>
            Fixed
          </Chip>
          <Chip active={filters.rateType === "variable"} onClick={() => update("rateType", "variable")}>
            Variable
          </Chip>
        </div>
        <label className="flex w-full min-w-[180px] max-w-none items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-500 sm:max-w-[280px] dark:border-slate-600 dark:bg-slate-800">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3-3" />
          </svg>
          <input
            type="search"
            value={filters.lenderQuery}
            onChange={(event) => update("lenderQuery", event.target.value)}
            placeholder="Search lenders"
            aria-label="Search lenders"
            className="w-full bg-transparent text-[0.8125rem] text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          />
        </label>
      </div>
    </div>
  );
}
