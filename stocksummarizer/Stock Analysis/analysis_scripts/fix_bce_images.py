"""
Fix BCE Post Image URLs
Updates the post with correct WordPress media URLs
"""

import json
import base64
import urllib.request
import urllib.error

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"

POST_ID = 17
MEDIA_IDS = [14, 15, 16]  # chart1, chart2, chart3

def get_media_url(media_id):
    """Get the actual URL of uploaded media"""
    url = f"{WP_URL}/wp-json/wp/v2/media/{media_id}"
    
    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{WP_USER}:{WP_APP_PASSWORD}'.encode()).decode()}"
    }
    
    request = urllib.request.Request(url, headers=headers)
    
    try:
        response = urllib.request.urlopen(request)
        result = json.loads(response.read().decode())
        return result['source_url']
    except urllib.error.HTTPError as e:
        print(f"Error getting media {media_id}: {e.code}")
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
    except urllib.error.HTTPError as e:
        print(f"Error getting post: {e.code}")
        return None

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
        print(f"SUCCESS - Post updated")
        return result
    except urllib.error.HTTPError as e:
        print(f"ERROR: {e.code} {e.reason}")
        print(e.read().decode())
        return None

if __name__ == "__main__":
    print("Fixing BCE post image URLs...")
    print("="*60)
    
    # Get actual media URLs
    print("\nFetching media URLs...")
    media_urls = {}
    for i, media_id in enumerate(MEDIA_IDS, 1):
        url = get_media_url(media_id)
        if url:
            media_urls[f'chart{i}'] = url
            print(f"Chart {i} (ID {media_id}): {url}")
    
    if not media_urls:
        print("ERROR: Could not fetch media URLs")
        exit(1)
    
    # Get current post content
    print("\nFetching current post content...")
    current_content = get_post_content(POST_ID)
    if not current_content:
        print("ERROR: Could not fetch post")
        exit(1)
    
    # Replace placeholder URLs with actual WordPress URLs
    print("\nUpdating image URLs...")
    new_content = current_content
    
    # Replace the constructed URLs with actual WordPress URLs
    for key, url in media_urls.items():
        # Handle different URL patterns
        old_pattern = f'/wp-content/uploads/chart{key[-1]}'
        if old_pattern in new_content:
            new_content = new_content.replace(f'src="{WP_URL}{old_pattern}', f'src="{url}')
            print(f"Updated {key} URL")
    
    # Update the post
    print("\nUpdating post...")
    result = update_post_content(POST_ID, new_content)
    
    if result:
        print("\n" + "="*60)
        print("SUCCESS - Post updated with correct image URLs")
        print(f"View at: {WP_URL}/bce-bell-canada-stock-analysis-deep-value-or-value-trap/")
    else:
        print("\nFAILED to update post")
