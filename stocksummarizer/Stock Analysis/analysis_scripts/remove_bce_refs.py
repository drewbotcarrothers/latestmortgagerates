"""
Update TD post (ID 44) to remove all BCE references
"""

import json
import base64
import urllib.request
import re

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"
POST_ID = 44

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
        print(f"Error fetching: {e}")
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
        print(f"Error updating: {e}")
        return None

print("Fetching TD post...")
post = get_post(POST_ID)

if post:
    content = post['content']['rendered']
    
    # Track changes
    changes = []
    
    # Replace specific phrases
    replacements = [
        ('like BCE', 'deep value plays'),
        ('BCE (5.3x P/E)', 'some stocks trading at 5-6x P/E'),
        ('BCE, but it offers', 'deep value stocks, but TD offers'),
        ('dramatically undervalued like BCE', 'at deep value multiples'),
        ('TD is not a deep value play like BCE', 'TD is not a deep value play trading at distressed multiples'),
        ('If you want deep value, look elsewhere (like BCE at 5.3x P/E)', 'If you want deep value with higher upside, consider stocks trading below 6x P/E'),
        ('Compared to BCE:', 'Investment Profile:'),
    ]
    
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            changes.append(f"Replaced: '{old}' -> '{new}'")
    
    # Remove the comparison table (BCE vs TD table)
    # Find table with BCE in it
    table_start = content.find('<table>')
    while table_start != -1:
        table_end = content.find('</table>', table_start) + 8
        table_content = content[table_start:table_end]
        
        if 'BCE' in table_content:
            content = content[:table_start] + content[table_end:]
            changes.append("Removed: BCE comparison table")
            break
        
        # Look for next table
        table_start = content.find('<table>', table_end)
    
    # Also check for any remaining BCE mentions and report them
    if 'BCE' in content:
        import re
        bce_matches = re.findall(r'.{0,30}BCE.{0,30}', content)
        for match in bce_matches:
            changes.append(f"WARNING: Still contains BCE: ...{match}...")
    
    if changes:
        print("\nChanges made:")
        for change in changes:
            print(f"  - {change}")
        
        print("\nUpdating post...")
        result = update_post(POST_ID, content)
        
        if result:
            print("\nSUCCESS - Post updated without BCE references")
            print(f"URL: {result['link']}")
        else:
            print("\nFailed to update post")
    else:
        print("\nNo BCE references found to remove")
else:
    print("Could not fetch post")
