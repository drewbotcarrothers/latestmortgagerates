"""Butler's advertised rates are high-ratio (default-insured).

The rate table does not print insured or uninsured. Rows that do not
already say insured or uninsured are stored as insured. The scraper and
the daily clean step both call this so a null Butler row cannot survive
into data/rates.json.
"""

from typing import List

from models import MortgageType, RawRate

BUTLER_SLUG = "butlermortgage"


def label_unlabeled_butler_rates_insured(rates: List[RawRate]) -> List[RawRate]:
    """Mark unlabeled Butler rows as insured. Explicit labels and other lenders stay."""
    for rate in rates:
        if rate.lender_slug != BUTLER_SLUG:
            continue
        if rate.mortgage_type is None:
            rate.mortgage_type = MortgageType.INSURED
    return rates
