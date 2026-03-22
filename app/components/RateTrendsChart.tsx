"use client";

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
    pointRadius: number;
    pointHoverRadius: number;
  }[];
}

interface RateTrendsChartProps {
  data?: ChartData | null;
  showInsured?: boolean;
}

function generateSampleData(): ChartData {
  // Generate 30 days of sample data
  const labels: string[] = [];
  const fixed: number[] = [];
  const variable: number[] = [];
  
  const today = new Date();
  let baseFixed = 3.72;
  let baseVariable = 3.45;
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }));
    
    // Simulate downward trend with some volatility
    const volatility = (Math.random() - 0.5) * 0.15;
    baseFixed = Math.max(3.5, Math.min(4.2, baseFixed + volatility - 0.01));
    baseVariable = Math.max(3.2, Math.min(3.8, baseVariable + volatility * 0.8));
    
    fixed.push(parseFloat(baseFixed.toFixed(2)));
    variable.push(parseFloat(baseVariable.toFixed(2)));
  }
  
  return {
    labels,
    datasets: [
      {
        label: '5-Year Fixed',
        data: fixed,
        borderColor: '#10b981', // emerald-500
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
      {
        label: '5-Year Variable',
        data: variable,
        borderColor: '#0d9488', // teal-600
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };
}

export default function RateTrendsChart({ data, showInsured = false }: RateTrendsChartProps) {
  const chartData = useMemo(() => data || generateSampleData(), [data]);
  
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 13,
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8,
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          color: '#64748b',
        },
      },
      y: {
        min: 3.0,
        max: 5.0,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          callback: (value) => `${value}%`,
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          color: '#64748b',
        },
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <Line options={options} data={chartData} />
    </div>
  );
}
