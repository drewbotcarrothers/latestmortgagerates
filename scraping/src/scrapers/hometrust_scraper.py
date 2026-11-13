"""
Home Trust mortgage rate scraper.

https://www.hometrust.ca/mortgages/rates/ (redirects to /en/mortgages/rates)
publishes Accelerator (insured) and Classic posted rates in hometrust-card
`aem-data` JSON. The description field is an HTML table:

    Posted rates* (effective MM/DD/YYYY)
    1 year fixed ... 5 year fixed
    5.90% ...

Older pages used an inline script instead:

    var mortgageRates={"acc":[1yr, 2yr, 3yr, 4yr, 5yr],"classic":[...]};

Plain httpx is often intercepted by Radware. A Safari TLS fingerprint
receives the real page. The Radware bot-manager script (perfdrive.com)
is also present on that real page and is not itself a block.
"""

import json
import re
from decimal import Decimal, InvalidOperation
from html import unescape
from typing import List, Optional
from datetime import datetime, timezone
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType

try:
    from .http_fetch import fetch_html
    from .rate_parse import fallback_rows_to_rates, parse_term_months
    from .safari_fetch import fetch_html_safari
except ImportError:
    from http_fetch import fetch_html
    from rate_parse import fallback_rows_to_rates, parse_term_months
    from safari_fetch import fetch_html_safari


RATES_RE = re.compile(r"var\s+mortgageRates\s*=\s*(\{.*?\})\s*;", re.DOTALL)
ACC_DATE_RE = re.compile(r'var\s+accEffDate\s*=\s*"(\d{4}-\d{2}-\d{2})"')
CLASSIC_DATE_RE = re.compile(r'var\s+classicEffDate\s*=\s*"(\d{4}-\d{2}-\d{2})"')
AEM_RE = re.compile(r'\baem-data="([^"]*)"', re.IGNORECASE)
EFFECTIVE_RE = re.compile(
    r"effective\s+(\d{1,2})/(\d{1,2})/(\d{4})",
    re.IGNORECASE,
)
TERMS = (12, 24, 36, 48, 60)
PRODUCTS = (
    ("acc", MortgageType.INSURED, "Accelerator", ACC_DATE_RE),
    ("classic", MortgageType.UNINSURED, "Classic", CLASSIC_DATE_RE),
)


def _is_block_page(html: str) -> bool:
    """True for a Radware captcha interstitial.

    The normal rates page loads a bot-manager script from perfdrive.com.
    That script alone is not a block. A block page is the captcha itself,
    or a perfdrive response that never includes the rate content.
    """
    lowered = (html or "").lower()
    if "radware captcha" in lowered:
        return True
    if "perfdrive.com" not in lowered:
        return False
    compact = re.sub(r"\s+", "", lowered)
    if "varmortgagerates" in compact or "posted rates" in lowered or "hometrust-card" in lowered:
        return False
    return True


def _parse_rate(value) -> Optional[Decimal]:
    try:
        rate = Decimal(str(value))
    except (InvalidOperation, ValueError):
        return None
    if not (Decimal("1.50") <= rate <= Decimal("12.00")):
        return None
    return rate


def _html_rows(fragment: str) -> List[List[str]]:
    rows = []
    for row_html in re.findall(r"<tr\b[^>]*>(.*?)</tr>", fragment or "", flags=re.I | re.S):
        cells = re.findall(r"<t[dh]\b[^>]*>(.*?)</t[dh]>", row_html, flags=re.I | re.S)
        cleaned = []
        for cell in cells:
            text = re.sub(r"<[^>]+>", " ", unescape(cell))
            text = re.sub(r"\s+", " ", text).strip()
            cleaned.append(text)
        if any(cleaned):
            rows.append(cleaned)
    return rows


def _effective_date(text: str) -> Optional[str]:
    match = EFFECTIVE_RE.search(text or "")
    if not match:
        return None
    month, day, year = (int(part) for part in match.groups())
    try:
        return datetime(year, month, day).date().isoformat()
    except ValueError:
        return None


def _product_from_card(payload: dict) -> Optional[tuple]:
    headline = str(payload.get("headline") or "")
    description = str(payload.get("description") or "")
    blob = f"{headline} {description}".lower()
    if "accelerator" in blob:
        return MortgageType.INSURED, "Accelerator"
    if "classic" in blob:
        return MortgageType.UNINSURED, "Classic"
    return None


def _rates_from_aem_cards(html: str, **common) -> List[RawRate]:
    rates: List[RawRate] = []
    for match in AEM_RE.finditer(html or ""):
        try:
            payload = json.loads(unescape(match.group(1)))
        except json.JSONDecodeError:
            continue
        if not isinstance(payload, dict):
            continue
        product = _product_from_card(payload)
        if product is None:
            continue
        mortgage_type, name = product
        description = str(payload.get("description") or "")
        # aem-data JSON stores the table as real HTML after json.loads.
        # Some fixtures keep the \\u003c escapes one level too shallow.
        if "\\u003c" in description:
            try:
                description = json.loads(f'"{description}"')
            except json.JSONDecodeError:
                description = description.encode("utf-8").decode("unicode_escape")
        rows = _html_rows(description)
        if len(rows) < 2:
            continue
        headers = rows[0][1:]
        values = None
        for row in rows[1:]:
            if row and "posted" in row[0].lower():
                values = row[1:]
                break
        if values is None:
            values = rows[-1][1:]
        effective = _effective_date(unescape(description))
        for header, raw_rate in zip(headers, values):
            term_months = parse_term_months(header)
            rate = _parse_rate(str(raw_rate).replace("%", "").strip())
            if term_months is None or rate is None:
                continue
            years = term_months // 12
            rates.append(RawRate(
                lender_slug=common["lender_slug"],
                lender_name=common["lender_name"],
                term_months=term_months,
                rate_type=RateType.FIXED,
                mortgage_type=mortgage_type,
                rate=rate,
                source_url=common["source_url"],
                scraped_at=common["scraped_at"],
                raw_data={
                    "source": "hometrust_live_scrape",
                    "extraction_method": "aem_card_table",
                    "product": f"{name} {years}-Year Fixed",
                    "effective": effective,
                    "featured": name == "Accelerator" and term_months in (36, 60),
                },
            ))
    return rates


def _rates_from_inline_script(html: str, **common) -> List[RawRate]:
    match = RATES_RE.search(html or "")
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
                    lender_slug=common["lender_slug"],
                    lender_name=common["lender_name"],
                    term_months=term_months,
                    rate_type=RateType.FIXED,
                    mortgage_type=mortgage_type,
                    rate=rate,
                    source_url=common["source_url"],
                    scraped_at=common["scraped_at"],
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
    common = dict(
        lender_slug=lender_slug,
        lender_name=lender_name,
        source_url=source_url,
        scraped_at=scraped_at,
    )
    rates = _rates_from_aem_cards(html, **common)
    if rates:
        return rates
    return _rates_from_inline_script(html, **common)


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
        logger.warning("Home Trust HTML did not contain Accelerator or Classic posted rates")
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
