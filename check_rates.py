import json
from collections import defaultdict

with open('data/rates.json', 'r') as f:
    rates = json.load(f)

lender_sources = defaultdict(lambda: {'live': 0, 'fallback': 0, 'other': 0})

for rate in rates:
    lender = rate['lender_slug']
    source = rate.get('raw_data', {}).get('source', '')
    if 'live_scrape' in source:
        lender_sources[lender]['live'] += 1
    elif 'fallback' in source:
        lender_sources[lender]['fallback'] += 1
    else:
        lender_sources[lender]['other'] += 1

print('Lender Scraping Results (Run #297 - Jul 19, 2026):')
print('=' * 60)
for lender, counts in sorted(lender_sources.items()):
    status = 'LIVE' if counts['live'] > 0 else 'FALLBACK'
    print(f"{status:10} {lender:25} {counts['live']:2} live / {counts['fallback']:2} fallback")

print()
total_live = sum(c['live'] for c in lender_sources.values())
total_fallback = sum(c['fallback'] for c in lender_sources.values())
print(f"Total: {total_live} live rates, {total_fallback} fallback rates")
