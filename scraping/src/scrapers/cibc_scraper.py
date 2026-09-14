"""
CIBC mortgage rate scraper.

CIBC publishes rates via RDS placeholders that JavaScript hydrates. Live
Playwright often times out from datacenter IPs. HTTP HTML still contains
RDS tokens only. When live extraction fails, we return special/posted rates
copied from CIBC's public mortgage-rates page (rendered snapshot 2026-09-14).
"""

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
except ImportError:
    from rate_parse import extract_rates_from_html, fallback_rows_to_rates
    from http_fetch import fetch_html


class CIBCScraper:
    """Scraper for CIBC mortgage rates."""

    LENDER_SLUG = "cibc"
    LENDER_NAME = "Canadian Imperial Bank of Commerce"
    RATE_URL = "https://www.cibc.com/en/interest-rates/mortgage-rates.html"
    NAV_TIMEOUT_MS = 15000

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching CIBC rate page...")

        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from CIBC")
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
            "CIBC live scrape did not hydrate RDS rate placeholders "
            "(common from datacenter IPs). Using verified public specials from 2026-09-14."
        )
        return self._get_fallback_rates()

    def _scrape_with_playwright(self) -> List[RawRate]:
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            logger.warning("Playwright not available")
            return []

        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=["--disable-http2", "--disable-quic", "--disable-blink-features=AutomationControlled"],
                )
                context = browser.new_context(
                    user_agent=(
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
                    ),
                    locale="en-CA",
                    extra_http_headers={"Accept-Language": "en-CA,en;q=0.9"},
                )
                page = context.new_page()
                page.set_default_navigation_timeout(self.NAV_TIMEOUT_MS)
                try:
                    page.goto(self.RATE_URL, wait_until="commit", timeout=self.NAV_TIMEOUT_MS)
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

            if "RDS%" in text and not any(ch.isdigit() and "%" in text for ch in "%"):
                return []

            rates = extract_rates_from_html(
                html + "\n" + text,
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                source_url=self.RATE_URL,
                scraped_at=self.scraped_at,
                source="cibc_live_scrape",
                extraction_method="playwright",
            )
            # Prefer special-offer values: drop leftovers that still look like RDS noise
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
        (2026-09-14). Special offers are the consumer-facing discounted rates.
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
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}%  ({src})")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
