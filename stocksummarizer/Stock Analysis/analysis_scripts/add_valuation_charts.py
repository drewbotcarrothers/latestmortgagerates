"""
Add expanded valuation charts to BCE WordPress post
"""

import json
import base64
import urllib.request
import urllib.error
from pathlib import Path

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"

OUTPUT_DIR = Path("C:\\Users\\acarr\\.openclaw\\workspace\\stocksummarizer\\Stock Analysis\\output\\bce_analysis")

def upload_media(filepath):
    """Upload image to WordPress"""
    url = f"{WP_URL}/wp-json/wp/v2/media"
    
    import mimetypes
    mime_type, _ = mimetypes.guess_type(str(filepath))
    if not mime_type:
        mime_type = "image/png"
    
    boundary = "----WordPressUploadBoundary"
    
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
        print(f"  Uploaded: {filepath.name} (ID: {result['id']})")
        return result['source_url']
    except urllib.error.HTTPError as e:
        print(f"  Error: {e.code} {e.reason}")
        return None

def get_post_content(post_id):
    """Get current post content"""
    url = f"{WP_URL}/wp-json/wp/v2/posts/{post_id}"
    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{WP_USER}:{WP_APP_PASSWORD}'.encode()).decode()}"
    }
    request = urllib.request.Request(url, headers=headers)
    
    try:
        response = urllib.request.urlopen(request)
        result = json.loads(response.read().decode())
        return result['content']['rendered']
    except:
        return None

def update_post(post_id, content):
    """Update post content"""
    url = f"{WP_URL}/wp-json/wp/v2/posts/{post_id}"
    
    data = {"content": content}
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic {base64.b64encode(f'{WP_USER}:{WP_APP_PASSWORD}'.encode()).decode()}"
    }
    
    request = urllib.request.Request(
        url, data=json.dumps(data).encode(), headers=headers, method="POST"
    )
    
    try:
        response = urllib.request.urlopen(request)
        result = json.loads(response.read().decode())
        return result
    except urllib.error.HTTPError as e:
        print(f"Error: {e.code} {e.reason}")
        return None

if __name__ == "__main__":
    print("="*70)
    print("Adding Expanded Valuation Charts to BCE Post")
    print("="*70)
    
    # Find new charts
    chart_files = [
        OUTPUT_DIR / "chart4_valuation_metrics.png",
        OUTPUT_DIR / "chart5_valuation_scorecard.png"
    ]
    
    # Upload new charts
    print("\nUploading new charts...")
    chart_urls = {}
    for chart_file in chart_files:
        if chart_file.exists():
            url = upload_media(chart_file)
            if url:
                chart_urls[chart_file.stem] = url
        else:
            print(f"  Not found: {chart_file}")
    
    if not chart_urls:
        print("\nNo charts uploaded. Exiting.")
        exit(1)
    
    # Get current post content
    print("\nFetching current post...")
    POST_ID = 17
    current_content = get_post_content(POST_ID)
    
    if not current_content:
        print("Could not fetch post")
        exit(1)
    
    # Find the right place to insert (after "The Valuation Anomaly" section)
    insertion_point = current_content.find("<hr />")
    if insertion_point == -1:
        insertion_point = current_content.find("<h3>The Valuation Anomaly</h3>")
        if insertion_point != -1:
            # Find the end of this section
            next_hr = current_content.find("<hr />", insertion_point)
            if next_hr != -1:
                insertion_point = next_hr + 6  # After <hr />
    
    if insertion_point == -1:
        insertion_point = len(current_content) - 50  # Near the end
    
    # Create new content to insert
    new_section = f"""

<h3>Expanded Valuation Analysis</h3>

<p>Beyond P/E ratio, let's look at multiple valuation metrics to get a complete picture:</p>

<p><img src="{chart_urls.get('chart4_valuation_metrics', '')}" alt="BCE Comprehensive Valuation Metrics" /></p>

<h4>Key Valuation Highlights:</h4>
<ul>
<li><strong>P/E Ratio:</strong> 5.32x (53% below sector avg of 11.23x)</li>
<li><strong>P/B Ratio:</strong> 1.72x (47% below sector)</li>
<li><strong>Dividend Yield:</strong> 4.97% (competitive with sector)</li>
<li><strong>ROE:</strong> Strong return on equity vs peers</li>
</ul>

<p>The valuation discount isn't limited to P/E—it's across multiple metrics.</p>

<p><img src="{chart_urls.get('chart5_valuation_scorecard', '')}" alt="BCE Valuation Scorecard and Fair Value" /></p>

<h4>Fair Value Estimates by P/E Multiple:</h4>
<ul>
<li><strong>Conservative (8x P/E):</strong> $53.12 (+50% upside)</li>
<li><strong>Fair Value (10x P/E):</strong> $66.40 (+88% upside)</li>
<li><strong>Historical Average (12x):</strong> $79.68 (+126% upside)</li>
<li><strong>Optimistic (15x P/E):</strong> $99.60 (+182% upside)</li>
</ul>

<p><strong>Key Insight:</strong> Even at a conservative 8x P/E—well below historical norms—BCE offers 50% upside. At fair value (10x P/E), that's nearly 90% upside. The current 5.3x P/E suggests the market is pricing in severe impairment that may not materialize.</p>

<hr />

"""
    
    # Insert the new section
    updated_content = current_content[:insertion_point] + new_section + current_content[insertion_point:]
    
    # Update the post
    print("\nUpdating post...")
    result = update_post(POST_ID, updated_content)
    
    if result:
        print("\n" + "="*70)
        print("✅ SUCCESS - Post updated with expanded valuation analysis")
        print(f"View: https://stocksummarizer.com/bce-bell-canada-stock-analysis-deep-value-or-value-trap/")
        print("="*70)
    else:
        print("\n❌ Failed to update post")
