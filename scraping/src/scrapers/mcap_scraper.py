"""
MCAP mortgage rate scraper.
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


class MCAPScraper:
    """Scraper for MCAP mortgage rates.
    
    NOTE: MCAP does not publicly publish specific mortgage rates on their website.
    They refer customers to mortgage brokers for current rates.
    This scraper will return empty as there are no rates to scrape.
    """
    
    LENDER_SLUG = "mcap"
    LENDER_NAME = "MCAP"
    RATE_URL = "https://www.mcap.com/residential-mortgages/advice/mortgage-rates-canada"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape MCAP mortgage rates."""
        logger.info("Fetching MCAP rate page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from MCAP")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        logger.warning("MCAP does not publish rates publicly - returning empty list")
        return []
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright to scrape live rates from MCAP.
        
        MCAP only shows prime rate and refers to brokers for actual mortgage rates.
        """
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
                
                # Navigate to MCAP mortgage rates page
                page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=30000)
                page.wait_for_timeout(3000)
                
                rates = []
                
                # MCAP only displays prime rate, not specific mortgage rates
                # They refer customers to brokers for actual rates
                # Try to extract prime rate if available
                content = page.content()
                
                # Look for prime rate
                prime_match = re.search(r'(?:prime rate|prime)\D*?(\d+\.\d+)%', content, re.IGNORECASE)
                if prime_match:
                    logger.info(f"MCAP Prime Rate found: {prime_match.group(1)}%")
                    # Note: We don't create a RawRate for prime rate as it's not a mortgage product rate
                
                # Check if there are any rate tables
                tables = page.query_selector_all("table")
                logger.info(f"Found {len(tables)} tables on MCAP page")
                
                if tables:
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
                            
                            # Skip header rows
                            if 'term' in term_text.lower() and ('rate' in rate_text.lower() or '%' in rate_text):
                                continue
                            
                            # Parse term
                            term_match = re.search(r'(\d+)\s*(?:Year|Yr)', term_text, re.IGNORECASE)
                            if not term_match:
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
                            rate_type = RateType.VARIABLE if 'variable' in term_text.lower() else RateType.FIXED
                            
                            rates.append(RawRate(
                                lender_slug=self.LENDER_SLUG,
                                lender_name=self.LENDER_NAME,
                                term_months=term_months,
                                rate_type=rate_type,
                                mortgage_type=MortgageType.UNINSURED,
                                rate=rate,
                                source_url=self.RATE_URL,
                                scraped_at=self.scraped_at,
                                raw_data={
                                    "source": "mcap_live_scrape",
                                    "term_text": term_text,
                                    "rate_text": rate_text
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
    scraper = MCAPScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from MCAP:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}%  {product}")
        
        if not rates:
            print("  MCAP does not publish specific mortgage rates publicly.")
            print("  They refer customers to mortgage brokers for current rates.")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
