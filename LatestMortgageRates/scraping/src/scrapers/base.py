"""
Base scraper class with OpenClaw integration.
Subclasses implement scraper-specific logic for each lender.
"""

import json
import time
from abc import ABC, abstractmethod
from pathlib import Path
from typing import List, Optional, Any
from datetime import datetime
from decimal import Decimal

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, ScrapingResult


class ScraperError(Exception):
    """Exception raised when scraping fails."""
    pass


class BaseScraper(ABC):
    """Base class for all mortgage rate scrapers."""
    
    # Override in subclasses
    LENDER_SLUG: str = ""
    LENDER_NAME: str = ""
    RATE_URL: str = ""
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
        self._targetId: Optional[str] = None
        
    def browser_open(self, url: str, profile: str = "openclaw", timeout_ms: int = 30000) -> None:
        """
        Open a URL in OpenClaw browser using the browser tool.
        Works with openclaw profile (standalone).
        """
        # Import here to avoid circular import
        from browser import browser
        
        try:
            result = browser(
                action="open",
                targetUrl=url,
                profile=profile,
                timeoutMs=timeout_ms
            )
            
            # Store target ID for subsequent operations
            if isinstance(result, dict) and "targetId" in result:
                self._targetId = result["targetId"]
                logger.info(f"Browser opened: {url} (targetId: {self._targetId[:8]}...)")
            else:
                raise ScraperError(f"Browser open failed: {result}")
                
        except Exception as e:
            raise ScraperError(f"Failed to open browser: {str(e)}")
    
    def browser_snapshot(self, refs: str = "aria", compact: bool = False, maxChars: int = 15000) -> dict:
        """
        Take an AI snapshot of the current page.
        Uses stored targetId from browser_open.
        """
        from browser import browser
        
        try:
            result = browser(
                action="snapshot",
                targetId=self._targetId,
                refs=refs,
                compact=compact,
                maxChars=maxChars
            )
            
            if isinstance(result, dict):
                return result
            else:
                raise ScraperError(f"Snapshot failed: {result}")
                
        except Exception as e:
            raise ScraperError(f"Failed to capture snapshot: {str(e)}")
    
    def browser_click(self, ref: str) -> str:
        """Click an element by reference (e.g., 'e12')."""
        from browser import browser
        
        try:
            result = browser(
                action="act",
                targetId=self._targetId,
                selector=f"ref={ref}",
                type="click"
            )
            return str(result)
        except Exception as e:
            raise ScraperError(f"Click failed: {str(e)}")
    
    def web_fetch(self, url: str, max_chars: int = 50000) -> str:
        """
        Fetch a URL using web_fetch tool (no browser).
        Use for static pages and APIs.
        """
        from web_fetch import web_fetch
        
        try:
            result = web_fetch(
                url=url,
                maxChars=max_chars,
                extractMode="text"
            )
            
            if isinstance(result, dict):
                return result.get("text", "")
            return str(result)
            
        except Exception as e:
            logger.error(f"Web fetch failed: {e}")
            # Return empty string on failure - caller handles
            return ""
    
    def parse_rate(self, rate_str: str) -> Optional[Decimal]:
        """
        Parse a rate string to Decimal.
        Handles formats like "4.59%", "4.59", "$4.59", etc.
        """
        if not rate_str:
            return None
        
        import re
        cleaned = str(rate_str).replace("%", "").replace("$", "").replace(",", "").strip()
        
        # Extract just the number part
        match = re.search(r'(\d+\.?\d*)', cleaned)
        if match:
            try:
                return Decimal(match.group(1))
            except:
                pass
        
        return None
    
    def parse_term(self, term_str: str) -> Optional[int]:
        """
        Parse term string to months.
        """
        if not term_str:
            return None
        
        import re
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
    
    @abstractmethod
    def scrape(self) -> List[RawRate]:
        """
        Scrape rates from the lender.
        Must be implemented by subclasses.
        
        Returns:
            List of RawRate objects
        """
        pass
    
    def run(self) -> ScrapingResult:
        """
        Execute scraping with timing and error handling.
        
        Returns:
            ScrapingResult with success/failure info
        """
        import time
        start_time = time.time()
        self.scraped_at = datetime.utcnow()
        
        try:
            rates = self.scrape()
            duration = time.time() - start_time
            
            return ScrapingResult(
                lender_slug=self.LENDER_SLUG,
                success=True,
                rates_found=len(rates),
                scraped_at=self.scraped_at,
                duration_seconds=duration
            )
            
        except ScraperError as e:
            duration = time.time() - start_time
            return ScrapingResult(
                lender_slug=self.LENDER_SLUG,
                success=False,
                rates_found=0,
                error_message=str(e),
                scraped_at=self.scraped_at,
                duration_seconds=duration
            )
        except Exception as e:
            duration = time.time() - start_time
            logger.exception(f"Unexpected error scraping {self.LENDER_SLUG}")
            return ScrapingResult(
                lender_slug=self.LENDER_SLUG,
                success=False,
                rates_found=0,
                error_message=f"Unexpected error: {str(e)}",
                scraped_at=self.scraped_at,
                duration_seconds=duration
            )
