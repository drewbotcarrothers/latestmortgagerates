"""
Stock Screening Script
Filter TSX stocks based on thematic criteria
"""

import pandas as pd
import numpy as np

# Load merged data
df = pd.read_csv('../TSX_Merged_Data.csv')

print(f"="*80)
print(f"TSX STOCK SCREENER")
print(f"="*80)
print(f"\nTotal stocks in dataset: {len(df)}")
print(f"\nAvailable sectors:")
print(df['Sector'].value_counts())

print(f"\n" + "="*80)
print(f"THEME TEMPLATES - Uncomment one or create your own")
print(f"="*80)

# ============================================================================
# THEME 1: DIVIDEND ARISTOCRATS
# ============================================================================
"""
criteria = {
    'dividend_yield_min': 3.0,
    'continuous_payout_min': 5,
    'payout_ratio_max': 80,
    'market_cap_min': 1_000_000_000,
    'div_growth_min': 0
}

filtered = df[
    (df['Dividend yield %, Trailing 12 months'] >= criteria['dividend_yield_min']) &
    (df['Continuous dividend payout'] >= criteria['continuous_payout_min']) &
    (df['Dividend payout ratio %, Trailing 12 months'] <= criteria['payout_ratio_max']) &
    (df['Market capitalization'] >= criteria['market_cap_min']) &
    (df['Dividends per share growth %, Annual YoY'] >= criteria['div_growth_min'])
].copy()

# Remove rows with missing critical data
filtered = filtered.dropna(subset=[
    'Dividend yield %, Trailing 12 months',
    'Dividends per share growth %, Annual YoY',
    'Dividend payout ratio %, Trailing 12 months'
])

# Sort by dividend yield
filtered = filtered.sort_values('Dividend yield %, Trailing 12 months', ascending=False)

theme_name = "Dividend Aristocrats"
"""

# ============================================================================
# THEME 2: GROWTH CHAMPIONS
# ============================================================================
"""
criteria = {
    'revenue_growth_min': 15,
    'operating_margin_min': 10,
    'eps_growth_min': 20,
    'price_perf_1y_min': 10
}

filtered = df[
    (df['Revenue growth %, TTM YoY'] >= criteria['revenue_growth_min']) &
    (df['Operating margin %, Trailing 12 months'] >= criteria['operating_margin_min']) &
    (df['Earnings per share diluted growth %, TTM YoY'] >= criteria['eps_growth_min']) &
    (df['Performance % 1 year'] >= criteria['price_perf_1y_min'])
].copy()

filtered = filtered.dropna(subset=[
    'Revenue growth %, TTM YoY',
    'Operating margin %, Trailing 12 months',
    'Earnings per share diluted growth %, TTM YoY'
])

filtered = filtered.sort_values('Revenue growth %, TTM YoY', ascending=False)

theme_name = "Growth Champions"
"""

# ============================================================================
# THEME 3: VALUE PLAYS
# ============================================================================
"""
criteria = {
    'pe_ratio_max': 15,
    'fcf_margin_min': 10,
    'roe_min': 15,
    'pb_ratio_max': 2,
    'debt_to_equity_max': 1
}

filtered = df[
    (df['Price to earnings ratio'] <= criteria['pe_ratio_max']) &
    (df['Price to earnings ratio'] > 0) &  # Exclude negative P/E
    (df['Free cash flow margin %, Trailing 12 months'] >= criteria['fcf_margin_min']) &
    (df['Return on equity %, Trailing 12 months'] >= criteria['roe_min']) &
    (df['Price to book ratio'] <= criteria['pb_ratio_max']) &
    (df['Debt to equity ratio, Quarterly'] <= criteria['debt_to_equity_max'])
].copy()

filtered = filtered.dropna(subset=[
    'Price to earnings ratio',
    'Free cash flow margin %, Trailing 12 months',
    'Return on equity %, Trailing 12 months'
])

filtered = filtered.sort_values('Price to earnings ratio', ascending=True)

theme_name = "Value Plays - Undervalued Quality"
"""

# ============================================================================
# THEME 4: CASH FLOW KINGS
# ============================================================================

criteria = {
    'fcf_margin_min': 15,
    'operating_margin_min': 20,
    'current_ratio_min': 1.5,
    'market_cap_min': 500_000_000
}

filtered = df[
    (df['Free cash flow margin %, Trailing 12 months'] >= criteria['fcf_margin_min']) &
    (df['Operating margin %, Trailing 12 months'] >= criteria['operating_margin_min']) &
    (df['Current ratio, Quarterly'] >= criteria['current_ratio_min']) &
    (df['Market capitalization'] >= criteria['market_cap_min'])
].copy()

filtered = filtered.dropna(subset=[
    'Free cash flow margin %, Trailing 12 months',
    'Operating margin %, Trailing 12 months',
    'Current ratio, Quarterly'
])

filtered = filtered.sort_values('Free cash flow margin %, Trailing 12 months', ascending=False)

theme_name = "Cash Flow Kings"


# ============================================================================
# DISPLAY RESULTS
# ============================================================================

print(f"\n" + "="*80)
print(f"SCREENING RESULTS: {theme_name}")
print(f"="*80)
print(f"\nStocks matching criteria: {len(filtered)}")

if len(filtered) > 0:
    print(f"\nTop 15 candidates:")
    print(f"\n{'-'*80}")

    # Show relevant columns based on theme
    display_cols = ['Symbol', 'Description', 'Sector', 'Market capitalization']

    # Add theme-specific columns
    if 'dividend' in theme_name.lower():
        display_cols.extend([
            'Dividend yield %, Trailing 12 months',
            'Continuous dividend payout',
            'Dividend payout ratio %, Trailing 12 months'
        ])
    elif 'growth' in theme_name.lower():
        display_cols.extend([
            'Revenue growth %, TTM YoY',
            'Operating margin %, Trailing 12 months',
            'Earnings per share diluted growth %, TTM YoY'
        ])
    elif 'value' in theme_name.lower():
        display_cols.extend([
            'Price to earnings ratio',
            'Price to book ratio',
            'Return on equity %, Trailing 12 months'
        ])
    elif 'cash' in theme_name.lower():
        display_cols.extend([
            'Free cash flow margin %, Trailing 12 months',
            'Operating margin %, Trailing 12 months',
            'Current ratio, Quarterly'
        ])

    # Filter to columns that exist in dataframe
    display_cols = [col for col in display_cols if col in filtered.columns]

    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', None)
    pd.set_option('display.max_colwidth', 30)

    print(filtered[display_cols].head(15).to_string(index=False))

    # Save filtered results
    output_file = f'filtered_stocks_{theme_name.replace(" ", "_").lower()}.csv'
    filtered.to_csv(output_file, index=False)
    print(f"\n{'-'*80}")
    print(f"✓ Filtered stocks saved to: {output_file}")

    # Summary statistics
    print(f"\n" + "="*80)
    print(f"SUMMARY STATISTICS")
    print(f"="*80)

    print(f"\nSector breakdown:")
    print(filtered['Sector'].value_counts())

    print(f"\nMarket cap distribution:")
    print(f"  Total market cap: ${filtered['Market capitalization'].sum() / 1e9:.1f}B")
    print(f"  Average market cap: ${filtered['Market capitalization'].mean() / 1e9:.1f}B")
    print(f"  Median market cap: ${filtered['Market capitalization'].median() / 1e9:.1f}B")

else:
    print("\n⚠ No stocks matched your criteria. Try relaxing the filters.")

print(f"\n" + "="*80)
print(f"NEXT STEPS:")
print(f"="*80)
print(f"1. Review the filtered stocks above")
print(f"2. Manually select 3-7 stocks for your analysis")
print(f"3. Edit 'create_visualizations.py' with your selected symbols")
print(f"4. Run visualization script to generate charts")
print(f"="*80)
