"""
Quick Statistics Generator
Get summary stats for your selected stocks to inform your narrative
"""

import pandas as pd
import numpy as np

# Load merged data
df = pd.read_csv('../TSX_Merged_Data.csv')

# CUSTOMIZE: Enter your selected stocks
SELECTED_STOCKS = ['RY', 'TD', 'ENB', 'BMO', 'BNS']  # Replace with your selection

# Filter to selected stocks
stocks = df[df['Symbol'].isin(SELECTED_STOCKS)].copy()

print(f"="*80)
print(f"QUICK STATISTICS SUMMARY")
print(f"="*80)
print(f"\nAnalyzing {len(stocks)} stocks: {', '.join(SELECTED_STOCKS)}\n")

if len(stocks) == 0:
    print("⚠ ERROR: No stocks found. Check your symbols.")
    exit()

# ============================================================================
# BASIC INFO
# ============================================================================

print(f"{'STOCK':<10} {'DESCRIPTION':<40} {'SECTOR':<20}")
print(f"{'-'*80}")
for idx, row in stocks.iterrows():
    desc = row['Description'][:38] + '..' if len(str(row['Description'])) > 40 else row['Description']
    sector = str(row['Sector'])[:18] + '..' if len(str(row['Sector'])) > 20 else row['Sector']
    print(f"{row['Symbol']:<10} {desc:<40} {sector:<20}")

# ============================================================================
# VALUATION METRICS
# ============================================================================

print(f"\n" + "="*80)
print(f"VALUATION METRICS")
print(f"="*80)

valuation_metrics = [
    'Price',
    'Market capitalization',
    'Price to earnings ratio',
    'Price to book ratio',
    'Price to sales ratio',
    'Enterprise value to EBITDA ratio, Trailing 12 months'
]

print(f"\n{'Metric':<50} {'Min':<12} {'Max':<12} {'Avg':<12}")
print(f"{'-'*86}")

for metric in valuation_metrics:
    if metric in stocks.columns:
        values = stocks[metric].dropna()
        if len(values) > 0:
            min_val = values.min()
            max_val = values.max()
            avg_val = values.mean()

            # Format based on metric
            if 'Market cap' in metric or 'Enterprise value' in metric and 'ratio' not in metric:
                print(f"{metric:<50} ${min_val/1e9:>10.2f}B ${max_val/1e9:>10.2f}B ${avg_val/1e9:>10.2f}B")
            elif 'Price' == metric:
                print(f"{metric:<50} ${min_val:>11.2f} ${max_val:>11.2f} ${avg_val:>11.2f}")
            else:
                print(f"{metric:<50} {min_val:>11.2f} {max_val:>11.2f} {avg_val:>11.2f}")

# ============================================================================
# DIVIDEND METRICS
# ============================================================================

print(f"\n" + "="*80)
print(f"DIVIDEND METRICS")
print(f"="*80)

dividend_metrics = [
    'Dividend yield %, Trailing 12 months',
    'Dividends per share, Annual',
    'Dividends per share growth %, Annual YoY',
    'Dividend payout ratio %, Trailing 12 months',
    'Continuous dividend payout',
    'Continuous dividend growth'
]

print(f"\n{'Metric':<50} {'Min':<12} {'Max':<12} {'Avg':<12}")
print(f"{'-'*86}")

for metric in dividend_metrics:
    if metric in stocks.columns:
        values = stocks[metric].dropna()
        if len(values) > 0:
            min_val = values.min()
            max_val = values.max()
            avg_val = values.mean()

            if 'Continuous' in metric:
                print(f"{metric:<50} {min_val:>11.0f} yrs {max_val:>10.0f} yrs {avg_val:>10.1f} yrs")
            elif '$' in metric or 'per share' in metric:
                print(f"{metric:<50} ${min_val:>10.2f} ${max_val:>10.2f} ${avg_val:>10.2f}")
            else:
                print(f"{metric:<50} {min_val:>10.2f}% {max_val:>10.2f}% {avg_val:>10.2f}%")

# ============================================================================
# PROFITABILITY METRICS
# ============================================================================

print(f"\n" + "="*80)
print(f"PROFITABILITY & EFFICIENCY")
print(f"="*80)

profitability_metrics = [
    'Revenue growth %, TTM YoY',
    'Operating margin %, Trailing 12 months',
    'Net margin %, Trailing 12 months',
    'Return on equity %, Trailing 12 months',
    'Return on assets %, Trailing 12 months',
    'Free cash flow margin %, Trailing 12 months'
]

print(f"\n{'Metric':<50} {'Min':<12} {'Max':<12} {'Avg':<12}")
print(f"{'-'*86}")

for metric in profitability_metrics:
    if metric in stocks.columns:
        values = stocks[metric].dropna()
        if len(values) > 0:
            min_val = values.min()
            max_val = values.max()
            avg_val = values.mean()
            print(f"{metric:<50} {min_val:>10.2f}% {max_val:>10.2f}% {avg_val:>10.2f}%")

# ============================================================================
# FINANCIAL HEALTH
# ============================================================================

print(f"\n" + "="*80)
print(f"FINANCIAL HEALTH")
print(f"="*80)

health_metrics = [
    'Current ratio, Quarterly',
    'Quick ratio, Quarterly',
    'Debt to equity ratio, Quarterly',
    'Cash to debt ratio, Quarterly'
]

print(f"\n{'Metric':<50} {'Min':<12} {'Max':<12} {'Avg':<12}")
print(f"{'-'*86}")

for metric in health_metrics:
    if metric in stocks.columns:
        values = stocks[metric].dropna()
        if len(values) > 0:
            min_val = values.min()
            max_val = values.max()
            avg_val = values.mean()
            print(f"{metric:<50} {min_val:>11.2f} {max_val:>11.2f} {avg_val:>11.2f}")

# ============================================================================
# PERFORMANCE
# ============================================================================

print(f"\n" + "="*80)
print(f"PRICE PERFORMANCE")
print(f"="*80)

performance_metrics = [
    'Performance % 1 week',
    'Performance % 1 month',
    'Performance % 3 months',
    'Performance % 6 months',
    'Performance % Year to date',
    'Performance % 1 year',
    'Performance % 5 years'
]

print(f"\n{'Metric':<50} {'Min':<12} {'Max':<12} {'Avg':<12}")
print(f"{'-'*86}")

for metric in performance_metrics:
    if metric in stocks.columns:
        values = stocks[metric].dropna()
        if len(values) > 0:
            min_val = values.min()
            max_val = values.max()
            avg_val = values.mean()
            print(f"{metric:<50} {min_val:>10.2f}% {max_val:>10.2f}% {avg_val:>10.2f}%")

# ============================================================================
# INTERESTING FACTS
# ============================================================================

print(f"\n" + "="*80)
print(f"INTERESTING FACTS FOR YOUR NARRATIVE")
print(f"="*80)

# Highest/Lowest for key metrics
facts = []

if 'Dividend yield %, Trailing 12 months' in stocks.columns:
    highest_yield = stocks.loc[stocks['Dividend yield %, Trailing 12 months'].idxmax()]
    lowest_yield = stocks.loc[stocks['Dividend yield %, Trailing 12 months'].idxmin()]
    facts.append(f"📊 Highest yield: {highest_yield['Symbol']} ({highest_yield['Dividend yield %, Trailing 12 months']:.2f}%)")
    facts.append(f"📊 Lowest yield: {lowest_yield['Symbol']} ({lowest_yield['Dividend yield %, Trailing 12 months']:.2f}%)")

if 'Performance % 1 year' in stocks.columns:
    best_perf = stocks.loc[stocks['Performance % 1 year'].idxmax()]
    facts.append(f"📈 Best 1-year performance: {best_perf['Symbol']} ({best_perf['Performance % 1 year']:.2f}%)")

if 'Market capitalization' in stocks.columns:
    largest = stocks.loc[stocks['Market capitalization'].idxmax()]
    total_market_cap = stocks['Market capitalization'].sum()
    facts.append(f"💰 Largest by market cap: {largest['Symbol']} (${largest['Market capitalization']/1e9:.2f}B)")
    facts.append(f"💰 Combined market cap: ${total_market_cap/1e9:.2f}B")

if 'Return on equity %, Trailing 12 months' in stocks.columns:
    highest_roe = stocks.loc[stocks['Return on equity %, Trailing 12 months'].idxmax()]
    facts.append(f"🎯 Highest ROE: {highest_roe['Symbol']} ({highest_roe['Return on equity %, Trailing 12 months']:.2f}%)")

if 'Continuous dividend payout' in stocks.columns:
    longest_payout = stocks.loc[stocks['Continuous dividend payout'].idxmax()]
    avg_payout_years = stocks['Continuous dividend payout'].mean()
    facts.append(f"🏆 Longest dividend streak: {longest_payout['Symbol']} ({longest_payout['Continuous dividend payout']:.0f} years)")
    facts.append(f"🏆 Average dividend streak: {avg_payout_years:.1f} years")

print()
for fact in facts:
    print(f"  {fact}")

# ============================================================================
# SECTOR DISTRIBUTION
# ============================================================================

print(f"\n" + "="*80)
print(f"SECTOR DISTRIBUTION")
print(f"="*80)
print()
print(stocks['Sector'].value_counts())

# ============================================================================
# TSX COMPARISON
# ============================================================================

print(f"\n" + "="*80)
print(f"HOW DO THESE COMPARE TO TSX AVERAGE?")
print(f"="*80)

comparison_metrics = [
    'Dividend yield %, Trailing 12 months',
    'Price to earnings ratio',
    'Return on equity %, Trailing 12 months',
    'Performance % 1 year'
]

print(f"\n{'Metric':<50} {'Your Avg':<15} {'TSX Avg':<15} {'Diff':<15}")
print(f"{'-'*95}")

for metric in comparison_metrics:
    if metric in df.columns:
        your_avg = stocks[metric].mean()
        tsx_avg = df[metric].mean()
        diff = your_avg - tsx_avg

        if pd.notna(your_avg) and pd.notna(tsx_avg):
            diff_symbol = "✓" if diff > 0 else "✗"
            print(f"{metric:<50} {your_avg:>14.2f} {tsx_avg:>14.2f} {diff:>13.2f} {diff_symbol}")

print(f"\n" + "="*80)
print(f"Use these stats to craft your narrative!")
print(f"="*80)
