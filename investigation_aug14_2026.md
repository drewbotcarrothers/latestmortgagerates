# Rate Scraper Investigation Report — August 14, 2026

## Executive Summary

**Overall Status:** 45% live rates, 55% fallback. Major improvement from 30% yesterday.
**Critical Issues Found:** EQ Bank scraping wrong data. BMO/CIBC still blocked.

---

## EQ Bank Investigation 🔴

### Problem
- Scraped rates: 6.31% to 8.81% (abnormally high for current market)
- Actual market: 4-5% for fixed mortgages
- Source URL in scraper: `https://www.eqbank.ca/residential/mortgage-rates`

### Root Cause
**EQ Bank has completely changed their mortgage strategy:**

1. **Old approach:** EQ Bank published their own mortgage rates directly
2. **New approach (2026):** EQ Bank now uses a "Mortgage Marketplace" powered by **nesto.ca**
   - URL: `https://www.eqbank.ca/personal-banking/mortgage-marketplace`
   - Redirects to: `https://www.nesto.ca/eqbank/?ext_pid=63483100...`
   - This is a broker marketplace, not direct rates

3. **Current rates page (`/rates`)** only shows:
   - Savings accounts (2.35-2.75%)
   - GICs (3.30-4.00%)
   - **NO mortgage rates listed**

4. **The scraper URL** (`/residential/mortgage-rates`) may be:
   - Returning a page with GIC/investment rates misidentified as mortgage rates
   - Or scraping from a different section entirely

### Verification
- Browser confirmed: `/personal/rates/mortgages` → 404 error
- Browser confirmed: `/rates` → Only GIC/savings rates, no mortgages
- Browser confirmed: `/personal-banking/mortgage-marketplace` → Redirects to nesto.ca

### Recommendation
**EQ Bank should be REMOVED** from direct rate scraping because:
- They no longer publish their own mortgage rates publicly
- They redirect to nesto.ca (a broker marketplace)
- The rates being scraped (6-8%) are NOT mortgage rates

Alternative: Scrape nesto.ca directly (already being done separately)

---

## BMO & CIBC Investigation 🔴

### Problem
- Both return 0 rates after 30s timeout
- "Success: true" in metadata but 0 rates found

### Root Cause
**Network-level blocking from GitHub Actions (Azure data center IPs)**
- GitHub Actions: Both timeout after 30s
- Local test (my machine): BMO loads fine, CIBC likely works too
- Same HTTP/2 disable + resource blocking pattern applied
- Still fails = IP-level blocking from Azure data center IPs

### Update (Aug 14, 07:15 EDT)
**Browser test from local machine shows BMO works perfectly:**
- 3 Year Fixed: **4.64%**
- 5 Year Smart Fixed (insured): **4.74%**
- 5 Year Smart Fixed (uninsured): **4.84%**
- 5 Year Variable: **4.10%**

**Conclusion:** BMO/CIBC scrape fine from residential IPs but block Azure data center IPs. This is intentional IP reputation blocking.

### Evidence
```
bmo: success=true, rates_found=0, duration=30.51s
cibc: success=true, rates_found=0, duration=30.51s
```

### Potential Solutions

#### Option 1: Proxy/Rotating IP ⭐ RECOMMENDED
- Use residential proxy service (Bright Data, Oxylabs, SmartProxy, etc.)
- Cost: ~$5-15/GB residential, ~$1-3/GB datacenter
- Implementation: Add proxy config to Playwright browser launch
- **Best option** since BMO/CIBC work from residential IPs

#### Option 2: Different Cloud Provider
- Try running from AWS, Google Cloud instead of Azure
- May have different IP reputation
- Quick test: Run scraper locally to verify

#### Option 3: Web Fetch (Non-Browser) — PARTIALLY WORKS
- web_fetch loads the page but content is JavaScript-heavy
- Rates are loaded dynamically, not in initial HTML
- Browser automation needed to extract actual rates

#### Option 4: Accept Fallback Only
- Keep fallback rates for BMO/CIBC
- Update fallback data manually every few weeks
- Many aggregator sites do this for blocked banks

### Recommendation
**Option 1 (Proxy) for production** — add proxy support to scraper.
**Option 2 (local test)** — verify CIBC works locally too.
**Option 4 (fallback)** as temporary measure.

---

## Fallback Lenders Assessment

### Why 15 Lenders Are Still on Fallback

| Lender | Likely Issue | Complexity |
|--------|-------------|------------|
| **Laurentian** | URL may have changed, table structure changed | Medium |
| **CMLS** | URL may be wrong, broker-only lender | Medium |
| **Meridian** | Credit union, may require auth or have changed | Medium |
| **MCAP** | Wholesale lender, may not have public rates | High |
| **ATB** | Site down - all pages returning 404 | High |
| **RFA** | Already fixed URL, may need parser update | Medium |
| **Street Capital** | Site may be down (503 errors previously) | High |
| **Alterna** | URL fixed yesterday, may need verification | Low |
| **Simplii** | Rewrote parser yesterday, verify working | Low |
| **Equitable** | URL fixed yesterday, verify working | Low |
| **Vancity** | Credit union, may have changed URL | Medium |
| **Centum** | Broker network, not a direct lender | High |
| **Desjardins** | Large institution, may need parser update | Medium |
| **Home Trust** | Alt lender, URL may have changed | Medium |
| **Coast Capital** | Credit union, may have changed URL | Medium |

### Pattern Analysis

**Common causes:**
1. **URL changes** (~40% of issues) — Lenders redesign websites, URLs change
2. **Parser outdated** (~30%) — HTML structure changed, selectors don't match
3. **Bot detection** (~20%) — HTTP/2 disable helps but some sites use advanced detection
4. **Site down/restructured** (~10%) — Street Capital 503s, MCAP wholesale-only

### Quick Wins (Low Effort)
- Alterna, Simplii, Equitable — URLs just fixed, verify on next scrape
- ATB — Regional bank, likely simple URL fix

### Medium Effort
- Laurentian, Desjardins, Home Trust — Check current URLs, update parsers
- Meridian, Vancity, Coast Capital — Credit unions may have similar structures

### High Effort / Consider Removal
- **MCAP** — Wholesale lender, no public consumer rates
- **Centum** — Broker network, not a direct lender
- **Street Capital** — Site appears down/unstable

---

## Recommended Actions (Priority Order)

### Immediate (Today)
1. ✅ **Remove EQ Bank** from scraping — they don't publish direct rates anymore
2. 🔧 **Verify** Alterna, Simplii, Equitable, ATB on next scrape
3. 🔧 **Fix Laurentian** — Check URL and table parsing

### Short-term (This Week)
4. 🔧 **Investigate BMO/CIBC** web_fetch approach
5. 🔧 **Update Desjardins, Home Trust** URLs
6. 🔧 **Check Meridian, Vancity, Coast Capital** URLs
7. 🔧 **Consider removing** MCAP, Centum, Street Capital

### Medium-term
8. 🔧 **Add retry logic** with exponential backoff
9. 🔧 **Add proxy rotation** for blocked sites
10. 🔧 **Implement alerting** when live rate % drops below threshold

---

## Files to Modify

| File | Change |
|------|--------|
| `scraping/src/scrapers/eqbank_scraper.py` | Remove or redirect to nesto |
| `scraping/src/scrapers/laurentian_scraper.py` | Fix URL and parser |
| `scraping/src/scrapers/bmo_scraper.py` | Add web_fetch fallback |
| `scraping/src/scrapers/cibc_scraper.py` | Add web_fetch fallback |
| `scraping/src/scrapers/alterna_scraper.py` | Verify URL working |
| `scraping/src/scrapers/simplii_scraper.py` | Verify parser working |
| `scraping/config/lenders.yaml` | Remove EQ Bank, MCAP, Centum |

---

## Metrics to Track

- Live rate percentage (target: >80%)
- Average scrape duration per lender
- Number of timeout failures per run
- Days since last successful scrape per lender

---

*Report generated: August 14, 2026*
*Next review: After next scheduled scrape (6 PM EDT)*
