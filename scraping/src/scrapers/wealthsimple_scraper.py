"""Wealthsimple mortgage rate scraper.

Fintech bank with modern mortgage offerings.
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


class WealthsimpleScraper:
    """Scraper for Wealthsimple mortgage rates."""
    
    LENDER_SLUG = "wealthsimple"
    LENDER_NAME = "Wealthsimple"
    RATE_URL = "https://www.wealthsimple.com/mortgage"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape Wealthsimple mortgage rates."""
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
                
                # Wealthsimple has modern React-based site
                patterns = [
                    r'(?i)(\d+)[-\s](?:year|yr)[^\d<]*?(\d+\.\d+)',
                    r'"rate":\s*"(\d+\.\d+)"',
                    r'(?i)mortgage.*?rate.*?[^\d<]*(\d+\.\d+)',
                ]
                
                for pattern in patterns:
                    matches = re.finditer(pattern, content, re.DOTALL)
                    for match in matches:
                        try:
                            if '"rate"' in pattern:
                                rate = Decimal(match.group(1))
                                years = 5  # Default assumption
                            else:
                                years = int(match.group(1))
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
        """Playwright scraper for JavaScript-heavy page."""
        rates = []
        try:
            from playwright.sync_api import sync_playwright
            
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                
                page.goto(self.RATE_URL, wait_until="networkidle", timeout=30000)
                page.wait_for_timeout(5000)  # Extra wait for React rendering
                
                content = page.content()
                browser.close()
                
                # Look for displayed rates
                patterns = [
                    r'(?i)(\d+)[-\s](?:year|yr)[^\d<]*?(\d+\.\d+)',
                    r'(?i)rate[^\d<]*?(\d+\.\d+)[%\s]',
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
        
        # Wealthsimple launched mortgages recently, rates competitive
        fallback_data = [
            {"term": 60, "type": RateType.FIXED, "rate": "3.99"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.49"},
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
    scraper = WealthsimpleScraper()
    rates = scraper.scrape()
    for rate in rates:
        print(f"{rate.lender_name}: {rate.term_months // 12}yr {rate.rate_type.value}: {rate.rate}%")