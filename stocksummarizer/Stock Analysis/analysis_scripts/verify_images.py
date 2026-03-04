"""
Verify images are now accessible
"""

import urllib.request

urls = [
    "https://stocksummarizer.com/wp-content/uploads/2026/02/chart1_pe_comparison-1.png",
    "https://stocksummarizer.com/wp-content/uploads/2026/02/chart2_dividend_yield-1.png",
    "https://stocksummarizer.com/wp-content/uploads/2026/02/chart3_dashboard-1.png"
]

print("Checking image URLs...")
for url in urls:
    try:
        request = urllib.request.Request(url, method='HEAD')
        response = urllib.request.urlopen(request)
        print(f"OK: {url.split('/')[-1]} ({response.headers.get('Content-Type')})")
    except Exception as e:
        print(f"FAIL: {url.split('/')[-1]} - {e}")

print("\nCheck the post now: https://stocksummarizer.com/bce-bell-canada-stock-analysis-deep-value-or-value-trap/")
