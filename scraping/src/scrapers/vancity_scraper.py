"""
Vancity Credit Union mortgage rate scraper.
/rates/mortgages is Cloudflare-blocked; featured rates are on /borrow/mortgages.
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


class VancityScraper:
    LENDER_SLUG = "vancity"
    LENDER_NAME = "Vancity"
    RATE_URL = "https://www.vancity.com/borrow/mortgages"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching Vancity rate page...")
        for url in (self.RATE_URL, "https://www.vancity.com/rates/mortgages"):
            rates = scrape_live_rates(
                url=url,
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                scraped_at=self.scraped_at,
                source="vancity_live_scrape",
                http_timeout=12.0,
                playwright_timeout_ms=15000,
            )
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Vancity ({url})")
                return rates
        logger.info("Using fallback rates from Vancity (2026-09-14)")
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "4.15", "mortgage_type": "uninsured", "product": "1-Year Fixed"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.39", "mortgage_type": "uninsured", "product": "2-Year Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.44", "mortgage_type": "uninsured", "product": "3-Year Fixed Special", "featured": True},
            {"term": 36, "type": RateType.FIXED, "rate": "4.39", "mortgage_type": "insured", "product": "3-Year Fixed Insured", "featured": True},
            {"term": 48, "type": RateType.FIXED, "rate": "4.49", "mortgage_type": "uninsured", "product": "4-Year Fixed"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.54", "mortgage_type": "uninsured", "product": "5-Year Fixed", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.44", "mortgage_type": "insured", "product": "5-Year Fixed Insured", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.95", "mortgage_type": "uninsured", "product": "5-Year Variable", "featured": True},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="vancity_fallback_2026-09-14",
            last_verified="2026-09-14",
        )


if __name__ == "__main__":
    scraper = VancityScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} Vancity rates")
    for r in rates:
        print(f"  {r.mortgage_type.value:10} {r.term_months//12}yr {r.rate_type.value:8} {r.rate}%")
