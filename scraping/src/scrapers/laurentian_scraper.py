"""
Laurentian Bank mortgage rate scraper.
Uses Playwright for live scraping with fallback to captured rates.
Updated: August 14, 2026 - Fixed table parsing
"""

import re
from decimal import Decimal
from typing import List
from datetime import datetime, timezone
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType


class LaurentianBankScraper:
    """Scraper for Laurentian Bank mortgage rates."""
    
    LENDER_SLUG = "laurentian"
    LENDER_NAME = "Laurentian Bank"
    RATE_URL = "https://www.laurentianbank.ca/en/personal/rates/mortgages"
    
    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)
    
    def scrape(self) -> List[RawRate]:
        """Scrape Laurentian Bank mortgage rates."""
        logger.info("Fetching Laurentian Bank rate page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Laurentian Bank")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        logger.info("Using fallback rates from Laurentian Bank (2026-08-14)")
        rates = self._get_fallback_rates()
        return rates
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright to scrape live rates."""
        try:
            from playwright.sync_api import sync_playwright
            
            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=["--disable-http2", "--disable-quic"]
                )
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
                )
                page = context.new_page()
                
                # Block heavy resources
                page.route("**/*", lambda route: route.abort() if route.request.resource_type in ["image", "media", "font", "stylesheet"] else route.continue_())
                
                page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=30000)
                page.wait_for_timeout(3000)
                
                rates = []
                
                # Get all tables and extract text
                tables = page.locator('table')
                table_count = tables.count()
                logger.info(f"Found {table_count} tables on Laurentian rates page")
                
                for i in range(table_count):
                    try:
                        table = tables.nth(i)
                        rows = table.locator('tr').all()
                        
                        for row in rows:
                            try:
                                cells = row.locator('td').all()
                                if len(cells) >= 2:
                                    term_text = cells[0].inner_text().strip()
                                    rate_text = cells[1].inner_text().strip()
                                    
                                    # Skip header rows
                                    if 'term' in term_text.lower() or 'fixed rate' in term_text.lower():
                                        continue
                                    
                                    # Extract rate
                                    rate_match = re.search(r'(\d+\.\d+)', rate_text)
                                    if not rate_match:
                                        continue
                                    
                                    rate = Decimal(rate_match.group(1))
                                    
                                    # Sanity check
                                    if rate < Decimal('2.0') or rate > Decimal('10.0'):
                                        continue
                                    
                                    # Extract term
                                    term_match = re.search(r'(\d+)\s+(?:months?|mo)', term_text, re.IGNORECASE)
                                    if term_match:
                                        months = int(term_match.group(1))
                                    else:
                                        term_match = re.search(r'(\d+)\s+(?:year|yr)', term_text, re.IGNORECASE)
                                        if term_match:
                                            months = int(term_match.group(1)) * 12
                                        else:
                                            continue
                                    
                                    # Determine rate type
                                    rate_type = RateType.FIXED
                                    if 'variable' in term_text.lower():
                                        rate_type = RateType.VARIABLE
                                    
                                    # Determine mortgage type (insured vs uninsured)
                                    mortgage_type = MortgageType.UNINSURED
                                    if 'high.ratio' in term_text.lower() or 'insured' in term_text.lower():
                                        mortgage_type = MortgageType.INSURED
                                    
                                    # Determine if promotional
                                    is_promo = 'promotional' in term_text.lower()
                                    
                                    rates.append(RawRate(
                                        lender_slug=self.LENDER_SLUG,
                                        lender_name=self.LENDER_NAME,
                                        term_months=months,
                                        rate_type=rate_type,
                                        mortgage_type=mortgage_type,
                                        rate=rate,
                                        source_url=self.RATE_URL,
                                        scraped_at=self.scraped_at,
                                        raw_data={
                                            "source": "laurentian_live_scrape",
                                            "term_text": term_text,
                                            "is_promotional": is_promo
                                        }
                                    ))
                            except Exception as e:
                                continue
                                
                    except Exception as e:
                        logger.warning(f"Table {i} extraction failed: {e}")
                        continue
                
                browser.close()
                
                # Remove duplicates
                seen = set()
                unique_rates = []
                for r in rates:
                    key = (r.term_months, r.rate_type.value, r.mortgage_type.value, str(r.rate))
                    if key not in seen:
                        seen.add(key)
                        unique_rates.append(r)
                
                return unique_rates
                
        except ImportError:
            logger.warning("Playwright not available")
            return []
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return []
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates from Laurentian Bank (August 14, 2026).
        """
        logger.info("Using fallback rates from Laurentian Bank (2026-08-14)")
        
        fallback_data = [
            # Closed fixed rates
            {"term": 6, "type": RateType.FIXED, "rate": "7.84", "mortgage_type": "uninsured", "product": "6 Month Closed"},
            {"term": 12, "type": RateType.FIXED, "rate": "5.64", "mortgage_type": "uninsured", "product": "1 Year Closed"},
            {"term": 18, "type": RateType.FIXED, "rate": "5.64", "mortgage_type": "uninsured", "product": "18 Month Closed"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.94", "mortgage_type": "uninsured", "product": "2 Year Closed"},
            {"term": 36, "type": RateType.FIXED, "rate": "6.09", "mortgage_type": "uninsured", "product": "3 Year Closed"},
            {"term": 48, "type": RateType.FIXED, "rate": "6.19", "mortgage_type": "uninsured", "product": "4 Year Closed"},
            {"term": 60, "type": RateType.FIXED, "rate": "6.29", "mortgage_type": "uninsured", "product": "5 Year Closed"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.79", "mortgage_type": "uninsured", "product": "5 Year Promotional"},
            # Variable rates
            {"term": 36, "type": RateType.VARIABLE, "rate": "4.45", "mortgage_type": "uninsured", "product": "3 Year Variable (Prime + 0.00%)"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.05", "mortgage_type": "uninsured", "product": "5 Year Variable (Prime - 0.50%)"},
            # High ratio insured
            {"term": 60, "type": RateType.FIXED, "rate": "4.29", "mortgage_type": "insured", "product": "5 Year High Ratio"},
        ]
        
        rates = []
        for data in fallback_data:
            rates.append(RawRate(
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                term_months=data["term"],
                rate_type=data["type"],
                mortgage_type=MortgageType.INSURED if data["mortgage_type"] == "insured" else MortgageType.UNINSURED,
                rate=Decimal(data["rate"]),
                source_url=self.RATE_URL,
                scraped_at=self.scraped_at,
                raw_data={"source": "laurentian_fallback", "product": data["product"]}
            ))
        
        return rates
