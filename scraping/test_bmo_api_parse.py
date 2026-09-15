"""Offline tests for BMO public-data JSON parsing (no network)."""

from decimal import Decimal
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.scrapers.bmo_scraper import parse_posted_payload, parse_specials_payload
from src.models import MortgageType, RateType


SPECIALS_FIXTURE = {
    "fixed3YearClosedSpecial": 4.64,
    "fixed3YearClosedSpecialApr": 4.67,
    "smartFixed5YearClosedSpecial": 4.84,
    "smartFixed5YearClosedHighRatioSpecial": 4.74,
    "variable5YearClosedSpecial": 4.1,
    "variable5YearClosedSpecialOver25": 4.2,
    "ignoredAprOnly": 9.99,
}

POSTED_FIXTURE = {
    "mortgageRates": {
        "fixed": {
            "1YearClosed": {"en": "1 year (closed)", "value": "5.490", "term_months": "12"},
            "2YearClosed": {"en": "2 year (closed)", "value": "4.890", "term_months": "24"},
            "3YearClosed": {"en": "3 year (closed)", "value": "6.050", "term_months": "36"},
            "5YearClosed": {"en": "5 year (closed)", "value": "6.090", "term_months": "60"},
            "6YearClosed": {"en": "6 year (closed)", "value": "6.290", "term_months": "72"},
            "1YearOpen": {"en": "1 year (open)", "value": "9.950", "term_months": "12"},
            "18YearOpen": {"en": "18 year (open)", "value": "8.500", "term_months": "216"},
        },
        "variable": {
            "5YearClosed": {"en": "5 year (closed)", "value": "4.450", "term_months": "60"},
            "12VariableLimited": {"en": "012 VARIABLE LIMITED", "value": "2.750", "term_months": "12"},
        },
    },
    "specialMortgageRates": {"fixed": {"36Month": "0.000", "60Month": "5.290"}},
}


def test_parse_specials_maps_page_cards():
    rows = parse_specials_payload(SPECIALS_FIXTURE)
    by_key = {k: (rate, meta) for k, rate, meta in rows}
    assert set(by_key) == {
        "fixed3YearClosedSpecial",
        "smartFixed5YearClosedSpecial",
        "smartFixed5YearClosedHighRatioSpecial",
        "variable5YearClosedSpecial",
    }
    assert by_key["fixed3YearClosedSpecial"][0] == Decimal("4.64")
    assert by_key["smartFixed5YearClosedHighRatioSpecial"][1]["mortgage_type"] == MortgageType.INSURED
    assert by_key["variable5YearClosedSpecial"][0] == Decimal("4.1")
    # APR-only and over-25 keys are not advertised-card specials
    assert "fixed3YearClosedSpecialApr" not in by_key
    assert "variable5YearClosedSpecialOver25" not in by_key


def test_parse_posted_skips_open_and_junk():
    rows = parse_posted_payload(POSTED_FIXTURE)
    keys = {k for k, *_ in rows}
    assert "1YearOpen" not in keys
    assert "18YearOpen" not in keys
    assert "12VariableLimited" not in keys
    assert "1YearClosed" in keys
    assert "5YearClosed" in keys
    variable = [r for r in rows if r[2] == RateType.VARIABLE]
    assert len(variable) == 1
    assert variable[0][3] == Decimal("4.450")


def test_empty_payloads():
    assert parse_specials_payload(None) == []
    assert parse_specials_payload({}) == []
    assert parse_posted_payload({"mortgageRates": {}}) == []


if __name__ == "__main__":
    test_parse_specials_maps_page_cards()
    test_parse_posted_skips_open_and_junk()
    test_empty_payloads()
    print("ok")
