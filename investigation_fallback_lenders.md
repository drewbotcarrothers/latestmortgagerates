# Fallback Lender Analysis — August 13, 2026

## Summary
Analyzed all 15 fallback lenders to understand why they return 0 live rates. Found **3 main categories** of issues:

| Category | Count | Fixable? |
|---|---|---|
| Wrong URL (404/redirect) | 6 | ✅ Easy fix |
| Dynamic content (JS/images) | 4 | ⚠️ Needs Playwright rewrite |
| Anti-bot / Site down | 5 | ❌ Hard/impossible |

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

### 3. Coast Capital — 404
**Current:** `coastcapitalsavings.com/rates/mortgage-rates` → 404
**Status:** Site structure changed
**Fix:** Need to find new rates URL

### 4. Home Trust — ANTI-BOT
**Current:** `hometrust.ca/mortgages` → Radware captcha page
**Status:** Bot detection blocking scrapers
**Fix:** May need residential IP or proxy rotation

### 5. Laurentian — FETCH FAILED
**Current:** `laurentianbank.ca/personal/mortgages`
**Status:** Site may be down or blocking
**Fix:** Verify URL and check if site accessible

### 6. Street Capital — 503
**Current:** `streetcapital.ca/mortgage-rates` → "Site is unavailable"
**Status:** Site appears down
**Fix:** Check if domain changed or site retired

### 7. Vancity — ANTI-BOT
**Current:** `vancity.com/personal/rates/#mortgage` → Vercel security checkpoint
**Status:** Bot verification blocking
**Fix:** May need cookie/session handling

### 8. MCAP — WHOLESALE LENDER (already known)
**Current:** `mcap.com`
**Status:** No public consumer rates — only Prime Rate
**Recommendation:** Keep for Prime Rate or remove

### 9-15. Already Fixed (awaiting verification)
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

### Centum
```python
RATE_URL = "https://www.centum.ca/rates"
# Note: Rates are image-based, may need OCR or different approach
```

### CMLS
```python
RATE_URL = "https://www.cmls.ca/what-we-do/cmls-residential/mortgage-rates"
# Extract from dropdown selectors:
# - combobox "fixed rate" options → term mapping
# - h1 heading "5.24%" → rate value
```

---

## Recommended Next Steps

1. **Fix Centum and CMLS URLs** — immediate easy wins
2. **Check Coast Capital** — find new URL via sitemap or navigation
3. **Investigate anti-bot lenders** (Home Trust, Vancity) — may need:
   - Residential proxy rotation
   - Cookie/session persistence
   - Slower request pacing
4. **Check if Street Capital/Laurentian sites are permanently down**
5. **Wait for scheduled scrape** (6 AM EDT) to verify today's fixes

## Potential Live Rate Increase
If all fixable lenders work:
- **Current live:** ~230 rates
- **After fixes:** ~250-270 rates (+20-40)
- **Target:** 300+ rates (90%+ live)
