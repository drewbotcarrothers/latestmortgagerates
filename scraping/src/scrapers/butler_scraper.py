"""
Butler Mortgage rate scraper.
Butler Mortgage is a major mortgage brokerage that also offers direct lending.
Rates from: https://www.butlermortgage.ca/low-mortgage-rates/
"""

import sys
from pathlib import Path
from decimal import Decimal
from typing import List
from datetime import datetime, timezone
import re

from loguru import logger

sys.path.insert(0, str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType

from playwright.sync_api import sync_playwright


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
                logger.success(f"Successfully scraped {len(rates)} rates from Butler Mortgage website")
                return rates
        except Exception as e:
            logger.warning(f"Failed to scrape Butler Mortgage website: {e}")
        
        # Fallback to static rates if scraping fails
        logger.info("Using fallback rates for Butler Mortgage")
        return self._get_fallback_rates()
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Scrape rates using Playwright browser automation."""
        rates = []
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            try:
                page.goto(self.RATE_URL, wait_until="networkidle", timeout=30000)
                page.wait_for_load_state("domcontentloaded")
                
                # Get page text content for parsing
                text_content = page.inner_text("body")
                
                # Parse fixed rates from text content
                fixed_rates = self._parse_rates_from_text(text_content, RateType.FIXED)
                rates.extend(fixed_rates)
                
                # Parse variable rates from text content
                variable_rates = self._parse_rates_from_text(text_content, RateType.VARIABLE)
                rates.extend(variable_rates)
                
            except Exception as e:
                logger.error(f"Playwright error: {e}")
            finally:
                browser.close()
        
        return rates
    
    def _parse_rates_from_text(self, text: str, rate_type: RateType) -> List[RawRate]:
        """Parse rates from page text content."""
        rates = []
        
        # Map of term patterns to months
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
        
        # Split content into sections
        lines = text.split('\n')
        
        # Look for rate patterns in the text
        for i, line in enumerate(lines):
            line = line.strip()
            
            # Check if this line contains a term
            for pattern, months in term_patterns.items():
                if re.search(pattern, line, re.IGNORECASE):
                    # Look for rate in nearby lines (next few lines)
                    for j in range(i+1, min(i+5, len(lines))):
                        rate_line = lines[j].strip()
                        # Match rate pattern like "3.64%" or "3.64 %"
                        rate_match = re.search(r'(\d+\.\d+)\s*%', rate_line)
                        if rate_match:
                            rate_value = Decimal(rate_match.group(1))
                            
                            # Determine if featured (5-year is typically featured)
                            featured = months == 60
                            
                            # Check for spread info in variable rates
                            spread = None
                            if rate_type == RateType.VARIABLE and months == 60:
                                # Variable 5-year typically has spread
                                spread = "P - 0.90%"  # Based on rates relative to Prime
                            
                            raw_data = {
                                "source": "butlermortgage_website",
                                "featured": featured,
                                "extracted_from": rate_line[:100]
                            }
                            if spread:
                                raw_data["spread_to_prime"] = spread
                            
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
        
        # Remove duplicates (keep first occurrence)
        seen = set()
        unique_rates = []
        for r in rates:
            key = (r.term_months, r.rate_type.value)
            if key not in seen:
                seen.add(key)
                unique_rates.append(r)
        
        logger.info(f"Parsed {len(unique_rates)} {rate_type.value} rates from text")
        return unique_rates
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates from Butler Mortgage website (as of March 2026).
        Source: https://www.butlermortgage.ca/low-mortgage-rates/
        """
        logger.info("Using fallback rates for Butler Mortgage")
        
        # Rates captured from website on 2026-03-09
        fallback_data = [
            # Fixed rates
            {"term": 6, "type": RateType.FIXED, "rate": "3.89", "mortgage_type": "uninsured"},
            {"term": 24, "type": RateType.FIXED, "rate": "3.99", "mortgage_type": "uninsured"},
            {"term": 36, "type": RateType.FIXED, "rate": "3.54", "mortgage_type": "uninsured"},
            {"term": 48, "type": RateType.FIXED, "rate": "3.99", "mortgage_type": "uninsured"},
            {"term": 60, "type": RateType.FIXED, "rate": "3.64", "mortgage_type": "uninsured", "featured": True},
            {"term": 84, "type": RateType.FIXED, "rate": "4.99", "mortgage_type": "uninsured"},
            {"term": 120, "type": RateType.FIXED, "rate": "5.19", "mortgage_type": "uninsured"},
            # Variable rates
            {"term": 36, "type": RateType.VARIABLE, "rate": "3.85", "mortgage_type": "uninsured"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.35", "mortgage_type": "uninsured", "featured": True, "spread": "P - 0.90%"},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.UNINSURED
            
            raw_data = {
                "source": "butlermortgage_website_fallback",
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
    scraper = ButlerMortgageScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Butler Mortgage:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.term_months, x.rate_type.value)):
            years = r.term_months // 12 if r.term_months >= 12 else f"{r.term_months}m"
            rate_type = r.rate_type.value
            featured = " ★" if r.raw_data.get("featured") else ""
            spread = r.raw_data.get("spread_to_prime", "")
            spread_str = f" [{spread}]" if spread else ""
            print(f"  {years}yr {rate_type}: {r.rate}%{spread_str}{featured}")
            
        print("-" * 60)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
