"use client";

import Navigation, { type SitePage } from "./Navigation";
import ThemeToggle from "./ThemeToggle";

function formatHeaderDate(iso?: string): string {
  if (!iso) return "—";
  const normalized = /(?:Z|[+-]\d{2}:?\d{2})$/.test(iso) ? iso : `${iso}Z`;
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

interface HeaderProps {
  currentPage?: SitePage;
  showStats?: boolean;
  lastUpdated?: string;
  rateCount?: number;
  lenderCount?: number;
}

export default function Header({
  currentPage,
  showStats = false,
  lastUpdated,
  rateCount,
  lenderCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 flex-nowrap items-center justify-between gap-3">
          <a
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            aria-label="Latest Mortgage Rates Canada, home"
          >
            <img
              src="/logo.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg"
            />
            <span className="hidden whitespace-nowrap text-sm font-semibold tracking-tight text-slate-900 sm:block dark:text-white">
              Latest Mortgage Rates
            </span>
          </a>
          <div className="flex shrink-0 items-center gap-1.5">
            <Navigation currentPage={currentPage} />
            <ThemeToggle />
          </div>
        </div>

        {showStats && lastUpdated ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 py-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Updated {formatHeaderDate(lastUpdated)}
            </span>
            {rateCount && lenderCount ? (
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {rateCount} rates from {lenderCount} lenders
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
