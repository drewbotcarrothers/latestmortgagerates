"""
EQ Bank mortgage rate scraper.
Uses Playwright for live scraping with anti-bot measures.
Updated: August 13, 2026
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


class EQBankScraper:
    """Scraper for EQ Bank mortgage rates."""
    
    LENDER_SLUG = "eqbank"
    LENDER_NAME = "EQ Bank"
    RATE_URL = "https://www.eqbank.ca/residential/mortgage-rates"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape EQ Bank mortgage rates."""
        logger.info("Fetching EQ Bank rate page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from EQ Bank")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        logger.warning("EQ Bank live scraping failed - returning empty list")
        return []
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright to scrape live rates from EQ Bank tables."""
        try:
            from playwright.sync_api import sync_playwright
            
            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=[
                        "--disable-http2",
                        "--disable-quic",
                        "--disable-blink-features=AutomationControlled",
                    ]
                )
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                    viewport={"width": 1920, "height": 1080},
                )
                page = context.new_page()
                
                # Navigate to EQ Bank mortgage rates page
                page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=30000)
                page.wait_for_timeout(3000)
                
                rates = []
                
                # Find the main mortgage rates table
                tables = page.query_selector_all("table")
                logger.info(f"Found {len(tables)} tables on EQ Bank page")
                
                for table in tables:
                    # Get headers to identify the table type
                    headers = table.query_selector_all("th")
                    if not headers:
                        continue
                    
                    header_texts = [h.inner_text().strip() for h in headers]
                    header_text_lower = " ".join(header_texts).lower()
                    
                    # Skip non-mortgage tables (prime rate history, etc.)
                    if "effective date" in header_text_lower and "prime rate" in header_text_lower:
                        continue
                    if "reverse mortgage" in header_text_lower:
                        continue
                    
                    # Look for the main mortgage table with term columns
                    # Headers should contain terms like "6 Month", "1 Year Fixed", "5 Year Adjustable"
                    is_mortgage_table = any(term in header_text_lower for term in 
                        ['mortgage', 'fixed', 'adjustable', '6 month', 'year fixed', 'year adjustable'])
                    
                    if not is_mortgage_table:
                        continue
                    
                    # Extract term columns from headers
                    # Skip the first header (usually "Mortgage" or empty)
                    term_columns = []
                    for i, h_text in enumerate(header_texts):
                        if i == 0:
                            continue
                        # Parse term from header like "6 Month", "1 Year Fixed", "5 Year Adjustable"
                        term_match = re.search(r'(\d+)\s*(Month|Year)', h_text, re.IGNORECASE)
                        if term_match:
                            num = int(term_match.group(1))
                            unit = term_match.group(2).lower()
                            if unit == 'month':
                                term_months = num
                            else:
                                term_months = num * 12
                            
                            is_variable = 'adjustable' in h_text.lower() or 'variable' in h_text.lower()
                            term_columns.append({
                                'index': i,
                                'term_months': term_months,
                                'is_variable': is_variable,
                                'header': h_text
                            })
                    
                    if not term_columns:
                        continue
                    
                    # Process each row
                    rows = table.query_selector_all("tbody tr")
                    if not rows:
                        rows = table.query_selector_all("tr")
                    
                    for row in rows:
                        cells = row.query_selector_all("td")
                        if len(cells) < 2:
                            continue
                        
                        row_label = cells[0].inner_text().strip()
                        
                        # Skip header/footer rows
                        if not row_label or 'term' in row_label.lower():
                            continue
                        
                        # Determine if this is Standard or Evolution Suite row
                        is_evolution = 'evolution' in row_label.lower()
                        is_standard = 'standard' in row_label.lower()
                        is_apr = 'apr' in row_label.lower() or 'annual percentage' in row_label.lower()
                        
                        # Skip APR rows (we want the actual rates)
                        if is_apr:
                            continue
                        
                        # Process each term column
                        for term_col in term_columns:
                            if term_col['index'] >= len(cells):
                                continue
                            
                            rate_text = cells[term_col['index']].inner_text().strip()
                            
                            # Skip empty or non-rate cells
                            if not rate_text or rate_text == '--' or rate_text == '-':
                                continue
                            
                            # Parse rate
                            rate_match = re.search(r'(\d+\.?\d*)\s*%', rate_text)
                            if rate_match:
                                rate = Decimal(rate_match.group(1))
                            else:
                                # Try to match "P + X.XX%" or "P - X.XX%"
                                prime_match = re.search(r'P\s+([+-])\s+(\d+\.?\d*)\s*%', rate_text, re.IGNORECASE)
                                if prime_match:
                                    # This is a prime-based rate - skip for now or calculate
                                    # We'd need the prime rate to calculate the actual rate
                                    continue
                                else:
                                    continue
                            
                            # Only accept reasonable rates (2-15%)
                            if rate < 2 or rate > 15:
                                continue
                            
                            # Determine rate type
                            if term_col['is_variable']:
                                rate_type = RateType.VARIABLE
                            else:
                                rate_type = RateType.FIXED
                            
                            # Determine mortgage type
                            if is_evolution:
                                mortgage_type = MortgageType.INSURED
                                product_name = f"{term_col['term_months'] // 12 if term_col['term_months'] >= 12 else term_col['term_months']}-{ 'Mo' if term_col['term_months'] < 12 else 'Year'} {rate_type.value.title()} (Evolution Suite)"
                            elif is_standard:
                                mortgage_type = MortgageType.UNINSURED
                                product_name = f"{term_col['term_months'] // 12 if term_col['term_months'] >= 12 else term_col['term_months']}-{ 'Mo' if term_col['term_months'] < 12 else 'Year'} {rate_type.value.title()} (Standard)"
                            else:
                                mortgage_type = MortgageType.UNINSURED
                                product_name = f"{term_col['term_months'] // 12 if term_col['term_months'] >= 12 else term_col['term_months']}-{ 'Mo' if term_col['term_months'] < 12 else 'Year'} {rate_type.value.title()}"
                            
                            rates.append(RawRate(
                                lender_slug=self.LENDER_SLUG,
                                lender_name=self.LENDER_NAME,
                                term_months=term_col['term_months'],
                                rate_type=rate_type,
                                mortgage_type=mortgage_type,
                                rate=rate,
                                source_url=self.RATE_URL,
                                scraped_at=self.scraped_at,
                                raw_data={
                                    "source": "eqbank_live_scrape",
                                    "row_label": row_label,
                                    "rate_text": rate_text,
                                    "product": product_name,
                                    "is_evolution": is_evolution,
                                    "is_standard": is_standard
                                }
                            ))
                
                browser.close()
                return rates
                
        except ImportError:
            logger.warning("Playwright not available")
            return []
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return []


if __name__ == "__main__":
    scraper = EQBankScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from EQ Bank:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}%  {product}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
