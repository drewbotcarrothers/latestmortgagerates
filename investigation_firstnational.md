# First National Bank Mortgage Rate Page Investigation

## Date
2026-08-13

## Summary
First National Financial LP mortgage rates are served as **static HTML** embedded directly in the page response. There is **no dynamic JavaScript loading** and **no JSON API endpoint** exposed in the page source. Rates are presented in standard HTML `<table>` elements.

---

## 1. Correct URLs

The old URL `https://www.firstnational.ca/personal/mortgages/mortgage-rates` returns **404**.

| Page | URL | Status |
|------|-----|--------|
| Residential mortgage rates | `https://www.firstnational.ca/residential/mortgage-rates` | 200 |
| Prime rates (broker view) | `https://www.firstnational.ca/mortgage-brokers/mortgage-rates/prime-rates` | 200 |
| Excalibur rates (broker view) | `https://www.firstnational.ca/mortgage-brokers/mortgage-rates/excalibur-rates` | 200 |

Both the residential and broker `/prime-rates` and `/excalibur-rates` sub-pages redirect to (or serve the same content as) the parent `/mortgage-rates` page. The HTML content length is identical (~86,948 bytes for residential, ~106,035 bytes for broker).

---

## 2. Rate Data Container Elements

Rates are stored in **4 plain HTML `<table>` elements** with the following structure:

### Table 0 — Fixed Rates (class `table table-striped table-rwd`)
- **Columns:** 1 year | 2 year | 3 year | 4 year | 5 year | 7 year | 10 year
- **Rows:**
  - Insured
  - Insurable up to 65% LTV
  - Insurable > 65% - 70% LTV
  - Insurable > 70% - 75% LTV
  - Insurable > 75% - 80% LTV
  - Conventional
- **Sample data:**
  - Insured 5-year: `4.49`
  - Conventional 5-year: `4.94`
  - 7-year & 10-year: present for Insured & Conventional; "N/A" for LTV-banded rows

### Table 1 — Variable Rates (class `table table-striped margin-top-2`)
- **Columns:** 5 year
- **Rows:** Same LTV categories as Table 0
- **Sample data:**
  - Insured: `Prime - 0.75% for the entire term`
  - Conventional: `Prime - 0.16% for the entire term`

### Table 2 — 6-Month Fixed (class `table table-striped margin-top-2`)
- Single row: "6 month fixed term" → `9.95`

### Table 3 — Credit Score Tier Rates (class `table table-striped table-rwd`)
- **Columns:** 680+ | 650-679 | 600-649 | 580-599 | < 580
- **Rows:** 1 Year | 2 Year | 3 Year
- **Sample data:**
  - 1 Year, 680+: `4.99%`
  - 1 Year, < 580: `5.89%`

---

## 3. Dynamic Loading?

**No.** Rates are NOT loaded dynamically via JavaScript.

- No `fetch()` or `XMLHttpRequest` calls in the page source.
- No JSON data embedded in `<script>` tags.
- No API endpoints discovered.
- The page is rendered server-side by **Sitefinity CMS** (meta generator: `Sitefinity 15.4.8630.0 DX`).
- All rate data is present in the initial HTML response.

---

## 4. API Endpoints / JSON?

**None found.**

- 10 `<script>` tags were extracted; none contained rate data or API calls.
- No `window.__INITIAL_STATE__`, `__DATA__`, or similar hydration objects.
- No GraphQL, REST, or JSONP references.

---

## 5. Suggested Extraction Methods

### Option A: Regex + HTML Parsing (Recommended)
```python
import requests, re
from bs4 import BeautifulSoup

url = 'https://www.firstnational.ca/residential/mortgage-rates'
headers = {'User-Agent': 'Mozilla/5.0 ...'}
resp = requests.get(url, headers=headers)

# Find all tables
tables = re.findall(r'<table[^>]*>.*?</table>', resp.text, re.DOTALL | re.IGNORECASE)
# tables[0] = fixed rates
# tables[1] = variable rates
# tables[2] = 6-month fixed
# tables[3] = credit score tiers

soup = BeautifulSoup(tables[0], 'html.parser')
rows = soup.find_all('tr')
# Parse headers and cells...
```

### Option B: Playwright Selectors
```python
# Fixed rate table
page.locator('table.table-striped.table-rwd').nth(0)

# Variable rate table
page.locator('table.table-striped.margin-top-2').nth(0)

# 6-month fixed table
page.locator('table.table-striped.margin-top-2').nth(1)

# Credit score tier table
page.locator('table.table-striped.table-rwd').nth(1)
```

### Option C: XPath
```python
# All rate tables
"//table[contains(@class, 'table-striped')]"

# Fixed rate specifically
"//table[contains(@class, 'table-rwd')]"

# Variable / 6-month
"//table[contains(@class, 'margin-top-2')]"
```

### Option D: Regex Patterns (for raw HTML scraping)
```regex
# Fixed rate cells
<td aria-label="\d+ year">([0-9.N/A]+)</td>

# Variable rate cells
<td>\s*Prime\s*-\s*([0-9.]+)%\s*for the entire term\s*</td>

# 6-month fixed
<th[^>]*>6 month fixed term</th>\s*<td><span>([0-9.]+)</span></td>

# Credit score tiers
<td aria-label="[^"]+">([0-9.]+%)</td>
```

---

## 6. Key Observations

1. **CMS:** Sitefinity 15.4 — rates are likely edited manually or fed from an internal CMS widget; not exposed via public API.
2. **Rate Format:** Fixed rates are plain numbers (e.g., `5.14`) without a `%` symbol in the table cells. Variable rates are text strings (e.g., `Prime - 0.75% for the entire term`). Credit score tier rates include `%` (e.g., `4.99%`).
3. **N/A Handling:** Some cells contain literal `N/A` for unsupported term/LTV combinations.
4. **No Rate Timestamp:** The HTML does not contain a "last updated" or "effective date" timestamp inside the tables. A date may exist elsewhere on the page (not investigated).
5. **No Anti-Scraping:** No CAPTCHA, no aggressive bot detection observed. Standard `requests` with a user-agent works fine.

---

## Files Saved
- `firstnational_rates.html` — 404 error page from old URL
- `firstnational_home.html` — homepage
- `firstnational_residential_mortgage-rates.html` — residential rates page (86 KB)
- `firstnational_residential_mortgage-rates_prime-rates.html` — prime rates (same content)
- `firstnational_residential_mortgage-rates_excalibur-rates.html` — excalibur rates (same content)
- `firstnational_mortgage-brokers_mortgage-rates_prime-rates.html` — broker view (106 KB)
- `firstnational_mortgage-brokers_mortgage-rates_excalibur-rates.html` — broker view (same content)
