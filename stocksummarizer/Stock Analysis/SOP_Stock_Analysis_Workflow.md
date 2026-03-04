# StockSummarizer Standard Operating Procedure (SOP)
## Creating Individual Stock Analysis WordPress Posts

**Document Version:** 1.0  
**Date:** Feb 25, 2026  
**Purpose:** Standardized workflow for analyzing a single stock and publishing to WordPress  
**Based On:** BCE (Bell Canada) Analysis Template

---

## OVERVIEW

This SOP guides you through the complete workflow of creating a comprehensive stock analysis post for StockSummarizer.com, from data extraction through WordPress publishing.

**Total Time Required:** 15-20 minutes per stock (once familiarized)  
**Prerequisites:** Access to TSX_Merged_Data.csv, WordPress credentials configured

---

## STEP 1: DATA VERIFICATION (2 minutes)

### Purpose
Ensure the target stock exists in the dataset and has complete data.

### Actions
1. Open terminal/command prompt
2. Navigate to analysis scripts directory:
   ```
   cd "C:\Users\acarr\.openclaw\workspace\stocksummarizer\Stock Analysis\analysis_scripts"
   ```

3. Run quick check:
   ```bash
   python quick_stats.py
   ```
   Or create a quick verification script:
   ```python
   import pandas as pd
   df = pd.read_csv('../TSX_Merged_Data.csv')
   stock = df[df['Symbol'] == 'TICKER']  # Replace TICKER
   print(f"Found: {len(stock)} rows")
   print(f"Price: ${stock['Price'].values[0]}")
   print(f"P/E: {stock['Price to earnings ratio'].values[0]}")
   ```

### Key Data Points to Verify
| Data Point | Column Name | Status |
|------------|-------------|--------|
| Symbol | Symbol | Required |
| Name | Description | Required |
| Price | Price | Required |
| P/E Ratio | Price to earnings ratio | Required |
| Market Cap | Market capitalization | Required |
| Dividend Yield | Dividend yield % (indicated) | Preferred |
| P/B Ratio | Price to book ratio | Preferred |
| ROE | Return on equity % | Optional |

**If data is incomplete:** Proceed but note limitations in the analysis.

---

## STEP 2: GENERATE ANALYSIS CHARTS (5-7 minutes)

### Purpose
Create visualizations for Twitter/YouTube and WordPress use.

### Action: Create Chart Generator Script
Create file: `create_[ticker]_charts.py`

**Template:**
```python
"""
Visualization Generator for [TICKER] Stock Analysis
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
from pathlib import Path

OUTPUT_DIR = Path('../output/[ticker]_analysis')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

plt.rcParams['figure.figsize'] = (12, 6.75)
plt.rcParams['font.size'] = 12
plt.rcParams['axes.titlesize'] = 20
plt.rcParams['axes.labelsize'] = 14

COLORS = {
    'stock': '#1E88E5',
    'sector': '#757575',
    'positive': '#43A047',
    'negative': '#E53935',
    'accent': '#FB8C00'
}

df = pd.read_csv('../TSX_Merged_Data.csv', low_memory=False)
stock = df[df['Symbol'] == '[TICKER]'].iloc[0]
sector = df[df['Sector'] == stock['Sector']].copy()

print(f"Analyzing: {stock['Description']}")
print(f"Price: ${stock['Price']:.2f}")

# Chart 1: P/E Comparison vs Peers
# Chart 2: Dividend Yield
# Chart 3: Dashboard
# etc.
```

### Required Charts Checklist

| Chart # | Name | Purpose |
|---------|------|---------|
| 1 | P/E Comparison | Show valuation discount vs peers |
| 2 | Dividend Yield | Income opportunity visualization |
| 3 | Metrics Dashboard | Key stats in single view |
| 4 | Multi-Metric Valuation | P/E, P/B, D/Y comparison |
| 5 | Valuation Scorecard | Discount analysis + fair value |
| 6 | Historical Performance | Price path + fair value gap |
| 7 | Performance Summary | Multi-timeframe + context |

### Run Chart Generator
```bash
python create_[ticker]_charts.py
```

**Verify Output:**
Check that all charts saved to `../output/[ticker]_analysis/`

---

## STEP 3: CREATE TWITTER THREAD (Optional - 5 minutes)

### Purpose
Generate social media content for promotion.

### Action
Create file: `twitter_thread_[ticker].md`

**Structure:**
```markdown
# TWITTER THREAD: [TICKER] Deep Dive

## TWEET 1/12 - HOOK
[Company] is [surprising fact]. Here's why it matters: 🧵

## TWEET 2/12 - COMPANY OVERVIEW
• Founded: XXXX
• Market Cap: $XXB
• Business: [description]

## TWEET 3/12 - THE THESIS
My thesis: [1-2 sentences]

## TWEET 4-11 - [Visuals, Bull Case, Bear Case, Valuation]

## TWEET 12/12 - CONCLUSION + CTA
```

---

## STEP 4: CREATE YOUTUBE VIDEO SCRIPT (Optional - 5 minutes)

### Purpose
Generate video script for YouTube content.

### Action
Create file: `youtube_script_[ticker].py`

**Use existing template:**
- Copy `youtube_video_generator.py`
- Change ticker variable
- Run to generate complete 15-minute script

---

## STEP 5: UPLOAD CHARTS TO WORDPRESS (2 minutes)

### Purpose
Get WordPress URLs for all charts.

### Action: Create Upload Script

```python
"""
Upload [TICKER] charts to WordPress
"""

import json
import base64
import mimetypes
import urllib.request
from pathlib import Path

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = [YOUR_APP_PASSWORD]

OUTPUT_DIR = Path("../output/[ticker]_analysis")

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
        print(f"✓ {filepath.name} -> {result['source_url']}")
        return result['source_url']
    except Exception as e:
        print(f"✗ {filepath.name}: {e}")
        return None

# Upload all charts
chart_files = sorted(OUTPUT_DIR.glob("chart*.png"))
urls = {}
for chart_file in chart_files:
    url = upload_media(chart_file)
    if url:
        urls[chart_file.stem] = url

print("\nURLs to use in post:")
for name, url in urls.items():
    print(f"{name}: {url}")
```

**Save URLs for next step.**

---

## STEP 6: CREATE WORDPRESS POST CONTENT (3 minutes)

### Purpose
Generate the HTML content for the blog post.

### Action: Use Template Structure

**File:** `wordpress_content_[ticker].py`

**10-Section Structure (Logical Flow):**

```html
<h2>[TICKER] - [Company Name] Stock Analysis: [Hook]</h2>

<!-- SECTION 1: THE HOOK -->
<h3>The Setup: An Extreme Valuation</h3>
<p>[TICKER] currently trades at [X]x P/E...</p>
<img src="[chart1_url]" />

<!-- SECTION 2: THE ASSET -->
<h3>The Asset: What You're Buying</h3>
<p>Company overview, business segments, moat analysis</p>
<img src="[chart3_url]" />

<!-- SECTION 3: THE CONTROVERSY -->
<h3>Why It's Cheap: The Risks</h3>
<ol>
  <li>Risk 1</li>
  <li>Risk 2</li>
</ol>

<!-- SECTION 4: HISTORICAL CONTEXT -->
<h3>How We Got Here</h3>
<p>Price history, multiple compression explanation</p>
<img src="[chart6_url]" />

<!-- SECTION 5: DEEP VALUATION -->
<h3>Multi-Metric Analysis</h3>
<table>...</table>
<img src="[chart4_url]" />
<img src="[chart5_url]" />

<!-- SECTION 6: BULL CASE -->
<h3>Why It Could Work</h3>
<ol>...</ol>

<!-- SECTION 7: BEAR CASE -->
<h3>What Could Go Wrong</h3>
<ol>...</ol>

<!-- SECTION 8: THE MATH -->
<h3>Fair Value Scenarios</h3>
<table>
  <tr><th>Scenario</th><th>P/E</th><th>Target</th><th>Upside</th></tr>
</table>
<img src="[chart7_url]" />

<!-- SECTION 9: INCOME ANALYSIS -->
<h3>The Income Play</h3>
<p>Dividend yield analysis</p>
<img src="[chart2_url]" />

<!-- SECTION 10: CONCLUSION -->
<h3>Bottom Line</h3>
<p>Final verdict, who should buy, key metrics summary</p>

<!-- DISCLOSURE -->
<h3>Important Disclosures</h3>
<p><em>Disclaimer text...</em></p>
```

---

## STEP 7: PUBLISH TO WORDPRESS (2 minutes)

### Action: Use Publishing Script

```python
"""
Publish [TICKER] to WordPress
"""

import json
import base64
import urllib.request

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = [YOUR_APP_PASSWORD]

def create_post(title, content, status="draft"):
    url = f"{WP_URL}/wp-json/wp/v2/posts"
    
    data = {
        "title": title,
        "content": content,
        "status": status
    }
    
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
        print(f"✓ Created: {result['link']}")
        return result
    except Exception as e:
        print(f"✗ Error: {e}")
        return None

# Content from Step 6
content = """[HTML CONTENT HERE]"""

title = "[TICKER] Stock Analysis: [Short Hook]"

post = create_post(title, content, status="draft")  # Review before publish
# post = create_post(title, content, status="publish")  # Or publish immediately
```

---

## STEP 8: VERIFY POST (1 minute)

### Verification Checklist

- [ ] Post URL loads without errors
- [ ] All chart images display correctly
- [ ] Tables render properly
- [ ] Links work (if any)
- [ ] Featured image set (optional)
- [ ] Categories/tags added (optional)

**Fix Broken Images:**
If charts don't load, check post content for incorrect URLs and update with correct WordPress URLs.

---

## COMPLETE FILE STRUCTURE

```
stocksummarizer/Stock Analysis/
├── analysis_scripts/
│   ├── create_[ticker]_charts.py      # Chart generator
│   ├── twitter_thread_[ticker].md   # Twitter content
│   ├── youtube_script_[ticker].py   # Video script
│   ├── upload_[ticker]_charts.py    # WP upload
│   ├── wordpress_[ticker].py          # WP post + publish
│   └── [Use existing for reference:]
│       ├── quick_stats.py
│       ├── bce_expanded_valuation.py
│       ├── bce_historical_analysis.py
│       └── reorder_bce_post.py
└── output/
    └── [ticker]_analysis/
        ├── chart1_pe_comparison.png
        ├── chart2_dividend_yield.png
        ├── chart3_dashboard.png
        ├── chart4_valuation_metrics.png
        ├── chart5_valuation_scorecard.png
        ├── chart6_historical_performance.png
        └── chart7_performance_summary.png
```

---

## BEST PRACTICES

### Writing Quality
1. **Use simple language** - Retail investors should understand
2. **Lead with the thesis** - Don't bury the lede
3. **Balance bull/bear cases** - Be intellectually honest
4. **Quantify everything** - "Cheap" means less than X multiple
5. **Always disclose** - Not financial advice disclaimer required

### SEO Optimization
1. **Title format:** "[TICKER] Stock Analysis: [Hook]"
2. **Use H2/H3 headers for structure**
3. **Include ticker in first paragraph**
4. **Add related stock links at bottom**

### Visual Design
1. **Consistent colors:** Blue for stock, gray for sector, green for positive
2. **Include both absolute and relative numbers** ($35 vs 52% below sector)
3. **Use tables for comparisons** - Easier than text
4. **Chart captions explain the insight** - Don't just label

---

## TROUBLESHOOTING

### Issue: Chart images 404
**Solution:**
1. Check WordPress media library for actual URLs
2. Update post content with correct URLs
3. Common issue: WordPress adds `-1`, `-scaled` suffixes

### Issue: Data missing for stock
**Solution:**
1. Check column names in CSV
2. Use try/except in scripts
3. Note data limitations in analysis

### Issue: Post formatting broken
**Solution:**
1. Ensure HTML tags properly closed
2. Check for stray `>` or `<` characters
3. Test locally before publishing

---

## AUTOMATION OPPORTUNITIES

**Could Automate:**
1. Chart generation (all 7 charts from script)
2. WordPress upload
3. URL collection
4. Basic post structure

**Manual Review Required:**
1. Investment thesis writing
2. Bull/bear case balance
3. Final valuation call
4. Disclosures

---

## REVISION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-25 | Initial SOP based on BCE analysis |

---

## APPROVAL

**Document Owner:** [Name]  
**Reviewed By:** [Name]  
**Approved For Use:** [Date]

---

**Next Review Date:** March 25, 2026
