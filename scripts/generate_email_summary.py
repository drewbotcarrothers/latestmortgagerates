#!/usr/bin/env python3
"""Generate a plain-text scrape summary email for the deploy workflow."""

import json
import os
from datetime import datetime, timezone

SITE_URL = "https://latestmortgagerates.ca/"
SUBJECT_PREFIX = "Rate scraper report"

# Compact "best rates" picks from the published rates file.
BEST_PRODUCTS = (
    ("5y fixed insured", 60, "fixed", "insured"),
    ("5y fixed uninsured", 60, "fixed", "uninsured"),
    ("5y variable", 60, "variable", None),
)


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def parse_timestamp(value):
    """Parse metadata last_updated (ISO-8601, often ...Z) into a UTC datetime."""
    if not value or not isinstance(value, str):
        return None
    text = value.strip()
    if text.endswith("Z"):
        text = text[:-1] + "+00:00"
    try:
        dt = datetime.fromisoformat(text)
    except ValueError:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def format_header_time(last_updated):
    dt = parse_timestamp(last_updated)
    if dt:
        return dt.strftime("%Y-%m-%d %H:%M UTC")
    return last_updated or "unknown"


def subject_line(last_updated):
    dt = parse_timestamp(last_updated)
    if dt:
        return f"{SUBJECT_PREFIX} - {dt.strftime('%Y-%m-%d')}"
    return SUBJECT_PREFIX


def is_fallback_rate(rate):
    """Match the scraper's fallback/stale detection (raw_data.source)."""
    source = str((rate.get("raw_data") or {}).get("source") or "").lower()
    if source:
        return "fallback" in source or "stale" in source
    url = str(rate.get("source_url") or "").lower()
    return (not url) or ("fallback" in url)


def live_fallback_counts(metadata, rates):
    live = metadata.get("live_rates")
    fallback = metadata.get("fallback_rates")
    if isinstance(live, int) and isinstance(fallback, int):
        return live, fallback
    fallback_count = sum(1 for rate in rates if is_fallback_rate(rate))
    return len(rates) - fallback_count, fallback_count


def failed_scraper_rows(metadata):
    rows = []
    for result in metadata.get("scraper_results") or []:
        if result.get("success") is False:
            rows.append(result)
    return rows


def _rate_value(rate):
    try:
        return float(rate["rate"])
    except (KeyError, TypeError, ValueError):
        return None


def find_best_rate(rates, term_months, rate_type, mortgage_type=None):
    candidates = []
    rate_type = rate_type.lower()
    mortgage_type = mortgage_type.lower() if mortgage_type else None
    for rate in rates:
        if rate.get("term_months") != term_months:
            continue
        if str(rate.get("rate_type") or "").lower() != rate_type:
            continue
        if mortgage_type and str(rate.get("mortgage_type") or "").lower() != mortgage_type:
            continue
        value = _rate_value(rate)
        if value is None:
            continue
        candidates.append((value, str(rate.get("lender_name") or ""), rate))
    if not candidates:
        return None
    candidates.sort(key=lambda item: (item[0], item[1]))
    return candidates[0][2]


def format_best_rate_line(label, rate):
    if rate is None:
        return f"{label + ':':<22} n/a"
    value = _rate_value(rate)
    lender = rate.get("lender_name") or rate.get("lender_slug") or "unknown"
    extra = ""
    # When the product filter is not insured-specific, mention the type.
    mortgage_type = str(rate.get("mortgage_type") or "").lower()
    if label == "5y variable" and mortgage_type:
        extra = f" ({mortgage_type})"
    return f"{label + ':':<22} {value:.2f}%  {lender}{extra}"


def _int(metadata, key, default=0):
    value = metadata.get(key, default)
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def pct(part, whole):
    if whole <= 0:
        return 0
    return part / whole * 100


def generate_summary_email(metadata, rates):
    """Return (subject, plain_text_body) for one scrape run."""
    last_updated = metadata.get("last_updated")
    subject = subject_line(last_updated)
    header_time = format_header_time(last_updated)

    total_rates = _int(metadata, "total_rates", len(rates))
    total_lenders = _int(metadata, "total_lenders")
    scrapers_run = _int(metadata, "scrapers_run")
    successful = _int(metadata, "scrapers_successful")
    failed = _int(metadata, "scrapers_failed")
    live_count, fallback_count = live_fallback_counts(metadata, rates)
    live_pct = pct(live_count, total_rates)
    fallback_pct = pct(fallback_count, total_rates)

    failed_rows = failed_scraper_rows(metadata)
    if failed == 0 and failed_rows:
        failed = len(failed_rows)

    lines = [
        SUBJECT_PREFIX,
        "=" * 48,
        f"Last updated:          {header_time}",
        "",
        "Scrape",
        "-" * 48,
        f"Total rates:           {total_rates}",
        f"Lenders:               {total_lenders}",
        f"Scrapers run:          {scrapers_run}",
        f"Successful:            {successful}",
        f"Failed:                {failed}",
        f"Live rates:            {live_count} ({live_pct:.0f}%)",
        f"Fallback rates:        {fallback_count} ({fallback_pct:.0f}%)",
    ]

    if failed_rows:
        lines.extend(["", "Failed scrapers", "-" * 48])
        for result in failed_rows:
            name = result.get("lender") or "unknown"
            error = (result.get("error") or "").strip()
            lines.append(f"- {name}: {error}" if error else f"- {name}")

    lines.extend(["", "Best rates", "-" * 48])
    for label, term, rate_type, mortgage_type in BEST_PRODUCTS:
        best = find_best_rate(rates, term, rate_type, mortgage_type)
        lines.append(format_best_rate_line(label, best))

    lines.extend(
        [
            "",
            "Site",
            "-" * 48,
            SITE_URL,
            "",
        ]
    )

    return subject, "\n".join(lines)


def write_github_output(name, value):
    path = os.environ.get("GITHUB_OUTPUT")
    if not path:
        return
    with open(path, "a", encoding="utf-8") as f:
        f.write(f"{name}={value}\n")


def main():
    metadata = load_json("data/metadata.json")
    rates = load_json("data/rates.json")
    if not isinstance(rates, list):
        rates = rates.get("rates") or []

    subject, text = generate_summary_email(metadata, rates)

    with open("email_summary.txt", "w", encoding="utf-8") as f:
        f.write(text)
        if not text.endswith("\n"):
            f.write("\n")

    write_github_output("subject", subject)
    print("Email summary generated successfully!")
    print(f"Subject: {subject}")
    print(f"Text: {len(text)} chars")


if __name__ == "__main__":
    main()
