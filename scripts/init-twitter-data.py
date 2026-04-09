#!/usr/bin/env python3
import json
from datetime import datetime

with open('data/rates.json', 'r') as f:
    rates = json.load(f)

fixed5 = [r for r in rates if r['rate_type'] == 'fixed' and r['term_months'] == 60]
fixed5.sort(key=lambda x: x['rate'])
var5 = [r for r in rates if r['rate_type'] == 'variable' and r['term_months'] == 60]
var5.sort(key=lambda x: x['rate'])

top_lenders = [{'name': r['lender_name'], 'rate': r['rate']} for r in fixed5[:5]]

data = {
    'date': datetime.now().strftime('%Y-%m-%d'),
    'best5YearFixed': fixed5[0]['rate'] if fixed5 else 0,
    'best5YearVariable': var5[0]['rate'] if var5 else 0,
    'primeRate': 4.95,
    'bondYield5Year': 2.8,
    'topLenders': top_lenders
}

with open('data/twitter-previous-data.json', 'w') as f:
    json.dump(data, f, indent=2)

print('Created twitter-previous-data.json')
print('Best 5Y Fixed: %.2f%%' % data['best5YearFixed'])
print('Best 5Y Variable: %.2f%%' % data['best5YearVariable'])
