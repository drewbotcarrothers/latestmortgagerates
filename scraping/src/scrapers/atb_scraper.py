"""
ATB Financial mortgage rate scraper.
Public rates moved to /resources/rates/mortgage-rates/.
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


class ATBScraper:
    LENDER_SLUG = "atb"
    LENDER_NAME = "ATB Financial"
    RATE_URL = "https://www.atb.com/resources/rates/mortgage-rates/"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching ATB Financial rate page...")
        rates = scrape_live_rates(
            url=self.RATE_URL,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            scraped_at=self.scraped_at,
            source="atb_live_scrape",
        )
        if rates:
            logger.success(f"Successfully scraped {len(rates)} live rates from ATB Financial")
            return rates
        logger.info("Using fallback rates from ATB Financial (2026-09-14)")
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "6.09", "mortgage_type": "uninsured", "product": "1-Year Closed Fixed"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.59", "mortgage_type": "uninsured", "product": "2-Year Closed Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.49", "mortgage_type": "uninsured", "product": "3-Year Conventional", "featured": True},
            {"term": 36, "type": RateType.FIXED, "rate": "4.39", "mortgage_type": "insured", "product": "3-Year High Ratio"},
            {"term": 48, "type": RateType.FIXED, "rate": "4.54", "mortgage_type": "uninsured", "product": "4-Year Conventional"},
            {"term": 48, "type": RateType.FIXED, "rate": "4.44", "mortgage_type": "insured", "product": "4-Year High Ratio"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.49", "mortgage_type": "uninsured", "product": "5-Year Rate First Conventional", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.29", "mortgage_type": "insured", "product": "5-Year Rate First High Ratio", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.80", "mortgage_type": "uninsured", "product": "5-Year Variable", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.65", "mortgage_type": "insured", "product": "5-Year Variable High Ratio", "featured": True},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="atb_fallback_2026-09-14",
            last_verified="2026-09-14",
        )


if __name__ == "__main__":
    scraper = ATBScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} ATB rates")
    for r in rates:
        print(f"  {r.mortgage_type.value:10} {r.term_months//12}yr {r.rate_type.value:8} {r.rate}% {(r.raw_data or {}).get('source')}")
