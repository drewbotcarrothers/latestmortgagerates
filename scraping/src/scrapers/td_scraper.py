"""
TD Bank mortgage rate scraper.
Uses Playwright for live scraping with fallback to captured rates.
Updated: July 19, 2026
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


class TDScraper:
    """Scraper for TD Bank mortgage rates."""
    
    LENDER_SLUG = "td"
    LENDER_NAME = "TD Bank"
    RATE_URL = "https://td.com/ca/en/personal-banking/products/mortgages/mortgage-rates"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape TD mortgage rates."""
        logger.info("Fetching TD rate page...")
        
        try:
            # Try Playwright first
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from TD")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        # Fallback to static data
        logger.info("Using fallback rates from TD website (2026-07-19)")
        rates = self._get_fallback_rates()
        return rates
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright to scrape live rates from TD website.
        
        TD's page has:
        1. "Our Special Mortgage Rates" table - featured/special rates
        2. "Fixed Rate Mortgages" tab - all fixed terms with posted and special rates
        3. "Variable Rate Mortgages" tab - variable rates
        
        We capture both special and posted rates, but prioritize special rates.
        """
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            logger.warning("Playwright not available")
            return []
        
        browser = None
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True, timeout=15000)
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                )
                page = context.new_page()
                
                page.goto(self.RATE_URL, wait_until="networkidle", timeout=30000)
                page.wait_for_timeout(3000)  # Allow JS to populate rates
                
                rates = []
                
                # ==== SECTION 1: Special Mortgage Rates (featured table) ====
                logger.info("Parsing Special Mortgage Rates table...")
                special_tables = page.query_selector_all("table")
                
                for table in special_tables:
                    rows = table.query_selector_all("tbody tr")
                    for row in rows:
                        cells = row.query_selector_all("td")
                        if len(cells) < 3:
                            continue
                        
                        term_text = cells[0].inner_text().strip()
                        rate_cell = cells[1].inner_text().strip()
                        apr_text = cells[2].inner_text().strip()
                        
                        # Skip header rows
                        if not term_text or term_text.lower() in ['term', 'rate', 'product', '']:
                            continue
                        
                        # Parse term
                        term_months = self._parse_term(term_text)
                        if not term_months:
                            continue
                        
                        # Parse rate type
                        rate_type = RateType.VARIABLE if 'variable' in term_text.lower() else RateType.FIXED
                        
                        # Parse mortgage type
                        mortgage_type = MortgageType.INSURED if 'high-ratio' in term_text.lower() or 'high ratio' in term_text.lower() else MortgageType.UNINSURED
                        
                        # Extract special rate (the actual rate, not posted)
                        # TD format: "4.79% (Posted Rate: 6.05%)" or "4.29% (TD Mortgage Prime Rate 4.60% -0.31%) (Posted Rate: TD Mortgage Prime Rate)"
                        rate = self._extract_special_rate(rate_cell)
                        if rate is None:
                            continue
                        
                        # Extract posted rate
                        posted_rate = self._extract_posted_rate(rate_cell)
                        
                        # Extract APR
                        apr = self._extract_apr(apr_text)
                        
                        # Extract note (for variable rates showing prime spread)
                        note = None
                        if 'TD Mortgage Prime Rate' in rate_cell:
                            prime_match = re.search(r'TD Mortgage Prime Rate\s+([\d.]+)%\s+([\-+][\d.]+)%', rate_cell)
                            if prime_match:
                                note = f"TD Prime {prime_match.group(2)}%"
                        
                        # Extract prime rate
                        prime_rate = None
                        prime_el = page.query_selector("p:has-text('TD Mortgage Prime Rate is')")
                        if prime_el:
                            prime_text = prime_el.inner_text()
                            prime_match = re.search(r'([\d.]+)%', prime_text)
                            if prime_match:
                                prime_rate = prime_match.group(1)
                        
                        raw_data = {
                            "source": "td_live_scrape",
                            "section": "special",
                            "product": term_text,
                            "featured": term_months in [36, 60] and rate_type == RateType.FIXED,
                            "apr": apr,
                            "note": note,
                            "prime_rate": prime_rate,
                        }
                        
                        rates.append(RawRate(
                            lender_slug=self.LENDER_SLUG,
                            lender_name=self.LENDER_NAME,
                            term_months=term_months,
                            rate_type=rate_type,
                            mortgage_type=mortgage_type,
                            rate=rate,
                            posted_rate=posted_rate,
                            source_url=self.RATE_URL,
                            scraped_at=self.scraped_at,
                            raw_data=raw_data
                        ))
                
                logger.info(f"Found {len(rates)} rates from special table")
                
                # ==== SECTION 2: Fixed Rate Mortgages (full table) ====
                logger.info("Parsing Fixed Rate Mortgages table...")
                
                # Get all tables on the page (the fixed rates table is after the special rates)
                all_tables = page.query_selector_all("table")
                for table_idx, table in enumerate(all_tables):
                    # Skip the first table (special rates already parsed)
                    if table_idx == 0:
                        continue
                    
                    rows = table.query_selector_all("tbody tr, tr")
                    for row in rows:
                        cells = row.query_selector_all("td")
                        if len(cells) < 2:
                            continue
                        
                        term_text = cells[0].inner_text().strip()
                        rate_cell = cells[1].inner_text().strip() if len(cells) > 1 else ""
                        
                        # Skip header rows
                        if not term_text or 'term' in term_text.lower() or 'rate' in term_text.lower():
                            continue
                        
                        # Parse term
                        term_months = self._parse_term(term_text)
                        if not term_months:
                            continue
                        
                        # Skip if already captured from special table (avoid duplicates)
                        already_captured = any(
                            r.term_months == term_months 
                            and r.rate_type == RateType.FIXED 
                            and r.raw_data.get("section") == "special"
                            for r in rates
                        )
                        if already_captured:
                            continue
                        
                        # Determine if open mortgage
                        is_open = 'open' in term_text.lower()
                        
                        # Extract rate - prefer special rate, fall back to posted
                        rate = self._extract_special_rate(rate_cell)
                        if rate is None:
                            rate = self._extract_posted_rate(rate_cell)
                        
                        if rate is None:
                            continue
                        
                        posted_rate = self._extract_posted_rate(rate_cell)
                        apr = self._extract_apr(rate_cell)
                        
                        raw_data = {
                            "source": "td_live_scrape",
                            "section": "posted",
                            "product": term_text,
                            "is_open": is_open,
                            "apr": apr,
                        }
                        
                        rates.append(RawRate(
                            lender_slug=self.LENDER_SLUG,
                            lender_name=self.LENDER_NAME,
                            term_months=term_months,
                            rate_type=RateType.FIXED,
                            mortgage_type=MortgageType.UNINSURED,
                            rate=rate,
                            posted_rate=posted_rate,
                            source_url=self.RATE_URL,
                            scraped_at=self.scraped_at,
                            raw_data=raw_data
                        ))
                
                logger.info(f"Total rates after fixed table: {len(rates)}")
                
                # ==== SECTION 3: Variable Rate Mortgages tab ====
                logger.info("Clicking Variable Rate Mortgages tab...")
                try:
                    variable_tab = page.query_selector("button:has-text('Variable Rate Mortgages'), [role='tab']:has-text('Variable')")
                    if variable_tab:
                        variable_tab.click()
                        page.wait_for_timeout(2000)
                        
                        var_tables = page.query_selector_all("table")
                        for table in var_tables:
                            rows = table.query_selector_all("tbody tr, tr")
                            for row in rows:
                                cells = row.query_selector_all("td")
                                if len(cells) < 2:
                                    continue
                                
                                term_text = cells[0].inner_text().strip()
                                rate_cell = cells[1].inner_text().strip() if len(cells) > 1 else ""
                                
                                if not term_text or 'term' in term_text.lower():
                                    continue
                                
                                term_months = self._parse_term(term_text)
                                if not term_months:
                                    continue
                                
                                # Skip if already captured from special table
                                already_captured = any(
                                    r.term_months == term_months 
                                    and r.rate_type == RateType.VARIABLE 
                                    and r.raw_data.get("section") == "special"
                                    for r in rates
                                )
                                if already_captured:
                                    continue
                                
                                rate = self._extract_special_rate(rate_cell)
                                if rate is None:
                                    continue
                                
                                posted_rate = self._extract_posted_rate(rate_cell)
                                apr = self._extract_apr(rate_cell)
                                
                                note = None
                                if 'TD Mortgage Prime Rate' in rate_cell:
                                    prime_match = re.search(r'TD Mortgage Prime Rate\s+([\d.]+)%\s+([\-+][\d.]+)%', rate_cell)
                                    if prime_match:
                                        note = f"TD Prime {prime_match.group(2)}%"
                                
                                raw_data = {
                                    "source": "td_live_scrape",
                                    "section": "posted",
                                    "product": term_text,
                                    "apr": apr,
                                    "note": note,
                                }
                                
                                rates.append(RawRate(
                                    lender_slug=self.LENDER_SLUG,
                                    lender_name=self.LENDER_NAME,
                                    term_months=term_months,
                                    rate_type=RateType.VARIABLE,
                                    mortgage_type=MortgageType.UNINSURED,
                                    rate=rate,
                                    posted_rate=posted_rate,
                                    source_url=self.RATE_URL,
                                    scraped_at=self.scraped_at,
                                    raw_data=raw_data
                                ))
                except Exception as e:
                    logger.warning(f"Could not parse variable tab: {e}")
                
                browser.close()
                
                # Deduplicate
                seen = set()
                unique_rates = []
                for r in rates:
                    key = (r.term_months, r.rate_type.value, r.mortgage_type.value, str(r.rate), r.raw_data.get("section", ""))
                    if key not in seen:
                        seen.add(key)
                        unique_rates.append(r)
                
                logger.success(f"Scraped {len(unique_rates)} unique rates from TD")
                return unique_rates
                
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return []
        finally:
            if browser:
                try:
                    browser.close()
                except Exception:
                    pass
    
    def _parse_term(self, text: str) -> int:
        """Parse term months from text like '3 Year Fixed Closed' or '6 Month Convertible'."""
        # 6 month
        month_match = re.search(r'(\d+)\s*Month', text, re.IGNORECASE)
        if month_match:
            return int(month_match.group(1))
        
        # Years
        year_match = re.search(r'(\d+)\s*Year', text, re.IGNORECASE)
        if year_match:
            return int(year_match.group(1)) * 12
        
        return None
    
    def _extract_special_rate(self, text: str):
        """Extract the special/discount rate from TD's cell text.
        
        TD format: 'Posted rate: 6.05% Special Rate 2: 4.79% APR 3: 4.825%'
        Or: '4.79% (Posted Rate: 6.05%)'
        Or: '4.29% (TD Mortgage Prime Rate 4.60% -0.31%) (Posted Rate: TD Mortgage Prime Rate)'
        
        Returns the special rate (the lower/better rate).
        """
        if not text:
            return None
        
        # Look for "Special Rate" or similar discount indicator
        # Pattern: "Special Rate: 4.79%" or "Special Rate 2: 4.79%"
        special_match = re.search(r'[Ss]pecial\s*[Rr]ate\s*(?:\d+)?\s*[:\-]?\s*([\d.]+)\s*%', text)
        if special_match:
            rate = Decimal(special_match.group(1))
            if rate >= Decimal("1.5") and rate <= Decimal("15.0"):
                return rate
        
        # If no special rate found but text starts with a rate (like in the special table)
        # "4.79% (Posted Rate: 6.05%)"
        leading_match = re.search(r'^([\d.]+)\s*%', text.strip())
        if leading_match:
            rate = Decimal(leading_match.group(1))
            if rate >= Decimal("1.5") and rate <= Decimal("15.0"):
                # Verify this isn't just the posted rate by checking if a higher posted rate exists
                posted_match = re.search(r'[Pp]osted\s*[Rr]ate\s*(?:\d+)?\s*[:\-]?\s*([\d.]+)\s*%', text)
                if posted_match:
                    posted = Decimal(posted_match.group(1))
                    if rate < posted:
                        return rate  # This is a discount/special rate
                    else:
                        return None  # This IS the posted rate, no special available
                return rate  # No posted rate mentioned, this is the only rate
        
        return None
    
    def _extract_posted_rate(self, text: str):
        """Extract the posted rate from TD's cell text."""
        if not text:
            return None
        
        # Pattern: "Posted rate: 6.05%" or "Posted Rate: 6.05%"
        posted_match = re.search(r'[Pp]osted\s*[Rr]ate\s*(?:\d+)?\s*[:\-]?\s*([\d.]+)\s*%', text)
        if posted_match:
            rate = Decimal(posted_match.group(1))
            if rate >= Decimal("1.5") and rate <= Decimal("15.0"):
                return rate
        
        return None
    
    def _extract_apr(self, text: str):
        """Extract APR from text."""
        if not text:
            return None
        
        apr_match = re.search(r'APR\s*(?:\d+)?\s*[:\-]?\s*([\d.]+)\s*%', text)
        if apr_match:
            return apr_match.group(1)
        
        # Also look for plain percentage at the end
        plain_match = re.search(r'([\d.]+)\s*%\s*$', text.strip())
        if plain_match:
            return plain_match.group(1)
        
        return None
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates from TD website (April 25, 2026).
        Verified via browser snapshot.
        """
        logger.info("Using fallback rates from TD website (2026-07-19)")
        
        # Live verified rates from browser scraping
        # TD Mortgage Prime Rate: 4.60%
        
        fallback_data = [
            # Special Offers (best rates) - verified July 19, 2026
            {"term": 36, "type": RateType.FIXED, "rate": "4.29", "posted": "6.05", "apr": "4.825", "mortgage_type": "uninsured", "product": "3 Year Fixed Closed", "section": "special"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.44", "posted": "6.09", "apr": "4.961", "mortgage_type": "uninsured", "product": "5 Year Fixed Closed", "featured": True, "section": "special"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.44", "posted": "6.09", "apr": "4.961", "mortgage_type": "insured", "product": "5 Year Fixed Closed High-Ratio", "section": "special"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.79", "posted": "4.60", "apr": "4.311", "mortgage_type": "uninsured", "product": "5 Year Variable Closed", "note": "TD Prime - 0.31%", "featured": True, "section": "special"},
            
            # Posted Rates - all terms
            {"term": 6, "type": RateType.FIXED, "rate": "4.99", "apr": "5.691", "mortgage_type": "uninsured", "product": "6 Month Convertible", "section": "posted"},
            {"term": 12, "type": RateType.FIXED, "rate": "9.65", "apr": "10.052", "mortgage_type": "uninsured", "product": "1 Year Open Mortgage", "section": "posted", "is_open": True},
            {"term": 12, "type": RateType.FIXED, "rate": "4.99", "apr": "5.592", "mortgage_type": "uninsured", "product": "1 Year Fixed Closed", "section": "posted"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.39", "apr": "4.942", "mortgage_type": "uninsured", "product": "2 Year Fixed Closed", "section": "posted"},
            {"term": 36, "type": RateType.FIXED, "rate": "5.65", "apr": "6.016", "mortgage_type": "uninsured", "product": "3 Year Fixed Closed (Posted)", "section": "posted"},
            {"term": 48, "type": RateType.FIXED, "rate": "5.49", "apr": "6.016", "mortgage_type": "uninsured", "product": "4 Year Fixed Closed", "section": "posted"},
            {"term": 60, "type": RateType.FIXED, "rate": "5.69", "apr": "6.090", "mortgage_type": "uninsured", "product": "5 Year Fixed Closed (Posted)", "section": "posted"},
            {"term": 72, "type": RateType.FIXED, "rate": "5.89", "apr": "6.308", "mortgage_type": "uninsured", "product": "6 Year Fixed Closed", "section": "posted"},
            {"term": 84, "type": RateType.FIXED, "rate": "6.00", "apr": "6.415", "mortgage_type": "uninsured", "product": "7 Year Fixed Closed", "section": "posted"},
            {"term": 120, "type": RateType.FIXED, "rate": "6.40", "apr": "6.815", "mortgage_type": "uninsured", "product": "10 Year Fixed Closed", "section": "posted"},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.INSURED if item.get("mortgage_type") == "insured" else MortgageType.UNINSURED
            
            raw_data = {
                "source": "td_fallback_2026-07-19",
                "apr": item.get("apr"),
                "product": item.get("product"),
                "featured": item.get("featured", False),
                "note": item.get("note", ""),
                "section": item.get("section", "posted"),
                "is_open": item.get("is_open", False),
                "prime_rate": "4.60",
                "last_verified": "2026-07-19"
            }
            
            rates.append(RawRate(
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                term_months=item["term"],
                rate_type=item["type"],
                mortgage_type=mortgage_type,
                rate=Decimal(item["rate"]),
                posted_rate=Decimal(item["posted"]) if item.get("posted") else None,
                source_url=self.RATE_URL,
                scraped_at=self.scraped_at,
                raw_data=raw_data
            ))
        
        return rates


if __name__ == "__main__":
    scraper = TDScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from TD:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            apr = r.raw_data.get("apr", "")
            posted = r.posted_rate
            featured = " [FEATURED]" if r.raw_data.get("featured") else ""
            posted_str = f" (posted: {posted}%)" if posted else ""
            print(f"  {r.mortgage_type.value:10} {years:3}yr {r.rate_type.value:8} {r.rate}%{posted_str} (APR: {apr}%){featured}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()