#!/usr/bin/env python3
"""
StockSummarizer WordPress Publisher
Posts analysis results to WordPress via REST API
"""

import json
import base64
import mimetypes
from pathlib import Path
from datetime import datetime
from dataclasses import dataclass

# Configuration
WP_URL = "https://stocksummarizer.com"  # Your WordPress site URL
WP_USER = "DrewBot"                      # WordPress username
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"  # Application password from WordPress

OUTPUT_DIR = Path(__file__).parent.parent / "output"

def create_wordpress_post(title: str, content: str, featured_image_id: int = None) -> dict:
    """Create a new WordPress post via REST API"""
    import urllib.request
    import urllib.error
    
    url = f"{WP_URL}/wp-json/wp/v2/posts"
    
    data = {
        "title": title,
        "content": content,
        "status": "draft",  # Change to "publish" when ready
        "categories": [],    # Add category IDs if desired
        "tags": []         # Add tag IDs if desired
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
        print(f"Created post: {result['link']}")
        return result
    except urllib.error.HTTPError as e:
        print(f"Error creating post: {e.code} {e.reason}")
        print(e.read().decode())
        return None

def upload_media_to_wordpress(filepath: Path) -> int:
    """Upload an image to WordPress media library"""
    import urllib.request
    import urllib.error
    
    url = f"{WP_URL}/wp-json/wp/v2/media"
    
    mime_type, _ = mimetypes.guess_type(filepath)
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
        print(f"Uploaded media: {result['source_url']}")
        return result['id']
    except urllib.error.HTTPError as e:
        print(f"Error uploading media: {e.code} {e.reason}")
        print(e.read().decode())
        return None

def generate_post_content(summary: dict, chart_files: list) -> str:
    """Generate HTML content for WordPress post"""
    date_str = datetime.now().strftime("%B %d, %Y")
    
    content = f"""<h2>TSX Stock Analysis - {date_str}</h2>
    
<p>Fundamental analysis of {summary['total_stocks']} Canadian stocks from the TSX.</p>

<h3>Top Performers</h3>

<table>
<thead>
<tr><th>Rank</th><th>Ticker</th><th>Score</th></tr>
</thead>
<tbody>
"""
    
    for i, stock in enumerate(summary.get('top_stocks', [])[:10], 1):
        content += f"<tr><td>{i}</td><td>{stock['Ticker']}</td><td>{stock['Score']}</td></tr>\n"
    
    content += """</tbody>
</table>

<h3>Methodology</h3>
<p>Stocks are scored based on fundamental metrics including P/E ratio, dividend yield, and financial health indicators. Data sourced from TradingView screener.</p>

<p><em>Disclaimer: This analysis is for informational purposes only and does not constitute investment advice.</em></p>
"""
    
    return content

def check_credentials():
    """Verify WordPress credentials are configured"""
    if WP_URL == "https://your-domain.com":
        print("⚠️  ERROR: WordPress credentials not configured!")
        print("\nPlease update the following in post_to_wordpress.py:")
        print(f"  WP_URL = 'https://your-domain.com'")
        print(f"  WP_USER = 'your_username'")
        print(f"  WP_APP_PASSWORD = 'your_app_password'")
        print("\nTo get an app password:")
        print("1. Log into WordPress admin")
        print("2. Go to Users → Profile → Application Passwords")
        print("3. Create a new application password")
        return False
    return True

if __name__ == "__main__":
    print("StockSummarizer WordPress Publisher")
    print("=" * 40)
    
    if not check_credentials():
        exit(1)
    
    # Look for summary file
    summary_files = list(OUTPUT_DIR.glob("summary_*.json"))
    if not summary_files:
        print("\nNo summary file found.")
        print("Run process_data.py and generate_charts.py first.")
        exit(1)
    
    latest_summary = max(summary_files, key=lambda p: p.stat().st_mtime)
    print(f"\nLoading summary: {latest_summary.name}")
    
    with open(latest_summary) as f:
        summary = json.load(f)
    
    # Find chart images
    chart_files = list(OUTPUT_DIR.glob("*.png"))
    print(f"Found {len(chart_files)} chart(s)")
    
    # Generate post content
    print("\nGenerating post content...")
    content = generate_post_content(summary, chart_files)
    
    # Upload featured image (first chart)
    featured_image_id = None
    if chart_files:
        print("\nUploading featured image...")
        featured_image_id = upload_media_to_wordpress(chart_files[0])
    
    # Create WordPress post
    print("\nCreating WordPress post...")
    timestamp = datetime.now().strftime("%Y-%m-%d")
    post = create_wordpress_post(
        title=f"TSX Stock Analysis - {timestamp}",
        content=content,
        featured_image_id=featured_image_id
    )
    
    if post:
        print("\n✅ Success!")
        print(f"View post: {post['link']}")
    else:
        print("\n❌ Failed to create post")
