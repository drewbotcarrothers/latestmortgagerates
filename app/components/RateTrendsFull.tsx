"use client";

import { useState, useMemo } from 'react';
import RateTrendsChart, { HistoricalDataPoint } from './RateTrendsChart';

interface TimeRange {
  days: number;
  label: string;
}

const TIME_RANGES: TimeRange[] = [
  { days: 7, label: '7 Days' },
  { days: 30, label: '30 Days' },
  { days: 60, label: '60 Days' },
  { days: 90, label: '90 Days' },
];

interface RateTrendsFullProps {
  historicalData?: HistoricalDataPoint[];
}

export default function RateTrendsFull({ historicalData = [] }: RateTrendsFullProps) {
  const [selectedRange, setSelectedRange] = useState<number>(30);
  const [showInsured, setShowInsured] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<'fixed' | 'variable' | 'both'>('both');

  // Calculate stats based on selected data
  const stats = useMemo(() => {
    if (!historicalData || historicalData.length === 0) {
      return null;
    }

    // Get data for selected range
    const rangeData = historicalData.slice(-selectedRange);
    if (rangeData.length === 0) return null;

    const firstDay = rangeData[0];
    const lastDay = rangeData[rangeData.length - 1];

    // Determine which rate field to use based on filters
    const getRate = (day: HistoricalDataPoint, type: 'fixed' | 'variable') => {
      if (type === 'fixed') {
        return showInsured ? day.fixed_insured_best_rate : day.fixed_uninsured_best_rate;
      }
      return showInsured ? day.variable_insured_best_rate : day.variable_uninsured_best_rate;
    };

    const getLender = (day: HistoricalDataPoint, type: 'fixed' | 'variable') => {
      if (type === 'fixed') {
        return showInsured ? day.fixed_insured_best_lender : day.fixed_uninsured_best_lender;
      }
      return showInsured ? day.variable_insured_best_lender : day.variable_uninsured_best_lender;
    };

    // Best rates in range
    let bestRate = Infinity;
    let bestLender = '';
    let highRate = -Infinity;
    let highLender = '';

    rangeData.forEach(day => {
      ['fixed', 'variable'].forEach((type) => {
        if (selectedType === 'both' || selectedType === type) {
          const rate = getRate(day, type as 'fixed' | 'variable');
          const lender = getLender(day, type as 'fixed' | 'variable');
          if (rate < bestRate) {
            bestRate = rate;
            bestLender = lender;
          }
          if (rate > highRate) {
            highRate = rate;
            highLender = lender;
          }
        }
      });
    });

    // Calculate average rate across the range
    let totalSum = 0;
    let totalCount = 0;
    rangeData.forEach(day => {
      ['fixed', 'variable'].forEach((type) => {
        if (selectedType === 'both' || selectedType === type) {
          totalSum += getRate(day, type as 'fixed' | 'variable');
          totalCount++;
        }
      });
    });
    const avgRate = totalCount > 0 ? totalSum / totalCount : 0;

    // Current rate (from last day)
    let currentRate = 0;
    if (selectedType === 'fixed') {
      currentRate = getRate(lastDay, 'fixed');
    } else if (selectedType === 'variable') {
      currentRate = getRate(lastDay, 'variable');
    } else {
      // For 'both', use fixed as reference
      currentRate = getRate(lastDay, 'fixed');
    }

    // Calculate change from first day
    let firstRate = 0;
    if (selectedType === 'fixed') {
      firstRate = getRate(firstDay, 'fixed');
    } else if (selectedType === 'variable') {
      firstRate = getRate(firstDay, 'variable');
    } else {
      firstRate = getRate(firstDay, 'fixed');
    }

    const change = currentRate - firstRate;
    const changePercent = firstRate > 0 ? ((change / firstRate) * 100).toFixed(1) : '0.0';

    // Trend direction (compare last 7 days vs first 7 days if available)
    const recentDays = rangeData.slice(-7);
    const earlyDays = rangeData.slice(0, Math.min(7, rangeData.length));
    const recentAvg = recentDays.reduce((sum, d) => sum + getRate(d, 'fixed'), 0) / recentDays.length;
    const earlyAvg = earlyDays.reduce((sum, d) => sum + getRate(d, 'fixed'), 0) / earlyDays.length;
    const trendDirection = recentAvg < earlyAvg ? 'falling' : recentAvg > earlyAvg ? 'rising' : 'stable';

    return {
      bestRate: bestRate === Infinity ? 0 : bestRate,
      bestLender,
      highRate: highRate === -Infinity ? 0 : highRate,
      highLender,
      avgRate,
      change: change.toFixed(2),
      changePercent,
      trendDirection,
      primeRate: lastDay?.prime_rate || 5.45,
    };
  }, [historicalData, selectedRange, selectedType, showInsured]);

  // Check if we have at least two data points for meaningful display
  const hasEnoughData = historicalData && historicalData.length >= 2;

  return (
    <div className="card-default overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Rate Trends</h2>
            <p className="text-sm text-slate-500 mt-1">
              Track mortgage rate movements over time
            </p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            {TIME_RANGES.map((range) => (
              <button
                key={range.days}
                onClick={() => setSelectedRange(range.days)}
                disabled={range.days > (historicalData?.length || 0) && historicalData.length > 0}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedRange === range.days
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                } ${range.days > (historicalData?.length || 0) && historicalData.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-3">
          {/* Rate Type Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            {(['both', 'fixed', 'variable'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                  selectedType === type
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'both' ? 'All Rates' : type}
              </button>
            ))}
          </div>
          
          {/* Insured Toggle */}
          <button
            onClick={() => setShowInsured(!showInsured)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
              showInsured
                ? 'bg-teal-50 border-teal-200 text-teal-700'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {showInsured ? '✓' : ''} Show Insured Rates
          </button>
        </div>
      </div>
      
      {/* Chart Area */}
      <div className="p-6">
        {hasEnoughData ? (
          <div className="h-[400px]">
            <RateTrendsChart 
              historicalData={historicalData}
              selectedRange={selectedRange}
              selectedType={selectedType}
              showInsured={showInsured}
            />
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center bg-slate-50 rounded-lg">
            <div className="text-center px-4">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-slate-500">Collecting historical data...</p>
              <p className="text-sm text-slate-400 mt-1">Trends will appear after a few days of rate collection</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Stats Summary */}
      {stats && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">{selectedRange}-Day Low</div>
              <div className="text-2xl font-bold text-emerald-600">{stats.bestRate.toFixed(2)}%</div>
              <div className="text-xs text-slate-500 mt-1">
                @ {stats.bestLender}
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">{selectedRange}-Day High</div>
              <div className="text-2xl font-bold text-slate-700">{stats.highRate.toFixed(2)}%</div>
              <div className="text-xs text-slate-500 mt-1">
                @ {stats.highLender}
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">{selectedRange}-Day Avg</div>
              <div className="text-2xl font-bold text-slate-700">{stats.avgRate.toFixed(2)}%</div>
              <div className="text-xs text-slate-500 mt-1">
                Overall average
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Change ({selectedRange}d)</div>
              <div className={`text-2xl font-bold flex items-center gap-1 ${
                parseFloat(stats.change) < 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {parseFloat(stats.change) < 0 ? '↓' : '↑'} {Math.abs(parseFloat(stats.change)).toFixed(2)}%
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {stats.changePercent}% from start
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Trend Direction</div>
              <div className={`text-2xl font-bold flex items-center gap-2 ${
                stats.trendDirection === 'falling' ? 'text-emerald-600' :
                stats.trendDirection === 'rising' ? 'text-red-600' : 'text-slate-600'
              }`}>
                {stats.trendDirection === 'falling' ? '↓ Falling' :
                 stats.trendDirection === 'rising' ? '↑ Rising' : '→ Stable'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Recent {selectedRange >= 30 ? '2 weeks' : 'period'}
              </div>
            </div>
          </div>
          
          {/* Data Source */}
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Data from {historicalData?.length || 0} days of historical rates</span>
            </div>
            <div className="text-xs text-slate-400">
              Prime Rate: {stats.primeRate}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
