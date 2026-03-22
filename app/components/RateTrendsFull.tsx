"use client";

import { useState } from 'react';
import RateTrendsChart from './RateTrendsChart';

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

export default function RateTrendsFull() {
  const [selectedRange, setSelectedRange] = useState<number>(30);
  const [showInsured, setShowInsured] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<'fixed' | 'variable' | 'both'>('both');

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
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedRange === range.days
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
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
        <div className="h-[400px]">
          <RateTrendsChart showInsured={showInsured} />
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">30-Day Low</div>
            <div className="text-2xl font-bold text-emerald-600">3.64%</div>
            <div className="text-xs text-slate-500 mt-1">
              @ nesto
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">30-Day High</div>
            <div className="text-2xl font-bold text-slate-700">4.89%</div>
            <div className="text-xs text-slate-500 mt-1">
              @ CIBC
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Change (30d)</div>
            <div className="text-2xl font-bold text-emerald-600 flex items-center gap-1">
              ↓ 0.12%
            </div>
            <div className="text-xs text-emerald-600 mt-1">
              -3.2% from peak
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Trend Direction</div>
            <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
              ↓ Falling
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Past 2 weeks
            </div>
          </div>
        </div>
        
        {/* Data Source */}
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Data sourced from {selectedRange === 90 ? '90' : selectedRange} days of historical rates</span>
          </div>
          <button className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
            Download CSV
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
