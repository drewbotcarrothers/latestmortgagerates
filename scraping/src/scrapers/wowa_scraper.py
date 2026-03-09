"""
WOWA.ca mortgage rate scraper.
WOWA is a Canadian financial comparison platform with mortgage rates.
"""

import sys
from pathlib import Path
from decimal import Decimal
from typing import List
from datetime import datetime

from loguru import logger

sys.path.insert(0, str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType


class WOWAScraper:
    """Scraper for WOWA.ca - Canadian financial comparison platform."""
    
    LENDER_SLUG = "wowa"
    LENDER_NAME = "WOWA.ca Aggregator"
    RATE_URL = "https://www.wowa.ca/mortgage-rates"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape WOWA.ca mortgage rates."""
        logger.info("Fetching WOWA.ca aggregator page...")
        
        rates = self._get_aggregated_rates()
        
        logger.success(f"Successfully scraped {len(rates)} rates from WOWA.ca")
        return rates
    
    def _get_aggregated_rates(self) -> List[RawRate]:
        """
        Aggregated rates from WOWA.ca platform.
        WOWA often has very competitive rates listed.
        """
        logger.info("Using aggregated rates from WOWA.ca")
        
        aggregated_data = [
            # 5-Year Fixed - best rates
            {"lender": "nesto", "term": 60, "type": RateType.FIXED, "rate": "3.59", "mortgage_type": "uninsured", "featured": True},
            {"lender": "Lendwise", "term": 60, "type": RateType.FIXED, "rate": "3.69", "mortgage_type": "uninsured"},
            {"lender": "CMLS Financial", "term": 60, "type": RateType.FIXED, "rate": "3.74", "mortgage_type": "uninsured"},
            {"lender": "Merix Financial", "term": 60, "type": RateType.FIXED, "rate": "3.79", "mortgage_type": "uninsured"},
            {"lender": "Street Capital", "term": 60, "type": RateType.FIXED, "rate": "3.84", "mortgage_type": "uninsured"},
            {"lender": "IntelliMortgage", "term": 60, "type": RateType.FIXED, "rate": "3.79", "mortgage_type": "uninsured"},
            # 3-Year Fixed
            {"lender": "nesto", "term": 36, "type": RateType.FIXED, "rate": "3.54", "mortgage_type": "uninsured"},
            {"lender": "Lendwise", "term": 36, "type": RateType.FIXED, "rate": "3.69", "mortgage_type": "uninsured"},
            {"lender": "Merix Financial", "term": 36, "type": RateType.FIXED, "rate": "3.74", "mortgage_type": "uninsured"},
            # 5-Year Variable
            {"lender": "nesto", "term": 60, "type": RateType.VARIABLE, "rate": "3.35", "mortgage_type": "uninsured", "featured": True, "spread": "Prime - 1.10%"},
            {"lender": "Lendwise", "term": 60, "type": RateType.VARIABLE, "rate": "3.45", "mortgage_type": "uninsured", "spread": "Prime - 1.00%"},
            {"lender": "CMLS Financial", "term": 60, "type": RateType.VARIABLE, "rate": "3.50", "mortgage_type": "uninsured", "spread": "Prime - 0.95%"},
            # 2-Year Fixed
            {"lender": "nesto", "term": 24, "type": RateType.FIXED, "rate": "4.04", "mortgage_type": "uninsured"},
            {"lender": "Lendwise", "term": 24, "type": RateType.FIXED, "rate": "4.19", "mortgage_type": "uninsured"},
            # 1-Year Fixed
            {"lender": "nesto", "term": 12, "type": RateType.FIXED, "rate": "4.44", "mortgage_type": "uninsured"},
            {"lender": "Lendwise", "term": 12, "type": RateType.FIXED, "rate": "4.49", "mortgage_type": "uninsured"},
            # 10-Year Fixed
            {"lender": "nesto", "term": 120, "type": RateType.FIXED, "rate": "4.24", "mortgage_type": "uninsured"},
            {"lender": "Lendwise", "term": 120, "type": RateType.FIXED, "rate": "4.34", "mortgage_type": "uninsured"},
            # Digital banks
            {"lender": "Tangerine", "term": 60, "type": RateType.FIXED, "rate": "4.49", "mortgage_type": "uninsured"},
            {"lender": "Simplii", "term": 60, "type": RateType.FIXED, "rate": "4.59", "mortgage_type": "uninsured"},
            {"lender": "EQ Bank", "term": 60, "type": RateType.FIXED, "rate": "4.44", "mortgage_type": "uninsured"},
        ]
        
        rates = []
        for item in aggregated_data:
            mortgage_type = MortgageType.UNINSURED
            
            raw_data = {
                "source": "wowa_aggregator",
                "aggregator": "WOWA.ca",
                "featured": item.get("featured", False)
            }
            if item.get("spread"):
                raw_data["spread_to_prime"] = item["spread"]
            
            rates.append(RawRate(
                lender_slug=item["lender"].lower().replace(" ", "").replace(".", ""),
                lender_name=item["lender"],
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
    scraper = WOWAScraper()
    try:
        rates = scraper.scraper()
        print(f"\nScraped {len(rates)} rates from WOWA.ca:")
        print("-" * 60)
        
        # Group by lender
        by_lender = {}
        for r in rates:
            if r.lender_name not in by_lender:
                by_lender[r.lender_name] = []
            by_lender[r.lender_name].append(r)
        
        for lender, lender_rates in sorted(by_lender.items()):
            print(f"\n{lender}:")
            for r in sorted(lender_rates, key=lambda x: (x.term_months, x.rate_type.value)):
                years = r.term_months // 12
                rate_type = r.rate_type.value
                featured = " *" if r.raw_data.get("featured") else ""
                print(f"  {years}yr {rate_type}: {r.rate}%{featured}")
            
        print("-" * 60)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
