"use client";

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
      label: "5-Year Fixed Uninsured",
    },
    fixed5yrInsured: {
      rates: rates.filter(r => r.term_months === 60 && r.rate_type === "fixed" && r.mortgage_type === "insured"),
      label: "5-Year Fixed Insured",
    },
    variable5yrUninsured: {
      rates: rates.filter(r => r.term_months === 60 && r.rate_type === "variable" && r.mortgage_type === "uninsured"),
      label: "5-Year Variable Uninsured",
    },
    variable5yrInsured: {
      rates: rates.filter(r => r.term_months === 60 && r.rate_type === "variable" && r.mortgage_type === "insured"),
      label: "5-Year Variable Insured",
    },
    fixed3yrUninsured: {
      rates: rates.filter(r => r.term_months === 36 && r.rate_type === "fixed" && r.mortgage_type === "uninsured"),
      label: "3-Year Fixed Uninsured",
    },
  };

  const calcStats = (rateList: Rate[]) => {
    if (rateList.length === 0) return null;
    const sorted = [...rateList].sort((a, b) => a.rate - b.rate);
    const lowest = sorted[0];
    const highest = sorted[sorted.length - 1];
    const avg = sorted.reduce((acc, r) => acc + r.rate, 0) / sorted.length;
    
    return {
      lowest,
      highest,
      avg: avg.toFixed(2),
      count: sorted.length,
    };
  };

  const StatCard = ({ title, data }: { title: string; data: Rate[] }) => {
    const stats = calcStats(data);
    if (!stats) return null;

    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xs text-gray-500">Lowest</div>
            <div className="text-lg font-bold text-green-600">{stats.lowest.rate.toFixed(2)}%</div>
            <div className="text-xs text-gray-600">{stats.lowest.lender_name}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Average</div>
            <div className="text-lg font-bold text-blue-600">{stats.avg}%</div>
            <div className="text-xs text-gray-600">{stats.count} lenders</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Highest</div>
            <div className="text-lg font-bold text-red-600">{stats.highest.rate.toFixed(2)}%</div>
            <div className="text-xs text-gray-600">{stats.highest.lender_name}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Current Rate Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title={stats.fixed5yrUninsured.label} data={stats.fixed5yrUninsured.rates} />
        <StatCard title={stats.fixed5yrInsured.label} data={stats.fixed5yrInsured.rates} />
        <StatCard title={stats.variable5yrUninsured.label} data={stats.variable5yrUninsured.rates} />
      </div>
    </div>
  );
}
