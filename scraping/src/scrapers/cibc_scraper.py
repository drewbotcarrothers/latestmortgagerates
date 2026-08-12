"""
CIBC mortgage rate scraper.
Uses Playwright for live scraping with HTTP/2 workaround.
Updated: August 12, 2026
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


class CIBCScraper:
    """Scraper for CIBC mortgage rates."""
    
    LENDER_SLUG = "cibc"
    LENDER_NAME = "Canadian Imperial Bank of Commerce"
    RATE_URL = "https://www.cibc.com/en/interest-rates/mortgage-rates.html"
    
    def __init__(self):
        self.scraped_at = datetime.now(datetime.now().astimezone().tzinfo)
    
    def scrape(self) -> List[RawRate]:
        """Scrape CIBC mortgage rates."""
        logger.info("Fetching CIBC rate page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from CIBC")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        logger.warning("CIBC live scrape failed — returning empty list")
        return []
    
    def _extract_rate_from_text(self, text: str) -> Decimal:
        """Extract rate value like '4.09%' from text."""
        match = re.search(r'(\d+\.\d+)', text)
        if match:
            return Decimal(match.group(1))
        return None
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright with HTTP/2 disabled."""
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
                
                # Navigate with longer timeout
                page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=30000)
                page.wait_for_timeout(3000)
                
                rates = []
                
                # Strategy 1: Look for rate cards/containers
                # CIBC renders rates in styled containers with headings like "5-YEAR FIXED"
                rate_sections = page.query_selector_all("[class*='rate'], [class*='Rate'], [class*='mortgage'], [class*='Mortgage']")
                
                for section in rate_sections:
                    try:
                        text = section.inner_text()
                        if '%' not in text:
                            continue
                        
                        # Look for term + rate pattern
                        term_match = re.search(r'(\d+)\s*(?:Year|Yr|YEAR|YR)', text, re.IGNORECASE)
                        if not term_match:
                            continue
                        
                        years = int(term_match.group(1))
                        
                        # Extract rate
                        rate_val = self._extract_rate_from_text(text)
                        if not rate_val:
                            continue
                        
                        # Determine type
                        rate_type = RateType.VARIABLE if 'variable' in text.lower() else RateType.FIXED
                        
                        # Determine mortgage type
                        mortgage_type = MortgageType.INSURED if 'high-ratio' in text.lower() or 'insured' in text.lower() else MortgageType.UNINSURED
                        
                        rates.append(RawRate(
                            lender_slug=self.LENDER_SLUG,
                            lender_name=self.LENDER_NAME,
                            term_months=years * 12,
                            rate_type=rate_type,
                            mortgage_type=mortgage_type,
                            rate=rate_val,
                            source_url=self.RATE_URL,
                            scraped_at=self.scraped_at,
                            raw_data={
                                "source": "cibc_live_scrape",
                                "extraction_method": "dom_section",
                                "context_text": text[:200]
                            }
                        ))
                    except Exception:
                        continue
                
                # Strategy 2: Text-based extraction
                if not rates:
                    logger.info("DOM extraction failed, trying text pattern...")
                    
                    page_text = page.locator("body").inner_text()
                    
                    # CIBC format: "5-YEAR FIXED" followed by rate values
                    # Also handle "RDS%rate" server-rendered placeholders
                    rate_blocks = re.finditer(
                        r'(\d+)\s*(?:Year|Yr|YEAR|YR)(?:\s+Term)?\s+(Fixed|Variable)(?:\s+Rate)?.*?\n?.*?(\d+\.\d+)(?:\s*%?)?',
                        page_text,
                        re.IGNORECASE | re.DOTALL
                    )
                    
                    for match in rate_blocks:
                        try:
                            years = int(match.group(1))
                            rate_type = RateType.FIXED if match.group(2).lower() == "fixed" else RateType.VARIABLE
                            rate = Decimal(match.group(3))
                            
                            rates.append(RawRate(
                                lender_slug=self.LENDER_SLUG,
                                lender_name=self.LENDER_NAME,
                                term_months=years * 12,
                                rate_type=rate_type,
                                mortgage_type=MortgageType.UNINSURED,
                                rate=rate,
                                source_url=self.RATE_URL,
                                scraped_at=self.scraped_at,
                                raw_data={
                                    "source": "cibc_live_scrape",
                                    "extraction_method": "text_pattern",
                                    "context": match.group(0)[:100]
                                }
                            ))
                        except Exception:
                            continue
                
                # Strategy 3: Check for server-rendered RDS placeholders
                if not rates:
                    logger.info("Trying RDS placeholder extraction...")
                    content = page.content()
                    
                    # RDS%rate[5].FRCM.Published(...) placeholders — but also check if actual values rendered
                    # Look for actual numeric rates in the content
                    rate_patterns = re.finditer(
                        r'(\d+)\s*Year\s+(Fixed|Variable).*?(\d+\.\d+)\s*%',
                        content,
                        re.IGNORECASE | re.DOTALL
                    )
                    
                    for match in rate_patterns:
                        try:
                            years = int(match.group(1))
                            rate_type = RateType.FIXED if match.group(2).lower() == "fixed" else RateType.VARIABLE
                            rate = Decimal(match.group(3))
                            
                            rates.append(RawRate(
                                lender_slug=self.LENDER_SLUG,
                                lender_name=self.LENDER_NAME,
                                term_months=years * 12,
                                rate_type=rate_type,
                                mortgage_type=MortgageType.UNINSURED,
                                rate=rate,
                                source_url=self.RATE_URL,
                                scraped_at=self.scraped_at,
                                raw_data={
                                    "source": "cibc_live_scrape",
                                    "extraction_method": "html_pattern"
                                }
                            ))
                        except Exception:
                            continue
                
                browser.close()
                
                # Deduplicate by term+type
                seen = set()
                unique_rates = []
                for r in rates:
                    key = (r.term_months, r.rate_type, r.mortgage_type)
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
    scraper = CIBCScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from CIBC:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            method = r.raw_data.get("extraction_method", "unknown")
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}%  ({method})")
        
        if not rates:
            print("WARNING: No rates scraped — check if page structure changed.")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
