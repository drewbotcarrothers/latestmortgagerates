"""Offline tests for Manulife current-rates HTML parsing (no network)."""

from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.scrapers.manulife_scraper import parse_manulife_html
from src.models import MortgageType, RateType


FIXTURE = """
<h3>Special rates</h3>
<div class="product__card--box">
  <h3 class="h3">5-year closed fixed-rate</h3>
  <h4><span class="regular-font">As low as</span> 4.79%<a href="#footnoteasterisk">*</a></h4>
  <p>Manulife One <br />(New clients only)</p>
</div>
<div class="product__card--box">
  <h3 class="h3">5-year closed fixed-rate</h3>
  <h4><span class="regular-font">As low as</span> 4.79%<a href="#footnotedoubleasterisk">**</a></h4>
  <p>Manulife Bank Select Mortgage <br />(New clients only)</p>
</div>
<div class="product__card--box">
  <h3 class="h3">5-year closed fixed-rate</h3>
  <h4><span class="regular-font">As low as</span> 4.59%<a href="#footnotecroix">†</a></h4>
  <p>Manulife Bank Select High Ratio mortgage</p>
</div>
<p id="footnoteasterisk">* The Preferred Manulife One 5-year fixed term sub-account rate is 4.79% and is current as of September 18, 2026. The posted 5-year rate is 5.04%.</p>
<h4>Manulife One</h4>
<table>
  <tr><td>Manulife One Base Rate</td><td><strong>4.95%</strong></td></tr>
  <tr><td>5-year open (Base Rate plus 0%)</td><td><strong>4.95%</strong></td></tr>
  <tr><td>1-year closed</td><td><strong>6.89%</strong></td></tr>
  <tr><td>5-year closed</td><td><strong>5.04%</strong></td></tr>
  <tr><td>Interest rate for positive account balances</td><td><strong>1.00%</strong></td></tr>
</table>
<h4>Manulife Bank Select</h4>
<table>
  <tr><td>Manulife Bank Prime Rate</td><td><strong>4.45%</strong></td></tr>
  <tr><td>5-year closed (Manulife Bank prime + 0.00%)</td><td><strong>4.45%</strong></td></tr>
  <tr><td>5-year open (Manulife Bank prime + 1.00%)</td><td><strong>5.45%</strong></td></tr>
  <tr><td>3-year closed</td><td><strong>4.99%</strong></td></tr>
</table>
<h4>Preferred Rate Mortgage</h4>
<table>
  <tr><td>6-month closed</td><td><strong>7.99%</strong></td></tr>
  <tr><td>1-year closed</td><td><strong>6.89%</strong></td></tr>
</table>
<h2>Bank account rates</h2>
<table>
  <tr><td>1 year</td><td>3.00%</td></tr>
  <tr><td>5 years</td><td>4.00%</td></tr>
</table>
"""


def _parse():
    return parse_manulife_html(
        FIXTURE,
        source_url="https://www.manulifebank.ca/current-rates.html",
        scraped_at=datetime(2026, 9, 23, tzinfo=timezone.utc),
        extraction_method="test",
    )


def test_specials_and_posted_tables():
    rates = _parse()
    assert rates
    assert all((r.raw_data or {}).get("source") == "manulife_live_scrape" for r in rates)
    assert all((r.raw_data or {}).get("effective_date") == "2026-09-18" for r in rates)

    specials = [r for r in rates if (r.raw_data or {}).get("offer") == "special"]
    assert len(specials) == 3
    by_type = {r.mortgage_type: r for r in specials}
    assert by_type[MortgageType.UNINSURED].rate == Decimal("4.79")
    assert by_type[MortgageType.INSURABLE].rate == Decimal("4.79")
    assert by_type[MortgageType.INSURED].rate == Decimal("4.59")
    assert by_type[MortgageType.INSURED].posted_rate == Decimal("5.04")

    published = {
        (r.term_months, r.rate_type, r.mortgage_type): r.rate
        for r in rates
        if (r.raw_data or {}).get("offer") == "published"
    }
    assert published[(12, RateType.FIXED, MortgageType.UNINSURED)] == Decimal("6.89")
    assert published[(36, RateType.FIXED, MortgageType.UNINSURED)] == Decimal("4.99")
    assert published[(60, RateType.FIXED, MortgageType.UNINSURED)] == Decimal("5.04")
    assert published[(60, RateType.VARIABLE, MortgageType.UNINSURED)] == Decimal("4.45")
    assert published[(6, RateType.FIXED, MortgageType.UNINSURED)] == Decimal("7.99")

    # Open terms, base/prime rows, deposit rates, and GIC tables stay out.
    assert Decimal("4.95") not in {r.rate for r in rates}
    assert Decimal("5.45") not in {r.rate for r in rates}
    assert Decimal("1.00") not in {r.rate for r in rates}
    assert Decimal("3.00") not in {r.rate for r in rates}
    assert Decimal("4.00") not in {r.rate for r in rates}

    # July 19 fallback specials are not invented when the page has other numbers.
    assert Decimal("5.74") not in {r.rate for r in rates}
    assert Decimal("4.69") not in {r.rate for r in rates}
    assert Decimal("4.10") not in {r.rate for r in rates}


def test_empty_html():
    scraped_at = datetime(2026, 9, 23, tzinfo=timezone.utc)
    assert parse_manulife_html("", source_url="https://example.com", scraped_at=scraped_at, extraction_method="test") == []
    assert parse_manulife_html(
        "<html><title>Access Denied</title></html>",
        source_url="https://example.com",
        scraped_at=scraped_at,
        extraction_method="test",
    ) == []


if __name__ == "__main__":
    test_specials_and_posted_tables()
    test_empty_html()
    print("ok")
