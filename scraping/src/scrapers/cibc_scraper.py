"""
CIBC mortgage rate scraper.

Primary source: CIBC's public RDS productRatesLegacy endpoint (same feed
the cibc.com mortgage-rates page hydrates). Works from datacenter IPs.

Fallbacks: Playwright/HTTP on the public page, then dated specials copied
from the rendered cibc.com page (2026-09-14).
"""

import re
from decimal import Decimal, InvalidOperation
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timezone
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType

try:
    from .rate_parse import extract_rates_from_html, fallback_rows_to_rates
    from .http_fetch import fetch_html, fetch_json
    from .proxy_config import playwright_proxy, log_proxy_status, proxy_enabled
except ImportError:
    from rate_parse import extract_rates_from_html, fallback_rows_to_rates
    from http_fetch import fetch_html, fetch_json
    from proxy_config import playwright_proxy, log_proxy_status, proxy_enabled


RATES_API = (
    "https://www.cibconline.cibc.com/ebm-pno/api/v1/json/productRatesLegacy"
    "?lobId=5&sourceProductCode={code}%2C"
)

# Public page mapping (rates-table.html):
#   category 1 = posted, 18 = special offer, 2 = APR
# Product codes match RDS%rate[5].<CODE>.Published(...) tokens.
PRODUCTS = {
    "FRCM": {"rate_type": RateType.FIXED, "mortgage_type": MortgageType.UNINSURED, "label": "Fixed closed"},
    "MICRO": {"rate_type": RateType.FIXED, "mortgage_type": MortgageType.INSURED, "label": "High-ratio fixed"},
    "5YRVARCLO": {"rate_type": RateType.VARIABLE, "mortgage_type": MortgageType.UNINSURED, "label": "Variable closed"},
    "MICROVAR": {"rate_type": RateType.VARIABLE, "mortgage_type": MortgageType.INSURED, "label": "High-ratio variable"},
}

CAT_POSTED = 1
CAT_SPECIAL = 18
ROW_RE = re.compile(
    r"\['([^']+)',\s*[^,]+,\s*(\d+),\s*'([^']+)',\s*'Published',\s*'([^']*)'",
)
TERM_RE = re.compile(r"^(\d+)_null_null_(Year|Years|Months)_T$", re.I)


def _parse_cibc_rate(value: str) -> Optional[Decimal]:
    try:
        rate = Decimal(value)
    except (InvalidOperation, ValueError):
        return None
    if rate <= Decimal("1.50") or rate > Decimal("12.00"):
        return None
    return rate


def _term_months(term_key: str) -> Optional[int]:
    match = TERM_RE.match(term_key)
    if not match:
        return None
    amount = int(match.group(1))
    unit = match.group(2).lower()
    if unit.startswith("month"):
        return amount if amount in (6, 12, 18, 24) else None
    if 1 <= amount <= 10:
        return amount * 12
    return None


class CIBCScraper:
    """Scraper for CIBC mortgage rates."""

    LENDER_SLUG = "cibc"
    LENDER_NAME = "Canadian Imperial Bank of Commerce"
    RATE_URL = "https://www.cibc.com/en/interest-rates/mortgage-rates.html"
    NAV_TIMEOUT_MS = 15000

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching CIBC rates...")
        log_proxy_status("CIBC")

        try:
            rates = self._scrape_from_api()
            if rates:
                logger.success(f"CIBC first-party API returned {len(rates)} live rates")
                return rates
        except Exception as e:
            logger.warning(f"CIBC API scrape failed: {e}")

        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from CIBC page")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")

        try:
            html = fetch_html(self.RATE_URL, timeout=12.0)
            if html and "RDS%" not in html:
                rates = extract_rates_from_html(
                    html,
                    lender_slug=self.LENDER_SLUG,
                    lender_name=self.LENDER_NAME,
                    source_url=self.RATE_URL,
                    scraped_at=self.scraped_at,
                    source="cibc_live_scrape",
                    extraction_method="http_html",
                )
                rates = [r for r in rates if Decimal("2.00") <= r.rate <= Decimal("10.50")]
                if rates:
                    logger.success(f"HTTP scrape found {len(rates)} CIBC rates")
                    return rates
        except Exception as e:
            logger.warning(f"CIBC HTTP scrape failed: {e}")

        logger.warning(
            "CIBC live scrape failed. Using verified public specials from 2026-09-14."
        )
        return self._get_fallback_rates()

    def _scrape_from_api(self) -> List[RawRate]:
        grouped: Dict[Tuple[str, str, int], Dict[int, Tuple[Decimal, str]]] = {}
        for code, meta in PRODUCTS.items():
            payload = fetch_json(
                RATES_API.format(code=code),
                timeout=15.0,
                headers={
                    "Accept": "text/javascript,application/json,*/*;q=0.8",
                    "Referer": "https://www.cibc.com/en/interest-rates/mortgage-rates.html",
                    "Origin": "https://www.cibc.com",
                },
            )
            text = payload if isinstance(payload, str) else ("" if payload is None else str(payload))
            if not text:
                logger.warning(f"CIBC API empty for {code}")
                continue
            rows = 0
            for match in ROW_RE.finditer(text):
                term_key, category_s, rate_s, published = match.groups()
                category = int(category_s)
                if category not in (CAT_POSTED, CAT_SPECIAL):
                    continue
                term_months = _term_months(term_key)
                rate = _parse_cibc_rate(rate_s)
                if not term_months or rate is None:
                    continue
                key = (code, term_key, term_months)
                grouped.setdefault(key, {})[category] = (rate, published)
                rows += 1
            logger.info(f"CIBC API {code}: {rows} posted/special rows")

        rates: List[RawRate] = []
        seen = set()
        for (code, term_key, term_months), cats in grouped.items():
            meta = PRODUCTS[code]
            special = cats.get(CAT_SPECIAL)
            posted = cats.get(CAT_POSTED)
            chosen = special or posted
            if not chosen:
                continue
            rate, published = chosen
            posted_rate = posted[0] if posted else None
            section = "special" if special else "posted"
            dedupe = (term_months, meta["rate_type"], meta["mortgage_type"], str(rate), section)
            if dedupe in seen:
                continue
            seen.add(dedupe)
            rates.append(
                RawRate(
                    lender_slug=self.LENDER_SLUG,
                    lender_name=self.LENDER_NAME,
                    term_months=term_months,
                    rate_type=meta["rate_type"],
                    mortgage_type=meta["mortgage_type"],
                    rate=rate,
                    posted_rate=posted_rate,
                    source_url=self.RATE_URL,
                    scraped_at=self.scraped_at,
                    raw_data={
                        "source": "cibc_live_scrape",
                        "extraction_method": "product_rates_api",
                        "product_code": code,
                        "term_key": term_key,
                        "section": section,
                        "product": meta["label"],
                        "published_at": published,
                        "featured": term_months in (36, 60) and section == "special",
                    },
                )
            )
        return rates

    def _scrape_with_playwright(self) -> List[RawRate]:
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            logger.warning("Playwright not available")
            return []

        try:
            launch_kwargs = {
                "headless": True,
                "args": ["--disable-http2", "--disable-quic", "--disable-blink-features=AutomationControlled"],
            }
            proxy = playwright_proxy()
            if proxy:
                launch_kwargs["proxy"] = proxy
            timeout_ms = 25000 if proxy_enabled() else self.NAV_TIMEOUT_MS
            with sync_playwright() as p:
                browser = p.chromium.launch(**launch_kwargs)
                context = browser.new_context(
                    user_agent=(
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
                    ),
                    locale="en-CA",
                    extra_http_headers={"Accept-Language": "en-CA,en;q=0.9"},
                )
                page = context.new_page()
                page.set_default_navigation_timeout(timeout_ms)
                try:
                    page.goto(self.RATE_URL, wait_until="commit", timeout=timeout_ms)
                    try:
                        page.wait_for_function(
                            "() => !document.body.innerText.includes('RDS%') && /\\d+\\.\\d+\\s*%/.test(document.body.innerText)",
                            timeout=8000,
                        )
                    except Exception:
                        page.wait_for_timeout(2500)
                    html = page.content()
                    text = page.locator("body").inner_text()
                finally:
                    browser.close()

            rates = extract_rates_from_html(
                html + "\n" + text,
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                source_url=self.RATE_URL,
                scraped_at=self.scraped_at,
                source="cibc_live_scrape",
                extraction_method="playwright",
            )
            cleaned = []
            seen = set()
            for rate in rates:
                context = (rate.raw_data or {}).get("context", "")
                if "RDS%" in context:
                    continue
                if not (Decimal("2.00") <= rate.rate <= Decimal("10.50")):
                    continue
                key = (rate.term_months, rate.rate_type, rate.mortgage_type, str(rate.rate))
                if key in seen:
                    continue
                seen.add(key)
                cleaned.append(rate)
            return cleaned
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return []

    def _get_fallback_rates(self) -> List[RawRate]:
        """
        CIBC advertised special offers and high-ratio specials.

        Copied from the public CIBC mortgage-rates page after JS hydration
        (2026-09-14). Used only when the first-party API and page scrape fail.
        """
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "4.74", "mortgage_type": "uninsured", "product": "1-Year Fixed Special"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.49", "mortgage_type": "uninsured", "product": "2-Year Fixed Special", "featured": True},
            {"term": 36, "type": RateType.FIXED, "rate": "4.74", "mortgage_type": "uninsured", "product": "3-Year Fixed Special", "featured": True},
            {"term": 36, "type": RateType.VARIABLE, "rate": "4.05", "mortgage_type": "uninsured", "product": "3-Year Variable Special", "featured": True},
            {"term": 48, "type": RateType.FIXED, "rate": "4.89", "mortgage_type": "uninsured", "product": "4-Year Fixed Special"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.94", "mortgage_type": "uninsured", "product": "5-Year Fixed Special", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.59", "mortgage_type": "insured", "product": "5-Year Fixed High-Ratio Special", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.10", "mortgage_type": "uninsured", "product": "5-Year Variable Special", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.95", "mortgage_type": "insured", "product": "5-Year Variable High-Ratio Special", "featured": True},
            {"term": 84, "type": RateType.FIXED, "rate": "5.11", "mortgage_type": "uninsured", "product": "7-Year Fixed Special"},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="cibc_fallback_2026-09-14",
            last_verified="2026-09-14",
        )


if __name__ == "__main__":
    scraper = CIBCScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from CIBC:")
        print("-" * 60)
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months, x.rate_type.value)):
            years = r.term_months // 12
            src = (r.raw_data or {}).get("source")
            method = (r.raw_data or {}).get("extraction_method")
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}%  ({src}/{method})")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
