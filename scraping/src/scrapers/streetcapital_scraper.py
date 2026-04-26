"""
Street Capital mortgage rate scraper.
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


class StreetCapitalScraper:
    """Scraper for Street Capital mortgage rates."""
    
    LENDER_SLUG = "streetcapital"
    LENDER_NAME = "Street Capital"
    RATE_URL = "https://www.streetcapital.ca/mortgage-rates"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape Street Capital mortgage rates."""
        logger.info("Fetching Street Capital rate page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Street Capital")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        logger.info("Using fallback rates from Street Capital (Apr 25, 2026)")
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
                                    raw_data={"source": "streetcapital_live_scrape", "years": years}
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
        Fallback rates from Street Capital (April 25, 2026).
        One of Canada's largest monoline mortgage lenders.
        """
        logger.info("Using fallback rates from Street Capital (Apr 25, 2026)")
        
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "5.34", "mortgage_type": "uninsured", "product": "1 Year Fixed"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.04", "mortgage_type": "uninsured", "product": "2 Year Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.69", "mortgage_type": "uninsured", "product": "3 Year Fixed", "featured": True},
            {"term": 48, "type": RateType.FIXED, "rate": "4.59", "mortgage_type": "uninsured", "product": "4 Year Fixed"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.29", "mortgage_type": "uninsured", "product": "5 Year Fixed", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.75", "mortgage_type": "uninsured", "product": "5 Year Variable", "featured": True, "spread": "Prime - 0.70%"},
            {"term": 84, "type": RateType.FIXED, "rate": "4.49", "mortgage_type": "uninsured", "product": "7 Year Fixed"},
            {"term": 120, "type": RateType.FIXED, "rate": "4.64", "mortgage_type": "uninsured", "product": "10 Year Fixed"},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.UNINSURED
            
            raw_data = {
                "source": "streetcapital_fallback_2026-04-25",
                "product": item.get("product"),
                "featured": item.get("featured", False),
                "last_verified": "2026-04-25"
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


if __name__ == "__main__":
    scraper = StreetCapitalScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Street Capital:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.term_months, x.rate_type.value)):
            years = r.term_months // 12
            featured = " [FEATURED]" if r.raw_data.get("featured") else ""
            spread = r.raw_data.get("spread_to_prime", "")
            spread_str = f" [{spread}]" if spread else ""
            print(f"  {years}yr {r.rate_type.value:8} {r.rate}%{spread_str}{featured}")
            
        print("-" * 60)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()