"use client";

import { useMemo } from 'react';

interface Rate {
  lender_name: string;
  lender_slug: string;
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type: string;
}

interface RateTrendsProps {
  rates: Rate[];
  trendData?: TrendData;
}

interface TrendData {
  direction: 'up' | 'down' | 'stable';
  change: number;
  percent_change: number;
  days_since?: number;
}

// Simple trend chart using SVG
const TrendChart = ({ direction, magnitude }: { direction: 'up' | 'down' | 'stable'; magnitude: number }) => {
  const strokeColor = direction === 'down' ? '#10b981' : direction === 'up' ? '#ef4444' : '#64748b';
  const arrow = direction === 'down' ? '↓' : direction === 'up' ? '↑' : '→';
  
  return (
    <div className="flex items-end gap-1 h-8">
      {/* Simple bar chart */}
      {[40, 50, 55, 50, 45].map((height, i) => {
        // Adjust last bars to show trend direction
        const adjustedHeight = direction === 'down' 
          ? (i === 4 ? 35 : i === 3 ? 40 : height)
          : direction === 'up'
          ? (i === 4 ? 55 : i === 3 ? 50 : height)
          : height;
          
        return (
          <div
            key={i}
            className="w-2 rounded-t transition-all duration-500"
            style={{
              height: `${adjustedHeight}%`,
              backgroundColor: i >= 3 ? strokeColor : '#cbd5e1',
              opacity: i >= 3 ? 1 : 0.5
            }}
          />
        );
      })}
    </div>
  );
};

// Rate trend indicator card
const TrendIndicator = ({ 
  label, 
  currentRate, 
  trend 
}: { 
  label: string; 
  currentRate: number; 
  trend?: TrendData 
}) => {
  const direction = trend?.direction || 'stable';
  const change = trend?.change || 0;
  const percent = trend?.percent_change || 0;
  
  const colors = {
    up: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', indicator: '↑ Rising' },
    down: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', indicator: '↓ Falling' },
    stable: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', indicator: '→ Stable' }
  };
  
  const color = colors[direction];
  
  return (
    <div className={`card-default p-5 border ${color.border} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-600">{label}</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-slate-900">{currentRate.toFixed(2)}%</span>
            <span className="text-sm text-slate-500">current</span>
          </div>
        </div>
        <TrendChart direction={direction} magnitude={Math.abs(change)} />
      </div>
      
      <div className={`${color.bg} rounded-lg p-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-semibold ${color.text}`}>{color.indicator}</span>
          {change !== 0 && (
            <span className="text-sm text-slate-600">
              {change > 0 ? '+' : ''}{change.toFixed(3)}% ({percent > 0 ? '+' : ''}{percent.toFixed(2)}%)
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">vs last update</span>
      </div>
      
      <p className="text-xs text-slate-500 mt-3">
        {direction === 'down' && "Great time to lock in rates before they potentially rise again"}
        {direction === 'up' && "Rates are trending up - consider locking in soon"}
        {direction === 'stable' && "Rates have been stable - good time to compare options"}
      </p>
    </div>
  );
};

export default function RateTrends({ rates, trendData }: RateTrendsProps) {
  // Calculate current best rates
  const currentRates = useMemo(() => {
    const fixed5yr = rates.filter(r => 
      r.term_months === 60 && r.rate_type === "fixed"
    ).sort((a, b) => a.rate - b.rate);
    
    const variable5yr = rates.filter(r => 
      r.term_months === 60 && r.rate_type === "variable"
    ).sort((a, b) => a.rate - b.rate);
    
    return {
      fixed5yr: fixed5yr[0]?.rate || 0,
      variable5yr: variable5yr[0]?.rate || 0,
    };
  }, [rates]);

  // Mock trend data (in production this would come from API)
  const mockTrends = {
    fixed: {
      direction: 'down' as const,
      change: -0.12,
      percent_change: -3.2,
      days_since: 0
    },
    variable: {
      direction: 'stable' as const,
      change: 0.02,
      percent_change: 0.6,
      days_since: 0
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Rate Trends</h2>
          <p className="text-sm text-slate-500 mt-1">
            Latest rate movements and market direction
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Falling
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500"></span> Rising
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-slate-400"></span> Stable
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TrendIndicator
          label="5-Year Fixed Rate Trend"
          currentRate={currentRates.fixed5yr}
          trend={trendData || mockTrends.fixed}
        />
        <TrendIndicator
          label="5-Year Variable Rate Trend"
          currentRate={currentRates.variable5yr}
          trend={trendData || mockTrends.variable}
        />
      </div>
      
      {/* Historical insight */}
      <div className="mt-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Market Insight
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Fixed mortgage rates have been declining over the past month as bond yields have softened. 
          Variable rates have stabilized following the Bank of Canada&apos;s recent hold on the overnight rate. 
          This may be an opportune time to compare fixed-rate options if you prefer payment certainty.
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
          <span>Last updated: {new Date().toLocaleDateString('en-CA')}</span>
          <button className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
            View 90-day history
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
