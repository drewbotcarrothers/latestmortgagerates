"""
BMO mortgage rate scraper.
Uses Playwright for live scraping with fallback to captured rates.
Updated: April 25, 2026
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


class BMOScraper:
    """Scraper for BMO mortgage rates."""
    
    LENDER_SLUG = "bmo"
    LENDER_NAME = "Bank of Montreal"
    RATE_URL = "https://www.bmo.com/main/personal/mortgages/mortgage-rates/"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape BMO mortgage rates."""
        logger.info("Fetching BMO rate page...")
        
        try:
            # Try Playwright first
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from BMO")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        # Fallback to static data
        logger.info("Using fallback rates from BMO website (Apr 25, 2026)")
        rates = self._get_fallback_rates()
        return rates
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright to scrape live rates."""
        try:
            from playwright.sync_api import sync_playwright
            
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                )
                page = context.new_page()
                
                page.goto(self.RATE_URL, wait_until="networkidle", timeout=30000)
                page.wait_for_timeout(2000)
                
                rates = []
                
                # Look for rate tables
                rows = page.query_selector_all("table tbody tr")
                for row in rows:
                    cells = row.query_selector_all("td")
                    if len(cells) >= 2:
                        term_text = cells[0].inner_text().strip()
                        rate_text = cells[1].inner_text().strip()
                        
                        # Parse term
                        term_match = re.search(r'(\d+)\s*Year', term_text, re.IGNORECASE)
                        if term_match:
                            term_months = int(term_match.group(1)) * 12
                            
                            # Parse rate
                            rate_match = re.search(r'([\d.]+)\s*%', rate_text)
                            if rate_match:
                                rate = Decimal(rate_match.group(1))
                                rate_type = RateType.VARIABLE if 'variable' in term_text.lower() else RateType.FIXED
                                mortgage_type = MortgageType.INSURED if 'smart' in term_text.lower() or 'insured' in term_text.lower() else MortgageType.UNINSURED
                                
                                rates.append(RawRate(
                                    lender_slug=self.LENDER_SLUG,
                                    lender_name=self.LENDER_NAME,
                                    term_months=term_months,
                                    rate_type=rate_type,
                                    mortgage_type=mortgage_type,
                                    rate=rate,
                                    source_url=self.RATE_URL,
                                    scraped_at=self.scraped_at,
                                    raw_data={"source": "bmo_live_scrape"}
                                ))
                
                browser.close()
                return rates
                
        except ImportError:
            logger.warning("Playwright not available")
            return []
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return []
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates from BMO website (April 25, 2026).
        Verified from production data scraping.
        """
        logger.info("Using fallback rates from BMO website (Apr 25, 2026)")
        
        # Verified from production data (Apr 25, 2026)
        # BMO Smart Fixed rates (amortization 25 years or less)
        fallback_data = [
            # Special Offers
            {"term": 36, "type": RateType.FIXED, "rate": "4.39", "apr": "4.42", "mortgage_type": "uninsured", "product": "3-Year Fixed", "amortization": "25_or_less"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.49", "apr": "4.51", "mortgage_type": "insured", "product": "5-Year Smart Fixed (Insured)", "amortization": "25_or_less", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.64", "apr": "4.66", "mortgage_type": "uninsured", "product": "5-Year Smart Fixed", "amortization": "25_or_less"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.15", "apr": "4.17", "mortgage_type": "uninsured", "product": "5-Year Variable", "amortization": "25_or_less"},
            
            # Amortization over 25 years
            {"term": 36, "type": RateType.FIXED, "rate": "4.49", "apr": "4.52", "mortgage_type": "uninsured", "product": "3-Year Fixed (>25yr amort)", "amortization": "over_25"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.25", "apr": "4.27", "mortgage_type": "uninsured", "product": "5-Year Variable (>25yr amort)", "amortization": "over_25"},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.INSURED if item.get("mortgage_type") == "insured" else MortgageType.UNINSURED
            
            raw_data = {
                "source": "bmo_fallback_2026-04-25",
                "apr": item.get("apr"),
                "amortization": item.get("amortization"),
                "product": item.get("product"),
                "featured": item.get("featured", False),
                "last_verified": "2026-04-25"
            }
            
            rates.append(RawRate(
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                term_months=item["term"],
                rate_type=item["type"],
                mortgage_type=mortgage_type,
                rate=Decimal(item["rate"]),
                source_url=self.RATE_URL,
                scraped_at=self.scraped_at,
                raw_data=raw_data
            ))
        
        return rates


if __name__ == "__main__":
    scraper = BMOScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from BMO:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            apr = r.raw_data.get("apr", "")
            amort = r.raw_data.get("amortization", "")
            featured = " [FEATURED]" if r.raw_data.get("featured") else ""
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}% (APR: {apr}%){featured}")
            if product:
                print(f"    Product: {product}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()