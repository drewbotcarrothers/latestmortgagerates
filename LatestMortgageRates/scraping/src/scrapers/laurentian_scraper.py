"""Laurentian Bank mortgage rate scraper."""

import re
from typing import List
from playwright.sync_api import sync_playwright
from loguru import logger

from .base import BaseScraper, ScrapedRate


class LaurentianBankScraper(BaseScraper):
    """Scraper for Laurentian Bank mortgage rates."""
    
    LENDER_SLUG = "laurentian"
    LENDER_NAME = "Laurentian Bank"
    SOURCE_URL = "https://www.laurentianbank.ca/en/personal-banking/rates/mortgage-rates"
    
    def scrape(self) -> List[ScrapedRate]:
        """Scrape Laurentian Bank mortgage rates."""
        rates = []
        
        logger.info(f"Starting scrape for {self.LENDER_NAME}")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            try:
                page.goto(self.SOURCE_URL, wait_until="networkidle")
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
                            rate = float(match[1])
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
                    rate_obj = ScrapedRate(
                        lender_name=self.LENDER_NAME,
                        lender_slug=self.LENDER_SLUG,
                        term_months=years * 12,
                        rate_type=rate_type,
                        mortgage_type="uninsured",
                        rate=rate,
                        source_url=self.SOURCE_URL,
                        scraped_at=self.scraped_at,
                        raw_data={"years": years, "rate": rate}
                    )
                    rates.append(rate_obj)
                    logger.debug(f"Found {years}yr fixed: {rate}%")
                
                # Look for variable rates
                var_pattern = r'[Vv]ariable.*?([\d.]+)\s*%'
                var_match = re.search(var_pattern, content)
                if var_match:
                    try:
                        rate = float(var_match.group(1))
                        if 2 <= rate <= 10:
                            rate_obj = ScrapedRate(
                                lender_name=self.LENDER_NAME,
                                lender_slug=self.LENDER_SLUG,
                                term_months=60,
                                rate_type="variable",
                                mortgage_type="uninsured",
                                rate=rate,
                                source_url=self.SOURCE_URL,
                                scraped_at=self.scraped_at,
                                raw_data={"rate": rate}
                            )
                            rates.append(rate_obj)
                            logger.debug(f"Found 5yr variable: {rate}%")
                    except ValueError:
                        pass
                
                browser.close()
                
            except Exception as e:
                logger.error(f"Error scraping {self.LENDER_NAME}: {e}")
                browser.close()
        
        logger.info(f"Scraped {len(rates)} rates from {self.LENDER_NAME}")
        return rates


if __name__ == "__main__":
    scraper = LaurentianBankScraper()
    rates = scraper.scrape()
    for rate in rates:
        print(f"{rate.lender_name}: {rate.term_months // 12}yr {rate.rate_type}: {rate.rate}%")