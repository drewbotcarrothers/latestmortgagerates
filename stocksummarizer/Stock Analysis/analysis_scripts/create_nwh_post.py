"""
Create NWH WordPress post
"""

import json
import base64
import urllib.request

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"

# Chart URLs from WordPress (latest NWH uploads)
CHART_URLS = {
    'chart1': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart1_valuation_comparison.png',
    'chart2': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart2_dividend_yield.png',
    'chart3': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart3_dashboard.png',
    'chart4': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart4_financial_health.png',
    'chart5': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart5_recovery_analysis.png',
    'chart6': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart6_historical_performance.png',
    'chart7': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart7_investment_summary.png'
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
print("Publishing NWH Analysis to WordPress")
print("="*70)

title = "NorthWest Healthcare REIT (NWH.UN) Analysis: Deep Value or Value Trap?"

content = f"""<h2>NorthWest Healthcare REIT Stock Analysis: Trading Below Book Value - February 27, 2026</h2>

<p><strong>TL;DR:</strong> NorthWest Healthcare REIT (NWH.UN) trades at $5.72, 12% below book value, with a 6.4% dividend yield. But revenue is declining 13%, payout ratio is 180%, and debt is high at 1.79x equity. This is either a deep value opportunity or a value trap. Here's the full analysis.</p>

<hr />

<h3>The Setup: Trading Below Book Value</h3>

<p>NWH.UN currently trades at <strong>$5.72 per share with a price-to-book ratio of just 0.88x</strong>. This means:</p>

<ul>
<li>Book value per share: $6.49</li>
<li>Current price: $5.72</li>
<li>Trading 12% below book value</li>
<li>Market cap: $1.4 billion</li>
</ul>

<p>The core question: <strong>Is this a bargain basement healthcare REIT, or a classic value trap?</strong></p>

<p><img src="{CHART_URLS['chart1']}" alt="NWH Valuation Comparison" /></p>

<hr />

<h3>The Asset: Healthcare Real Estate</h3>

<p>Before analyzing the price, let's understand what you actually own:</p>

<ul>
<li><strong>Asset Class:</strong> Healthcare real estate investment trust (REIT)
<ul>
<li>Hospitals, medical offices, clinics</li>
<li>International portfolio (Canada, Europe, Australasia)</li>
<li>Defensive sector (healthcare)</li>
</ul>
</li>
<li><strong>Market Cap:</strong> $1.4 billion</li>
<li><strong>Key Stats:</strong>
<ul>
<li>Total Revenue: $433M (TTM)</li>
<li>Revenue growth: -13.3% (declining)</li>
<li>Gross margin: 74.4%</li>
<li>Operating margin: 55.9%</li>
<li>P/E: 28.8x</li>
<li>P/B: 0.88x (below book)</li>
<li>Dividend yield: 6.44%</li>
</ul>
</li>
</ul>

<p><img src="{CHART_URLS['chart3']}" alt="NWH Key Metrics Dashboard" /></p>

<hr />

<h3>The Valuation: Below Book But Risky</h3>

<p>At 0.88x P/B, NWH is trading below book value:</p>

<ul>
<li><strong>P/B Ratio:</strong> 0.88x (40% below sector average of 1.46x)</li>
<li><strong>Dividend Yield:</strong> 6.44% vs sector 4.45% (45% premium)</li>
<li><strong>Revenue Growth:</strong> -13.3% (red flag)</li>
<li><strong>ROE:</strong> 3.04% (very low)</li>
</ul>

<p>The discount exists because the market is pricing in risk. Trading below book is rare for REITs and usually signals trouble.</p>

<p><img src="{CHART_URLS['chart2']}" alt="NWH Dividend Yield" /></p>

<hr />

<h3>The Red Flags: Why It's Cheap</h3>

<p>NWH trades below book for reasons:</p>

<ul>
<li><strong>Declining Revenue:</strong> -13% year-over-year</li>
<li><strong>Low Profitability:</strong> ROE of 3% is terrible for a REIT</li>
<li><strong>High Leverage:</strong> Debt-to-equity of 1.79x is aggressive</li>
<li><strong>Dividend Risk:</strong> Payout ratio of 180% (not covered by earnings)</li>
<li><strong>5-Year Performance:</strong> -57% (massive destruction of value)</li>
</ul>

<p>This isn't a hidden gem. The market knows something is wrong.</p>

<p><img src="{CHART_URLS['chart4']}" alt="NWH Financial Health" /></p>

<hr />

<h3>The Math: Recovery Scenarios</h3>

<p>Current price: $5.72 | Book value: $6.49</p>

<table>
<thead>
<tr>
<th>Scenario</th>
<th>Target Price</th>
<th>Upside</th>
</tr>
</thead>
<tbody>
<tr>
<td>Trade to Book Value</td>
<td>$6.49</td>
<td>+13%</td>
</tr>
<tr>
<td>Fair Value (10% premium)</td>
<td>$7.14</td>
<td>+25%</td>
</tr>
<tr>
<td>Turnaround Success</td>
<td>$8.00</td>
<td>+40%</td>
</tr>
<tr>
<td>Dividend Cut (bear case)</td>
<td>$4.50</td>
<td><span style="color: #E53935;">-21%</span></td>
</tr>
</tbody>
</table>

<p><strong>The Reality:</strong> Even reaching book value requires confidence to return. That's a big if.</p>

<p><img src="{CHART_URLS['chart5']}" alt="NWH Recovery Analysis" /></p>

<hr />

<h3>Why It Could Work (Bull Case)</h3>

<ol>
<li><strong>Below Book Value:</strong> Asset values support the price</li>
<li><strong>High Yield:</strong> 6.4% dividend while you wait</li>
<li><strong>Defensive Sector:</strong> Healthcare real estate tends to be stable</li>
<li><strong>Turnaround Potential:</strong> New management could improve operations</li>
<li><strong>Recent Strength:</strong> +12% YTD vs -57% over 5 years (momentum shift?)</li>
</ol>

<p><img src="{CHART_URLS['chart6']}" alt="NWH Historical Performance" /></p>

<hr />

<h3>What Could Go Wrong (Bear Case)</h3>

<ol>
<li><strong>Dividend Cut:</strong> 180% payout ratio is unsustainable</li>
<li><strong>Continued Decline:</strong> Revenue keeps dropping</li>
<li><strong>Debt Pressure:</strong> High leverage becomes a burden in high rate environment</li>
<li><strong>Asset Write-Downs:</strong> Book value might be overstated</li>
<li><strong>Value Trap:</strong> Cheap for a reason - could get cheaper</li>
</ol>

<hr />

<h3>Bottom Line: The Verdict</h3>

<p><strong>NWH is a speculative turnaround bet, not an investment.</strong></p>

<p><strong>For Income Investors:</strong> The 6.4% yield is tempting but risky. A dividend cut would crush the stock. Better REITs exist.</p>

<p><strong>For Value Investors:</strong> Trading below book is interesting, but only if assets are worth book. Needs deep due diligence.</p>

<p><strong>For Growth Investors:</strong> This is the opposite of what you want. Declining revenue, low ROE.</p>

<h4>My Take:</h4>

<p>NWH is a high-risk, potentially high-reward speculation. The discount to book and high yield create a tempting entry, but the declining revenue and unsustainable payout ratio are serious red flags. This is only for investors willing to bet on a turnaround and accept potential capital loss.</p>

<p><strong>Verdict:</strong> Pass for most investors. If you must speculate, keep position small (under 2% of portfolio), use limit orders below $5.50, and set a stop loss at $4.75. This is not a core holding.</p>

<p><img src="{CHART_URLS['chart7']}" alt="NWH Investment Summary" /></p>

<hr />

<h3>Key Metrics Summary</h3>

<table>
<thead>
<tr>
<th>Metric</th>
<th>Value</th>
<th>Context</th>
</tr>
</thead>
<tbody>
<tr>
<td>Price</td>
<td>$5.72</td>
<td>Below book</td>
</tr>
<tr>
<td>P/B Ratio</td>
<td>0.88x</td>
<td>40% below sector</td>
</tr>
<tr>
<td>Dividend Yield</td>
<td>6.44%</td>
<td>High but risky</td>
</tr>
<tr>
<td>Revenue Growth</td>
<td>-13.3%</td>
<td>Declining (red flag)</td>
</tr>
<tr>
<td>Payout Ratio</td>
<td>180%</td>
<td>Not sustainable</td>
</tr>
<tr>
<td>Debt/Equity</td>
<td>1.79x</td>
<td>High leverage</td>
</tr>
<tr>
<td>5-Year Return</td>
<td>-57%</td>
<td>Massive underperformance</td>
</tr>
</tbody>
</table>

<hr />

<h3>Important Disclosures</h3>

<p><em>This analysis is for informational and educational purposes only. It does not constitute investment advice. Always conduct your own research and consult with a qualified financial advisor before making investment decisions. Data sourced from TradingView. Analysis date: February 27, 2026.</em></p>

<p><em>Author does not hold positions in securities mentioned. Past performance does not guarantee future results. Investing in REITs involves risks including potential for significant capital loss.</em></p>
"""

result = create_post(title, content, status="publish")

if result:
    print("\n" + "="*70)
    print("SUCCESS - NWH Analysis Published!")
    print(f"URL: {result['link']}")
    print("="*70)
else:
    print("\nFailed to publish post")
