"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface Rate {
  lender_name: string;
  lender_slug: string;
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type: string;
  apr?: string | null;
  ltv_tier?: string | null;
  spread_to_prime?: string | null;
}

interface RateStatsProps {
  rates: Rate[];
}

export default function RateStats({ rates }: RateStatsProps) {
  // Calculate statistics
  const stats = {
    fixed5yrUninsured: {
      rates: rates.filter(r => r.term_months === 60 && r.rate_type === "fixed" && r.mortgage_type === "uninsured"),
      label: "5-Year Fixed",
      icon: TrendingDown,
      color: "emerald",
    },
    fixed5yrInsured: {
      rates: rates.filter(r => r.term_months === 60 && r.rate_type === "fixed" && r.mortgage_type === "insured"),
      label: "5-Year Fixed (Insured)",
      icon: TrendingDown,
      color: "teal",
    },
    variable5yrUninsured: {
      rates: rates.filter(r => r.term_months === 60 && r.rate_type === "variable" && r.mortgage_type === "uninsured"),
      label: "5-Year Variable",
      icon: TrendingDown,
      color: "cyan",
    },
    variable5yrInsured: {
      rates: rates.filter(r => r.term_months === 60 && r.rate_type === "variable" && r.mortgage_type === "insured"),
      label: "5-Year Variable (Insured)",
      icon: TrendingDown,
      color: "teal",
    },
  };

  const calcStats = (rateList: Rate[]) => {
    if (rateList.length === 0) return null;
    const sorted = [...rateList].sort((a, b) => a.rate - b.rate);
    const lowest = sorted[0];
    const highest = sorted[sorted.length - 1];
    const avg = sorted.reduce((acc, r) => acc + r.rate, 0) / sorted.length;
    
    // Calculate spread between lowest and highest
    const spread = highest.rate - lowest.rate;
    const spreadPercent = ((spread / highest.rate) * 100).toFixed(1);
    
    return {
      lowest,
      highest,
      avg: avg.toFixed(2),
      count: sorted.length,
      spread: spread.toFixed(2),
      spreadPercent,
    };
  };

  const StatCard = ({ title, data, icon: Icon, color }: { 
    title: string; 
    data: Rate[]; 
    icon: typeof TrendingDown;
    color: string;
  }) => {
    const stats = calcStats(data);
    if (!stats) return null;

    const colorClasses: Record<string, { bg: string; text: string; border: string; light: string }> = {
      emerald: { 
        bg: "bg-emerald-50", 
        text: "text-emerald-700", 
        border: "border-emerald-200",
        light: "text-emerald-600"
      },
      teal: { 
        bg: "bg-teal-50", 
        text: "text-teal-700", 
        border: "border-teal-200",
        light: "text-teal-600"
      },
      cyan: { 
        bg: "bg-cyan-50", 
        text: "text-cyan-700", 
        border: "border-cyan-200",
        light: "text-cyan-600"
      },
    };

    const colors = colorClasses[color] || colorClasses.emerald;

    return (
      <div className="card-default p-5 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${colors.bg}`}>
            <Icon className={`w-5 h-5 ${colors.text}`} />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        </div>
        
        <div className="space-y-4">
          {/* Best Rate */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-slate-500">Best Rate</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-emerald-600">{stats.lowest.rate.toFixed(2)}%</span>
              <div className="text-xs text-slate-500 truncate max-w-[150px]" title={stats.lowest.lender_name}>
                {stats.lowest.lender_name}
              </div>
            </div>
          </div>
          
          {/* Average Rate */}
          <div className="flex items-baseline justify-between border-t border-slate-100 pt-3">
            <span className="text-sm text-slate-500">Market Average</span>
            <div className="text-right">
              <span className={`text-xl font-semibold ${colors.light}`}>{stats.avg}%</span>
              <div className="text-xs text-slate-400">{stats.count} lenders</div>
            </div>
          </div>
          
          {/* Savings Potential */}
          <div className={`${colors.bg} rounded-lg p-3 mt-2`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${colors.text}`}>Potential Savings</span>
              <span className={`text-sm font-bold ${colors.text}`}>{stats.spread}%</span>
            </div>
            <p className={`text-xs ${colors.light} mt-1`}>
              Save up to {stats.spreadPercent}% by choosing the best rate
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Market Overview</h2>
          <p className="text-sm text-slate-500 mt-1">Today's best rates and potential savings</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Best
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-teal-500"></span> Competitive
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        <StatCard 
          title={stats.fixed5yrUninsured.label} 
          data={stats.fixed5yrUninsured.rates}
          icon={stats.fixed5yrUninsured.icon}
          color={stats.fixed5yrUninsured.color}
        />
        <StatCard 
          title={stats.variable5yrUninsured.label} 
          data={stats.variable5yrUninsured.rates}
          icon={stats.variable5yrUninsured.icon}
          color={stats.variable5yrUninsured.color}
        />
      </div>
    </div>
  );
}
