"""Keep the previous rate file's rows when a scraper returns nothing.

A failed scrape must not delete that lender. The November 26, 2026 run
constructed these rows with RawRate without importing it, so every RBC row
raised NameError and was dropped.
"""

from datetime import datetime
from decimal import Decimal
from typing import Iterable, List, Optional, Set

try:
    from loguru import logger
except ImportError:  # pragma: no cover
    import logging
    logger = logging.getLogger(__name__)

try:
    from src.models import MortgageType, RateType, RawRate
except ImportError:
    from models import MortgageType, RateType, RawRate


def previous_row_is_carryable(item) -> bool:
    """Keep a previous live row. Drop the Laurentian August 2026 hardcode."""
    raw = item.get("raw_data") if isinstance(item, dict) else None
    source = ""
    if isinstance(raw, dict):
        source = str(raw.get("source") or "")
    if source == "laurentian_fallback":
        return False
    return True


def _as_decimal(value) -> Optional[Decimal]:
    if value is None or value == "":
        return None
    return Decimal(str(value))


def previous_item_to_raw_rate(item: dict) -> RawRate:
    """Rebuild one stored row without changing its scrape time or source."""
    raw = dict(item.get("raw_data") or {})
    raw["stale"] = True
    raw["carried_forward"] = True
    raw["carry_forward_note"] = (
        "Rate carried forward because the live scrape returned no rates"
    )
    mortgage_type = item.get("mortgage_type")
    scraped_at = item.get("scraped_at")
    return RawRate(
        lender_slug=item["lender_slug"],
        lender_name=item.get("lender_name") or item["lender_slug"],
        term_months=int(item["term_months"]),
        rate_type=RateType(item["rate_type"]),
        mortgage_type=MortgageType(mortgage_type) if mortgage_type else None,
        rate=_as_decimal(item["rate"]),
        posted_rate=_as_decimal(item.get("posted_rate")),
        source_url=item.get("source_url") or "",
        scraped_at=datetime.fromisoformat(scraped_at) if scraped_at else datetime.utcnow(),
        raw_data=raw,
    )


def carry_forward_previous_rates(
    previous_items: Iterable,
    failed_slugs: Set[str],
    lenders_with_new_rates: Optional[Set[str]] = None,
) -> List[RawRate]:
    """Return prior rows for lenders whose scraper produced nothing.

    Lenders that already have new rows are left alone. Rows that cannot be
    converted are skipped individually so one bad object cannot drop the rest.
    """
    already = lenders_with_new_rates or set()
    carried: List[RawRate] = []
    for item in previous_items:
        if not isinstance(item, dict):
            continue
        slug = item.get("lender_slug")
        if slug not in failed_slugs or slug in already:
            continue
        if not previous_row_is_carryable(item):
            continue
        try:
            carried.append(previous_item_to_raw_rate(item))
        except Exception as exc:
            logger.warning(f"Failed to convert previous rate for {slug}: {exc}")
    return carried
