"""
Alterna Bank mortgage rate scraper.
HTTP-first: the public rates page publishes HTML tables.
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


class AlternaScraper:
    LENDER_SLUG = "alterna"
    LENDER_NAME = "Alterna Bank"
    RATE_URL = "https://www.alternabank.ca/en/personal/rates/mortgages"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching Alterna Bank rate page...")
        rates = scrape_live_rates(
            url=self.RATE_URL,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            scraped_at=self.scraped_at,
            source="alterna_live_scrape",
        )
        if rates:
            logger.success(f"Successfully scraped {len(rates)} live rates from Alterna Bank")
            return rates
        logger.info("Using fallback rates from Alterna Bank (2026-09-14)")
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        # Effective date on Alterna page: 2026-07-13 (still published 2026-09-14)
        fallback_data = [
            {"term": 36, "type": RateType.FIXED, "rate": "3.99", "mortgage_type": "insured", "product": "Smart Start 3-Year Fixed High Ratio", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.14", "mortgage_type": "insured", "product": "Smart Start 5-Year Fixed High Ratio", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.70", "mortgage_type": "insured", "product": "Smart Start 5-Year Variable High Ratio", "featured": True},
            {"term": 12, "type": RateType.FIXED, "rate": "5.69", "mortgage_type": "uninsured", "product": "Signature 1-Year Fixed Closed"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.39", "mortgage_type": "uninsured", "product": "Signature 2-Year Fixed Closed"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.39", "mortgage_type": "uninsured", "product": "Signature 3-Year Fixed Closed", "featured": True},
            {"term": 48, "type": RateType.FIXED, "rate": "5.04", "mortgage_type": "uninsured", "product": "Signature 4-Year Fixed Closed"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.44", "mortgage_type": "uninsured", "product": "Signature 5-Year Fixed Closed", "featured": True},
            {"term": 36, "type": RateType.VARIABLE, "rate": "4.25", "mortgage_type": "uninsured", "product": "Signature 3-Year Variable Closed"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.15", "mortgage_type": "uninsured", "product": "Signature 5-Year Variable Closed"},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="alterna_fallback_2026-09-14",
            last_verified="2026-09-14",
        )


if __name__ == "__main__":
    scraper = AlternaScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} Alterna rates")
    for r in rates:
        print(f"  {r.mortgage_type.value:10} {r.term_months//12}yr {r.rate_type.value:8} {r.rate}% {(r.raw_data or {}).get('source')}")
