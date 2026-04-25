# Scraper Update Project - Status Report
**Date:** April 25, 2026
**Project:** Latest Mortgage Rates (latestmortgagerates.ca)

## What Was Completed Today

### 1. True North Mortgage (Fully Updated)
- **Approach:** Playwright live scraping + province-aware rates
- **Status:** ✅ Complete
- **Live rates verified:** 16 rates (Ontario + Alberta)
- **Key finding:** 5Y Fixed differs by province (ON 4.09% vs AB 4.14%)

### 2. RBC (Fully Updated)
- **Approach:** Playwright live scraping + verified fallback
- **Status:** ✅ Complete
- **Live rates verified:** 5 rates (Apr 25, 2026)
- **Key rates:** 5Y Fixed 4.59%, Variable 3.95%, High Ratio 4.29%

### 3. TD Bank (Fully Updated)
- **Approach:** Playwright live scraping + comprehensive fallback
- **Status:** ✅ Complete
- **Live rates verified:** 14 rates (Apr 25, 2026)
- **Key rates:** 5Y Fixed 4.94%, Variable 4.29%, Prime 4.60%

### 4. Monitoring System (New)
- **File:** `scraping/rate_monitor.py`
- **Status:** ✅ Complete
- **Features:**
  - Checks freshness of all 37 scrapers
  - Categorizes by priority (Big 6, Monoline, Regional)
  - Alerts on stale data (>7 days)
  - Generates actionable reports

## What Still Needs Updating

### Priority 1: Big 6 Banks (3 remaining)
| Lender | Status | Notes |
|--------|--------|-------|
| **BMO** | ❌ Needs update | Current data from Mar 1, 2026 |
| **Scotiabank** | ❌ Needs update | Current data from Mar 1, 2026 |
| **CIBC** | ❌ Needs update | Current data from Mar 1, 2026 |

### Priority 2: Major Monolines (13 total)
| Lender | Status | Notes |
|--------|--------|-------|
| First National | ❌ Needs update | Current data from Mar 1, 2026 |
| MCAP | ❌ Needs update | Current data from Mar 1, 2026 |
| Manulife | ❌ Needs update | Current data from Mar 1, 2026 |
| Laurentian | ❌ Needs update | Current data from Mar 1, 2026 |
| RFA | ❌ Needs update | Current data from Mar 1, 2026 |
| CMLS | ❌ Needs update | Current data from Mar 1, 2026 |
| Merix | ❌ Needs update | Current data from Mar 1, 2026 |
| Lendwise | ❌ Needs update | Current data from Mar 1, 2026 |
| Butler Mortgage | ❌ Needs update | Current data from Mar 1, 2026 |
| IntelliMortgage | ❌ Needs update | Current data from Mar 1, 2026 |
| Street Capital | ❌ Needs update | Current data from Mar 1, 2026 |
| Centum | ❌ Needs update | Current data from Mar 1, 2026 |

### Priority 3: Digital Banks (6 total)
| Lender | Status | Notes |
|--------|--------|-------|
| nesto | ❌ Needs update | Current data from Mar 1, 2026 |
| EQ Bank | ❌ Needs update | Current data from Mar 1, 2026 |
| Simplii | ❌ Needs update | Current data from Mar 1, 2026 |
| Tangerine | ❌ Needs update | Current data from Mar 1, 2026 |
| Motive | ❌ Needs update | Current data from Mar 1, 2026 |
| Alterna | ❌ Needs update | Current data from Mar 1, 2026 |

### Priority 4: Regional/Credit Unions (9 total)
| Lender | Status | Notes |
|--------|--------|-------|
| Meridian | ❌ Needs update | Current data from Mar 1, 2026 |
| Desjardins | ❌ Needs update | Current data from Mar 1, 2026 |
| Vancity | ❌ Needs update | Current data from Mar 1, 2026 |
| Coast Capital | ❌ Needs update | Current data from Mar 1, 2026 |
| ATB | ❌ Needs update | Current data from Mar 1, 2026 |
| CWB | ❌ Needs update | Current data from Mar 1, 2026 |
| Equitable Bank | ❌ Needs update | Current data from Mar 1, 2026 |
| Home Trust | ❌ Needs update | Current data from Mar 1, 2026 |
| Wealthsimple | ❌ Needs update | Currently failing (timeout) |

## How to Check Freshness

Run the monitoring system:
```bash
cd scraping
python rate_monitor.py
```

This will show:
- Which scrapers are current (≤7 days)
- Which are stale (8-14 days)
- Which need verification (>14 days)
- Which have Playwright vs fallback-only

## How to Update a Scraper

### Option A: Playwright Live Scraping (Recommended)
1. Check if lender's site works with Playwright
2. Add `_scrape_with_playwright()` method
3. Extract rates from rendered page
4. Fall back to static data if scraping fails

### Option B: Manual Rate Update
1. Visit lender's rate page in browser
2. Copy current rates
3. Update `_get_fallback_rates()` method
4. Set `last_verified` date in raw_data

## Next Steps

1. **Immediate (This Week):**
   - Update BMO, Scotiabank, CIBC scrapers
   - These are the highest priority remaining

2. **Short Term (Next 2 Weeks):**
   - Update top 5 monoline lenders (First National, MCAP, Manulife, etc.)
   - Update digital banks (nesto, EQ Bank, Tangerine)

3. **Ongoing:**
   - Run `rate_monitor.py` weekly
   - Set up automated alerts for stale data
   - Re-verify rates monthly even if scrapers work

## Files Updated Today

- `scraping/src/scrapers/truenorth_scraper.py` - Complete rewrite
- `scraping/src/scrapers/rbc_scraper.py` - Playwright + updated fallback
- `scraping/src/scrapers/td_scraper.py` - Playwright + updated fallback
- `scraping/rate_monitor.py` - New monitoring system

## Current Best Rates (Verified Apr 25, 2026)

### Big 6 Banks
| Lender | 5Y Fixed | 5Y Variable | Source |
|--------|----------|-------------|--------|
| RBC | 4.59% | 3.95% | Live scraped |
| TD | 4.94% | 4.29% | Live scraped |
| BMO | 4.64% | 4.15% | Mar 1 data (stale) |
| Scotiabank | 6.09% | 4.90% | Mar 1 data (stale) |
| CIBC | 4.54% | 4.15% | Mar 1 data (stale) |
| National Bank | ??? | ??? | 404 error |

### Top Monolines
| Lender | 5Y Fixed | 5Y Variable | Source |
|--------|----------|-------------|--------|
| True North | 4.09% | 3.49% | Live scraped |
| First National | 4.24% | 3.85% | Mar 1 data (stale) |
| MCAP | 4.39% | 4.15% | Mar 1 data (stale) |

---

**Next action needed:** Update BMO, Scotiabank, CIBC scrapers with current live rates.

Would you like me to continue with BMO next, or would you prefer a different approach?