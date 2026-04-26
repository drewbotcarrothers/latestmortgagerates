"""
Butler Mortgage rate scraper.
Uses Playwright for live scraping with fallback to captured rates.
Updated: April 25, 2026
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


class ButlerMortgageScraper:
    """Scraper for Butler Mortgage rates."""
    
    LENDER_SLUG = "butlermortgage"
    LENDER_NAME = "Butler Mortgage"
    RATE_URL = "https://www.butlermortgage.ca/low-mortgage-rates/"
    
    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)
    
    def scrape(self) -> List[RawRate]:
        """Scrape Butler Mortgage rates from their website."""
        logger.info("Fetching Butler Mortgage rate page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates and len(rates) > 0:
                logger.success(f"Successfully scraped {len(rates)} live rates from Butler Mortgage")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        logger.info("Using fallback rates from Butler Mortgage (Apr 25, 2026)")
        return self._get_fallback_rates()
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Scrape rates using Playwright browser automation."""
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
                text_content = page.inner_text("body")
                
                # Parse fixed rates
                fixed_rates = self._parse_rates_from_text(text_content, RateType.FIXED)
                rates.extend(fixed_rates)
                
                # Parse variable rates
                variable_rates = self._parse_rates_from_text(text_content, RateType.VARIABLE)
                rates.extend(variable_rates)
                
                browser.close()
                return rates
                
        except ImportError:
            logger.warning("Playwright not available")
            return []
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return []
    
    def _parse_rates_from_text(self, text: str, rate_type: RateType) -> List[RawRate]:
        """Parse rates from page text content."""
        rates = []
        
        term_patterns = {
            '6[- ]?MTH': 6,
            '1[- ]?YEAR': 12,
            '2[- ]?YEAR': 24,
            '3[- ]?YEAR': 36,
            '4[- ]?YEAR': 48,
            '5[- ]?YEAR': 60,
            '7[- ]?YEAR': 84,
            '10[- ]?YEAR': 120,
        }
        
        lines = text.split('\n')
        
        for i, line in enumerate(lines):
            line = line.strip()
            
            for pattern, months in term_patterns.items():
                if re.search(pattern, line, re.IGNORECASE):
                    for j in range(i+1, min(i+5, len(lines))):
                        rate_line = lines[j].strip()
                        rate_match = re.search(r'(\d+\.\d+)\s*%', rate_line)
                        if rate_match:
                            rate_value = Decimal(rate_match.group(1))
                            featured = months == 60
                            
                            raw_data = {
                                "source": "butlermortgage_live_scrape",
                                "featured": featured,
                                "extracted_from": rate_line[:100]
                            }
                            
                            rates.append(RawRate(
                                lender_slug=self.LENDER_SLUG,
                                lender_name=self.LENDER_NAME,
                                term_months=months,
                                rate_type=rate_type,
                                mortgage_type=MortgageType.UNINSURED,
                                rate=rate_value,
                                source_url=self.RATE_URL,
                                scraped_at=self.scraped_at,
                                raw_data=raw_data
                            ))
                            break
        
        # Remove duplicates
        seen = set()
        unique_rates = []
        for r in rates:
            key = (r.term_months, r.rate_type.value)
            if key not in seen:
                seen.add(key)
                unique_rates.append(r)
        
        return unique_rates
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates from Butler Mortgage (April 25, 2026).
        Major mortgage brokerage with competitive broker rates.
        """
        logger.info("Using fallback rates from Butler Mortgage (Apr 25, 2026)")
        
        fallback_data = [
            {"term": 6, "type": RateType.FIXED, "rate": "4.14", "mortgage_type": "uninsured", "product": "6 Month Fixed"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.24", "mortgage_type": "uninsured", "product": "2 Year Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "3.79", "mortgage_type": "uninsured", "product": "3 Year Fixed", "featured": True},
            {"term": 48, "type": RateType.FIXED, "rate": "4.24", "mortgage_type": "uninsured", "product": "4 Year Fixed"},
            {"term": 60, "type": RateType.FIXED, "rate": "3.89", "mortgage_type": "uninsured", "product": "5 Year Fixed", "featured": True},
            {"term": 84, "type": RateType.FIXED, "rate": "5.24", "mortgage_type": "uninsured", "product": "7 Year Fixed"},
            {"term": 120, "type": RateType.FIXED, "rate": "5.44", "mortgage_type": "uninsured", "product": "10 Year Fixed"},
            {"term": 36, "type": RateType.VARIABLE, "rate": "4.10", "mortgage_type": "uninsured", "product": "3 Year Variable"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.60", "mortgage_type": "uninsured", "product": "5 Year Variable", "featured": True, "spread": "P - 0.85%"},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.UNINSURED
            
            raw_data = {
                "source": "butlermortgage_fallback_2026-04-25",
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
    scraper = ButlerMortgageScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Butler Mortgage:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.term_months, x.rate_type.value)):
            years = r.term_months // 12 if r.term_months >= 12 else f"{r.term_months}m"
            featured = " [FEATURED]" if r.raw_data.get("featured") else ""
            spread = r.raw_data.get("spread_to_prime", "")
            spread_str = f" [{spread}]" if spread else ""
            print(f"  {years}yr {r.rate_type.value:8} {r.rate}%{spread_str}{featured}")
            
        print("-" * 60)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()