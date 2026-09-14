"""
Shared mortgage-rate parsing helpers.

Handles common Canadian lender page formats: "5-Year Fixed 4.64%",
HTML tables with term in the first column, and high-ratio/insured labels.
"""

from __future__ import annotations

import re
import sys
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Iterable, List, Optional, Tuple

sys.path.append(str(Path(__file__).parent.parent))
from models import MortgageType, RateType, RawRate


TERM_YEAR_RE = re.compile(
    r"\b(\d+)\s*[-–]?\s*(?:year|yr|years)\b",
    re.IGNORECASE,
)
TERM_MONTH_RE = re.compile(
    r"\b(\d+)\s*[-–]?\s*(?:month|months|mo)\b",
    re.IGNORECASE,
)
RATE_RE = re.compile(r"(\d+\.\d+)\s*%")

INSURED_HINTS = (
    "high ratio",
    "high-ratio",
    "insured",
    "default insured",
    "smart start",
)


def parse_term_months(text: str) -> Optional[int]:
    if not text:
        return None
    year_match = TERM_YEAR_RE.search(text)
    if year_match:
        years = int(year_match.group(1))
        if 1 <= years <= 10:
            return years * 12
        return None
    month_match = TERM_MONTH_RE.search(text)
    if month_match:
        months = int(month_match.group(1))
        if months in (6, 12, 18, 24, 30):
            return months
    return None


def parse_rate(text: str) -> Optional[Decimal]:
    if not text or "RDS%" in text:
        return None
    match = RATE_RE.search(text)
    if not match:
        return None
    try:
        rate = Decimal(match.group(1))
    except (InvalidOperation, ValueError):
        return None
    if Decimal("1.50") <= rate <= Decimal("12.00"):
        return rate
    return None


def infer_rate_type(text: str) -> RateType:
    lowered = text.lower()
    if (
        "variable" in lowered
        or "adjustable" in lowered
        or re.search(r"\barm\b", lowered)
        or "prime -" in lowered
        or "prime +" in lowered
        or "(prime" in lowered
    ):
        return RateType.VARIABLE
    return RateType.FIXED


def infer_mortgage_type(text: str) -> MortgageType:
    lowered = text.lower()
    if any(hint in lowered for hint in INSURED_HINTS):
        return MortgageType.INSURED
    return MortgageType.UNINSURED


def _strip_tags(html: str) -> str:
    html = re.sub(r"(?is)<(script|style|noscript|sup).*?</\1>", " ", html)
    html = re.sub(r"(?i)<br\s*/?>", " ", html)
    html = re.sub(r"<[^>]+>", " ", html)
    html = (
        html.replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&#37;", "%")
        .replace("&ndash;", "-")
        .replace("&mdash;", "-")
    )
    return re.sub(r"\s+", " ", html).strip()


def table_rows_as_text(html: str) -> List[str]:
    """Keep each table row as a single line, prefixed with the nearest heading."""
    lines: List[str] = []
    last_h2 = ""
    last_sub = ""
    for chunk in re.finditer(r"(?is)<h[1-6]\b.*?</h[1-6]>|<table\b.*?</table>", html):
        block = chunk.group(0)
        heading_match = re.match(r"(?is)<h([1-6])\b", block)
        if heading_match:
            level = int(heading_match.group(1))
            text = _strip_tags(block)
            if level <= 2:
                last_h2 = text
                last_sub = ""
            else:
                last_sub = text
            continue
        heading = " ".join(part for part in (last_h2, last_sub) if part)
        for tr in re.finditer(r"(?is)<tr\b.*?</tr>", block):
            cells = re.findall(r"(?is)<t[dh]\b.*?</t[dh]>", tr.group(0))
            texts = [_strip_tags(c) for c in cells]
            texts = [t for t in texts if t]
            if not texts:
                continue
            row = " | ".join(texts)
            if heading:
                lines.append(f"{heading} | {row}")
            else:
                lines.append(row)
    return lines


def html_to_text(html: str) -> str:
    """Convert HTML to line-oriented text, preserving table rows."""
    table_lines = table_rows_as_text(html)
    remainder = re.sub(r"(?is)<table\b.*?</table>", " ", html)
    remainder = re.sub(r"(?is)<(script|style|noscript).*?</\1>", " ", remainder)
    remainder = re.sub(r"(?i)<br\s*/?>", "\n", remainder)
    remainder = re.sub(r"(?i)</(p|div|li|h[1-6]|section|article)>", "\n", remainder)
    remainder = _strip_tags(remainder.replace("\n", " «NL» "))
    remainder = remainder.replace("«NL»", "\n")
    return "\n".join(table_lines + remainder.splitlines())


def extract_candidate_rates(text: str) -> List[Tuple[int, RateType, MortgageType, Decimal, str]]:
    """
    Extract (term_months, rate_type, mortgage_type, rate, context) from text.

    Prefers line-level term+rate pairs so APR in the same row is skipped
    (first percentage after the term is treated as the interest rate).
    """
    found: List[Tuple[int, RateType, MortgageType, Decimal, str]] = []
    seen = set()

    for raw_line in text.splitlines():
        line = " ".join(raw_line.split())
        if not line or "%" not in line or "RDS%" in line:
            continue
        lowered = line.lower()
        if re.search(r"\bopen\b", lowered) and "closed" not in lowered:
            continue
        if "annual percentage rate" in lowered or lowered.strip().startswith("apr"):
            continue
        if "example" in lowered or "fluctuation" in lowered:
            continue
        if "1-year closed fixed mortgage rate:" in lowered:
            continue
        # Skip APR-only explainer lines
        if re.search(r"\bAPR\b", line) and not TERM_YEAR_RE.search(line) and not TERM_MONTH_RE.search(line):
            continue

        term_months = parse_term_months(line)
        if not term_months:
            continue

        # Prefer the lowest in-range rate that isn't labeled APR (interest over APR,
        # Rate First / special column over a higher posted column in the same row).
        rates_found = []
        for match in RATE_RE.finditer(line):
            prefix = line[max(0, match.start() - 8):match.start()].lower()
            if "apr" in prefix:
                continue
            try:
                candidate = Decimal(match.group(1))
            except (InvalidOperation, ValueError):
                continue
            if Decimal("1.50") <= candidate <= Decimal("12.00"):
                rates_found.append(candidate)
        if not rates_found:
            continue
        rate = min(rates_found)

        rate_type = infer_rate_type(line)
        mortgage_type = infer_mortgage_type(line)
        key = (term_months, rate_type, mortgage_type, str(rate))
        if key in seen:
            continue
        seen.add(key)
        found.append((term_months, rate_type, mortgage_type, rate, line[:180]))

    return found


def to_raw_rates(
    candidates: Iterable[Tuple[int, RateType, MortgageType, Decimal, str]],
    *,
    lender_slug: str,
    lender_name: str,
    source_url: str,
    scraped_at,
    source: str,
    extraction_method: str,
) -> List[RawRate]:
    rates: List[RawRate] = []
    for term_months, rate_type, mortgage_type, rate, context in candidates:
        rates.append(
            RawRate(
                lender_slug=lender_slug,
                lender_name=lender_name,
                term_months=term_months,
                rate_type=rate_type,
                mortgage_type=mortgage_type,
                rate=rate,
                source_url=source_url,
                scraped_at=scraped_at,
                raw_data={
                    "source": source,
                    "extraction_method": extraction_method,
                    "context": context,
                },
            )
        )
    return rates


def extract_rates_from_html(
    html: str,
    *,
    lender_slug: str,
    lender_name: str,
    source_url: str,
    scraped_at,
    source: str,
    extraction_method: str = "html_text",
) -> List[RawRate]:
    text = html_to_text(html)
    return to_raw_rates(
        extract_candidate_rates(text),
        lender_slug=lender_slug,
        lender_name=lender_name,
        source_url=source_url,
        scraped_at=scraped_at,
        source=source,
        extraction_method=extraction_method,
    )


def fallback_rows_to_rates(
    rows: List[dict],
    *,
    lender_slug: str,
    lender_name: str,
    source_url: str,
    scraped_at,
    source: str,
    last_verified: str,
) -> List[RawRate]:
    rates: List[RawRate] = []
    for item in rows:
        mortgage_type = (
            MortgageType.INSURED
            if item.get("mortgage_type") == "insured"
            else MortgageType.UNINSURED
        )
        raw_data = {
            "source": source,
            "product": item.get("product"),
            "featured": item.get("featured", False),
            "last_verified": last_verified,
        }
        if item.get("spread"):
            raw_data["spread_to_prime"] = item["spread"]
        rates.append(
            RawRate(
                lender_slug=lender_slug,
                lender_name=lender_name,
                term_months=item["term"],
                rate_type=item["type"],
                mortgage_type=mortgage_type,
                rate=Decimal(str(item["rate"])),
                source_url=source_url,
                scraped_at=scraped_at,
                raw_data=raw_data,
            )
        )
    return rates
