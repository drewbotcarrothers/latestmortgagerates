"""
Meridian Credit Union mortgage rate scraper.
HTTP-first: specials and posted rates are in HTML tables.
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


class MeridianScraper:
    LENDER_SLUG = "meridian"
    LENDER_NAME = "Meridian Credit Union"
    RATE_URL = "https://www.meridiancu.ca/personal/rates-and-fees/mortgage-and-borrowing-rates"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching Meridian rate page...")
        rates = scrape_live_rates(
            url=self.RATE_URL,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            scraped_at=self.scraped_at,
            source="meridian_live_scrape",
        )
        if rates:
            logger.success(f"Successfully scraped {len(rates)} live rates from Meridian")
            return rates
        logger.info("Using fallback rates from Meridian (2026-09-14)")
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        fallback_data = [
            {"term": 36, "type": RateType.FIXED, "rate": "4.34", "mortgage_type": "uninsured", "product": "3-Year Closed Special", "featured": True},
            {"term": 36, "type": RateType.FIXED, "rate": "4.09", "mortgage_type": "insured", "product": "3-Year Closed High Ratio Special", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.64", "mortgage_type": "uninsured", "product": "5-Year Closed Special", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.29", "mortgage_type": "insured", "product": "5-Year Closed High Ratio Special", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.64", "mortgage_type": "uninsured", "product": "5-Year Closed Variable", "featured": True, "spread": "Prime - 0.81%"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.44", "mortgage_type": "insured", "product": "5-Year Closed Variable High Ratio", "featured": True, "spread": "Prime - 1.01%"},
            {"term": 12, "type": RateType.FIXED, "rate": "6.09", "mortgage_type": "uninsured", "product": "1-Year Closed Posted"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.74", "mortgage_type": "uninsured", "product": "2-Year Closed Posted"},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="meridian_fallback_2026-09-14",
            last_verified="2026-09-14",
        )


if __name__ == "__main__":
    scraper = MeridianScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} Meridian rates")
    for r in rates:
        print(f"  {r.mortgage_type.value:10} {r.term_months//12}yr {r.rate_type.value:8} {r.rate}% {(r.raw_data or {}).get('source')}")
