"""
Check which chart files exist locally and re-upload missing ones
"""

import json
import base64
import urllib.request
import urllib.error
import mimetypes
from pathlib import Path

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"
POST_ID = 17

OUTPUT_DIR = Path("C:\\Users\\acarr\\.openclaw\\workspace\\stocksummarizer\\Stock Analysis\\output\\bce_analysis")

def check_wp_media():
    """List uploaded media in WordPress"""
    url = f"{WP_URL}/wp-json/wp/v2/media?per_page=100"
    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{WP_USER}:{WP_APP_PASSWORD}'.encode()).decode()}"
    }
    request = urllib.request.Request(url, headers=headers)
    
    try:
        response = urllib.request.urlopen(request)
        result = json.loads(response.read().decode())
        return [(m['id'], m['source_url'], m['title']['rendered']) for m in result]
    except:
        return []

def upload_media(filepath):
    """Upload image to WordPress"""
    url = f"{WP_URL}/wp-json/wp/v2/media"
    
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
        return result['source_url']
    except urllib.error.HTTPError as e:
        print(f"    Upload error: {e.code}")
        return None

def get_post_content(post_id):
    """Get post content"""
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

def update_post_content(post_id, content):
    """Update post"""
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
    except:
        return None

if __name__ == "__main__":
    print("="*70)
    print("Fixing Missing Charts")
    print("="*70)
    
    # Charts that need to be checked
    charts_to_check = [
        'chart4_valuation_metrics.png',
        'chart5_valuation_scorecard.png',
        'chart6_historical_performance.png',
        'chart7_performance_summary.png'
    ]
    
    # Check which files exist
    print("\nChecking local chart files...")
    missing_local = []
    for chart_file in charts_to_check:
        filepath = OUTPUT_DIR / chart_file
        if filepath.exists():
            print(f"  OK: {chart_file}")
        else:
            print(f"  NOT FOUND: {chart_file}")
            missing_local.append(chart_file)
    
    if missing_local:
        print(f"\n{len(missing_local)} chart(s) missing locally.")
        print("Run the chart generation scripts first:")
        print("  - bce_expanded_valuation.py (for charts 4, 5)")
        print("  - bce_historical_analysis.py (for charts 6, 7)")
    
    # Check WordPress media
    print("\nChecking WordPress media library...")
    media = check_wp_media()
    print(f"  Found {len(media)} media items")
    
    wp_urls = {}
    for chart_file in charts_to_check:
        chart_name = chart_file.replace('.png', '')
        # Look for this file in WordPress
        found = False
        for media_id, media_url, title in media:
            if chart_name in media_url or chart_file in title:
                wp_urls[chart_file] = media_url
                print(f"  Found in WP: {chart_file} -> {media_url}")
                found = True
                break
        if not found:
            print(f"  NOT in WP: {chart_file}")
    
    # Upload missing charts
    print("\nUploading missing charts...")
    new_urls = {}
    for chart_file in charts_to_check:
        filepath = OUTPUT_DIR / chart_file
        if filepath.exists() and chart_file not in wp_urls:
            print(f"  Uploading: {chart_file}")
            url = upload_media(filepath)
            if url:
                new_urls[chart_file] = url
                print(f"    -> {url}")
            else:
                print(f"    FAILED")
    
    # Merge URLs
    all_urls = {**wp_urls, **new_urls}
    
    if not all_urls:
        print("\nNo charts to update.")
        exit(1)
    
    # Update post content with correct URLs
    print("\nUpdating post with correct URLs...")
    content = get_post_content(POST_ID)
    
    if content:
        # Replace URLs
        updated = content
        import re
        
        # Find broken URLs and replace with correct ones
        for chart_file, correct_url in all_urls.items():
            # Simple find/replace for chart filenames
            chart_base = chart_file.replace('.png', '')
            # Look for any URL containing this chart base name
            pattern = r'https://stocksummarizer\.com/wp-content/uploads/[^"]*' + chart_base + r'[^"]*\.png'
            matches = re.findall(pattern, updated)
            for match in matches:
                if match != correct_url:
                    updated = updated.replace(match, correct_url)
                    print(f"  Replaced: {match}")
                    print(f"     With: {correct_url}")
        
        # Save updated content
        result = update_post_content(POST_ID, updated)
        if result:
            print("\n" + "="*70)
            print("SUCCESS - Post updated with correct chart URLs")
            print("="*70)
        else:
            print("\nFailed to update post")
    else:
        print("Could not fetch post content")
