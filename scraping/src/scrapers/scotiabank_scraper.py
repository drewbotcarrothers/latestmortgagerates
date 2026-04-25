"""
Scotiabank mortgage rate scraper.
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


class ScotiabankScraper:
    """Scraper for Scotiabank mortgage rates."""
    
    LENDER_SLUG = "scotiabank"
    LENDER_NAME = "Scotiabank"
    RATE_URL = "https://www.scotiabank.com/ca/en/personal/rates-prices/mortgages-rates.html"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape Scotiabank mortgage rates."""
        logger.info("Fetching Scotiabank rate page...")
        
        try:
            # Try Playwright first
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Scotiabank")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        # Fallback to static data
        logger.info("Using fallback rates from Scotiabank website (Apr 25, 2026)")
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
                
                # Extract from rate tables
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
                                mortgage_type = MortgageType.INSURED if 'insured' in term_text.lower() or 'high-ratio' in term_text.lower() else MortgageType.UNINSURED
                                
                                rates.append(RawRate(
                                    lender_slug=self.LENDER_SLUG,
                                    lender_name=self.LENDER_NAME,
                                    term_months=term_months,
                                    rate_type=rate_type,
                                    mortgage_type=mortgage_type,
                                    rate=rate,
                                    source_url=self.RATE_URL,
                                    scraped_at=self.scraped_at,
                                    raw_data={"source": "scotiabank_live_scrape"}
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
        Fallback rates from Scotiabank website (April 25, 2026).
        Based on production data from scraped output.
        NOTE: Scotiabank shows posted rates prominently. Special rates require login.
        """
        logger.info("Using fallback rates from Scotiabank website (Apr 25, 2026)")
        
        # From production data - mostly posted rates (Apr 25, 2026)
        # NOTE: Scotiabank advertised rates on website are posted rates
        # Special/discounted rates require pre-approval or advisor contact
        
        fallback_data = [
            # Posted Rates (as shown on website)
            {"term": 6, "type": RateType.FIXED, "rate": "6.70", "mortgage_type": "uninsured", "product": "6 Month Fixed (Posted)", "posted": True},
            {"term": 12, "type": RateType.FIXED, "rate": "5.84", "mortgage_type": "uninsured", "product": "1 Year Fixed (Posted)", "posted": True},
            {"term": 12, "type": RateType.FIXED, "rate": "9.75", "mortgage_type": "uninsured", "product": "1 Year Open Fixed", "posted": True},
            {"term": 24, "type": RateType.FIXED, "rate": "5.14", "mortgage_type": "uninsured", "product": "2 Year Fixed (Posted)", "posted": True},
            {"term": 36, "type": RateType.FIXED, "rate": "6.05", "mortgage_type": "uninsured", "product": "3 Year Fixed (Posted)", "posted": True},
            {"term": 36, "type": RateType.VARIABLE, "rate": "5.95", "mortgage_type": "uninsured", "product": "3 Year Variable (Posted)", "posted": True},
            {"term": 48, "type": RateType.FIXED, "rate": "5.99", "mortgage_type": "uninsured", "product": "4 Year Fixed (Posted)", "posted": True},
            {"term": 60, "type": RateType.FIXED, "rate": "6.09", "mortgage_type": "uninsured", "product": "5 Year Fixed (Posted)", "posted": True, "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.90", "mortgage_type": "uninsured", "product": "5 Year Variable Closed", "posted": False},
            {"term": 60, "type": RateType.VARIABLE, "rate": "7.65", "mortgage_type": "uninsured", "product": "5 Year Variable Open", "posted": True},
            {"term": 84, "type": RateType.FIXED, "rate": "6.40", "mortgage_type": "uninsured", "product": "7 Year Fixed (Posted)", "posted": True},
            {"term": 120, "type": RateType.FIXED, "rate": "6.80", "mortgage_type": "uninsured", "product": "10 Year Fixed (Posted)", "posted": True},
            
            # NOTE: Scotiabank special rates (discounted) are NOT publicly listed
            # These would require:
            # - Online pre-qualification
            # - Branch visit
            # - Mortgage advisor consultation
            # Typical discounts: 1.50-2.00% off posted rates
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.INSURED if item.get("mortgage_type") == "insured" else MortgageType.UNINSURED
            
            raw_data = {
                "source": "scotiabank_fallback_2026-04-25",
                "product": item.get("product"),
                "posted_rate": item.get("posted", False),
                "featured": item.get("featured", False),
                "last_verified": "2026-04-25",
                "note": "Scotiabank shows posted rates. Special/discounted rates require pre-approval or advisor contact."
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
    scraper = ScotiabankScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Scotiabank:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.term_months, x.rate_type.value)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            is_posted = r.raw_data.get("posted_rate", False)
            posted_str = " [POSTED]" if is_posted else ""
            featured = " [FEATURED]" if r.raw_data.get("featured") else ""
            print(f"  {years:3}yr {r.rate_type.value:8} {r.rate}%{posted_str}{featured}")
            if product:
                print(f"    {product}")
        
        print("\n" + "-" * 60)
        print("NOTE: Scotiabank prominently displays POSTED rates on their website.")
        print("Special/discounted rates require pre-approval or advisor contact.")
        print("Typical discounts: 1.50-2.00% off posted rates.")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()