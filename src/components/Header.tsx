"use client";

import Navigation from "./Navigation";
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
  currentPage: "rates" | "guides" | "glossary" | "tools" | "blog" | "trends" | "experts";
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
  lenderCount 
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="Latest Mortgage Rates Canada"
                width={70}
                height={70}
                className="rounded-lg"
              />
            </a>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Latest Mortgage Rates Canada
              </h1>
              <p className="text-slate-500 text-sm max-w-xl">
                Compare current rates from Canada&apos;s top lenders including Big 6 Banks and monoline lenders. Updated twice daily.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Navigation currentPage={currentPage} />
          </div>
        </div>
        
        {showStats && lastUpdated && (
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last updated: {formatHeaderDate(lastUpdated)}</span>
            </div>
            {rateCount && lenderCount && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Tracking {rateCount} rates from {lenderCount} lenders</span>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
