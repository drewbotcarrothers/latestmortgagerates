import requests
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}

urls = [
    'https://www.firstnational.ca/residential/mortgage-rates',
    'https://www.firstnational.ca/residential/mortgage-rates/prime-rates',
    'https://www.firstnational.ca/residential/mortgage-rates/excalibur-rates',
    'https://www.firstnational.ca/mortgage-brokers/mortgage-rates/prime-rates',
    'https://www.firstnational.ca/mortgage-brokers/mortgage-rates/excalibur-rates',
]

for url in urls:
    try:
        resp = requests.get(url, headers=headers, timeout=30, allow_redirects=True)
        safe = url.replace('https://www.firstnational.ca/', '').replace('/', '_')
        fname = f'C:\\Users\\acarr\\latestmortgagerates\\firstnational_{safe}.html'
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(resp.text)
        print(f"URL: {url}")
        print(f"  Status: {resp.status_code}")
        print(f"  Length: {len(resp.text)}")
        print(f"  Saved: {fname}")
        # Look for JSON/script data
        scripts = re.findall(r'<script[^>]*>(.*?)</script>', resp.text, re.DOTALL)
        json_objs = []
        for s in scripts:
            try:
                # Try to find JSON objects
                for m in re.finditer(r'\{[^{]*"[^"]+"[^{}]*\}', s):
                    try:
                        obj = json.loads(m.group(0))
                        if any(k in str(obj).lower() for k in ['rate', 'prime', 'mortgage', 'term', 'interest']):
                            json_objs.append(obj)
                    except:
                        pass
            except:
                pass
        if json_objs:
            print(f"  Found {len(json_objs)} JSON objects with rate-like keys")
        # Look for tables
        tables = re.findall(r'<table[^>]*>.*?</table>', resp.text, re.DOTALL | re.IGNORECASE)
        print(f"  Tables found: {len(tables)}")
        # Look for rate-related divs
        rate_divs = re.findall(r'<div[^>]*(?:rate|term|interest|prime)[^>]*>.*?</div>', resp.text, re.DOTALL | re.IGNORECASE)
        print(f"  Rate-related divs found: {len(rate_divs)}")
        print()
    except Exception as e:
        print(f"Error fetching {url}: {e}\n")
