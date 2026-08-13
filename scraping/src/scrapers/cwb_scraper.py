"""
CWB (Canadian Western Bank) mortgage rate scraper.
STATUS: UNREACHABLE — CWB was acquired by National Bank of Canada (nbc.ca).
The old cwb.com domain now redirects to National Bank.
Updated: August 13, 2026
"""

from typing import List
from datetime import datetime
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate


class CWBScraper:
    """
    Scraper for CWB (Canadian Western Bank) mortgage rates.

    NOTE: CWB was acquired by National Bank of Canada. The domain cwb.com
    now redirects to nbc.ca. There is no separate CWB public mortgage
    rates page. National Bank rates are handled by a separate scraper.
    """

    LENDER_SLUG = "cwb"
    LENDER_NAME = "Canadian Western Bank"
    RATE_URL = "https://www.cwb.com"  # Redirects to nbc.ca

    def __init__(self):
        self.scraped_at = datetime.utcnow()

    def scrape(self) -> List[RawRate]:
        """
        CWB is no longer an independent lender.
        Returns empty list — live scraping is not possible.
        """
        logger.warning(
            "CWB (Canadian Western Bank) was acquired by National Bank of Canada. "
            "The cwb.com domain redirects to nbc.ca. No independent CWB mortgage "
            "rates page exists. Returning empty list."
        )
        return []


if __name__ == "__main__":
    scraper = CWBScraper()
    rates = scraper.scrape()
    print(f"CWB scraper: {len(rates)} rates (expected: 0 — lender acquired by National Bank)")
