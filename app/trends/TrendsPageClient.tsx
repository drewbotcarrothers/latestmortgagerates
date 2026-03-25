"use client";

import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RateTrendsFull from "../components/RateTrendsFull";
import RateTrends from "../components/RateTrends";
import ratesData from "../../data/rates.json";

interface Rate {
  lender_name: string;
  lender_slug: string;
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type: string;
}

export default function TrendsPageClient() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header currentPage="trends" />

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <nav className="text-sm text-slate-300 mb-4">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span className="mx-2">/</span>
            <span>Trends</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Rate Trends & Analysis</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Track historical mortgage rate trends with interactive charts. Compare fixed vs variable rates across different timeframes and see market patterns over time.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Rate Trends Snapshot */}
        <div className="mb-12">
          <RateTrends rates={ratesData as Rate[]} />
        </div>

        <RateTrendsFull />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Understanding Rate Trends</h2>
            <p className="text-slate-600 mb-4">
              Mortgage rates change daily based on factors like bond yields, Bank of Canada policy, and market conditions. Our trend charts help you:
            </p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Identify patterns in rate movements</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Determine if it's a good time to lock in a rate</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Compare fixed vs variable rate trends</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Track lowest rates by lender over time</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Sources</h2>
            <p className="text-slate-600 mb-4">
              Our historical data is compiled from daily scraping of Canada's top mortgage lenders. We capture rates for:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="font-semibold text-slate-900">{34}+ Lenders</p>
                <p className="text-sm text-slate-500">Banks, credit unions, monoline</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="font-semibold text-slate-900">213+ Rates</p>
                <p className="text-sm text-slate-500">All terms and types monitored</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="font-semibold text-slate-900">2x Daily</p>
                <p className="text-sm text-slate-500">Updated at 6 AM & 6 PM EST</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="font-semibold text-slate-900">Historical</p>
                <p className="text-sm text-slate-500">90+ days of data</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 rounded-xl p-8 border border-blue-100">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Compare Today's Best Rates</h3>
          <p className="text-slate-600 mb-6">
            After reviewing trends, see the current best rates from Canada's top lenders.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            View Current Rates
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
