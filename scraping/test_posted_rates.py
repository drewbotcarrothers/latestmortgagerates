"""Fixture tests for Big Five posted shelves. No network."""

import json
import sys
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "src"))

from models import MortgageType, RateType, RawRate
from scrapers.bmo_scraper import build_bmo_rates
from scrapers.rbc_scraper import build_rbc_rates
from scrapers.scotiabank_scraper import build_scotia_rates
from deduplicator import RateDeduplicator
from preserve_posted import preserve_posted_rates

FIXTURES = Path(__file__).parent / "fixtures"
SCRAPED_AT = datetime(2026, 10, 23, tzinfo=timezone.utc)


def _load(name: str):
    return json.loads((FIXTURES / name).read_text())


def _one(rates, term, rate_type, mortgage_type=MortgageType.UNINSURED):
    matches = [
        rate
        for rate in rates
        if rate.term_months == term
        and rate.rate_type == rate_type
        and rate.mortgage_type == mortgage_type
    ]
    assert len(matches) == 1, f"{term} {rate_type} {mortgage_type}: {len(matches)} rows"
    return matches[0]


def test_rbc_fixture_attaches_posted_shelves():
    html = (FIXTURES / "rbc_mortgage_rates_2026-10-23.html").read_text()
    rates = build_rbc_rates(
        html,
        SCRAPED_AT,
        "https://www.rbcroyalbank.com/mortgages/mortgage-rates.html",
        "static_html",
    )
    fixed_3 = _one(rates, 36, RateType.FIXED)
    assert fixed_3.rate == Decimal("4.990")
    assert fixed_3.posted_rate == Decimal("6.250")
    assert fixed_3.raw_data["section"] == "special"

    fixed_5 = _one(rates, 60, RateType.FIXED)
    assert fixed_5.rate == Decimal("5.140")
    assert fixed_5.posted_rate == Decimal("6.190")

    variable = _one(rates, 60, RateType.VARIABLE)
    assert variable.rate == Decimal("4.150")
    assert variable.posted_rate == Decimal("4.480")

    insured = _one(rates, 60, RateType.FIXED, MortgageType.INSURED)
    assert insured.rate == Decimal("4.840")
    assert insured.posted_rate == Decimal("6.190")

    ten_year = _one(rates, 120, RateType.FIXED)
    assert ten_year.rate == Decimal("6.900")
    assert ten_year.posted_rate == Decimal("6.900")
    assert ten_year.raw_data["section"] == "posted"

    assert all(not (rate.raw_data or {}).get("is_open") for rate in rates)
    assert not any(rate.term_months == 300 for rate in rates)


def test_bmo_fixture_attaches_posted_shelves():
    rates = build_bmo_rates(
        _load("bmo_specials_2026-10-23.json"),
        _load("bmo_posted_2026-10-23.json"),
        SCRAPED_AT,
        "https://www.bmo.com/en-ca/main/personal/mortgages/mortgage-rates/",
        "public_data_api",
    )
    fixed_3 = _one(rates, 36, RateType.FIXED)
    assert fixed_3.rate == Decimal("4.94")
    assert fixed_3.posted_rate == Decimal("6.050")

    fixed_5 = _one(rates, 60, RateType.FIXED)
    assert fixed_5.rate == Decimal("5.14")
    assert fixed_5.posted_rate == Decimal("6.090")

    insured = _one(rates, 60, RateType.FIXED, MortgageType.INSURED)
    assert insured.rate == Decimal("4.99")
    assert insured.posted_rate == Decimal("6.090")

    variable = _one(rates, 60, RateType.VARIABLE)
    assert variable.rate == Decimal("4.10")
    assert variable.posted_rate == Decimal("4.450")

    one_year = _one(rates, 12, RateType.FIXED)
    assert one_year.rate == Decimal("5.490")
    assert one_year.posted_rate == Decimal("5.490")
    assert one_year.raw_data["section"] == "posted"
    assert len([rate for rate in rates if rate.term_months == 36 and rate.rate_type == RateType.FIXED]) == 1


def test_scotia_fixture_uses_public_posted_column():
    rates = build_scotia_rates(
        _load("scotia_posted_2026-10-23.json"),
        _load("scotia_promo_2026-10-23.json"),
        SCRAPED_AT,
        "https://www.scotiabank.com/ca/en/personal/rates-prices/mortgages-rates.html",
    )
    fixed_5 = _one(rates, 60, RateType.FIXED)
    assert fixed_5.rate == Decimal("4.9")
    assert fixed_5.posted_rate == Decimal("6.19")
    assert fixed_5.raw_data["section"] == "special"

    fixed_3 = _one(rates, 36, RateType.FIXED)
    assert fixed_3.rate == Decimal("6.05")
    assert fixed_3.posted_rate == Decimal("6.05")

    variable = _one(rates, 36, RateType.VARIABLE)
    assert variable.rate == Decimal("5.95")
    assert variable.posted_rate == Decimal("5.95")
    assert not any(
        rate.rate == Decimal("4.45") and rate.rate_type == RateType.VARIABLE for rate in rates
    )
    assert not any(rate.term_months == 60 and rate.rate_type == RateType.VARIABLE for rate in rates)
    assert not any((rate.raw_data or {}).get("is_open") for rate in rates)


def _raw(slug, term, rate_type, rate, **kwargs):
    raw_data = kwargs.pop("raw_data", {})
    return RawRate(
        lender_slug=slug,
        lender_name=slug,
        term_months=term,
        rate_type=rate_type,
        mortgage_type=kwargs.pop("mortgage_type", MortgageType.UNINSURED),
        rate=Decimal(rate),
        posted_rate=kwargs.pop("posted_rate", None),
        source_url="https://example.test/rates",
        scraped_at=SCRAPED_AT,
        raw_data=raw_data,
    )


def test_deduper_keeps_shelf_and_copies_it_onto_the_special():
    deduper = RateDeduplicator()
    rows = [
        _raw("rbc", 60, RateType.FIXED, "5.14", raw_data={"section": "special", "is_open": False}),
        _raw(
            "rbc",
            60,
            RateType.FIXED,
            "6.19",
            raw_data={"section": "posted", "product": "5 Year Posted", "is_open": False},
        ),
        _raw(
            "scotiabank",
            36,
            RateType.FIXED,
            "6.05",
            posted_rate=Decimal("6.05"),
            raw_data={"section": "posted", "is_open": False},
        ),
        _raw(
            "scotiabank",
            84,
            RateType.FIXED,
            "6.40",
            posted_rate=Decimal("6.40"),
            raw_data={"section": "posted", "is_open": False},
        ),
        _raw(
            "rbc",
            12,
            RateType.FIXED,
            "9.95",
            raw_data={"section": "posted", "is_open": True, "product": "1 Year Open"},
        ),
    ]
    clean, _stats = deduper.deduplicate(rows)
    five = _one(clean, 60, RateType.FIXED)
    assert five.lender_slug == "rbc"
    assert five.rate == Decimal("5.14")
    assert five.posted_rate == Decimal("6.19")
    assert _one(clean, 36, RateType.FIXED).posted_rate == Decimal("6.05")
    assert _one(clean, 84, RateType.FIXED).posted_rate == Decimal("6.40")
    assert not any((rate.raw_data or {}).get("is_open") for rate in clean)


def test_preserve_fills_a_blank_posted_rate_only():
    fresh = [
        _raw("td", 60, RateType.FIXED, "5.39"),
        _raw("td", 36, RateType.FIXED, "4.80", posted_rate=Decimal("5.99")),
    ]
    previous = [
        {
            "lender_slug": "td",
            "term_months": 60,
            "rate_type": "fixed",
            "mortgage_type": "uninsured",
            "posted_rate": 6.14,
        },
        {
            "lender_slug": "td",
            "term_months": 36,
            "rate_type": "fixed",
            "mortgage_type": "uninsured",
            "posted_rate": 1.11,
        },
    ]
    kept = preserve_posted_rates(fresh, previous)
    assert kept == 1
    assert fresh[0].posted_rate == Decimal("6.14")
    assert fresh[1].posted_rate == Decimal("5.99")


if __name__ == "__main__":
    test_rbc_fixture_attaches_posted_shelves()
    test_bmo_fixture_attaches_posted_shelves()
    test_scotia_fixture_uses_public_posted_column()
    test_deduper_keeps_shelf_and_copies_it_onto_the_special()
    test_preserve_fills_a_blank_posted_rate_only()
    print("ok")
