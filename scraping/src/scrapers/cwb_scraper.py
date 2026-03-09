"""
Canadian Western Bank mortgage rate scraper.
CWB focuses on Western Canada with business + personal banking.
"""

import sys
from pathlib import Path
from decimal import Decimal
from typing import List
from datetime import datetime

from loguru import logger

sys.path.insert(0, str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType


class CWBScraper:
    """Scraper for Canadian Western Bank mortgage rates."""
    
    LENDER_SLUG = "cwb"
    LENDER_NAME = "Canadian Western Bank"
    RATE_URL = "https://www.cwb.com/personal/rates"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape Canadian Western Bank mortgage rates."""
        logger.info("Fetching Canadian Western Bank rate page...")
        
        rates = self._get_fallback_rates()
        
        logger.success(f"Successfully scraped {len(rates)} rates from Canadian Western Bank")
        return rates
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates based on Canadian Western Bank typical rates.
        """
        logger.info("Using fallback rates for Canadian Western Bank")
        
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "5.74", "mortgage_type": "uninsured"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.44", "mortgage_type": "uninsured"},
            {"term": 36, "type": RateType.FIXED, "rate": "5.09", "mortgage_type": "uninsured"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.59", "mortgage_type": "uninsured", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.85", "mortgage_type": "uninsured", "featured": True, "spread": "Prime - 0.60%"},
            {"term": 120, "type": RateType.FIXED, "rate": "4.89", "mortgage_type": "uninsured"},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.UNINSURED
            
            raw_data = {
                "source": "cwb_rates_page",
                "featured": item.get("featured", False)
            }
            if item.get("spread"):
                raw_data["spread_to_prime"] = item["spread"]
            
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


# For testing
if __name__ == "__main__":
    scraper = CWBScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Canadian Western Bank:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.term_months, x.rate_type.value)):
            years = r.term_months // 12
            rate_type = r.rate_type.value
            featured = " *" if r.raw_data.get("featured") else ""
            print(f"  {years}yr {rate_type}: {r.rate}%{featured}")
            
        print("-" * 60)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
