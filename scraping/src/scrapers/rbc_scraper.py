"""
RBC Royal Bank mortgage rate scraper.
Uses Playwright for live scraping with fallback to captured rates.
Updated: July 19, 2026
"""

import html as html_lib
import re
from decimal import Decimal
from typing import Any, Dict, List, Optional
from datetime import datetime
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType

try:
    from .http_fetch import fetch_html
    from .rate_parse import extract_rates_from_html
    from .proxy_config import log_proxy_status, playwright_proxy
except ImportError:
    from http_fetch import fetch_html
    from rate_parse import extract_rates_from_html
    from proxy_config import log_proxy_status, playwright_proxy


# Closed terms the rate file keeps. Open mortgages and 25-year shelves are skipped.
RBC_STANDARD_TERMS = {6, 12, 24, 36, 48, 60, 72, 84, 120}


def _strip_tags(fragment: str) -> str:
    text = re.sub(r"<br\s*/?>", " ", fragment, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html_lib.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def _rbc_term_months(label: str) -> Optional[int]:
    if re.search(r"\bopen\b", label, re.IGNORECASE):
        return None
    month = re.search(r"(\d+)\s*month", label, re.IGNORECASE)
    if month:
        months = int(month.group(1))
        return months if months in RBC_STANDARD_TERMS else None
    year = re.search(r"(\d+)\s*year", label, re.IGNORECASE)
    if year:
        months = int(year.group(1)) * 12
        return months if months in RBC_STANDARD_TERMS else None
    return None


def _first_percent(text: str) -> Optional[Decimal]:
    match = re.search(r"(\d+\.\d+)\s*%", text)
    if not match:
        return None
    rate = Decimal(match.group(1))
    if rate < Decimal("1.50") or rate > Decimal("12.00"):
        return None
    return rate


def _rbc_cell_rate(rate_text: str, apr_text: str) -> Optional[Decimal]:
    """Prefer the parenthetical contract rate. Prime rows use the APR column."""
    paren = re.search(r"\((\d+\.\d+)\s*%\)", rate_text)
    if paren:
        rate = Decimal(paren.group(1))
        if Decimal("1.50") <= rate <= Decimal("12.00"):
            return rate
    if re.search(r"prime", rate_text, re.IGNORECASE):
        return _first_percent(apr_text)
    return _first_percent(rate_text)


def _classify_rbc_heading(heading: str) -> Optional[Dict[str, Any]]:
    text = heading.lower()
    if "high ratio" in text:
        return {"section": "special", "mortgage_type": MortgageType.INSURED}
    if "posted" in text and "variable" in text:
        return {"section": "posted", "mortgage_type": MortgageType.UNINSURED}
    if "posted" in text and "fixed" in text:
        return {"section": "posted", "mortgage_type": MortgageType.UNINSURED}
    if "special" in text and ("variable" in text or "fixed" in text):
        return {"section": "special", "mortgage_type": MortgageType.UNINSURED}
    if "fixed and variable" in text:
        return {"section": "special", "mortgage_type": MortgageType.UNINSURED}
    return None


def parse_rbc_rate_tables(html: str) -> List[Dict[str, Any]]:
    """First table after each rate heading. That table is the ≤25-year shelf."""
    rows: List[Dict[str, Any]] = []
    parts = re.split(r"<h3\b[^>]*>", html, flags=re.IGNORECASE)
    for part in parts[1:]:
        heading_html, _, rest = part.partition("</h3>")
        kind = _classify_rbc_heading(_strip_tags(heading_html))
        if not kind:
            continue
        table = re.search(r"<table\b[^>]*>(.*?)</table>", rest, flags=re.IGNORECASE | re.DOTALL)
        if not table:
            continue
        for tr in re.findall(r"<tr\b[^>]*>(.*?)</tr>", table.group(1), flags=re.IGNORECASE | re.DOTALL):
            cells = re.findall(r"<t[dh]\b[^>]*>(.*?)</t[dh]>", tr, flags=re.IGNORECASE | re.DOTALL)
            if len(cells) < 2:
                continue
            label = _strip_tags(cells[0])
            if not label or label.lower() in {"term", "rate", "product"}:
                continue
            term_months = _rbc_term_months(label)
            if not term_months:
                continue
            rate_text = _strip_tags(cells[1])
            apr_text = _strip_tags(cells[2]) if len(cells) > 2 else ""
            rate = _rbc_cell_rate(rate_text, apr_text)
            if rate is None:
                continue
            is_variable = (
                "variable" in label.lower() or "prime" in rate_text.lower()
            )
            rows.append(
                {
                    "term_months": term_months,
                    "rate": rate,
                    "rate_type": RateType.VARIABLE if is_variable else RateType.FIXED,
                    "mortgage_type": kind["mortgage_type"],
                    "section": kind["section"],
                    "label": label,
                    "apr": str(_first_percent(apr_text)) if _first_percent(apr_text) else None,
                }
            )
    return rows


def build_rbc_rates(
    html: str,
    scraped_at: datetime,
    source_url: str,
    extraction_method: str,
) -> List[RawRate]:
    """
    One row per product. rate is the special when RBC publishes one, otherwise
    the posted shelf. posted_rate is the ≤25-year posted shelf for that term.
    Insured specials use the same conventional posted shelf as uninsured.
    """
    parsed = parse_rbc_rate_tables(html)
    posted: Dict[tuple, Dict[str, Any]] = {}
    specials: List[Dict[str, Any]] = []
    for row in parsed:
        if row["section"] == "posted":
            posted[(row["term_months"], row["rate_type"])] = row
        else:
            specials.append(row)

    rates: List[RawRate] = []
    seen = set()
    covered = set()
    for row in specials:
        key = (row["term_months"], row["rate_type"], row["mortgage_type"])
        if key in seen:
            continue
        seen.add(key)
        shelf = posted.get((row["term_months"], row["rate_type"]))
        posted_rate = shelf["rate"] if shelf else None
        section = "special" if posted_rate and row["rate"] < posted_rate else "special"
        if posted_rate and row["rate"] >= posted_rate:
            section = "posted"
        rates.append(
            _rbc_raw(
                row,
                posted_rate,
                section,
                scraped_at,
                source_url,
                extraction_method,
            )
        )
        covered.add((row["term_months"], row["rate_type"]))

    for key, shelf in posted.items():
        if key in covered:
            continue
        rates.append(
            _rbc_raw(
                shelf,
                shelf["rate"],
                "posted",
                scraped_at,
                source_url,
                extraction_method,
            )
        )

    fixed_posted = {
        r.term_months
        for r in rates
        if r.rate_type == RateType.FIXED and r.posted_rate and r.term_months in (36, 60)
    }
    if fixed_posted != {36, 60}:
        logger.warning(
            "RBC HTML is missing a 3-year or 5-year fixed posted shelf "
            f"(found {sorted(fixed_posted)}). Posted rates will not be blanked over."
        )
    else:
        logger.info(
            f"RBC static HTML parsed {len(rates)} rates with 3-year and 5-year posted shelves"
        )
    return rates


def _rbc_raw(row, posted_rate, section, scraped_at, source_url, extraction_method) -> RawRate:
    return RawRate(
        lender_slug="rbc",
        lender_name="Royal Bank of Canada",
        term_months=row["term_months"],
        rate_type=row["rate_type"],
        mortgage_type=row["mortgage_type"],
        rate=row["rate"],
        posted_rate=posted_rate,
        source_url=source_url,
        scraped_at=scraped_at,
        raw_data={
            "source": "rbc_live_scrape",
            "extraction_method": extraction_method,
            "section": section,
            "product": row["label"],
            "term_text": row["label"],
            "apr": row.get("apr"),
            "is_open": False,
            "featured": section == "special" and row["term_months"] in (36, 60),
        },
    )


def rbc_has_core_posted(rates: List[RawRate]) -> bool:
    found = {
        rate.term_months
        for rate in rates
        if rate.rate_type == RateType.FIXED and rate.posted_rate and rate.term_months in (36, 60)
    }
    return found == {36, 60}


class RBCScraper:
    """Scraper for RBC Royal Bank mortgage rates."""
    
    LENDER_SLUG = "rbc"
    LENDER_NAME = "Royal Bank of Canada"
    RATE_URL = "https://www.rbcroyalbank.com/mortgages/mortgage-rates.html"
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
    
    def scrape(self) -> List[RawRate]:
        """Scrape RBC mortgage rates from the public HTML tables.

        The posted and special tables are in the HTML, including the collapsed
        panels. Static HTML is the primary source. Playwright is only a
        fallback when that HTML is missing the 3-year and 5-year posted shelves.
        A total failure returns no rows so a previous good file is kept.
        """
        logger.info("Fetching RBC rate page...")
        log_proxy_status("RBC")

        try:
            html = fetch_html(self.RATE_URL, timeout=25.0)
            if html:
                rates = build_rbc_rates(html, self.scraped_at, self.RATE_URL, "static_html")
                if rbc_has_core_posted(rates):
                    logger.success(f"RBC static HTML returned {len(rates)} live rates")
                    return rates
                logger.warning("RBC static HTML did not include the 3-year and 5-year posted shelves")
        except Exception as e:
            logger.warning(f"RBC HTTP scrape failed: {e}")

        try:
            html = self._playwright_page_html()
            if html:
                rates = build_rbc_rates(html, self.scraped_at, self.RATE_URL, "playwright_html")
                if rbc_has_core_posted(rates):
                    logger.success(f"RBC Playwright HTML returned {len(rates)} live rates")
                    return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")

        logger.warning(
            "RBC live scrape failed or did not include posted shelves. "
            "Returning no rates so existing RBC rows are kept."
        )
        return []

    def _rates_from_html(self, html: str, extraction_method: str) -> List[RawRate]:
        rates = extract_rates_from_html(
            html,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="rbc_live_scrape",
            extraction_method=extraction_method,
        )
        return [r for r in rates if Decimal("1.50") <= r.rate <= Decimal("12.00")]
    
    def _playwright_page_html(self) -> str:
        """Return the rendered page HTML. Tables stay in the DOM when collapsed."""
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            logger.warning("Playwright not available")
            return ""
        browser = None
        try:
            with sync_playwright() as p:
                launch_kwargs = {"headless": True, "timeout": 8000}
                proxy = playwright_proxy()
                if proxy:
                    launch_kwargs["proxy"] = proxy
                browser = p.chromium.launch(**launch_kwargs)
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                )
                page = context.new_page()
                page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=8000)
                page.wait_for_timeout(1000)
                return page.content()
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return ""
        finally:
            if browser:
                try:
                    browser.close()
                except Exception:
                    pass

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
                # Aggressive timeouts — RBC has blocked headless in the past; fail fast
                launch_kwargs = {"headless": True, "timeout": 8000}
                proxy = playwright_proxy()
                if proxy:
                    launch_kwargs["proxy"] = proxy
                browser = p.chromium.launch(**launch_kwargs)
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