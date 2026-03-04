"""
Final fix for BCE post images
Rebuilds content with correct image URLs
"""

import json
import base64
import urllib.request
import urllib.error
from datetime import datetime

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"

POST_ID = 17

# CORRECT image URLs
CHART_URLS = {
    'chart1': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart1_pe_comparison-1.png',
    'chart2': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart2_dividend_yield-1.png',
    'chart3': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart3_dashboard-1.png'
}

def update_post_content(post_id, content):
    """Update post with new content"""
    url = f"{WP_URL}/wp-json/wp/v2/posts/{post_id}"
    
    data = {
        "content": content
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
    except urllib.error.HTTPError as e:
        print(f"ERROR: {e.code} {e.reason}")
        print(e.read().decode())
        return None

def generate_fixed_content():
    """Generate post content with correct image URLs"""
    
    date_str = datetime.now().strftime("%B %d, %Y")
    
    content = f"""<h2>BCE (Bell Canada) Stock Analysis - {date_str}</h2>

<p><strong>BCE Inc.</strong> (TSX: BCE), better known as Bell Canada, is currently trading at a valuation that suggests the market views it as distressed. At just <strong>5.3x P/E</strong>, this is not a typical value stock price--it's a distress price. For a company that dominates Canadian communications infrastructure, something doesn't add up.</p>

<hr />

<h3>Company Overview</h3>

<ul>
<li><strong>Founded:</strong> 1880 (145+ years of operation)</li>
<li><strong>Market Cap:</strong> $32.8 billion (Canada's largest telecom)</li>
<li><strong>Current Price:</strong> $35.30</li>
<li><strong>Sector:</strong> Communications / Telecommunications</li>
<li><strong>Subscribers:</strong> 10M+ wireless, 4M+ internet customers</li>
<li><strong>Network Coverage:</strong> 99% of Canadian population</li>
</ul>

<p>Bell operates four business segments: Wireless (60% EBITDA margins, duopoly with Rogers), Wireline (fiber internet), Media (CTV, Crave), and Business Solutions (enterprise services). This is essential infrastructure--not a speculative growth play.</p>

<hr />

<h3>The Valuation Anomaly</h3>

<p>BCE currently trades at just <strong>5.3x P/E</strong>, compared to the telecommunications sector average of <strong>11.2x</strong>. This represents a <strong>52% discount</strong> to its peers.</p>

<h4>P/E Ratio Comparison:</h4>
<ul>
<li>BCE: <strong>5.3x</strong></li>
<li>Rogers (RCI.B): ~11x</li>
<li>Telus (T): ~18x</li>
<li>Sector Average: 11.2x</li>
</ul>

<p>In the last 20 years, Bell has rarely traded below 8x P/E. At 5.3x, this is historically cheap. Either this is the buying opportunity of a decade, or the market is telling us something important.</p>

<p><img src="{CHART_URLS['chart1']}" alt="BCE P/E Comparison Chart" /></p>

<hr />

<h3>Dividend Analysis</h3>

<p>BCE currently yields <strong>4.97%</strong>, paying approximately <strong>$1.75 per share annually</strong> in dividends. The company has maintained dividend payments for <strong>20 consecutive years</strong>.</p>

<h4>Dividend Yield Comparison:</h4>
<ul>
<li><strong>BCE Yield: 4.97%</strong></li>
<li>Typical GIC Rate: ~3.0%</li>
<li>Yield Advantage: +66%</li>
</ul>

<p>At current prices, a $10,000 investment would generate approximately $497 in annual dividend income--$197 more than a typical GIC.</p>

<p><img src="{CHART_URLS['chart2']}" alt="BCE Dividend Yield Chart" /></p>

<hr />

<h3>The Bull Case</h3>

<ol>
<li><strong>Extreme Valuation:</strong> 5.3x P/E prices in disaster. Bell's business is remarkably resilient--people don't cancel cell phones during recessions.</li>
<li><strong>Rate Cuts Tailwind:</strong> With the Bank of Canada cutting rates, Bell's significant debt becomes cheaper to service, improving cash flow.</li>
<li><strong>Competitive Moat:</strong> Duopoly with Rogers in wireless. Regulatory barriers protect returns.</li>
<li><strong>Mean Reversion:</strong> Extreme valuations rarely last forever.</li>
</ol>

<hr />

<h3>The Bear Case</h3>

<ol>
<li><strong>Dividend Sustainability:</strong> 90%+ payout ratio leaves little cushion. Any business decline could pressure the dividend.</li>
<li><strong>Debt Load:</strong> Significant debt to refinance in a higher-rate environment (though rates are now falling).</li>
<li><strong>Cord-Cutting:</strong> Traditional TV business shrinking as consumers move to streaming.</li>
<li><strong>Wireless Competition:</strong> Rogers-Shaw merger could intensify pricing pressure.</li>
</ol>

<p><img src="{CHART_URLS['chart3']}" alt="BCE Dashboard Chart" /></p>

<hr />

<h3>Valuation Math</h3>

<p>If BCE simply re-rates to <strong>10x P/E</strong> (still below sector average):</p>
<ul>
<li><strong>Target Price:</strong> ~$65/share</li>
<li><strong>Upside from Current:</strong> +84%</li>
<li><strong>Plus Dividends:</strong> +5% annually</li>
</ul>

<p>If it re-rates to historical <strong>12x P/E</strong>:</p>
<ul>
<li><strong>Target Price:</strong> ~$78/share</li>
<li><strong>Upside:</strong> +121%</li>
</ul>

<p><strong>Downside Risk:</strong> If the dividend is cut, the stock could drop to $25-30 (10-15% downside).</p>

<p><strong>Risk/Reward:</strong> Risking 10-15% downside for 80-120% upside potential. An asymmetric bet.</p>

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
<td>$35.30</td>
<td>Near multi-year lows</td>
</tr>
<tr>
<td>P/E Ratio</td>
<td>5.3x</td>
<td>52% below sector avg</td>
</tr>
<tr>
<td>P/B Ratio</td>
<td>1.72x</td>
<td>47% below sector avg</td>
</tr>
<tr>
<td>Dividend Yield</td>
<td>4.97%</td>
<td>Beats GICs by 65%</td>
</tr>
<tr>
<td>Market Cap</td>
<td>$32.8B</td>
<td>Canada's largest telecom</td>
</tr>
<tr>
<td>Consecutive Div Years</td>
<td>20</td>
<td>Through 2008, COVID</td>
</tr>
</tbody>
</table>

<hr />

<h3>Investment Verdict</h3>

<p><strong>BCE is not a stock that's going to 10x your money.</strong> But it's also unlikely to stay at 5x P/E forever.</p>

<p><strong>For Income Investors:</strong> The 5% dividend yield with potential 50%+ capital appreciation if sentiment shifts makes it worth considering.</p>

<p><strong>For Growth Investors:</strong> Probably too boring. Look elsewhere.</p>

<p><strong>For Value Hunters:</strong> This is the kind of asymmetric setup that builds wealth over time.</p>

<p><strong>Bottom Line:</strong> A coiled spring disguised as a value trap. At 5x P/E with a market-leading position in essential infrastructure, the odds favor the patient investor.</p>

<hr />

<h3>Disclosure</h3>

<p><em>This analysis is for informational and educational purposes only. It does not constitute investment advice. Always conduct your own research and consult with a qualified financial advisor before making investment decisions. Data sourced from TradingView and company filings. Analysis date: {date_str}.</em></p>
"""
    
    return content

if __name__ == "__main__":
    print("Fixing BCE post with correct image URLs...")
    print("="*70)
    
    # Generate clean content
    print("\nGenerating clean content...")
    new_content = generate_fixed_content()
    
    # Update post
    print("\nUpdating post...")
    result = update_post_content(POST_ID, new_content)
    
    if result:
        print("\n" + "="*70)
        print("SUCCESS - Post updated with correct image URLs")
        print(f"View: https://stocksummarizer.com/bce-bell-canada-stock-analysis-deep-value-or-value-trap/")
        print("\nImage URLs used:")
        for name, url in CHART_URLS.items():
            print(f"  {name}: {url}")
    else:
        print("\nFAILED to update post")
