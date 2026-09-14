"""
Equitable Bank mortgage rate scraper.
Correct public domain is equitablebank.ca (equitablebank.com cert is expired).
Rates are JS-rendered; live scrape is attempted, then dated fallbacks.
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


class EquitableBankScraper:
    LENDER_SLUG = "equitable"
    LENDER_NAME = "Equitable Bank"
    RATE_URL = "https://www.equitablebank.ca/mortgages/current-rates"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching Equitable Bank rate page...")
        rates = scrape_live_rates(
            url=self.RATE_URL,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            scraped_at=self.scraped_at,
            source="equitable_live_scrape",
            wait_ms=5000,
        )
        if rates:
            logger.success(f"Successfully scraped {len(rates)} live rates from Equitable Bank")
            return rates
        logger.info("Using fallback Equitable rates (Ratehub 5yr 2026-09-04 + Forbes Aug 2026)")
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "5.19", "mortgage_type": "uninsured", "product": "1-Year Fixed Standard (Forbes 2026-08-05)"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.14", "mortgage_type": "uninsured", "product": "2-Year Fixed Standard (Forbes 2026-08-05)"},
            {"term": 36, "type": RateType.FIXED, "rate": "5.24", "mortgage_type": "uninsured", "product": "3-Year Fixed Standard (Forbes 2026-08-05)"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.54", "mortgage_type": "uninsured", "product": "5-Year Fixed (Ratehub 2026-09-04)", "featured": True},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="equitable_fallback_2026-09-14",
            last_verified="2026-09-04",
        )


if __name__ == "__main__":
    scraper = EquitableBankScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} Equitable rates")
    for r in rates:
        print(f"  {r.mortgage_type.value:10} {r.term_months//12}yr {r.rate_type.value:8} {r.rate}%")
