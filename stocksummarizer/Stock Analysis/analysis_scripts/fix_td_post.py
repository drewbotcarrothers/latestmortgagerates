"""
Update TD post to remove BCE references
"""

import json
import base64
import urllib.request

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"
POST_ID = 45  # The TD post ID

def get_post(post_id):
    url = f"{WP_URL}/wp-json/wp/v2/posts/{post_id}"
    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{WP_USER}:{WP_APP_PASSWORD}'.encode()).decode()}"
    }
    request = urllib.request.Request(url, headers=headers)
    try:
        response = urllib.request.urlopen(request)
        result = json.loads(response.read().decode())
        return result
    except Exception as e:
        print(f"Error: {e}")
        return None

def update_post(post_id, content):
    url = f"{WP_URL}/wp-json/wp/v2/posts/{post_id}"
    
    data = {"content": content}
    
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
        return result
    except Exception as e:
        print(f"Error: {e}")
        return None

# Get current content
print("Fetching TD post...")
post = get_post(POST_ID)

if post:
    content = post['content']['rendered']
    
    # Replace BCE references
    content = content.replace('like BCE', 'a deep value play')
    content = content.replace('BCE (5.3x P/E)', 'some deep value stocks (5-6x P/E)')
    content = content.replace('BCE, but it', 'deep value stocks, but TD')
    
    # Remove comparison table
    import re
    # Find and remove the table that compares BCE and TD
    table_pattern = r'<table>.*?BCE.*?</table>'
    content = re.sub(table_pattern, '', content, flags=re.DOTALL)
    
    # Also remove any stray comparison sentences
    content = content.replace('Compared to BCE:', 'Valuation Summary:')
    
    print("Updating post...")
    result = update_post(POST_ID, content)
    
    if result:
        print("SUCCESS - Removed BCE references from TD post")
        print(f"URL: {result['link']}")
    else:
        print("Failed to update")
else:
    print("Could not fetch post")
