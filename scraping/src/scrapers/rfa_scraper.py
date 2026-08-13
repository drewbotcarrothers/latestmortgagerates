"""
RFA mortgage rate scraper.
STATUS: UNREACHABLE — rfabank.com returns Cloudflare Error 522 (connection timeout).
Updated: August 13, 2026
"""

from typing import List
from datetime import datetime
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate


class RFAScraper:
    """
    Scraper for RFA mortgage rates.

    NOTE: rfabank.com returns Cloudflare Error 522 (Connection timed out).
    The origin server could not be reached. No mortgage rates are accessible.
    """

    LENDER_SLUG = "rfa"
    LENDER_NAME = "RFA"
    RATE_URL = "https://www.rfabank.com"

    def __init__(self):
        self.scraped_at = datetime.utcnow()

    def scrape(self) -> List[RawRate]:
        """
        RFA website is unreachable (Cloudflare Error 522).
        Returns empty list — live scraping is not possible.
        """
        logger.warning(
            "rfabank.com returns Cloudflare Error 522 (Connection timed out). "
            "The origin server is unreachable. Returning empty list."
        )
        return []


if __name__ == "__main__":
    scraper = RFAScraper()
    rates = scraper.scrape()
    print(f"RFA scraper: {len(rates)} rates (expected: 0 — site unreachable, Cloudflare 522)")
