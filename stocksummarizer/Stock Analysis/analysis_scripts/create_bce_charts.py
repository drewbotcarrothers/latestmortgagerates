"""
Visualization Generator for BCE Stock Analysis
Creates Twitter/YouTube-optimized charts
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os

# Create output directory if needed
os.makedirs('../output/bce_analysis', exist_ok=True)

# Configuration
plt.rcParams['figure.figsize'] = (12, 6.75)
plt.rcParams['font.size'] = 12
plt.rcParams['axes.titlesize'] = 20
plt.rcParams['axes.labelsize'] = 14
plt.rcParams['font.weight'] = 'bold'

# Colors
COLOR_PRIMARY = '#1E88E5'
COLOR_SECONDARY = '#43A047'
COLOR_ACCENT = '#FB8C00'
COLOR_BG = '#F5F5F5'

# Load data
df = pd.read_csv('../TSX_Merged_Data.csv', low_memory=False)

# Get BCE and telecommunications sector for comparison
bce = df[df['Symbol'] == 'BCE'].iloc[0]
telecom_stocks = df[df['Sector'] == 'Communications'].copy()

print(f"="*80)
print(f"BCE VISUALIZATION GENERATOR")
print(f"="*80)
print(f"\nStock: BCE - {bce['Description']}")
print(f"Generating charts for Twitter/YouTube content...\n")

# Chart 1: P/E Comparison vs Telecom Peers
print("Chart 1: P/E Ratio Comparison...")
peers = ['BCE', 'T', 'RCI.B', 'QBR.B', 'SJR.B']
peer_data = df[df['Symbol'].isin(peers) & df['Price to earnings ratio'].notna()].copy()
peer_data = peer_data.sort_values('Price to earnings ratio')

fig, ax = plt.subplots(figsize=(12, 6.75))
colors = [COLOR_SECONDARY if s == 'BCE' else COLOR_PRIMARY for s in peer_data['Symbol']]
bars = ax.barh(peer_data['Symbol'], peer_data['Price to earnings ratio'], color=colors, height=0.6)

ax.set_xlabel('P/E Ratio', fontsize=14, fontweight='bold')
ax.set_title('BCE vs Telecom Peers: P/E Ratio Comparison\n(Lower = Better Value)', fontsize=18, fontweight='bold', pad=20)
ax.axvline(x=peer_data['Price to earnings ratio'].mean(), color=COLOR_ACCENT, linestyle='--', linewidth=2, label=f'Sector Avg: {peer_data["Price to earnings ratio"].mean():.1f}x')
ax.legend(loc='lower right', fontsize=12)

# Add value labels
for bar, val in zip(bars, peer_data['Price to earnings ratio']):
    ax.text(val + 0.3, bar.get_y() + bar.get_height()/2, f'{val:.1f}x', va='center', fontsize=11, fontweight='bold')

plt.tight_layout()
plt.savefig('../output/bce_analysis/chart1_pe_comparison.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("  Saved: chart1_pe_comparison.png")

# Chart 2: Dividend Yield Bar Chart
print("Chart 2: Dividend Yield...")
fig, ax = plt.subplots(figsize=(12, 6.75))
yield_val = bce['Dividend yield % (indicated)']
current_price = bce['Price']

# Show dividend yield
bars = ax.bar(['BCE Dividend Yield', 'Typical GIC Rate'], [yield_val, 3.0], 
              color=[COLOR_SECONDARY, '#9E9E9E'], width=0.5)

ax.set_ylabel('Yield (%)', fontsize=14, fontweight='bold')
ax.set_title(f'BCE Dividend Yield: {yield_val:.2f}%\n${yield_val/100 * current_price:.2f} per share annually', 
             fontsize=18, fontweight='bold', pad=20)
ax.set_ylim(0, 8)

for bar, val in zip(bars, [yield_val, 3.0]):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2, f'{val:.2f}%', 
            ha='center', fontsize=14, fontweight='bold')

plt.tight_layout()
plt.savefig('../output/bce_analysis/chart2_dividend_yield.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("  Saved: chart2_dividend_yield.png")

# Chart 3: Key Metrics Dashboard
print("Chart 3: Key Metrics Dashboard...")
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('BCE: Investment Snapshot', fontsize=22, fontweight='bold', y=0.98)

# Metric 1: P/E
ax = axes[0, 0]
metrics = ['BCE', 'Sector Avg']
values = [bce['Price to earnings ratio'], telecom_stocks['Price to earnings ratio'].mean()]
colors = [COLOR_SECONDARY, '#757575']
bars = ax.bar(metrics, values, color=colors, width=0.5)
ax.set_title('P/E Ratio', fontsize=14, fontweight='bold')
ax.set_ylabel('Multiple (x)', fontsize=12)
for bar, val in zip(bars, values):
    if pd.notna(val):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2, f'{val:.1f}x', 
                ha='center', fontsize=12, fontweight='bold')

# Metric 2: Dividend Yield
ax = axes[0, 1]
values = [bce['Dividend yield % (indicated)'], 4.0]
bars = ax.bar(['BCE', 'Target Yield'], values, color=[COLOR_SECONDARY, '#757575'], width=0.5)
ax.set_title('Dividend Yield', fontsize=14, fontweight='bold')
ax.set_ylabel('Yield (%)', fontsize=12)
for bar, val in zip(bars, values):
    if pd.notna(val):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1, f'{val:.2f}%', 
                ha='center', fontsize=12, fontweight='bold')

# Metric 3: Price
ax = axes[1, 0]
# Show current price vs fair value estimate (12x P/E)
eps = bce['Price'] / bce['Price to earnings ratio'] if bce['Price to earnings ratio'] > 0 else 0
fair_value_10x = eps * 10
fair_value_12x = eps * 12
fair_value_15x = eps * 15

prices = [bce['Price'], fair_value_10x, fair_value_15x]
labels1 = ['Current\nPrice', 'Fair Value\n(10x P/E)', 'Potential\n(15x P/E)']
colors = [COLOR_PRIMARY, COLOR_ACCENT, COLOR_SECONDARY]
bars = ax.bar(labels1, prices, color=colors, width=0.5)
ax.set_title('Price vs Fair Value Estimates', fontsize=14, fontweight='bold')
ax.set_ylabel('Price ($)', fontsize=12)
for bar, val in zip(bars, prices):
    if pd.notna(val):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1, f'${val:.0f}', 
                ha='center', fontsize=11, fontweight='bold')

# Metric 4: Consecutive Years
ax = axes[1, 1]
years = bce['Continuous dividend payout']
ax.barh(['BCE'], [years], color=COLOR_SECONDARY, height=0.4)
ax.set_title('Dividend Track Record', fontsize=14, fontweight='bold')
ax.set_xlabel('Consecutive Years', fontsize=12)
ax.set_xlim(0, 30)
ax.text(years/2, 0, f'{years:.0f} Years', ha='center', va='center', fontsize=14, 
        fontweight='bold', color='white')

plt.tight_layout(rect=[0, 0, 1, 0.96])
plt.savefig('../output/bce_analysis/chart3_dashboard.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("  Saved: chart3_dashboard.png")

print(f"\n{'='*80}")
print(f"CHARTS GENERATED in ../output/bce_analysis/")
print(f"{'='*80}")
print("\nReady for social media posting!")
