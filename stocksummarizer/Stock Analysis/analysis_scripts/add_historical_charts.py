"""
Add historical performance charts to BCE WordPress post
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
    print("Adding Historical Performance Charts to BCE Post")
    print("="*70)
    
    # Find new charts
    chart_files = [
        OUTPUT_DIR / "chart6_historical_performance.png",
        OUTPUT_DIR / "chart7_performance_summary.png"
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
    
    # Find insertion point (after "The Bear Case" section, before "Valuation Math")
    insertion_point = current_content.find("<h3>The Bear Case</h3>")
    if insertion_point != -1:
        # Find the </ol> after The Bear Case
        end_ol = current_content.find("</ol>", insertion_point)
        if end_ol != -1:
            insertion_point = end_ol + 5
    else:
        # Fallback to before Valuation Math
        insertion_point = current_content.find("<h3>Valuation Math</h3>")
    
    if insertion_point == -1:
        insertion_point = len(current_content) - 50
    
    # Create new content to insert
    new_section = f"""

<hr />

<h3>Historical Performance & Multiple Compression</h3>

<p>Understanding <em>why</em> BCE is cheap requires looking at recent price action. The chart below shows BCE's price trajectory and the dramatic <strong>valuation gap</strong> that has opened up:</p>

<p><img src="{chart_urls.get('chart6_historical_performance', '')}" alt="BCE Historical Performance" /></p>

<h4>Key Historical Insights:</h4>

<ul>
<li><strong>Multiple Compression, Not Earnings Collapse:</strong> BCE's stock has fallen because investors are paying less per dollar of earnings (P/E compression), not because earnings have collapsed.</li>

<li><strong>Historical Context:</strong> Over the past 20 years, BCE has rarely traded below 8x P/E. The current 5.3x multiple represents one of the deepest discounts in recent history.</li>

<li><strong>The Opportunity:</strong> If BCE simply returns to a 10x P/E (still below historical average), the stock would trade at ~$66—an 88% gain from current prices.</li>

<li><strong>Same Business, Lower Price:</strong> BCE's core business (wireless, fiber, media) remains strong. The discount is in the multiple, not the fundamentals.</li>
</ul>

<p><img src="{chart_urls.get('chart7_performance_summary', '')}" alt="BCE Performance Summary" /></p>

<h4>What Multiple Expansion Means:</h4>

<p>The concept is simple: If BCE generates roughly $6.64 in earnings per share:</p>

<ul>
<li>At <strong>5.3x P/E</strong> (current): Stock = $35</li>
<li>At <strong>8x P/E</strong> (conservative): Stock = $53 (+50%)</li>
<li>At <strong>10x P/E</strong> (fair value): Stock = $66 (+88%)</li>
<li>At <strong>12x P/E</strong> (historical avg): Stock = $80 (+126%)</li>
</ul>

<p><strong>The bet:</strong> Will BCE trade at 5x P/E forever? If not, there's significant upside as the multiple normalizes—even if earnings stay flat.</p>

<p><strong>Risk:</strong> If the market is right about structural problems (debt, competition, dividend risk), the multiple could stay compressed. The burden of proof is on the bears to show why this time is different.</p>

"""
    
    # Insert the new section
    updated_content = current_content[:insertion_point] + new_section + current_content[insertion_point:]
    
    # Update the post
    print("\nUpdating post...")
    result = update_post(POST_ID, updated_content)
    
    if result:
        print("\n" + "="*70)
        print("SUCCESS - Post updated with historical performance analysis")
        print(f"View: https://stocksummarizer.com/bce-bell-canada-stock-analysis-deep-value-or-value-trap/")
        print("="*70)
    else:
        print("\nFAILED to update post")
