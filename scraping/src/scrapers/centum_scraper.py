"""
Centum mortgage rate scraper.
Uses Playwright for live scraping with anti-bot measures.
Updated: August 13, 2026
"""

import re
from decimal import Decimal
from typing import List
from datetime import datetime
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType


class CentumScraper:
    """Scraper for Centum mortgage rates."""

    LENDER_SLUG = "centum"
    LENDER_NAME = "Centum"
    RATE_URL = "https://www.centum.ca/rates"

    def __init__(self):
        self.scraped_at = datetime.utcnow()

    def scrape(self) -> List[RawRate]:
        """Scrape Centum mortgage rates."""
        logger.info("Fetching Centum rate page...")

        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Centum")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")

        logger.warning("Centum live scraping failed - returning empty list")
        return []

    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright to scrape live rates from Centum rates table."""
        try:
            from playwright.sync_api import sync_playwright

            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=[
                        "--disable-http2",
                        "--disable-quic",
                        "--disable-blink-features=AutomationControlled",
                    ]
                )
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                    viewport={"width": 1920, "height": 1080},
                )
                page = context.new_page()

                page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=30000)
                page.wait_for_timeout(3000)

                rates = []

                # Find the rates table
                tables = page.query_selector_all("table")
                logger.info(f"Found {len(tables)} tables on Centum page")

                for table in tables:
                    rows = table.query_selector_all("tbody tr")
                    if not rows:
                        rows = table.query_selector_all("tr")

                    for row in rows:
                        cells = row.query_selector_all("td")
                        if len(cells) < 2:
                            continue

                        term_text = cells[0].inner_text().strip()
                        rate_text = cells[1].inner_text().strip()

                        # Parse term
                        term_match = re.search(r'(\d+)\s*Year', term_text, re.IGNORECASE)
                        if not term_match:
                            continue
                        term_months = int(term_match.group(1)) * 12

                        # Parse rate
                        rate_match = re.search(r'(\d+\.?\d*)\s*%', rate_text)
                        if not rate_match:
                            continue

                        rate = Decimal(rate_match.group(1))

                        # Only accept reasonable rates (2-15%)
                        if rate < 2 or rate > 15:
                            continue

                        # Determine rate type
                        if "variable" in term_text.lower():
                            rate_type = RateType.VARIABLE
                        else:
                            rate_type = RateType.FIXED

                        # Centum shows "best" rates - mark as insured (high-ratio)
                        mortgage_type = MortgageType.INSURED

                        product_name = f"Best {term_months // 12}-Year {rate_type.value.title()}"

                        rates.append(RawRate(
                            lender_slug=self.LENDER_SLUG,
                            lender_name=self.LENDER_NAME,
                            term_months=term_months,
                            rate_type=rate_type,
                            mortgage_type=mortgage_type,
                            rate=rate,
                            source_url=self.RATE_URL,
                            scraped_at=self.scraped_at,
                            raw_data={
                                "source": "centum_live_scrape",
                                "term_text": term_text,
                                "rate_text": rate_text,
                                "product": product_name
                            }
                        ))

                # Also check for the rate cards (Current Prime Rate, etc.)
                # that appear above the table
                prime_text = page.inner_text("body")
                prime_match = re.search(r'Current Prime Rate\s*(\d+\.\d+)%', prime_text, re.IGNORECASE)
                if prime_match:
                    prime_rate = Decimal(prime_match.group(1))
                    if 2 <= prime_rate <= 15:
                        rates.append(RawRate(
                            lender_slug=self.LENDER_SLUG,
                            lender_name=self.LENDER_NAME,
                            term_months=60,  # Variable rates typically shown as 5-year
                            rate_type=RateType.VARIABLE,
                            mortgage_type=MortgageType.UNINSURED,
                            rate=prime_rate,
                            source_url=self.RATE_URL,
                            scraped_at=self.scraped_at,
                            raw_data={
                                "source": "centum_live_scrape",
                                "product": "Current Prime Rate",
                                "rate_text": f"{prime_rate}%"
                            }
                        ))

                browser.close()
                return rates

        except ImportError:
            logger.warning("Playwright not available")
            return []
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return []


if __name__ == "__main__":
    scraper = CentumScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Centum:")
        print("-" * 60)
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}%  {product}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
