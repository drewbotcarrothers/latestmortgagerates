# Fallback Lender Analysis — August 13, 2026 (Updated)

## Summary
Analyzed all 15 fallback lenders. Found **3 main categories** of issues:

| Category | Count | Fixable? |
|---|---|---|
| Wrong URL (404/redirect) | 6 | ✅ Easy fix |
| Dynamic content (JS/images) | 3 | ⚠️ Needs Playwright rewrite |
| Anti-bot / Site down | 6 | ❌ Hard/impossible |

---

## Detailed Findings

### 1. Centum — WRONG URL
**Current:** `centum.ca/our-rates` → redirects to homepage
**Actual rates at:** `centum.ca/rates`
**Structure:** HTML table with images for rate values (placeholders — may need JS or image OCR)
**Fix:** Update URL to `/rates`, may need to handle image-based rates

### 2. CMLS — WRONG URL
**Current:** `cmls.ca/rates` → generic page with no rates
**Actual rates at:** `cmls.ca/what-we-do/cmls-residential/mortgage-rates`
**Structure:** Dropdown selectors with heading elements showing rates:
- Fixed 1 Year: **5.24%**
- Adjustable 3 Year: **4.75%**
**Fix:** Update URL, extract from dropdown options + heading values

### 3. Coast Capital — WRONG URL
**Current:** `coastcapitalsavings.com/rates/mortgage-rates` → 404
**Actual rates at:** `coastcapitalsavings.com/mortgages` (or `/mortgages/rates/`)
**Structure:** Static page with rate cards/tables. Loads fine in browser — NO anti-bot.
**Rates found:** 5yr Fixed High-Ratio: 4.06%, 5yr Variable High-Ratio: 3.81%, 5yr Fixed: 4.46%
**Fix:** Update URL to `/mortgages`, add table extraction patterns

### 4. Home Trust — WRONG URL
**Current:** `hometrust.ca/mortgages` → loads but shows general mortgages page
**Actual rates at:** `hometrust.ca/mortgages/rates/`
**Structure:** Two product sections (Accelerator Mortgage insured, Classic Mortgage) with posted rates in text
**Rates found:**
- Accelerator (insured): 1yr 4.99%, 2yr 4.44%, 3yr 4.34%, 4yr 4.39%, 5yr 4.49%
- Classic: 1yr 5.09%, 2yr 5.09%, 3yr 5.19%, 4yr 5.83%, 5yr 5.88%
**Fix:** Update URL, add text extraction patterns for both product sections

### 5. Laurentian — WRONG URL
**Current:** `laurentianbank.ca/personal/mortgages` → wrong page
**Actual rates at:** `laurentianbank.ca/en/personal/rates/mortgages`
**Structure:** HTML tables with multiple rate categories (Open, Convertible, Closed, Variable, High-ratio)
**Rates found:** Closed 1yr 5.64%, 2yr 5.94%, 3yr 6.09%, 4yr 6.19%, 5yr 6.29%, Promo 5yr 4.79%, Variable 5yr 4.05%, High-ratio 5yr 4.29%
**Fix:** Update URL, add table-based extraction for all rate tables

### 6. Street Capital — SITE DOWN (503)
**Current:** `streetcapital.ca/mortgage-rates` → "Site is unavailable" (503)
**Status:** Domain appears to be down or retired
**Investigation:** 503 error from both browser and curl. Site may have been acquired or shut down.
**Fix:** Need to determine if Street Capital still exists as an independent lender

### 7. Vancity — WRONG URL
**Current:** `vancity.com/personal/rates/#mortgage` → wrong page with fragment anchor
**Actual rates at:** `vancity.com/rates/mortgages`
**Structure:** Multiple HTML tables with member preferred rates, high-ratio, fixed-term, open-term, variable
**Rates found (Member preferred):** 3yr fixed 4.14%, 4yr 4.19%, 5yr 4.24%, 5yr variable 3.40%, High-ratio 5yr 4.04%
**Fix:** Update URL, add table extraction for all rate categories

### 8. MCAP — WHOLESALE LENDER
**Current:** `mcap.com` → no public consumer rates
**Status:** Only Prime Rate published (4.45%). No specific mortgage product rates for consumers.
**Recommendation:** Keep for Prime Rate only, or remove entirely

### 9-16. Already Fixed (awaiting verification)
These were fixed today but still show fallback in local data (needs next scheduled scrape):
- **Alterna** — URL fixed to `/en/personal/rates/mortgages`
- **ATB** — URL fixed to `/en/personal/mortgages/mortgage-rates`
- **Desjardins** — URL fixed to `/en/mortgages/mortgage-rates`
- **Meridian** — URL fixed to `/personal/rates-and-fees/mortgage-and-borrowing-rates`
- **Simplii** — Scraper rewritten to extract from visible tables
- **EQ Bank** — Parser rewritten to extract from DOM only
- **Equitable** — URL fixed to `/mortgages/current-rates`
- **RFA** — URL fixed to `/mortgage-rates`

---

## Quick Wins (Easy Fixes)

### Coast Capital
```python
RATE_URL = "https://www.coastcapitalsavings.com/mortgages"
# Add table extraction with multiple regex patterns
```

### Home Trust
```python
RATE_URL = "https://www.hometrust.ca/mortgages/rates/"
# Extract from posted rates text sections
```

### Laurentian
```python
RATE_URL = "https://www.laurentianbank.ca/en/personal/rates/mortgages"
# Extract from HTML tables with term/rate pairs
```

### Vancity
```python
RATE_URL = "https://www.vancity.com/rates/mortgages"
# Extract from multiple tables with rate categories
```

---

## Commits
- `d728bfa` fix(td): improve live scraping
- `50051af` fix(firstnational): HTTP/2 disable
- `7073ea5` fix(manulife): HTTP/2 disable
- `4a094ec` fix(simplii): HTTP/2 disable
- `96e695d` fix(mcap): HTTP/2 disable
- `478a32e` fix(ci): add missing ftp protocol and port 21
- `24a5161` fix(scrapers): correct datetime import (timezone)
- `805f7cd` fix(scrapers): fix URLs and parsing for manulife, firstnational, simplii
- `b6e675f` fix(eqbank): correct URL and add JSON payload parsing
- `9892cce` fix(scrapers): correct URLs for equitable and rfa
- `9c9b801` fix(ci): remove dangerous-clean-slate to fix FTP 550 error
- `a2db7cc` fix(eqbank): rewrite parser to extract only current rates from DOM
- `f245f99` fix(simplii): rewrite scraper to extract from visible tables
- `5d40f8d` fix(scrapers): correct URLs for alterna and meridian
- `fdfc57c` fix(scrapers): correct URLs for atb and desjardins
- `b102eb6` fix(scrapers): correct URLs for centum and cmls + investigation doc
- *(pending)* fix(scrapers): correct URLs for coastcapital, hometrust, laurentian, vancity

---

## Recommended Next Steps

1. **Wait for scheduled scrape** (6 AM EDT Aug 14) to verify today's fixes
2. **Check Street Capital status** — determine if acquired/retired
3. **Consider MCAP removal** — wholesale lender with no public consumer rates
4. **Add monitoring** — alert if `scrapers_failed > 0` or `live_rates < 50`

## Potential Live Rate Increase
If all fixable lenders work:
- **Current live:** ~230 rates
- **After all fixes:** ~270-290 rates
- **Target:** 300+ rates (90%+ live)
