"""
Home Trust mortgage rate scraper.
Uses Playwright for live scraping with fallback to captured rates.
Updated: July 19, 2026
"""

import re
from decimal import Decimal
from typing import List
from datetime import datetime, timezone
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType


class HomeTrustScraper:
    """Scraper for Home Trust mortgage rates."""
    
    LENDER_SLUG = "hometrust"
    LENDER_NAME = "Home Trust"
    RATE_URL = "https://www.hometrust.ca/mortgages/rates/"
    
    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)
    
    def scrape(self) -> List[RawRate]:
        """Scrape Home Trust mortgage rates."""
        logger.info("Fetching Home Trust rate page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Home Trust")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        logger.info("Using fallback rates from Home Trust (2026-07-19)")
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
                
                page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=30000)
                page.wait_for_timeout(5000)
                
                rates = []
                
                # Home Trust has two product sections with posted rates
                # Accelerator Mortgage (insured) and Classic Mortgage
                content = page.content()
                
                # Extract from the posted rates tables
                # Pattern: "1 year fixed" followed by rate value
                patterns = [
                    (r'1\s+year\s+fixed.*?([\d.]+)%', RateType.FIXED, 12),
                    (r'2\s+year\s+fixed.*?([\d.]+)%', RateType.FIXED, 24),
                    (r'3\s+year\s+fixed.*?([\d.]+)%', RateType.FIXED, 36),
                    (r'4\s+year\s+fixed.*?([\d.]+)%', RateType.FIXED, 48),
                    (r'5\s+year\s+fixed.*?([\d.]+)%', RateType.FIXED, 60),
                    (r'5\s+year\s+variable.*?([\d.]+)%', RateType.VARIABLE, 60),
                ]
                
                # Try to extract from visible text first
                page_text = page.inner_text('body')
                
                for pattern, rate_type, term_months in patterns:
                    matches = re.finditer(pattern, page_text, re.IGNORECASE | re.DOTALL)
                    for match in matches:
                        try:
                            rate = Decimal(match.group(1))
                            if 2 <= rate <= 10:
                                rates.append(RawRate(
                                    lender_slug=self.LENDER_SLUG,
                                    lender_name=self.LENDER_NAME,
                                    term_months=term_months,
                                    rate_type=rate_type,
                                    mortgage_type=MortgageType.UNINSURED,
                                    rate=rate,
                                    source_url=self.RATE_URL,
                                    scraped_at=self.scraped_at,
                                    raw_data={"source": "hometrust_live_scrape"}
                                ))
                        except:
                            pass
                
                # Also try table extraction
                try:
                    tables = page.locator('table')
                    for i in range(min(tables.count(), 3)):
                        table_text = tables.nth(i).inner_text()
                        table_patterns = [
                            (r'(\d+)\s+year.*?fixed.*?([\d.]+)%', RateType.FIXED),
                        ]
                        for pattern, rate_type in table_patterns:
                            matches = re.finditer(pattern, table_text, re.IGNORECASE | re.DOTALL)
                            for match in matches:
                                try:
                                    years = int(match.group(1))
                                    rate = Decimal(match.group(2))
                                    if 1 <= years <= 10 and 2 <= rate <= 10:
                                        term_months = years * 12
                                        rates.append(RawRate(
                                            lender_slug=self.LENDER_SLUG,
                                            lender_name=self.LENDER_NAME,
                                            term_months=term_months,
                                            rate_type=rate_type,
                                            mortgage_type=MortgageType.UNINSURED,
                                            rate=rate,
                                            source_url=self.RATE_URL,
                                            scraped_at=self.scraped_at,
                                            raw_data={"source": "hometrust_table_scrape", "years": years}
                                        ))
                                except:
                                    pass
                except:
                    pass
                
                browser.close()
                
                # Remove duplicates
                seen = set()
                unique_rates = []
                for r in rates:
                    key = (r.term_months, r.rate_type.value, str(r.rate))
                    if key not in seen:
                        seen.add(key)
                        unique_rates.append(r)
                return unique_rates
                
        except ImportError:
            logger.warning("Playwright not available")
            return []
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return []
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates from Home Trust (April 25, 2026).
        Alternative mortgage lender, part of Home Capital Group.
        """
        logger.info("Using fallback rates from Home Trust (2026-07-19)")
        
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "5.09", "mortgage_type": "uninsured", "product": "1 Year Fixed"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.79", "mortgage_type": "uninsured", "product": "2 Year Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.19", "mortgage_type": "uninsured", "product": "3 Year Fixed", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.09", "mortgage_type": "uninsured", "product": "5 Year Fixed", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.35", "mortgage_type": "uninsured", "product": "5 Year Variable"},
            {"term": 120, "type": RateType.FIXED, "rate": "4.29", "mortgage_type": "uninsured", "product": "10 Year Fixed"},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.UNINSURED
            
            raw_data = {
                "source": "hometrust_fallback_2026-07-19",
                "product": item.get("product"),
                "featured": item.get("featured", False),
                "last_verified": "2026-07-19"
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
    scraper = HomeTrustScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Home Trust:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.term_months, x.rate_type.value)):
            years = r.term_months // 12
            featured = " [FEATURED]" if r.raw_data.get("featured") else ""
            print(f"  {years}yr {r.rate_type.value:8} {r.rate}%{featured}")
            
        print("-" * 60)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()