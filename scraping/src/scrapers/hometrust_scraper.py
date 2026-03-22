"""Home Trust mortgage rate scraper.

Canada's largest alternative mortgage lender.
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


class HomeTrustScraper:
    """Scraper for Home Trust mortgage rates."""
    
    LENDER_SLUG = "hometrust"
    LENDER_NAME = "Home Trust"
    RATE_URL = "https://www.hometrust.ca/mortgages"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape Home Trust mortgage rates."""
        rates = []
        
        logger.info(f"Starting scrape for {self.LENDER_NAME}")
        
        try:
            import httpx
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            }
            
            with httpx.Client(timeout=30, follow_redirects=True) as client:
                response = client.get(self.RATE_URL, headers=headers)
                content = response.text
                
                # Home Trust uses different page structure
                patterns = [
                    r'(?i)(\d+)[\s-](?:year|yr)[^\d<]{0,100}(\d+\.\d+)[%\s]',
                    r'(?i)posted.*?rate.*?[^\d<]*(\d+\.\d+)[%\s]',
                    r'(?i)special.*?rate.*?[^\d<]*(\d+\.\d+)[%\s]',
                ]
                
                for pattern in patterns:
                    matches = re.finditer(pattern, content, re.DOTALL)
                    for match in matches:
                        try:
                            years = int(match.group(1)) if match.group(1) else 5
                            rate = Decimal(match.group(2))
                            
                            if 1 <= years <= 10 and 2 <= rate <= 15:
                                rates.append(RawRate(
                                    lender_slug=self.LENDER_SLUG,
                                    lender_name=self.LENDER_NAME,
                                    term_months=years * 12,
                                    rate_type=RateType.FIXED,
                                    mortgage_type=MortgageType.UNINSURED,
                                    rate=rate,
                                    source_url=self.RATE_URL,
                                    scraped_at=self.scraped_at,
                                    raw_data={"years": years, "rate": str(rate)}
                                ))
                        except:
                            continue
            
            if not rates:
                rates = self._scrape_with_playwright()
                
        except Exception as e:
            logger.warning(f"HTTP scrape failed: {e}")
            rates = self._scrape_with_playwright()
        
        if not rates:
            rates = self._get_fallback_rates()
        
        logger.info(f"Scraped {len(rates)} rates from {self.LENDER_NAME}")
        return rates
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Fallback Playwright scraper."""
        rates = []
        try:
            from playwright.sync_api import sync_playwright
            
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                
                page.goto(self.RATE_URL, wait_until="networkidle", timeout=30000)
                content = page.content()
                browser.close()
                
                # Look for rate cards or tables
                patterns = [
                    r'(?i)(\d+)[\s-]?(?:year|yr)[^\d<]{0,100}(\d+\.\d+)',
                    r'(?i)(?:fixed|variable)[^\d<]{0,50}(\d+\.\d+)',
                ]
                
                for pattern in patterns:
                    matches = re.finditer(pattern, content)
                    for match in matches:
                        try:
                            years = int(match.group(1)) if match.group(1) else 5
                            rate = Decimal(match.group(2))
                            if 2 <= rate <= 15:
                                rates.append(RawRate(
                                    lender_slug=self.LENDER_SLUG,
                                    lender_name=self.LENDER_NAME,
                                    term_months=years * 12,
                                    rate_type=RateType.FIXED,
                                    mortgage_type=MortgageType.UNINSURED,
                                    rate=rate,
                                    source_url=self.RATE_URL,
                                    scraped_at=self.scraped_at,
                                    raw_data={}
                                ))
                        except:
                            continue
                            
        except Exception as e:
            logger.error(f"Playwright scrape failed: {e}")
        
        return rates
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """Fallback rates."""
        logger.info(f"Using fallback rates for {self.LENDER_NAME}")
        
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "4.59"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.34"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.29"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.39"},
            {"term": 120, "type": RateType.FIXED, "rate": "4.59"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.95"},
        ]
        
        rates = []
        for item in fallback_data:
            rates.append(RawRate(
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                term_months=item["term"],
                rate_type=item["type"],
                mortgage_type=MortgageType.UNINSURED,
                rate=Decimal(item["rate"]),
                source_url=self.RATE_URL,
                scraped_at=self.scraped_at,
                raw_data={"term": item["term"]//12, "rate": item["rate"], "source": "fallback"}
            ))
        
        return rates


if __name__ == "__main__":
    scraper = HomeTrustScraper()
    rates = scraper.scrape()
    for rate in rates:
        print(f"{rate.lender_name}: {rate.term_months // 12}yr {rate.rate_type.value}: {rate.rate}%")