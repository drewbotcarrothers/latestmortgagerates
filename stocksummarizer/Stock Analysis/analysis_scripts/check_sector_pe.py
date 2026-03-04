import pandas as pd

# Load data
df = pd.read_csv('../TSX_Merged_Data.csv', low_memory=False)

# Get BCE's sector
bce = df[df['Symbol'] == 'BCE'].iloc[0]
bce_sector = bce['Sector']

print(f"BCE Sector: {bce_sector}")
print(f"BCE P/E: {bce['Price to earnings ratio']:.2f}x")
print()

# Get all stocks in same sector with valid P/E
sector_stocks = df[
    (df['Sector'] == bce_sector) & 
    (df['Price to earnings ratio'].notna()) &
    (df['Price to earnings ratio'] > 0) &
    (df['Price to earnings ratio'] < 100)  # Exclude outliers
].copy()

# Sort by market cap (largest first)
sector_stocks = sector_stocks.sort_values('Market capitalization', ascending=False)

print(f"\nTotal stocks in {bce_sector} sector: {len(sector_stocks)}")
print(f"\nSector Average P/E: {sector_stocks['Price to earnings ratio'].mean():.2f}x")
print(f"Sector Median P/E: {sector_stocks['Price to earnings ratio'].median():.2f}x")

print("\n" + "="*80)
print(f"ALL STOCKS IN {bce_sector.upper()} SECTOR (sorted by market cap):")
print("="*80)

for idx, row in sector_stocks.iterrows():
    symbol = row['Symbol']
    name = row['Description'][:40] if len(row['Description']) > 40 else row['Description']
    pe = row['Price to earnings ratio']
    market_cap = row['Market capitalization'] / 1e9  # Convert to billions
    
    # Highlight BCE
    marker = " *** BCE ***" if symbol == 'BCE' else ""
    
    print(f"{symbol:6} | {name:40} | P/E: {pe:6.2f}x | Market Cap: ${market_cap:8.2f}B{marker}")

print("\n" + "="*80)
print("SUMMARY:")
print(f"- BCE P/E: {bce['Price to earnings ratio']:.2f}x")
print(f"- Sector Average P/E: {sector_stocks['Price to earnings ratio'].mean():.2f}x")
print(f"- BCE Discount: {((sector_stocks['Price to earnings ratio'].mean() - bce['Price to earnings ratio']) / sector_stocks['Price to earnings ratio'].mean() * 100):.1f}%")
print("="*80)
