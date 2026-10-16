"""Parser for the RFA prime rate sheet at https://rfa.ca/prime."""

from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent / "src"))

from models import MortgageType, RateType
from scrapers.rfa_scraper import RFAScraper, parse_rfa_html


NOW = datetime(2026, 10, 16, 12, 0, tzinfo=timezone.utc)
FIXTURE = Path(__file__).parent / "fixtures" / "rfa_prime_2026-10-16.html"
URL = "https://rfa.ca/prime"


def _load():
    return parse_rfa_html(
        FIXTURE.read_text(),
        lender_slug="rfa",
        lender_name="RFA Bank",
        source_url=URL,
        scraped_at=NOW,
    )


def _one(rates, term, rate_type, mortgage_type):
    matches = [
        rate
        for rate in rates
        if rate.term_months == term
        and rate.rate_type == rate_type
        and rate.mortgage_type == mortgage_type
    ]
    assert len(matches) == 1, (term, rate_type, mortgage_type, len(matches))
    return matches[0]


def test_prime_sheet_labels_insured_insurable_and_uninsured():
    rates = _load()
    assert len(rates) == 14

    insured_5 = _one(rates, 60, RateType.FIXED, MortgageType.INSURED)
    insurable_5 = _one(rates, 60, RateType.FIXED, MortgageType.INSURABLE)
    uninsured_5 = _one(rates, 60, RateType.FIXED, MortgageType.UNINSURED)
    insured_arm = _one(rates, 60, RateType.VARIABLE, MortgageType.INSURED)
    insurable_arm = _one(rates, 60, RateType.VARIABLE, MortgageType.INSURABLE)
    uninsured_arm = _one(rates, 60, RateType.VARIABLE, MortgageType.UNINSURED)

    assert insured_5.rate == Decimal("4.89")
    assert insurable_5.rate == Decimal("4.89")
    assert insurable_5.raw_data["ltv_tier"] == "≤ 65%"
    assert insurable_5.raw_data["ltv_rates"]["65.01 to 70%"] == "5.04"
    assert insurable_5.raw_data["ltv_rates"]["75.01 to 80%"] == "5.09"
    assert uninsured_5.rate == Decimal("5.29")
    assert uninsured_5.raw_data["ltv_tier"] == "≤ 80%"
    assert uninsured_5.raw_data["section"] == "Uninsurable"
    assert uninsured_5.raw_data["product"] == "5 Year Fixed"

    assert insured_arm.rate == Decimal("3.70")
    assert insured_arm.raw_data["spread_to_prime"] == "Prime - 0.75%"
    assert insured_arm.raw_data["product"] == "5 Year ARM"
    assert insurable_arm.rate == Decimal("3.70")
    assert insurable_arm.raw_data["ltv_rates"]["65.01 to 70%"] == "3.90"
    assert insurable_arm.raw_data["ltv_rates"]["70.01 to 75%"] == "4.00"
    assert uninsured_arm.rate == Decimal("4.10")
    assert uninsured_arm.raw_data["spread_to_prime"] == "Prime - 0.35%"

    assert _one(rates, 36, RateType.FIXED, MortgageType.INSURED).rate == Decimal("4.84")
    assert _one(rates, 12, RateType.FIXED, MortgageType.INSURED).rate == Decimal("5.69")
    assert _one(rates, 24, RateType.FIXED, MortgageType.INSURABLE).rate == Decimal("5.04")
    assert _one(rates, 48, RateType.FIXED, MortgageType.INSURED).rate == Decimal("4.89")

    products = " ".join(rate.raw_data["product"] for rate in rates).lower()
    assert "qc" not in products
    assert "frontline" not in products
    assert "rental" not in products
    assert all(rate.rate != Decimal("4.79") for rate in rates)
    assert all(rate.raw_data["source"] == "rfa_live_scrape" for rate in rates)
    assert all(rate.raw_data["rates_effective"] == "2026-10-06" for rate in rates)
    assert all(rate.raw_data["last_verified"] == "2026-10-16" for rate in rates)
    assert all(rate.raw_data["prime_rate"] == "4.45" for rate in rates)
    assert all(rate.source_url == URL for rate in rates)
    assert "fallback" not in " ".join(rate.raw_data["source"] for rate in rates)


def test_empty_or_unrelated_html_does_not_invent_rates():
    assert parse_rfa_html(
        "<html><title>Just a moment</title></html>",
        lender_slug="rfa",
        lender_name="RFA Bank",
        source_url=URL,
        scraped_at=NOW,
    ) == []
    assert parse_rfa_html(
        "",
        lender_slug="rfa",
        lender_name="RFA Bank",
        source_url=URL,
        scraped_at=NOW,
    ) == []


def test_fallback_stays_flagged_when_live_sheet_is_missing():
    scraper = RFAScraper()
    scraper.scraped_at = NOW
    rates = scraper._get_fallback_rates()
    assert len(rates) == 6
    fixed_5 = _one(rates, 60, RateType.FIXED, MortgageType.UNINSURED)
    assert fixed_5.rate == Decimal("4.29")
    assert fixed_5.raw_data["source"] == "rfa_fallback_2026-09-14"
    assert fixed_5.raw_data["last_verified"] == "2026-07-06"
    assert fixed_5.raw_data["stale"] is True
    assert fixed_5.source_url == URL
    assert all("fallback" in rate.raw_data["source"] for rate in rates)
    assert all(rate.raw_data["stale"] is True for rate in rates)


if __name__ == "__main__":
    test_prime_sheet_labels_insured_insurable_and_uninsured()
    test_empty_or_unrelated_html_does_not_invent_rates()
    test_fallback_stays_flagged_when_live_sheet_is_missing()
    print("ok")
