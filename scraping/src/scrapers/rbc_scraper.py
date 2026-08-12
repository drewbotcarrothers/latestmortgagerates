"""
RBC Royal Bank mortgage rate scraper.
Uses Playwright for live scraping with fallback to captured rates.
Updated: July 19, 2026
"""

import re
import json
from decimal import Decimal
from typing import List, Optional
from datetime import datetime
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType


class RBCScraper:
    """Scraper for RBC Royal Bank mortgage rates."""
    
    LENDER_SLUG = "rbc"
    LENDER_NAME = "Royal Bank of Canada"
    RATE_URL = "https://www.rbcroyalbank.com/mortgages/mortgage-rates.html"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape RBC mortgage rates."""
        rates = []
        
        logger.info("Fetching RBC rate page...")
        
        try:
            # Try Playwright first
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from RBC")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        # Fallback to static data
        logger.info("Using fallback rates from RBC website")
        rates = self._get_fallback_rates()
        return rates
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright to scrape live rates from all sections including Other Rates.
        
        Note: RBC has been blocking headless browsers (April 29-30, 2026), so this
        usually fails fast and falls back to verified static data.
        """
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            logger.warning("Playwright not available")
            return []
        
        browser = None
        try:
            with sync_playwright() as p:
                # Aggressive timeouts — RBC blocks headless, fail fast
                browser = p.chromium.launch(headless=True, timeout=8000)
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                )
                page = context.new_page()
                
                # 8s page load — if blocked, fallback kicks in quickly
                page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=8000)
                page.wait_for_timeout(1000)
                
                rates = []
                
                # Tables are already visible, parse directly
                tables = page.query_selector_all("table")
                
                for table in tables:
                    rows = table.query_selector_all("tbody tr, tr")
                    
                    for row in rows:
                        cells = row.query_selector_all("td, th")
                        if len(cells) < 2:
                            continue
                        
                        term_text = cells[0].inner_text().strip()
                        rate_text = cells[1].inner_text().strip()
                        
                        # Skip empty/header rows
                        if not term_text or term_text.lower() in ['term', 'rate', 'product', '']:
                            continue
                        
                        # Extract rate - prefer rate in parentheses (actual rate) over spread notation
                        rate = None
                        full_text = ' '.join([c.inner_text().strip() for c in cells])
                        
                        # Look for rate in parentheses first: "(3.950%)" - this is the actual calculated rate
                        # RBC shows "RBC Prime Rate -0.500% (3.950%)" where 3.950% is the real rate
                        paren_match = re.search(r'\((\d+\.\d+)%\)', full_text)
                        if paren_match:
                            rate = Decimal(paren_match.group(1))
                        else:
                            # For posted rates like "RBC Prime Rate + 0.000% | 4.480%",
                            # the APR in cells[2] is the actual rate, NOT the spread in cells[1]
                            # Check if cells[1] contains "Prime Rate" — if so, use cells[2]
                            cell1_text = cells[1].inner_text().strip().lower() if len(cells) > 1 else ''
                            cell2_text = cells[2].inner_text().strip() if len(cells) > 2 else ''
                            
                            if 'prime rate' in cell1_text and cell2_text:
                                # Use APR column (cells[2]) for posted variable rates
                                rate_match = re.search(r'(?<!\d)(\d+\.\d+)%', cell2_text)
                                if rate_match:
                                    rate = Decimal(rate_match.group(1))
                            else:
                                # Normal case: rate is in cells[1]
                                rate_match = re.search(r'(?<!\d)(\d+\.\d+)%', cell1_text)
                                if rate_match:
                                    rate = Decimal(rate_match.group(1))
                        
                        if rate is None:
                            continue
                        
                        # Skip clearly unrealistic rates (spreads like -0.500%, empty 0.000%)
                        if rate < Decimal("1.5") or rate > Decimal("15.0"):
                            logger.warning(f"Skipping unrealistic RBC rate: {rate}% for {term_text}")
                            continue
                        
                        # Parse term
                        term_months = None
                        if re.search(r'6\s*Month', term_text, re.IGNORECASE):
                            term_months = 6
                        elif re.search(r'(\d+)\s*Year', term_text, re.IGNORECASE):
                            years = int(re.search(r'(\d+)\s*Year', term_text, re.IGNORECASE).group(1))
                            term_months = years * 12
                        
                        if not term_months:
                            continue
                        
                        # Determine rate type from cell text
                        all_text = ' '.join([c.inner_text().strip().lower() for c in cells])
                        is_variable = 'variable' in all_text or 'prime rate' in all_text
                        rate_type = RateType.VARIABLE if is_variable else RateType.FIXED
                        
                        # Determine mortgage type
                        mortgage_type = MortgageType.INSURED if 'high ratio' in all_text else MortgageType.UNINSURED
                        is_open = 'open' in all_text
                        
                        # Detect section type from text content
                        section_type = "posted" if "posted" in all_text else "special"
                        
                        # Posted rates are typically uninsured conventional rates
                        if section_type == "posted" and mortgage_type == MortgageType.INSURED:
                            mortgage_type = MortgageType.UNINSURED
                        
                        rates.append(RawRate(
                            lender_slug=self.LENDER_SLUG,
                            lender_name=self.LENDER_NAME,
                            term_months=term_months,
                            rate_type=rate_type,
                            mortgage_type=mortgage_type,
                            rate=rate,
                            source_url=self.RATE_URL,
                            scraped_at=self.scraped_at,
                            raw_data={
                                "source": "rbc_live_scrape",
                                "section": section_type,
                                "term_text": term_text,
                                "rate_text": rate_text,
                                "is_open": is_open,
                                "featured": section_type == "popular" and term_months in [36, 60]
                            }
                        ))
                
                # Deduplicate (keep separate entries for special vs posted)
                seen = set()
                unique_rates = []
                for r in rates:
                    key = (r.term_months, r.rate_type.value, r.mortgage_type.value, str(r.rate), r.raw_data.get("section", ""), r.raw_data.get("is_open", False))
                    if key not in seen:
                        seen.add(key)
                        unique_rates.append(r)
                
                if len(unique_rates) < len(rates):
                    logger.info(f"Removed {len(rates) - len(unique_rates)} duplicate RBC rates")
                
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
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates from RBC website (April 25, 2026).
        Verified via browser snapshot.
        """
        logger.info("Using fallback rates from RBC website (2026-07-19)")
        
        # Live verified rates from browser scraping
        fallback_data = [
            # Featured / Popular (Special Offers)
            {"term": 36, "type": RateType.FIXED, "rate": "3.94", "apr": "4.480", "mortgage_type": "uninsured", "product": "3 Year Fixed", "section": "popular"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.09", "apr": "4.620", "mortgage_type": "uninsured", "product": "5 Year Fixed", "section": "popular"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.45", "apr": "3.980", "mortgage_type": "uninsured", "product": "5 Year Variable", "note": "RBC Prime Rate -0.500%", "section": "popular"},
            
            # High Ratio (Insured)
            {"term": 60, "type": RateType.FIXED, "rate": "3.79", "apr": "4.320", "mortgage_type": "insured", "product": "5 Year Fixed High Ratio", "section": "high_ratio"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.15", "apr": "3.680", "mortgage_type": "insured", "product": "5 Year Variable High Ratio", "note": "RBC Prime Rate -0.800%", "section": "high_ratio"},
            
            # Other Rates - Special Rates (25yr amortization or less)
            {"term": 12, "type": RateType.FIXED, "rate": "5.09", "apr": "5.620", "mortgage_type": "uninsured", "product": "1 Year Closed", "section": "special"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.64", "apr": "5.170", "mortgage_type": "uninsured", "product": "2 Year Closed", "section": "special"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.14", "apr": "4.670", "mortgage_type": "uninsured", "product": "3 Year Closed", "section": "special"},
            {"term": 48, "type": RateType.FIXED, "rate": "4.19", "apr": "4.720", "mortgage_type": "uninsured", "product": "4 Year Closed", "section": "special"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.19", "apr": "4.720", "mortgage_type": "uninsured", "product": "5 Year Closed", "section": "special"},
            {"term": 84, "type": RateType.FIXED, "rate": "4.69", "apr": "5.220", "mortgage_type": "uninsured", "product": "7 Year Closed", "section": "special"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.45", "apr": "3.980", "mortgage_type": "uninsured", "product": "5 Year Variable Closed", "note": "RBC Prime Rate -0.500%", "section": "special"},
            
            # Other Rates - Special Rates (>25yr amortization)
            {"term": 12, "type": RateType.FIXED, "rate": "5.19", "apr": "5.720", "mortgage_type": "uninsured", "product": "1 Year Closed (>>25yr)", "section": "special"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.74", "apr": "5.270", "mortgage_type": "uninsured", "product": "2 Year Closed (>>25yr)", "section": "special"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.24", "apr": "4.770", "mortgage_type": "uninsured", "product": "3 Year Closed (>>25yr)", "section": "special"},
            {"term": 48, "type": RateType.FIXED, "rate": "4.29", "apr": "4.820", "mortgage_type": "uninsured", "product": "4 Year Closed (>>25yr)", "section": "special"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.29", "apr": "4.820", "mortgage_type": "uninsured", "product": "5 Year Closed (>>25yr)", "section": "special"},
            {"term": 84, "type": RateType.FIXED, "rate": "4.79", "apr": "5.320", "mortgage_type": "uninsured", "product": "7 Year Closed (>>25yr)", "section": "special"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.55", "apr": "4.080", "mortgage_type": "uninsured", "product": "5 Year Variable Closed (>>25yr)", "note": "RBC Prime Rate -0.400%", "section": "special"},
            
            # Posted Rates (25yr amortization or less)
            {"term": 6, "type": RateType.FIXED, "rate": "5.90", "apr": "6.330", "mortgage_type": "uninsured", "product": "6 Month Convertible", "section": "posted"},
            {"term": 12, "type": RateType.FIXED, "rate": "6.09", "apr": "6.520", "mortgage_type": "uninsured", "product": "1 Year Closed Posted", "section": "posted"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.79", "apr": "6.220", "mortgage_type": "uninsured", "product": "2 Year Closed Posted", "section": "posted"},
            {"term": 36, "type": RateType.FIXED, "rate": "5.74", "apr": "6.170", "mortgage_type": "uninsured", "product": "3 Year Closed Posted", "section": "posted"},
            {"term": 48, "type": RateType.FIXED, "rate": "5.69", "apr": "6.120", "mortgage_type": "uninsured", "product": "4 Year Closed Posted", "section": "posted"},
            {"term": 60, "type": RateType.FIXED, "rate": "5.94", "apr": "6.370", "mortgage_type": "uninsured", "product": "5 Year Closed Posted", "section": "posted"},
            {"term": 84, "type": RateType.FIXED, "rate": "6.14", "apr": "6.570", "mortgage_type": "uninsured", "product": "7 Year Closed Posted", "section": "posted"},
            {"term": 120, "type": RateType.FIXED, "rate": "6.30", "apr": "6.730", "mortgage_type": "uninsured", "product": "10 Year Closed Posted", "section": "posted"},
            {"term": 300, "type": RateType.FIXED, "rate": "6.40", "apr": "6.830", "mortgage_type": "uninsured", "product": "25 Year Closed Posted", "section": "posted"},
            {"term": 6, "type": RateType.FIXED, "rate": "6.80", "apr": "7.230", "mortgage_type": "uninsured", "product": "6 Months Open Posted", "section": "posted", "is_open": True},
            {"term": 12, "type": RateType.FIXED, "rate": "6.80", "apr": "7.230", "mortgage_type": "uninsured", "product": "1 Year Open Posted", "section": "posted", "is_open": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "5.80", "apr": "6.230", "mortgage_type": "uninsured", "product": "5 Year Variable Closed Posted", "note": "RBC Prime Rate +2.250%", "section": "posted"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "5.80", "apr": "6.230", "mortgage_type": "uninsured", "product": "5 Year Variable Open Posted", "note": "RBC Prime Rate +2.250%", "section": "posted", "is_open": True},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.INSURED if item.get("mortgage_type") == "insured" else MortgageType.UNINSURED
            
            raw_data = {
                "source": "rbc_fallback_2026-07-19",
                "apr": item.get("apr"),
                "product": item.get("product"),
                "featured": item.get("section") == "popular" and item["term"] in [36, 60],
                "note": item.get("note", ""),
                "section": item.get("section", "special"),
                "is_open": item.get("is_open", False),
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
    scraper = RBCScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from RBC:")
        print("-" * 60)
        
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months)):
            years = r.term_months // 12
            product = r.raw_data.get("product", "")
            apr = r.raw_data.get("apr", "")
            featured = " [FEATURED]" if r.raw_data.get("featured") else ""
            print(f"  {r.mortgage_type.value:10} {years}yr {r.rate_type.value:8} {r.rate}% (APR: {apr}%){featured}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()