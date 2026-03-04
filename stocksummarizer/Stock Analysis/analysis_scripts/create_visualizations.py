"""
Visualization Generator for Twitter Stock Analysis
Creates Twitter-optimized charts (1200x675px, high contrast, readable)
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# ============================================================================
# CONFIGURATION
# ============================================================================

# Set visual style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6.75)  # 16:9 aspect ratio for Twitter
plt.rcParams['font.size'] = 12
plt.rcParams['axes.titlesize'] = 20
plt.rcParams['axes.labelsize'] = 14
plt.rcParams['xtick.labelsize'] = 11
plt.rcParams['ytick.labelsize'] = 11

# Color palette
COLOR_PRIMARY = '#3498db'    # Blue
COLOR_POSITIVE = '#2ecc71'   # Green
COLOR_NEGATIVE = '#e74c3c'   # Red
COLOR_ACCENT = '#f39c12'     # Orange
COLOR_PURPLE = '#9b59b6'     # Purple

# ============================================================================
# LOAD DATA & SELECT STOCKS
# ============================================================================

# Load merged data
df = pd.read_csv('../TSX_Merged_Data.csv')

# CUSTOMIZE: Select your stocks here (3-7 recommended for Twitter)
SELECTED_STOCKS = ['RY', 'TD', 'ENB', 'BMO', 'BNS']  # Replace with your selection
THEME_NAME = "Canadian Dividend Aristocrats"  # Your theme name

# Filter to selected stocks
analysis_df = df[df['Symbol'].isin(SELECTED_STOCKS)].copy()

print(f"="*80)
print(f"GENERATING VISUALIZATIONS: {THEME_NAME}")
print(f"="*80)
print(f"\nSelected stocks: {', '.join(SELECTED_STOCKS)}")
print(f"Stocks found in data: {len(analysis_df)}")

if len(analysis_df) == 0:
    print("\n⚠ ERROR: No stocks found. Check your stock symbols.")
    exit()

print(f"\n{'-'*80}")
for idx, row in analysis_df.iterrows():
    print(f"  {row['Symbol']:6s} - {row['Description']}")
print(f"{'-'*80}")

# ============================================================================
# CHART 1: HORIZONTAL BAR CHART - Comparison
# ============================================================================

print(f"\nGenerating Chart 1: Dividend Yield Comparison...")

# Choose your metric for Chart 1
metric_chart1 = 'Dividend yield %, Trailing 12 months'
chart1_title = 'TSX Dividend Aristocrats: Current Yields'

fig, ax = plt.subplots(figsize=(12, 6.75))

# Sort by metric
chart1_data = analysis_df.sort_values(metric_chart1).copy()

# Color code: green if above threshold, blue otherwise
threshold = 4.0  # Customize threshold
colors = [COLOR_POSITIVE if x > threshold else COLOR_PRIMARY for x in chart1_data[metric_chart1]]

# Create horizontal bar chart
bars = ax.barh(chart1_data['Symbol'], chart1_data[metric_chart1], color=colors, height=0.6)

# Styling
ax.set_xlabel('Dividend Yield (%)', fontsize=14, weight='bold')
ax.set_title(chart1_title, fontsize=20, weight='bold', pad=20)
ax.grid(axis='x', alpha=0.3, linestyle='--')
ax.set_axisbelow(True)

# Add value labels on bars
for i, (symbol, value) in enumerate(zip(chart1_data['Symbol'], chart1_data[metric_chart1])):
    if pd.notna(value):
        ax.text(value + 0.15, i, f'{value:.2f}%', va='center', fontsize=13, weight='bold')

# Add subtle reference line
if pd.notna(threshold):
    ax.axvline(threshold, color='gray', linestyle='--', alpha=0.4, linewidth=1.5)
    ax.text(threshold, len(chart1_data) - 0.5, f'{threshold}% threshold',
            fontsize=10, color='gray', ha='left', va='bottom')

plt.tight_layout()
plt.savefig('chart1_dividend_yield.png', dpi=150, bbox_inches='tight', facecolor='white')
print(f"  ✓ Saved: chart1_dividend_yield.png")
plt.close()

# ============================================================================
# CHART 2: SCATTER PLOT - Relationship between two metrics
# ============================================================================

print(f"\nGenerating Chart 2: Yield vs Growth Scatter...")

# Choose your X and Y metrics
x_metric = 'Dividend yield %, Trailing 12 months'
y_metric = 'Dividends per share growth %, Annual YoY'
size_metric = 'Market capitalization'

fig, ax = plt.subplots(figsize=(12, 6.75))

# Calculate sizes (normalize market cap for bubble sizes)
if size_metric in analysis_df.columns:
    sizes = (analysis_df[size_metric] / analysis_df[size_metric].max() * 1000) + 200
else:
    sizes = 500  # Fixed size if no size metric

# Create scatter plot
scatter = ax.scatter(
    analysis_df[x_metric],
    analysis_df[y_metric],
    s=sizes,
    alpha=0.6,
    c=[COLOR_PRIMARY, COLOR_POSITIVE, COLOR_ACCENT, COLOR_PURPLE, COLOR_NEGATIVE][:len(analysis_df)],
    edgecolors='white',
    linewidth=2
)

# Add stock labels
for idx, row in analysis_df.iterrows():
    ax.annotate(
        row['Symbol'],
        (row[x_metric], row[y_metric]),
        fontsize=13,
        weight='bold',
        ha='center',
        va='center'
    )

# Labels and title
ax.set_xlabel('Current Dividend Yield (%)', fontsize=14, weight='bold')
ax.set_ylabel('Dividend Growth YoY (%)', fontsize=14, weight='bold')
ax.set_title('Yield vs Growth: Finding the Sweet Spot', fontsize=20, weight='bold', pad=20)
ax.grid(alpha=0.3, linestyle='--')
ax.set_axisbelow(True)

# Add quadrant lines (median splits)
if len(analysis_df) > 2:
    median_x = analysis_df[x_metric].median()
    median_y = analysis_df[y_metric].median()
    ax.axvline(median_x, color='gray', linestyle='--', alpha=0.3, linewidth=1.5)
    ax.axhline(median_y, color='gray', linestyle='--', alpha=0.3, linewidth=1.5)

    # Add quadrant labels
    ax.text(ax.get_xlim()[1] * 0.95, ax.get_ylim()[1] * 0.95,
            'High Yield\nHigh Growth', fontsize=10, color='gray',
            ha='right', va='top', style='italic')

plt.tight_layout()
plt.savefig('chart2_yield_vs_growth.png', dpi=150, bbox_inches='tight', facecolor='white')
print(f"  ✓ Saved: chart2_yield_vs_growth.png")
plt.close()

# ============================================================================
# CHART 3: GROUPED BAR CHART - Multiple metrics comparison
# ============================================================================

print(f"\nGenerating Chart 3: Multi-Metric Comparison...")

# Select 3-4 key metrics to compare
metrics_to_compare = [
    'Dividend yield %, Trailing 12 months',
    'Return on equity %, Trailing 12 months',
    'Operating margin %, Trailing 12 months'
]

# Normalize metrics to 0-100 scale for fair comparison
normalized_data = analysis_df[['Symbol'] + metrics_to_compare].copy()

for metric in metrics_to_compare:
    max_val = normalized_data[metric].max()
    if max_val > 0:
        normalized_data[f'{metric}_norm'] = (normalized_data[metric] / max_val) * 100

fig, ax = plt.subplots(figsize=(12, 6.75))

# Set up bar positions
x = np.arange(len(analysis_df))
width = 0.25
colors_multi = [COLOR_PRIMARY, COLOR_POSITIVE, COLOR_ACCENT]

# Create grouped bars
for i, metric in enumerate(metrics_to_compare):
    norm_metric = f'{metric}_norm'
    offset = width * (i - 1)
    ax.bar(x + offset, normalized_data[norm_metric], width,
           label=metric.split(',')[0], color=colors_multi[i], alpha=0.8)

# Styling
ax.set_xlabel('Stock', fontsize=14, weight='bold')
ax.set_ylabel('Relative Score (Normalized to 100)', fontsize=14, weight='bold')
ax.set_title('Multi-Metric Comparison: Quality Indicators', fontsize=20, weight='bold', pad=20)
ax.set_xticks(x)
ax.set_xticklabels(analysis_df['Symbol'], fontsize=13, weight='bold')
ax.legend(fontsize=11, loc='upper left', framealpha=0.9)
ax.grid(axis='y', alpha=0.3, linestyle='--')
ax.set_axisbelow(True)

plt.tight_layout()
plt.savefig('chart3_multi_metric.png', dpi=150, bbox_inches='tight', facecolor='white')
print(f"  ✓ Saved: chart3_multi_metric.png")
plt.close()

# ============================================================================
# CHART 4 (OPTIONAL): PERFORMANCE COMPARISON
# ============================================================================

print(f"\nGenerating Chart 4: Performance Comparison...")

# Performance metrics across time periods
perf_metrics = [
    'Performance % 1 month',
    'Performance % 3 months',
    'Performance % 1 year'
]

# Check if metrics exist
perf_metrics = [m for m in perf_metrics if m in analysis_df.columns]

if len(perf_metrics) > 0:
    fig, ax = plt.subplots(figsize=(12, 6.75))

    # Prepare data
    perf_data = analysis_df[['Symbol'] + perf_metrics].set_index('Symbol')

    # Create grouped bar chart
    perf_data.plot(kind='bar', ax=ax, width=0.8, color=[COLOR_ACCENT, COLOR_PRIMARY, COLOR_POSITIVE])

    # Styling
    ax.set_xlabel('Stock', fontsize=14, weight='bold')
    ax.set_ylabel('Performance (%)', fontsize=14, weight='bold')
    ax.set_title('Price Performance Across Time Periods', fontsize=20, weight='bold', pad=20)
    ax.legend([m.replace('Performance % ', '') for m in perf_metrics],
              fontsize=11, loc='upper left', framealpha=0.9)
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    ax.set_axisbelow(True)
    ax.axhline(0, color='black', linewidth=0.8, linestyle='-')
    ax.set_xticklabels(ax.get_xticklabels(), rotation=0, fontsize=13, weight='bold')

    plt.tight_layout()
    plt.savefig('chart4_performance.png', dpi=150, bbox_inches='tight', facecolor='white')
    print(f"  ✓ Saved: chart4_performance.png")
    plt.close()
else:
    print(f"  ⚠ Performance metrics not available, skipping Chart 4")

# ============================================================================
# SUMMARY TABLE (Optional - export as CSV for reference)
# ============================================================================

print(f"\nGenerating summary table...")

summary_cols = [
    'Symbol', 'Description', 'Sector',
    'Price', 'Market capitalization',
    'Dividend yield %, Trailing 12 months',
    'Price to earnings ratio',
    'Return on equity %, Trailing 12 months'
]

# Filter to available columns
summary_cols = [col for col in summary_cols if col in analysis_df.columns]
summary_table = analysis_df[summary_cols].copy()

# Format large numbers
if 'Market capitalization' in summary_table.columns:
    summary_table['Market Cap (B)'] = summary_table['Market capitalization'] / 1e9
    summary_table = summary_table.drop('Market capitalization', axis=1)

summary_table.to_csv('analysis_summary.csv', index=False)
print(f"  ✓ Saved: analysis_summary.csv")

# ============================================================================
# COMPLETE
# ============================================================================

print(f"\n" + "="*80)
print(f"✓ ALL VISUALIZATIONS GENERATED SUCCESSFULLY!")
print(f"="*80)
print(f"\nFiles created:")
print(f"  1. chart1_dividend_yield.png")
print(f"  2. chart2_yield_vs_growth.png")
print(f"  3. chart3_multi_metric.png")
print(f"  4. chart4_performance.png (if available)")
print(f"  5. analysis_summary.csv")
print(f"\nNext steps:")
print(f"  1. Review charts for readability and accuracy")
print(f"  2. Develop narrative based on visual insights")
print(f"  3. Format Twitter thread")
print(f"  4. Post and engage!")
print(f"="*80)
