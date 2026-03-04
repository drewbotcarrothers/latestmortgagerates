import json
import base64
import urllib.request

WP_URL = 'https://stocksummarizer.com'
WP_USER = 'DrewBot'
WP_APP_PASSWORD = 'jMUk E2he V14t YEsw KUc3 jwOh'

url = f'{WP_URL}/wp-json/wp/v2/posts?per_page=5&orderby=date&order=desc'
headers = {
    'Authorization': f'Basic {base64.b64encode(f"{WP_USER}:{WP_APP_PASSWORD}".encode()).decode()}'
}
request = urllib.request.Request(url, headers=headers)

try:
    response = urllib.request.urlopen(request)
    posts = json.loads(response.read().decode())
    for post in posts:
        post_id = post['id']
        title = post['title']['rendered']
        print(f"ID: {post_id} | {title}")
except Exception as e:
    print(f'Error: {e}')
