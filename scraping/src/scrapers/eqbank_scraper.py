"""
EQ Bank mortgage rate scraper.
UPDATED: August 14, 2026 - EQ Bank no longer publishes direct mortgage rates.
They now redirect to nesto.ca (mortgage marketplace/broker model).
This scraper returns empty to avoid stale/incorrect data.
See: https://www.eqbank.ca/personal-banking/mortgage-marketplace
"""

from typing import List
from datetime import datetime, timezone

from loguru import logger

from models import RawRate


class EQBankScraper:
    """Scraper for EQ Bank mortgage rates.
    
    NOTE: EQ Bank discontinued direct mortgage rate publishing.
    They now partner with nesto.ca for mortgage marketplace services.
    """
    
    LENDER_SLUG = "eqbank"
    LENDER_NAME = "EQ Bank"
    
    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)
    
    def scrape(self) -> List[RawRate]:
        """Return empty - EQ Bank no longer publishes mortgage rates."""
        logger.info("EQ Bank no longer publishes direct mortgage rates.")
        logger.info("They redirect to nesto.ca mortgage marketplace.")
        logger.info("Returning empty rate list.")
        return []
