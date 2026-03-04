import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

OUTPUT_DIR = Path('../output/nwh_analysis')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

plt.rcParams['figure.figsize'] = (12, 6.75)
plt.rcParams['font.size'] = 12
plt.rcParams['axes.titlesize'] = 20
plt.rcParams['axes.labelsize'] = 14

COLORS = {
    'nwh': '#1E88E5',
    'sector': '#757575',
    'positive': '#43A047',
    'negative': '#E53935',
    'accent': '#FB8C00'
}

print("="*70)
print("NWH (NORTHWEST HEALTHCARE REIT) - CHART GENERATION")
print("="*70)

df = pd.read_csv('../TSX_Merged_Data.csv', low_memory=False)
nwh = df[df['Symbol'] == 'NWH.UN'].iloc[0]

# Get Finance/REIT sector peers
sector = df[df['Sector'] == 'Finance'].copy()
sector = sector[sector['Price to book ratio'].notna()]
sector = sector[sector['Price to book ratio'] > 0]
sector = sector[sector['Price to book ratio'] < 5]  # Remove outliers

print(f"\nNWH.UN Data:")
print(f"  Price: ${nwh['Price']:.2f}")
print(f"  P/E: {nwh['Price to earnings ratio']:.2f}x")
print(f"  P/B: {nwh['Price to book ratio']:.2f}x (below book!)")
print(f"  Dividend Yield: {nwh['Dividend yield % (indicated)']:.2f}%")
print(f"  ROE: {nwh['Return on equity %, Trailing 12 months']:.2f}%")
print(f"  Market Cap: ${nwh['Market capitalization']/1e6:.1f}M")
print(f"  Revenue Growth: {nwh['Revenue growth %, TTM YoY']:.1f}%")
print(f"  Debt/Equity: {nwh['Debt to equity ratio, Quarterly']:.2f}x")

sector_pb = sector['Price to book ratio'].mean()
sector_pe = sector['Price to earnings ratio'].mean()
sector_div = sector['Dividend yield % (indicated)'].mean()

print(f"\nFinance Sector Averages:")
print(f"  P/B: {sector_pb:.2f}x")
print(f"  P/E: {sector_pe:.2f}x")
print(f"  Div Yield: {sector_div:.2f}%")

# Chart 1: P/E and P/B Comparison
print("\nGenerating Chart 1: Valuation Metrics...")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))

# P/E comparison
metrics = ['P/E Ratio', 'P/B Ratio']
nwh_vals = [nwh['Price to earnings ratio'], nwh['Price to book ratio']]
sector_vals = [sector_pe, sector_pb]

x = np.arange(len(metrics))
width = 0.35

bars1 = ax1.bar(x - width/2, nwh_vals, width, label='NWH.UN', color=COLORS['nwh'])
bars2 = ax1.bar(x + width/2, sector_vals, width, label='Finance Sector', color=COLORS['sector'])

ax1.set_ylabel('Ratio (x)', fontsize=14)
ax1.set_title('NWH vs Finance Sector: Valuation Comparison', fontsize=18, fontweight='bold', pad=15)
ax1.set_xticks(x)
ax1.set_xticklabels(metrics, fontsize=12)
ax1.legend(fontsize=12)
ax1.grid(True, alpha=0.3, axis='y')

for bar, val in zip(bars1, nwh_vals):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5, f'{val:.1f}x', 
             ha='center', fontsize=11, fontweight='bold')

# Price to Book - Highlight below book
ax2.axhline(y=1.0, color=COLORS['accent'], linestyle='--', linewidth=2, label='Book Value (P/B = 1.0)')
bars = ax2.bar(['NWH.UN P/B'], [nwh['Price to book ratio']], color=COLORS['nwh'], width=0.5)
ax2.set_ylabel('Price-to-Book Ratio', fontsize=14)
ax2.set_title('NWH Trading Below Book Value', fontsize=18, fontweight='bold', pad=15)
ax2.legend(fontsize=12)
ax2.grid(True, alpha=0.3, axis='y')

# Add annotation
ax2.annotate(f"Trading {((1-nwh['Price to book ratio'])*100):.0f}% below book", 
             xy=(0, nwh['Price to book ratio']), xytext=(0.3, 0.6),
             fontsize=12, color=COLORS['positive'], fontweight='bold',
             arrowprops=dict(arrowstyle='->', color=COLORS['positive']))

for bar, val in zip(bars, [nwh['Price to book ratio']]):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.03, 
             f'{val:.2f}x', ha='center', fontsize=12, fontweight='bold')

plt.tight_layout()
plt.savefig(OUTPUT_DIR / 'chart1_valuation_comparison.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("  Saved: chart1_valuation_comparison.png")

# Chart 2: Dividend Yield
print("\nGenerating Chart 2: Dividend Analysis...")
fig, ax = plt.subplots(figsize=(12, 6.75))

# Show dividend yield vs sector and payout ratio
yields = [nwh['Dividend yield % (indicated)'], sector_div, 5.0]  # 5% as reference
labels = ['NWH.UN\nYield', 'Finance Sector\nAvg', 'REIT Typical\nTarget']
colors = [COLORS['nwh'], COLORS['sector'], COLORS['accent']]

x = np.arange(len(labels))
bars = ax.bar(x, yields, color=colors, width=0.6, edgecolor='black')

ax.axhline(y=6.0, color=COLORS['positive'], linestyle='--', alpha=0.7, label='High Yield Threshold (6%)')
ax.set_ylabel('Dividend Yield (%)', fontsize=14)
ax.set_title('NWH Dividend Yield vs Sector', fontsize=20, fontweight='bold', pad=15)
ax.set_xticks(x)
ax.set_xticklabels(labels, fontsize=11)
ax.legend(fontsize=12)
ax.grid(True, alpha=0.3, axis='y')

# Add payout ratio warning
payout = nwh['Dividend payout ratio %, Trailing 12 months']
ax.text(0.5, 7.5, f'Payout Ratio: {payout:.0f}%\n(High - barely covered)', 
        ha='center', fontsize=12, color=COLORS['negative'], fontweight='bold',
        bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

for bar, val in zip(bars, yields):
    height = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2, height + 0.1, f'{val:.1f}%', 
            ha='center', fontsize=11, fontweight='bold')

plt.tight_layout()
plt.savefig(OUTPUT_DIR / 'chart2_dividend_yield.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("  Saved: chart2_dividend_yield.png")

# Chart 3: Dashboard
print("\nGenerating Chart 3: Dashboard...")
fig = plt.figure(figsize=(14, 8))

metrics = [
    ('Price', f"${nwh['Price']:.2f}"),
    ('P/E', f"{nwh['Price to earnings ratio']:.1f}x"),
    ('P/B', f"{nwh['Price to book ratio']:.2f}x"),
    ('Div Yield', f"{nwh['Dividend yield % (indicated)']:.1f}%"),
    ('Below Book', f"{((1-nwh['Price to book ratio'])*100):.0f}%"),
    ('Mkt Cap', f"${nwh['Market capitalization']/1e6:.0f}M")
]

fig.suptitle('NorthWest Healthcare REIT (NWH.UN) - Key Investment Metrics', 
             fontsize=24, fontweight='bold', y=1.02, color=COLORS['nwh'])

for i, (metric, value) in enumerate(metrics):
    ax = fig.add_subplot(2, 3, i+1)
    ax.text(0.5, 0.5, value, fontsize=36, ha='center', va='center', 
            fontweight='bold', color=COLORS['nwh'])
    ax.text(0.5, 0.2, metric, fontsize=16, ha='center', va='center', color='gray')
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    ax.add_patch(plt.Rectangle((0.05, 0.05), 0.9, 0.9, fill=False, 
                               edgecolor=COLORS['nwh'], linewidth=2))

plt.tight_layout()
plt.savefig(OUTPUT_DIR / 'chart3_dashboard.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("  Saved: chart3_dashboard.png")

# Chart 4: Revenue Growth & Debt
print("\nGenerating Chart 4: Financial Health...")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))

# Revenue growth (negative)
ax = ax1
growth_val = nwh['Revenue growth %, TTM YoY']
colors_g = [COLORS['negative'] if growth_val < 0 else COLORS['positive']]
bar = ax.bar(['Revenue\nGrowth'], [abs(growth_val)], color=colors_g, width=0.5, edgecolor='black')
ax.axhline(y=0, color='black', linestyle='-', linewidth=1)
ax.set_ylabel('Change (%)', fontsize=14)
ax.set_title('NWH Revenue Trend', fontsize=18, fontweight='bold', pad=15)

# Add negative sign
height = bar[0].get_height()
ax.text(0, height + 1, f'{growth_val:.1f}%', ha='center', fontsize=14, 
        fontweight='bold', color=COLORS['negative'])

# Add context
ax.text(0.5, -5, 'Declining revenue\nWarning sign', ha='center', fontsize=11, 
        color=COLORS['negative'], style='italic')
ax.grid(True, alpha=0.3, axis='y')
ax.set_ylim(-20, 20)

# Debt/Equity comparison
ax = ax2
de_metrics = ['NWH.UN\nD/E', 'REIT\nTypical', 'Safe\nThreshold']
de_vals = [nwh['Debt to equity ratio, Quarterly'], 1.5, 1.0]
colors_de = [COLORS['negative'], COLORS['accent'], COLORS['positive']]

x = np.arange(len(de_metrics))
bars = ax.bar(x, de_vals, color=colors_de, width=0.6, edgecolor='black')

ax.axhline(y=1.0, color=COLORS['positive'], linestyle='--', alpha=0.7, label='Conservative (1.0x)')
ax.set_ylabel('Debt-to-Equity Ratio', fontsize=14)
ax.set_title('NWH Leverage vs Norms', fontsize=18, fontweight='bold', pad=15)
ax.set_xticks(x)
ax.set_xticklabels(de_metrics, fontsize=11)
ax.legend(fontsize=11)
ax.grid(True, alpha=0.3, axis='y')

for bar, val in zip(bars, de_vals):
    height = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2, height + 0.05, f'{val:.1f}x', 
            ha='center', fontsize=11, fontweight='bold')

plt.tight_layout()
plt.savefig(OUTPUT_DIR / 'chart4_financial_health.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("  Saved: chart4_financial_health.png")

# Chart 5: Recovery Scenarios
print("\nGenerating Chart 5: Price Recovery Scenarios...")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))

# Left: Upside to book value
ax = ax1
current_price = nwh['Price']
book_value = nwh['Book value per share, Quarterly']
fair_value = book_value * 1.1  # 10% premium

scenarios = ['Current\nPrice', 'Book\nValue', 'Fair Value\n(10% premium)']
prices = [current_price, book_value, fair_value]
colors = [COLORS['negative'], COLORS['accent'], COLORS['positive']]

x = np.arange(len(scenarios))
bars = ax.bar(x, prices, color=colors, width=0.6, edgecolor='black')

ax.axhline(y=book_value, color=COLORS['accent'], linestyle='--', alpha=0.7)
ax.set_ylabel('Price ($)', fontsize=14)
ax.set_title('NWH Recovery Scenarios', fontsize=18, fontweight='bold', pad=15)
ax.set_xticks(x)
ax.set_xticklabels(scenarios, fontsize=11)

# Add upside labels
for i, (bar, price) in enumerate(zip(bars, prices)):
    height = bar.get_height()
    if i == 0:
        ax.text(bar.get_x() + bar.get_width()/2, height + 0.1, 
                f'${price:.2f}', ha='center', fontsize=12, fontweight='bold')
    else:
        upside = ((price - current_price) / current_price * 100)
        ax.text(bar.get_x() + bar.get_width()/2, height + 0.1, 
                f'${price:.2f}\n({upside:+.0f}%)', ha='center', fontsize=11, fontweight='bold')

ax.grid(True, alpha=0.3, axis='y')

# Right: Key risks/opportunities
ax = ax2
ax.axis('off')

text = f"""
NWH RECOVERY ANALYSIS
{'='*50}

Current Price: ${current_price:.2f}
Book Value: ${book_value:.2f}
Discount: {((1-current_price/book_value)*100):.0f}%

IF REIT TRADES AT BOOK:
  Target: ${book_value:.2f}
  Upside: {((book_value-current_price)/current_price*100):.0f}%

IF TURNAROUND SUCCEEDS:
  (Revenue growth returns)
  Target: ${book_value*1.15:.2f}
  Upside: {((book_value*1.15-current_price)/current_price*100):.0f}%

KEY RISKS:
- Revenue continuing to decline
- Dividend cut (payout ratio 180%)
- Debt refinancing costs
- Healthcare real estate downturn

CATALYST NEEDED:
- Revenue stabilization
- Asset sales at book value
- Dividend coverage restored
"""

ax.text(0.1, 0.95, text, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', fontfamily='monospace',
        bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.3))

plt.tight_layout()
plt.savefig(OUTPUT_DIR / 'chart5_recovery_analysis.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("  Saved: chart5_recovery_analysis.png")

# Chart 6: Historical Performance
print("\nGenerating Chart 6: Historical Performance...")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))

# Performance metrics
ax = ax1
perf_periods = ['1 Week', '1 Month', 'YTD', '1 Year', '5 Years']
performance = [
    nwh['Performance % 1 week'],
    nwh['Performance % 1 month'],
    nwh['Performance % Year to date'],
    nwh['Performance % 1 year'],
    nwh['Performance % 5 years']
]

colors_p = [COLORS['positive'] if p > 0 else COLORS['negative'] for p in performance]

x = np.arange(len(perf_periods))
bars = ax.bar(x, performance, color=colors_p, width=0.6, edgecolor='black')

ax.axhline(y=0, color='black', linestyle='-', linewidth=1)
ax.set_ylabel('Return (%)', fontsize=14)
ax.set_title('NWH Historical Performance', fontsize=18, fontweight='bold', pad=15)
ax.set_xticks(x)
ax.set_xticklabels(perf_periods, rotation=45, ha='right', fontsize=11)
ax.grid(True, alpha=0.3, axis='y')

for bar, val in zip(bars, performance):
    height = bar.get_height()
    va = 'bottom' if height > 0 else 'top'
    offset = 2 if height > 0 else -2
    ax.text(bar.get_x() + bar.get_width()/2, height + offset, 
            f'{val:.1f}%', ha='center', fontsize=10, fontweight='bold')

# REIT Comparison metrics
ax = ax2
comparison_metrics = ['P/B\nRatio', 'Div\nYield', 'Rev\nGrowth']
nwh_comp = [
    nwh['Price to book ratio'],
    nwh['Dividend yield % (indicated)'] / 10,  # Scale down for chart
    nwh['Revenue growth %, TTM YoY']
]
sector_comp = [
    sector_pb,
    sector_div / 10,
    -5  # Sector average estimate
]

x = np.arange(len(comparison_metrics))
width = 0.35

bars1 = ax.bar(x - width/2, nwh_comp, width, label='NWH.UN', color=COLORS['nwh'])
bars2 = ax.bar(x + width/2, sector_comp, width, label='Finance Sector', color=COLORS['sector'])

ax.set_ylabel('Normalized Value', fontsize=14)
ax.set_title('NWH vs Sector Metrics', fontsize=18, fontweight='bold', pad=15)
ax.set_xticks(x)
ax.set_xticklabels(comparison_metrics, fontsize=12)
ax.legend(fontsize=12)
ax.grid(True, alpha=0.3, axis='y')

plt.tight_layout()
plt.savefig(OUTPUT_DIR / 'chart6_historical_performance.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("  Saved: chart6_historical_performance.png")

# Chart 7: Investment Summary
print("\nGenerating Chart 7: Investment Summary...")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))

# Summary metrics
ax = ax1
summary_metrics = ['Price', 'Book Value', 'Discount', 'Div Yield', 'Payout']
nwh_summary = [
    nwh['Price'],
    nwh['Book value per share, Quarterly'],
    (1-nwh['Price to book ratio'])*100,
    nwh['Dividend yield % (indicated)'],
    nwh['Dividend payout ratio %, Trailing 12 months']
]

x = np.arange(len(summary_metrics))
colors_s = [COLORS['nwh'], COLORS['accent'], COLORS['positive'], COLORS['positive'], COLORS['negative']]
bars = ax.barh(x, nwh_summary, color=colors_s, height=0.6, edgecolor='black')

ax.set_yticks(x)
ax.set_yticklabels(summary_metrics, fontsize=12)
ax.set_xlabel('Value', fontsize=14)
ax.set_title('NWH Key Metrics Summary', fontsize=18, fontweight='bold', pad=15)
ax.grid(True, alpha=0.3, axis='x')

for i, (bar, val) in enumerate(zip(bars, nwh_summary)):
    if i == 2:  # Discount
        ax.text(val + 1, bar.get_y() + bar.get_height()/2, f'{val:.0f}%', 
                va='center', fontsize=11, fontweight='bold')
    elif i == 3:  # Yield
        ax.text(val + 0.2, bar.get_y() + bar.get_height()/2, f'{val:.1f}%', 
                va='center', fontsize=11, fontweight='bold')
    elif i == 4:  # Payout
        ax.text(val + 5, bar.get_y() + bar.get_height()/2, f'{val:.0f}% ⚠️', 
                va='center', fontsize=11, fontweight='bold', color=COLORS['negative'])
    else:
        ax.text(val + 0.2, bar.get_y() + bar.get_height()/2, f'${val:.2f}', 
                va='center', fontsize=11, fontweight='bold')

# Investment thesis
ax = ax2
ax.axis('off')

text = f"""
NWH.INVESTMENT THESIS
{'='*50}

THE OPPORTUNITY:
- Trading 12% below book value ($5.72 vs $6.49)
- High 6.4% dividend yield
- Healthcare real estate (defensive sector)
- Recovery potential to $6.50-$7.00 range

THE RISKS:
- Revenue declining 13% (turnaround needed)
- High 180% payout ratio (dividend risk)
- Heavy debt load (1.79x D/E)
- ROE only 3% (low profitability)

VERDICT: HIGH RISK/REWARD
Not for conservative investors. Only for
those willing to bet on turnaround and
accept potential dividend cut.

Target: $6.50 (+14%) if recovery succeeds
Risk: $4.50 (-21%) if dividend cut

FOR: Speculative income investors
AGAINST: Conservative investors
"""

ax.text(0.1, 0.95, text, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', fontfamily='monospace',
        bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.3))

plt.tight_layout()
plt.savefig(OUTPUT_DIR / 'chart7_investment_summary.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("  Saved: chart7_investment_summary.png")

print("\n" + "="*70)
print("ALL 7 CHARTS GENERATED SUCCESSFULLY")
print(f"Location: {OUTPUT_DIR}")
print("="*70)
