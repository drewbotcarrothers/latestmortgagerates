"""
Manulife Bank mortgage rate scraper.
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


class ManulifeBankScraper:
    """Scraper for Manulife Bank mortgage rates."""
    
    LENDER_SLUG = "manulife"
    LENDER_NAME = "Manulife Bank"
    RATE_URL = "https://www.manulifebank.ca/current-rates.html"
    
    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)
    
    def scrape(self) -> List[RawRate]:
        """Scrape Manulife Bank mortgage rates."""
        logger.info("Fetching Manulife Bank rate page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Manulife Bank")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        logger.info("Using fallback rates from Manulife Bank (2026-07-19)")
        rates = self._get_fallback_rates()
        return rates
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright to scrape live rates."""
        try:
            from playwright.sync_api import sync_playwright
            
            browser = None
            with sync_playwright() as p:
                # Disable HTTP/2 to avoid ERR_HTTP2_PROTOCOL_ERROR
                browser = p.chromium.launch(
                    headless=True,
                    args=[
                        "--disable-http2",
                        "--disable-quic",
                    ]
                )
                
                try:
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
                    
                    page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=30000)
                    page.wait_for_timeout(3000)
                    
                    rates = []
                    
                    # Find tables containing rate data
                    tables = page.locator("table").all()
                    
                    for table in tables:
                        # Get all rows in the table
                        rows = table.locator("tr").all()
                        
                        for row in rows:
                            try:
                                cells = row.locator("td").all_inner_texts()
                                
                                # Looking for pattern: term text + rate
                                if len(cells) >= 2:
                                    term_text = cells[0].strip().lower()
                                    rate_text = cells[1].strip()
                                    
                                    # Extract term years
                                    term_match = re.search(r'(\d+)[\s-]*year', term_text)
                                    if term_match:
                                        years = int(term_match.group(1))
                                        
                                        # Extract rate
                                        rate_match = re.search(r'(\d+\.\d+)', rate_text)
                                        if rate_match:
                                            rate = Decimal(rate_match.group(1))
                                            
                                            if 1 <= years <= 10 and 2 <= rate <= 10:
                                                # Determine rate type
                                                rate_type = RateType.VARIABLE if 'variable' in term_text else RateType.FIXED
                                                
                                                rates.append(RawRate(
                                                    lender_slug=self.LENDER_SLUG,
                                                    lender_name=self.LENDER_NAME,
                                                    term_months=years * 12,
                                                    rate_type=rate_type,
                                                    mortgage_type=MortgageType.UNINSURED,
                                                    rate=rate,
                                                    source_url=self.RATE_URL,
                                                    scraped_at=self.scraped_at,
                                                    raw_data={"source": "manulife_live_scrape", "years": years, "term_text": term_text}
                                                ))
                            except Exception:
                                continue
                    
                    # Also look for special/promotional rates
                    try:
                        # Look for base rate / prime rate
                        content = page.content()
                        prime_match = re.search(r'(?:prime rate|base rate)[^\d]*(\d+\.\d+)', content, re.IGNORECASE)
                        if prime_match:
                            rate = Decimal(prime_match.group(1))
                            rates.append(RawRate(
                                lender_slug=self.LENDER_SLUG,
                                lender_name=self.LENDER_NAME,
                                term_months=0,
                                rate_type=RateType.VARIABLE,
                                mortgage_type=MortgageType.UNINSURED,
                                rate=rate,
                                source_url=self.RATE_URL,
                                scraped_at=self.scraped_at,
                                raw_data={"source": "manulife_live_scrape", "special": "prime_rate"}
                            ))
                    except Exception:
                        pass
                    
                    return rates
                finally:
                    if browser:
                        browser.close()
                
        except ImportError:
            logger.warning("Playwright not available")
            return []
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return []
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates from Manulife Bank (April 25, 2026).
        Manulife tends to have higher rates than other monolines.
        """
        logger.info("Using fallback rates from Manulife Bank (2026-07-19)")
        
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "5.74", "mortgage_type": "uninsured", "product": "1 Year Fixed"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.34", "mortgage_type": "uninsured", "product": "2 Year Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.59", "mortgage_type": "uninsured", "product": "3 Year Fixed", "featured": True},
            {"term": 48, "type": RateType.FIXED, "rate": "4.69", "mortgage_type": "uninsured", "product": "4 Year Fixed"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.69", "mortgage_type": "uninsured", "product": "5 Year Fixed", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.54", "mortgage_type": "insured", "product": "5 Year Fixed (Insured)"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.30", "mortgage_type": "uninsured", "product": "5 Year Variable"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.10", "mortgage_type": "insured", "product": "5 Year Variable (Insured)"},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.INSURED if item.get("mortgage_type") == "insured" else MortgageType.UNINSURED
            
            raw_data = {
                "source": "manulife_fallback_2026-07-19",
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
    scraper = ManulifeBankScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Manulife Bank:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            featured = " [FEATURED]" if r.raw_data.get("featured") else ""
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}%{featured}")
            if product:
                print(f"    {product}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
