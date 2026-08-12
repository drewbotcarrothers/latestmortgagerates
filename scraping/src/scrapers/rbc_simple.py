"""
Simple RBC scraper using httpx/fetch - bypasses browser automation for MVP.
In production, this would use OpenClaw browser for JavaScript-rendered pages.
"""

import re
import json
from decimal import Decimal
from typing import List, Optional
from datetime import datetime
from pathlib import Path

import httpx
from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType


class RBCSimpleScraper:
    """Simple RBC scraper using HTTP requests."""
    
    LENDER_SLUG = "rbc"
    LENDER_NAME = "Royal Bank of Canada"
    RATE_URL = "https://www.rbcroyalbank.com/mortgages/mortgage-rates.html"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
        self.client = httpx.Client(timeout=30.0, follow_redirects=True)
    
    def scrape(self) -> List[RawRate]:
        """Scrape RBC rates via HTTP."""
        rates = []
        
        try:
            logger.info(f"Fetching {self.RATE_URL}")
            response = self.client.get(self.RATE_URL)
            response.raise_for_status()
            html = response.text
            
            # Try to find embedded JavaScript data
            rates = self._extract_from_js(html)
            
            if not rates:
                # Fallback: Try to find rates in HTML
                rates = self._extract_from_html(html)
            
            if rates:
                logger.success(f"Found {len(rates)} rates")
            else:
                logger.warning("No rates found in response")
                
        except Exception as e:
            logger.error(f"Failed to scrape: {e}")
            raise
        
        return rates
    
    def _extract_from_js(self, html: str) -> List[RawRate]:
        """Extract rates from embedded JavaScript objects."""
        rates = []
        
        # Pattern 1: mortagesTextOfferData
        pattern1 = r'mortgagesTextOfferData\s*=\s*({[^;]+});'
        match1 = re.search(pattern1, html, re.DOTALL)
        if match1:
            try:
                data = json.loads(match1.group(1))
                rates.extend(self._parse_offer_data(data))
            except json.JSONDecodeError as e:
                logger.warning(f"Failed to parse offer data: {e}")
        
        # Pattern 2: ga4EcomInfo
        pattern2 = r'ga4EcomInfo\s*=\s*({[^;]+});'
        match2 = re.search(pattern2, html, re.DOTALL)
        if match2:
            try:
                data = json.loads(match2.group(1))
                logger.info(f"GA4 data keys: {data.keys()}")
            except:
                pass
        
        # Pattern 3: Look for rate data in JSON-LD
        ld_json = re.findall(r'application/json"\u003e({[^}]+})', html)
        for ld in ld_json:
            try:
                data = json.loads(ld)
                if 'interestRate' in str(data).lower():
                    logger.info(f"Found rate in JSON-LD: {data}")
            except:
                pass
        
        return rates
    
    def _parse_offer_data(self, data: dict) -> List[RawRate]:
        """Parse RBC mortgage offer data structure."""
        rates = []
        
        # Log the structure for debugging
        logger.info(f"Offer data type: {type(data)}")
        if isinstance(data, dict):
            logger.info(f"Top-level keys: {list(data.keys())}")
        
        # RBC data structure varies - try common patterns
        if isinstance(data, dict):
            # Pattern: nested by product type
            for product_type, products in data.items():
                logger.info(f"Processing product type: {product_type}")
                
                if isinstance(products, list):
                    for product in products:
                        rate = self._parse_product(product, product_type)
                        if rate:
                            rates.append(rate)
                elif isinstance(products, dict):
                    rate = self._parse_product(products, product_type)
                    if rate:
                        rates.append(rate)
        
        return rates
    
    def _parse_product(self, product: dict, product_type: str = "") -> Optional[RawRate]:
        """Parse a single product entry."""
        try:
            # Try multiple field name variations
            term = (product.get('term') or 
                   product.get('Term') or 
                   product.get('termText') or 
                   product.get('mortgageTerm'))
            
            rate = (product.get('rate') or 
                   product.get('Rate') or 
                   product.get('specialOfferRate') or 
                   product.get('currentRate'))
            
            posted = (product.get('postedRate') or 
                     product.get('PostedRate') or 
                     product.get('posted'))
            
            if not term or not rate:
                return None
            
            # Parse term
            term_months = self._parse_term(term)
            if not term_months:
                return None
            
            # Parse rate
            rate_val = self._parse_rate(str(rate))
            if not rate_val:
                return None
            
            # Determine rate type
            type_str = product_type.lower() + str(product.get('rateType', '')).lower()
            rate_type = RateType.FIXED if 'fixed' in type_str else RateType.VARIABLE
            
            posted_val = self._parse_rate(str(posted)) if posted else None
            
            return RawRate(
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                term_months=term_months,
                rate_type=rate_type,
                mortgage_type=MortgageType.UNINSURED,
                rate=rate_val,
                posted_rate=posted_val,
                source_url=self.RATE_URL,
                scraped_at=self.scraped_at,
                raw_data=product
            )
            
        except Exception as e:
            logger.warning(f"Failed to parse product: {e}")
            return None
    
    def _parse_term(self, term_str: str) -> Optional[int]:
        """Parse term string to months."""
        if not term_str:
            return None
        
        term_lower = str(term_str).lower()
        
        # Direct mappings for common terms
        mappings = {
            '1 year': 12, '1 yr': 12, '1yr': 12,
            '2 year': 24, '2 yr': 24, 
            '3 year': 36, '3 yr': 36,
            '4 year': 48, '4 yr': 48,
            '5 year': 60, '5 yr': 60,
            '6 year': 72, '6 yr': 72,
            '7 year': 84, '7 yr': 84,
            '10 year': 120, '10 yr': 120,
        }
        
        for key, val in mappings.items():
            if key in term_lower:
                return val
        
        # Extract number from pattern
        import re
        match = re.search(r'(\d+)\s*(?:year|yr)', term_lower)
        if match:
            return int(match.group(1)) * 12
        
        # Just a number?
        match = re.search(r'^(\d+)$', term_lower)
        if match:
            num = int(match.group(1))
            if num <= 30:  # Assume years
                return num * 12
            else:  # Assume months
                return num
        
        return None
    
    def _parse_rate(self, rate_str: str) -> Optional[Decimal]:
        """Parse rate string to Decimal."""
        if not rate_str:
            return None
        
        cleaned = str(rate_str).replace('%', '').replace('$', '').replace(',', '').strip()
        
        try:
            return Decimal(cleaned)
        except:
            return None
    
    def _extract_from_html(self, html: str) -> List[RawRate]:
        """Extract rates from HTML as fallback."""
        rates = []
        
        # Look for rate patterns in HTML
        # Common patterns: "4.59%", "5-year fixed at 4.59%", etc.
        patterns = [
            r'(\d)\s*[Yy]ear[s]?\s+(Fixed|Variable)[^\d]*?(\d+\.\d+)%',
            r'(?:rate|apr)[:\s]+(\d+\.\d+)%',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, html, re.IGNORECASE)
            for match in matches:
                logger.info(f"Found pattern match: {match}")
        
        return rates


if __name__ == "__main__":
    scraper = RBCSimpleScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates:")
        for r in rates:
            print(f"  {r.term_months}mo {r.rate_type.value}: {r.rate}%")
    except Exception as e:
        print(f"Error: {e}")
