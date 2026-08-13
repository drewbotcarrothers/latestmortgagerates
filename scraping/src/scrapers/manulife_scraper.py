"""
Manulife Bank mortgage rate scraper.
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


class ManulifeBankScraper:
    """Scraper for Manulife Bank mortgage rates."""
    
    LENDER_SLUG = "manulife"
    LENDER_NAME = "Manulife Bank"
    RATE_URL = "https://www.manulifebank.ca/current-rates.html"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape Manulife Bank mortgage rates."""
        logger.info("Fetching Manulife Bank rate page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Manulife Bank")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        logger.warning("Manulife Bank live scraping failed - returning empty list")
        return []
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright to scrape live rates from Manulife Bank tables."""
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
                
                # Navigate to Manulife Bank current rates page
                page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=30000)
                page.wait_for_timeout(3000)
                
                rates = []
                
                # Manulife Bank has multiple tables with mortgage rates
                # Look for tables containing mortgage rate data
                tables = page.query_selector_all("table")
                logger.info(f"Found {len(tables)} tables on Manulife Bank page")
                
                for table in tables:
                    # Get headers to identify the table type
                    headers = table.query_selector_all("th")
                    header_text = " ".join([h.inner_text().strip().lower() for h in headers])
                    
                    # Check if this is a mortgage rates table
                    is_mortgage_table = any(word in header_text for word in ['mortgage', 'fixed', 'variable', 'term', 'rate'])
                    
                    if not is_mortgage_table:
                        continue
                    
                    is_manulife_one = "manulife one" in header_text
                    is_manulife_select = "manulife bank select" in header_text
                    is_variable = "variable" in header_text
                    
                    rows = table.query_selector_all("tbody tr")
                    if not rows:
                        rows = table.query_selector_all("tr")
                    
                    for row in rows:
                        cells = row.query_selector_all("td")
                        if len(cells) < 2:
                            continue
                        
                        term_text = cells[0].inner_text().strip()
                        rate_text = cells[1].inner_text().strip()
                        
                        # Skip header rows and non-term rows
                        if any(skip in term_text.lower() for skip in ['rate type', 'term', 'base rate', 'interest rate', 'sub-account']):
                            continue
                        
                        # Skip non-mortgage rows (like bank account interest rates)
                        if 'positive account' in term_text.lower() or 'bank account' in term_text.lower():
                            continue
                        
                        # Parse term
                        term_match = re.search(r'(\d+)\s*(?:Year|Yr)', term_text, re.IGNORECASE)
                        if not term_match:
                            # Try to find any number that looks like a term
                            term_match = re.search(r'(\d+)', term_text)
                        if term_match:
                            term_months = int(term_match.group(1)) * 12
                        else:
                            continue
                        
                        # Parse rate
                        rate_match = re.search(r'(\d+\.?\d*)\s*%', rate_text)
                        if rate_match:
                            rate = Decimal(rate_match.group(1))
                        else:
                            rate_match = re.search(r'(\d+\.\d+)', rate_text)
                            if rate_match:
                                rate = Decimal(rate_match.group(1))
                            else:
                                continue
                        
                        # Determine rate type
                        if is_variable or 'variable' in term_text.lower():
                            rate_type = RateType.VARIABLE
                        else:
                            rate_type = RateType.FIXED
                        
                        # Determine mortgage type and product
                        if is_manulife_one:
                            mortgage_type = MortgageType.UNINSURED
                            product_name = f"{term_match.group(1)}-Year {rate_type.value.title()} (Manulife One)"
                        elif is_manulife_select:
                            mortgage_type = MortgageType.UNINSURED
                            product_name = f"{term_match.group(1)}-Year {rate_type.value.title()} (Manulife Select)"
                        else:
                            mortgage_type = MortgageType.UNINSURED
                            product_name = f"{term_match.group(1)}-Year {rate_type.value.title()}"
                        
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
                                "source": "manulife_live_scrape",
                                "term_text": term_text,
                                "rate_text": rate_text,
                                "product": product_name,
                                "is_manulife_one": is_manulife_one,
                                "is_manulife_select": is_manulife_select
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
    scraper = ManulifeBankScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Manulife Bank:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}%  {product}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
