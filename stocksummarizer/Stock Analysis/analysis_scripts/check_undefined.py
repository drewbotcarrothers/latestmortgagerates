import json
import base64
import urllib.request

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"
POST_ID = 17

url = f"{WP_URL}/wp-json/wp/v2/posts/{POST_ID}"
headers = {
    "Authorization": f"Basic {base64.b64encode(f'{WP_USER}:{WP_APP_PASSWORD}'.encode()).decode()}"
}
request = urllib.request.Request(url, headers=headers)

try:
    response = urllib.request.urlopen(request)
    result = json.loads(response.read().decode())
    content = result['content']['rendered']
    
    # Check for "undefined" in the content
    if 'undefined' in content.lower():
        print("WARNING: Found 'undefined' in post content!")
        
        # Find lines with undefined
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if 'undefined' in line.lower():
                print(f"Line {i}: {line[:200]}")
    else:
        print("No 'undefined' found in post content")
    
    # Check specifically around P/E mentions
    import re
    pe_sections = re.findall(r'[Pp]/?[Ee].{0,50}', content)
    print("\nP/E sections found:")
    for section in pe_sections[:20]:
        print(f"  {section}")
        
except Exception as e:
    print(f"Error: {e}")
