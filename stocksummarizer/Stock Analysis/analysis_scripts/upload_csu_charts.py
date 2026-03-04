"""
Upload CSU charts to WordPress
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

OUTPUT_DIR = Path("../output/csu_analysis")

def upload_media(filepath):
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
        print(f"  {filepath.name} (ID: {result['id']})")
        return result['source_url']
    except Exception as e:
        print(f"  ERROR: {e}")
        return None

print("="*70)
print("Uploading CSU Charts to WordPress")
print("="*70)

chart_files = sorted(OUTPUT_DIR.glob("chart*.png"))
chart_urls = {}

for chart_file in chart_files:
    url = upload_media(chart_file)
    if url:
        chart_urls[chart_file.stem] = url

print(f"\n{len(chart_urls)} charts uploaded")
print("\nChart URLs:")
for name, url in chart_urls.items():
    print(f"{name}: {url}")

# Save URLs for next step
with open('csu_chart_urls.json', 'w') as f:
    json.dump(chart_urls, f, indent=2)

print("\nURLs saved to csu_chart_urls.json")
