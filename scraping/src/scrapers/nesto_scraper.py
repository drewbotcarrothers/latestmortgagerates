"""
nesto mortgage rate scraper.
Uses Playwright for live scraping with fallback to captured rates.
Updated: April 25, 2026
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


class NestoScraper:
    """Scraper for nesto mortgage rates."""
    
    LENDER_SLUG = "nesto"
    LENDER_NAME = "nesto"
    RATE_URL = "https://www.nesto.ca/mortgage-rates/"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape nesto mortgage rates."""
        logger.info("Fetching nesto rate page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from nesto")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        logger.info("Using fallback rates from nesto (Apr 25, 2026)")
        rates = self._get_fallback_rates()
        return rates
    
    def _scrape_with_playwright(self) -> List[RawRate]:
        """Use Playwright to scrape live rates."""
        try:
            from playwright.sync_api import sync_playwright
            
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                )
                page = context.new_page()
                
                page.goto(self.RATE_URL, wait_until="networkidle", timeout=30000)
                page.wait_for_timeout(2000)
                
                rates = []
                content = page.content()
                
                patterns = [
                    (r'(\d+)\s*year[^\d]*?fixed[^\d]*?(\d+\.\d+)', RateType.FIXED),
                    (r'(\d+)\s*year[^\d]*?variable[^\d]*?(\d+\.\d+)', RateType.VARIABLE),
                ]
                
                for pattern, rate_type in patterns:
                    matches = re.finditer(pattern, content, re.IGNORECASE)
                    for match in matches:
                        try:
                            years = int(match.group(1))
                            rate = Decimal(match.group(2))
                            if 1 <= years <= 10 and 2 <= rate <= 10:
                                rates.append(RawRate(
                                    lender_slug=self.LENDER_SLUG,
                                    lender_name=self.LENDER_NAME,
                                    term_months=years * 12,
                                    rate_type=rate_type,
                                    mortgage_type=MortgageType.UNINSURED,
                                    rate=rate,
                                    source_url=self.RATE_URL,
                                    scraped_at=self.scraped_at,
                                    raw_data={"source": "nesto_live_scrape", "years": years}
                                ))
                        except:
                            pass
                
                browser.close()
                return rates
                
        except ImportError:
            logger.warning("Playwright not available")
            return []
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return []
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates from nesto (April 25, 2026).
        nesto is a digital mortgage lender with very competitive rates.
        Prime rate: 5.45% (April 2026)
        """
        logger.info("Using fallback rates from nesto (Apr 25, 2026)")
        
        fallback_data = [
            # Insured rates (best LTV tiers)
            {"term": 24, "type": RateType.FIXED, "rate": "6.16", "mortgage_type": "insured", "ltv_tier": "0-65%", "product": "2 Year Fixed (Insured)"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.10", "mortgage_type": "insured", "ltv_tier": "0-65%", "product": "3 Year Fixed (Insured)", "featured": True},
            {"term": 36, "type": RateType.VARIABLE, "rate": "3.85", "mortgage_type": "insured", "ltv_tier": "0-65%", "product": "3 Year Variable (Insured)"},
            {"term": 48, "type": RateType.FIXED, "rate": "4.72", "mortgage_type": "insured", "ltv_tier": "0-65%", "product": "4 Year Fixed (Insured)"},
            {"term": 60, "type": RateType.FIXED, "rate": "3.89", "mortgage_type": "insured", "ltv_tier": "0-65%", "product": "5 Year Fixed (Insured)", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.65", "mortgage_type": "insured", "ltv_tier": "0-65%", "product": "5 Year Variable (Insured)", "featured": True, "spread": "Prime - 1.05%"},
            {"term": 84, "type": RateType.FIXED, "rate": "6.09", "mortgage_type": "insured", "ltv_tier": "0-65%", "product": "7 Year Fixed (Insured)"},
            {"term": 120, "type": RateType.FIXED, "rate": "7.64", "mortgage_type": "insured", "ltv_tier": "0-65%", "product": "10 Year Fixed (Insured)"},
            
            # Uninsured rates
            {"term": 36, "type": RateType.FIXED, "rate": "4.54", "mortgage_type": "uninsured", "ltv_tier": "65-80%", "product": "3 Year Fixed (Uninsured)"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.44", "mortgage_type": "uninsured", "ltv_tier": "65-80%", "product": "5 Year Fixed (Uninsured)"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.10", "mortgage_type": "uninsured", "ltv_tier": "65-80%", "product": "5 Year Variable (Uninsured)"},
        ]
        
        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.INSURED if item.get("mortgage_type") == "insured" else MortgageType.UNINSURED
            
            raw_data = {
                "source": "nesto_fallback_2026-04-25",
                "ltv_tier": item.get("ltv_tier"),
                "product": item.get("product"),
                "featured": item.get("featured", False),
                "prime_rate": "5.45",
                "last_verified": "2026-04-25"
            }
            if item.get("spread"):
                raw_data["spread_to_prime"] = item["spread"]
            
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
    scraper = NestoScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from nesto:")
        print("-" * 60)
        
        # Group by mortgage type
        by_type = {}
        for r in rates:
            key = r.mortgage_type.value if r.mortgage_type else "unknown"
            if key not in by_type:
                by_type[key] = []
            by_type[key].append(r)
        
        for mtype, mtype_rates in by_type.items():
            print(f"\n{mtype.upper()}:")
            for r in sorted(mtype_rates, key=lambda x: (x.term_months, x.rate_type.value)):
                years = r.term_months // 12
                ltv = r.raw_data.get("ltv_tier", "")
                ltv_str = f" (LTV: {ltv})" if ltv else ""
                featured = " [FEATURED]" if r.raw_data.get("featured") else ""
                spread = r.raw_data.get("spread_to_prime", "")
                spread_str = f" [{spread}]" if spread else ""
                print(f"  {years}yr {r.rate_type.value}: {r.rate}%{ltv_str}{spread_str}{featured}")
        
        print("\n" + "-" * 60)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()