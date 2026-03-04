"""
Debug BCE Post Images
Check what's actually in the post and verify images
"""

import json
import base64
import urllib.request
import urllib.error

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
        return result['content']['rendered'], result.get('content', {}).get('raw', '')
    except urllib.error.HTTPError as e:
        print(f"Error: {e.code} {e.reason}")
        return None, None

def check_image_url(url):
    """Check if image URL is accessible"""
    try:
        request = urllib.request.Request(url, method='HEAD')
        response = urllib.request.urlopen(request)
        return response.status == 200
    except Exception as e:
        return False, str(e)

if __name__ == "__main__":
    print("Debugging BCE post images...")
    print("="*70)
    
    # Get post content
    print("\nFetching post content...")
    rendered, raw = get_post_content(POST_ID)
    
    if not rendered:
        print("ERROR: Could not fetch post")
        exit(1)
    
    # Find image URLs in content
    import re
    img_urls = re.findall(r'src="([^"]+\.(?:png|jpg|jpeg|gif))"', rendered)
    
    print(f"\nFound {len(img_urls)} image(s) in post:")
    for i, url in enumerate(img_urls, 1):
        print(f"\n{i}. {url}")
        
        # Check if accessible
        try:
            check = check_image_url(url)
            if check == True:
                print("   Status: ACCESSIBLE")
            else:
                print(f"   Status: ERROR - {check[1] if isinstance(check, tuple) else 'Not accessible'}")
        except Exception as e:
            print(f"   Status: ERROR checking - {e}")
    
    print("\n" + "="*70)
    print("\nRaw Content Preview (first 500 chars):")
    if raw:
        print(raw[:500])
    else:
        print("No raw content available")
    
    print("\n" + "="*70)
    print("\nRecommendations:")
    print("1. If URLs are wrong, we need to rebuild the content")
    print("2. If images are 404, they may not have uploaded correctly")
    print("3. If no images found, we need to reinsert them")
