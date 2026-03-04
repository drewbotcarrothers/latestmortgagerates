"""
Create TD Bank WordPress post with uploaded chart URLs
"""

import json
import base64
import urllib.request

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"

# Chart URLs from WordPress upload
CHART_URLS = {
    'chart1': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart1_pe_comparison-3.png',
    'chart2': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart2_dividend_yield-3.png',
    'chart3': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart3_dashboard-3.png',
    'chart4': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart4_valuation_metrics-2.png',
    'chart5': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart5_valuation_scorecard-2.png',
    'chart6': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart6_historical_performance-2.png',
    'chart7': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart7_performance_summary-2.png'
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

content = f"""<h2>TD Bank Stock Analysis: Premium Quality at Fair Value - February 25, 2026</h2>

<p><strong>TL;DR:</strong> Toronto-Dominion Bank (TD) trades at 11.2x P/E—slightly below sector average despite superior franchise quality and U.S. growth exposure. This is one of Canada's "Big Six" banks with 170 years of history. Here's the complete analysis:</p>

<hr />

<h3>The Setup: Canada's Second Largest Bank</h3>

<p>TD Bank currently trades at <strong>11.2x P/E</strong>. To put that in perspective:</p>

<ul>
<li>Sector average P/E: 11.7x (modest 4% discount)</li>
<li>TD P/B: 1.88x vs sector 1.35x (trading at premium)</li>
<li>ROE: 16.9% vs sector 19.5%</li>
</ul>

<p>TD is not dramatically undervalued like BCE, but it offers <strong>quality at fair price</strong> with solid dividend income and potential for modest multiple expansion.</p>

<p><img src="{CHART_URLS['chart1']}" alt="TD P/E Comparison" /></p>

<hr />

<h3>The Asset: Canada's Premier Retail Banking Franchise</h3>

<p>Before analyzing the price, let's understand what you actually own:</p>

<ul>
<li><strong>Founded:</strong> 1855 (170 years of operation)</li>
<li><strong>Market Cap:</strong> $215 billion (Canada's 2nd largest bank)</li>
<li><strong>Business Model:</strong> Three key segments:
    <ul>
    <li><strong>Canadian Retail Banking:</strong> Largest branch network in Canada</li>
    <li><strong>U.S. Retail Banking:</strong> Top 10 U.S. bank by deposits, growth engine</li>
    <li><strong>Wholesale Banking:</strong> Capital markets, corporate banking</li>
    </ul>
</li>
</ul>

<p><strong>Key Stats:</strong> Price: $129.16 | P/E: 11.2x | P/B: 1.88x | Div Yield: 3.32% | ROE: 16.9% | Market Cap: $215B</p>

<p><strong>Key Insight:</strong> TD is a high-quality bank with exposure to both Canadian stability and U.S. growth. The U.S. division makes TD more than just a Canadian play.</p>

<p><img src="{CHART_URLS['chart3']}" alt="TD Key Metrics" /></p>

<hr />

<h3>The Valuation: Fair Price for Quality</h3>

<p>TD is trading at roughly fair value:</p>

<ul>
<li><strong>P/E Ratio:</strong> 11.2x vs sector 11.7x—slight discount</li>
<li><strong>P/B Ratio:</strong> 1.88x vs sector 1.35x—premium to book</li>
<li><strong>Dividend Yield:</strong> 3.32% vs sector 4.62%—lower yield than peers</li>
<li><strong>ROE:</strong> 16.9% vs sector 19.5%</li>
</ul>

<p>The market is pricing TD as a quality bank worth a slight premium.</p>

<p><img src="{CHART_URLS['chart4']}" alt="TD Valuation Metrics" /></p>

<hr />

<h3>Historical Context: Multiple Expansion Potential</h3>

<p>Canadian banks have historically traded at 12-15x P/E. TD at 11.2x leaves room for upside.</p>

<p><img src="{CHART_URLS['chart6']}" alt="TD Historical Performance" /></p>

<hr />

<h3>The Math: Fair Value Scenarios</h3>

<p>Current price: $129.16 | EPS: $11.53</p>

<table>
<thead>
<tr><th>Scenario</th><th>P/E Multiple</th><th>Target Price</th><th>Upside</th></tr>
</thead>
<tbody>
<tr><td>Downside</td><td>9x</td><td>$104</td><td>-19%</td></tr>
<tr><td><strong>Current</strong></td><td><strong>11.2x</strong></td><td><strong>$129</strong></td><td><strong>-/-</strong></td></tr>
<tr><td>Fair Value</td><td>12x</td><td>$138</td><td>+7%</td></tr>
<tr><td>Historical</td><td>13x</td><td>$150</td><td>+16%</td></tr>
</tbody>
</table>

<p><strong>Downside Risk:</strong> If Canadian housing market crashes, banks could trade down to 9x P/E (-19%).</p>

<p><strong>Upside:</strong> Multiple expansion to 12-13x offers 7-16% capital appreciation plus 3.3% dividend = 10-20% total return.</p>

<p><img src="{CHART_URLS['chart5']}" alt="TD Valuation Scorecard" /></p>

<hr />

<h3>The Dividend: Reliable Income</h3>

<p>TD offers a solid dividend:</p>

<ul>
<li><strong>Annual Dividend:</strong> $4.20/share</li>
<li><strong>Yield:</strong> 3.32%</li>
<li><strong>Payout Ratio:</strong> ~36% (safe and sustainable)</li>
</ul>

<p>While the 3.32% yield is lower than some peers, the payout ratio is conservative—meaning the dividend is very safe.</p>

<p><img src="{CHART_URLS['chart2']}" alt="TD Dividend Yield" /></p>

<hr />

<h3>Why TD Could Outperform</h3>

<ol>
<li><strong>U.S. Growth:</strong> TD's U.S. retail banking is a differentiator</li>
<li><strong>Rate Cuts:</strong> Lower rates reduce credit loss provisions</li>
<li><strong>Multiple Expansion:</strong> Room to move from 11x toward 12-13x</li>
<li><strong>Conservative Management:</strong> Known for prudent risk management</li>
<li><strong>Dividend Growth:</strong> Only 36% payout ratio leaves room for increases</li>
</ol>

<hr />

<h3>What Could Go Wrong</h3>

<ol>
<li><strong>Canadian Housing Crash:</strong> Significant mortgage exposure</li>
<li><strong>Recession:</strong> Higher unemployment leads to loan defaults</li>
<li><strong>U.S. Operations:</strong> Regulatory or economic weakness</li>
<li><strong>Multiple Compression:</strong> Banks permanently re-rated lower</li>
</ol>

<hr />

<h3>Bottom Line: The Verdict</h3>

<p><strong>TD is not a deep value play like BCE.</strong> It's a quality company trading at fair value with modest upside potential.</p>

<p><strong>For Income Investors:</strong> TD offers a 3.3% yield with growth potential. The dividend is safer than higher-yielding alternatives.</p>

<p><strong>For Growth Investors:</strong> Modest 7-16% upside from multiple expansion, plus dividend = 10-20% total return.</p>

<p><strong>For Value Investors:</strong> TD is fairly priced, not cheap. If you want deep value, look elsewhere.</p>

<h4>My Take:</h4>

<p>TD is a <strong>buy-and-hold forever stock</strong> for conservative investors. You're not getting a bargain, but you're getting quality at a fair price with solid income and modest growth.</p>

<p><strong>Verdict:</strong> Suitable for dividend-growth portfolios. Not a speculative play—it's a sleep-well-at-night bank stock.</p>

<p><img src="{CHART_URLS['chart7']}" alt="TD Performance Summary" /></p>

<hr />

<h3>Key Metrics Summary</h3>

<table>
<thead>
<tr><th>Metric</th><th>Value</th><th>Context</th></tr>
</thead>
<tbody>
<tr><td>Price</td><td>$129.16</td><td>Near fair value</td></tr>
<tr><td>P/E Ratio</td><td>11.2x</td><td>4% below sector</td></tr>
<tr><td>P/B Ratio</td><td>1.88x</td><td>Premium to sector</td></tr>
<tr><td>Dividend Yield</td><td>3.32%</td><td>Lower than peers</td></tr>
<tr><td>Market Cap</td><td>$215B</td><td>Canada's 2nd largest</td></tr>
<tr><td>ROE</td><td>16.9%</td><td>Strong profitability</td></tr>
<tr><td>Est. Upside</td><td>$138-150</td><td>+7% to +16%</td></tr>
</tbody>
</table>

<hr />

<h3>Important Disclosures</h3>

<p><em>This analysis is for informational and educational purposes only. It does not constitute investment advice. Always conduct your own research and consult with a qualified financial advisor before making investment decisions. Data sourced from TradingView and company filings. Analysis date: February 25, 2026.</em></p>

<p><em>Author may hold positions in securities mentioned. Past performance does not guarantee future results.</em></p>
"""

print("="*70)
print("Publishing TD Bank Analysis to WordPress")
print("="*70)

title = "TD Bank Stock Analysis: Premium Quality at Fair Value"
result = create_post(title, content, status="publish")

if result:
    print("\n" + "="*70)
    print("SUCCESS - TD Analysis Published!")
    print(f"URL: {result['link']}")
    print("="*70)
else:
    print("\nFailed to publish post")
