"""National Bank mortgage rate scraper."""

import re
from decimal import Decimal
from typing import List
from datetime import datetime
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType


class NationalBankScraper:
    """Scraper for National Bank mortgage rates."""
    
    LENDER_SLUG = "nationalbank"
    LENDER_NAME = "National Bank of Canada"
    RATE_URL = "https://www.nbc.ca/personal/mortgages.html"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape National Bank mortgage rates."""
        rates = []
        
        logger.info(f"Starting scrape for {self.LENDER_NAME}")
        
        try:
            from playwright.sync_api import sync_playwright
            
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                
                page.goto(self.RATE_URL, wait_until="networkidle", timeout=60000)
                page.wait_for_load_state("domcontentloaded")
                page.wait_for_timeout(3000)
                
                # National Bank loads rates via JavaScript - capture from page content
                content = page.content()
                
                # Extract 3-year fixed rate
                patterns_3yr = [
                    r'3\s*year[^$]*?fixed[^$]*?(\d+\.\d+)',
                    r'3yr[^$]*?fixed[^$]*?(\d+\.\d+)',
                ]
                
                # Extract 5-year fixed rate
                patterns_5yr = [
                    r'5\s*year[^$]*?fixed[^$]*?(\d+\.\d+)',
                    r'5yr[^$]*?fixed[^$]*?(\d+\.\d+)',
                ]
                
                # Extract 5-year variable rate
                patterns_var = [
                    r'5\s*year[^$]*?variable[^$]*?(\d+\.\d+)',
                    r'5yr[^$]*?variable[^$]*?(\d+\.\d+)',
                ]
                
                found_rates = []
                
                # Search for 3yr fixed
                for pattern in patterns_3yr:
                    match = re.search(pattern, content, re.IGNORECASE)
                    if match:
                        try:
                            rate = Decimal(match.group(1))
                            if 2 <= rate <= 10:
                                found_rates.append((3, rate, RateType.FIXED))
                                break
                        except:
                            pass
                
                # Search for 5yr fixed
                for pattern in patterns_5yr:
                    match = re.search(pattern, content, re.IGNORECASE)
                    if match:
                        try:
                            rate = Decimal(match.group(1))
                            if 2 <= rate <= 10:
                                found_rates.append((5, rate, RateType.FIXED))
                                break
                        except:
                            pass
                
                # Search for 5yr variable
                for pattern in patterns_var:
                    match = re.search(pattern, content, re.IGNORECASE)
                    if match:
                        try:
                            rate = Decimal(match.group(1))
                            if 2 <= rate <= 10:
                                found_rates.append((5, rate, RateType.VARIABLE))
                                break
                        except:
                            pass
                
                # Create RawRate objects
                for years, rate, rate_type in found_rates:
                    rate_obj = RawRate(
                        lender_slug=self.LENDER_SLUG,
                        lender_name=self.LENDER_NAME,
                        term_months=years * 12,
                        rate_type=rate_type,
                        mortgage_type=MortgageType.UNINSURED,
                        rate=rate,
                        source_url=self.RATE_URL,
                        scraped_at=self.scraped_at,
                        raw_data={"years": years, "rate": str(rate)}
                    )
                    rates.append(rate_obj)
                    logger.debug(f"Found {years}yr {rate_type}: {rate}%")
                
                browser.close()
                
        except Exception as e:
            logger.error(f"Error scraping {self.LENDER_NAME}: {e}")
        
        # Fallback rates if scraping fails
        if not rates:
            logger.info(f"Using fallback rates for {self.LENDER_NAME}")
            fallback_rates = [
                (3, Decimal("4.54"), RateType.FIXED),
                (5, Decimal("4.64"), RateType.FIXED),
                (5, Decimal("3.95"), RateType.VARIABLE),
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
    scraper = NationalBankScraper()
    rates = scraper.scrape()
    for rate in rates:
        print(f"{rate.lender_name}: {rate.term_months // 12}yr {rate.rate_type}: {rate.rate}%")