"""Simplii Financial mortgage rate scraper."""

import re
from typing import List
from playwright.sync_api import sync_playwright
from loguru import logger

from .base import BaseScraper, ScrapedRate


class SimpliiScraper(BaseScraper):
    """Scraper for Simplii Financial mortgage rates."""
    
    LENDER_SLUG = "simplii"
    LENDER_NAME = "Simplii Financial"
    SOURCE_URL = "https://www.simplii.ca/en/rates/mortgage-rates.html"
    
    def scrape(self) -> List[ScrapedRate]:
        """Scrape Simplii Financial mortgage rates."""
        rates = []
        
        logger.info(f"Starting scrape for {self.LENDER_NAME}")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            try:
                # Navigate to rates page
                page.goto(self.SOURCE_URL, wait_until="networkidle")
                page.wait_for_load_state("domcontentloaded")
                
                # Wait for content to load
                page.wait_for_timeout(2000)
                content = page.content()
                
                # Look for fixed rate patterns
                # Simplii typically shows 1, 2, 3, 4, 5 year fixed rates
                fixed_rate_patterns = [
                    r'(\d)\s*[Yy]ear.*?(?:Fixed|fix).*?(\d\.\d+)%',
                    r'(\d)-(?:Year|YR).*?(\d\.\d{1,2})',
                ]
                
                for pattern in fixed_rate_patterns:
                    matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
                    for match in matches:
                        try:
                            years = int(match[0])
                            rate = float(match[1])
                            
                            # Avoid duplicates
                            existing = [r for r in rates if r.term_months == years * 12 and r.rate_type == "fixed"]
                            if not existing and 1 <= years <= 10:
                                rate_obj = ScrapedRate(
                                    lender_name=self.LENDER_NAME,
                                    lender_slug=self.LENDER_SLUG,
                                    term_months=years * 12,
                                    rate_type="fixed",
                                    mortgage_type="uninsured",
                                    rate=rate,
                                    source_url=self.SOURCE_URL,
                                    scraped_at=self.scraped_at,
                                    raw_data={"years": years, "rate": rate}
                                )
                                rates.append(rate_obj)
                                logger.debug(f"Found {years}yr fixed: {rate}%")
                        except (ValueError, IndexError) as e:
                            logger.warning(f"Could not parse fixed rate: {match} - {e}")
                
                # Look for variable rates
                variable_patterns = [
                    r'[Vv]ariable.*?(\d\.\d+)%',
                    r'Prime.*?([\-+]\d+\.\d+)',
                ]
                
                prime_rate = 6.70  # Current prime rate
                
                for pattern in variable_patterns:
                    var_match = re.search(pattern, content, re.IGNORECASE | re.DOTALL)
                    if var_match:
                        try:
                            rate_text = var_match.group(1)
                            # Check if it's a spread (e.g., "-0.50") or a rate
                            if '+' in rate_text or '-' in rate_text:
                                spread = float(rate_text.replace('%', ''))
                                rate = prime_rate + spread
                            else:
                                rate = float(rate_text)
                            
                            existing = [r for r in rates if r.rate_type == "variable"]
                            if not existing:
                                rate_obj = ScrapedRate(
                                    lender_name=self.LENDER_NAME,
                                    lender_slug=self.LENDER_SLUG,
                                    term_months=60,  # 5-year variable
                                    rate_type="variable",
                                    mortgage_type="uninsured",
                                    rate=rate,
                                    source_url=self.SOURCE_URL,
                                    scraped_at=self.scraped_at,
                                    spread_to_prime=f"Prime {rate - prime_rate:+.2f}%",
                                    raw_data={"rate": rate, "prime": prime_rate}
                                )
                                rates.append(rate_obj)
                                logger.debug(f"Found 5yr variable: {rate}%")
                                break  # Found one, stop looking
                        except ValueError as e:
                            logger.warning(f"Could not parse variable rate: {var_match.group(1)} - {e}")
                
                browser.close()
                
            except Exception as e:
                logger.error(f"Error scraping {self.LENDER_NAME}: {e}")
                browser.close()
        
        logger.info(f"Scraped {len(rates)} rates from {self.LENDER_NAME}")
        return rates


if __name__ == "__main__":
    from ...database import Database
    
    scraper = SimpliiScraper()
    rates = scraper.scrape()
    for rate in rates:
        print(f"{rate.lender_name}: {rate.term_months // 12}yr {rate.rate_type}: {rate.rate}%")
