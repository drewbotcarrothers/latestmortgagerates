"""
Simplii Financial mortgage rate scraper.

Simplii's public rates page shows CIBC special offers as RDS placeholders
(`RDS%rate[5].<code>.Published(...)%`). Those tokens are filled from CIBC's
first-party productRatesLegacy feed — the same API the page's rds-shared
script calls. Category 18 is the special rate column; category 2 is APR.
"""

import re
from decimal import Decimal, InvalidOperation
from typing import Dict, List, Optional
from datetime import datetime, timezone
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType

try:
    from .http_fetch import fetch_html, fetch_json
    from .rate_parse import fallback_rows_to_rates
except ImportError:
    from http_fetch import fetch_html, fetch_json
    from rate_parse import fallback_rows_to_rates


RATES_API = (
    "https://www.cibconline.cibc.com/ebm-pno/api/v1/json/productRatesLegacy"
    "?lobId=5&sourceProductCode={code}%2C"
)
# Page token: rate[5].FRCM.Published(2_null_null_Years_T,null,18,null)
PAGE_TOKEN_RE = re.compile(
    r"rate\[5\]\.([A-Z0-9]+)\.Published\(([0-9]+_null_null_(?:Year|Years|Months)_T),null,18,null\)",
    re.IGNORECASE,
)
ROW_RE = re.compile(
    r"\['([^']+)',\s*[^,]+,\s*(\d+),\s*'([^']+)',\s*'Published',\s*'([^']*)'",
)
TERM_RE = re.compile(r"^(\d+)_null_null_(Year|Years|Months)_T$", re.IGNORECASE)
TR_RE = re.compile(r"(?is)<tr\b[^>]*>(.*?)</tr>")
LABEL_RE = re.compile(r"(?is)>\s*(\d+\s*[-–]?\s*(?:year|month)s?\s+[a-z][^<]{0,40})")


def _term_months(term_key: str) -> Optional[int]:
    match = TERM_RE.match(term_key or "")
    if not match:
        return None
    amount = int(match.group(1))
    unit = match.group(2).lower()
    if unit.startswith("month"):
        return amount if amount in (6, 12, 18, 24) else None
    if 1 <= amount <= 10:
        return amount * 12
    return None


def _parse_rate(value: str) -> Optional[Decimal]:
    try:
        rate = Decimal(value)
    except (InvalidOperation, ValueError):
        return None
    if rate <= Decimal("1.50") or rate > Decimal("12.00"):
        return None
    return rate


def specials_on_page(html: str) -> List[dict]:
    """Special-offer rows (RDS category 18) actually rendered on the Simplii page."""
    if not html:
        return []
    found: List[dict] = []
    seen = set()
    for row_match in TR_RE.finditer(html):
        row = row_match.group(1)
        token = PAGE_TOKEN_RE.search(row)
        label_match = LABEL_RE.search(row)
        if not token or not label_match:
            continue
        label = " ".join(label_match.group(1).split())
        code, term_key = token.group(1), token.group(2)
        key = (code, term_key, label.lower())
        if key in seen:
            continue
        seen.add(key)
        found.append({"code": code, "term_key": term_key, "label": label})
    return found


def _index_api(payload) -> Dict[tuple, tuple]:
    text = payload if isinstance(payload, str) else ("" if payload is None else str(payload))
    indexed: Dict[tuple, tuple] = {}
    for match in ROW_RE.finditer(text):
        term_key, category_s, rate_s, published = match.groups()
        if int(category_s) != 18:
            continue
        rate = _parse_rate(rate_s)
        term_months = _term_months(term_key)
        if rate is None or not term_months:
            continue
        indexed[(term_key, term_months)] = (rate, published)
    return indexed


def rates_from_page_and_api(
    html: str,
    api_by_code: Dict[str, object],
    *,
    lender_slug: str,
    lender_name: str,
    source_url: str,
    scraped_at,
) -> List[RawRate]:
    rates: List[RawRate] = []
    seen = set()
    for row in specials_on_page(html):
        indexed = _index_api(api_by_code.get(row["code"]))
        term_months = _term_months(row["term_key"])
        if not term_months:
            continue
        chosen = indexed.get((row["term_key"], term_months))
        if not chosen:
            continue
        rate, published = chosen
        label = row["label"]
        rate_type = RateType.VARIABLE if "variable" in label.lower() else RateType.FIXED
        mortgage_type = (
            MortgageType.INSURED
            if "high-ratio" in label.lower() or "high ratio" in label.lower() or "insured" in label.lower()
            else MortgageType.UNINSURED
        )
        dedupe = (term_months, rate_type, mortgage_type, str(rate))
        if dedupe in seen:
            continue
        seen.add(dedupe)
        rates.append(
            RawRate(
                lender_slug=lender_slug,
                lender_name=lender_name,
                term_months=term_months,
                rate_type=rate_type,
                mortgage_type=mortgage_type,
                rate=rate,
                source_url=source_url,
                scraped_at=scraped_at,
                raw_data={
                    "source": "simplii_live_scrape",
                    "extraction_method": "rds_product_rates_api",
                    "product": f"{label} (CIBC special via Simplii)",
                    "product_code": row["code"],
                    "term_key": row["term_key"],
                    "section": "special",
                    "published_at": published,
                    "featured": term_months in (24, 36, 60),
                },
            )
        )
    return rates


class SimpliiScraper:
    LENDER_SLUG = "simplii"
    LENDER_NAME = "Simplii Financial"
    RATE_URL = "https://www.simplii.com/en/rates/mortgage-rates.html"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching Simplii rate page and CIBC RDS feed...")
        html = fetch_html(self.RATE_URL, timeout=20.0)
        rows = specials_on_page(html or "")
        if not html or not rows:
            logger.warning("Simplii page fetch failed or contained no special-rate rows")
            return self._get_fallback_rates()

        api_by_code: Dict[str, object] = {}
        for code in sorted({row["code"] for row in rows}):
            api_by_code[code] = fetch_json(
                RATES_API.format(code=code),
                timeout=15.0,
                headers={
                    "Accept": "text/javascript,application/json,*/*;q=0.8",
                    "Referer": self.RATE_URL,
                    "Origin": "https://www.simplii.com",
                },
            )

        rates = rates_from_page_and_api(
            html,
            api_by_code,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
        )
        if rates:
            logger.success(f"Successfully scraped {len(rates)} live rates from Simplii")
            return rates
        logger.warning("Simplii RDS feed did not match the specials on the page")
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        # Used only when the page or the RDS feed cannot be read.
        fallback_data = [
            {"term": 24, "type": RateType.FIXED, "rate": "4.49", "mortgage_type": "uninsured", "product": "2-Year Fixed (CIBC special via Simplii)", "featured": True},
            {"term": 36, "type": RateType.FIXED, "rate": "4.74", "mortgage_type": "uninsured", "product": "3-Year Fixed (CIBC special via Simplii)", "featured": True},
            {"term": 48, "type": RateType.FIXED, "rate": "4.89", "mortgage_type": "uninsured", "product": "4-Year Fixed (CIBC special via Simplii)"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.94", "mortgage_type": "uninsured", "product": "5-Year Fixed (CIBC special via Simplii)", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.59", "mortgage_type": "insured", "product": "5-Year Fixed High-Ratio (CIBC special)"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.10", "mortgage_type": "uninsured", "product": "5-Year Variable (CIBC special via Simplii)", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.95", "mortgage_type": "insured", "product": "5-Year Variable High-Ratio (CIBC special)"},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="simplii_fallback_2026-09-14",
            last_verified="2026-09-14",
        )


if __name__ == "__main__":
    scraper = SimpliiScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} Simplii rates")
    for r in rates:
        print(f"  {r.mortgage_type.value:10} {r.term_months//12}yr {r.rate_type.value:8} {r.rate}% {(r.raw_data or {}).get('source')} {(r.raw_data or {}).get('published_at')}")
