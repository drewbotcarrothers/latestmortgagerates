"""Offline parsers for lenders that were stuck on Sep 14 fallbacks."""

from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent / "src"))

import ast
import json
from html import escape

from scrapers.cmls_scraper import parse_cmls_html
from scrapers.coastcapital_scraper import parse_coastcapital_html
from scrapers.equitable_scraper import parse_equitable_html
from scrapers.hometrust_scraper import parse_hometrust_html
from scrapers.laurentian_scraper import parse_laurentian_html
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


def _aem_card(headline: str, description: str) -> str:
    payload = json.dumps({"headline": headline, "description": description})
    return f'<hometrust-card aem-data="{escape(payload, quote=True)}"></hometrust-card>'


def test_hometrust_aem_cards_ignore_perfdrive_script():
    accelerator = (
        "<p>Posted rates* (effective 10/19/2026):</p>"
        "<table><tr><th>Mortgage term (insured)</th><th>1 year fixed</th>"
        "<th>2 year fixed</th><th>3 year fixed</th><th>4 year fixed</th><th>5 year fixed</th></tr>"
        "<tr><td>Posted rates</td><td>5.90%</td><td>5.17%</td><td>5.12%</td>"
        "<td>5.44%</td><td>4.99%</td></tr></table>"
    )
    classic = (
        "<p>Posted rates* (effective 10/06/2026):</p>"
        "<table><tr><th>Mortgage term</th><th>1 year fixed</th><th>5 year fixed</th></tr>"
        "<tr><td>Posted rates</td><td>5.29%</td><td>6.51%</td></tr></table>"
    )
    html = (
        '<script src="https://validate.perfdrive.com/bot.js"></script>'
        + _aem_card("Accelerator Mortgage", accelerator)
        + _aem_card("Classic Mortgage", classic)
    )
    rates = parse_hometrust_html(
        html,
        lender_slug="hometrust",
        lender_name="Home Trust",
        source_url="https://www.hometrust.ca/mortgages/rates/",
        scraped_at=NOW,
    )
    assert len(rates) == 7
    acc_5 = _by(rates, 60, RateType.FIXED, MortgageType.INSURED)[0]
    classic_5 = _by(rates, 60, RateType.FIXED, MortgageType.UNINSURED)[0]
    assert acc_5.rate == Decimal("4.99")
    assert acc_5.raw_data["effective"] == "2026-10-19"
    assert acc_5.raw_data["extraction_method"] == "aem_card_table"
    assert classic_5.rate == Decimal("6.51")
    assert classic_5.raw_data["effective"] == "2026-10-06"
    assert parse_hometrust_html(
        '<script src="https://validate.perfdrive.com/captcha.js"></script><p>checking your browser</p>',
        lender_slug="hometrust",
        lender_name="Home Trust",
        source_url="https://www.hometrust.ca/mortgages/rates/",
        scraped_at=NOW,
    ) == []


def _rich_text_table(rows):
    def cell(text, header=False):
        return {
            "nodeType": "table-header-cell" if header else "table-cell",
            "data": {},
            "content": [{
                "nodeType": "paragraph",
                "data": {},
                "content": [{"nodeType": "text", "value": text, "marks": [], "data": {}}],
            }],
        }

    return {
        "nodeType": "table",
        "data": {},
        "content": [
            {
                "nodeType": "table-row",
                "data": {},
                "content": [cell(text, header=(index == 0)) for text in row],
            }
            for index, row in enumerate(rows)
        ],
    }


def _paragraph(text):
    return {
        "nodeType": "paragraph",
        "data": {},
        "content": [{"nodeType": "text", "value": text, "marks": [], "data": {}}],
    }


def _laurentian_document(modules):
    payload = {"props": {"pageProps": {"modules": modules}}, "page": "/en/personal/rates/mortgages"}
    return '<script id="__NEXT_DATA__" type="application/json">' + json.dumps(payload) + "</script>"


def test_laurentian_reads_embedded_rate_grids_not_august_hardcode():
    html = _laurentian_document([
        {
            "__typename": "AccountFeaturesTable",
            "header": "Fixed-rate mortgage.",
            "table": {"json": {"content": [
                _paragraph("Closed (1 to 4 units)"),
                _rich_text_table([
                    ["Term", "Fixed rate (%)"],
                    ["5 years", "6.290"],
                    ["Promotional rate - 5 years", "5.190"],
                    ["3 years", "6.090"],
                ]),
            ]}},
        },
        {
            "__typename": "AccountFeaturesTable",
            "header": "Variable-rate mortgage.",
            "table": {"json": {"content": [
                _rich_text_table([
                    ["Type", "Details", "Convertible closed term", "Variable rate (%)"],
                    ["Variable-rate mortgage - 1 to 4 units", "Prime rate -0.50%", "5 years", "4.050"],
                ]),
            ]}},
        },
        {
            "__typename": "AccountFeaturesTable",
            "header": "High-ratio fixed rate mortgage (APR).",
            "table": {"json": {"content": [
                _rich_text_table([
                    ["Type", "Fixed rate (%)"],
                    ["5-year closed term", "4.29"],
                ]),
            ]}},
        },
        {
            "__typename": "AccountFeaturesTable",
            "header": "Equity line of credit.",
            "table": {"json": {"content": [
                _rich_text_table([
                    ["Type", "Minimum rate (%)"],
                    ["Equity line of credit (1 to 4 units)", "4.950"],
                ]),
            ]}},
        },
    ])
    rates = parse_laurentian_html(
        html,
        lender_slug="laurentian",
        lender_name="Laurentian Bank",
        source_url="https://www.laurentianbank.ca/en/personal/rates/mortgages",
        scraped_at=NOW,
    )
    promo = [
        rate for rate in rates
        if rate.term_months == 60 and rate.rate_type == RateType.FIXED and rate.mortgage_type == MortgageType.UNINSURED
        and rate.raw_data["is_promotional"]
    ]
    posted = [
        rate for rate in rates
        if rate.term_months == 60 and rate.rate_type == RateType.FIXED and rate.mortgage_type == MortgageType.UNINSURED
        and not rate.raw_data["is_promotional"]
    ]
    assert len(promo) == 1 and promo[0].rate == Decimal("5.190")
    assert len(posted) == 1 and posted[0].rate == Decimal("6.290")
    assert promo[0].rate != Decimal("4.79")
    assert _by(rates, 60, RateType.VARIABLE, MortgageType.UNINSURED)[0].rate == Decimal("4.050")
    assert _by(rates, 60, RateType.FIXED, MortgageType.INSURED)[0].rate == Decimal("4.29")
    assert all(rate.raw_data["source"] == "laurentian_live_scrape" for rate in rates)
    assert all("equity" not in (rate.raw_data.get("product") or "").lower() for rate in rates)


def test_laurentian_text_grid_without_tables_and_error_page():
    html = """
    <h2>Fixed-rate mortgage.</h2>
    <p>Closed (1 to 4 units)</p>
    <div>5 years</div><div>6.290</div>
    <div>Promotional rate - 5 years</div><div>5.190</div>
    <h2>High-ratio fixed rate mortgage (APR).</h2>
    <div>5-year closed term</div><div>4.290</div>
    """
    rates = parse_laurentian_html(
        html,
        lender_slug="laurentian",
        lender_name="Laurentian Bank",
        source_url="https://www.laurentianbank.ca/en/personal/rates/mortgages",
        scraped_at=NOW,
    )
    uninsured = _by(rates, 60, RateType.FIXED, MortgageType.UNINSURED)
    assert {rate.rate for rate in uninsured} == {Decimal("6.290"), Decimal("5.190")}
    assert [rate for rate in uninsured if rate.raw_data["is_promotional"]][0].rate == Decimal("5.190")
    assert _by(rates, 60, RateType.FIXED, MortgageType.INSURED)[0].rate == Decimal("4.290")
    error = """
    <title>Page not found | Laurentian Bank</title>
    <h1>Where did it go?</h1>
    <script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"modules":[{"__typename":"ModuleErrorInfo","header":"Where did it go?"}]}}, "page":"/error"}</script>
    <p>Personal and SME banking activities have exited.</p>
    """
    assert parse_laurentian_html(
        error,
        lender_slug="laurentian",
        lender_name="Laurentian Bank",
        source_url="https://www.laurentianbank.ca/en/personal/rates/mortgages",
        scraped_at=NOW,
    ) == []


def test_backfill_does_not_shadow_json_module():
    source = Path(__file__).with_name("test_all_lenders_v2.py").read_text()
    tree = ast.parse(source)
    for node in tree.body:
        if isinstance(node, ast.FunctionDef) and node.name == "scrape_all_lenders":
            for child in ast.walk(node):
                if isinstance(child, ast.Import):
                    assert "json" not in [alias.name for alias in child.names]


if __name__ == "__main__":
    test_coast_cards_use_product_title_not_tooltip()
    test_hometrust_inline_grid_and_block_page()
    test_hometrust_aem_cards_ignore_perfdrive_script()
    test_cmls_maps_term_codes_and_skips_prime()
    test_equitable_table_skips_apr_and_reverse_and_prices_spreads()
    test_simplii_uses_category_18_not_apr()
    test_laurentian_reads_embedded_rate_grids_not_august_hardcode()
    test_laurentian_text_grid_without_tables_and_error_page()
    test_backfill_does_not_shadow_json_module()
    print("ok")
