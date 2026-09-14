"""
BMO mortgage rate scraper.

Live scrape is attempted first. BMO's public rate page is JS-rendered and
often times out from datacenter IPs (GitHub Actions / Azure). When live
extraction fails, we return special/posted rates verified from BMO's own
page via NerdWallet's BMO rate table (source: bmo.com), dated 2026-09-14.
"""

import re
from decimal import Decimal
from typing import List
from datetime import datetime, timezone
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType

try:
    from .rate_parse import extract_rates_from_html, fallback_rows_to_rates
    from .http_fetch import fetch_html
    from .proxy_config import log_proxy_status, playwright_proxy, proxy_enabled
except ImportError:
    from rate_parse import extract_rates_from_html, fallback_rows_to_rates
    from http_fetch import fetch_html
    from proxy_config import log_proxy_status, playwright_proxy, proxy_enabled


class BMOScraper:
    """Scraper for BMO mortgage rates."""

    LENDER_SLUG = "bmo"
    LENDER_NAME = "Bank of Montreal"
    RATE_URL = "https://www.bmo.com/en-ca/main/personal/mortgages/mortgage-rates/"
    NAV_TIMEOUT_MS = 15000

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching BMO rate page...")
        log_proxy_status("BMO")
        if not proxy_enabled():
            logger.warning(
                "BMO first-party page is unreachable from datacenter IPs "
                "(TCP never commits). Skipping live attempts until "
                "SCRAPER_PROXY_URL is set. Using dated fallback."
            )
            return self._get_fallback_rates()

        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from BMO")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")

        try:
            html = fetch_html(self.RATE_URL, timeout=20.0 if proxy_enabled() else 8.0)
            if html:
                rates = extract_rates_from_html(
                    html,
                    lender_slug=self.LENDER_SLUG,
                    lender_name=self.LENDER_NAME,
                    source_url=self.RATE_URL,
                    scraped_at=self.scraped_at,
                    source="bmo_live_scrape",
                    extraction_method="http_html",
                )
                rates = [r for r in rates if self._looks_like_mortgage_rate(r)]
                if rates:
                    logger.success(f"HTTP scrape found {len(rates)} BMO rates")
                    return rates
        except Exception as e:
            logger.warning(f"BMO HTTP scrape failed: {e}")

        logger.warning(
            "BMO live scrape blocked or empty (common from datacenter IPs). "
            "Using verified public special/posted rates from 2026-09-14."
        )
        return self._get_fallback_rates()

    def _looks_like_mortgage_rate(self, rate: RawRate) -> bool:
        if "RDS%" in (rate.raw_data or {}).get("context", ""):
            return False
        return Decimal("2.00") <= rate.rate <= Decimal("10.50")

    def _scrape_with_playwright(self) -> List[RawRate]:
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            logger.warning("Playwright not available")
            return []

        try:
            with sync_playwright() as p:
                launch_kwargs = {
                    "headless": True,
                    "args": ["--disable-http2", "--disable-quic", "--disable-blink-features=AutomationControlled"],
                }
                proxy = playwright_proxy()
                if proxy:
                    launch_kwargs["proxy"] = proxy
                timeout_ms = 45000 if proxy else self.NAV_TIMEOUT_MS
                browser = p.chromium.launch(**launch_kwargs)
                context = browser.new_context(
                    user_agent=(
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
                    ),
                    locale="en-CA",
                    timezone_id="America/Toronto",
                    geolocation={"latitude": 43.6532, "longitude": -79.3832},
                    permissions=["geolocation"],
                    extra_http_headers={"Accept-Language": "en-CA,en;q=0.9"},
                )
                page = context.new_page()
                page.set_default_navigation_timeout(timeout_ms)
                try:
                    page.goto(self.RATE_URL, wait_until="commit", timeout=timeout_ms)
                    try:
                        page.wait_for_function(
                            "() => /\\d+\\.\\d+\\s*%/.test(document.body.innerText)",
                            timeout=8000,
                        )
                    except Exception:
                        page.wait_for_timeout(2500)

                    html = page.content()
                    text = page.locator("body").inner_text()
                finally:
                    browser.close()

            combined = html + "\n" + text
            rates = extract_rates_from_html(
                combined,
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                source_url=self.RATE_URL,
                scraped_at=self.scraped_at,
                source="bmo_live_scrape",
                extraction_method="playwright",
            )
            # BMO specials often appear as "3 Year Fixed" + rate nearby rather than one line
            if not rates:
                rates = self._extract_special_blocks(text)
            return [r for r in rates if self._looks_like_mortgage_rate(r)]
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return []

    def _extract_special_blocks(self, page_text: str) -> List[RawRate]:
        rates: List[RawRate] = []
        pattern = re.compile(
            r"(\d+)\s*Year\s+(Smart\s+)?(Fixed|Variable)[^\n]{0,80}?(\d+\.\d+)\s*%",
            re.IGNORECASE,
        )
        for match in pattern.finditer(page_text):
            years = int(match.group(1))
            rate_type = RateType.VARIABLE if match.group(3).lower() == "variable" else RateType.FIXED
            rate = Decimal(match.group(4))
            context = match.group(0)
            mortgage_type = (
                MortgageType.INSURED
                if "insured" in context.lower() or "smart" in context.lower() and "default" in context.lower()
                else MortgageType.UNINSURED
            )
            rates.append(
                RawRate(
                    lender_slug=self.LENDER_SLUG,
                    lender_name=self.LENDER_NAME,
                    term_months=years * 12,
                    rate_type=rate_type,
                    mortgage_type=mortgage_type,
                    rate=rate,
                    source_url=self.RATE_URL,
                    scraped_at=self.scraped_at,
                    raw_data={"source": "bmo_live_scrape", "extraction_method": "special_block", "context": context[:180]},
                )
            )
        return rates

    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Special and closed posted rates published by BMO.

        Verified 2026-09-14 via NerdWallet's BMO table, which cites www.bmo.com
        as the source. Special/Smart rates are the advertised consumer rates.
        """
        fallback_data = [
            {"term": 36, "type": RateType.FIXED, "rate": "4.64", "mortgage_type": "uninsured", "product": "3-Year Fixed Special", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.74", "mortgage_type": "insured", "product": "5-Year Smart Fixed (Insured)", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.84", "mortgage_type": "uninsured", "product": "5-Year Smart Fixed (Uninsured)", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.10", "mortgage_type": "uninsured", "product": "5-Year Variable Special", "featured": True},
            {"term": 12, "type": RateType.FIXED, "rate": "5.49", "mortgage_type": "uninsured", "product": "1-Year Fixed Posted Closed"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.89", "mortgage_type": "uninsured", "product": "2-Year Fixed Posted Closed"},
            {"term": 36, "type": RateType.FIXED, "rate": "6.05", "mortgage_type": "uninsured", "product": "3-Year Fixed Posted Closed"},
            {"term": 48, "type": RateType.FIXED, "rate": "5.99", "mortgage_type": "uninsured", "product": "4-Year Fixed Posted Closed"},
            {"term": 60, "type": RateType.FIXED, "rate": "6.09", "mortgage_type": "uninsured", "product": "5-Year Fixed Posted Closed"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.45", "mortgage_type": "uninsured", "product": "5-Year Variable Posted Closed"},
            {"term": 84, "type": RateType.FIXED, "rate": "6.40", "mortgage_type": "uninsured", "product": "7-Year Fixed Posted Closed"},
            {"term": 120, "type": RateType.FIXED, "rate": "6.80", "mortgage_type": "uninsured", "product": "10-Year Fixed Posted Closed"},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="bmo_fallback_2026-09-14",
            last_verified="2026-09-14",
        )


if __name__ == "__main__":
    scraper = BMOScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from BMO:")
        print("-" * 60)
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months, x.rate_type.value)):
            years = r.term_months // 12
            src = (r.raw_data or {}).get("source")
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}%  ({src})")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
