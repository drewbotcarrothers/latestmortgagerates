"""
Publish BCE WordPress Post
Updates the draft post to published status
"""

import json
import base64
import urllib.request
import urllib.error

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"

POST_ID = 17

def publish_post(post_id):
    """Update post status to publish"""
    
    url = f"{WP_URL}/wp-json/wp/v2/posts/{post_id}"
    
    data = {
        "status": "publish"
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
        print(f"SUCCESS - Post published: {result['link']}")
        return result
    except urllib.error.HTTPError as e:
        print(f"ERROR: {e.code} {e.reason}")
        print(e.read().decode())
        return None

if __name__ == "__main__":
    print("Publishing BCE post...")
    result = publish_post(POST_ID)
    if result:
        print(f"\nLive URL: {result['link']}")
    else:
        print("\nFailed to publish")
