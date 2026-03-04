"""Meridian Credit Union mortgage rate scraper."""

import re
from typing import List
from playwright.sync_api import sync_playwright
from loguru import logger

from .base import BaseScraper, ScrapedRate


class MeridianScraper(BaseScraper):
    """Scraper for Meridian CU mortgage rates."""
    
    LENDER_SLUG = "meridian"
    LENDER_NAME = "Meridian Credit Union"
    SOURCE_URL = "https://www.meridiancu.ca/personal/rates/mortgage-rates"
    
    def scrape(self) -> List[ScrapedRate]:
        """Scrape Meridian mortgage rates."""
        rates = []
        
        logger.info(f"Starting scrape for {self.LENDER_NAME}")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            try:
                # Navigate to rates page
                page.goto(self.SOURCE_URL, wait_until="networkidle")
                page.wait_for_load_state("domcontentloaded")
                
                # Wait for rate tables to load
                page.wait_for_selector("table", timeout=10000)
                
                # Extract mortgage rates from tables
                content = page.content()
                
                # Find fixed rates
                fixed_patterns = [
                    (r'(\d+)\s*[Yy]ear.*[Ff]ixed.*?([\d.]+)\s*%', 1),
                ]
                
                for pattern, months_multiplier in fixed_patterns:
                    matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
                    for match in matches:
                        try:
                            years = int(match[0])
                            rate_str = match[1]
                            rate = float(rate_str)
                            
                            rate_obj = ScrapedRate(
                                lender_name=self.LENDER_NAME,
                                lender_slug=self.LENDER_SLUG,
                                term_months=years * 12,
                                rate_type="fixed",
                                mortgage_type="uninsured",
                                rate=rate,
                                source_url=self.SOURCE_URL,
                                scraped_at=self.scraped_at,
                                raw_data={
                                    "years": years,
                                    "rate_str": rate_str,
                                }
                            )
                            rates.append(rate_obj)
                            logger.debug(f"Found {years}yr fixed: {rate}%")
                        except (ValueError, IndexError) as e:
                            logger.warning(f"Could not parse rate: {match} - {e}")
                
                # Find variable rates
                var_pattern = r'[Vv]ariable.*?([\d.]+)\s*%'
                var_matches = re.findall(var_pattern, content, re.IGNORECASE | re.DOTALL)
                for rate_str in var_matches[:1]:  # Take first match
                    try:
                        rate = float(rate_str)
                        rate_obj = ScrapedRate(
                            lender_name=self.LENDER_NAME,
                            lender_slug=self.LENDER_SLUG,
                            term_months=60,  # 5-year variable
                            rate_type="variable",
                            mortgage_type="uninsured",
                            rate=rate,
                            source_url=self.SOURCE_URL,
                            scraped_at=self.scraped_at,
                            raw_data={
                                "rate_str": rate_str,
                            }
                        )
                        rates.append(rate_obj)
                        logger.debug(f"Found 5yr variable: {rate}%")
                    except ValueError as e:
                        logger.warning(f"Could not parse variable rate: {rate_str} - {e}")
                
                # Look for tables with rate data
                tables = page.query_selector_all("table")
                for table in tables:
                    rows = table.query_selector_all("tr")
                    for row in rows:
                        cells = row.query_selector_all("td, th")
                        if len(cells) >= 2:
                            try:
                                term_text = cells[0].inner_text().strip()
                                rate_text = cells[1].inner_text().strip()
                                
                                # Parse term
                                term_match = re.search(r'(\d+)\s*(?:Year|YR|yr)', term_text, re.IGNORECASE)
                                if term_match:
                                    years = int(term_match.group(1))
                                    rate_match = re.search(r'([\d.]+)\s*%', rate_text)
                                    if rate_match:
                                        rate = float(rate_match.group(1))
                                        
                                        # Check if already found
                                        existing = [r for r in rates if r.term_months == years * 12 and r.rate_type == "fixed"]
                                        if not existing:
                                            rate_obj = ScrapedRate(
                                                lender_name=self.LENDER_NAME,
                                                lender_slug=self.LENDER_SLUG,
                                                term_months=years * 12,
                                                rate_type="fixed",
                                                mortgage_type="uninsured",
                                                rate=rate,
                                                source_url=self.SOURCE_URL,
                                                scraped_at=self.scraped_at,
                                            )
                                            rates.append(rate_obj)
                            except Exception as e:
                                logger.debug(f"Could not parse row: {e}")
                
                browser.close()
                
            except Exception as e:
                logger.error(f"Error scraping {self.LENDER_NAME}: {e}")
                browser.close()
        
        # Remove duplicates
        unique_rates = []
        seen = set()
        for rate in rates:
            key = (rate.term_months, rate.rate_type, rate.mortgage_type)
            if key not in seen:
                seen.add(key)
                unique_rates.append(rate)
        
        logger.info(f"Scraped {len(unique_rates)} rates from {self.LENDER_NAME}")
        return unique_rates


if __name__ == "__main__":
    from ...database import Database
    
    scraper = MeridianScraper()
    rates = scraper.scrape()
    for rate in rates:
        print(f"{rate.lender_name}: {rate.term_months // 12}yr {rate.rate_type}: {rate.rate}%")
