"""
MCAP mortgage rate scraper.
UPDATED: August 14, 2026 - MCAP removed from scraping pipeline.
MCAP is a wholesale lender that does not publish public consumer mortgage rates.
Only their Prime Rate is published, not mortgage products.
"""

from typing import List
from datetime import datetime, timezone

from loguru import logger

from models import RawRate


class MCAPScraper:
    """Scraper for MCAP mortgage rates.
    
    NOTE: MCAP is a wholesale lender (broker-only) that does not publish
    direct consumer mortgage rates. Removed from scraping pipeline.
    """
    
    LENDER_SLUG = "mcap"
    LENDER_NAME = "MCAP"
    
    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)
    
    def scrape(self) -> List[RawRate]:
        """Return empty - MCAP does not publish public mortgage rates."""
        logger.info("MCAP is a wholesale lender (broker-only).")
        logger.info("They do not publish public consumer mortgage rates.")
        logger.info("Returning empty rate list.")
        return []
