"""A failed RBC or Laurentian scrape must keep the previous rows."""

import ast
import json
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "src"))

from carry_forward import carry_forward_previous_rates
from deduplicator import RateDeduplicator

FIXTURES = Path(__file__).parent / "fixtures"
RBC_SCRAPED_AT = datetime(2026, 11, 26, 19, 54, 40, 670087)


def _laurentian(source: str, rate: str = "5.09") -> dict:
    return {
        "lender_name": "Laurentian Bank",
        "lender_slug": "laurentian",
        "term_months": 60,
        "rate_type": "fixed",
        "mortgage_type": "uninsured",
        "rate": rate,
        "posted_rate": 6.14,
        "source_url": "https://www.laurentianbank.ca/en/personal/mortgages.html",
        "scraped_at": "2026-11-20T15:04:00",
        "raw_data": {
            "source": source,
            "section": "special",
            "product": "5 Year Fixed",
        },
    }


def test_failed_rbc_and_laurentian_scrapes_keep_previous_rows(tmp_path=None):
    previous = json.loads((FIXTURES / "rbc_rates_2026-11-26.json").read_text())
    assert len(previous) == 11
    previous.append(_laurentian("laurentian_live_scrape"))
    previous.append(_laurentian("laurentian_fallback", rate="4.79"))
    previous.append({
        "lender_name": "TD Bank",
        "lender_slug": "td",
        "term_months": 60,
        "rate_type": "fixed",
        "mortgage_type": "uninsured",
        "rate": 5.29,
        "posted_rate": 6.14,
        "source_url": "https://www.td.com/ca/en/personal-banking/products/mortgages/mortgage-rates",
        "scraped_at": "2026-11-27T10:51:25.768070+00:00",
        "raw_data": {"source": "td_live_scrape", "section": "special"},
    })

    carried = carry_forward_previous_rates(previous, {"rbc", "laurentian"}, set())
    rbc = [rate for rate in carried if rate.lender_slug == "rbc"]
    laurentian = [rate for rate in carried if rate.lender_slug == "laurentian"]
    assert len(rbc) == 11
    assert len(laurentian) == 1
    assert not any(rate.lender_slug == "td" for rate in carried)

    five = next(
        rate for rate in rbc
        if rate.term_months == 60
        and rate.rate_type.value == "fixed"
        and rate.mortgage_type.value == "uninsured"
    )
    from decimal import Decimal
    assert five.rate == Decimal("5.14")
    assert five.scraped_at.replace(tzinfo=None) == RBC_SCRAPED_AT
    assert five.raw_data["source"] == "rbc_live_scrape"
    assert five.raw_data["section"] == "special"
    assert five.raw_data["product"] == "5 Year Fixed Closed"
    assert five.raw_data["stale"] is True
    assert five.source_url == "https://www.rbcroyalbank.com/mortgages/mortgage-rates.html"
    assert laurentian[0].raw_data["source"] == "laurentian_live_scrape"
    assert laurentian[0].scraped_at.replace(tzinfo=None) == datetime(2026, 11, 20, 15, 4, 0)

    clean, _stats = RateDeduplicator().deduplicate(rbc + laurentian)
    assert len([rate for rate in clean if rate.lender_slug == "rbc"]) == 11
    assert len([rate for rate in clean if rate.lender_slug == "laurentian"]) == 1

    # The rate file written after a failed scrape still contains those rows.
    export = []
    for rate in clean:
        export.append({
            "lender_slug": rate.lender_slug,
            "term_months": rate.term_months,
            "rate_type": rate.rate_type.value,
            "mortgage_type": rate.mortgage_type.value if rate.mortgage_type else None,
            "rate": float(rate.rate),
            "scraped_at": rate.scraped_at.isoformat(),
            "source_url": rate.source_url,
            "raw_data": rate.raw_data,
        })
    destination = Path(tmp_path) if tmp_path else Path("/tmp")
    out = destination / "rates-carry-forward.json"
    out.write_text(json.dumps(export, indent=2))
    restored = json.loads(out.read_text())
    rbc_file = [
        row for row in restored
        if row["lender_slug"] == "rbc"
        and row["term_months"] == 60
        and row["rate_type"] == "fixed"
        and row["mortgage_type"] == "uninsured"
    ]
    assert len(rbc_file) == 1
    assert rbc_file[0]["rate"] == 5.14
    assert rbc_file[0]["scraped_at"].startswith("2026-11-26T19:54:40")
    assert rbc_file[0]["raw_data"]["source"] == "rbc_live_scrape"
    assert any(row["lender_slug"] == "laurentian" for row in restored)


def test_one_bad_previous_row_does_not_drop_the_lender():
    previous = json.loads((FIXTURES / "rbc_rates_2026-11-26.json").read_text())
    previous.append({"lender_slug": "rbc", "term_months": "not-a-term", "rate_type": "fixed"})
    carried = carry_forward_previous_rates(previous, {"rbc"}, set())
    assert len(carried) == 11


def test_new_rows_are_not_replaced_by_previous_ones():
    previous = json.loads((FIXTURES / "rbc_rates_2026-11-26.json").read_text())
    carried = carry_forward_previous_rates(previous, {"rbc"}, {"rbc"})
    assert carried == []


def test_pipeline_does_not_construct_rawrate_without_importing_it():
    source = Path(__file__).with_name("test_all_lenders_v2.py").read_text()
    assert "carry_forward_previous_rates" in source
    tree = ast.parse(source)
    for node in tree.body:
        if isinstance(node, ast.FunctionDef) and node.name == "scrape_all_lenders":
            for child in ast.walk(node):
                if isinstance(child, ast.Name) and child.id == "RawRate":
                    raise AssertionError(
                        "scrape_all_lenders references RawRate directly; "
                        "that NameError dropped the previous RBC rows"
                    )


if __name__ == "__main__":
    test_failed_rbc_and_laurentian_scrapes_keep_previous_rows()
    test_one_bad_previous_row_does_not_drop_the_lender()
    test_new_rows_are_not_replaced_by_previous_ones()
    test_pipeline_does_not_construct_rawrate_without_importing_it()
    print("ok")
