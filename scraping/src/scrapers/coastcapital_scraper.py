"""
Coast Capital Savings mortgage rate scraper.
Featured rates are published on /mortgages (and buying-your-next-home).
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


class CoastCapitalScraper:
    LENDER_SLUG = "coastcapital"
    LENDER_NAME = "Coast Capital Savings"
    RATE_URL = "https://www.coastcapitalsavings.com/mortgages/buying-your-next-home"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching Coast Capital Savings rate page...")
        for url in (self.RATE_URL, "https://www.coastcapitalsavings.com/mortgages"):
            rates = scrape_live_rates(
                url=url,
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                scraped_at=self.scraped_at,
                source="coastcapital_live_scrape",
                http_timeout=15.0,
                playwright_timeout_ms=20000,
            )
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Coast Capital")
                return rates
        logger.info("Using fallback rates from Coast Capital (2026-09-14)")
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        fallback_data = [
            {"term": 60, "type": RateType.FIXED, "rate": "4.06", "mortgage_type": "insured", "product": "5-Year Fixed High-Ratio", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.46", "mortgage_type": "uninsured", "product": "5-Year Fixed", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.81", "mortgage_type": "insured", "product": "5-Year Variable High-Ratio", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.96", "mortgage_type": "uninsured", "product": "5-Year Variable", "featured": True},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="coastcapital_fallback_2026-09-14",
            last_verified="2026-09-14",
        )


if __name__ == "__main__":
    scraper = CoastCapitalScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} Coast Capital rates")
    for r in rates:
        print(f"  {r.mortgage_type.value:10} {r.term_months//12}yr {r.rate_type.value:8} {r.rate}%")
