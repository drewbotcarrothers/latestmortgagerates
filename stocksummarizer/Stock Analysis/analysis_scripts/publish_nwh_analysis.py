"""
NWH.UN Analysis Post Creator for WordPress
Creates a comprehensive analysis post for NorthWest Healthcare Properties REIT
"""

import json
import base64
import urllib.request
from pathlib import Path

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"

def create_post(title, content, excerpt, tags, categories):
    url = f"{WP_URL}/wp-json/wp/v2/posts"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic {base64.b64encode(f'{WP_USER}:{WP_APP_PASSWORD}'.encode()).decode()}"
    }
    
    data = {
        "title": title,
        "content": content,
        "excerpt": excerpt,
        "status": "publish",
        "tags": tags,
        "categories": categories
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
        print(f"Error creating post: {e}")
        return None

# Load chart URLs if available
chart_urls = {}
url_file = Path(__file__).parent / 'nwh_chart_urls.json'
if url_file.exists():
    with open(url_file) as f:
        chart_urls = json.load(f)

print("="*70)
print("Creating NWH.UN WordPress Post")
print("="*70)

post_content = """<!-- wp:paragraph -->
<p><strong>NorthWest Healthcare Properties REIT (NWH.UN)</strong> is currently trading at a significant discount to its book value, offering a contrarian opportunity for income-focused investors willing to accept turnaround risk. With a <strong>6.44% dividend yield</strong> and shares priced at just $5.72 (12% below NAV), this healthcare real estate play merits a closer look.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>📊 Key Metrics at a Glance</h2>
<!-- /wp:heading -->

<!-- wp:image {"align":"center"} -->
<figure class="wp-block-image aligncenter"><img src="{chart3}" alt="NWH.UN Dashboard - Key Metrics"><figcaption>NWH.UN Key Investment Metrics Dashboard</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>At $5.72 per share, NWH.UN trades at a <strong>0.88x price-to-book ratio</strong>—meaning you're paying 88 cents for every dollar of assets. This below-book valuation suggests the market has discounted the stock due to operational challenges.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>💰 Valuation Analysis: Why The Discount?</h2>
<!-- /wp:heading -->

<!-- wp:image {"align":"center"} -->
<figure class="wp-block-image aligncenter"><img src="{chart4}" alt="NWH.UN Book Value Analysis"><figcaption>NWH.UN Trading Below Book Value Analysis</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>The stock's book value stands at <strong>$6.49 per share</strong>, yet it trades at $5.72—representing a 12% discount to NAV. For REITs, which own tangible real estate assets, trading below book is relatively rare and typically signals market concerns.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>📈 Valuation Scenarios: What Could NWH Be Worth?</h2>
<!-- /wp:heading -->

<!-- wp:image {"align":"center"} -->
<figure class="wp-block-image aligncenter"><img src="{chart5}" alt="NWH.UN Valuation Scorecard"><figcaption>NWH.UN Fair Value Estimates and Scenarios</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p><strong>Fair Value Scenarios:</strong></p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li><strong>At Book Value (1.0x P/B):</strong> $6.49/share (+13% upside)</li>
<li><strong>Premium Valuation (1.1x P/B):</strong> $7.14/share (+25% upside)</li>
<li><strong>Recovery Scenario (1.2x P/B):</strong> $7.79/share (+36% upside)</li>
</ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>The key question: can management execute a turnaround and restore investor confidence?</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>💵 Dividend Income: High Yield, But At What Cost?</h2>
<!-- /wp:heading -->

<!-- wp:image {"align":"center"} -->
<figure class="wp-block-image aligncenter"><img src="{chart2}" alt="NWH.UN Dividend Yield Analysis"><figcaption>NWH.UN Dividend Yield vs Alternatives</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>The <strong>6.44% dividend yield</strong> is attractive compared to alternatives, but there's a catch: the payout ratio sits at <strong>180%</strong>. This means the company is paying out more in dividends than it earns—a red flag that suggests the dividend may not be sustainable without operational improvements.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>⚠️ Dividend Sustainability Concerns</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>While the 6.44% yield looks compelling on paper, the 180% payout ratio indicates the dividend currently exceeds earnings. This could lead to:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li>Future dividend cuts if performance doesn't improve</li>
<li>Reliance on debt or asset sales to fund distributions</li>
<li>Pressure on cash flows for debt servicing</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>🏥 Business Fundamentals: Healthcare Real Estate Portfolio</h2>
<!-- /wp:heading -->

<!-- wp:image {"align":"center"} -->
<figure class="wp-block-image aligncenter"><img src="{chart6}" alt="NWH.UN Business Analysis"><figcaption>NWH.UN Financial Health and Business Analysis</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>NWH.UN operates in the defensive healthcare real estate sector with properties including:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li><strong>Hospitals and medical centers (35%)</strong></li>
<li><strong>Medical office buildings (25%)</strong></li>
<li><strong>Senior living facilities (25%)</strong></li>
<li><strong>Other healthcare properties (15%)</strong></li>
</ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p><strong>The Good:</strong> Gross margins of 74.4% and operating margins of 55.9% suggest the underlying business model is sound.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>The Concerning:</strong> Revenue has declined 13.3% year-over-year, and ROE sits at just 3.0%—well below acceptable thresholds for real estate investments.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>💼 Financial Health: Leverage Concerns</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>With a <strong>debt-to-equity ratio of 1.79x</strong>, NWH.UN carries significant leverage—typical for REITs but something to monitor in a rising rate environment. This elevated debt level amplifies both upside potential and downside risk.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>📊 P/E Comparison vs REIT Peers</h2>
<!-- /wp:heading -->

<!-- wp:image {"align":"center"} -->
<figure class="wp-block-image aligncenter"><img src="{chart1}" alt="NWH.UN P/E Comparison"><figcaption>NWH.UN P/E Comparison vs REIT Sector</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>At <strong>28.77x earnings</strong>, NWH.UN trades at a premium to the REIT sector average of approximately 22.5x. This elevated P/E despite the below-book valuation indicates the market has factored in expected earnings compression—or sees recovery potential.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>🎯 Investment Thesis: Risk vs Reward</h2>
<!-- /wp:heading -->

<!-- wp:image {"align":"center"} -->
<figure class="wp-block-image aligncenter"><img src="{chart7}" alt="NWH.UN Investment Thesis"><figcaption>NWH.UN Investment Thesis and Risk Assessment</figcaption></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":3} -->
<h3>✅ Bull Case</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
<li>Trading 12% below book value creates a margin of safety</li>
<li>Attractive 6.44% yield while turnaround plays out</li>
<li>Healthcare real estate is a defensive, growing sector</li>
<li>Potential for valuation multiple expansion as operations improve</li>
<li>$1.4B market cap provides liquidity and scale</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading {"level":3} -->
<h3>⚠️ Bear Case</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
<li>Revenue declining -13.3% indicates operational challenges</li>
<li>180% payout ratio threatens dividend sustainability</li>
<li>28.77x P/E is expensive relative to growth trajectory</li>
<li>ROE of 3.0% signals inefficient capital deployment</li>
<li>High debt load (1.79x) limits financial flexibility</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>🎓 Bottom Line: Who Should Consider NWH.UN?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><strong>NWH.UN suits:</strong></p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li>Contrarian investors seeking value in out-of-favor sectors</li>
<li>Income-focused portfolios that can tolerate dividend risk</li>
<li>REIT investors comfortable with turnaround stories</li>
<li>Those who believe healthcare real estate will outperform</li>
</ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p><strong>Avoid if:</strong></p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li>You need reliable, sustainable dividend income</li>
<li>You prefer established, growing businesses</li>
<li>Higher volatility concerns you</li>
<li>You want defensive characteristics without the turnaround risk</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>📋 Final Verdict</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><strong>Rating: HOLD / SPECULATIVE BUY</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>NWH.UN represents a classic value trap or turnaround opportunity—it depends on execution. The 12% discount to book and 6.44% yield provide compensation for risk, but the declining revenue and stretched payout ratio warrant caution. This is a position-size-accordingly stock for investors with higher risk tolerance seeking income.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><em>As of February 27, 2026. Stock price: $5.72 CAD. Market Cap: $1.4B.</em></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>Disclosure:</strong> This analysis is for educational purposes only and does not constitute investment advice. Always conduct your own due diligence before making investment decisions.</p>
<!-- /wp:paragraph -->""".format(
    chart1=chart_urls.get('chart1_pe_comparison', ''),
    chart2=chart_urls.get('chart2_dividend_yield', ''),
    chart3=chart_urls.get('chart3_dashboard', ''),
    chart4=chart_urls.get('chart4_valuation_analysis', ''),
    chart5=chart_urls.get('chart5_valuation_scorecard', ''),
    chart6=chart_urls.get('chart6_business_analysis', ''),
    chart7=chart_urls.get('chart7_investment_thesis', '')
)

# Try to publish
result = create_post(
    title="NWH.UN Analysis: Trading Below Book Value with 6.44% Yield",
    content=post_content,
    excerpt="NorthWest Healthcare Properties REIT (NWH.UN) trades 12% below book value at $5.72 with a 6.44% dividend yield. Full analysis of this contrarian REIT opportunity including valuation scenarios, dividend sustainability concerns, and risk assessment.",
    tags=["NWH.UN", "NorthWest Healthcare", "REIT", "Dividend Stocks", "Healthcare Real Estate", "Canadian Stocks", "Value Investing", "Income Investing"],
    categories=[2]  # Assuming category 2 is for stock analysis
)

if result:
    print(f"✅ Post created successfully!")
    print(f"   Post ID: {result['id']}")
    print(f"   URL: {result['link']}")
else:
    print("❌ Failed to create post")

print("="*70)
