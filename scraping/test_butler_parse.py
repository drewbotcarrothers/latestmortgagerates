"""Offline tests for Butler Mortgage rate-table HTML (no network)."""

from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.scrapers.butler_scraper import (
    blanket_high_ratio,
    explicit_product_types,
    mortgage_type_from_context,
    parse_butler_html,
)
from src.models import MortgageType, RateType


FIXTURE_PATH = Path(__file__).parent / "fixtures" / "butler_low_mortgage_rates.html"
SOURCE = "https://www.butlermortgage.ca/low-mortgage-rates/"
SCRAPED_AT = datetime(2026, 9, 27, tzinfo=timezone.utc)

# Rates published in the 2026-09-27 capture of the live rate table.
EXPECTED = {
    (6, RateType.FIXED): Decimal("3.89"),
    (24, RateType.FIXED): Decimal("4.09"),
    (36, RateType.FIXED): Decimal("4.19"),
    (48, RateType.FIXED): Decimal("4.29"),
    (60, RateType.FIXED): Decimal("4.14"),
    (84, RateType.FIXED): Decimal("5.29"),
    (120, RateType.FIXED): Decimal("5.39"),
    (36, RateType.VARIABLE): Decimal("3.50"),
    (60, RateType.VARIABLE): Decimal("3.25"),
}


def _parse(html: str):
    return parse_butler_html(html, source_url=SOURCE, scraped_at=SCRAPED_AT)


def _by_key(rates):
    return {(rate.term_months, rate.rate_type): rate for rate in rates}


def test_fixture_splits_fixed_and_variable():
    html = FIXTURE_PATH.read_text(encoding="utf-8")
    rates = _parse(html)
    parsed = _by_key(rates)

    assert set(parsed) == set(EXPECTED)
    for key, expected_rate in EXPECTED.items():
        assert parsed[key].rate == expected_rate
        assert parsed[key].mortgage_type is None
        assert parsed[key].source_url == SOURCE
        assert (parsed[key].raw_data or {}).get("source") == "butlermortgage_live_scrape"

    # The old parser copied each fixed rate onto the variable row.
    assert parsed[(60, RateType.FIXED)].rate != parsed[(60, RateType.VARIABLE)].rate
    assert parsed[(36, RateType.FIXED)].rate != parsed[(36, RateType.VARIABLE)].rate

    # Empty variable cells are comments (<!-- 3.19% -->), not published rates.
    variable_terms = {term for term, kind in parsed if kind == RateType.VARIABLE}
    assert variable_terms == {36, 60}
    assert Decimal("3.19") not in {rate.rate for rate in rates}

    # Calculator modal samples and the HELOC row are not term mortgages.
    assert Decimal("1.99") not in {rate.rate for rate in rates}
    assert Decimal("2.09") not in {rate.rate for rate in rates}
    assert Decimal("2.24") not in {rate.rate for rate in rates}
    assert Decimal("2.34") not in {rate.rate for rate in rates}
    assert Decimal("4.45") not in {rate.rate for rate in rates}
    assert all("HELOC" not in str((rate.raw_data or {}).get("product")) for rate in rates)


def test_uninsured_label_is_not_read_as_insured():
    assert mortgage_type_from_context("5-Year Uninsured") == MortgageType.UNINSURED
    assert mortgage_type_from_context("conventional 5-year") == MortgageType.UNINSURED
    assert mortgage_type_from_context("5-Year Insured") == MortgageType.INSURED
    assert mortgage_type_from_context("High-Ratio") == MortgageType.INSURED
    assert mortgage_type_from_context("high ratio") == MortgageType.INSURED
    assert mortgage_type_from_context("Fixed Mortgage Rates") is None
    # Both labels in one heading: don't guess.
    assert mortgage_type_from_context("Insured and Uninsured rates") is None

    html = """
    <h3>5-Year Uninsured Fixed</h3>
    <button data-rate="4.20" data-form-title="5-YEAR/FIXED">Inquire</button>
    <h3>3-Year High-Ratio Variable</h3>
    <button data-rate="3.40" data-form-title="3-YEAR/VARIABLE">Inquire</button>
    <h3>Variable Mortgage Rates</h3>
    <div><!-- <button data-rate="3.19" data-form-title="6-MTH/VARIABLE">Inquire</button> --></div>
    <button data-rate="3.10" data-form-title="5-YEAR/VARIABLE">Inquire</button>
    """
    parsed = _by_key(_parse(html))
    assert parsed[(60, RateType.FIXED)].rate == Decimal("4.20")
    assert parsed[(60, RateType.FIXED)].mortgage_type == MortgageType.UNINSURED
    assert parsed[(36, RateType.VARIABLE)].mortgage_type == MortgageType.INSURED
    assert parsed[(60, RateType.VARIABLE)].mortgage_type is None
    assert (6, RateType.VARIABLE) not in parsed
    assert Decimal("3.19") not in {rate.rate for rate in parsed.values()}


# Homepage featured cards, captured 2026-10-01. The rate table does not repeat
# these labels. "View All Rates" on this block links to the rate table.
FEATURED = """
<h2>Our Featured Rates in Toronto and Ontario</h2>
<article>
  <small>2-Year Fixed Rate <span>Mortgage</span></small>
  <div class="rate">4.14%</div>
  <button data-rate="4.14" data-form-title="2-YEAR/FIXED">Inquire</button>
</article>
<article>
  <small>3-Year Fixed Rate <span>High-Ratio Mortgage</span></small>
  <div class="rate">4.19%</div>
  <button data-rate="4.19" data-form-title="3-YEAR/FIXED">Inquire</button>
</article>
<article>
  <small>5-Year Fixed Rate <span> High-Ratio Mortgage</span></small>
  <div class="rate">4.29%</div>
  <button data-rate="4.29" data-form-title="5-YEAR/FIXED">Inquire</button>
</article>
<article>
  <small>5-Year VRM Rate <span>High-Ratio Mortgage</span></small>
  <div class="rate">3.25%</div>
  <button data-rate="3.25" data-form-title="5-YEAR/VARIABLE">Inquire</button>
</article>
"""


def test_featured_high_ratio_labels_only_those_products():
    stated = explicit_product_types(FEATURED)
    assert stated[(36, RateType.FIXED)] == MortgageType.INSURED
    assert stated[(60, RateType.FIXED)] == MortgageType.INSURED
    assert stated[(60, RateType.VARIABLE)] == MortgageType.INSURED
    assert (24, RateType.FIXED) not in stated
    assert blanket_high_ratio(FEATURED) is False

    html = FIXTURE_PATH.read_text(encoding="utf-8")
    parsed = _by_key(parse_butler_html(
        html,
        source_url=SOURCE,
        scraped_at=SCRAPED_AT,
        qualification_html=FEATURED,
    ))
    # The fixture's percentages differ from the featured cards. The label
    # follows the product, not the number.
    assert parsed[(36, RateType.FIXED)].mortgage_type == MortgageType.INSURED
    assert parsed[(60, RateType.FIXED)].mortgage_type == MortgageType.INSURED
    assert parsed[(60, RateType.VARIABLE)].mortgage_type == MortgageType.INSURED
    # 2-year is published as "Mortgage", not high-ratio. Other table rows
    # are not named on the featured list.
    assert parsed[(24, RateType.FIXED)].mortgage_type is None
    assert parsed[(6, RateType.FIXED)].mortgage_type is None
    assert parsed[(48, RateType.FIXED)].mortgage_type is None
    assert parsed[(84, RateType.FIXED)].mortgage_type is None
    assert parsed[(120, RateType.FIXED)].mortgage_type is None
    assert parsed[(36, RateType.VARIABLE)].mortgage_type is None
    assert parsed[(60, RateType.FIXED)].rate == Decimal("4.14")
    assert parsed[(60, RateType.VARIABLE)].rate == Decimal("3.25")


def test_blanket_high_ratio_sentence_labels_every_term():
    html = """
    <h2>Mortgage Rates</h2>
    <p>Our best rates are for high-ratio mortgages (less than 20% down).</p>
    <button data-rate="4.14" data-form-title="2-YEAR/FIXED">Inquire</button>
    <button data-rate="4.29" data-form-title="5-YEAR/FIXED">Inquire</button>
    <button data-rate="3.25" data-form-title="5-YEAR/VARIABLE">Inquire</button>
    """
    assert blanket_high_ratio(html) is True
    parsed = _by_key(_parse(html))
    assert parsed[(24, RateType.FIXED)].mortgage_type == MortgageType.INSURED
    assert parsed[(60, RateType.FIXED)].mortgage_type == MortgageType.INSURED
    assert parsed[(60, RateType.VARIABLE)].mortgage_type == MortgageType.INSURED


def test_row_heading_wins_over_featured_label():
    html = """
    <h3>5-Year Uninsured Fixed</h3>
    <button data-rate="4.20" data-form-title="5-YEAR/FIXED">Inquire</button>
    """
    parsed = _by_key(parse_butler_html(
        html,
        source_url=SOURCE,
        scraped_at=SCRAPED_AT,
        qualification_html=FEATURED,
    ))
    assert parsed[(60, RateType.FIXED)].mortgage_type == MortgageType.UNINSURED


def test_empty_or_unusable_html_returns_nothing():
    assert _parse("") == []
    assert _parse("   ") == []
    assert _parse("<html><title>Access Denied</title><p>4.14%</p></html>") == []
    assert _parse("<p class='rates-head'>1.99%</p><p>5-YEAR</p>") == []


if __name__ == "__main__":
    test_fixture_splits_fixed_and_variable()
    test_uninsured_label_is_not_read_as_insured()
    test_featured_high_ratio_labels_only_those_products()
    test_blanket_high_ratio_sentence_labels_every_term()
    test_row_heading_wins_over_featured_label()
    test_empty_or_unusable_html_returns_nothing()
    print("ok")
