"""
Simplii Financial mortgage rate scraper.

As of 2025-06-19 Simplii no longer originates new Simplii-branded mortgages.
The public rates page now shows CIBC special offers via the same RDS widgets
as CIBC. We still scrape that page; fallbacks are CIBC specials advertised there.
"""

from typing import List
from datetime import datetime, timezone
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType

try:
    from .live_scrape import scrape_live_rates
    from .rate_parse import fallback_rows_to_rates
except ImportError:
    from live_scrape import scrape_live_rates
    from rate_parse import fallback_rows_to_rates


class SimpliiScraper:
    LENDER_SLUG = "simplii"
    LENDER_NAME = "Simplii Financial"
    RATE_URL = "https://www.simplii.com/en/rates/mortgage-rates.html"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching Simplii rate page (CIBC specials)...")
        rates = scrape_live_rates(
            url=self.RATE_URL,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            scraped_at=self.scraped_at,
            source="simplii_live_scrape",
            playwright_timeout_ms=15000,
        )
        rates = [r for r in rates if "RDS%" not in (r.raw_data or {}).get("context", "")]
        if rates:
            logger.success(f"Successfully scraped {len(rates)} live rates from Simplii/CIBC")
            return rates
        logger.info("Using CIBC specials advertised on Simplii (2026-09-14)")
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        # Simplii page advertises CIBC special mortgage rates for new originations.
        fallback_data = [
            {"term": 24, "type": RateType.FIXED, "rate": "4.49", "mortgage_type": "uninsured", "product": "2-Year Fixed (CIBC special via Simplii)", "featured": True},
            {"term": 36, "type": RateType.FIXED, "rate": "4.74", "mortgage_type": "uninsured", "product": "3-Year Fixed (CIBC special via Simplii)", "featured": True},
            {"term": 48, "type": RateType.FIXED, "rate": "4.89", "mortgage_type": "uninsured", "product": "4-Year Fixed (CIBC special via Simplii)"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.94", "mortgage_type": "uninsured", "product": "5-Year Fixed (CIBC special via Simplii)", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.59", "mortgage_type": "insured", "product": "5-Year Fixed High-Ratio (CIBC special)"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.10", "mortgage_type": "uninsured", "product": "5-Year Variable (CIBC special via Simplii)", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.95", "mortgage_type": "insured", "product": "5-Year Variable High-Ratio (CIBC special)"},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="simplii_fallback_2026-09-14",
            last_verified="2026-09-14",
        )


if __name__ == "__main__":
    scraper = SimpliiScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} Simplii rates")
    for r in rates:
        print(f"  {r.mortgage_type.value:10} {r.term_months//12}yr {r.rate_type.value:8} {r.rate}% {(r.raw_data or {}).get('source')}")
