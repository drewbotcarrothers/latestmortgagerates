"""
Scotiabank mortgage rate scraper.
Uses Playwright for live scraping with fallback to captured rates.
Updated: July 19, 2026
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

# Import stealth helper
sys.path.append(str(Path(__file__).parent))
from stealth import scrape_with_stealth, simple_table_extractor


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
            # Try stealth scraping first
            rates = self._scrape_with_stealth()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Scotiabank")
                return rates
        except Exception as e:
            logger.warning(f"Stealth scraping failed: {e}")
        
        # Fallback to static data
        logger.info("Using fallback rates from Scotiabank website (Jul 19, 2026)")
        rates = self._get_fallback_rates()
        return rates
    
    def _scrape_with_stealth(self) -> List[RawRate]:
        """Use stealth Playwright to scrape live rates."""
        def extract_rates(page):
            results = simple_table_extractor(page)
            rates = []
            for r in results:
                term_text = r["term_text"]
                rate = Decimal(r["rate"])
                term_months = r["term_months"]
                
                rate_type = RateType.VARIABLE if 'variable' in term_text.lower() else RateType.FIXED
                mortgage_type = MortgageType.INSURED if 'insured' in term_text.lower() or 'high-ratio' in term_text.lower() else MortgageType.UNINSURED
                
                # Scotiabank shows posted rates - mark them
                is_posted = 'posted' in term_text.lower() or rate > 6.0
                
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
                        "source": "scotiabank_live_scrape",
                        "scraped_with": "stealth",
                        "posted": is_posted,
                        "section": "posted" if is_posted else "special"
                    }
                ))
            return rates
        
        result = scrape_with_stealth(self.RATE_URL, extract_rates, wait_for="domcontentloaded", timeout=25000)
        return result or []
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates from Scotiabank website (July 19, 2026).
        NOTE: Scotiabank shows posted rates prominently. Special rates require login.
        """
        logger.info("Using fallback rates from Scotiabank website (Jul 19, 2026)")
        
        fallback_data = [
            # Posted Rates (as shown on website)
            {"term": 6, "type": RateType.FIXED, "rate": "6.45", "mortgage_type": "uninsured", "product": "6 Month Fixed (Posted)", "posted": True},
            {"term": 12, "type": RateType.FIXED, "rate": "5.59", "mortgage_type": "uninsured", "product": "1 Year Fixed (Posted)", "posted": True},
            {"term": 12, "type": RateType.FIXED, "rate": "9.50", "mortgage_type": "uninsured", "product": "1 Year Open Fixed", "posted": True},
            {"term": 24, "type": RateType.FIXED, "rate": "4.89", "mortgage_type": "uninsured", "product": "2 Year Fixed (Posted)", "posted": True},
            {"term": 36, "type": RateType.FIXED, "rate": "5.80", "mortgage_type": "uninsured", "product": "3 Year Fixed (Posted)", "posted": True},
            {"term": 36, "type": RateType.VARIABLE, "rate": "5.70", "mortgage_type": "uninsured", "product": "3 Year Variable (Posted)", "posted": True},
            {"term": 48, "type": RateType.FIXED, "rate": "5.74", "mortgage_type": "uninsured", "product": "4 Year Fixed (Posted)", "posted": True},
            {"term": 60, "type": RateType.FIXED, "rate": "5.84", "mortgage_type": "uninsured", "product": "5 Year Fixed (Posted)", "posted": True, "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.65", "mortgage_type": "uninsured", "product": "5 Year Variable Closed", "posted": False},
            {"term": 60, "type": RateType.VARIABLE, "rate": "7.40", "mortgage_type": "uninsured", "product": "5 Year Variable Open", "posted": True},
            {"term": 84, "type": RateType.FIXED, "rate": "6.15", "mortgage_type": "uninsured", "product": "7 Year Fixed (Posted)", "posted": True},
            {"term": 120, "type": RateType.FIXED, "rate": "6.55", "mortgage_type": "uninsured", "product": "10 Year Fixed (Posted)", "posted": True},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.INSURED if item.get("mortgage_type") == "insured" else MortgageType.UNINSURED
            
            raw_data = {
                "source": "scotiabank_fallback_2026-07-19",
                "product": item.get("product"),
                "section": "posted" if item.get("posted") else "special",
                "posted": item.get("posted", False),
                "featured": item.get("featured", False),
                "last_verified": "2026-07-19",
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
            is_posted = r.raw_data.get("posted", False)
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
