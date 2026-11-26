"use client";

import { useMemo, useRef, useState } from "react";
import RateFilters from "@/components/RateFilters";
import RateComparisonTable from "@/components/RateComparisonTable";
import MortgageCalculator from "@/components/MortgageCalculator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import SocialShare from "@/components/SocialShare";
import NewsletterSignup from "@/components/NewsletterSignup";
import RateDropBanner from "@/components/RateDropBanner";
import RateTableSchema from "@/components/RateTableSchema";
import RateHubLinks from "@/components/RateHubLinks";
import CommunityCallout from "@/components/community/CommunityCallout";
import CompareLinks from "@/components/CompareLinks";
import GuideCTA from "@/components/GuideCTA";
import AdUnit from "@/components/AdUnit";
import DiscoveryLinks from "@/components/DiscoveryLinks";
import StrikingDistanceLenderLinks from "@/components/StrikingDistanceLenderLinks";
import RateAnswer from "@/components/RateAnswer";
import HeroRateCards from "@/components/homepage/HeroRateCards";
import PaymentHook from "@/components/homepage/PaymentHook";
import BorrowerRangeBars from "@/components/homepage/BorrowerRangeBars";
import ToolsGrid from "@/components/homepage/ToolsGrid";
import { trackEvent } from "@/lib/analytics";
import { communityRates } from "@/lib/communityRates";
import {
  borrowerCreditLine,
  buildPaymentHook,
  buildRangeBars,
  changedFilter,
  DEFAULT_HOMEPAGE_FILTERS,
  filterPublishedRates,
  freshnessLine,
  heroCards,
  HOMEPAGE_H1,
  pageOfRates,
  showAllLabel,
  sortByRate,
  tableHeading,
  tableSummary,
  termAnalyticsValue,
  termChipLabel,
  type HomepageFilters,
} from "@/lib/homepageRates";
import { INSURED_SHORT_LABEL, UNINSURED_SHORT_LABEL } from "@/lib/mortgageTypeCopy";
import { publishedRates as ratesData } from "@/lib/publishedRates";
import metadata from "@data/metadata.json";

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
  source_url?: string;
  scraped_at?: string;
}

export default function Home() {
  const [filters, setFilters] = useState<HomepageFilters>(DEFAULT_HOMEPAGE_FILTERS);
  const [showAll, setShowAll] = useState(false);
  const searchTimer = useRef<number | undefined>(undefined);

  const lenders = useMemo(() => {
    return [...new Set((ratesData as Rate[]).map((rate) => rate.lender_slug))].sort();
  }, []);

  const sortedRates = useMemo(
    () => sortByRate(filterPublishedRates(ratesData as Rate[], filters)),
    [filters],
  );
  const visibleRates = pageOfRates(sortedRates, showAll);
  const cards = useMemo(() => heroCards(), []);
  const bars = useMemo(() => buildRangeBars(), []);
  const payment = useMemo(() => buildPaymentHook(), []);

  const handleFilterChange = (next: HomepageFilters) => {
    const change = changedFilter(filters, next);
    setFilters(next);
    setShowAll(false);
    if (!change) return;
    if (change.filter_type === "search") {
      window.clearTimeout(searchTimer.current);
      searchTimer.current = window.setTimeout(() => {
        trackEvent("filter_change", change);
      }, 400);
    } else {
      trackEvent("filter_change", change);
    }
  };

  const trackLender = (
    rate: { lender_name: string; term_months: number; rate_type: string; mortgage_type: string; rate: number },
    source: "hero_card" | "table",
  ) => {
    trackEvent("lender_table_click", {
      lender: rate.lender_name,
      term: termAnalyticsValue(String(rate.term_months)),
      rate_type: rate.rate_type,
      down_payment_tier: rate.mortgage_type,
      rate: rate.rate,
      source,
    });
  };

  const lastUpdatedDate = metadata?.last_updated || new Date().toISOString();
  const fresh = freshnessLine(ratesData.length, lenders.length, lastUpdatedDate);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <RateDropBanner />
      <StructuredData rates={ratesData as Rate[]} lastUpdated={lastUpdatedDate} />
      <Header currentPage="rates" />

      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-9">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-teal-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.22)]" aria-hidden="true" />
            Live rates · Updated daily
          </p>
          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            {HOMEPAGE_H1}
          </h1>
          <div className="mt-3.5 flex flex-col items-start gap-2 text-[0.9375rem] text-slate-300 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
            <p className="inline-flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0 text-teal-300">
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M12 7v5l3 2" />
              </svg>
              <span>{fresh}</span>
            </p>
            <span className="hidden text-slate-500 sm:inline" aria-hidden="true">·</span>
            <p className="inline-flex items-center gap-3.5 text-sm font-semibold">
              <a
                href="/mortgage-rate-history/"
                onClick={() => trackEvent("history_trends_click", { destination: "mortgage_rate_history", source: "hero" })}
                className="rounded-sm text-teal-200 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
              >
                Rate History →
              </a>
              <a
                href="/trends/"
                onClick={() => trackEvent("history_trends_click", { destination: "trends", source: "hero" })}
                className="rounded-sm text-teal-200 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
              >
                Rate Trends →
              </a>
            </p>
          </div>

          <HeroRateCards cards={cards} onLenderClick={(rate) => trackLender(rate, "hero_card")} />
          <p className="mt-3 text-xs leading-relaxed text-slate-300">{borrowerCreditLine()}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-12">
        {payment ? (
          <PaymentHook
            hook={payment}
            onCalculatorClick={(source) => {
              if (source === "hero") trackEvent("calculator_cta_click", { source: "hero" });
              else trackEvent("calculator_cta_click", { source: "payment_hook" });
            }}
          />
        ) : null}

        <BorrowerRangeBars
          bars={bars}
          onRenewalClick={() => trackEvent("renewal_checker_cta_click", { source: "range_bar" })}
        />

        <section aria-labelledby="table-heading" className="mt-9 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-4 py-5 sm:px-5 dark:border-slate-700">
            <h2 id="table-heading" className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {tableHeading(filters.term)}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Defaulted to 5-year terms so the lowest specials you see are real 5-year products, not 6-month teasers.
            </p>
            <RateFilters onFilterChange={handleFilterChange} terms={ratesData as Rate[]} />
          </div>
          <RateComparisonTable
            rates={visibleRates}
            summary={tableSummary(visibleRates.length, sortedRates.length, filters.term)}
            showAllLabel={showAllLabel(sortedRates.length, filters.term, showAll)}
            onShowAll={() => {
              trackEvent("show_all_rates_click", {
                active_term: termAnalyticsValue(filters.term),
                total_rows: sortedRates.length,
              });
              setShowAll(true);
            }}
            onLenderClick={(rate) => trackLender(rate, "table")}
          />
        </section>

        <RateTableSchema
          rates={sortedRates}
          lastUpdated={metadata.last_updated}
          termLabel={filters.term === "all" ? "All Terms" : termChipLabel(Number(filters.term))}
          rateTypeLabel={filters.rateType === "all" ? "Fixed & Variable" : filters.rateType === "fixed" ? "Fixed" : "Variable"}
          mortgageTypeLabel={
            filters.mortgageType === "all"
              ? `${INSURED_SHORT_LABEL} & ${UNINSURED_SHORT_LABEL}`
              : filters.mortgageType === "insured"
                ? INSURED_SHORT_LABEL
                : UNINSURED_SHORT_LABEL
          }
        />

        <div className="mt-7 grid items-start gap-4 lg:grid-cols-2">
          <NewsletterSignup
            variant="panel"
            anchorId="rate-alert"
            introHeading="Get alerted when 5-year rates drop"
            introText="The monthly mortgage rate report, sent when it can actually help — a short email with the latest published specials."
            onInteract={(action) => trackEvent("rate_alert_interact", { action })}
          />
          <GuideCTA
            variant="compact"
            tone="inverse"
            utmContent="homepage_conversion_strip"
            onCtaClick={() => trackEvent("guide_cta_click", { source: "homepage_conversion_strip" })}
          />
        </div>

        <ToolsGrid
          onCalculatorClick={() => trackEvent("calculator_cta_click", { source: "tools_grid" })}
          onRenewalClick={() => trackEvent("renewal_checker_cta_click", { source: "tools_grid" })}
          onHistoryClick={() =>
            trackEvent("history_trends_click", { destination: "mortgage_rate_history", source: "tools_grid" })
          }
          onTrendsClick={() => trackEvent("history_trends_click", { destination: "trends", source: "tools_grid" })}
        />

        <div className="pt-8">
          <RateAnswer focus="hub" />
          <RateHubLinks className="mt-8" />
          <CommunityCallout className="mt-8" />
          <CompareLinks className="mt-8" />
          <section className="card-default mt-8 p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">Lender and HELOC pages</h2>
            <DiscoveryLinks />
          </section>
          <StrikingDistanceLenderLinks className="mt-8" />
          <AdUnit format="display" className="mt-8" />

          <div className="card-default mt-8 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="mb-1 text-xl font-bold text-slate-900">Download Rate Data</h2>
                <p className="text-sm text-slate-500">Download the current 5-year fixed rates as JSON for your own analysis.</p>
              </div>
              <a href="/api/rates.json" download="mortgage-rates.json" className="btn-primary">
                Download JSON
              </a>
            </div>
          </div>

          <div className="card-default mt-8 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="mb-1 text-xl font-bold text-slate-900">Share These Rates</h2>
                <p className="text-sm text-slate-500">Found a great rate? Share it with friends and family.</p>
              </div>
              <SocialShare
                url="https://latestmortgagerates.ca"
                title="Latest Mortgage Rates Canada"
                description={`Compare ${ratesData.length} mortgage rates from ${lenders.length} Canadian lenders. Borrower reports are ${communityRates.attribution}.`}
              />
            </div>
          </div>

          <div className="mt-8">
            <MortgageCalculator />
          </div>
          <AdUnit format="display" className="mt-8" />

          <div className="card-default mt-8 p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">More Mortgage Calculators</h2>
            <p className="mb-6 text-slate-600">
              Explore our full suite of{" "}
              <a href="/tools/" className="font-medium text-teal-600 hover:underline">
                free Canadian mortgage tools
              </a>{" "}
              to plan every aspect of your home purchase.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <a href="/tools/mortgage-calculator/" className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-md">
                <span className="text-2xl" aria-hidden="true">🧮</span>
                <div>
                  <p className="font-medium text-slate-900 group-hover:text-teal-600">Payment Calculator</p>
                  <p className="text-sm text-slate-500">Monthly payments and amortization</p>
                </div>
              </a>
              <a href="/tools/affordability-calculator/" className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-md">
                <span className="text-2xl" aria-hidden="true">🏠</span>
                <div>
                  <p className="font-medium text-slate-900 group-hover:text-teal-600">Affordability Calculator</p>
                  <p className="text-sm text-slate-500">How much home can you afford?</p>
                </div>
              </a>
              <a href="/tools/land-transfer-tax-calculator/" className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-md">
                <span className="text-2xl" aria-hidden="true">📋</span>
                <div>
                  <p className="font-medium text-slate-900 group-hover:text-teal-600">Land Transfer Tax</p>
                  <p className="text-sm text-slate-500">Calculate provincial &amp; municipal taxes</p>
                </div>
              </a>
              <a href="/tools/cmhc-insurance-calculator/" className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-md">
                <span className="text-2xl" aria-hidden="true">🛡️</span>
                <div>
                  <p className="font-medium text-slate-900 group-hover:text-teal-600">CMHC Calculator</p>
                  <p className="text-sm text-slate-500">Mortgage default insurance premiums</p>
                </div>
              </a>
              <a href="/tools/closing-costs-calculator/" className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-md">
                <span className="text-2xl" aria-hidden="true">💰</span>
                <div>
                  <p className="font-medium text-slate-900 group-hover:text-teal-600">Closing Costs</p>
                  <p className="text-sm text-slate-500">Total fees to close your purchase</p>
                </div>
              </a>
              <a href="/tools/rent-vs-buy-calculator/" className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-md">
                <span className="text-2xl" aria-hidden="true">⚖️</span>
                <div>
                  <p className="font-medium text-slate-900 group-hover:text-teal-600">Rent vs Buy</p>
                  <p className="text-sm text-slate-500">Which saves more long-term?</p>
                </div>
              </a>
              <a href="/tools/stress-test-qualifier/" className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-md">
                <span className="text-2xl" aria-hidden="true">✅</span>
                <div>
                  <p className="font-medium text-slate-900 group-hover:text-teal-600">Stress Test Qualifier</p>
                  <p className="text-sm text-slate-500">Check if you qualify at stress rate</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
