"""
Wealthsimple mortgage rate scraper.
Uses Playwright for live scraping with robust DOM-based extraction.
Updated: August 12, 2026
"""

import re
from decimal import Decimal
from typing import List, Optional
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
    RATE_URL = "https://www.wealthsimple.com/en-ca/mortgages"
    
    def __init__(self):
        self.scraped_at = datetime.now(datetime.now().astimezone().tzinfo)
    
    def scrape(self) -> List[RawRate]:
        """Scrape Wealthsimple mortgage rates."""
        logger.info("Fetching Wealthsimple rate page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Wealthsimple")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        logger.warning("Live scrape failed — no fallback used. Rates will be missing.")
        return []
    
    def _extract_rate_from_text(self, text: str) -> Optional[Decimal]:
        """Extract a rate value like '4.04%' from text."""
        match = re.search(r'(\d+\.\d+)%', text)
        if match:
            return Decimal(match.group(1))
        return None
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright to scrape live rates via DOM selectors."""
        try:
            from playwright.sync_api import sync_playwright
            
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(
                    user_agent=(
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
                    ),
                    viewport={"width": 1280, "height": 800},
                    locale="en-CA",
                )
                page = context.new_page()
                
                # Block unnecessary resources to speed up load
                page.route(
                    "**/*",
                    lambda route: route.abort()
                    if route.request.resource_type in ["image", "media", "font", "stylesheet"]
                    else route.continue_()
                )
                
                page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=30000)
                page.wait_for_timeout(3000)  # Wait for React hydration
                
                rates = []
                
                # Strategy: Find the "Find a great rate" section and extract rate cards
                # Wealthsimple renders rates as structured text near headings
                main_content = page.locator("main").inner_html(timeout=10000)
                
                # Strategy 1: DOM-based extraction (most reliable for Wealthsimple's React-rendered page)
                rate_elements = page.locator('main p:has-text("%")').all()
                
                for elem in rate_elements:
                    text = elem.inner_text()
                    rate_val = self._extract_rate_from_text(text)
                    if rate_val and 2 <= float(rate_val) <= 15:
                        # Try to determine term and type from nearby context
                        parent = elem.locator("xpath=..")
                        parent_text = parent.inner_text()
                        
                        years = 5  # Default
                        year_match = re.search(r'(\d+)\s+year', parent_text, re.IGNORECASE)
                        if year_match:
                            years = int(year_match.group(1))
                        
                        rate_type = RateType.FIXED
                        if "variable" in parent_text.lower():
                            rate_type = RateType.VARIABLE
                        
                        rates.append(RawRate(
                            lender_slug=self.LENDER_SLUG,
                            lender_name=self.LENDER_NAME,
                            term_months=years * 12,
                            rate_type=rate_type,
                            mortgage_type=MortgageType.INSURED,
                            rate=rate_val,
                            source_url=self.RATE_URL,
                            scraped_at=self.scraped_at,
                            raw_data={
                                "source": "wealthsimple_live_scrape",
                                "years": years,
                                "extraction_method": "dom_based",
                                "context_text": parent_text[:200]
                            }
                        ))
                
                # Strategy 2: If DOM-based fails, try text pattern on full page text
                if not rates:
                    logger.info("DOM extraction failed, trying text pattern...")
                    
                    page_text = page.locator("main").inner_text(timeout=10000)
                    
                    # Find "5 year term" blocks with rates (tolerate whitespace/newlines)
                    term_blocks = re.finditer(
                        r'(\d+)\s+year\s+term\s+(\d+\.\d+)%\s+(Fixed|Variable)\s+mortgage\s+rate',
                        page_text,
                        re.IGNORECASE | re.DOTALL
                    )
                    
                    for match in term_blocks:
                        try:
                            years = int(match.group(1))
                            rate = Decimal(match.group(2))
                            rate_type_str = match.group(3).lower()
                            rate_type = RateType.FIXED if rate_type_str == "fixed" else RateType.VARIABLE
                            
                            if 1 <= years <= 10 and 2 <= float(rate) <= 15:
                                rates.append(RawRate(
                                    lender_slug=self.LENDER_SLUG,
                                    lender_name=self.LENDER_NAME,
                                    term_months=years * 12,
                                    rate_type=rate_type,
                                    mortgage_type=MortgageType.INSURED,
                                    rate=rate,
                                    source_url=self.RATE_URL,
                                    scraped_at=self.scraped_at,
                                    raw_data={
                                        "source": "wealthsimple_live_scrape",
                                        "years": years,
                                        "extraction_method": "text_pattern"
                                    }
                                ))
                        except Exception as e:
                            logger.debug(f"Skipping malformed match: {e}")
                
                # Strategy 3: JSON-LD or structured data
                if not rates:
                    logger.info("DOM extraction failed, trying structured data...")
                    scripts = page.locator('script[type="application/ld+json"]').all()
                    for script in scripts:
                        try:
                            import json
                            data = json.loads(script.inner_text())
                            if isinstance(data, dict) and "offers" in data:
                                for offer in data.get("offers", []):
                                    if "interestRate" in offer:
                                        rate = Decimal(str(offer["interestRate"]))
                                        rates.append(RawRate(
                                            lender_slug=self.LENDER_SLUG,
                                            lender_name=self.LENDER_NAME,
                                            term_months=60,
                                            rate_type=RateType.FIXED,
                                            mortgage_type=MortgageType.INSURED,
                                            rate=rate,
                                            source_url=self.RATE_URL,
                                            scraped_at=self.scraped_at,
                                            raw_data={
                                                "source": "wealthsimple_jsonld",
                                                "extraction_method": "structured_data"
                                            }
                                        ))
                        except Exception:
                            pass
                
                browser.close()
                
                # Deduplicate by term+type
                seen = set()
                unique_rates = []
                for r in rates:
                    key = (r.term_months, r.rate_type)
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


if __name__ == "__main__":
    scraper = WealthsimpleScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Wealthsimple:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.term_months, x.rate_type.value)):
            years = r.term_months // 12
            method = r.raw_data.get("extraction_method", "unknown")
            print(f"  {years}yr {r.rate_type.value:8} {r.rate}%  ({method})")
            
        print("-" * 60)
        
        if not rates:
            print("WARNING: No rates scraped — check if page structure changed.")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()