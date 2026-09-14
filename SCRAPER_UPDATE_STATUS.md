# Scraper Status — September 14, 2026

Live vs fallback still changes with each twice-daily run. This note covers **Big 5 live accuracy** after the first-party API work.

## Big 5 (this task)

| Bank | Live without proxy? | Source | Fallback |
|------|---------------------|--------|----------|
| **CIBC** | **Yes** | First-party RDS API `cibconline.cibc.com/ebm-pno/api/v1/json/productRatesLegacy` (FRCM, MICRO, 5YRVARCLO, MICROVAR). Same feed the public page hydrates. | Dated specials `cibc_fallback_2026-09-14` only if API + page fail |
| **TD** | **Yes** | First-party `POST https://psservice.td.com/ca/en/carate/getRates` (`ratesType=resl`). Same `ratesAPIInfo` the td.com page uses. | `td_fallback_2026-07-19` only if API + Playwright fail |
| **Scotiabank** | **Yes** | First-party `dmtsms.scotiabank.com/api/rates/daily/nonspecialmortgage` + `varmortgage` (bns.dynamic-tokens). | `scotiabank_fallback_2026-07-19` only if API + Playwright fail |
| **RBC** | **Yes** | Public HTML already contains special/posted rates (no JS hydration required). HTTP first, Playwright backup. | `rbc_fallback_2026-07-19` only if HTML + Playwright fail |
| **BMO** | **No — proxy required** | Public AEM page. From this cloud VM and GitHub Actions, TCP to `bmo.com` never commits (0 network responses, 15–45s timeout). No public machine-readable rates API found. Playwright/HTTP use `SCRAPER_PROXY_URL` when set. | Dated specials `bmo_fallback_2026-09-14` (NerdWallet table citing bmo.com) |

Live rates are tagged `*_live_scrape` with a fresh `scraped_at`. Fallbacks stay clearly dated (`last_verified`).

## Proxy (GitHub Actions)

See `WORKFLOW_SECRETS.md` for exact secret names. Shared helper: `scraping/src/scrapers/proxy_config.py` (httpx + Playwright). The scrape workflow already forwards the secrets; nothing else is required except setting a value.

Banks that are live **without** a proxy: CIBC, TD, Scotiabank, RBC.
Bank that needs a proxy for live first-party rates: **BMO**.

## What works live (other lenders)

| Lender | Notes |
|--------|--------|
| National Bank | Existing Playwright scraper |
| nesto, Tangerine, Wealthsimple | Live |
| First National, Laurentian, Manulife, Butler, True North | Live |
| Alterna, Meridian, Desjardins, ATB | HTTP tables + corrected URLs (2026-09-14) |

## Fallbacks still in use (non–Big 5)

| Lender | Source / caveat |
|--------|-----------------|
| Simplii | No new Simplii-branded mortgages since 2025-06-19; page shows CIBC specials |
| Vancity | Featured rates on `/borrow/mortgages` (Cloudflare on `/rates/mortgages`) |
| Coast Capital | Featured 5-year rates on buying-your-next-home |
| Equitable | JS-heavy. 5yr from Ratehub 2026-09-04; other terms Forbes 2026-08-05 |
| CMLS | JS widget; Ratehub 5yr 4.54% (2026-09-04) |
| RFA | rfabank.com often 522 here; iShopRates 2026-07-06 |
| Home Trust | Page often times out; Accelerator posted rates from 2026-08-13 |

## Intentionally empty

| Lender | Why |
|--------|-----|
| EQ Bank | Mortgage marketplace redirects to nesto |
| MCAP | Wholesale / broker-only, no public consumer product rates |
| Street Capital | Site 503 / appears retired |
| Centum | Brokerage network, not a direct lender |

## Remaining gaps

- **BMO live from CI** needs `SCRAPER_PROXY_URL` (or a provider alias). No official public rates API was found; the HTML page is the only first-party source and it is IP-blocked from datacenters.
- CIBC’s HTML page is still RDS-token-only from datacenter IPs; the **API** is the live path (verified from this environment).
- Simplii RDS page is out of scope for this Big 5 change.
- CMLS, Equitable, RFA, Home Trust, Vancity, Coast Capital still often fallback-only from datacenter IPs.
- Aggregators (Ratehub, Rates.ca, WOWA, LowestRates) are not in the display whitelist.
