"""Offline parsers for lenders that were stuck on Sep 14 fallbacks."""

from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent / "src"))

from scrapers.cmls_scraper import parse_cmls_html
from scrapers.coastcapital_scraper import parse_coastcapital_html
from scrapers.equitable_scraper import parse_equitable_html
from scrapers.hometrust_scraper import parse_hometrust_html
from scrapers.simplii_scraper import rates_from_page_and_api
from models import MortgageType, RateType


NOW = datetime(2026, 9, 23, tzinfo=timezone.utc)


COAST_HTML = """
<div class="highlight">
  <div style="font-size: 36px !important;">4.21% <span>APR<sup>1</sup></span></div>
  <p style="font-size: 20px;">5-Year Fixed High-Ratio <span class="tooltip-wrapper">
    <span class="tooltiptext">downpayment of less than 20%.</span></span></p>
</div>
<div class="highlight">
  <div style="font-size: 36px !important;">4.76% <span>APR<sup>1</sup></span></div>
  <p>5-Year Fixed <span class="tooltip-wrapper"><span class="tooltiptext">
    This rate is for those with a downpayment of less than 20%.</span></span></p>
</div>
<div class="highlight">
  <div style="font-size: 36px !important;">3.71% <span>APR</span></div>
  <p>5-Year Variable High-Ratio <span class="tooltip-wrapper">tooltip</span></p>
</div>
<div class="highlight">
  <div style="font-size: 36px !important;">3.86% <span>APR</span></div>
  <p>5-Year Variable <span class="tooltip-wrapper">20% or more</span></p>
</div>
"""

HOME_HTML = """
<script>ssConf("cu", "validate.perfdrive.com, ssc");</script>
<script>
var accEffDate = "2026-09-15";
var classicEffDate = "2026-09-16";
var mortgageRates={
"acc":[4.99, 5.17, 5.12, 4.39, 4.79],
"classic":[5.09,5.24,5.34,5.83,5.88]
};
</script>
"""

CMLS_HTML = """
<script>
var MortgageRates={"Adjustable Rate Mortgage":[{"Term":"10","Rate":"4.45"},{"Term":"8","Rate":4.75},{"Term":"9","Rate":"4.65"}],"Fixed Rate Mortgage":[{"Term":"5","Rate":"4.89"},{"Term":"15","Rate":"7.14"},{"Term":"16","Rate":"5.20"},{"Term":"11","Rate":"4.49"}]};
</script>
<select class="fixed-rate">
  <option value="5">FIXED 5 YEAR MORTGAGES</option>
  <option value="15">FIXED 6 YEAR MORTGAGES</option>
  <option value="16">5 YEAR UNINSURED CLOSED</option>
  <option value="11">5 YEAR RATE ADVANTAGE</option>
</select>
<select class="adjustable-rate">
  <option value="8">ADJUSTABLE 3 YEAR MORTGAGES</option>
  <option value="9">ADJUSTABLE 5 YEAR MORTGAGES</option>
  <option value="10">CMLS PRIME RATE (P)</option>
</select>
<script>$(".Mortgage-LastUpdate").html('September 19th, 2026')</script>
"""

EQUITABLE_HTML = """
<table>
  <tr>
    <th>Mortgage</th><th>6 Month<sup><a href="#two">2</a></sup></th>
    <th>1 Year Fixed</th><th>5 Year Fixed</th><th>5 Year Adjustable</th>
  </tr>
  <tr>
    <td>Standard Mortgage Rate (Closed)</td><td>--</td><td>5.14%</td><td>5.24%</td>
    <td>P + <span>0.14%</span></td>
  </tr>
  <tr>
    <td>Annual Percentage Rate (APR)<sup>1</sup></td><td>--</td><td>6.642%</td><td>5.771%</td><td>5.182%</td>
  </tr>
  <tr>
    <td>EQB Evolution Suite</td><td>7.54%</td><td>6.29%</td><td>4.69% *</td>
    <td>P - 0.85% *</td>
  </tr>
</table>
<table><tr><td>Equitable Prime Rate (P)</td><td>4.45%</td></tr></table>
<table>
  <tr><th></th><th>Reverse Mortgage Flex Rate</th><th>APR</th></tr>
  <tr><td>5 Year Fixed</td><td>6.28%</td><td>6.357%</td></tr>
</table>
"""

SIMPLII_HTML = """
<table>
  <tr>
    <td><span class="body-copy">3-year fixed</span></td>
    <td><span data-rds="%rate[5].FRCM.Published(3_null_null_Years_T,null,18,null)(#O2#)%">RDS%</span></td>
    <td><span data-rds="%rate[5].FRCM.Published(3_null_null_Years_T,null,2,null)(#O2#)%">RDS%</span></td>
  </tr>
  <tr>
    <td><span class="body-copy">5-year variable</span></td>
    <td><span data-rds="%rate[5].5YRVARCLO.Published(5_null_null_Years_T,null,18,null)(#O2#)%">RDS%</span></td>
  </tr>
</table>
"""

SIMPLII_API = {
    "FRCM": "['3_null_null_Years_T', null, 18, '4.74', 'Published', 'Wed Sep 16 00:00:00 EDT 2026' ,null],['3_null_null_Years_T', null, 2, '4.80', 'Published', 'Wed Sep 16 00:00:00 EDT 2026' ,null],",
    "5YRVARCLO": "['5_null_null_Years_T', null, 18, '4.10', 'Published', 'Wed Sep 16 00:00:00 EDT 2026' ,null],",
}


def _by(rates, term, rate_type, mortgage_type):
    matches = [
        rate for rate in rates
        if rate.term_months == term
        and rate.rate_type == rate_type
        and rate.mortgage_type == mortgage_type
    ]
    return matches


def test_coast_cards_use_product_title_not_tooltip():
    rates = parse_coastcapital_html(
        COAST_HTML,
        lender_slug="coastcapital",
        lender_name="Coast Capital Savings",
        source_url="https://www.coastcapitalsavings.com/mortgages",
        scraped_at=NOW,
        extraction_method="safari_tls",
    )
    assert len(rates) == 4
    insured_fixed = _by(rates, 60, RateType.FIXED, MortgageType.INSURED)
    conventional_fixed = _by(rates, 60, RateType.FIXED, MortgageType.UNINSURED)
    assert insured_fixed[0].rate == Decimal("4.21")
    assert conventional_fixed[0].rate == Decimal("4.76")
    assert conventional_fixed[0].raw_data["product"] == "5-Year Fixed"
    assert _by(rates, 60, RateType.VARIABLE, MortgageType.INSURED)[0].rate == Decimal("3.71")
    assert _by(rates, 60, RateType.VARIABLE, MortgageType.UNINSURED)[0].rate == Decimal("3.86")
    assert all(rate.raw_data["source"] == "coastcapital_live_scrape" for rate in rates)


def test_hometrust_inline_grid_and_block_page():
    rates = parse_hometrust_html(
        HOME_HTML,
        lender_slug="hometrust",
        lender_name="Home Trust",
        source_url="https://www.hometrust.ca/mortgages/rates/",
        scraped_at=NOW,
    )
    assert len(rates) == 10
    acc_2 = _by(rates, 24, RateType.FIXED, MortgageType.INSURED)[0]
    classic_5 = _by(rates, 60, RateType.FIXED, MortgageType.UNINSURED)[0]
    assert acc_2.rate == Decimal("5.17")
    assert acc_2.raw_data["effective"] == "2026-09-15"
    assert classic_5.rate == Decimal("5.88")
    assert classic_5.raw_data["effective"] == "2026-09-16"
    assert parse_hometrust_html(
        "<title>Radware Captcha Page</title><script>validate.perfdrive.com</script>",
        lender_slug="hometrust",
        lender_name="Home Trust",
        source_url="https://www.hometrust.ca/mortgages/rates/",
        scraped_at=NOW,
    ) == []


def test_cmls_maps_term_codes_and_skips_prime():
    rates = parse_cmls_html(
        CMLS_HTML,
        lender_slug="cmls",
        lender_name="CMLS Financial",
        source_url="https://www.cmls.ca/what-we-do/cmls-residential/mortgage-rates",
        scraped_at=NOW,
    )
    products = {rate.raw_data["product"]: rate for rate in rates}
    assert "Cmls Prime Rate (P)" not in products
    assert products["Fixed 6 Year Mortgages"].term_months == 72
    assert products["Fixed 6 Year Mortgages"].rate == Decimal("7.14")
    assert products["Fixed 5 Year Mortgages"].mortgage_type == MortgageType.INSURED
    assert products["5 Year Uninsured Closed"].mortgage_type == MortgageType.UNINSURED
    assert products["5 Year Rate Advantage"].rate == Decimal("4.49")
    assert products["Adjustable 3 Year Mortgages"].rate_type == RateType.VARIABLE
    assert products["Adjustable 3 Year Mortgages"].rate == Decimal("4.75")
    assert products["Fixed 5 Year Mortgages"].raw_data["effective"] == "September 19th, 2026"
    assert all(rate.raw_data["source"] == "cmls_live_scrape" for rate in rates)


def test_equitable_table_skips_apr_and_reverse_and_prices_spreads():
    rates = parse_equitable_html(
        EQUITABLE_HTML,
        lender_slug="equitable",
        lender_name="Equitable Bank",
        source_url="https://www.eqbank.ca/residential/mortgage-rates",
        scraped_at=NOW,
    )
    assert all("reverse" not in (rate.raw_data["product"] or "").lower() for rate in rates)
    assert all(rate.rate != Decimal("6.642") for rate in rates)
    standard_1 = [
        rate for rate in rates
        if rate.term_months == 12 and "Standard" in rate.raw_data["product"]
    ][0]
    evolution_5 = [
        rate for rate in rates
        if rate.term_months == 60 and rate.rate_type == RateType.FIXED and "Evolution" in rate.raw_data["product"]
    ][0]
    evolution_arm = [
        rate for rate in rates
        if rate.term_months == 60 and rate.rate_type == RateType.VARIABLE and "Evolution" in rate.raw_data["product"]
    ][0]
    six_month = [rate for rate in rates if rate.term_months == 6][0]
    assert standard_1.rate == Decimal("5.14")
    assert evolution_5.rate == Decimal("4.69")
    assert evolution_5.raw_data["conditional"] is True
    assert evolution_arm.rate == Decimal("3.60")
    assert evolution_arm.raw_data["spread_to_prime"] == "Prime - 0.85%"
    assert six_month.rate == Decimal("7.54")
    assert all(rate.raw_data["source"] == "equitable_live_scrape" for rate in rates)


def test_simplii_uses_category_18_not_apr():
    rates = rates_from_page_and_api(
        SIMPLII_HTML,
        SIMPLII_API,
        lender_slug="simplii",
        lender_name="Simplii Financial",
        source_url="https://www.simplii.com/en/rates/mortgage-rates.html",
        scraped_at=NOW,
    )
    assert len(rates) == 2
    fixed = _by(rates, 36, RateType.FIXED, MortgageType.UNINSURED)[0]
    variable = _by(rates, 60, RateType.VARIABLE, MortgageType.UNINSURED)[0]
    assert fixed.rate == Decimal("4.74")
    assert "Sep 16" in fixed.raw_data["published_at"]
    assert variable.rate == Decimal("4.10")
    assert all(rate.raw_data["source"] == "simplii_live_scrape" for rate in rates)
    assert rates_from_page_and_api(
        "<html>no rows</html>",
        SIMPLII_API,
        lender_slug="simplii",
        lender_name="Simplii Financial",
        source_url="https://www.simplii.com/en/rates/mortgage-rates.html",
        scraped_at=NOW,
    ) == []


if __name__ == "__main__":
    test_coast_cards_use_product_title_not_tooltip()
    test_hometrust_inline_grid_and_block_page()
    test_cmls_maps_term_codes_and_skips_prime()
    test_equitable_table_skips_apr_and_reverse_and_prices_spreads()
    test_simplii_uses_category_18_not_apr()
    print("ok")
