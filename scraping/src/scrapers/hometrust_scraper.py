"""
Home Trust mortgage rate scraper.

https://www.hometrust.ca/mortgages/rates/ publishes Accelerator (insured)
and Classic posted rates in an inline script:

    var accEffDate = "YYYY-MM-DD";
    var classicEffDate = "YYYY-MM-DD";
    var mortgageRates={"acc":[1yr, 2yr, 3yr, 4yr, 5yr],"classic":[...]};

Plain httpx is intercepted by a Radware captcha. A Safari TLS fingerprint
receives the real page. The empty table cells are filled in that array
order (1-year through 5-year) for each product.
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
    from .safari_fetch import fetch_html_safari
except ImportError:
    from http_fetch import fetch_html
    from rate_parse import fallback_rows_to_rates
    from safari_fetch import fetch_html_safari


RATES_RE = re.compile(r"var\s+mortgageRates\s*=\s*(\{.*?\})\s*;", re.DOTALL)
ACC_DATE_RE = re.compile(r'var\s+accEffDate\s*=\s*"(\d{4}-\d{2}-\d{2})"')
CLASSIC_DATE_RE = re.compile(r'var\s+classicEffDate\s*=\s*"(\d{4}-\d{2}-\d{2})"')
TERMS = (12, 24, 36, 48, 60)
PRODUCTS = (
    ("acc", MortgageType.INSURED, "Accelerator", ACC_DATE_RE),
    ("classic", MortgageType.UNINSURED, "Classic", CLASSIC_DATE_RE),
)


def _is_block_page(html: str) -> bool:
    """Radware interstitial. A real rates page may still mention perfdrive."""
    lowered = (html or "").lower()
    if "varmortgagerates" in lowered.replace(" ", ""):
        return False
    return "radware captcha" in lowered or "perfdrive.com" in lowered


def _parse_rate(value) -> Optional[Decimal]:
    try:
        rate = Decimal(str(value))
    except (InvalidOperation, ValueError):
        return None
    if not (Decimal("1.50") <= rate <= Decimal("12.00")):
        return None
    return rate


def parse_hometrust_html(
    html: str,
    *,
    lender_slug: str,
    lender_name: str,
    source_url: str,
    scraped_at,
) -> List[RawRate]:
    if not html or _is_block_page(html):
        return []
    match = RATES_RE.search(html)
    if not match:
        return []
    try:
        payload = json.loads(match.group(1))
    except json.JSONDecodeError:
        return []

    rates: List[RawRate] = []
    for key, mortgage_type, product, date_re in PRODUCTS:
        values = payload.get(key)
        if not isinstance(values, list) or len(values) != len(TERMS):
            continue
        date_match = date_re.search(html)
        effective = date_match.group(1) if date_match else None
        for term_months, raw_rate in zip(TERMS, values):
            rate = _parse_rate(raw_rate)
            if rate is None:
                continue
            years = term_months // 12
            rates.append(
                RawRate(
                    lender_slug=lender_slug,
                    lender_name=lender_name,
                    term_months=term_months,
                    rate_type=RateType.FIXED,
                    mortgage_type=mortgage_type,
                    rate=rate,
                    source_url=source_url,
                    scraped_at=scraped_at,
                    raw_data={
                        "source": "hometrust_live_scrape",
                        "extraction_method": "inline_mortgage_rates",
                        "product": f"{product} {years}-Year Fixed",
                        "effective": effective,
                        "featured": product == "Accelerator" and term_months in (36, 60),
                    },
                )
            )
    return rates


class HomeTrustScraper:
    LENDER_SLUG = "hometrust"
    LENDER_NAME = "Home Trust"
    RATE_URL = "https://www.hometrust.ca/mortgages/rates/"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching Home Trust rate page...")
        html = fetch_html_safari(self.RATE_URL, timeout=25.0)
        if not html or _is_block_page(html):
            html = fetch_html(self.RATE_URL, timeout=20.0)
        if not html or _is_block_page(html):
            logger.warning("Home Trust fetch failed or was blocked")
            return self._get_fallback_rates()
        rates = parse_hometrust_html(
            html,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
        )
        if rates:
            logger.success(f"Successfully scraped {len(rates)} live rates from Home Trust")
            return rates
        logger.warning("Home Trust HTML did not contain mortgageRates")
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        # Used only when the first-party page cannot be fetched or parsed.
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "4.99", "mortgage_type": "insured", "product": "Accelerator 1-Year Fixed"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.44", "mortgage_type": "insured", "product": "Accelerator 2-Year Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.34", "mortgage_type": "insured", "product": "Accelerator 3-Year Fixed", "featured": True},
            {"term": 48, "type": RateType.FIXED, "rate": "4.39", "mortgage_type": "insured", "product": "Accelerator 4-Year Fixed"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.49", "mortgage_type": "insured", "product": "Accelerator 5-Year Fixed", "featured": True},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="hometrust_fallback_2026-09-14",
            last_verified="2026-08-13",
        )


if __name__ == "__main__":
    scraper = HomeTrustScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} Home Trust rates")
    for r in rates:
        print(
            f"  {r.mortgage_type.value:10} {r.term_months//12}yr {r.rate_type.value:8} {r.rate}% "
            f"{(r.raw_data or {}).get('product')} eff={(r.raw_data or {}).get('effective')}"
        )
