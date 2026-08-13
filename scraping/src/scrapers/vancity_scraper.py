"""
Vancity Credit Union mortgage rate scraper.
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


class VancityScraper:
    """Scraper for Vancity Credit Union mortgage rates."""
    
    LENDER_SLUG = "vancity"
    LENDER_NAME = "Vancity"
    RATE_URL = "https://www.vancity.com/rates/mortgages"
    
    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)
    
    def scrape(self) -> List[RawRate]:
        """Scrape Vancity mortgage rates."""
        logger.info("Fetching Vancity rate page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Vancity")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        logger.info("Using fallback rates from Vancity (2026-07-19)")
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
                
                # Vancity has multiple tables with mortgage rates
                # Try to extract from tables on the page
                try:
                    tables = page.locator('table')
                    table_count = tables.count()
                    logger.info(f"Found {table_count} tables on Vancity rates page")
                    
                    for i in range(min(table_count, 10)):
                        try:
                            table = tables.nth(i)
                            table_text = table.inner_text()
                            
                            # Look for term and rate pairs in table rows
                            # Pattern: "X-year" in one cell, rate in another
                            row_patterns = [
                                (r'(\d+)[-\s]*year[^\d]*?(?:fixed|term)[^\d]*?(\d+\.\d+)', RateType.FIXED),
                                (r'(\d+)[-\s]*year[^\d]*?variable[^\d]*?(\d+\.\d+)', RateType.VARIABLE),
                            ]
                            
                            for pattern, rate_type in row_patterns:
                                matches = re.finditer(pattern, table_text, re.IGNORECASE)
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
                                                raw_data={"source": "vancity_table_scrape", "years": years}
                                            ))
                                    except:
                                        pass
                        except:
                            pass
                            
                except Exception as e:
                    logger.warning(f"Table extraction failed: {e}")
                
                # Also try content-based extraction
                if not rates:
                    content = page.content()
                    patterns = [
                        (r'(\d+)[-\s]*year[^\d]*?fixed[^\d]*?(\d+\.\d+)', RateType.FIXED),
                        (r'(\d+)[-\s]*year[^\d]*?variable[^\d]*?(\d+\.\d+)', RateType.VARIABLE),
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
                                        raw_data={"source": "vancity_live_scrape", "years": years}
                                    ))
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
        Fallback rates from Vancity (April 25, 2026).
        Major BC credit union.
        """
        logger.info("Using fallback rates from Vancity (2026-07-19)")
        
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "5.14", "mortgage_type": "uninsured", "product": "1 Year Fixed"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.84", "mortgage_type": "uninsured", "product": "2 Year Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.29", "mortgage_type": "uninsured", "product": "3 Year Fixed", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "3.94", "mortgage_type": "uninsured", "product": "5 Year Fixed", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.30", "mortgage_type": "uninsured", "product": "5 Year Variable", "featured": True, "spread": "Prime - 0.65%"},
            {"term": 84, "type": RateType.FIXED, "rate": "4.29", "mortgage_type": "uninsured", "product": "7 Year Fixed"},
            {"term": 120, "type": RateType.FIXED, "rate": "4.34", "mortgage_type": "uninsured", "product": "10 Year Fixed"},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.UNINSURED
            
            raw_data = {
                "source": "vancity_fallback_2026-07-19",
                "product": item.get("product"),
                "featured": item.get("featured", False),
                "last_verified": "2026-07-19"
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
    scraper = VancityScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Vancity:")
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