"""
Get all media URLs from WordPress
"""

import json
import urllib.request

url = "https://stocksummarizer.com/wp-json/wp/v2/media?per_page=100"

try:
    response = urllib.request.urlopen(url)
    data = json.loads(response.read().decode())
    
    print("All Media Files (by date):\n")
    for m in data:
        print(f"{m['id']}: {m['source_url']}")
        
except Exception as e:
    print(f"Error: {e}")
