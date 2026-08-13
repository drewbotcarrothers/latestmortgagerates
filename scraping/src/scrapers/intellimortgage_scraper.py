"""
IntelliMortgage mortgage rate scraper.
STATUS: UNREACHABLE — intellimortgage.com returns empty content (site down or blocking).
Updated: August 13, 2026
"""

from typing import List
from datetime import datetime
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate


class IntelliMortgageScraper:
    """
    Scraper for IntelliMortgage mortgage rates.

    NOTE: intellimortgage.com returns empty content. The site appears to be
    down or actively blocking scrapers. No mortgage rates are accessible.
    """

    LENDER_SLUG = "intellimortgage"
    LENDER_NAME = "IntelliMortgage"
    RATE_URL = "https://www.intellimortgage.com"

    def __init__(self):
        self.scraped_at = datetime.utcnow()

    def scrape(self) -> List[RawRate]:
        """
        IntelliMortgage site is unreachable.
        Returns empty list — live scraping is not possible.
        """
        logger.warning(
            "intellimortgage.com returns empty content. The site may be "
            "down or blocking automated access. Returning empty list."
        )
        return []


if __name__ == "__main__":
    scraper = IntelliMortgageScraper()
    rates = scraper.scrape()
    print(f"IntelliMortgage scraper: {len(rates)} rates (expected: 0 — site unreachable)")
