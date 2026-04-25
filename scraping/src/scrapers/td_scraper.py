"""
TD Bank mortgage rate scraper.
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


class TDScraper:
    """Scraper for TD Bank mortgage rates."""
    
    LENDER_SLUG = "td"
    LENDER_NAME = "TD Bank"
    RATE_URL = "https://td.com/ca/en/personal-banking/products/mortgages/mortgage-rates"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape TD mortgage rates."""
        logger.info("Fetching TD rate page...")
        
        try:
            # Try Playwright first
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from TD")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        # Fallback to static data
        logger.info("Using fallback rates from TD website (Apr 25, 2026)")
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
                
                # Extract from special rates table
                rows = page.query_selector_all("table tbody tr")
                for row in rows:
                    cells = row.query_selector_all("td")
                    if len(cells) >= 2:
                        term_text = cells[0].inner_text().strip()
                        rate_text = cells[1].inner_text().strip()
                        
                        # Parse term and type
                        term_match = re.search(r'(\d+)\s*Year', term_text, re.IGNORECASE)
                        if term_match:
                            term_months = int(term_match.group(1)) * 12
                            rate_type = RateType.VARIABLE if 'variable' in term_text.lower() else RateType.FIXED
                            
                            # Parse rate
                            rate_match = re.search(r'([\d.]+)\s*%', rate_text)
                            if rate_match:
                                rate = Decimal(rate_match.group(1))
                                mortgage_type = MortgageType.INSURED if 'high-ratio' in term_text.lower() or 'high ratio' in term_text.lower() else MortgageType.UNINSURED
                                
                                rates.append(RawRate(
                                    lender_slug=self.LENDER_SLUG,
                                    lender_name=self.LENDER_NAME,
                                    term_months=term_months,
                                    rate_type=rate_type,
                                    mortgage_type=mortgage_type,
                                    rate=rate,
                                    source_url=self.RATE_URL,
                                    scraped_at=self.scraped_at,
                                    raw_data={"source": "td_live_scrape"}
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
        Fallback rates from TD website (April 25, 2026).
        Verified via browser snapshot.
        """
        logger.info("Using fallback rates from TD website (Apr 25, 2026)")
        
        # Live verified rates from browser scraping
        # TD Mortgage Prime Rate: 4.60%
        
        fallback_data = [
            # Special Offers (best rates)
            {"term": 36, "type": RateType.FIXED, "rate": "4.79", "posted": "6.05", "apr": "4.825", "mortgage_type": "uninsured", "product": "3 Year Fixed Closed"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.94", "posted": "6.09", "apr": "4.961", "mortgage_type": "uninsured", "product": "5 Year Fixed Closed", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.94", "posted": "6.09", "apr": "4.961", "mortgage_type": "insured", "product": "5 Year Fixed Closed High-Ratio"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.29", "posted": "4.60", "apr": "4.311", "mortgage_type": "uninsured", "product": "5 Year Variable Closed", "note": "TD Prime - 0.31%", "featured": True},
            
            # Posted Rates (all terms)
            {"term": 6, "type": RateType.FIXED, "rate": "5.49", "apr": "5.685", "mortgage_type": "uninsured", "product": "6 Month Convertible"},
            {"term": 12, "type": RateType.FIXED, "rate": "5.49", "apr": "5.590", "mortgage_type": "uninsured", "product": "1 Year Fixed Closed"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.89", "apr": "4.941", "mortgage_type": "uninsured", "product": "2 Year Fixed Closed"},
            {"term": 36, "type": RateType.FIXED, "rate": "6.05", "apr": "6.016", "mortgage_type": "uninsured", "product": "3 Year Fixed Closed (Posted)"},
            {"term": 48, "type": RateType.FIXED, "rate": "5.99", "apr": "6.016", "mortgage_type": "uninsured", "product": "4 Year Fixed Closed"},
            {"term": 60, "type": RateType.FIXED, "rate": "6.09", "apr": "6.090", "mortgage_type": "uninsured", "product": "5 Year Fixed Closed (Posted)"},
            {"term": 72, "type": RateType.FIXED, "rate": "6.29", "apr": "6.308", "mortgage_type": "uninsured", "product": "6 Year Fixed Closed"},
            {"term": 84, "type": RateType.FIXED, "rate": "6.40", "apr": "6.415", "mortgage_type": "uninsured", "product": "7 Year Fixed Closed"},
            {"term": 120, "type": RateType.FIXED, "rate": "6.40", "apr": "6.415", "mortgage_type": "uninsured", "product": "10 Year Fixed Closed"},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.INSURED if item.get("mortgage_type") == "insured" else MortgageType.UNINSURED
            
            raw_data = {
                "source": "td_fallback_2026-04-25",
                "apr": item.get("apr"),
                "product": item.get("product"),
                "featured": item.get("featured", False),
                "note": item.get("note", ""),
                "prime_rate": "4.60",
                "last_verified": "2026-04-25"
            }
            
            rates.append(RawRate(
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                term_months=item["term"],
                rate_type=item["type"],
                mortgage_type=mortgage_type,
                rate=Decimal(item["rate"]),
                posted_rate=Decimal(item["posted"]) if item.get("posted") else None,
                source_url=self.RATE_URL,
                scraped_at=self.scraped_at,
                raw_data=raw_data
            ))
        
        return rates


if __name__ == "__main__":
    scraper = TDScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from TD:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            apr = r.raw_data.get("apr", "")
            posted = r.posted_rate
            featured = " [FEATURED]" if r.raw_data.get("featured") else ""
            posted_str = f" (posted: {posted}%)" if posted else ""
            print(f"  {r.mortgage_type.value:10} {years:3}yr {r.rate_type.value:8} {r.rate}%{posted_str} (APR: {apr}%){featured}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()