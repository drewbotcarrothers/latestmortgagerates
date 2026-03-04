"""EQ Bank mortgage rate scraper."""

import re
from typing import List
from playwright.sync_api import sync_playwright
from loguru import logger

from .base import BaseScraper, ScrapedRate


class EQBankScraper(BaseScraper):
    """Scraper for EQ Bank mortgage rates."""
    
    LENDER_SLUG = "eqbank"
    LENDER_NAME = "EQ Bank"
    SOURCE_URL = "https://www.eqbank.ca/mortgage-rates"
    
    def scrape(self) -> List[ScrapedRate]:
        """Scrape EQ Bank mortgage rates."""
        rates = []
        
        logger.info(f"Starting scrape for {self.LENDER_NAME}")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            try:
                # Navigate to rates page
                page.goto(self.SOURCE_URL, wait_until="networkidle")
                page.wait_for_load_state("domcontentloaded")
                
                # Wait for rate content
                page.wait_for_timeout(2000)
                content = page.content()
                
                # EQ Bank typically shows fixed rates for various terms
                # Pattern for rate tables
                rate_patterns = [
                    # Match term and rate in HTML
                    r'(\d)[\s\-]*(?:Year|yr|YR).*?(\d\.\d+)[\s]*%',
                    r'(\d)[\s\-]*Yr.*?Fixed.*?(\d\.\d+)',
                ]
                
                found_rates = []
                
                for pattern in rate_patterns:
                    matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
                    for match in matches:
                        try:
                            years = int(match[0])
                            rate = float(match[1])
                            
                            if rate < 2.0 or rate > 10.0:
                                continue  # Skip unrealistic rates
                            
                            found_rates.append((years, rate))
                        except (ValueError, IndexError):
                            continue
                
                # Remove duplicates while preserving order
                seen_terms = set()
                for years, rate in found_rates:
                    if years not in seen_terms and 1 <= years <= 10:
                        seen_terms.add(years)
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
                
                # Look for variable rates
                prime_rate = 6.70
                variable_patterns = [
                    r'[Vv]ariable.*?([\d\.\d]+)%',
                    r'Prime.*?([\-+]?\d+\.?\d*)',
                ]
                
                for pattern in variable_patterns:
                    var_match = re.search(pattern, content)
                    if var_match:
                        rate_text = var_match.group(1)
                        try:
                            rate = float(rate_text)
                            if rate < 2.0 or rate > 10.0:
                                continue
                            
                            rate_obj = ScrapedRate(
                                lender_name=self.LENDER_NAME,
                                lender_slug=self.LENDER_SLUG,
                                term_months=60,
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
                            break
                        except ValueError:
                            continue
                
                browser.close()
                
            except Exception as e:
                logger.error(f"Error scraping {self.LENDER_NAME}: {e}")
                browser.close()
        
        logger.info(f"Scraped {len(rates)} rates from {self.LENDER_NAME}")
        return rates


if __name__ == "__main__":
    from ...database import Database
    
    scraper = EQBankScraper()
    rates = scraper.scrape()
    for rate in rates:
        print(f"{rate.lender_name}: {rate.term_months // 12}yr {rate.rate_type}: {rate.rate}%")
