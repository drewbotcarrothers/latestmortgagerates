"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface RateDrop {
  product: string;
  previousRate: number;
  currentRate: number;
  dropAmount: number;
  date: string;
}

interface HistoricalEntry {
  date: string;
  fixed_uninsured_best_rate: number;
  fixed_insured_best_rate: number;
  variable_uninsured_best_rate: number;
  variable_insured_best_rate: number;
  prime_rate: number;
}

function detectRateDrops(
  historical: HistoricalEntry[]
): RateDrop[] {
  if (historical.length < 2) return [];

  const sorted = [...historical].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const current = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2];

  const drops: RateDrop[] = [];
  const threshold = 0.05;

  const products: { key: keyof HistoricalEntry; label: string }[] = [
    { key: "fixed_uninsured_best_rate", label: "5-Year Fixed (Uninsured)" },
    { key: "fixed_insured_best_rate", label: "5-Year Fixed (Insured)" },
    { key: "variable_uninsured_best_rate", label: "5-Year Variable (Uninsured)" },
    { key: "variable_insured_best_rate", label: "5-Year Variable (Insured)" },
  ];

  for (const { key, label } of products) {
    const prev = previous[key] as number;
    const curr = current[key] as number;
    if (prev !== undefined && curr !== undefined && prev - curr > threshold) {
      drops.push({
        product: label,
        previousRate: prev,
        currentRate: curr,
        dropAmount: Number((prev - curr).toFixed(2)),
        date: current.date,
      });
    }
  }

  return drops;
}

export default function RateDropBanner() {
  const [drops, setDrops] = useState<RateDrop[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem("rateDropBannerState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const lastShown = new Date(parsed.date);
        const now = new Date();
        const diffHours = (now.getTime() - lastShown.getTime()) / (1000 * 60 * 60);
        // If less than 24 hours, keep dismissed
        if (parsed.dismissed && diffHours < 24) {
          setDismissed(true);
        }
      } catch {
        // ignore parse errors
      }
    }

    // Dynamically import historical data to avoid SSR issues
    import("../../data/historical_rates.json")
      .then((mod) => {
        const data = mod.default?.data || mod.data || [];
        const detected = detectRateDrops(data);
        setDrops(detected);
      })
      .catch(() => {
        // If historical_rates.json isn't available, try to use a simpler approach
        setDrops([]);
      });
  }, []);

  if (dismissed || drops.length === 0) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(
      "rateDropBannerState",
      JSON.stringify({ dismissed: true, date: new Date().toISOString() })
    );
  };

  return (
    <div className="bg-emerald-600 text-white relative">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">📉</span>
            <div className="flex-1">
              <p className="text-sm md:text-base font-medium">
                <span className="font-bold">Rate Alert:</span>{" "}
                {drops.length === 1
                  ? `${drops[0].product} dropped ${drops[0].dropAmount}%`
                  : `${drops.length} mortgage products dropped in rate today!`}
              </p>
              <p className="text-xs text-emerald-100 mt-0.5 hidden md:block">
                Get notified when rates drop by signing up for our Rate Alert.{" "}
                <Link href="#rate-alert" className="underline hover:text-white font-semibold">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="#rate-alert"
              className="text-xs bg-white text-emerald-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors whitespace-nowrap"
            >
              Get Alerts
            </Link>
            <button
              onClick={handleDismiss}
              className="text-emerald-200 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
