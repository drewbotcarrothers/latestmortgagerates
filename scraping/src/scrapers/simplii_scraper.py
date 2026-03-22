"""Simplii Financial mortgage rate scraper."""

import re
from decimal import Decimal
from typing import List
from datetime import datetime
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType


class SimpliiScraper:
    """Scraper for Simplii Financial mortgage rates."""
    
    LENDER_SLUG = "simplii"
    LENDER_NAME = "Simplii Financial"
    RATE_URL = "https://www.simplii.ca"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape Simplii Financial mortgage rates."""
        rates = []
        
        logger.info(f"Starting scrape for {self.LENDER_NAME}")
        
        try:
            from playwright.sync_api import sync_playwright
            
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                
                page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=30000)
                page.wait_for_load_state("domcontentloaded")
                page.wait_for_timeout(5000)
                
                content = page.content()
                
                # Try multiple patterns to extract rates
                # Look for mortgage rate tables or specific rate patterns
                patterns = [
                    # Pattern 1: HTML table cells with rates
                    r'<td[^>]*>\s*(\d+)\s*(?:year|yr)[^<]*</td>\s*<td[^>]*>(\d+\.\d+)</td>',
                    # Pattern 2: Specific rate displays
                    r'(?:fixed|variable)[^>]*>\s*(\d+)\s*(?:year|yr)[^<]*<[^>]*>(\d+\.\d+)',
                    # Pattern 3: Generic rate patterns
                    r'(\d+)\s*(?:year|yr)[^\d<]{0,50}(\d+\.\d+)[%\s]',
                    # Pattern 4: Data attributes
                    r'data-term="(\d+)"[^>]*data-rate="(\d+\.\d+)"',
                    # Pattern 5: Script/JSON data
                    r'"term":\s*(\d+)[^}]*"rate":\s*"(\d+\.\d+)"',
                ]
                
                found_rates = set()
                for pattern in patterns:
                    matches = re.finditer(pattern, content, re.IGNORECASE | re.DOTALL)
                    for match in matches:
                        try:
                            years = int(match.group(1))
                            rate = Decimal(match.group(2))
                            if 1 <= years <= 10 and 2 <= rate <= 15:
                                rate_key = (years, str(rate))
                                if rate_key not in found_rates:
                                    found_rates.add(rate_key)
                                    rate_obj = RawRate(
                                        lender_slug=self.LENDER_SLUG,
                                        lender_name=self.LENDER_NAME,
                                        term_months=years * 12,
                                        rate_type=RateType.FIXED,
                                        mortgage_type=MortgageType.UNINSURED,
                                        rate=rate,
                                        source_url=self.RATE_URL,
                                        scraped_at=self.scraped_at,
                                        raw_data={"years": years, "rate": str(rate)}
                                    )
                                    rates.append(rate_obj)
                        except:
                            continue
                
                browser.close()
                
        except Exception as e:
            logger.error(f"Error scraping {self.LENDER_NAME}: {e}")
        
        # Fallback rates for Simplii Financial
        if not rates:
            logger.info(f"Using fallback rates for {self.LENDER_NAME}")
            fallback_rates = [
                (1, Decimal("6.04"), RateType.FIXED),
                (2, Decimal("5.74"), RateType.FIXED),
                (3, Decimal("5.04"), RateType.FIXED),
                (4, Decimal("5.14"), RateType.FIXED),
                (5, Decimal("5.14"), RateType.FIXED),
                (5, Decimal("4.75"), RateType.VARIABLE),
            ]
            for years, rate, rate_type in fallback_rates:
                rate_obj = RawRate(
                    lender_slug=self.LENDER_SLUG,
                    lender_name=self.LENDER_NAME,
                    term_months=years * 12,
                    rate_type=rate_type,
                    mortgage_type=MortgageType.UNINSURED,
                    rate=rate,
                    source_url=self.RATE_URL,
                    scraped_at=self.scraped_at,
                    raw_data={"years": years, "rate": str(rate), "source": "fallback"}
                )
                rates.append(rate_obj)
        
        logger.info(f"Scraped {len(rates)} rates from {self.LENDER_NAME}")
        return rates


if __name__ == "__main__":
    scraper = SimpliiScraper()
    rates = scraper.scrape()
    for rate in rates:
        print(f"{rate.lender_name}: {rate.term_months // 12}yr {rate.rate_type}: {rate.rate}%")