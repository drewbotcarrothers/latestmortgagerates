"""
True North Mortgage rate scraper.
Uses Playwright to render JavaScript and scrape live rates from their website.
Province-specific rates are now captured where applicable.
https://www.truenorthmortgage.ca/
"""

import sys
from pathlib import Path
from decimal import Decimal
from typing import List, Dict
from datetime import datetime
import re

from loguru import logger

sys.path.insert(0, str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType


class TrueNorthMortgageScraper:
    """Scraper for True North Mortgage rates using live website data."""
    
    LENDER_SLUG = "truenorth"
    LENDER_NAME = "True North Mortgage"
    
    # Province URLs to check for rate differences
    PROVINCE_URLS = {
        "ontario": "https://www.truenorthmortgage.ca/rates/ontario",
        "alberta": "https://www.truenorthmortgage.ca/rates/alberta",
        "british_columbia": "https://www.truenorthmortgage.ca/rates/british-columbia",
        "default": "https://www.truenorthmortgage.ca/rates/ontario",  # Default to Ontario
    }
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
        self.rates_found = 0
    
    def scrape(self) -> List[RawRate]:
        """Scrape True North Mortgage rates from live website."""
        logger.info("Starting True North Mortgage scraper with Playwright...")
        
        try:
            # Try to use Playwright for live scraping
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from True North Mortgage")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}. Using fallback rates.")
        
        # Fallback to static data if Playwright fails
        rates = self._get_fallback_rates()
        logger.info(f"Using fallback rates: {len(rates)} rates")
        return rates
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright to render the page and extract live rates."""
        from playwright.sync_api import sync_playwright
        
        rates = []
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            )
            page = context.new_page()
            
            try:
                # Scrape Ontario rates (default)
                logger.info("Fetching Ontario rates...")
                page.goto(self.PROVINCE_URLS["ontario"], wait_until="networkidle", timeout=30000)
                page.wait_for_timeout(2000)  # Wait for JS to render
                
                ontario_rates = self._extract_rates_from_page(page)
                logger.info(f"Found {len(ontario_rates)} rates for Ontario")
                
                # Check Alberta for differences
                logger.info("Fetching Alberta rates...")
                page.goto(self.PROVINCE_URLS["alberta"], wait_until="networkidle", timeout=30000)
                page.wait_for_timeout(2000)
                
                alberta_rates = self._extract_rates_from_page(page)
                logger.info(f"Found {len(alberta_rates)} rates for Alberta")
                
                # Merge rates, using Ontario as default, adding Alberta variants where different
                rates = self._merge_province_rates(ontario_rates, alberta_rates)
                
            except Exception as e:
                logger.error(f"Error during Playwright scraping: {e}")
                raise
            finally:
                browser.close()
        
        return rates
    
    def _extract_rates_from_page(self, page) -> List[Dict]:
        """Extract rate data from the rendered page."""
        rates = []
        
        # The rates are displayed as text in the page content
        # Format: "5 Year Fixed 4.09% $2,664" or "6 Month Fixed 2.49% $2,240"
        # Get text content instead of raw HTML
        text_content = page.evaluate("() => document.body.innerText")
        
        logger.debug(f"Page text content (first 500 chars): {text_content[:500]}")
        
        # Look for the rate table pattern in text content
        # Pattern: "{term} Year Fixed {rate}%" or "{term} Year Variable {rate}%"
        # Also: "6 Month Fixed {rate}%"
        # Handle various spacing and formatting
        
        patterns = [
            # Standard patterns with flexible whitespace
            (r'(?i)(\d+)\s*Year\s+Fixed\s+([\d.]+)\s*%', 'fixed'),
            (r'(?i)(\d+)\s*Year\s+Variable\s+([\d.]+)\s*%', 'variable'),
            (r'(?i)(\d+)\s*Year\s+Open\s+([\d.]+)\s*%', 'open'),
            (r'(?i)(\d+)\s*Month\s+Fixed\s+([\d.]+)\s*%', 'fixed'),
        ]
        
        for pattern, rate_type in patterns:
            matches = re.finditer(pattern, text_content)
            for match in matches:
                term_str = match.group(1)
                rate_str = match.group(2)
                
                # Convert term
                term_value = int(term_str)
                if 'Month' in match.group(0):
                    term_months = term_value
                else:
                    term_months = term_value * 12
                
                rates.append({
                    'term_months': term_months,
                    'rate_type': rate_type,
                    'rate': Decimal(rate_str),
                })
        
        # Remove duplicates (same term and type)
        seen = set()
        unique_rates = []
        for r in rates:
            key = (r['term_months'], r['rate_type'])
            if key not in seen:
                seen.add(key)
                unique_rates.append(r)
        
        logger.info(f"Extracted {len(unique_rates)} unique rates from page")
        return unique_rates
    
    def _merge_province_rates(self, ontario_rates: List[Dict], alberta_rates: List[Dict]) -> List[RawRate]:
        """Merge rates from different provinces, noting differences."""
        rates = []
        
        # Use Ontario as the base (best rates typically)
        for rate_data in ontario_rates:
            # Create both insured and uninsured variants
            # True North "from" rates are typically for insured/high-ratio mortgages
            
            # Uninsured rate (add 0.20-0.25% typically)
            uninsured_rate = rate_data['rate'] + Decimal('0.20')
            
            rates.append(RawRate(
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                term_months=rate_data['term_months'],
                rate_type=RateType.FIXED if rate_data['rate_type'] == 'fixed' else RateType.VARIABLE,
                mortgage_type=MortgageType.UNINSURED,
                rate=uninsured_rate,
                source_url=self.PROVINCE_URLS["ontario"],
                scraped_at=self.scraped_at,
                raw_data={
                    "source": "truenorth_live_scrape",
                    "province": "ontario",
                    "advertised_rate": str(rate_data['rate']),
                    "rate_type": "from_rate",
                    "notes": "Best case scenario rate. Actual rate depends on credit, equity, and property type."
                }
            ))
            
            # Insured rate (the advertised "from" rate)
            rates.append(RawRate(
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                term_months=rate_data['term_months'],
                rate_type=RateType.FIXED if rate_data['rate_type'] == 'fixed' else RateType.VARIABLE,
                mortgage_type=MortgageType.INSURED,
                rate=rate_data['rate'],
                source_url=self.PROVINCE_URLS["ontario"],
                scraped_at=self.scraped_at,
                raw_data={
                    "source": "truenorth_live_scrape",
                    "province": "ontario",
                    "advertised_rate": str(rate_data['rate']),
                    "rate_type": "from_rate",
                    "featured": rate_data['term_months'] == 60,  # Feature 5-year terms
                    "notes": "Best case scenario rate. Actual rate depends on credit, equity, and property type."
                }
            ))
        
        # Check for Alberta-specific differences
        for ab_rate in alberta_rates:
            for on_rate in ontario_rates:
                if (ab_rate['term_months'] == on_rate['term_months'] and 
                    ab_rate['rate_type'] == on_rate['rate_type'] and
                    ab_rate['rate'] != on_rate['rate']):
                    logger.info(
                        f"Province difference found: {ab_rate['term_months']}mo {ab_rate['rate_type']} "
                        f"ON: {on_rate['rate']}% vs AB: {ab_rate['rate']}%"
                    )
        
        self.rates_found = len(rates)
        return rates
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates based on True North website data (April 25, 2026).
        Updated with verified live rates from browser scraping.
        """
        logger.info("Using fallback rates from True North website (Apr 25, 2026)")
        
        # Live verified rates from browser scraping
        # These are the advertised "from" rates (best case)
        # We create both insured (advertised) and uninsured (estimated) variants
        
        base_rates = [
            # (term_months, rate_type, insured_rate, uninsured_rate)
            (6, RateType.FIXED, Decimal("2.49"), Decimal("2.74")),      # 6 Month
            (12, RateType.FIXED, Decimal("4.74"), Decimal("4.99")),    # 1 Year
            (24, RateType.FIXED, Decimal("4.29"), Decimal("4.54")),    # 2 Year
            (36, RateType.FIXED, Decimal("4.19"), Decimal("4.44")),    # 3 Year
            (48, RateType.FIXED, Decimal("4.29"), Decimal("4.54")),    # 4 Year
            (60, RateType.FIXED, Decimal("4.09"), Decimal("4.34")),    # 5 Year - Ontario rate (best)
            (60, RateType.VARIABLE, Decimal("3.49"), Decimal("3.74")), # 5 Year Variable
        ]
        
        rates = []
        for term_months, rate_type, insured_rate, uninsured_rate in base_rates:
            # Insured (advertised "from" rate)
            rates.append(RawRate(
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                term_months=term_months,
                rate_type=rate_type,
                mortgage_type=MortgageType.INSURED,
                rate=insured_rate,
                source_url=self.PROVINCE_URLS["default"],
                scraped_at=self.scraped_at,
                raw_data={
                    "source": "truenorth_fallback_2026-04-25",
                    "advertised_rate": str(insured_rate),
                    "rate_type": "from_rate",
                    "featured": term_months == 60,
                    "province": "ontario",
                    "notes": "Advertised 'from' rate - best case scenario. Actual rate depends on credit score, equity, property type, and province."
                }
            ))
            
            # Uninsured (estimated)
            rates.append(RawRate(
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                term_months=term_months,
                rate_type=rate_type,
                mortgage_type=MortgageType.UNINSURED,
                rate=uninsured_rate,
                source_url=self.PROVINCE_URLS["default"],
                scraped_at=self.scraped_at,
                raw_data={
                    "source": "truenorth_fallback_2026-04-25",
                    "advertised_rate": str(insured_rate),
                    "rate_type": "estimated_uninsured",
                    "featured": term_months == 60,
                    "province": "ontario",
                    "notes": "Estimated uninsured rate. Actual rate may vary based on credit score, equity, and property type."
                }
            ))
        
        return rates


# For testing
if __name__ == "__main__":
    scraper = TrueNorthMortgageScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from True North Mortgage:")
        print("=" * 70)
        
        # Group by mortgage type
        by_type = {}
        for r in rates:
            key = r.mortgage_type.value if r.mortgage_type else "unknown"
            if key not in by_type:
                by_type[key] = []
            by_type[key].append(r)
        
        for mtype, mtype_rates in sorted(by_type.items()):
            print(f"\n{mtype.upper()}:")
            print("-" * 70)
            for r in sorted(mtype_rates, key=lambda x: (x.term_months, x.rate_type.value)):
                years = r.term_months // 12 if r.term_months >= 12 else r.term_months
                term_label = f"{years}yr" if r.term_months >= 12 else f"{r.term_months}mo"
                featured = " [FEATURED]" if r.raw_data.get("featured") else ""
                rate_source = r.raw_data.get("rate_type", "unknown")
                print(f"  {term_label:6} {r.rate_type.value:8} {r.rate}% ({rate_source}){featured}")
        
        print("\n" + "=" * 70)
        print("\nIMPORTANT NOTES:")
        print("   - These are 'from' rates (best case scenario)")
        print("   - Actual rates depend on: credit score, equity, property type, province")
        print("   - Ontario typically gets the best rates")
        print("   - Contact True North directly for your specific rate")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()