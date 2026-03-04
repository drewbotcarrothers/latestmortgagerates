import pandas as pd

df = pd.read_csv('../TSX_Merged_Data.csv', low_memory=False)
bce = df[df['Symbol'] == 'BCE']

if len(bce) > 0:
    print('BCE Data:')
    print('='*50)
    print(f"Price: {bce.iloc[0]['Price']}")
    
    # Check P/E column
    pe_col = 'Price to earnings ratio'
    if pe_col in bce.columns:
        pe = bce.iloc[0][pe_col]
        print(f"P/E Raw Value: {pe}")
        print(f"P/E Type: {type(pe)}")
        print(f"Is NaN: {pd.isna(pe)}")
    else:
        print(f"P/E column '{pe_col}' NOT FOUND")
    
    # Check for PE-related columns
    pe_cols = [c for c in df.columns if 'earnings' in c.lower() or 'p/e' in c.lower()]
    print(f"\nPE-related columns: {pe_cols}")
    
    # Show all available valuation metrics
    print("\nAll valuation columns:")
    for col in df.columns:
        if any(x in col.lower() for x in ['price', 'earnings', 'p/e', 'pe ', 'ratio', 'value']):
            val = bce.iloc[0][col]
            if pd.notna(val):
                print(f"  {col}: {val}")
else:
    print('BCE not found in dataset')
