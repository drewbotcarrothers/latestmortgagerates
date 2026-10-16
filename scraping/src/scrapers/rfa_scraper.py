"""
RFA Bank of Canada mortgage rate scraper.

rfabank.com now 301s to rfa.ca, and /mortgage-rates on the old host returns
Cloudflare 522 (origin gone). The public board is server-rendered HTML at
https://rfa.ca/prime — there is no first-party rates JSON API. The sheet
prices three files:

- Insured: one column (high-ratio)
- Insurable: LTV bands from ≤65% through 75.01–80%
- Uninsurable: owner-occupied ≤80%, which we store as uninsured

Rental, second-home, Quebec 45-day, and Frontline rows are omitted. They are
not the national owner-occupied board. The alternative credit-tier program
at https://rfa.ca/alternative is a separate product and is not mixed in.

Variable cells are quoted as P-x.x%. The numeric rate uses the RFA Prime
Rate printed on the same page. Fallback rows stay last, tagged
rfa_fallback_* with last_verified, so a stale sheet is visible.
"""

from __future__ import annotations

import re
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from loguru import logger

import sys

sys.path.append(str(Path(__file__).parent.parent))
from models import MortgageType, RateType, RawRate

try:
    from .http_fetch import fetch_html
    from .rate_parse import fallback_rows_to_rates
except ImportError:
    from http_fetch import fetch_html
    from rate_parse import fallback_rows_to_rates


TABLE_RE = re.compile(r"(?is)<table\b.*?</table>")
ROW_RE = re.compile(r"(?is)<tr\b.*?</tr>")
CELL_RE = re.compile(r"(?is)<t[dh]\b([^>]*)>(.*?)</t[dh]>")
SPAN_RE = re.compile(r"""(?i)\b(rowspan|colspan)\s*=\s*["']?(\d+)""")
TERM_RE = re.compile(r"(\d+)\s*-?\s*year", re.IGNORECASE)
SPREAD_RE = re.compile(
    r"P(?:rime)?\s*([+-])\s*(\d+(?:\.\d+)?)\s*%?",
    re.IGNORECASE,
)
PERCENT_RE = re.compile(r"(\d+\.\d+)\s*%")
PRIME_RE = re.compile(
    r"RFA Prime Rate.{0,400}?(\d+\.\d+)\s*%",
    re.IGNORECASE | re.DOTALL,
)
EFFECTIVE_RE = re.compile(
    r"Rates effective as of\s+([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})",
    re.IGNORECASE,
)
WORD_RE = re.compile(r"\b(insured|insurable|uninsurable)\b", re.IGNORECASE)

MONTHS = {
    "january": 1,
    "february": 2,
    "march": 3,
    "april": 4,
    "may": 5,
    "june": 6,
    "july": 7,
    "august": 8,
    "september": 9,
    "october": 10,
    "november": 11,
    "december": 12,
}

RESTRICTED_PRODUCT = ("rental", "frontline", "qc", "quebec", "second home", "cashback")
MIN_LIVE_RATES = 4
TYPE_ORDER = {
    MortgageType.INSURED: 0,
    MortgageType.INSURABLE: 1,
    MortgageType.UNINSURED: 2,
}


class RFAScraper:
    LENDER_SLUG = "rfa"
    LENDER_NAME = "RFA Bank"
    RATE_URL = "https://rfa.ca/prime"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info(f"Fetching RFA prime rate sheet {self.RATE_URL}")
        html = fetch_html(self.RATE_URL, timeout=20.0)
        if not html:
            html = _fetch_safari(self.RATE_URL)
        rates = []
        if html:
            rates = parse_rfa_html(
                html,
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                source_url=self.RATE_URL,
                scraped_at=self.scraped_at,
            )
        if rates:
            logger.success(f"Successfully scraped {len(rates)} live rates from RFA")
            return rates
        logger.info(
            "RFA live sheet unavailable; using fallback rates "
            "(rfa_fallback_2026-09-14, last verified 2026-07-06)"
        )
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "5.19", "mortgage_type": "uninsured", "product": "1-Year Fixed"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.54", "mortgage_type": "uninsured", "product": "2-Year Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.34", "mortgage_type": "uninsured", "product": "3-Year Fixed", "featured": True},
            {"term": 48, "type": RateType.FIXED, "rate": "4.39", "mortgage_type": "uninsured", "product": "4-Year Fixed"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.29", "mortgage_type": "uninsured", "product": "5-Year Fixed", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.70", "mortgage_type": "uninsured", "product": "5-Year Variable", "featured": True, "spread": "Prime - 0.75%"},
        ]
        rates = fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="rfa_fallback_2026-09-14",
            last_verified="2026-07-06",
        )
        for rate in rates:
            if rate.raw_data is not None:
                rate.raw_data["stale"] = True
        return rates


def parse_rfa_html(
    html: str,
    *,
    lender_slug: str,
    lender_name: str,
    source_url: str,
    scraped_at,
) -> List[RawRate]:
    """Parse the rfa.ca/prime rate tables. Returns [] when the sheet is missing."""
    if not html:
        return []
    lowered = html.lower()
    if "rfa prime rate" not in lowered and "<table" not in lowered:
        return []

    prime = _prime_rate(html)
    effective = _effective_date(html)
    confirmed = _confirmed_on(scraped_at)

    found: List[dict] = []
    for table in TABLE_RE.findall(html):
        found.extend(_rates_from_table(table, prime))

    if len(found) < MIN_LIVE_RATES:
        return []

    grouped: Dict[Tuple, List[dict]] = {}
    for item in found:
        key = (item["term_months"], item["rate_type"], item["mortgage_type"])
        grouped.setdefault(key, []).append(item)

    rates: List[RawRate] = []
    for key in sorted(grouped, key=_group_sort):
        cells = grouped[key]
        winner = min(cells, key=lambda item: (item["rate"], item["promo"]))
        ltv_rates: Dict[str, str] = {}
        for item in cells:
            tier = item["ltv"] or "board"
            previous = ltv_rates.get(tier)
            if previous is None or Decimal(previous) > item["rate"]:
                ltv_rates[tier] = f"{item['rate']:.2f}"
        raw_data = {
            "source": "rfa_live_scrape",
            "extraction_method": "rfa_prime_rate_table",
            "product": winner["product"],
            "section": winner["section"],
            "featured": winner["term_months"] == 60,
            "last_verified": confirmed,
            "rates_effective": effective,
            "prime_rate": f"{prime:.2f}" if prime is not None else None,
            "ltv_tier": winner["ltv"],
            "spread_to_prime": winner["spread"],
        }
        if len(ltv_rates) > 1 or (len(ltv_rates) == 1 and "board" not in ltv_rates):
            raw_data["ltv_rates"] = ltv_rates
        rates.append(
            RawRate(
                lender_slug=lender_slug,
                lender_name=lender_name,
                term_months=winner["term_months"],
                rate_type=winner["rate_type"],
                mortgage_type=winner["mortgage_type"],
                rate=winner["rate"],
                source_url=source_url,
                scraped_at=scraped_at,
                raw_data=raw_data,
            )
        )
    return rates


def _fetch_safari(url: str) -> Optional[str]:
    try:
        from .safari_fetch import fetch_html_safari
    except ImportError:
        try:
            from safari_fetch import fetch_html_safari
        except ImportError:
            return None
    logger.info("RFA HTTP fetch failed; retrying with Safari TLS impersonation")
    return fetch_html_safari(url, timeout=25.0)


def _prime_rate(html: str) -> Optional[Decimal]:
    match = PRIME_RE.search(html)
    if not match:
        return None
    return _in_range(match.group(1))


def _effective_date(html: str) -> Optional[str]:
    match = EFFECTIVE_RE.search(html)
    if not match:
        return None
    month = MONTHS.get(match.group(1).lower())
    if not month:
        return None
    return f"{int(match.group(3)):04d}-{month:02d}-{int(match.group(2)):02d}"


def _confirmed_on(scraped_at) -> str:
    if isinstance(scraped_at, datetime):
        when = scraped_at.astimezone(timezone.utc) if scraped_at.tzinfo else scraped_at
        return when.date().isoformat()
    return datetime.now(timezone.utc).date().isoformat()


def _rates_from_table(table: str, prime: Optional[Decimal]) -> List[dict]:
    grid = _table_grid(table)
    if not grid:
        return []
    header_idx = next(
        (i for i, row in enumerate(grid) if row and row[0].strip().lower() == "term"),
        None,
    )
    if header_idx is None:
        return []

    header = grid[header_idx]
    subheader = None
    data_start = header_idx + 1
    if data_start < len(grid) and _is_subheader(grid[data_start]):
        subheader = grid[data_start]
        data_start += 1

    columns = _column_specs(header, subheader, table)
    if not any(spec for spec in columns):
        return []

    found: List[dict] = []
    section = ""
    for row in grid[data_start:]:
        if not row:
            continue
        label = row[0].strip()
        term_match = TERM_RE.search(label)
        if not term_match:
            # Banner rows ("Standard Rates") span the table. A product row
            # without a parsed term, such as Frontline, still has rates and
            # must not replace the current section.
            if _is_section_banner(row):
                section = label
            continue
        if _restricted(label):
            continue
        years = int(term_match.group(1))
        if not 1 <= years <= 10:
            continue
        rate_type = _rate_type(label)
        product = " ".join(label.split())
        for index, spec in enumerate(columns):
            if spec is None or index >= len(row):
                continue
            rate, spread = _cell_rate(row[index], prime)
            if rate is None:
                continue
            found.append(
                {
                    "term_months": years * 12,
                    "rate_type": rate_type,
                    "mortgage_type": spec["mortgage_type"],
                    "rate": rate,
                    "product": product,
                    "section": section,
                    "ltv": spec["ltv"],
                    "spread": spread,
                    "promo": 1 if "promo" in section.lower() else 0,
                }
            )
    return found


def _column_specs(
    header: List[str],
    subheader: Optional[List[str]],
    table: str,
) -> List[Optional[dict]]:
    table_default = MortgageType.UNINSURED if re.search(r"\buninsurable\b", _strip_cell(table), re.I) else None
    width = max(len(header), len(subheader or []))
    specs: List[Optional[dict]] = []
    for index in range(width):
        parent = _parent_header(header, index)
        sub = ""
        if subheader and index < len(subheader):
            sub = subheader[index].strip()
        label = " ".join(part for part in (parent, sub) if part).strip()
        if index == 0 or _skip_column(label):
            specs.append(None)
            continue
        mortgage_type = _mortgage_type(label) or table_default
        if mortgage_type is None:
            specs.append(None)
            continue
        specs.append({"mortgage_type": mortgage_type, "ltv": _ltv_label(parent, sub)})
    return specs


def _parent_header(header: List[str], index: int) -> str:
    if index < len(header) and header[index].strip():
        return header[index].strip()
    for cursor in range(index, -1, -1):
        if cursor < len(header) and header[cursor].strip():
            return header[cursor].strip()
    return ""


def _skip_column(label: str) -> bool:
    lowered = label.lower()
    if not lowered or lowered == "term":
        return True
    if "compensation" in lowered or re.search(r"\bbps\b", lowered):
        return True
    if "rental" in lowered or "second home" in lowered:
        return True
    return False


def _mortgage_type(label: str) -> Optional[MortgageType]:
    match = None
    for found in WORD_RE.finditer(label):
        match = found.group(1).lower()
    if match == "uninsurable":
        return MortgageType.UNINSURED
    if match == "insurable":
        return MortgageType.INSURABLE
    if match == "insured":
        return MortgageType.INSURED
    return None


def _ltv_label(parent: str, sub: str) -> Optional[str]:
    parent_l = parent.lower()
    sub_l = sub.lower()
    if sub and sub_l != parent_l and sub_l not in {"term", "insured", "insurable", "uninsurable"}:
        if re.search(r"≤|<=|\d", sub):
            return sub
    if parent and parent_l not in {"term", "insured", "insurable", "uninsurable"}:
        if re.search(r"≤|<=|\d", parent) and "year" not in parent_l and "compensation" not in parent_l:
            return parent
    return None


def _is_section_banner(row: List[str]) -> bool:
    label = row[0].strip() if row else ""
    if not label or label.lower() == "term":
        return False
    return not any(_has_rate_token(cell) for cell in row[1:])


def _has_rate_token(text: str) -> bool:
    cleaned = text.replace("*", "").strip()
    if cleaned in {"", "-", "—", "–", "−"}:
        return False
    return bool(SPREAD_RE.search(cleaned) or PERCENT_RE.search(cleaned))


def _is_subheader(row: List[str]) -> bool:
    blob = " ".join(row)
    if TERM_RE.search(blob):
        return False
    return bool(re.search(r"≤|<=|\d+\.\d+\s*to\s*\d+", blob))


def _restricted(label: str) -> bool:
    lowered = label.lower()
    return any(hint in lowered for hint in RESTRICTED_PRODUCT)


def _rate_type(label: str) -> RateType:
    lowered = label.lower()
    if any(hint in lowered for hint in ("arm", "variable", "adjustable")):
        return RateType.VARIABLE
    return RateType.FIXED


def _cell_rate(text: str, prime: Optional[Decimal]) -> Tuple[Optional[Decimal], Optional[str]]:
    cleaned = text.replace("*", "").strip()
    if cleaned in {"", "-", "—", "–", "−", "n/a", "na"}:
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
    rate = _in_range(percent_match.group(1))
    return rate, None


def _in_range(value: str) -> Optional[Decimal]:
    try:
        rate = Decimal(value)
    except (InvalidOperation, ValueError):
        return None
    if Decimal("1.50") <= rate <= Decimal("12.00"):
        return rate
    return None


def _table_grid(table: str) -> List[List[str]]:
    """Expand rowspan/colspan so each row is a flat list of cell texts."""
    pending: Dict[Tuple[int, int], str] = {}
    grid: List[List[str]] = []
    for row_index, row_html in enumerate(ROW_RE.findall(table)):
        row: List[str] = []
        column = 0

        def take_pending() -> None:
            nonlocal column
            while (row_index, column) in pending:
                row.append(pending.pop((row_index, column)))
                column += 1

        for attrs, inner in CELL_RE.findall(row_html):
            take_pending()
            text = _strip_cell(inner)
            spans = {name.lower(): int(value) for name, value in SPAN_RE.findall(attrs)}
            colspan = spans.get("colspan", 1)
            rowspan = spans.get("rowspan", 1)
            for offset in range(colspan):
                value = text if offset == 0 else ""
                row.append(value)
                if rowspan > 1:
                    for down in range(1, rowspan):
                        pending[(row_index + down, column)] = value
                column += 1
        take_pending()
        grid.append(row)
    return grid


def _strip_cell(html: str) -> str:
    text = re.sub(r"(?is)<[^>]+>", " ", html)
    text = (
        text.replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&mdash;", "—")
        .replace("&ndash;", "-")
        .replace("&#8212;", "—")
        .replace("&#8211;", "-")
        .replace("&#37;", "%")
    )
    return re.sub(r"\s+", " ", text).strip()


def _group_sort(key: Tuple) -> Tuple:
    term_months, rate_type, mortgage_type = key
    return (
        TYPE_ORDER.get(mortgage_type, 9),
        term_months,
        0 if rate_type == RateType.FIXED else 1,
    )


if __name__ == "__main__":
    scraper = RFAScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} RFA rates")
    for rate in rates:
        data = rate.raw_data or {}
        print(
            f"  {rate.mortgage_type.value:10} {rate.term_months // 12}yr {rate.rate_type.value:8} "
            f"{rate.rate}% {data.get('product')} {data.get('spread_to_prime') or ''} "
            f"ltv={data.get('ltv_tier')} source={data.get('source')} "
            f"effective={data.get('rates_effective')}"
        )
