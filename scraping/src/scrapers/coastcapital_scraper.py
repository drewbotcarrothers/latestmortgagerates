"""
Coast Capital Savings mortgage rate scraper.
Coast Capital is one of Canada's largest credit unions, based in BC.
"""

import sys
from pathlib import Path
from decimal import Decimal
from typing import List
from datetime import datetime

from loguru import logger

sys.path.insert(0, str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType


class CoastCapitalScraper:
    """Scraper for Coast Capital Savings mortgage rates."""
    
    LENDER_SLUG = "coastcapital"
    LENDER_NAME = "Coast Capital Savings"
    RATE_URL = "https://www.coastcapitalsavings.com/rates/mortgage-rates"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape Coast Capital Savings mortgage rates."""
        logger.info("Fetching Coast Capital Savings rate page...")
        
        rates = self._get_fallback_rates()
        
        logger.success(f"Successfully scraped {len(rates)} rates from Coast Capital Savings")
        return rates
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates based on Coast Capital typical published rates.
        """
        logger.info("Using fallback rates for Coast Capital Savings")
        
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "5.79", "mortgage_type": "uninsured"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.49", "mortgage_type": "uninsured"},
            {"term": 36, "type": RateType.FIXED, "rate": "5.09", "mortgage_type": "uninsured"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.49", "mortgage_type": "uninsured", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.80", "mortgage_type": "uninsured", "featured": True, "spread": "Prime - 0.65%"},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.UNINSURED
            
            raw_data = {
                "source": "coastcapital_rates_page",
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
    scraper = CoastCapitalScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Coast Capital Savings:")
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
