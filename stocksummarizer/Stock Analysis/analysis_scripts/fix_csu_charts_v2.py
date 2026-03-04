"""
Fix CSU WordPress post - update with CORRECT chart URLs
"""

import json
import base64
import urllib.request

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"

def update_post(post_id, new_content):
    url = f"{WP_URL}/wp-json/wp/v2/posts/{post_id}"
    
    data = {
        "content": new_content
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
        print(f"Error updating post: {e}")
        return None

# CORRECT CSU chart URLs (from actual WordPress media library)
CHART_URLS = {
    'chart1': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart1_pe_comparison-4.png',
    'chart2': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart2_growth_metrics.png',
    'chart3': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart3_dashboard-4.png',
    'chart4': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart4_valuation_analysis.png',
    'chart5': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart5_growth_scorecard.png',
    'chart6': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart6_historical_performance-3.png',
    'chart7': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart7_performance_summary-3.png'
}

print("="*70)
print("Updating CSU Post with CORRECT Chart URLs")
print("="*70)

for name, url in CHART_URLS.items():
    print(f"{name}: {url}")

# Update post 53 with new content
post_id = 53

new_content = f"""<h2>Constellation Software Stock Analysis: Premium Growth or Overvalued? - February 26, 2026</h2>

<p><strong>TL;DR:</strong> Constellation Software (CSU) trades at 55.8x P/E, nearly 2.5x the tech sector average. Revenue growing 18% with 22% ROE. This is a compounder that's priced for perfection. Here's the full analysis.</p>

<hr />

<h3>The Setup: The Canadian Software Compounder</h3>

<p>Constellation Software (TSX: CSU) currently trades at <strong>$2,454 per share with a 55.8x P/E</strong>. To put that in perspective:</p>

<ul>
<li>Tech sector average P/E: 23.9x</li>
<li>CSU P/E: 55.8x (133% premium)</li>
<li>Current market cap: $53.3 billion</li>
</ul>

<p>The core question: <strong>Is 18% revenue growth worth paying 2.5x the sector multiple?</strong></p>

<p><img src="{CHART_URLS['chart1']}" alt="CSU P/E Comparison" /></p>

<hr />

<h3>The Asset: The Acquisition Machine</h3>

<p>Before analyzing the price, let's understand what you actually own:</p>

<ul>
<li><strong>Founded:</strong> 1995 by Mark Leonard (30 years in operation)</li>
<li><strong>Market Cap:</strong> $53.3 billion</li>
<li><strong>Business Model:</strong> Acquires smaller vertical market software (VMS) companies
<ul>
<li>Over <strong>150 acquisitions</strong> since inception</li>
<li>Focuses on niche software markets</li>
<li>Decentralized operating model</li>
<li>Recurring revenue base</li>
</ul>
</li>
<li><strong>Key Stats:</strong>
<ul>
<li>Revenue: $15.6 billion (TTM)</li>
<li>Revenue growth: 18.2%</li>
<li>EPS: $43.96</li>
<li>ROE: 22.1%</li>
<li>P/B: 10.78x</li>
<li>Dividend yield: 0.23% (minimal)</li>
</ul>
</li>
</ul>

<p><img src="{CHART_URLS['chart3']}" alt="CSU Key Metrics" /></p>

<hr />

<h3>The Valuation: Priced for Perfection</h3>

<p>At 55.8x P/E, CSU is trading at a massive premium:</p>

<ul>
<li><strong>P/E Ratio:</strong> 55.8x vs sector 23.9x (133% premium)</li>
<li><strong>P/B Ratio:</strong> 10.78x vs sector 5.57x (94% premium)</li>
<li><strong>ROE:</strong> 22.1% vs sector 43.1% (lower than average)</li>
<li><strong>Revenue Growth:</strong> 18.2% vs sector 8% (2.3x faster growth)</li>
</ul>

<p>The premium is justified by growth, but 55x P/E leaves almost no room for disappointment.</p>

<p><img src="{CHART_URLS['chart2']}" alt="CSU Growth Metrics" /></p>

<hr />

<h3>Historical Context: The Compound Returns</h3>

<p>CSU has been one of Canada's best-performing stocks over the past decade:</p>

<ul>
<li>10-year return: Over 1,300%</li>
<li>Stock has split multiple times</li>
<li>Multiple expansion drove much of the gains</li>
<li>Original shareholders have life-changing returns</li>
</ul>

<p>The challenge: Past returns don't guarantee future results.</p>

<p><img src="{CHART_URLS['chart4']}" alt="CSU Valuation Analysis" /></p>

<hr />

<h3>The Math: Growth Required to Justify Price</h3>

<p>Current EPS: $43.96 | Price: $2,454</p>

<table>
<thead>
<tr>
<th>Growth Rate</th>
<th>Future EPS</th>
<th>At 40x P/E</th>
<th>Upside</th>
</tr>
</thead>
<tbody>
<tr>
<td>10%</td>
<td>$48.36</td>
<td>$1,934</td>
<td>-21%</td>
</tr>
<tr>
<td>15%</td>
<td>$50.56</td>
<td>$2,022</td>
<td>-18%</td>
</tr>
<tr>
<td>20%</td>
<td>$52.75</td>
<td>$2,110</td>
<td>-14%</td>
</tr>
<tr>
<td>25%</td>
<td>$54.95</td>
<td>$2,198</td>
<td>-10%</td>
</tr>
</tbody>
</table>

<p><strong>The Reality:</strong> Even with 25% EPS growth, multiple compression to 40x P/E would result in -10% downside. The stock is priced for sustained 30%+ EPS growth combined with a maintained 55x multiple.</p>

<p><img src="{CHART_URLS['chart5']}" alt="CSU Growth Scorecard" /></p>

<p><img src="{CHART_URLS['chart6']}" alt="CSU Historical Performance" /></p>

<hr />

<h3>Why It Could Work (Bull Case)</h3>

<ol>
<li><strong>Acquisition Pipeline:</strong> Thousands of potential VMS acquisition targets exist. CSU's playbook is proven.</li>
<li><strong>Recurring Revenue:</strong> Vertical market software customers rarely switch. Stickiness creates predictable cash flows.</li>
<li><strong>Decentralized Model:</strong> Minimal central overhead. Acquired companies keep autonomy. Better than typical conglomerate approach.</li>
<li><strong>Mark Leonard:</strong> Founder-CEO with 30 years of execution. Still actively involved. Proven capital allocator.</li>
<li><strong>Growth Runway:</strong> International expansion just beginning. European markets underpenetrated.</li>
</ol>

<hr />

<h3>What Could Go Wrong (Bear Case)</h3>

<ol>
<li><strong>Acquisition Exhaustion:</strong> Good deals become scarce. Competition for VMS companies increases. Prices paid escalate.</li>
<li><strong>Multiple Compression:</strong> Any growth disappointment triggers massive P/E contraction. 55x multiple has 50% downside to 25-30x.</li>
<li><strong>Size Challenge:</strong> At $53B market cap, smaller acquisitions barely move needle. Need $5B+ deals for material impact.</li>
<li><strong>Management Transition:</strong> Mark Leonard won't run company forever. Culture could change.</li>
<li><strong>Macro Risk:</strong> Recession crushes growth stock multiples regardless of business quality.</li>
</ol>

<hr />

<h3>Bottom Line: The Verdict</h3>

<p><strong>CSU is a great business trading at a dangerous price.</strong></p>

<p><strong>For Growth Investors:</strong> The 18% revenue growth is attractive, but 55x P/E requires perfection. Better opportunities likely exist elsewhere.</p>

<p><strong>For Value Investors:</strong> Stay away. This is the opposite of value investing. Paying 133% premium to sector for growth already priced in.</p>

<p><strong>For Momentum Investors:</strong> The trend is your friend until it isn't. Works until growth slows.</p>

<h4>My Take:</h4>

<p>CSU is a compounder priced as a hypergrowth stock. The business is high quality, but the valuation assumes flawless execution forever. At 55x P/E, one earnings miss could trigger 30-40% decline.</p>

<p><strong>Verdict:</strong> Wait for a better entry. Worth buying at 30-35x P/E (~$1,300-1,500) after a correction. Until then, the asymmetric risk/reward favors patience.</p>

<p><img src="{CHART_URLS['chart7']}" alt="CSU Performance Summary" /></p>

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
<td>$2,454</td>
<td>High multiple</td>
</tr>
<tr>
<td>P/E Ratio</td>
<td>55.8x</td>
<td>133% above sector</td>
</tr>
<tr>
<td>Market Cap</td>
<td>$53.3B</td>
<td>Large cap</td>
</tr>
<tr>
<td>Revenue Growth</td>
<td>18.2%</td>
<td>Strong growth</td>
</tr>
<tr>
<td>ROE</td>
<td>22.1%</td>
<td>Quality returns</td>
</tr>
<tr>
<td>Est. Fair Value</td>
<td>$1,300-1,500</td>
<td>30-35x P/E</td>
</tr>
</tbody>
</table>

<hr />

<h3>Important Disclosures</h3>

<p><em>This analysis is for informational and educational purposes only. Data sourced from TradingView. Analysis date: February 26, 2026.</em></p>
"""

result = update_post(post_id, new_content)

if result:
    print("\n" + "="*70)
    print("SUCCESS - CSU Post Updated with ALL CORRECT Chart URLs!")
    print(f"URL: {result['link']}")
    print("="*70)
else:
    print("\nFailed to update post")
