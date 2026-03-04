"""Laurentian Bank mortgage rate scraper."""

import re
from decimal import Decimal
from typing import List
from datetime import datetime
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType


class LaurentianBankScraper:
    """Scraper for Laurentian Bank mortgage rates."""
    
    LENDER_SLUG = "laurentian"
    LENDER_NAME = "Laurentian Bank"
    RATE_URL = "https://www.laurentianbank.ca/en/personal-banking/rates/mortgage-rates"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape Laurentian Bank mortgage rates."""
        rates = []
        
        logger.info(f"Starting scrape for {self.LENDER_NAME}")
        
        try:
            from playwright.sync_api import sync_playwright
            
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                
                page.goto(self.RATE_URL, wait_until="networkidle")
                page.wait_for_load_state("domcontentloaded")
                page.wait_for_timeout(2000)
                
                content = page.content()
                
                # Look for fixed rates
                fixed_patterns = [
                    r'(\d)[\s\-]*(?:Year|yr|YR).*?(\d+\.\d+)[\s]*%',
                ]
                
                found_rates = []
                
                for pattern in fixed_patterns:
                    matches = re.findall(pattern, content, re.IGNORECASE)
                    for match in matches:
                        try:
                            years = int(match[0])
                            rate = Decimal(match[1])
                            if rate < 2 or rate > 10:
                                continue
                            found_rates.append((years, rate, "fixed"))
                        except (ValueError, IndexError):
                            continue
                
                # Remove duplicates
                seen = set()
                unique_rates = []
                for years, rate, rate_type in found_rates:
                    key = (years, rate_type)
                    if key not in seen:
                        seen.add(key)
                        unique_rates.append((years, rate, rate_type))
                
                for years, rate, rate_type in unique_rates:
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
                    logger.debug(f"Found {years}yr fixed: {rate}%")
                
                # Look for variable rates
                var_pattern = r'[Vv]ariable.*?([\d.]+)\s*%'
                var_match = re.search(var_pattern, content)
                if var_match:
                    try:
                        rate = Decimal(var_match.group(1))
                        if 2 <= rate <= 10:
                            rate_obj = RawRate(
                                lender_slug=self.LENDER_SLUG,
                                lender_name=self.LENDER_NAME,
                                term_months=60,
                                rate_type=RateType.VARIABLE,
                                mortgage_type=MortgageType.UNINSURED,
                                rate=rate,
                                source_url=self.RATE_URL,
                                scraped_at=self.scraped_at,
                                raw_data={"rate": str(rate)}
                            )
                            rates.append(rate_obj)
                            logger.debug(f"Found 5yr variable: {rate}%")
                    except ValueError:
                        pass
                
                browser.close()
                
        except Exception as e:
            logger.error(f"Error scraping {self.LENDER_NAME}: {e}")
        
        logger.info(f"Scraped {len(rates)} rates from {self.LENDER_NAME}")
        return rates


if __name__ == "__main__":
    scraper = LaurentianBankScraper()
    rates = scraper.scrape()
    for rate in rates:
        print(f"{rate.lender_name}: {rate.term_months // 12}yr {rate.rate_type}: {rate.rate}%")