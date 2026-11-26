"use client";

import { INSURED_UNINSURED_EXPLANATION, mortgageTypeShortLabel } from "@/lib/mortgageTypeCopy";
import { termChipLabel } from "@/lib/homepageRates";
import LenderLogo from "./LenderLogo";

interface Rate {
  lender_name: string;
  lender_slug: string;
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type: string;
}

interface RateComparisonTableProps {
  rates: Rate[];
  summary: string;
  showAllLabel: string | null;
  onShowAll: () => void;
  onLenderClick: (rate: Rate) => void;
}

function typeBadge(type: string) {
  const variable = type === "variable";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
        variable
          ? "border-teal-200 bg-teal-50 text-teal-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      {variable ? "Variable" : "Fixed"}
    </span>
  );
}

function downBadge(type: string) {
  const insured = type === "insured";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
        insured
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {mortgageTypeShortLabel(type)}
    </span>
  );
}

function RateRow({
  rate,
  onLenderClick,
  layout,
}: {
  rate: Rate;
  onLenderClick: (rate: Rate) => void;
  layout: "table" | "card";
}) {
  const href = `/lenders/${rate.lender_slug}/`;
  const term = termChipLabel(rate.term_months);
  if (layout === "card") {
    return (
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-b border-slate-200 px-2 py-3 dark:border-slate-700">
        <a href={href} onClick={() => onLenderClick(rate)} className="inline-flex min-w-0 items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <LenderLogo lenderSlug={rate.lender_slug} size="sm" showText={false} loading="lazy" />
          <span className="truncate">{rate.lender_name}</span>
        </a>
        <div className="text-right text-[1.0625rem] font-extrabold tabular-nums tracking-tight text-emerald-700">
          {rate.rate.toFixed(2)}%
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:border-slate-600 dark:text-slate-300">
            {term} {rate.rate_type === "variable" ? "Variable" : "Fixed"}
          </span>
          {downBadge(rate.mortgage_type)}
        </div>
        <a
          href={href}
          onClick={() => onLenderClick(rate)}
          className="justify-self-end rounded-lg border border-cyan-200 bg-teal-50 px-3 py-1.5 text-[0.8125rem] font-semibold text-cyan-900 hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
        >
          View
        </a>
      </div>
    );
  }

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60">
      <td className="px-4 py-3">
        <a
          href={href}
          onClick={() => onLenderClick(rate)}
          className="inline-flex min-w-0 items-center gap-2.5 font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:text-white"
        >
          <LenderLogo lenderSlug={rate.lender_slug} size="sm" showText={false} loading="lazy" />
          <span className="truncate">{rate.lender_name}</span>
        </a>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
          {term} {typeBadge(rate.rate_type)}
        </span>
      </td>
      <td className="px-4 py-3">{downBadge(rate.mortgage_type)}</td>
      <td className="px-4 py-3 text-[1.0625rem] font-extrabold tabular-nums tracking-tight text-emerald-700">
        {rate.rate.toFixed(2)}%
      </td>
      <td className="px-4 py-3">
        <a
          href={href}
          onClick={() => onLenderClick(rate)}
          className="inline-flex items-center rounded-lg border border-cyan-200 bg-teal-50 px-3 py-1.5 text-[0.8125rem] font-semibold text-cyan-900 hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
        >
          View
        </a>
      </td>
    </tr>
  );
}

export default function RateComparisonTable({
  rates,
  summary,
  showAllLabel,
  onShowAll,
  onLenderClick,
}: RateComparisonTableProps) {
  return (
    <div>
      <div className="hidden md:block">
        <table className="w-full border-collapse">
          <caption className="sr-only">Published Canadian mortgage rates, lowest first. {INSURED_UNINSURED_EXPLANATION}</caption>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <th scope="col" className="px-4 py-2.5">Lender</th>
              <th scope="col" className="px-4 py-2.5">Term / Type</th>
              <th scope="col" className="px-4 py-2.5">Down payment</th>
              <th scope="col" className="px-4 py-2.5">Rate</th>
              <th scope="col" className="px-4 py-2.5">Action</th>
            </tr>
          </thead>
          <tbody>
            {rates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No rates match these filters.
                </td>
              </tr>
            ) : (
              rates.map((rate, index) => (
                <RateRow
                  key={`${rate.lender_slug}-${rate.term_months}-${rate.rate_type}-${rate.mortgage_type}-${rate.rate}-${index}`}
                  rate={rate}
                  layout="table"
                  onLenderClick={onLenderClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-2 md:hidden">
        {rates.length === 0 ? (
          <p className="px-2 py-10 text-center text-slate-500">No rates match these filters.</p>
        ) : (
          rates.map((rate, index) => (
            <RateRow
              key={`m-${rate.lender_slug}-${rate.term_months}-${rate.rate_type}-${rate.mortgage_type}-${rate.rate}-${index}`}
              rate={rate}
              layout="card"
              onLenderClick={onLenderClick}
            />
          ))
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 px-4 py-3.5 dark:bg-slate-800/70">
        <p className="text-[0.8125rem] text-slate-500 dark:text-slate-300">
          {summary} {INSURED_UNINSURED_EXPLANATION}
        </p>
        {showAllLabel ? (
          <button
            type="button"
            onClick={onShowAll}
            className="inline-flex items-center justify-center rounded-lg border border-cyan-200 bg-white px-4 py-2 text-sm font-semibold text-cyan-900 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:bg-slate-900"
          >
            {showAllLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
