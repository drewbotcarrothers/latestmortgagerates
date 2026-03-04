"""
Check which chart URLs are working in the BCE WordPress post
"""

import json
import base64
import urllib.request

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"
POST_ID = 17

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

def check_url(url):
    """Check if URL is accessible"""
    try:
        request = urllib.request.Request(url, method='HEAD')
        response = urllib.request.urlopen(request, timeout=10)
        return True, response.status
    except Exception as e:
        return False, str(e)

# Get post content
print("Fetching BCE post content...")
content = get_post_content(POST_ID)

if not content:
    print("Could not fetch post")
    exit(1)

# Find all image URLs
import re
img_urls = re.findall(r'src="([^"]+\.png)"', content)

print(f"\nFound {len(img_urls)} image(s) in post:\n")
print("="*80)

for i, url in enumerate(img_urls, 1):
    print(f"\n{i}. {url}")
    
    # Check if accessible
    success, status = check_url(url)
    if success:
        print(f"   Status: OK")
    else:
        print(f"   Status: ERROR - {status}")

print("\n" + "="*80)

# List unique chart files
print("\nUnique chart files found:")
seen = set()
for url in img_urls:
    filename = url.split('/')[-1]
    if filename not in seen:
        seen.add(filename)
        print(f"  - {filename}")

print(f"\nView post: https://stocksummarizer.com/?p={POST_ID}")
