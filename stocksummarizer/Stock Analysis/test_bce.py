# Quick test for BCE
import pandas as pd
import sys

# Load merged data
df = pd.read_csv('TSX_Merged_Data.csv', low_memory=False)

# Check for BCE
bce = df[df['Symbol'] == 'BCE']

if len(bce) == 0:
    print("⚠ BCE not found in dataset")
    # Check for similar symbols
    print("\\nSearching for similar symbols...")
    for sym in ['BCE', 'BCE.TO', 'BCE-PA', 'BCE-PD']:
        if sym in df['Symbol'].values:
            print(f"  Found: {sym}")
else:
    print("="*80)
    print("BCE (Bell Canada Enterprises) - Quick Analysis")
    print("="*80)
    
    row = bce.iloc[0]
    
    print("\\n[ Basic Info ]")
    print(f"  Company: {row.get('Description', 'N/A')}")
    print(f"  Sector: {row.get('Sector', 'N/A')}")
    print(f"  Industry: {row.get('Industry', 'N/A')}")
    
    print("\\n[ Valuation ]")
    print(f"  Price: ${row.get('Price', 'N/A')}")
    print(f"  Market Cap: {row.get('Market capitalization', 'N/A')}")
    print(f"  P/E Ratio: {row.get('Price to earnings ratio', 'N/A')}")
    print(f"  P/B Ratio: {row.get('Price to book ratio', 'N/A')}")
    print(f"  EV/EBITDA: {row.get('Enterprise value to EBITDA ratio', 'N/A')}")
    
    print("\\n[ Performance ]")
    print(f"  Price Change (1D): {row.get('Price - Change 1 day %', 'N/A')}%")
    print(f"  Price Change (1M): {row.get('Price - Change 1 month %', 'N/A')}%")
    print(f"  Price Change (1Y): {row.get('Price - Change 1 year %', 'N/A')}%")
    
    print("\\n[ Dividends ]")
    print(f"  Dividend Yield: {row.get('Dividend yield % (indicated)', 'N/A')}%")
    print(f"  Dividend per Share: ${row.get('Dividends per share (Annual)', 'N/A')}")
    print(f"  Payout Ratio: {row.get('Dividend payout ratio %', 'N/A')}%")
    print(f"  Dividend Growth YoY: {row.get('Dividend growth % YoY', 'N/A')}%")
    
    print("\\n[ Profitability ]")
    print(f"  Gross Margin: {row.get('Gross margin % (TTM)', 'N/A')}%")
    print(f"  Operating Margin: {row.get('Operating margin % (TTM)', 'N/A')}%")
    print(f"  Net Margin: {row.get('Net margin % (TTM)', 'N/A')}%")
    print(f"  ROE: {row.get('Return on equity %', 'N/A')}%")
    print(f"  ROA: {row.get('Return on assets %', 'N/A')}%")
    
    print("\\n[ Financial Health ]")
    print(f"  Debt/Equity: {row.get('Debt to equity ratio', 'N/A')}")
    print(f"  Current Ratio: {row.get('Current ratio', 'N/A')}")
    print(f"  Quick Ratio: {row.get('Quick ratio', 'N/A')}")
    print(f"  Cash to Debt: {row.get('Cash to debt ratio', 'N/A')}")
    
    print("\\n[ Financial Period ]")
    print(f"  Latest Period: {row.get('Fiscal period end date', 'N/A')}")
    
    print("\\n" + "="*80)
    
    # Export key stats for reference
    print("\\n[ OK ] Analysis complete. Key metrics extracted.")
