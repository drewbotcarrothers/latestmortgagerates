"""
BCE WordPress Post Publisher
Creates a WordPress post for the BCE stock analysis
"""

import json
import base64
import mimetypes
from pathlib import Path
from datetime import datetime
import urllib.request
import urllib.error

# WordPress Configuration
WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"

OUTPUT_DIR = Path("C:\\Users\\acarr\\.openclaw\\workspace\\stocksummarizer\\Stock Analysis\\output\\bce_analysis")

def create_wordpress_post(title: str, content: str, featured_image_id: int = None, status: str = "draft") -> dict:
    """Create a new WordPress post via REST API"""
    
    url = f"{WP_URL}/wp-json/wp/v2/posts"
    
    data = {
        "title": title,
        "content": content,
        "status": status,
        "categories": [],
        "tags": ["BCE", "Bell Canada", "TSX", "Dividend Investing"]
    }
    
    if featured_image_id:
        data["featured_media"] = featured_image_id
    
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
        print(f"✅ Created post: {result['link']}")
        return result
    except urllib.error.HTTPError as e:
        print(f"❌ Error creating post: {e.code} {e.reason}")
        print(e.read().decode())
        return None

def upload_media_to_wordpress(filepath: Path) -> int:
    """Upload an image to WordPress media library"""
    
    url = f"{WP_URL}/wp-json/wp/v2/media"
    
    mime_type, _ = mimetypes.guess_type(str(filepath))
    if not mime_type:
        mime_type = "image/png"
    
    boundary = "----WordPressUploadBoundary"
    
    # Build multipart form data
    with open(filepath, 'rb') as f:
        file_content = f.read()
    
    body = []
    body.append(f'------{boundary}'.encode())
    body.append(f'Content-Disposition: form-data; name="file"; filename="{filepath.name}"'.encode())
    body.append(f'Content-Type: {mime_type}'.encode())
    body.append(b'')
    body.append(file_content)
    body.append(f'------{boundary}--'.encode())
    
    body = b'\r\n'.join(body)
    
    headers = {
        "Content-Type": f"multipart/form-data; boundary=----{boundary}",
        "Authorization": f"Basic {base64.b64encode(f'{WP_USER}:{WP_APP_PASSWORD}'.encode()).decode()}",
        "Content-Length": str(len(body))
    }
    
    request = urllib.request.Request(url, data=body, headers=headers, method="POST")
    
    try:
        response = urllib.request.urlopen(request)
        result = json.loads(response.read().decode())
        print(f"✅ Uploaded media: {filepath.name} (ID: {result['id']})")
        return result['id']
    except urllib.error.HTTPError as e:
        print(f"❌ Error uploading media: {e.code} {e.reason}")
        print(e.read().decode())
        return None

def generate_bce_content(chart_urls: dict) -> str:
    """Generate WordPress HTML content for BCE post"""
    
    date_str = datetime.now().strftime("%B %d, %Y")
    
    content = f"""<h2>BCE (Bell Canada) Stock Analysis - {date_str}</h2>

<p><strong>BCE Inc.</strong> (TSX: BCE), better known as Bell Canada, is currently trading at a valuation that suggests the market views it as distressed. At just <strong>5.3x P/E</strong>, this is not a typical value stock price—it's a distress price. For a company that dominates Canadian communications infrastructure, something doesn't add up.</p>

<hr />

<h3>🏢 Company Overview</h3>

<ul>
<li><strong>Founded:</strong> 1880 (145+ years of operation)</li>
<li><strong>Market Cap:</strong> $32.8 billion (Canada's largest telecom)</li>
<li><strong>Current Price:</strong> $35.30</li>
<li><strong>Sector:</strong> Communications / Telecommunications</li>
<li><strong>Subscribers:</strong> 10M+ wireless, 4M+ internet customers</li>
<li><strong>Network Coverage:</strong> 99% of Canadian population</li>
</ul>

<p>Bell operates four business segments: Wireless (60% EBITDA margins, duopoly with Rogers), Wireline (fiber internet), Media (CTV, Crave), and Business Solutions (enterprise services). This is essential infrastructure—not a speculative growth play.</p>

<hr />

<h3>📊 The Valuation Anomaly</h3>

<p>BCE currently trades at just <strong>5.3x P/E</strong>, compared to the telecommunications sector average of <strong>11.2x</strong>. This represents a <strong>52% discount</strong> to its peers.</p>

<h4>P/E Ratio Comparison:</h4>
<ul>
<li>BCE: <strong>5.3x</strong></li>
<li>Rogers (RCI.B): ~11x</li>
<li>Telus (T): ~18x</li>
<li>Sector Average: 11.2x</li>
</ul>

<p>In the last 20 years, Bell has rarely traded below 8x P/E. At 5.3x, this is historically cheap. Either this is the buying opportunity of a decade, or the market is telling us something important.</p>

{chart_urls.get('chart1', '')}

<hr />

<h3>💰 Dividend Analysis</h3>

<p>BCE currently yields <strong>4.97%</strong>, paying approximately <strong>$1.75 per share annually</strong> in dividends. The company has maintained dividend payments for <strong>20 consecutive years</strong>.</p>

<h4>Dividend Yield Comparison:</h4>
<ul>
<li><strong>BCE Yield: 4.97%</strong></li>
<li>Typical GIC Rate: ~3.0%</li>
<li>Yield Advantage: +66%</li>
</ul>

<p>At current prices, a $10,000 investment would generate approximately $497 in annual dividend income—$197 more than a typical GIC.</p>

{chart_urls.get('chart2', '')}

<hr />

<h3>📈 The Bull Case</h3>

<ol>
<li><strong>Extreme Valuation:</strong> 5.3x P/E prices in disaster. Bell's business is remarkably resilient—people don't cancel cell phones during recessions.</li>
<li><strong>Rate Cuts Tailwind:</strong> With the Bank of Canada cutting rates, Bell's significant debt becomes cheaper to service, improving cash flow.</li>
<li><strong>Competitive Moat:</strong> Duopoly with Rogers in wireless. Regulatory barriers protect returns.</li>
<li><strong>Mean Reversion:</strong> Extreme valuations rarely last forever.</li>
</ol>

<hr />

<h3>⚠️ The Bear Case</h3>

<ol>
<li><strong>Dividend Sustainability:</strong> 90%+ payout ratio leaves little cushion. Any business decline could pressure the dividend.</li>
<li><strong>Debt Load:</strong> Significant debt to refinance in a higher-rate environment (though rates are now falling).</li>
<li><strong>Cord-Cutting:</strong> Traditional TV business shrinking as consumers move to streaming.</li>
<li><strong>Wireless Competition:</strong> Rogers-Shaw merger could intensify pricing pressure.</li>
</ol>

{chart_urls.get('chart3', '')}

<hr />

<h3>🎯 Valuation Math</h3>

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

<h3>🔑 Key Metrics Summary</h3>

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

<h3>🎯 Investment Verdict</h3>

<p><strong>BCE is not a stock that's going to 10x your money.</strong> But it's also unlikely to stay at 5x P/E forever.</p>

<p><strong>For Income Investors:</strong> The 5% dividend yield with potential 50%+ capital appreciation if sentiment shifts makes it worth considering.</p>

<p><strong>For Growth Investors:</strong> Probably too boring. Look elsewhere.</p>

<p><strong>For Value Hunters:</strong> This is the kind of asymmetric setup that builds wealth over time.</p>

<p><strong>Bottom Line:</strong> A coiled spring disguised as a value trap. At 5x P/E with a market-leading position in essential infrastructure, the odds favor the patient investor.</p>

<hr />

<h3>📋 Disclosure</h3>

<p><em>This analysis is for informational and educational purposes only. It does not constitute investment advice. Always conduct your own research and consult with a qualified financial advisor before making investment decisions. Data sourced from TradingView and company filings. Analysis date: {date_str}.</em></p>

<hr />

<p><strong>Related:</strong> <a href="#">TSX Dividend Aristocrats Analysis</a> | <a href="#">Canadian Telecom Sector Overview</a> | <a href="#">BCE vs Telus Comparison</a></p>
"""
    
    return content

def main():
    print("="*80)
    print("BCE WordPress Post Publisher")
    print("="*80)
    
    # Find chart files
    chart_files = {
        'chart1': OUTPUT_DIR / "chart1_pe_comparison.png",
        'chart2': OUTPUT_DIR / "chart2_dividend_yield.png",
        'chart3': OUTPUT_DIR / "chart3_dashboard.png"
    }
    
    # Upload images
    print("\n[ Uploading images to WordPress... ]")
    media_ids = {}
    chart_urls = {}
    
    for key, filepath in chart_files.items():
        if filepath.exists():
            media_id = upload_media_to_wordpress(filepath)
            if media_id:
                media_ids[key] = media_id
                # Build the image HTML
                chart_urls[key] = f'<p><img src="{WP_URL}/wp-content/uploads/{filepath.name}" alt="BCE {key} Analysis" /></p>'
        else:
            print(f"⚠️  Chart not found: {filepath}")
    
    # Generate content
    print("\n📝 Generating post content...")
    content = generate_bce_content(chart_urls)
    
    # Create post
    print("\n📄 Creating WordPress post...")
    title = "BCE (Bell Canada) Stock Analysis: Deep Value or Value Trap?"
    
    featured_id = media_ids.get('chart1')  # Use PE chart as featured image
    
    post = create_wordpress_post(
        title=title,
        content=content,
        featured_image_id=featured_id,
        status="draft"  # Set to "publish" when ready
    )
    
    if post:
        print("\n" + "="*80)
        print("✅ SUCCESS!")
        print(f"📎 Post URL: {post['link']}")
        print(f"✏️  Edit URL: {post['link'].replace('//', '//')}/wp-admin/post.php?post={post['id']}&action=edit")
        print("="*80)
    else:
        print("\n❌ Failed to create post")

if __name__ == "__main__":
    main()
