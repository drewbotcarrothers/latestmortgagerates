"""
Centum mortgage rate scraper.
UPDATED: August 14, 2026 - Centum removed from scraping pipeline.
Centum is a mortgage brokerage network, not a direct lender.
Rates shown are from partner lenders, not Centum itself.
"""

from typing import List
from datetime import datetime, timezone

from loguru import logger

from models import RawRate


class CentumScraper:
    """Scraper for Centum mortgage rates.
    
    NOTE: Centum is a mortgage brokerage network (not a direct lender).
    Rates displayed are from partner lenders, not Centum itself.
    Removed from scraping pipeline to avoid duplicate data.
    """
    
    LENDER_SLUG = "centum"
    LENDER_NAME = "Centum"
    
    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)
    
    def scrape(self) -> List[RawRate]:
        """Return empty - Centum is a brokerage, not a direct lender."""
        logger.info("Centum is a mortgage brokerage network (not a direct lender).")
        logger.info("Rates are from partner lenders, not Centum itself.")
        logger.info("Returning empty rate list.")
        return []
