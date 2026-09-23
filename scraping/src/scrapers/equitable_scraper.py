"""
Equitable Bank mortgage rate scraper.

equitablebank.ca/mortgages/current-rates is now an empty shell whose
mortgage-rates navigation points at EQ Bank, Equitable's consumer brand.
The live grid is server-rendered at:

    https://www.eqbank.ca/residential/mortgage-rates

That page has the closed standard rates, the EQB Evolution Suite rates,
and the Equitable Prime Rate used to price "P ± x%" adjustable cells.
APR rows and reverse-mortgage tables are not residential term rates.
"""

import re
from decimal import Decimal, InvalidOperation
from typing import List, Optional, Tuple
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


TABLE_RE = re.compile(r"(?is)<table\b[^>]*>.*?</table>")
TR_RE = re.compile(r"(?is)<tr\b[^>]*>(.*?)</tr>")
CELL_RE = re.compile(r"(?is)<t[dh]\b[^>]*>(.*?)</t[dh]>")
SPREAD_RE = re.compile(r"P\s*([+-])\s*(\d+\.\d+)\s*%", re.IGNORECASE)
PERCENT_RE = re.compile(r"(\d+\.\d+)\s*%")
YEAR_RE = re.compile(r"(\d+)\s*[-–]?\s*year", re.IGNORECASE)
MONTH_RE = re.compile(r"(\d+)\s*[-–]?\s*month", re.IGNORECASE)


def _cell_text(cell_html: str) -> str:
    text = re.sub(r"(?is)<sup\b.*?</sup>", " ", cell_html)
    text = re.sub(r"<[^>]+>", " ", text)
    return " ".join(text.replace("*", " * ").split())


def _table_rows(table_html: str) -> List[List[str]]:
    rows = []
    for row_html in TR_RE.findall(table_html):
        cells = [_cell_text(cell) for cell in CELL_RE.findall(row_html)]
        cells = [cell for cell in cells if cell]
        if cells:
            rows.append(cells)
    return rows


def _header_spec(label: str) -> Optional[Tuple[int, RateType]]:
    lowered = label.lower()
    if "apr" in lowered:
        return None
    rate_type = RateType.VARIABLE if "adjust" in lowered or "variable" in lowered else RateType.FIXED
    year_match = YEAR_RE.search(lowered)
    if year_match:
        years = int(year_match.group(1))
        if 1 <= years <= 10:
            return years * 12, rate_type
        return None
    month_match = MONTH_RE.search(lowered)
    if month_match:
        months = int(month_match.group(1))
        if months in (6, 12, 18, 24):
            return months, rate_type
    return None


def _prime_rate(rows: List[List[str]]) -> Optional[Decimal]:
    for row in rows:
        label = row[0].lower()
        if "prime" not in label or "history" in label or len(row) < 2:
            continue
        match = PERCENT_RE.search(row[1])
        if not match:
            continue
        try:
            rate = Decimal(match.group(1))
        except (InvalidOperation, ValueError):
            continue
        if Decimal("1.50") <= rate <= Decimal("12.00"):
            return rate
    return None


def _cell_rate(text: str, prime: Optional[Decimal]) -> Tuple[Optional[Decimal], Optional[str]]:
    cleaned = text.replace("*", "").strip()
    if not cleaned or cleaned.strip("-") == "":
        return None, None
    spread_match = SPREAD_RE.search(cleaned)
    if spread_match:
        if prime is None:
            return None, None
        magnitude = Decimal(spread_match.group(2))
        sign = spread_match.group(1)
        rate = prime + magnitude if sign == "+" else prime - magnitude
        if not (Decimal("1.50") <= rate <= Decimal("12.00")):
            return None, None
        return rate, f"Prime {sign} {spread_match.group(2)}%"
    percent_match = PERCENT_RE.search(cleaned)
    if not percent_match:
        return None, None
    try:
        rate = Decimal(percent_match.group(1))
    except (InvalidOperation, ValueError):
        return None, None
    if not (Decimal("1.50") <= rate <= Decimal("12.00")):
        return None, None
    return rate, None


def parse_equitable_html(
    html: str,
    *,
    lender_slug: str,
    lender_name: str,
    source_url: str,
    scraped_at,
) -> List[RawRate]:
    if not html:
        return []
    prime: Optional[Decimal] = None
    product_tables: List[List[List[str]]] = []
    for table in TABLE_RE.findall(html):
        if "reverse mortgage" in table.lower():
            continue
        rows = _table_rows(table)
        if not rows:
            continue
        found_prime = _prime_rate(rows)
        if found_prime is not None and prime is None and len(rows) == 1:
            prime = found_prime
        header = " ".join(rows[0]).lower()
        if "year" in header and any(
            "mortgage rate" in " ".join(row).lower() or "evolution" in " ".join(row).lower()
            for row in rows[1:]
        ):
            product_tables.append(rows)
    if prime is None:
        for table in TABLE_RE.findall(html):
            if "reverse" in table.lower():
                continue
            found_prime = _prime_rate(_table_rows(table))
            if found_prime is not None:
                prime = found_prime
                break

    rates: List[RawRate] = []
    seen = set()
    for rows in product_tables:
        specs = [_header_spec(cell) for cell in rows[0][1:]]
        for row in rows[1:]:
            product = row[0]
            lowered = product.lower()
            if "annual percentage" in lowered or lowered.startswith("apr"):
                continue
            if "mortgage rate" not in lowered and "evolution" not in lowered:
                continue
            for spec, cell in zip(specs, row[1:]):
                if spec is None:
                    continue
                term_months, rate_type = spec
                rate, spread = _cell_rate(cell, prime)
                if rate is None:
                    continue
                key = (term_months, rate_type, str(rate), product)
                if key in seen:
                    continue
                seen.add(key)
                rates.append(
                    RawRate(
                        lender_slug=lender_slug,
                        lender_name=lender_name,
                        term_months=term_months,
                        rate_type=rate_type,
                        mortgage_type=MortgageType.UNINSURED,
                        rate=rate,
                        source_url=source_url,
                        scraped_at=scraped_at,
                        raw_data={
                            "source": "equitable_live_scrape",
                            "extraction_method": "eqbank_rate_table",
                            "product": product.strip(" *"),
                            "spread_to_prime": spread,
                            "prime_rate": str(prime) if prime is not None else None,
                            "conditional": "*" in cell,
                            "featured": term_months == 60,
                        },
                    )
                )
    return rates


class EquitableBankScraper:
    LENDER_SLUG = "equitable"
    LENDER_NAME = "Equitable Bank"
    # Consumer rate sheet moved from equitablebank.ca/mortgages/current-rates
    # (now an empty shell) to EQ Bank, which publishes Equitable Prime and
    # EQB Evolution Suite rates.
    RATE_URL = "https://www.eqbank.ca/residential/mortgage-rates"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching Equitable Bank rate page on EQ Bank...")
        html = fetch_html(self.RATE_URL, timeout=25.0)
        if not html:
            logger.warning("Equitable/EQ Bank page fetch failed")
            return self._get_fallback_rates()
        rates = parse_equitable_html(
            html,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
        )
        if rates:
            logger.success(f"Successfully scraped {len(rates)} live rates from Equitable Bank")
            return rates
        logger.warning("Equitable/EQ Bank HTML did not contain the residential rate table")
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "5.19", "mortgage_type": "uninsured", "product": "1-Year Fixed Standard (Forbes 2026-08-05)"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.14", "mortgage_type": "uninsured", "product": "2-Year Fixed Standard (Forbes 2026-08-05)"},
            {"term": 36, "type": RateType.FIXED, "rate": "5.24", "mortgage_type": "uninsured", "product": "3-Year Fixed Standard (Forbes 2026-08-05)"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.54", "mortgage_type": "uninsured", "product": "5-Year Fixed (Ratehub 2026-09-04)", "featured": True},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="equitable_fallback_2026-09-14",
            last_verified="2026-09-04",
        )


if __name__ == "__main__":
    scraper = EquitableBankScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} Equitable rates")
    for r in rates:
        data = r.raw_data or {}
        print(
            f"  {r.mortgage_type.value:10} {r.term_months}mo {r.rate_type.value:8} {r.rate}% "
            f"{data.get('product')} {data.get('spread_to_prime') or ''} {data.get('source')}"
        )
