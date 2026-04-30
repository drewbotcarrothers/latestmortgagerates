"""
RBC Royal Bank mortgage rate scraper.
Uses Playwright for live scraping with fallback to captured rates.
Updated: April 25, 2026
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
        """Use Playwright to scrape live rates from all sections including Other Rates."""
        try:
            from playwright.sync_api import sync_playwright
            
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                )
                page = context.new_page()
                
                page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=15000)
                page.wait_for_timeout(1500)  # Allow dynamic rate values to populate
                
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
                        
                        # Look for rate in parentheses first: "(3.950%)" - this is the actual rate
                        paren_match = re.search(r'\((\d+\.\d+)%\)', full_text)
                        if paren_match:
                            rate = Decimal(paren_match.group(1))
                        else:
                            # Fall back to first percentage in cells[1] or cells[2]
                            for cell_idx in [1, 2]:
                                if cell_idx < len(cells):
                                    cell_text = cells[cell_idx].inner_text().strip()
                                    # Look for standalone rate like "4.590%" or "4.59%"
                                    rate_match = re.search(r'(?<!\d)(\d+\.\d+)%', cell_text)
                                    if rate_match:
                                        rate = Decimal(rate_match.group(1))
                                        break
                        
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
                
                browser.close()
                
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
                
        except ImportError:
            logger.warning("Playwright not available")
            return []
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return []
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates from RBC website (April 25, 2026).
        Verified via browser snapshot.
        """
        logger.info("Using fallback rates from RBC website (Apr 25, 2026)")
        
        # Live verified rates from browser scraping
        fallback_data = [
            # Featured / Popular (Special Offers)
            {"term": 36, "type": RateType.FIXED, "rate": "4.440", "apr": "4.480", "mortgage_type": "uninsured", "product": "3 Year Fixed", "section": "popular"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.590", "apr": "4.620", "mortgage_type": "uninsured", "product": "5 Year Fixed", "section": "popular"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.950", "apr": "3.980", "mortgage_type": "uninsured", "product": "5 Year Variable", "note": "RBC Prime Rate -0.500%", "section": "popular"},
            
            # High Ratio (Insured)
            {"term": 60, "type": RateType.FIXED, "rate": "4.290", "apr": "4.320", "mortgage_type": "insured", "product": "5 Year Fixed High Ratio", "section": "high_ratio"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.650", "apr": "3.680", "mortgage_type": "insured", "product": "5 Year Variable High Ratio", "note": "RBC Prime Rate -0.800%", "section": "high_ratio"},
            
            # Other Rates - Special Rates (25yr amortization or less)
            {"term": 12, "type": RateType.FIXED, "rate": "5.590", "apr": "5.620", "mortgage_type": "uninsured", "product": "1 Year Closed", "section": "special"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.140", "apr": "5.170", "mortgage_type": "uninsured", "product": "2 Year Closed", "section": "special"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.640", "apr": "4.670", "mortgage_type": "uninsured", "product": "3 Year Closed", "section": "special"},
            {"term": 48, "type": RateType.FIXED, "rate": "4.690", "apr": "4.720", "mortgage_type": "uninsured", "product": "4 Year Closed", "section": "special"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.690", "apr": "4.720", "mortgage_type": "uninsured", "product": "5 Year Closed", "section": "special"},
            {"term": 84, "type": RateType.FIXED, "rate": "5.190", "apr": "5.220", "mortgage_type": "uninsured", "product": "7 Year Closed", "section": "special"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.950", "apr": "3.980", "mortgage_type": "uninsured", "product": "5 Year Variable Closed", "note": "RBC Prime Rate -0.500%", "section": "special"},
            
            # Other Rates - Special Rates (>25yr amortization)
            {"term": 12, "type": RateType.FIXED, "rate": "5.690", "apr": "5.720", "mortgage_type": "uninsured", "product": "1 Year Closed (>>25yr)", "section": "special"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.240", "apr": "5.270", "mortgage_type": "uninsured", "product": "2 Year Closed (>>25yr)", "section": "special"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.740", "apr": "4.770", "mortgage_type": "uninsured", "product": "3 Year Closed (>>25yr)", "section": "special"},
            {"term": 48, "type": RateType.FIXED, "rate": "4.790", "apr": "4.820", "mortgage_type": "uninsured", "product": "4 Year Closed (>>25yr)", "section": "special"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.790", "apr": "4.820", "mortgage_type": "uninsured", "product": "5 Year Closed (>>25yr)", "section": "special"},
            {"term": 84, "type": RateType.FIXED, "rate": "5.290", "apr": "5.320", "mortgage_type": "uninsured", "product": "7 Year Closed (>>25yr)", "section": "special"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.050", "apr": "4.080", "mortgage_type": "uninsured", "product": "5 Year Variable Closed (>>25yr)", "note": "RBC Prime Rate -0.400%", "section": "special"},
            
            # Posted Rates (25yr amortization or less)
            {"term": 6, "type": RateType.FIXED, "rate": "6.300", "apr": "6.330", "mortgage_type": "uninsured", "product": "6 Month Convertible", "section": "posted"},
            {"term": 12, "type": RateType.FIXED, "rate": "6.490", "apr": "6.520", "mortgage_type": "uninsured", "product": "1 Year Closed Posted", "section": "posted"},
            {"term": 24, "type": RateType.FIXED, "rate": "6.190", "apr": "6.220", "mortgage_type": "uninsured", "product": "2 Year Closed Posted", "section": "posted"},
            {"term": 36, "type": RateType.FIXED, "rate": "6.140", "apr": "6.170", "mortgage_type": "uninsured", "product": "3 Year Closed Posted", "section": "posted"},
            {"term": 48, "type": RateType.FIXED, "rate": "6.090", "apr": "6.120", "mortgage_type": "uninsured", "product": "4 Year Closed Posted", "section": "posted"},
            {"term": 60, "type": RateType.FIXED, "rate": "6.340", "apr": "6.370", "mortgage_type": "uninsured", "product": "5 Year Closed Posted", "section": "posted"},
            {"term": 84, "type": RateType.FIXED, "rate": "6.540", "apr": "6.570", "mortgage_type": "uninsured", "product": "7 Year Closed Posted", "section": "posted"},
            {"term": 120, "type": RateType.FIXED, "rate": "6.700", "apr": "6.730", "mortgage_type": "uninsured", "product": "10 Year Closed Posted", "section": "posted"},
            {"term": 300, "type": RateType.FIXED, "rate": "6.800", "apr": "6.830", "mortgage_type": "uninsured", "product": "25 Year Closed Posted", "section": "posted"},
            {"term": 6, "type": RateType.FIXED, "rate": "7.200", "apr": "7.230", "mortgage_type": "uninsured", "product": "6 Months Open Posted", "section": "posted", "is_open": True},
            {"term": 12, "type": RateType.FIXED, "rate": "7.200", "apr": "7.230", "mortgage_type": "uninsured", "product": "1 Year Open Posted", "section": "posted", "is_open": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "6.200", "apr": "6.230", "mortgage_type": "uninsured", "product": "5 Year Variable Closed Posted", "note": "RBC Prime Rate +2.250%", "section": "posted"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "6.200", "apr": "6.230", "mortgage_type": "uninsured", "product": "5 Year Variable Open Posted", "note": "RBC Prime Rate +2.250%", "section": "posted", "is_open": True},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.INSURED if item.get("mortgage_type") == "insured" else MortgageType.UNINSURED
            
            raw_data = {
                "source": "rbc_fallback_2026-04-25",
                "apr": item.get("apr"),
                "product": item.get("product"),
                "featured": item.get("section") == "popular" and item["term"] in [36, 60],
                "note": item.get("note", ""),
                "section": item.get("section", "special"),
                "is_open": item.get("is_open", False),
                "last_verified": "2026-04-25"
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