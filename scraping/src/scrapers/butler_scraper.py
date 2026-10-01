"""
Butler Mortgage rate scraper.

Published rates are in the initial HTML of
https://www.butlermortgage.ca/low-mortgage-rates/
(two columns: Fixed Mortgage Rates and Variable Mortgage Rates).
Each live cell is an Inquire button with data-rate and
data-form-title="TERM/FIXED|VARIABLE". Empty variable terms are HTML
comments, not rates. A calculator modal elsewhere on the page shows
unrelated sample percentages and must be ignored.

The previous parser scanned page text for a term, took the next percentage,
and assigned that number to both fixed and variable. The fixed column comes
first, so every variable row duplicated the fixed rate. mortgage_type was
hard-coded uninsured.

The rate table does not label rows insured or uninsured. Butler's featured
rates (homepage) do: a product whose own label says "High-Ratio Mortgage"
is default-insured. Products the page does not call high-ratio stay unset.
A blanket sentence on the rate table ("best rates are for high-ratio…")
labels every published term when no product is called out individually.
"""

from __future__ import annotations

import re
import sys
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from html import unescape
from pathlib import Path
from typing import List, Optional

from loguru import logger

sys.path.append(str(Path(__file__).parent.parent))
from models import MortgageType, RateType, RawRate

try:
    from .http_fetch import fetch_html
except ImportError:
    from http_fetch import fetch_html


class ButlerMortgageScraper:
    """Scraper for Butler Mortgage rates."""

    LENDER_SLUG = "butlermortgage"
    LENDER_NAME = "Butler Mortgage"
    RATE_URL = "https://www.butlermortgage.ca/low-mortgage-rates/"
    # Featured cards ("3-Year Fixed Rate High-Ratio Mortgage", and so on)
    # live on the homepage. "View All Rates" links to RATE_URL.
    FEATURED_URL = "https://www.butlermortgage.ca/"
    LIVE_SOURCE = "butlermortgage_live_scrape"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        """Scrape Butler Mortgage rates. Returns [] when the live page cannot be parsed.

        An empty list omits Butler from the daily export. Raising would mark the
        scraper failed and the pipeline would backfill the previous snapshot,
        including the duplicated fixed/variable rows this parser used to emit.
        """
        logger.info(f"Fetching Butler Mortgage rates from {self.RATE_URL}")
        try:
            html = fetch_html(self.RATE_URL, timeout=25.0)
        except Exception as exc:
            logger.error(
                f"Butler Mortgage fetch failed for {self.RATE_URL}: {exc}. "
                "Omitting Butler; no hard-coded fallback."
            )
            return []

        if not html:
            logger.error(
                f"Butler Mortgage page {self.RATE_URL} was empty or unreachable. "
                "Omitting Butler; no hard-coded fallback."
            )
            return []

        featured_html = fetch_html(self.FEATURED_URL, timeout=25.0)
        if not featured_html:
            logger.warning(
                f"Butler featured rates page {self.FEATURED_URL} was empty or unreachable. "
                "Insurance labels will follow only what the rate table itself says."
            )

        rates = parse_butler_html(
            html,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            qualification_html=featured_html,
        )
        if not rates:
            logger.error(
                f"Butler Mortgage page {self.RATE_URL} had no published term rates. "
                "Omitting Butler; no hard-coded fallback."
            )
            return []

        logger.success(f"Successfully scraped {len(rates)} live rates from Butler Mortgage")
        return rates


_COMMENT_RE = re.compile(r"(?is)<!--.*?-->")
_BUTTON_RE = re.compile(r"(?is)<button\b[^>]*>")
_HEADING_RE = re.compile(r"(?is)<h[1-6]\b[^>]*>.*?</h[1-6]>")
_RATE_ATTR_RE = re.compile(r'(?is)\bdata-rate\s*=\s*"(\d+\.\d+)"')
_TITLE_ATTR_RE = re.compile(r'(?is)\bdata-form-title\s*=\s*"([^"]+)"')
_TERM_RE = re.compile(r"^(\d+)\s*-\s*(MTH|MONTH|MONTHS|YEAR|YEARS|YR)$", re.IGNORECASE)
# "uninsured" must not satisfy the insured check. A substring test for
# "insured" matches "uninsured"; word boundaries do not.
_UNINSURED_RE = re.compile(r"\b(?:uninsured|conventional)\b", re.IGNORECASE)
_INSURED_RE = re.compile(r"\b(?:insured|high[-\s]?ratio)\b", re.IGNORECASE)
_SMALL_RE = re.compile(r"(?is)<small\b[^>]*>.*?</small>")
# A sentence that covers the published table without naming a term.
# Per-product "High-Ratio Mortgage" labels are handled separately and win.
_BLANKET_HIGH_RATIO_RE = re.compile(
    r"(?is)(?:"
    r"(?:best|published|advertised|listed|our|these|the)\s+rates?\s+"
    r"(?:are|is|apply|applies)\s+(?:for\s+|to\s+)?(?:high[-\s]?ratio|insured)"
    r"|high[-\s]?ratio\s+mortgages?\s*\(\s*less\s+than\s+20\s*%"
    r")"
)
_MIN_RATE = Decimal("1.50")
_MAX_RATE = Decimal("12.00")


def mortgage_type_from_context(text: str) -> Optional[MortgageType]:
    """Read an insured/uninsured label. Unspecified when the text doesn't state one.

    Uninsured/conventional is matched on a word boundary before insured/high-ratio.
    If both are present, return None rather than picking one.
    """
    if not text:
        return None
    uninsured = _UNINSURED_RE.search(text) is not None
    insured = _INSURED_RE.search(text) is not None
    if uninsured and insured:
        return None
    if uninsured:
        return MortgageType.UNINSURED
    if insured:
        return MortgageType.INSURED
    return None


def explicit_product_types(html: str) -> dict[tuple[int, RateType], MortgageType]:
    """Map term and rate type to a type the product's own label states.

    Featured cards put the label in a ``<small>`` immediately before the
    Inquire button (``3-Year Fixed Rate High-Ratio Mortgage``). The card
    that only says ``Mortgage`` does not state a type and is omitted.
    """
    if not html or not html.strip():
        return {}

    cleaned = _COMMENT_RE.sub(" ", html)
    buttons: list[tuple[int, int, int, RateType]] = []
    for button in _BUTTON_RE.finditer(cleaned):
        tag = button.group(0)
        title_match = _TITLE_ATTR_RE.search(tag)
        if not title_match:
            continue
        title = unescape(title_match.group(1)).strip()
        if "/" not in title:
            continue
        term_label, kind_label = title.split("/", 1)
        term_months = _term_months(term_label)
        rate_type = _rate_type(kind_label)
        if term_months is None or rate_type is None:
            continue
        buttons.append((button.start(), button.end(), term_months, rate_type))

    found: dict[tuple[int, RateType], MortgageType] = {}
    conflicts: set[tuple[int, RateType]] = set()
    prev_end = 0
    for start, end, term_months, rate_type in buttons:
        window = cleaned[prev_end:start]
        prev_end = end
        smalls = list(_SMALL_RE.finditer(window))
        if not smalls:
            continue
        label = _strip_tags(smalls[-1].group(0))
        mortgage_type = mortgage_type_from_context(label)
        if mortgage_type is None:
            continue
        key = (term_months, rate_type)
        if key in conflicts:
            continue
        previous = found.get(key)
        if previous is not None and previous != mortgage_type:
            conflicts.add(key)
            found.pop(key, None)
            logger.error(
                f"Butler Mortgage labels {term_months}mo {rate_type.value} as both "
                f"{previous.value} and {mortgage_type.value}. Leaving that product unlabelled."
            )
            continue
        found[key] = mortgage_type
    return found


def blanket_high_ratio(html: str) -> bool:
    """True when the page says the published rates as a group are high-ratio.

    Product labels (``High-Ratio Mortgage`` on one card) are not a blanket.
    """
    if not html or not html.strip():
        return False
    cleaned = _COMMENT_RE.sub(" ", html)
    text = _strip_tags(cleaned)
    return _BLANKET_HIGH_RATIO_RE.search(text) is not None


def _merge_product_types(
    *maps: dict[tuple[int, RateType], MortgageType],
) -> dict[tuple[int, RateType], MortgageType]:
    merged: dict[tuple[int, RateType], MortgageType] = {}
    conflicts: set[tuple[int, RateType]] = set()
    for product_types in maps:
        for key, mortgage_type in product_types.items():
            if key in conflicts:
                continue
            previous = merged.get(key)
            if previous is not None and previous != mortgage_type:
                conflicts.add(key)
                merged.pop(key, None)
                continue
            merged[key] = mortgage_type
    return merged


def _strip_tags(fragment: str) -> str:
    text = re.sub(r"(?is)<[^>]+>", " ", fragment)
    return re.sub(r"\s+", " ", unescape(text)).strip()


def _term_months(label: str) -> Optional[int]:
    match = _TERM_RE.match(label.strip())
    if not match:
        return None
    count = int(match.group(1))
    unit = match.group(2).upper()
    if unit.startswith("M"):
        if count in (6, 12, 18):
            return count
        return None
    if 1 <= count <= 10:
        return count * 12
    return None


def _rate_type(label: str) -> Optional[RateType]:
    kind = label.strip().upper()
    if kind == "FIXED":
        return RateType.FIXED
    if kind == "VARIABLE":
        return RateType.VARIABLE
    return None


def _parse_rate(raw: str) -> Optional[Decimal]:
    try:
        rate = Decimal(raw)
    except (InvalidOperation, ValueError):
        return None
    if _MIN_RATE <= rate <= _MAX_RATE:
        return rate
    return None


def _nearest_heading(html: str, position: int) -> str:
    headings = list(_HEADING_RE.finditer(html, 0, position))
    if not headings:
        return ""
    return _strip_tags(headings[-1].group(0))


def parse_butler_html(
    html: str,
    *,
    source_url: str,
    scraped_at: datetime,
    qualification_html: Optional[str] = None,
) -> List[RawRate]:
    """Parse Butler's rate-table buttons into one row per published term and type.

    HELOC rows are not mortgage terms and are dropped. Commented placeholder
    rates (empty variable cells) are dropped with the comments. Buttons that
    lack data-form-title (the calculator modal) are ignored.

    ``qualification_html`` is the featured-rates page. A product labelled
    high-ratio there is insured. The rate table's own heading still wins
    when that heading states insured or uninsured.
    """
    if not html or not html.strip():
        return []

    cleaned = _COMMENT_RE.sub(" ", html)
    table_types = explicit_product_types(cleaned)
    stated_types = _merge_product_types(
        table_types,
        explicit_product_types(qualification_html or ""),
    )
    # A group sentence on the rate table covers rows the page does not name.
    # Named product labels are not a group sentence, so they do not mark the
    # rest of the table.
    label_all_insured = blanket_high_ratio(cleaned) and not table_types
    found: dict[tuple[int, RateType], tuple[Decimal, str, Optional[MortgageType]]] = {}
    conflicts: set[tuple[int, RateType]] = set()

    for button in _BUTTON_RE.finditer(cleaned):
        tag = button.group(0)
        rate_match = _RATE_ATTR_RE.search(tag)
        title_match = _TITLE_ATTR_RE.search(tag)
        if not rate_match or not title_match:
            continue
        rate = _parse_rate(rate_match.group(1))
        if rate is None:
            continue

        title = unescape(title_match.group(1)).strip()
        if "/" not in title:
            continue
        term_label, kind_label = title.split("/", 1)
        term_months = _term_months(term_label)
        rate_type = _rate_type(kind_label)
        if term_months is None or rate_type is None:
            continue

        heading = _nearest_heading(cleaned, button.start())
        mortgage_type = mortgage_type_from_context(f"{heading} {title}")
        key = (term_months, rate_type)
        previous = found.get(key)
        if previous is not None and previous[0] != rate:
            conflicts.add(key)
            logger.error(
                f"Butler Mortgage published two {kind_label} rates for {term_label}: "
                f"{previous[0]} and {rate}. Omitting that row."
            )
            continue
        found[key] = (rate, title, mortgage_type)

    for key in conflicts:
        found.pop(key, None)

    rates: List[RawRate] = []
    for (term_months, rate_type), (rate, title, mortgage_type) in sorted(found.items()):
        key = (term_months, rate_type)
        stated = stated_types.get(key)
        if mortgage_type is None:
            if stated is not None:
                mortgage_type = stated
            elif label_all_insured:
                mortgage_type = MortgageType.INSURED
        rates.append(
            RawRate(
                lender_slug=ButlerMortgageScraper.LENDER_SLUG,
                lender_name=ButlerMortgageScraper.LENDER_NAME,
                term_months=term_months,
                rate_type=rate_type,
                mortgage_type=mortgage_type,
                rate=rate,
                source_url=source_url,
                scraped_at=scraped_at,
                raw_data={
                    "source": ButlerMortgageScraper.LIVE_SOURCE,
                    "product": title,
                    "extraction_method": "data-form-title",
                },
            )
        )
    return rates


if __name__ == "__main__":
    scraper = ButlerMortgageScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Butler Mortgage:")
        print(f"Source: {scraper.RATE_URL}")
        print("-" * 60)
        if not rates:
            print("  No rates. Butler omitted.")
        for item in sorted(rates, key=lambda row: (row.term_months, row.rate_type.value)):
            term = f"{item.term_months // 12}yr" if item.term_months >= 12 else f"{item.term_months}mo"
            label = item.mortgage_type.value if item.mortgage_type else "unspecified"
            product = (item.raw_data or {}).get("product", "")
            print(f"  {term:<6} {item.rate_type.value:8} {item.rate}%  {label}  {product}")
        print("-" * 60)
    except Exception as exc:
        print(f"Error: {exc}")
        import traceback
        traceback.print_exc()
