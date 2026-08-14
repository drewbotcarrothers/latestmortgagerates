"""
Street Capital mortgage rate scraper.
UPDATED: August 14, 2026 - Street Capital removed from scraping pipeline.
Site returns consistent 503 errors - may be retired or rebranded.
"""

from typing import List
from datetime import datetime, timezone

from loguru import logger

from models import RawRate


class StreetCapitalScraper:
    """Scraper for Street Capital mortgage rates.
    
    NOTE: Street Capital website appears to be down (503 errors).
    May be retired or rebranded. Removed from scraping pipeline.
    """
    
    LENDER_SLUG = "streetcapital"
    LENDER_NAME = "Street Capital"
    
    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)
    
    def scrape(self) -> List[RawRate]:
        """Return empty - Street Capital site is down."""
        logger.info("Street Capital website appears to be down (503 errors).")
        logger.info("May be retired or rebranded.")
        logger.info("Returning empty rate list.")
        return []
