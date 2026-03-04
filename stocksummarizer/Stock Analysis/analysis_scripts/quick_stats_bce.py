"""
Quick Statistics Generator
Get summary stats for your selected stocks to inform your narrative
"""

import pandas as pd
import numpy as np

# Load merged data
df = pd.read_csv('../TSX_Merged_Data.csv')

# Testing BCE
SELECTED_STOCKS = ['BCE']

# Filter to selected stocks
stocks = df[df['Symbol'].isin(SELECTED_STOCKS)].copy()

print(f"="*80)
print(f"QUICK STATISTICS SUMMARY")
print(f"="*80)
print(f"\\nAnalyzing {len(stocks)} stocks: {', '.join(SELECTED_STOCKS)}\\n")

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

print(f"\\n" + "="*80)
print(f"VALUATION METRICS")
print(f"="*80)

valuation_metrics = [
    ('Price', 'Current Price', '${:.2f}'),
    ('Market capitalization', 'Market Cap', '${:.1f}B'),
    ('Price to earnings ratio', 'P/E Ratio', '{:.2f}x'),
    ('Price to book ratio', 'P/B Ratio', '{:.2f}x'),
    ('Enterprise value to EBITDA ratio', 'EV/EBITDA', '{:.2f}x')
]

for col, label, fmt in valuation_metrics:
    if col in stocks.columns:
        val = stocks[col].iloc[0]
        if pd.notna(val):
            if 'B' in fmt and 'Market Cap' in label:
                val = val / 1e9
            formatted = fmt.format(val)
        else:
            formatted = "N/A"
        print(f"{label:<20}: {formatted:>15}")

print(f"\\n" + "-"*80)
print(f"Valuation Summary vs Sector Average:")

# Sector comparison
if 'Sector' in stocks.columns:
    bce_sector = stocks['Sector'].iloc[0]
    sector_stocks = df[df['Sector'] == bce_sector]
    
    for col, label, fmt in valuation_metrics:
        if col in stocks.columns:
            bce_val = stocks[col].iloc[0]
            sector_avg = sector_stocks[col].replace(0, np.nan).mean()
            if pd.notna(bce_val) and pd.notna(sector_avg):
                diff = bce_val - sector_avg
                pct_diff = ((bce_val / sector_avg) - 1) * 100
                print(f"{label}: BCE={bce_val:.2f} | Sector Avg={sector_avg:.2f} | Diff={pct_diff:+.1f}%")

# ============================================================================
# DIVIDEND METRICS
# ============================================================================

print(f"\\n" + "="*80)
print(f"DIVIDEND ANALYSIS")
print(f"="*80)

div_metrics = [
    ('Dividend yield % (indicated)', 'Dividend Yield', '{:.2f}%'),
    ('Dividends per share (Annual)', 'DPS', '${:.2f}'),
    ('Dividend payout ratio %', 'Payout Ratio', '{:.1f}%'),
    ('Dividend growth % YoY', 'Div Growth YoY', '{:.1f}%'),
    ('Continuous dividend payout', 'Consecutive Years', '{:.0f}')
]

for col, label, fmt in div_metrics:
    if col in stocks.columns:
        val = stocks[col].iloc[0]
        if pd.notna(val) and val != 0:
            print(f"{label:<20}: {fmt.format(val):>15}")
        else:
            print(f"{label:<20}: {'N/A':>15}")

# Check if dividend aristocrat
if 'Continuous dividend payout' in stocks.columns:
    years = stocks['Continuous dividend payout'].iloc[0]
    if pd.notna(years) and years >= 25:
        print(f"\\n{'*** DIVIDEND ARISTOCRAT ***':^80}")
        print(f"({years:.0f} consecutive years of dividend payments)")

# ============================================================================
# PROFITABILITY
# ============================================================================

print("\\n" + "="*80)
print("PROFITABILITY METRICS")
print("="*80)

profit_metrics = [
    ('Gross margin % (TTM)', 'Gross Margin', '{:.1f}%'),
    ('Operating margin % (TTM)', 'Operating Margin', '{:.1f}%'),
    ('Net margin % (TTM)', 'Net Margin', '{:.1f}%'),
    ('Return on equity %', 'ROE', '{:.1f}%'),
    ('Return on assets %', 'ROA', '{:.1f}%'),
    ('Return on invested capital %', 'ROIC', '{:.1f}%')
]

for col, label, fmt in profit_metrics:
    if col in stocks.columns:
        val = stocks[col].iloc[0]
        if pd.notna(val) and val != 0:
            print(f"{label:<20}: {fmt.format(val):>15}")
        else:
            print(f"{label:<20}: {'N/A':>15}")

# ============================================================================
# FINANCIAL HEALTH
# ============================================================================

print(f"\\n" + "="*80)
print("FINANCIAL HEALTH")
print("="*80)

health_metrics = [
    ('Debt to equity ratio', 'Debt/Equity', '{:.2f}x'),
    ('Current ratio', 'Current Ratio', '{:.2f}x'),
    ('Quick ratio', 'Quick Ratio', '{:.2f}x'),
    ('Cash to debt ratio', 'Cash/Debt', '{:.2f}x'),
    ('Total debt (Quarterly)', 'Total Debt', '${:.1f}B')
]

for col, label, fmt in health_metrics:
    if col in stocks.columns:
        val = stocks[col].iloc[0]
        if pd.notna(val) and val != 0:
            print(f"{label:<20}: {fmt.format(val):>15}")
        else:
            print(f"{label:<20}: {'N/A':>15}")

# ============================================================================
# KEY INSIGHTS FOR THREAD
# ============================================================================

print(f"\\n" + "="*80)
print("NARRATIVE HOOKS (For Twitter Thread)")
print("="*80)

# Hook 1: Valuation anomaly
if 'Price to earnings ratio' in stocks.columns:
    pe = stocks['Price to earnings ratio'].iloc[0]
    if pd.notna(pe) and pe < 10:
        print(f"\\n[1] VALUATION OPPORTUNITY")
        print(f"P/E ratio of {pe:.2f}x is exceptionally low for a telecom")
        print(f"Typical telecom multiples: 12-18x P/E")
        print(f"Potential upside if multiple re-rates to sector norm")

# Hook 2: Dividend yield
if 'Dividend yield % (indicated)' in stocks.columns:
    div_yield = stocks['Dividend yield % (indicated)'].iloc[0]
    if pd.notna(div_yield) and div_yield > 4:
        print(f"\\n[2] INCOME PLAY")
        print(f"{div_yield:.2f}% dividend yield beats GICs/high-interest savings")
        print(f"At $35.30 stock price, pays ${div_yield/100 * 35.30:.2f}/share annually")

# Hook 3: Market cap
if 'Market capitalization' in stocks.columns:
    mcap = stocks['Market capitalization'].iloc[0] / 1e9
    print(f"\\n[3] BLUE CHIP STATUS")
    print(f"${mcap:.1f}B market cap = Canada's largest telecom")
    print(f"Essential infrastructure business with defensive moat")

# Hook 4: Risk check
if 'Debt to equity ratio' in stocks.columns:
    de = stocks['Debt to equity ratio'].iloc[0]
    if pd.notna(de) and de > 1.5:
        print(f"\\n[4] RISK FACTOR TO MENTION")
        print(f"Debt/Equity of {de:.2f}x is elevated")
        print(f"Interest rate sensitivity = key risk to monitor")

print(f"\\n" + "="*80)
print(f"\\nReady for visualization script: create_visualizations.py")
print(f"Ready for thread writing: thread_format_individual.md")
