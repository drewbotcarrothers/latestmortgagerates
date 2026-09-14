"""
Desjardins mortgage rate scraper.
Public rates moved to /en/mortgage/mortgage-rates.html (old /mortgages/ URL is 410).
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


class DesjardinsScraper:
    LENDER_SLUG = "desjardins"
    LENDER_NAME = "Desjardins"
    RATE_URL = "https://www.desjardins.com/en/mortgage/mortgage-rates.html"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching Desjardins rate page...")
        rates = scrape_live_rates(
            url=self.RATE_URL,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            scraped_at=self.scraped_at,
            source="desjardins_live_scrape",
        )
        if rates:
            logger.success(f"Successfully scraped {len(rates)} live rates from Desjardins")
            return rates
        logger.info("Using fallback rates from Desjardins (2026-09-14)")
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "5.49", "mortgage_type": "uninsured", "product": "1-Year Closed Fixed"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.59", "mortgage_type": "uninsured", "product": "2-Year Closed Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "6.04", "mortgage_type": "uninsured", "product": "3-Year Closed Fixed"},
            {"term": 48, "type": RateType.FIXED, "rate": "4.59", "mortgage_type": "uninsured", "product": "4-Year Closed Special", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.69", "mortgage_type": "uninsured", "product": "5-Year Closed Special", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.10", "mortgage_type": "uninsured", "product": "5-Year Reduced Variable Special", "featured": True, "spread": "Prime - 0.70%"},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="desjardins_fallback_2026-09-14",
            last_verified="2026-09-14",
        )


if __name__ == "__main__":
    scraper = DesjardinsScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} Desjardins rates")
    for r in rates:
        print(f"  {r.mortgage_type.value:10} {r.term_months//12}yr {r.rate_type.value:8} {r.rate}% {(r.raw_data or {}).get('source')}")
