"""
Extended Visualization Generator - For Larger Stock Sets (8-20 stocks)
Optimized for sector overviews and top-N rankings
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# ============================================================================
# CONFIGURATION
# ============================================================================

sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6.75)
plt.rcParams['font.size'] = 11
plt.rcParams['axes.titlesize'] = 18
plt.rcParams['axes.labelsize'] = 13

COLOR_PRIMARY = '#3498db'
COLOR_POSITIVE = '#2ecc71'
COLOR_NEGATIVE = '#e74c3c'
COLOR_ACCENT = '#f39c12'

# ============================================================================
# LOAD DATA & SELECT STOCKS
# ============================================================================

df = pd.read_csv('../TSX_Merged_Data.csv')

# For larger sets: 8-20 stocks
SELECTED_STOCKS = [
    'RY', 'TD', 'ENB', 'BMO', 'BNS',
    'CNQ', 'SU', 'TRP', 'PPL', 'AQN',
    'CPX', 'KEY', 'FTS', 'EMA', 'CU'
]  # Example: Top 15 stocks

THEME_NAME = "Top 15 TSX Dividend Payers"

analysis_df = df[df['Symbol'].isin(SELECTED_STOCKS)].copy()

print(f"="*80)
print(f"GENERATING EXTENDED VISUALIZATIONS: {THEME_NAME}")
print(f"="*80)
print(f"\nAnalyzing {len(analysis_df)} stocks")

# ============================================================================
# CHART 1: TOP N RANKING (Works well up to 20 stocks)
# ============================================================================

print(f"\nGenerating Chart 1: Top {len(analysis_df)} Ranking...")

metric = 'Dividend yield %, Trailing 12 months'
chart_data = analysis_df.sort_values(metric, ascending=False).head(15)

fig, ax = plt.subplots(figsize=(12, 8))  # Taller for more stocks

# Color gradient based on rank
colors = plt.cm.RdYlGn(np.linspace(0.3, 0.9, len(chart_data)))

bars = ax.barh(range(len(chart_data)), chart_data[metric], color=colors, height=0.7)

# Labels
ax.set_yticks(range(len(chart_data)))
ax.set_yticklabels([f"{i+1}. {sym}" for i, sym in enumerate(chart_data['Symbol'])],
                     fontsize=11, weight='bold')
ax.set_xlabel('Dividend Yield (%)', fontsize=13, weight='bold')
ax.set_title(f'Top {len(chart_data)} TSX Stocks by Dividend Yield',
             fontsize=18, weight='bold', pad=20)
ax.grid(axis='x', alpha=0.3)
ax.invert_yaxis()  # Rank 1 at top

# Add values
for i, (idx, row) in enumerate(chart_data.iterrows()):
    val = row[metric]
    ax.text(val + 0.1, i, f'{val:.2f}%', va='center', fontsize=10, weight='bold')

plt.tight_layout()
plt.savefig('chart1_top_ranking.png', dpi=150, bbox_inches='tight', facecolor='white')
print(f"  ✓ Saved: chart1_top_ranking.png")
plt.close()

# ============================================================================
# CHART 2: GROUPED BY TIER (Best for 10+ stocks)
# ============================================================================

print(f"\nGenerating Chart 2: Tiered View...")

metric = 'Dividend yield %, Trailing 12 months'
sorted_df = analysis_df.sort_values(metric, ascending=False)

# Create tiers
n_stocks = len(sorted_df)
tier_size = max(3, n_stocks // 3)

sorted_df['Tier'] = ['Top Tier'] * tier_size + \
                    ['Mid Tier'] * tier_size + \
                    ['Lower Tier'] * (n_stocks - 2*tier_size)

fig, ax = plt.subplots(figsize=(12, 6.75))

tier_colors = {'Top Tier': COLOR_POSITIVE, 'Mid Tier': COLOR_ACCENT, 'Lower Tier': COLOR_PRIMARY}

for tier in ['Top Tier', 'Mid Tier', 'Lower Tier']:
    tier_data = sorted_df[sorted_df['Tier'] == tier]
    ax.barh(tier_data['Symbol'], tier_data[metric],
            label=tier, color=tier_colors[tier], alpha=0.8)

ax.set_xlabel('Dividend Yield (%)', fontsize=13, weight='bold')
ax.set_title('Dividend Yield Distribution: Tiered View', fontsize=18, weight='bold', pad=20)
ax.legend(loc='lower right', fontsize=11)
ax.grid(axis='x', alpha=0.3)

plt.tight_layout()
plt.savefig('chart2_tiered_view.png', dpi=150, bbox_inches='tight', facecolor='white')
print(f"  ✓ Saved: chart2_tiered_view.png")
plt.close()

# ============================================================================
# CHART 3: GRID VIEW - Multiple Metrics (Best for comparing 10-15 stocks)
# ============================================================================

print(f"\nGenerating Chart 3: Multi-Metric Grid...")

# Select top 10 for cleaner visualization
top_10 = analysis_df.nlargest(10, 'Dividend yield %, Trailing 12 months')

metrics = [
    'Dividend yield %, Trailing 12 months',
    'Return on equity %, Trailing 12 months',
    'Price to earnings ratio'
]

fig, axes = plt.subplots(1, 3, figsize=(16, 6))

for idx, metric in enumerate(metrics):
    ax = axes[idx]
    data = top_10.sort_values(metric, ascending=False)

    bars = ax.barh(data['Symbol'], data[metric], color=COLOR_PRIMARY, alpha=0.7)

    ax.set_title(metric.split(',')[0], fontsize=12, weight='bold')
    ax.grid(axis='x', alpha=0.3)
    ax.invert_yaxis()

    # Smaller font for many stocks
    ax.tick_params(axis='y', labelsize=10)

plt.suptitle('Top 10 Stocks: Key Metrics Comparison', fontsize=18, weight='bold', y=0.98)
plt.tight_layout()
plt.savefig('chart3_multi_metric_grid.png', dpi=150, bbox_inches='tight', facecolor='white')
print(f"  ✓ Saved: chart3_multi_metric_grid.png")
plt.close()

# ============================================================================
# CHART 4: SECTOR BREAKDOWN (Good for 10+ stocks)
# ============================================================================

print(f"\nGenerating Chart 4: Sector Analysis...")

if 'Sector' in analysis_df.columns:
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

    # Pie chart of sector distribution
    sector_counts = analysis_df['Sector'].value_counts()
    ax1.pie(sector_counts, labels=sector_counts.index, autopct='%1.1f%%',
            startangle=90, colors=plt.cm.Set3(range(len(sector_counts))))
    ax1.set_title('Sector Distribution', fontsize=14, weight='bold')

    # Average yield by sector
    sector_yields = analysis_df.groupby('Sector')['Dividend yield %, Trailing 12 months'].mean().sort_values()
    ax2.barh(sector_yields.index, sector_yields.values, color=COLOR_ACCENT, alpha=0.8)
    ax2.set_xlabel('Average Dividend Yield (%)', fontsize=12, weight='bold')
    ax2.set_title('Average Yield by Sector', fontsize=14, weight='bold')
    ax2.grid(axis='x', alpha=0.3)

    plt.suptitle(f'{THEME_NAME}: Sector Analysis', fontsize=18, weight='bold', y=0.98)
    plt.tight_layout()
    plt.savefig('chart4_sector_breakdown.png', dpi=150, bbox_inches='tight', facecolor='white')
    print(f"  ✓ Saved: chart4_sector_breakdown.png")
    plt.close()

# ============================================================================
# SUMMARY TABLE
# ============================================================================

print(f"\nGenerating summary table...")

summary_cols = [
    'Symbol', 'Description', 'Sector',
    'Dividend yield %, Trailing 12 months',
    'Price to earnings ratio',
    'Market capitalization'
]

summary_cols = [col for col in summary_cols if col in analysis_df.columns]
summary_table = analysis_df[summary_cols].copy()

if 'Market capitalization' in summary_table.columns:
    summary_table['Market Cap (B)'] = summary_table['Market capitalization'] / 1e9
    summary_table = summary_table.drop('Market capitalization', axis=1)

# Sort by rank
summary_table = summary_table.sort_values('Dividend yield %, Trailing 12 months', ascending=False)
summary_table.to_csv('analysis_summary_extended.csv', index=False)
print(f"  ✓ Saved: analysis_summary_extended.csv")

print(f"\n" + "="*80)
print(f"✓ EXTENDED VISUALIZATIONS COMPLETE!")
print(f"="*80)
print(f"\nBest for Twitter threads:")
print(f"  - Chart 1: Show top 10-15 as ranked list")
print(f"  - Chart 2 or 3: Highlight patterns/tiers")
print(f"  - Chart 4: Sector context (if analyzing multiple sectors)")
print(f"\nThread strategy for {len(analysis_df)} stocks:")
print(f"  - Don't discuss each stock individually")
print(f"  - Focus on patterns, tiers, outliers")
print(f"  - Highlight top 3 and bottom 3 + what makes them different")
print(f"="*80)
