"""
BCE Expanded Valuation Analysis
Comprehensive valuation metrics beyond P/E ratio
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
from pathlib import Path

# Setup
OUTPUT_DIR = Path('../output/bce_analysis')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

plt.rcParams['figure.figsize'] = (14, 8)
plt.rcParams['font.size'] = 11
plt.rcParams['axes.titlesize'] = 16
plt.rcParams['axes.labelsize'] = 12

COLORS = {
    'bce': '#1E88E5',
    'sector': '#757575', 
    'positive': '#43A047',
    'negative': '#E53935',
    'accent': '#FB8C00'
}

print("="*80)
print("BCE EXPANDED VALUATION ANALYSIS")
print("="*80)

# Load data
df = pd.read_csv('../TSX_Merged_Data.csv', low_memory=False)
bce = df[df['Symbol'] == 'BCE'].iloc[0]
telecom = df[df['Sector'] == 'Communications'].copy()

# Check available columns for price change
price_change_cols = [col for col in bce.index if 'Price' in col and 'Change' in col]
print(f"\nAvailable price change columns: {price_change_cols[:5] if price_change_cols else 'None found'}")

print(f"\nAnalyzing: BCE Inc.")
print(f"Current Price: ${bce['Price']:.2f}")
print(f"Market Cap: ${bce['Market capitalization']/1e9:.1f}B")

# ============================================
# CHART 4: COMPREHENSIVE VALUATION METRICS
# ============================================
print("\nGenerating Chart 4: Comprehensive Valuation Metrics...")

fig, axes = plt.subplots(2, 3, figsize=(18, 10))
fig.suptitle('BCE: Multi-Metric Valuation Analysis vs Sector', fontsize=20, fontweight='bold', y=0.98)

metrics_data = []

# 1. P/E Ratio
ax = axes[0, 0]
bce_pe = bce['Price to earnings ratio']
sector_pe = telecom['Price to earnings ratio'].replace(0, np.nan).mean()
values = [bce_pe, sector_pe]
bars = ax.bar(['BCE', 'Sector Avg'], values, color=[COLORS['bce'], COLORS['sector']], width=0.5)
ax.set_title('P/E Ratio (Price/Earnings)', fontsize=14, fontweight='bold', pad=10)
ax.set_ylabel('Multiple (x)', fontsize=11)
ax.axhline(y=sector_pe, color=COLORS['accent'], linestyle='--', alpha=0.7, label=f'Sector: {sector_pe:.1f}x')
for bar, val in zip(bars, values):
    if pd.notna(val):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3, f'{val:.1f}x', 
                ha='center', fontsize=11, fontweight='bold')
discount = ((sector_pe - bce_pe) / sector_pe * 100) if sector_pe > 0 else 0
ax.text(0.5, 0.95, f'{discount:.0f}% below sector', transform=ax.transAxes, ha='center', 
        fontsize=10, style='italic', color=COLORS['positive'] if discount > 0 else COLORS['negative'])
metrics_data.append(('P/E Ratio', bce_pe, sector_pe, discount))

# 2. P/B Ratio
ax = axes[0, 1]
bce_pb = bce['Price to book ratio']
sector_pb = telecom['Price to book ratio'].replace(0, np.nan).mean()
values = [bce_pb, sector_pb]
bars = ax.bar(['BCE', 'Sector Avg'], values, color=[COLORS['bce'], COLORS['sector']], width=0.5)
ax.set_title('P/B Ratio (Price/Book Value)', fontsize=14, fontweight='bold', pad=10)
ax.set_ylabel('Multiple (x)', fontsize=11)
ax.axhline(y=sector_pb, color=COLORS['accent'], linestyle='--', alpha=0.7)
for bar, val in zip(bars, values):
    if pd.notna(val):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1, f'{val:.2f}x', 
                ha='center', fontsize=11, fontweight='bold')
discount = ((sector_pb - bce_pb) / sector_pb * 100) if sector_pb > 0 else 0
ax.text(0.5, 0.95, f'{discount:.0f}% below sector', transform=ax.transAxes, ha='center', 
        fontsize=10, style='italic', color=COLORS['positive'] if discount > 0 else COLORS['negative'])
metrics_data.append(('P/B Ratio', bce_pb, sector_pb, discount))

# 3. Dividend Yield (replacing P/S)
ax = axes[0, 2]
bce_div = bce['Dividend yield % (indicated)']
sector_div = telecom['Dividend yield % (indicated)'].replace(0, np.nan).mean()
values = [bce_div, sector_div]
bars = ax.bar(['BCE', 'Sector Avg'], values, color=[COLORS['bce'], COLORS['sector']], width=0.5)
ax.set_title('Dividend Yield', fontsize=14, fontweight='bold', pad=10)
ax.set_ylabel('Yield (%)', fontsize=11)
ax.axhline(y=sector_div, color=COLORS['accent'], linestyle='--', alpha=0.7)
for bar, val in zip(bars, values):
    if pd.notna(val):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1, f'{val:.2f}%', 
                ha='center', fontsize=11, fontweight='bold')
premium = ((bce_div - sector_div) / sector_div * 100) if sector_div > 0 else 0
ax.text(0.5, 0.95, f'{premium:.0f}% above sector', transform=ax.transAxes, ha='center', 
        fontsize=10, style='italic', color=COLORS['positive'] if premium > 0 else COLORS['negative'])
metrics_data.append(('Div Yield', bce_div, sector_div, premium))

# 4. ROE (Return on Equity)
ax = axes[1, 0]
roe_col = 'Return on equity %'
bce_roe = bce[roe_col] if roe_col in bce else np.nan
if pd.notna(bce_roe):
    sector_roe = telecom[roe_col].replace(0, np.nan).mean()
    values = [bce_roe, sector_roe]
    bars = ax.bar(['BCE', 'Sector Avg'], values, color=[COLORS['bce'], COLORS['sector']], width=0.5)
    ax.set_title('ROE (Return on Equity)', fontsize=14, fontweight='bold', pad=10)
    ax.set_ylabel('ROE (%)', fontsize=11)
    ax.axhline(y=sector_roe, color=COLORS['accent'], linestyle='--', alpha=0.7)
    for bar, val in zip(bars, values):
        if pd.notna(val):
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5, f'{val:.1f}%', 
                    ha='center', fontsize=11, fontweight='bold')
    discount = ((sector_roe - bce_roe) / sector_roe * 100) if sector_roe > 0 else 0
    ax.text(0.5, 0.95, f'{discount:.0f}% vs sector', transform=ax.transAxes, ha='center', 
            fontsize=10, style='italic', color=COLORS['positive'] if discount < 0 else COLORS['negative'])
    metrics_data.append(('ROE', bce_roe, sector_roe, discount))
else:
    ax.text(0.5, 0.5, 'ROE data not available', 
            ha='center', va='center', transform=ax.transAxes, fontsize=11)
    ax.set_title('ROE (N/A)', fontsize=14, fontweight='bold')

# 5. Debt/Equity Ratio
ax = axes[1, 1]
de_col = 'Debt to equity ratio'
bce_de = bce[de_col] if de_col in bce else np.nan
if pd.notna(bce_de) and bce_de != 0:
    sector_de = telecom[de_col].replace(0, np.nan).mean()
    values = [bce_de, sector_de]
    bars = ax.bar(['BCE', 'Sector Avg'], values, color=[COLORS['bce'], COLORS['sector']], width=0.5)
    ax.set_title('Debt/Equity Ratio', fontsize=14, fontweight='bold', pad=10)
    ax.set_ylabel('D/E Ratio', fontsize=11)
    ax.axhline(y=sector_de, color=COLORS['accent'], linestyle='--', alpha=0.7)
    for bar, val in zip(bars, values):
        if pd.notna(val):
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1, f'{val:.2f}x', 
                    ha='center', fontsize=11, fontweight='bold')
    discount = ((bce_de - sector_de) / sector_de * 100) if sector_de > 0 else 0
    ax.text(0.5, 0.95, f'{discount:.0f}% vs sector', transform=ax.transAxes, ha='center', 
            fontsize=10, style='italic', color=COLORS['negative'] if discount > 0 else COLORS['positive'])
    metrics_data.append(('D/E Ratio', bce_de, sector_de, discount))
else:
    ax.text(0.5, 0.5, 'D/E data not available', 
            ha='center', va='center', transform=ax.transAxes, fontsize=11)
    ax.set_title('D/E Ratio (N/A)', fontsize=14, fontweight='bold')

# 6. Price vs Historical Context
ax = axes[1, 2]
current = bce['Price']
# Create price scenarios based on different multiples
eps = current / bce_pe if bce_pe > 0 else 0

scenarios = {
    'Current': current,
    '5x P/E': eps * 5,
    '8x P/E': eps * 8,
    '12x P/E': eps * 12
}

labels = list(scenarios.keys())
values = list(scenarios.values())
colors = [COLORS['negative'], COLORS['accent'], COLORS['bce'], COLORS['positive']]

bars = ax.bar(labels, values, color=colors, width=0.5)
ax.set_title('Price at Different P/E Multiples', fontsize=14, fontweight='bold', pad=10)
ax.set_ylabel('Price ($)', fontsize=11)
ax.axhline(y=current, color='black', linestyle='--', linewidth=2)

for bar, val in zip(bars, values):
    if pd.notna(val):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5, f'${val:.0f}', 
                ha='center', fontsize=11, fontweight='bold')

plt.tight_layout(rect=[0, 0, 1, 0.96])
plt.savefig(OUTPUT_DIR / 'chart4_valuation_metrics.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print(f"  Saved: chart4_valuation_metrics.png")

# ============================================
# CHART 5: VALUATION SUMMARY SCORECARD
# ============================================
print("\nGenerating Chart 5: Valuation Scorecard...")

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))

# Left: Valuation Discount/Premium Chart
ax = ax1
valid_metrics = [m for m in metrics_data if pd.notna(m[1])]
metrics = [m[0] for m in valid_metrics]
discounts = [m[3] for m in valid_metrics]
colors = [COLORS['positive'] if d > 0 else COLORS['negative'] for d in discounts]

bars = ax.barh(metrics, discounts, color=colors, height=0.6)
ax.set_xlabel('Discount/Premium vs Sector (%)', fontsize=12, fontweight='bold')
ax.set_title('BCE Valuation: Discount/Premium to Sector', fontsize=16, fontweight='bold', pad=15)
ax.axvline(x=0, color='black', linestyle='-', linewidth=1)

for bar, val in zip(bars, discounts):
    label = f'{val:.0f}%'
    x_pos = val + 2 if val > 0 else val - 2
    ha = 'left' if val > 0 else 'right'
    ax.text(x_pos, bar.get_y() + bar.get_height()/2, label, 
            va='center', ha=ha, fontsize=11, fontweight='bold')

# Add summary
if valid_metrics:
    avg_discount = np.mean([abs(d) for d in discounts if d > 0])
    avg_discount_text = f'Avg Discount:\n{avg_discount:.0f}%'
    ax.text(0.98, 0.02, avg_discount_text, transform=ax.transAxes, fontsize=14, 
            fontweight='bold', ha='right', va='bottom',
            bbox=dict(boxstyle='round', facecolor=COLORS['positive'], alpha=0.3))

# Right: Fair Value Estimates
ax = ax2

# Calculate fair value using different multiples
eps = current / bce_pe if bce_pe > 0 else 0

# Conservative to optimistic scenarios
scenarios = {
    'Conservative\n(8x P/E)': eps * 8,
    'Fair Value\n(10x P/E)': eps * 10,
    'Historical Avg\n(12x P/E)': eps * 12,
    'Optimistic\n(15x P/E)': eps * 15
}

values = list(scenarios.values())
labels = list(scenarios.keys())
colors = [COLORS['negative'], COLORS['accent'], COLORS['bce'], COLORS['positive']]

bars = ax.bar(labels, values, color=colors, width=0.6)
ax.axhline(y=current, color='black', linestyle='--', linewidth=2, label=f'Current: ${current:.2f}')
ax.set_ylabel('Price ($)', fontsize=12, fontweight='bold')
ax.set_title('BCE Fair Value Estimates', fontsize=16, fontweight='bold', pad=15)
ax.legend(loc='upper left', fontsize=11)

for bar, val in zip(bars, values):
    if pd.notna(val):
        upside = ((val - current) / current * 100)
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1, 
                f'${val:.0f}\n({upside:+.0f}%)', 
                ha='center', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.savefig(OUTPUT_DIR / 'chart5_valuation_scorecard.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print(f"  Saved: chart5_valuation_scorecard.png")

# ============================================
# PRINT SUMMARY TABLE
# ============================================
print("\n" + "="*80)
print("VALUATION SUMMARY")
print("="*80)
print(f"\n{'Metric':<15} {'BCE':>12} {'Sector':>12} {'Diff':>12}")
print("-"*55)
for metric, bce_val, sector_val, discount in metrics_data:
    if pd.notna(bce_val):
        discount_str = f"{discount:.0f}%"
        print(f"{metric:<15} {bce_val:>12.2f} {sector_val:>12.2f} {discount_str:>12}")

print("\n" + "="*80)
print("FAIR VALUE ESTIMATES")
print("="*80)
print(f"\nCurrent Price: ${current:.2f}")
print(f"\n{'Scenario':<25} {'Target':>12} {'Upside':>12}")
print("-"*55)
for name, target in scenarios.items():
    if pd.notna(target):
        upside = ((target - current) / current * 100) if target > 0 else 0
        print(f"{name.replace(chr(10), ' '):<25} ${target:>11.2f} {upside:>11.0f}%")

print("\n" + "="*80)
print("FILES GENERATED")
print("="*80)
print("1. chart4_valuation_metrics.png - Multi-metric comparison")
print("2. chart5_valuation_scorecard.png - Discount analysis & fair value")
print(f"\nLocation: {OUTPUT_DIR}")
