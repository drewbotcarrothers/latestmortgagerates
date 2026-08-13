"""
Equitable Bank mortgage rate scraper.
STATUS: BLOCKED — equitablebank.com is a parked domain.
EQ Bank (eqbank.ca) already has a separate scraper (eqbank_scraper.py).
Updated: August 13, 2026
"""

from typing import List
from datetime import datetime
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate


class EquitableScraper:
    """
    Scraper for Equitable Bank mortgage rates.

    NOTE: equitablebank.com shows a "Under Construction" Network Solutions
    parking page. The active Equitable Bank consumer site is eqbank.ca, which
    already has a dedicated scraper (eqbank_scraper.py). This scraper is
    kept as a placeholder but returns empty rates.
    """

    LENDER_SLUG = "equitable"
    LENDER_NAME = "Equitable Bank"
    RATE_URL = "https://www.equitablebank.com"

    def __init__(self):
        self.scraped_at = datetime.utcnow()

    def scrape(self) -> List[RawRate]:
        """
        Equitable Bank's public site (equitablebank.com) is a parked domain.
        EQ Bank (eqbank.ca) handles consumer-facing mortgage rates and has
        a separate scraper. Returning empty list.
        """
        logger.warning(
            "equitablebank.com is a parked domain. EQ Bank mortgage rates "
            "are handled by eqbank_scraper.py. Returning empty list."
        )
        return []


if __name__ == "__main__":
    scraper = EquitableScraper()
    rates = scraper.scrape()
    print(f"Equitable scraper: {len(rates)} rates (expected: 0 — use eqbank_scraper.py instead)")
