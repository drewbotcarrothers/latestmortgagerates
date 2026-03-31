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

export interface HistoricalDataPoint {
  date: string;
  fixed_uninsured_best_rate: number;
  fixed_uninsured_best_lender: string;
  fixed_uninsured_avg_rate: number;
  fixed_insured_best_rate: number;
  fixed_insured_best_lender: string;
  fixed_insured_avg_rate: number;
  variable_uninsured_best_rate: number;
  variable_uninsured_best_lender: string;
  variable_uninsured_avg_rate: number;
  variable_uninsured_spread_to_prime: number;
  variable_insured_best_rate: number;
  variable_insured_best_lender: string;
  variable_insured_avg_rate: number;
  variable_insured_spread_to_prime: number;
  prime_rate: number;
  lender_count: number;
  total_rates: number;
  created_at: string;
}

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
  historicalData?: HistoricalDataPoint[];
  selectedRange: number;
  selectedType: 'fixed' | 'variable' | 'both';
  showInsured: boolean;
}

export default function RateTrendsChart({ 
  historicalData = [], 
  selectedRange, 
  selectedType, 
  showInsured 
}: RateTrendsChartProps) {
  
  const chartData = useMemo<ChartData>(() => {
    // If no data, return empty chart
    if (!historicalData || historicalData.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Filter to selected range
    const daysToShow = selectedRange;
    const filteredData = historicalData.slice(-daysToShow);

    const labels = filteredData.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
    });

    const datasets = [];

    // Fixed rates
    if (selectedType === 'fixed' || selectedType === 'both') {
      if (showInsured) {
        datasets.push({
          label: 'Fixed Insured',
          data: filteredData.map(d => d.fixed_insured_best_rate),
          borderColor: '#059669', // emerald-600
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5,
        });
      } else {
        datasets.push({
          label: 'Fixed Uninsured',
          data: filteredData.map(d => d.fixed_uninsured_best_rate),
          borderColor: '#10b981', // emerald-500
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
        });
      }
    }

    // Variable rates
    if (selectedType === 'variable' || selectedType === 'both') {
      if (showInsured) {
        datasets.push({
          label: 'Variable Insured',
          data: filteredData.map(d => d.variable_insured_best_rate),
          borderColor: '#0e7490', // cyan-700
          backgroundColor: 'rgba(14, 116, 144, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5,
        });
      } else {
        datasets.push({
          label: 'Variable Uninsured',
          data: filteredData.map(d => d.variable_uninsured_best_rate),
          borderColor: '#0d9488', // teal-600
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
        });
      }
    }

    return {
      labels,
      datasets,
    };
  }, [historicalData, selectedRange, selectedType, showInsured]);
  
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
          afterLabel: (context) => {
            const dataIndex = context.dataIndex;
            const dataPoint = historicalData.slice(-selectedRange)[dataIndex];
            if (!dataPoint) return '';
            
            // Add lender info to tooltip
            const datasetLabel = context.dataset.label || '';
            let lender = '';
            
            if (datasetLabel.includes('Fixed')) {
              lender = showInsured 
                ? dataPoint.fixed_insured_best_lender 
                : dataPoint.fixed_uninsured_best_lender;
            } else if (datasetLabel.includes('Variable')) {
              lender = showInsured 
                ? dataPoint.variable_insured_best_lender 
                : dataPoint.variable_uninsured_best_lender;
            }
            
            return lender ? `Best: @${lender}` : '';
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
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          color: '#64748b',
          callback: (_value, index) => {
            // Show fewer x-axis labels for cleaner look
            const labelCount = chartData.labels.length;
            const skip = Math.ceil(labelCount / 8);
            if (index % skip === 0) {
              return chartData.labels[index];
            }
            return '';
          },
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          color: '#64748b',
          callback: (value) => {
            if (typeof value === 'number') {
              return `${value.toFixed(2)}%`;
            }
            return `${value}%`;
          },
        },
        title: {
          display: true,
          text: 'Interest Rate',
          color: '#64748b',
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
        },
      },
    },
  };

  // Check if we have data
  if (!historicalData || historicalData.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-slate-50 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-slate-500">No historical data available</p>
          <p className="text-sm text-slate-400 mt-1">Data will appear after the first few scrapes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[400px]">
      <Line options={options} data={chartData} />
    </div>
  );
}
