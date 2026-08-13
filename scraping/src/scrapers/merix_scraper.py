"""
Merix Financial mortgage rate scraper.
STATUS: BLOCKED — Merix Financial does not publish public mortgage rates.
They are a broker-only lender; rates are available only through mortgage brokers.
Updated: August 13, 2026
"""

from typing import List
from datetime import datetime
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate


class MerixScraper:
    """
    Scraper for Merix Financial mortgage rates.

    NOTE: Merix Financial (merixfinancial.com) does not publish public
    mortgage rates on their website. They are a broker-only lender;
    rates are available exclusively through mortgage brokers.
    The merix.com domain shows a Plesk hosting login page.
    """

    LENDER_SLUG = "merix"
    LENDER_NAME = "Merix Financial"
    RATE_URL = "https://www.merixfinancial.com"

    def __init__(self):
        self.scraped_at = datetime.utcnow()

    def scrape(self) -> List[RawRate]:
        """
        Merix Financial does not publish public mortgage rates.
        Returns empty list — live scraping is not possible.
        """
        logger.warning(
            "Merix Financial is a broker-only lender and does not publish "
            "public mortgage rates. Rates are available only through "
            "mortgage brokers. Returning empty list."
        )
        return []


if __name__ == "__main__":
    scraper = MerixScraper()
    rates = scraper.scrape()
    print(f"Merix scraper: {len(rates)} rates (expected: 0 — broker-only, no public rates)")
