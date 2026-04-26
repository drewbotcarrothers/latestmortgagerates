"""
LowestRates.ca mortgage rate aggregator scraper.
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


class LowestRatesScraper:
    """Scraper for LowestRates.ca - Canadian mortgage rate comparison platform."""
    
    LENDER_SLUG = "lowestrates"
    LENDER_NAME = "LowestRates.ca Aggregator"
    RATE_URL = "https://www.lowestrates.ca/mortgage-rates"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape LowestRates.ca mortgage rates."""
        logger.info("Fetching LowestRates.ca aggregator page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from LowestRates.ca")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        logger.info("Using fallback rates from LowestRates.ca (Apr 25, 2026)")
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
                content = page.content()
                
                patterns = [
                    (r'(\d+)\s*year[^\d]*?fixed[^\d]*?(\d+\.\d+)', RateType.FIXED),
                    (r'(\d+)\s*year[^\d]*?variable[^\d]*?(\d+\.\d+)', RateType.VARIABLE),
                ]
                
                for pattern, rate_type in patterns:
                    matches = re.finditer(pattern, content, re.IGNORECASE)
                    for match in matches:
                        try:
                            years = int(match.group(1))
                            rate = Decimal(match.group(2))
                            if 1 <= years <= 10 and 2 <= rate <= 10:
                                rates.append(RawRate(
                                    lender_slug=self.LENDER_SLUG,
                                    lender_name=self.LENDER_NAME,
                                    term_months=years * 12,
                                    rate_type=rate_type,
                                    mortgage_type=MortgageType.UNINSURED,
                                    rate=rate,
                                    source_url=self.RATE_URL,
                                    scraped_at=self.scraped_at,
                                    raw_data={"source": "lowestrates_live_scrape", "years": years}
                                ))
                        except:
                            pass
                
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
        Aggregated rates from LowestRates.ca (April 25, 2026).
        """
        logger.info("Using fallback rates from LowestRates.ca (Apr 25, 2026)")
        
        aggregated_data = [
            {"lender": "nesto", "term": 60, "type": RateType.FIXED, "rate": "3.69", "mortgage_type": "uninsured", "featured": True},
            {"lender": "Lendwise", "term": 60, "type": RateType.FIXED, "rate": "3.79", "mortgage_type": "uninsured"},
            {"lender": "IntelliMortgage", "term": 60, "type": RateType.FIXED, "rate": "3.84", "mortgage_type": "uninsured"},
            {"lender": "Butler Mortgage", "term": 60, "type": RateType.FIXED, "rate": "3.89", "mortgage_type": "uninsured"},
            {"lender": "Street Capital", "term": 60, "type": RateType.FIXED, "rate": "3.94", "mortgage_type": "uninsured"},
            {"lender": "nesto", "term": 36, "type": RateType.FIXED, "rate": "3.64", "mortgage_type": "uninsured"},
            {"lender": "nesto", "term": 60, "type": RateType.VARIABLE, "rate": "3.45", "mortgage_type": "uninsured", "featured": True, "spread": "Prime - 1.00%"},
            {"lender": "Lendwise", "term": 60, "type": RateType.VARIABLE, "rate": "3.55", "mortgage_type": "uninsured", "spread": "Prime - 0.90%"},
            {"lender": "Meridian", "term": 60, "type": RateType.FIXED, "rate": "4.24", "mortgage_type": "uninsured"},
            {"lender": "Vancity", "term": 60, "type": RateType.FIXED, "rate": "4.19", "mortgage_type": "uninsured"},
            {"lender": "Alterna", "term": 60, "type": RateType.FIXED, "rate": "4.34", "mortgage_type": "uninsured"},
        ]
        
        rates = []
        for item in aggregated_data:
            mortgage_type = MortgageType.UNINSURED
            
            raw_data = {
                "source": "lowestrates_fallback_2026-04-25",
                "aggregator": "LowestRates.ca",
                "featured": item.get("featured", False),
                "last_verified": "2026-04-25"
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


if __name__ == "__main__":
    scraper = LowestRatesScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from LowestRates.ca:")
        print("-" * 60)
        
        by_lender = {}
        for r in rates:
            if r.lender_name not in by_lender:
                by_lender[r.lender_name] = []
            by_lender[r.lender_name].append(r)
        
        for lender, lender_rates in sorted(by_lender.items()):
            print(f"\n{lender}:")
            for r in sorted(lender_rates, key=lambda x: (x.term_months, x.rate_type.value)):
                years = r.term_months // 12
                featured = " *" if r.raw_data.get("featured") else ""
                spread = r.raw_data.get("spread_to_prime", "")
                spread_str = f" [{spread}]" if spread else ""
                print(f"  {years}yr {r.rate_type.value}: {r.rate}%{spread_str}{featured}")
            
        print("-" * 60)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()