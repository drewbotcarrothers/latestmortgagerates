import pandas as pd

df = pd.read_csv('../TSX_Merged_Data.csv', low_memory=False)
csu = df[df['Symbol'] == 'CSU']

if len(csu) > 0:
    c = csu.iloc[0]
    print('='*60)
    print('CSU - Constellation Software Inc. - Data Verification')
    print('='*60)
    print(f"Symbol: {c['Symbol']}")
    print(f"Name: {c['Description']}")
    print(f"Price: ${c['Price']:.2f}")
    print(f"Sector: {c['Sector']}")
    print(f"Market Cap: ${c['Market capitalization']/1e9:.1f}B")
    print(f"P/E Ratio: {c['Price to earnings ratio']:.2f}x")
    print(f"P/B Ratio: {c['Price to book ratio']:.2f}x")
    print(f"Dividend Yield: {c['Dividend yield % (indicated)']:.2f}%")
    print(f"ROE: {c['Return on equity %, Trailing 12 months']:.2f}%")
    print(f"EPS: ${c['Earnings per share diluted, Trailing 12 months']:.2f}")
    print(f"Book Value/Share: ${c['Book value per share, Quarterly']:.2f}")
    print('='*60)
    print('Data verification: COMPLETE')
else:
    print('CSU not found in dataset')
