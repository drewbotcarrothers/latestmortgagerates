"""
Create CSU WordPress post with clean HTML
"""

import json
import base64
import urllib.request

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"

# Chart URLs from WordPress - need to check actual URLs
CHART_URLS = {
    'chart1': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart1_pe_comparison-1.png',
    'chart2': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart2_growth_metrics-1.png',
    'chart3': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart3_dashboard-1.png',
    'chart4': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart4_valuation_analysis-1.png',
    'chart5': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart5_growth_scorecard-1.png',
    'chart6': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart6_historical_performance-1.png',
    'chart7': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart7_performance_summary-1.png'
}

def create_post(title, content, status="publish"):
    url = f"{WP_URL}/wp-json/wp/v2/posts"
    
    data = {
        "title": title,
        "content": content,
        "status": status
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic {base64.b64encode(f'{WP_USER}:{WP_APP_PASSWORD}'.encode()).decode()}"
    }
    
    request = urllib.request.Request(
        url,
        data=json.dumps(data).encode(),
        headers=headers,
        method="POST"
    )
    
    try:
        response = urllib.request.urlopen(request)
        result = json.loads(response.read().decode())
        return result
    except Exception as e:
        print(f"Error: {e}")
        return None

print("="*70)
print("Publishing CSU Analysis to WordPress")
print("="*70)

title = "Constellation Software (CSU) Analysis: Premium Growth at a Precarious Price"

# Load content from file - will generate separately
with open('csu_content.html', 'r') as f:
    content = f.read()

result = create_post(title, content, status="publish")

if result:
    print("\n" + "="*70)
    print("SUCCESS - CSU Analysis Published!")
    print(f"URL: {result['link']}")
    print("="*70)
else:
    print("\nFailed to publish post")
