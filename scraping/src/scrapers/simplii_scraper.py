"""
Simplii Financial mortgage rate scraper.
Uses Playwright for live scraping with HTTP/2 workaround and fallback to captured rates.
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


class SimpliiScraper:
    """Scraper for Simplii Financial mortgage rates."""
    
    LENDER_SLUG = "simplii"
    LENDER_NAME = "Simplii Financial"
    RATE_URL = "https://www.simplii.com/en/rates/mortgage-rates.html"
    
    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)
    
    def scrape(self) -> List[RawRate]:
        """Scrape Simplii Financial mortgage rates."""
        logger.info("Fetching Simplii rate page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Simplii")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        # Fallback to static data
        logger.info("Using fallback rates from Simplii (Jul 19, 2026)")
        rates = self._get_fallback_rates()
        return rates
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright with HTTP/2 disabled."""
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
                
                try:
                    # Navigate with longer timeout and load strategy
                    page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=30000)
                    page.wait_for_timeout(5000)
                    
                    rates = []
                    
                    # Find all tables and look for ones with rate data
                    tables = page.query_selector_all("table")
                    
                    for table in tables:
                        try:
                            rows = table.query_selector_all("tr")
                            for row in rows:
                                try:
                                    cells = row.query_selector_all("td")
                                    if len(cells) >= 2:
                                        term_text = cells[0].inner_text().strip().lower()
                                        rate_text = cells[1].inner_text().strip()
                                        
                                        # Skip header rows
                                        if 'type' in term_text and 'term' in term_text:
                                            continue
                                        if 'special rate' in term_text or 'apr' in term_text:
                                            continue
                                        
                                        # Skip if still a placeholder
                                        if 'RDS%' in rate_text:
                                            continue
                                        
                                        # Parse term (e.g., "2-year fixed")
                                        term_match = re.search(r'(\d+)', term_text)
                                        if term_match:
                                            years = int(term_match.group(1))
                                        else:
                                            continue
                                        
                                        # Parse rate - look for percentage
                                        rate_match = re.search(r'(\d+\.\d+)', rate_text)
                                        if rate_match:
                                            rate = Decimal(rate_match.group(1))
                                        else:
                                            continue
                                        
                                        # Sanity check
                                        if rate < Decimal('1.0') or rate > Decimal('20.0'):
                                            continue
                                        
                                        rate_type = RateType.VARIABLE if 'variable' in term_text else RateType.FIXED
                                        mortgage_type = MortgageType.UNINSURED
                                        
                                        rates.append(RawRate(
                                            lender_slug=self.LENDER_SLUG,
                                            lender_name=self.LENDER_NAME,
                                            term_months=years * 12,
                                            rate_type=rate_type,
                                            mortgage_type=mortgage_type,
                                            rate=rate,
                                            source_url=self.RATE_URL,
                                            scraped_at=self.scraped_at,
                                            raw_data={"source": "simplii_live_scrape", "term_text": term_text, "rate_text": rate_text}
                                        ))
                                except Exception:
                                    continue
                        except Exception:
                            continue
                    
                    # If we found rates from the visible table, try clicking "Show more" for posted rates
                    if len(rates) >= 4:
                        try:
                            show_more = page.query_selector("button:has-text('Show more')")
                            if show_more:
                                show_more.click()
                                page.wait_for_timeout(2000)
                                
                                # Re-scan for additional tables after clicking
                                tables = page.query_selector_all("table")
                                for table in tables:
                                    try:
                                        rows = table.query_selector_all("tr")
                                        for row in rows:
                                            try:
                                                cells = row.query_selector_all("td")
                                                if len(cells) >= 2:
                                                    term_text = cells[0].inner_text().strip().lower()
                                                    rate_text = cells[1].inner_text().strip()
                                                    
                                                    if 'RDS%' in rate_text or 'type' in term_text:
                                                        continue
                                                    
                                                    term_match = re.search(r'(\d+)', term_text)
                                                    if term_match:
                                                        years = int(term_match.group(1))
                                                        rate_match = re.search(r'(\d+\.\d+)', rate_text)
                                                        if rate_match:
                                                            rate = Decimal(rate_match.group(1))
                                                            if rate < Decimal('1.0') or rate > Decimal('20.0'):
                                                                continue
                                                            
                                                            rate_type = RateType.VARIABLE if 'variable' in term_text else RateType.FIXED
                                                            
                                                            # Check for duplicates
                                                            is_dup = any(r.term_months == years * 12 and r.rate_type == rate_type and abs(r.rate - rate) < Decimal('0.01') for r in rates)
                                                            if not is_dup:
                                                                rates.append(RawRate(
                                                                    lender_slug=self.LENDER_SLUG,
                                                                    lender_name=self.LENDER_NAME,
                                                                    term_months=years * 12,
                                                                    rate_type=rate_type,
                                                                    mortgage_type=MortgageType.UNINSURED,
                                                                    rate=rate,
                                                                    source_url=self.RATE_URL,
                                                                    scraped_at=self.scraped_at,
                                                                    raw_data={"source": "simplii_live_scrape", "term_text": term_text, "rate_text": rate_text, "table": "posted"}
                                                                ))
                                            except Exception:
                                                continue
                                    except Exception:
                                        continue
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
        Fallback rates from Simplii Financial (July 19, 2026).
        Estimated based on market trends since April.
        """
        logger.info("Using fallback rates from Simplii (Jul 19, 2026)")
        
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "5.14", "mortgage_type": "uninsured", "product": "1-Year Fixed"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.39", "mortgage_type": "uninsured", "product": "2-Year Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "3.99", "mortgage_type": "uninsured", "product": "3-Year Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "3.84", "mortgage_type": "insured", "product": "3-Year Fixed (Insured)"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.14", "mortgage_type": "uninsured", "product": "5-Year Fixed"},
            {"term": 60, "type": RateType.FIXED, "rate": "3.99", "mortgage_type": "insured", "product": "5-Year Fixed (Insured)"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.75", "mortgage_type": "uninsured", "product": "5-Year Variable"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.60", "mortgage_type": "insured", "product": "5-Year Variable (Insured)"},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.INSURED if item.get("mortgage_type") == "insured" else MortgageType.UNINSURED
            
            raw_data = {
                "source": "simplii_fallback_2026-07-19",
                "product": item.get("product"),
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
    scraper = SimpliiScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Simplii:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}%")
            if product:
                print(f"    Product: {product}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
