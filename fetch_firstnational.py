import requests
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}

# Try mortgage rates page
url = 'https://www.firstnational.ca/personal/mortgages/mortgage-rates'
try:
    resp = requests.get(url, headers=headers, timeout=30, allow_redirects=True)
    print(f"URL: {resp.url}")
    print(f"Status: {resp.status_code}")
    print(f"Content length: {len(resp.text)}")
    with open(r'C:\Users\acarr\latestmortgagerates\firstnational_rates.html', 'w', encoding='utf-8') as f:
        f.write(resp.text)
    print("Saved to firstnational_rates.html")
except Exception as e:
    print(f"Error fetching {url}: {e}")

# Also try the homepage
url2 = 'https://www.firstnational.ca/'
try:
    resp2 = requests.get(url2, headers=headers, timeout=30, allow_redirects=True)
    print(f"\nHomepage URL: {resp2.url}")
    print(f"Homepage Status: {resp2.status_code}")
    print(f"Homepage Content length: {len(resp2.text)}")
    with open(r'C:\Users\acarr\latestmortgagerates\firstnational_home.html', 'w', encoding='utf-8') as f:
        f.write(resp2.text)
    print("Saved to firstnational_home.html")
except Exception as e:
    print(f"Error fetching {url2}: {e}")
