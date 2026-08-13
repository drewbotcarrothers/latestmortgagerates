"""
Motive Financial mortgage rate scraper.
STATUS: UNREACHABLE — Motive Financial was acquired by National Bank of Canada.
motivefinancial.com redirects to nbc.ca.
Updated: August 13, 2026
"""

from typing import List
from datetime import datetime
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate


class MotiveScraper:
    """
    Scraper for Motive Financial mortgage rates.

    NOTE: Motive Financial was acquired by National Bank of Canada.
    The motivefinancial.com domain redirects to nbc.ca (National Bank).
    National Bank rates are handled by a separate scraper.
    """

    LENDER_SLUG = "motive"
    LENDER_NAME = "Motive Financial"
    RATE_URL = "https://www.motivefinancial.com"

    def __init__(self):
        self.scraped_at = datetime.utcnow()

    def scrape(self) -> List[RawRate]:
        """
        Motive Financial was acquired by National Bank of Canada.
        Returns empty list — live scraping is not possible.
        """
        logger.warning(
            "Motive Financial was acquired by National Bank of Canada. "
            "motivefinancial.com redirects to nbc.ca. No independent Motive "
            "mortgage rates page exists. Returning empty list."
        )
        return []


if __name__ == "__main__":
    scraper = MotiveScraper()
    rates = scraper.scrape()
    print(f"Motive scraper: {len(rates)} rates (expected: 0 — lender acquired by National Bank)")
