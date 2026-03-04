"""
Verify the BCE post was updated
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

content = get_post_content(POST_ID)

if content:
    # Check for new sections
    has_expanded = "Expanded Valuation Analysis" in content
    has_chart4 = "chart4_valuation_metrics" in content
    has_chart5 = "chart5_valuation_scorecard" in content
    
    print("BCE Post Update Verification")
    print("="*60)
    print(f"Expanded Valuation Section: {'YES' if has_expanded else 'NO'}")
    print(f"Chart 4 (Multi-metric): {'YES' if has_chart4 else 'NO'}")
    print(f"Chart 5 (Scorecard): {'YES' if has_chart5 else 'NO'}")
    print("="*60)
    
    if has_expanded and has_chart4 and has_chart5:
        print("\nPost successfully updated with expanded valuation!")
        print(f"View: https://stocksummarizer.com/bce-bell-canada-stock-analysis-deep-value-or-value-trap/")
    else:
        print("\nUpdate may be incomplete. Checking content...")
        print(f"\nTotal content length: {len(content)} characters")
else:
    print("Could not fetch post")
