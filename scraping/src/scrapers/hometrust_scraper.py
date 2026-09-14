"""
Home Trust mortgage rate scraper.
Public rates page is at /mortgages/rates/ and is often bot-slow.
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


class HomeTrustScraper:
    LENDER_SLUG = "hometrust"
    LENDER_NAME = "Home Trust"
    RATE_URL = "https://www.hometrust.ca/mortgages/rates/"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching Home Trust rate page...")
        rates = scrape_live_rates(
            url=self.RATE_URL,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            scraped_at=self.scraped_at,
            source="hometrust_live_scrape",
            http_timeout=15.0,
            playwright_timeout_ms=20000,
            wait_ms=4000,
        )
        if rates:
            logger.success(f"Successfully scraped {len(rates)} live rates from Home Trust")
            return rates
        logger.info("Using fallback Home Trust Accelerator rates from Aug 2026 investigation")
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        # First-party posted Accelerator (insured) rates captured 2026-08-13.
        # Classic/uninsured terms were not re-verified on 2026-09-14 (page timeout).
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "4.99", "mortgage_type": "insured", "product": "Accelerator 1-Year Fixed"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.44", "mortgage_type": "insured", "product": "Accelerator 2-Year Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.34", "mortgage_type": "insured", "product": "Accelerator 3-Year Fixed", "featured": True},
            {"term": 48, "type": RateType.FIXED, "rate": "4.39", "mortgage_type": "insured", "product": "Accelerator 4-Year Fixed"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.49", "mortgage_type": "insured", "product": "Accelerator 5-Year Fixed", "featured": True},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="hometrust_fallback_2026-09-14",
            last_verified="2026-08-13",
        )


if __name__ == "__main__":
    scraper = HomeTrustScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} Home Trust rates")
    for r in rates:
        print(f"  {r.mortgage_type.value:10} {r.term_months//12}yr {r.rate_type.value:8} {r.rate}%")
