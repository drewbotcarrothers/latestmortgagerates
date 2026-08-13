"""
Home Trust mortgage rate scraper.
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


class HomeTrustScraper:
    """Scraper for Home Trust mortgage rates."""

    LENDER_SLUG = "hometrust"
    LENDER_NAME = "Home Trust Company"
    RATE_URL = "https://www.hometrust.ca/mortgages/rates/"

    def __init__(self):
        self.scraped_at = datetime.utcnow()

    def scrape(self) -> List[RawRate]:
        """Scrape Home Trust mortgage rates."""
        logger.info("Fetching Home Trust rate page...")

        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Home Trust")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")

        logger.warning("Home Trust live scraping failed - returning empty list")
        return []

    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright to scrape live rates from Home Trust tables."""
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

                # Home Trust has two products: Accelerator and Classic
                # Each has its own table with terms and rates

                # Find all tables on the page
                tables = page.query_selector_all("table")
                logger.info(f"Found {len(tables)} tables on Home Trust page")

                for table in tables:
                    # Try to find the preceding product heading
                    product_heading = table.evaluate(
                        "el => { "
                        "let prev = el.previousElementSibling; "
                        "while(prev) {"
                        "  const text = prev.innerText ? prev.innerText.trim() : '';"
                        "  if (text.includes('Accelerator') || text.includes('Classic')) {"
                        "    return text;"
                        "  }"
                        "  prev = prev.previousElementSibling;"
                        "}"
                        "return '';"
                        "}"
                    )
                    product_heading = product_heading or ""
                    heading_lower = product_heading.lower()

                    # Determine product type
                    if "accelerator" in heading_lower:
                        product_type = "Accelerator"
                        mortgage_type = MortgageType.INSURED
                    elif "classic" in heading_lower:
                        product_type = "Classic"
                        mortgage_type = MortgageType.UNINSURED
                    else:
                        continue

                    # Extract rows
                    rows = table.query_selector_all("tbody tr")
                    if not rows:
                        rows = table.query_selector_all("tr")

                    for row in rows:
                        cells = row.query_selector_all("td")
                        if len(cells) < 2:
                            continue

                        term_text = cells[0].inner_text().strip()
                        rate_text = cells[1].inner_text().strip()

                        # Skip header rows
                        if not term_text or "term" in term_text.lower() or "posted" in term_text.lower():
                            continue

                        # Parse term
                        term_match = re.search(r'(\d+)\s*year', term_text, re.IGNORECASE)
                        if term_match:
                            term_months = int(term_match.group(1)) * 12
                        else:
                            continue

                        # Parse rate
                        rate_match = re.search(r'(\d+\.?\d*)\s*%', rate_text)
                        if not rate_match:
                            continue

                        rate = Decimal(rate_match.group(1))

                        # Only accept reasonable rates (2-15%)
                        if rate < 2 or rate > 15:
                            continue

                        # Home Trust only shows fixed rates
                        rate_type = RateType.FIXED

                        product_name = f"{term_months // 12}-Year Fixed ({product_type})"

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
                                "source": "hometrust_live_scrape",
                                "term_text": term_text,
                                "rate_text": rate_text,
                                "product": product_name,
                                "product_type": product_type
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
    scraper = HomeTrustScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Home Trust:")
        print("-" * 60)
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}%  {product}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
