import pandas as pd

df = pd.read_csv('../TSX_Merged_Data.csv', low_memory=False)
td = df[df['Symbol'] == 'TD']

if len(td) > 0:
    t = td.iloc[0]
    print('='*60)
    print('TD (Toronto-Dominion Bank) - Data Verification')
    print('='*60)
    print(f"Symbol: {t['Symbol']}")
    print(f"Name: {t['Description']}")
    print(f"Price: ${t['Price']:.2f}")
    print(f"Sector: {t['Sector']}")
    print(f"Market Cap: ${t['Market capitalization']/1e9:.1f}B")
    print(f"P/E Ratio: {t['Price to earnings ratio']:.2f}x")
    print(f"P/B Ratio: {t['Price to book ratio']:.2f}x")
    print(f"Dividend Yield: {t['Dividend yield % (indicated)']:.2f}%")
    print(f"ROE: {t['Return on equity %, Trailing 12 months']:.2f}%")
    print(f"EPS: ${t['Earnings per share diluted, Trailing 12 months']:.2f}")
    print(f"Book Value/Share: ${t['Book value per share, Quarterly']:.2f}")
    print(f"Debt/Equity: {t['Debt to equity ratio, Quarterly']:.2f}x")
    print('='*60)
    print('Data verification: COMPLETE')
else:
    print('TD not found in dataset')
