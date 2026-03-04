import pandas as pd

# Load data
df = pd.read_csv('../TSX_Merged_Data.csv', low_memory=False)

# Check columns
print("Available columns:")
print(df.columns.tolist())
print('\n' + '='*70)

# Search for NWH
nwh = df[df['Symbol'].str.contains('NWH', case=False, na=False)]
print(f'Found {len(nwh)} NWH matches:')
print('\nAll data for NWH:')
for col in df.columns:
    if col in nwh.columns:
        val = nwh[col].iloc[0]
        if pd.notna(val):
            print(f"{col}: {val}")
