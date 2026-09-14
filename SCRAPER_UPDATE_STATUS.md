# Scraper Status — September 14, 2026

This replaces the April 2026 “100% complete” note. Live vs fallback changes with each twice-daily run.

## What works live (HTTP or Playwright from this environment)

| Lender | Notes |
|--------|--------|
| RBC, TD, Scotiabank, National Bank | Existing Playwright scrapers |
| nesto, Tangerine, Wealthsimple | Live |
| First National, Laurentian, Manulife, Butler, True North | Live |
| Alterna, Meridian, Desjardins, ATB | **Fixed 2026-09-14** — HTML tables + corrected URLs |

## BMO and CIBC

Public pages still expose rates, but they are JS-hydrated (CIBC RDS placeholders; BMO AEM). Navigation from GitHub Actions / Azure / this cloud environment **times out** (~15–45s). Residential crawlers (e.g. NerdWallet citing bmo.com, CIBC’s own rendered page) see current specials.

Scrapers now:

1. Try Playwright with a short timeout (no CSS blocking).
2. Try HTTP HTML.
3. **Fall back to dated, source-cited specials** so the banks appear in comparison data instead of vanishing with `success: true, rates_found: 0`.

A residential proxy would be required for reliable live BMO/CIBC (and Simplii RDS) from CI. That is out of scope for this change.

## Fallbacks refreshed 2026-09-14

| Lender | Source / caveat |
|--------|-----------------|
| BMO | NerdWallet table 2026-09-14 citing bmo.com specials |
| CIBC | Rendered cibc.com mortgage-rates page 2026-09-14 |
| Simplii | No new Simplii-branded mortgages since 2025-06-19; page shows CIBC specials |
| Alterna / Meridian / Desjardins / ATB | First-party HTML (also scraped live) |
| Vancity | Featured rates on `/borrow/mortgages` (Cloudflare on `/rates/mortgages`) |
| Coast Capital | Featured 5-year rates on buying-your-next-home |
| Equitable | `.ca` URL; JS-heavy. 5yr from Ratehub 2026-09-04; other terms Forbes 2026-08-05. **Removed stale 3.59% July curve.** |
| CMLS | JS widget; only Ratehub 5yr 4.54% (2026-09-04) kept — dropped unverified 3.84% curve |
| RFA | rfabank.com often 522 here; iShopRates 2026-07-06 |
| Home Trust | Page often times out; Accelerator posted rates from 2026-08-13 investigation |

## Intentionally empty (not shown as direct consumer rates)

| Lender | Why |
|--------|-----|
| EQ Bank | Mortgage marketplace redirects to nesto |
| MCAP | Wholesale / broker-only, no public consumer product rates |
| Street Capital | Site 503 / appears retired |
| Centum | Brokerage network, not a direct lender |

## Metadata / Last updated

`data/metadata.json` `last_updated` is now UTC with a `Z` suffix. The homepage formats it at static-export time (America/Toronto) so the live site no longer shows `Last updated: -` in the HTML.

## Remaining gaps

- BMO/CIBC/Simplii live scrape from CI needs a residential IP or an official rates API.
- CMLS, Equitable, RFA, Home Trust, Vancity, Coast Capital still often fallback-only from datacenter IPs.
- Aggregators (Ratehub, Rates.ca, WOWA, LowestRates) are not included in the display whitelist.
