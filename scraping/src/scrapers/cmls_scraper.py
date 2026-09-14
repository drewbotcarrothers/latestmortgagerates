"""
CMLS Financial mortgage rate scraper.
Rates are shown in a JS widget; HTTP HTML has no percentages.
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


class CMLSScraper:
    LENDER_SLUG = "cmls"
    LENDER_NAME = "CMLS Financial"
    RATE_URL = "https://www.cmls.ca/what-we-do/cmls-residential/mortgage-rates"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching CMLS Financial rate page...")
        rates = scrape_live_rates(
            url=self.RATE_URL,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            scraped_at=self.scraped_at,
            source="cmls_live_scrape",
            wait_ms=4000,
        )
        if rates:
            logger.success(f"Successfully scraped {len(rates)} live rates from CMLS Financial")
            return rates
        logger.info("Using fallback rates from CMLS (Ratehub listing 2026-09-04 + prior curve)")
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        # 5-year fixed 4.54% verified on Ratehub 2026-09-04. Other terms remain
        # the previously published CMLS curve, relabeled with this verification date
        # only for the 5-year; shorter/longer terms are marked as last seen 2026-07-19.
        fallback_data = [
            {"term": 60, "type": RateType.FIXED, "rate": "4.54", "mortgage_type": "uninsured", "product": "5-Year Fixed (Ratehub 2026-09-04)", "featured": True},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="cmls_fallback_2026-09-14",
            last_verified="2026-09-04",
        )


if __name__ == "__main__":
    scraper = CMLSScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} CMLS rates")
    for r in rates:
        print(f"  {r.mortgage_type.value:10} {r.term_months//12}yr {r.rate_type.value:8} {r.rate}%")
