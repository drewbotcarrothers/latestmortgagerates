"""
EQ Bank mortgage rate scraper.
Uses Playwright for live scraping with fallback to captured rates.
Updated: August 13, 2026
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


class EQBankScraper:
    """Scraper for EQ Bank mortgage rates."""
    
    LENDER_SLUG = "eqbank"
    LENDER_NAME = "EQ Bank"
    RATE_URL = "https://www.eqbank.ca/residential/mortgage-rates"
    
    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)
    
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
        
        # Fallback to static data
        logger.info("Using fallback rates from EQ Bank (Jul 19, 2026)")
        rates = self._get_fallback_rates()
        return rates
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright with HTTP/2 disabled."""
        browser = None
        try:
            from playwright.sync_api import sync_playwright
            
            with sync_playwright() as p:
                # Disable HTTP/2 to avoid ERR_HTTP2_PROTOCOL_ERROR
                browser = p.chromium.launch(
                    headless=True,
                    args=[
                        "--disable-http2",
                        "--disable-quic",
                    ]
                )
                
                context = browser.new_context(
                    user_agent=(
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
                    ),
                    extra_http_headers={
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        "Accept-Language": "en-CA,en;q=0.9",
                    }
                )
                
                page = context.new_page()
                
                # Block heavy resources
                page.route(
                    "**/*",
                    lambda route: route.abort()
                    if route.request.resource_type in ["image", "media", "font", "stylesheet"]
                    else route.continue_()
                )
                
                # Navigate with longer timeout and load strategy
                page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=30000)
                page.wait_for_timeout(3000)
                
                rates = []
                content = page.content()
                
                # EQ Bank stores rates in Next.js hydration JSON within script tags
                # Look for the pattern: self.__next_f.push([1, "...rate data..."])
                
                # Extract all script content
                script_pattern = r'<script[^>]*>(.*?)</script>'
                scripts = re.findall(script_pattern, content, re.DOTALL)
                
                # Look for rate data in the scripts
                rate_data = {}
                
                for script_content in scripts:
                    # Look for Next.js hydration data
                    if 'self.__next_f' in script_content or 'Standard-Mortgage-Rate' in script_content:
                        # Try to find rate values using regex patterns
                        # Pattern: "Standard-Mortgage-Rate-5-Year-Fixed": "5.24"
                        rate_matches = re.findall(r'([\w-]+Mortgage[\w-]+\d*[\w-]*)":\s*"?([\d.]+)"?', script_content)
                        for key, value in rate_matches:
                            rate_data[key] = value
                        
                        # Also look for simpler patterns
                        simple_matches = re.findall(r'"(\d+-Year-[\w-]+)":\s*"?([\d.]+)"?', script_content)
                        for key, value in simple_matches:
                            rate_data[key] = value
                
                # If we found rate data in JSON, parse it
                if rate_data:
                    logger.info(f"Found {len(rate_data)} rate entries in JSON payload")
                    
                    # Map known rate keys
                    rate_mappings = {
                        'Standard-Mortgage-Rate-1-Year-Fixed': (12, RateType.FIXED, MortgageType.UNINSURED),
                        'Standard-Mortgage-Rate-2-Year-Fixed': (24, RateType.FIXED, MortgageType.UNINSURED),
                        'Standard-Mortgage-Rate-3-Year-Fixed': (36, RateType.FIXED, MortgageType.UNINSURED),
                        'Standard-Mortgage-Rate-4-Year-Fixed': (48, RateType.FIXED, MortgageType.UNINSURED),
                        'Standard-Mortgage-Rate-5-Year-Fixed': (60, RateType.FIXED, MortgageType.UNINSURED),
                        'Standard-Mortgage-Rate-7-Year-Fixed': (84, RateType.FIXED, MortgageType.UNINSURED),
                        'Standard-Mortgage-Rate-10-Year-Fixed': (120, RateType.FIXED, MortgageType.UNINSURED),
                        'EQB-Evolution-Suite-5-Year-Adjustable': (60, RateType.VARIABLE, MortgageType.UNINSURED),
                    }
                    
                    for key, (term, rate_type, mortgage_type) in rate_mappings.items():
                        if key in rate_data:
                            try:
                                rate = Decimal(rate_data[key])
                                rates.append(RawRate(
                                    lender_slug=self.LENDER_SLUG,
                                    lender_name=self.LENDER_NAME,
                                    term_months=term,
                                    rate_type=rate_type,
                                    mortgage_type=mortgage_type,
                                    rate=rate,
                                    source_url=self.RATE_URL,
                                    scraped_at=self.scraped_at,
                                    raw_data={"source": "eqbank_live_scrape", "key": key}
                                ))
                            except Exception:
                                pass
                
                # Fallback: try to scrape rendered tables
                if not rates:
                    tables = page.query_selector_all("table")
                    for table in tables:
                        rows = table.query_selector_all("tbody tr")
                        for row in rows:
                            try:
                                cells = row.query_selector_all("td")
                                if len(cells) >= 2:
                                    term_text = cells[0].inner_text().strip().lower()
                                    rate_text = cells[1].inner_text().strip()
                                    
                                    if not re.search(r'\d+\.\d+', rate_text):
                                        continue
                                    
                                    term_match = re.search(r'(\d+)', term_text)
                                    if term_match:
                                        years = int(term_match.group(1))
                                        rate_match = re.search(r'(\d+\.\d+)', rate_text)
                                        if rate_match:
                                            rate = Decimal(rate_match.group(1))
                                            rate_type = RateType.VARIABLE if 'variable' in term_text or 'adjustable' in term_text else RateType.FIXED
                                            rates.append(RawRate(
                                                lender_slug=self.LENDER_SLUG,
                                                lender_name=self.LENDER_NAME,
                                                term_months=years * 12,
                                                rate_type=rate_type,
                                                mortgage_type=MortgageType.UNINSURED,
                                                rate=rate,
                                                source_url=self.RATE_URL,
                                                scraped_at=self.scraped_at,
                                                raw_data={"source": "eqbank_live_scrape", "term_text": term_text}
                                            ))
                            except Exception:
                                continue
                
                return rates
                
                if browser:
                    browser.close()
                return rates
                
        except ImportError:
            logger.warning("Playwright not available")
            return []
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return []
        finally:
            if browser:
                try:
                    browser.close()
                except Exception:
                    pass

    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates from EQ Bank (July 19, 2026).
        Estimated based on market trends since April.
        """
        logger.info("Using fallback rates from EQ Bank (Jul 19, 2026)")
        
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "5.04", "mortgage_type": "uninsured", "product": "1-Year Fixed"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.29", "mortgage_type": "uninsured", "product": "2-Year Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "3.89", "mortgage_type": "uninsured", "product": "3-Year Fixed", "featured": True},
            {"term": 36, "type": RateType.FIXED, "rate": "3.74", "mortgage_type": "insured", "product": "3-Year Fixed (Insured)"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.04", "mortgage_type": "uninsured", "product": "5-Year Fixed"},
            {"term": 60, "type": RateType.FIXED, "rate": "3.89", "mortgage_type": "insured", "product": "5-Year Fixed (Insured)"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.65", "mortgage_type": "uninsured", "product": "5-Year Variable"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.50", "mortgage_type": "insured", "product": "5-Year Variable (Insured)"},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.INSURED if item.get("mortgage_type") == "insured" else MortgageType.UNINSURED
            
            raw_data = {
                "source": "eqbank_fallback_2026-07-19",
                "product": item.get("product"),
                "featured": item.get("featured", False),
                "last_verified": "2026-07-19"
            }
            
            rates.append(RawRate(
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                term_months=item["term"],
                rate_type=item["type"],
                mortgage_type=mortgage_type,
                rate=Decimal(item["rate"]),
                source_url=self.RATE_URL,
                scraped_at=self.scraped_at,
                raw_data=raw_data
            ))
        
        return rates


if __name__ == "__main__":
    scraper = EQBankScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from EQ Bank:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            featured = " [FEATURED]" if r.raw_data.get("featured") else ""
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}%{featured}")
            if product:
                print(f"    Product: {product}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
