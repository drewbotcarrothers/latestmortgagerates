"""
Lendwise mortgage rate scraper.
STATUS: BLOCKED — Lendwise is a UK-based student loan platform, not a Canadian mortgage lender.
Updated: August 13, 2026
"""

from typing import List
from datetime import datetime
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate


class LendwiseScraper:
    """
    Scraper for Lendwise mortgage rates.

    NOTE: Lendwise (lendwise.com) is a UK-based student loan platform
    regulated by the FCA (Firm Reference 782496). It is NOT a Canadian
    mortgage lender and does not publish Canadian mortgage rates.
    The /mortgage-rates endpoint returns 404.
    """

    LENDER_SLUG = "lendwise"
    LENDER_NAME = "Lendwise"
    RATE_URL = "https://www.lendwise.com"

    def __init__(self):
        self.scraped_at = datetime.utcnow()

    def scrape(self) -> List[RawRate]:
        """
        Lendwise is not a Canadian mortgage lender.
        Returns empty list — live scraping is not possible.
        """
        logger.warning(
            "Lendwise (lendwise.com) is a UK student loan platform, not a "
            "Canadian mortgage lender. No mortgage rates available. "
            "Returning empty list."
        )
        return []


if __name__ == "__main__":
    scraper = LendwiseScraper()
    rates = scraper.scrape()
    print(f"Lendwise scraper: {len(rates)} rates (expected: 0 — not a Canadian mortgage lender)")
