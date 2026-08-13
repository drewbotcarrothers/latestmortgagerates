"""
Coast Capital Savings mortgage rate scraper.
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


class CoastCapitalScraper:
    """Scraper for Coast Capital Savings mortgage rates."""

    LENDER_SLUG = "coastcapital"
    LENDER_NAME = "Coast Capital Savings"
    RATE_URL = "https://www.coastcapitalsavings.com/mortgages"

    def __init__(self):
        self.scraped_at = datetime.utcnow()

    def scrape(self) -> List[RawRate]:
        """Scrape Coast Capital Savings mortgage rates."""
        logger.info("Fetching Coast Capital rate page...")

        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Coast Capital")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")

        logger.warning("Coast Capital live scraping failed - returning empty list")
        return []

    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright to scrape live rates from Coast Capital rate cards."""
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

                # Find rate cards on the page
                # Coast Capital shows rates in styled divs, not tables
                # Look for text containing rate percentages followed by APR
                page_text = page.inner_text("body")

                # Extract rate cards with pattern like "4.06% APR" followed by "5-Year Fixed High-Ratio"
                rate_patterns = re.findall(
                    r'(\d+\.\d+)\s*%\s*APR\s*([^\n]+)',
                    page_text,
                    re.IGNORECASE
                )

                for rate_str, label in rate_patterns:
                    rate = Decimal(rate_str)
                    label_clean = label.strip()
                    label_lower = label_clean.lower()

                    # Only accept reasonable rates (2-15%)
                    if rate < 2 or rate > 15:
                        continue

                    # Determine term
                    term_match = re.search(r'(\d+)\s*Year', label_clean, re.IGNORECASE)
                    if not term_match:
                        continue
                    term_months = int(term_match.group(1)) * 12

                    # Determine rate type
                    if "variable" in label_lower:
                        rate_type = RateType.VARIABLE
                    else:
                        rate_type = RateType.FIXED

                    # Determine mortgage type
                    if "high-ratio" in label_lower:
                        mortgage_type = MortgageType.INSURED
                    else:
                        mortgage_type = MortgageType.UNINSURED

                    product_name = label_clean

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
                            "source": "coastcapital_live_scrape",
                            "label": label_clean,
                            "product": product_name
                        }
                    ))

                # Also try to find rate cards using DOM selectors
                if not rates:
                    # Look for elements that contain rate text and labels
                    rate_containers = page.query_selector_all('[class*="rate"]')
                    for container in rate_containers:
                        text = container.inner_text()
                        rate_match = re.search(r'(\d+\.\d+)%', text)
                        if rate_match:
                            rate = Decimal(rate_match.group(1))
                            if rate < 2 or rate > 15:
                                continue

                            # Try to find associated label
                            label = container.evaluate(
                                "el => { "
                                "let label = el.querySelector('p, span, div');"
                                "return label ? label.innerText.trim() : '';"
                                "}"
                            )

                            if not label:
                                continue

                            label_lower = label.lower()
                            term_match = re.search(r'(\d+)\s*Year', label, re.IGNORECASE)
                            if not term_match:
                                continue
                            term_months = int(term_match.group(1)) * 12

                            if "variable" in label_lower:
                                rate_type = RateType.VARIABLE
                            else:
                                rate_type = RateType.FIXED

                            if "high-ratio" in label_lower:
                                mortgage_type = MortgageType.INSURED
                            else:
                                mortgage_type = MortgageType.UNINSURED

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
                                    "source": "coastcapital_live_scrape_dom",
                                    "label": label,
                                    "product": label
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
    scraper = CoastCapitalScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Coast Capital:")
        print("-" * 60)
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}%  {product}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
