"""
CMLS Financial mortgage rate scraper.

The public rates page embeds the current grid as `var MortgageRates = {...}`
and labels each term code in the fixed/adjustable <select> options. The
visible headings are filled by mortgage-rates.js from that object, so the
HTTP HTML is the source of truth (no browser required).

Products whose option text says UNINSURED are conventional. The other fixed
and adjustable options are the non-uninsured shelf (the page notes that
uninsured loans may be priced higher). CMLS Prime is a reference rate, not
a mortgage term, and is skipped.
"""

import json
import re
from decimal import Decimal, InvalidOperation
from typing import List, Optional
from datetime import datetime, timezone
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType

try:
    from .http_fetch import fetch_html
    from .rate_parse import fallback_rows_to_rates
except ImportError:
    from http_fetch import fetch_html
    from rate_parse import fallback_rows_to_rates


RATES_RE = re.compile(r"var\s+MortgageRates\s*=\s*(\{.*?\});", re.DOTALL)
OPTION_RE = re.compile(
    r'(?is)<option[^>]*value="([^"]+)"[^>]*>\s*([^<]+?)\s*</option>'
)
UPDATED_RE = re.compile(r"Mortgage-LastUpdate[^)]*\)\.html\('([^']+)'\)")
YEAR_RE = re.compile(r"(\d+)\s*YEAR", re.IGNORECASE)


def _parse_rate(value) -> Optional[Decimal]:
    try:
        rate = Decimal(str(value).strip())
    except (InvalidOperation, ValueError):
        return None
    if not (Decimal("1.50") <= rate <= Decimal("12.00")):
        return None
    return rate


def parse_cmls_html(
    html: str,
    *,
    lender_slug: str,
    lender_name: str,
    source_url: str,
    scraped_at,
) -> List[RawRate]:
    if not html:
        return []
    payload_match = RATES_RE.search(html)
    if not payload_match:
        return []
    try:
        payload = json.loads(payload_match.group(1))
    except json.JSONDecodeError:
        return []

    labels = {}
    for value, label in OPTION_RE.findall(html):
        labels[str(value).strip()] = " ".join(label.split())
    if not labels:
        return []

    updated = None
    updated_match = UPDATED_RE.search(html)
    if updated_match:
        updated = updated_match.group(1).strip()

    rates: List[RawRate] = []
    seen = set()
    for rows in payload.values():
        if not isinstance(rows, list):
            continue
        for row in rows:
            if not isinstance(row, dict):
                continue
            term_code = str(row.get("Term", "")).strip()
            label = labels.get(term_code, "")
            if not label or "PRIME" in label.upper():
                continue
            year_match = YEAR_RE.search(label)
            if not year_match:
                continue
            years = int(year_match.group(1))
            if not 1 <= years <= 10:
                continue
            rate = _parse_rate(row.get("Rate"))
            if rate is None:
                continue
            upper = label.upper()
            rate_type = RateType.VARIABLE if "ADJUSTABLE" in upper or "VARIABLE" in upper else RateType.FIXED
            mortgage_type = MortgageType.UNINSURED if "UNINSURED" in upper else MortgageType.INSURED
            key = (years * 12, rate_type, mortgage_type, str(rate), label)
            if key in seen:
                continue
            seen.add(key)
            rates.append(
                RawRate(
                    lender_slug=lender_slug,
                    lender_name=lender_name,
                    term_months=years * 12,
                    rate_type=rate_type,
                    mortgage_type=mortgage_type,
                    rate=rate,
                    source_url=source_url,
                    scraped_at=scraped_at,
                    raw_data={
                        "source": "cmls_live_scrape",
                        "extraction_method": "embedded_mortgage_rates",
                        "product": label.title(),
                        "term_code": term_code,
                        "effective": updated,
                        "featured": years == 5,
                    },
                )
            )
    return rates


class CMLSScraper:
    LENDER_SLUG = "cmls"
    LENDER_NAME = "CMLS Financial"
    RATE_URL = "https://www.cmls.ca/what-we-do/cmls-residential/mortgage-rates"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching CMLS Financial rate page...")
        html = fetch_html(self.RATE_URL, timeout=20.0)
        if not html:
            logger.warning("CMLS page fetch failed")
            return self._get_fallback_rates()
        rates = parse_cmls_html(
            html,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
        )
        if rates:
            logger.success(f"Successfully scraped {len(rates)} live rates from CMLS Financial")
            return rates
        logger.warning("CMLS HTML did not contain a MortgageRates grid")
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        # Used only when the first-party page cannot be fetched or parsed.
        fallback_data = [
            {"term": 60, "type": RateType.FIXED, "rate": "4.54", "mortgage_type": "uninsured", "product": "5-Year Fixed (Ratehub 2026-09-04)", "featured": True},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="cmls_fallback_2026-09-14",
            last_verified="2026-09-04",
        )


if __name__ == "__main__":
    scraper = CMLSScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} CMLS rates")
    for r in rates:
        print(
            f"  {r.mortgage_type.value:10} {r.term_months//12}yr {r.rate_type.value:8} {r.rate}% "
            f"{(r.raw_data or {}).get('product')}"
        )
