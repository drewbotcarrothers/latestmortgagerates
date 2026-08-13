"""
CMLS Financial mortgage rate scraper.
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


class CMLSScraper:
    """Scraper for CMLS Financial mortgage rates."""

    LENDER_SLUG = "cmls"
    LENDER_NAME = "CMLS Financial"
    RATE_URL = "https://www.cmls.ca/what-we-do/cmls-residential/mortgage-rates"

    def __init__(self):
        self.scraped_at = datetime.utcnow()

    def scrape(self) -> List[RawRate]:
        """Scrape CMLS Financial mortgage rates."""
        logger.info("Fetching CMLS rate page...")

        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from CMLS")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")

        logger.warning("CMLS live scraping failed - returning empty list")
        return []

    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright to scrape live rates from CMLS dropdown selectors."""
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

                # Find all select dropdowns
                selects = page.query_selector_all("select")
                logger.info(f"Found {len(selects)} select dropdowns on CMLS page")

                for select in selects:
                    # Get the associated heading to identify rate type
                    heading = select.evaluate(
                        "el => { "
                        "let prev = el.previousElementSibling; "
                        "while(prev && prev.tagName !== 'H1' && prev.tagName !== 'H2' && prev.tagName !== 'H3' && prev.tagName !== 'H4') {"
                        "  prev = prev.previousElementSibling;"
                        "}"
                        "return prev ? prev.innerText.trim() : '';"
                        "}"
                    )
                    heading_lower = heading.lower() if heading else ""

                    # Get all options and iterate through them
                    options = select.query_selector_all("option")

                    for option in options:
                        option_text = option.inner_text().strip()
                        option_value = option.get_attribute("value") or ""

                        # Skip placeholder options
                        if not option_text or "select" in option_text.lower():
                            continue

                        # Select this option to get its rate
                        select.select_option(value=option_value)
                        page.wait_for_timeout(500)

                        # Find the rate heading that appears after selecting
                        rate_heading = select.evaluate(
                            "el => { "
                            "let next = el.nextElementSibling; "
                            "while(next && next.tagName !== 'H1' && next.tagName !== 'H2') {"
                            "  next = next.nextElementSibling;"
                            "}"
                            "return next ? next.innerText.trim() : '';"
                            "}"
                        )

                        # Parse term from option text
                        term_match = re.search(r'(\d+)\s*YEAR', option_text, re.IGNORECASE)
                        if not term_match:
                            # Try other patterns like "CMLS PRIME RATE"
                            if "prime" in option_text.lower():
                                continue  # Skip prime rate entries (not a mortgage product)
                            continue

                        term_months = int(term_match.group(1)) * 12

                        # Parse rate from heading
                        rate_match = re.search(r'(\d+\.?\d*)\s*%', rate_heading)
                        if not rate_match:
                            continue

                        rate = Decimal(rate_match.group(1))

                        # Determine rate type
                        if "ADJUSTABLE" in option_text.upper():
                            rate_type = RateType.VARIABLE
                        elif "FIXED" in option_text.upper():
                            rate_type = RateType.FIXED
                        else:
                            continue

                        # Determine mortgage type
                        if "UNINSURED" in option_text.upper():
                            mortgage_type = MortgageType.UNINSURED
                        elif "RATE ADVANTAGE" in option_text.upper():
                            mortgage_type = MortgageType.INSURED
                        else:
                            mortgage_type = MortgageType.INSURED  # Default for CMLS

                        # Only accept reasonable rates (2-15%)
                        if rate < 2 or rate > 15:
                            continue

                        product_name = f"{term_months // 12}-Year {rate_type.value.title()}"
                        if mortgage_type == MortgageType.UNINSURED:
                            product_name += " (Uninsured)"
                        elif "RATE ADVANTAGE" in option_text.upper():
                            product_name += " (Rate Advantage)"

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
                                "source": "cmls_live_scrape",
                                "option_text": option_text,
                                "rate_heading": rate_heading,
                                "product": product_name
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
    scraper = CMLSScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from CMLS:")
        print("-" * 60)
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}%  {product}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
