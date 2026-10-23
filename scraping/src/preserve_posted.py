"""Copy a previous posted_rate onto a new row when the new scrape left it blank."""

from decimal import Decimal, InvalidOperation
from typing import Iterable, List

from loguru import logger

from models import RawRate


def _positive(value) -> Decimal | None:
    if value in (None, "", 0, "0"):
        return None
    try:
        rate = Decimal(str(value))
    except (InvalidOperation, ValueError, TypeError):
        return None
    if rate <= 0:
        return None
    return rate


def preserve_posted_rates(new_rates: List[RawRate], previous_items: Iterable[dict]) -> int:
    """
    Keep an existing posted_rate when the fresh row for the same
    lender, term, rate type, and mortgage type has none.

    Does not invent a rate and does not add a term the new scrape omitted.
    """
    previous = {}
    for item in previous_items:
        if not isinstance(item, dict):
            continue
        posted = _positive(item.get("posted_rate"))
        if posted is None:
            continue
        key = (
            item.get("lender_slug"),
            item.get("term_months"),
            item.get("rate_type"),
            item.get("mortgage_type") or "unspecified",
        )
        previous[key] = posted

    kept = 0
    for rate in new_rates:
        if _positive(rate.posted_rate) is not None:
            continue
        key = (
            rate.lender_slug,
            rate.term_months,
            rate.rate_type.value,
            rate.mortgage_type.value if rate.mortgage_type else "unspecified",
        )
        old = previous.get(key)
        if old is None:
            continue
        rate.posted_rate = old
        kept += 1
        logger.warning(
            f"Kept existing posted rate for {key[0]} {key[1]}mo {key[2]} "
            f"{key[3]}: {old}%"
        )
    if kept:
        logger.warning(f"Kept {kept} existing posted rate(s) instead of writing a blank")
    return kept
