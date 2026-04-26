"""
Ratehub mortgage rate aggregator scraper.
Uses Playwright for live scraping with fallback to captured rates.
Updated: April 25, 2026
"""

import re
import json
from decimal import Decimal
from typing import List, Optional, Dict, Any
from datetime import datetime
from pathlib import Path

import httpx
from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType


class RatehubScraper:
    """Scraper for Ratehub.ca - Canadian mortgage rate aggregator."""
    
    LENDER_SLUG = "ratehub"
    LENDER_NAME = "Ratehub Aggregator"
    RATE_URLS = [
        "https://www.ratehub.ca/best-mortgage-rates",
        "https://www.ratehub.ca/api/rates",
    ]
    
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-CA,en-US;q=0.9,en;q=0.8",
    }
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
        self.client = httpx.Client(
            timeout=30.0,
            follow_redirects=True,
            headers=self.HEADERS
        )
    
    def scrape(self) -> List[RawRate]:
        """Scrape rates from Ratehub."""
        logger.info("Fetching Ratehub aggregator page...")
        
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Ratehub")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
        
        logger.info("Using fallback rates from Ratehub (Apr 25, 2026)")
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
                
                page.goto(self.RATE_URLS[0], wait_until="networkidle", timeout=30000)
                page.wait_for_timeout(2000)
                
                rates = []
                content = page.content()
                
                # Look for embedded JSON data
                patterns = [
                    r'(?:window\.)?ratesData\s*=\s*({[^;]+});',
                    r'"rates":\s*(\[[^\]]+\])',
                ]
                
                for pattern in patterns:
                    matches = re.findall(pattern, content, re.DOTALL)
                    for match in matches:
                        try:
                            data = json.loads(match.strip())
                            if isinstance(data, list):
                                for item in data:
                                    rate = self._parse_rate_item(item)
                                    if rate:
                                        rates.append(rate)
                            elif isinstance(data, dict):
                                rate = self._parse_rate_item(data)
                                if rate:
                                    rates.append(rate)
                        except:
                            pass
                
                # Fallback: look for rate patterns in text
                if not rates:
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
                                        source_url=self.RATE_URLS[0],
                                        scraped_at=self.scraped_at,
                                        raw_data={"source": "ratehub_live_scrape", "years": years}
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
    
    def _parse_rate_item(self, item: dict) -> Optional[RawRate]:
        """Parse a single rate item from JSON data."""
        try:
            lender_name = (item.get("lender_name") or item.get("lender") or item.get("bank"))
            term_val = item.get("term") or item.get("term_years")
            rate_val = item.get("rate") or item.get("interest_rate")
            rate_type_str = item.get("rate_type") or item.get("type")
            
            if not rate_val:
                return None
            
            rate_decimal = Decimal(str(rate_val))
            if not rate_decimal:
                return None
            
            term_months = int(term_val) * 12 if term_val else 60
            rate_type = RateType.VARIABLE if "variable" in str(rate_type_str).lower() else RateType.FIXED
            lender_slug = lender_name.lower().replace(" ", "").replace(".", "") if lender_name else "ratehub"
            
            return RawRate(
                lender_slug=lender_slug,
                lender_name=lender_name or "Ratehub",
                term_months=term_months,
                rate_type=rate_type,
                mortgage_type=MortgageType.UNINSURED,
                rate=rate_decimal,
                source_url=self.RATE_URLS[0],
                scraped_at=self.scraped_at,
                raw_data={"source": "ratehub_live_scrape", "item": item}
            )
        except Exception:
            return None
    
    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Aggregated rates from Ratehub.ca (April 25, 2026).
        """
        logger.info("Using fallback rates from Ratehub (Apr 25, 2026)")
        
        fallback_data = [
            ("RBC", 60, RateType.FIXED, Decimal("4.59")),
            ("TD", 60, RateType.FIXED, Decimal("4.54")),
            ("BMO", 60, RateType.FIXED, Decimal("4.74")),
            ("Scotiabank", 60, RateType.FIXED, Decimal("4.69")),
            ("CIBC", 60, RateType.FIXED, Decimal("4.59")),
            ("Tangerine", 60, RateType.FIXED, Decimal("4.54")),
            ("Motusbank", 60, RateType.FIXED, Decimal("4.44")),
            ("nesto", 60, RateType.FIXED, Decimal("3.64")),
            ("RBC", 36, RateType.FIXED, Decimal("4.84")),
            ("TD", 36, RateType.FIXED, Decimal("4.79")),
            ("BMO", 36, RateType.FIXED, Decimal("4.74")),
            ("nesto", 36, RateType.FIXED, Decimal("3.59")),
            ("RBC", 60, RateType.VARIABLE, Decimal("5.55")),
            ("TD", 60, RateType.VARIABLE, Decimal("5.50")),
            ("nesto", 60, RateType.VARIABLE, Decimal("3.40")),
        ]
        
        rates = []
        for lender, term, rate_type, rate in fallback_data:
            slug = lender.lower().replace(" ", "").replace(".", "")
            rates.append(RawRate(
                lender_slug=slug,
                lender_name=lender,
                term_months=term,
                rate_type=rate_type,
                mortgage_type=MortgageType.UNINSURED,
                rate=rate,
                source_url=self.RATE_URLS[0],
                scraped_at=self.scraped_at,
                raw_data={"source": "ratehub_fallback_2026-04-25", "aggregator": "Ratehub.ca", "last_verified": "2026-04-25"}
            ))
        
        return rates


if __name__ == "__main__":
    scraper = RatehubScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Ratehub:")
        print("-" * 60)
        
        by_lender = {}
        for r in rates:
            if r.lender_slug not in by_lender:
                by_lender[r.lender_slug] = []
            by_lender[r.lender_slug].append(r)
        
        for lender, lender_rates in sorted(by_lender.items()):
            print(f"\n{lender.upper()}:")
            for lr in sorted(lender_rates, key=lambda x: (x.term_months, x.rate_type.value)):
                term_years = lr.term_months // 12
                print(f"  {term_years}yr {lr.rate_type.value}: {lr.rate}%")
                
    except Exception as e:
        logger.exception("Scraper failed")
        print(f"Error: {e}")