"""
Laurentian Bank mortgage rate scraper.
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


class LaurentianBankScraper:
    """Scraper for Laurentian Bank mortgage rates."""
    
    LENDER_SLUG = "laurentian"
    LENDER_NAME = "Laurentian Bank"
    RATE_URL = "https://www.laurentianbank.ca/en/personal/rates/mortgages"
    
    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)
    
    def scrape(self) -> List[RawRate]:
        """Scrape Laurentian Bank mortgage rates."""
        logger.info("Fetching Laurentian Bank rate page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Laurentian Bank")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        logger.info("Using fallback rates from Laurentian Bank (2026-07-19)")
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
                
                # Laurentian has multiple tables: Fixed-rate, Variable-rate, High-ratio
                tables = page.locator('table')
                table_count = tables.count()
                logger.info(f"Found {table_count} tables on Laurentian rates page")
                
                for i in range(min(table_count, 10)):
                    try:
                        table = tables.nth(i)
                        table_text = table.inner_text()
                        
                        # Extract rows with term and rate
                        # Patterns: "6 months 7.840", "1 year 5.640", "5 years 6.290"
                        patterns = [
                            (r'(?:^|\n)\s*(\d+)\s+(?:months?|mo)[^\d]*?(\d+\.\d+)', RateType.FIXED),
                            (r'(?:^|\n)\s*(\d+)\s+(?:year|yr)s?[^\d]*?(\d+\.\d+)', RateType.FIXED),
                            (r'(?:^|\n)\s*Promotional\s+rate[^\d]*?(\d+)\s+(?:year|yr)[^\d]*?(\d+\.\d+)', RateType.FIXED),
                        ]
                        
                        for pattern, rate_type in patterns:
                            matches = re.finditer(pattern, table_text, re.IGNORECASE)
                            for match in matches:
                                try:
                                    if 'promotional' in match.group(0).lower():
                                        years = int(match.group(1))
                                        rate = Decimal(match.group(2))
                                    else:
                                        term_str = match.group(1)
                                        rate = Decimal(match.group(2))
                                        years = int(term_str)
                                    
                                    if years <= 10 and 2 <= rate <= 10:
                                        term_months = years * 12 if years >= 1 else 6
                                        rates.append(RawRate(
                                            lender_slug=self.LENDER_SLUG,
                                            lender_name=self.LENDER_NAME,
                                            term_months=term_months,
                                            rate_type=rate_type,
                                            mortgage_type=MortgageType.UNINSURED,
                                            rate=rate,
                                            source_url=self.RATE_URL,
                                            scraped_at=self.scraped_at,
                                            raw_data={"source": "laurentian_table_scrape", "years": years}
                                        ))
                                except:
                                    pass
                                    
                    except Exception as e:
                        logger.warning(f"Table {i} extraction failed: {e}")
                        continue
                
                # Also try to extract variable rates
                try:
                    content = page.content()
                    var_patterns = [
                        (r'Variable-rate\s+mortgage.*?([\d.]+)%', RateType.VARIABLE, 60),  # 5 year variable
                    ]
                    for pattern, rate_type, term in var_patterns:
                        match = re.search(pattern, content, re.IGNORECASE | re.DOTALL)
                        if match:
                            rate = Decimal(match.group(1))
                            if 2 <= rate <= 10:
                                rates.append(RawRate(
                                    lender_slug=self.LENDER_SLUG,
                                    lender_name=self.LENDER_NAME,
                                    term_months=term,
                                    rate_type=rate_type,
                                    mortgage_type=MortgageType.UNINSURED,
                                    rate=rate,
                                    source_url=self.RATE_URL,
                                    scraped_at=self.scraped_at,
                                    raw_data={"source": "laurentian_live_scrape"}
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
        Fallback rates from Laurentian Bank (April 25, 2026).
        """
        logger.info("Using fallback rates from Laurentian Bank (2026-07-19)")
        
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "5.49", "mortgage_type": "uninsured", "product": "1 Year Fixed"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.19", "mortgage_type": "uninsured", "product": "2 Year Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.89", "mortgage_type": "uninsured", "product": "3 Year Fixed", "featured": True},
            {"term": 48, "type": RateType.FIXED, "rate": "4.89", "mortgage_type": "uninsured", "product": "4 Year Fixed"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.89", "mortgage_type": "uninsured", "product": "5 Year Fixed", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.74", "mortgage_type": "insured", "product": "5 Year Fixed (Insured)"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.35", "mortgage_type": "uninsured", "product": "5 Year Variable"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.15", "mortgage_type": "insured", "product": "5 Year Variable (Insured)"},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.INSURED if item.get("mortgage_type") == "insured" else MortgageType.UNINSURED
            
            raw_data = {
                "source": "laurentian_fallback_2026-07-19",
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
    scraper = LaurentianBankScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Laurentian Bank:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            featured = " [FEATURED]" if r.raw_data.get("featured") else ""
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}%{featured}")
            if product:
                print(f"    {product}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()