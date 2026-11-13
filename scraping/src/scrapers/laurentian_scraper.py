"""
Laurentian Bank mortgage rate scraper.

The rates page is a Next.js document. Posted grids used to be HTML tables;
the same grids are embedded as Contentful rich-text tables in
``__NEXT_DATA__`` (AccountFeaturesTable modules). The DOM may render those
as tables, divs, or not at all. Parse the embedded JSON first, then any
HTML tables, then short term/rate lines in the visible text.

The August 14, 2026 hardcoded shelf (including the 4.79% 5-year promo) is
not used. An empty result lets the pipeline keep the previous live rows.
"""

import json
import re
from decimal import Decimal, InvalidOperation
from html import unescape
from html.parser import HTMLParser
from typing import List, Optional, Tuple
from datetime import datetime, timezone
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType

try:
    from .rate_parse import parse_term_months
except ImportError:
    from rate_parse import parse_term_months


NEXT_DATA_RE = re.compile(
    r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',
    re.DOTALL,
)
RATE_VALUE_RE = re.compile(r"(\d+\.\d+)")


def _normalize_spaces(text: str) -> str:
    text = (
        (text or "")
        .replace("\u00a0", " ")
        .replace("\u202f", "")
        .replace("\u2009", "")
        .replace("\u200a", "")
    )
    text = re.sub(r"(\d)\s+\.", r"\1.", text)
    text = re.sub(r"\.\s+(\d)", r".\1", text)
    return re.sub(r"\s+", " ", text).strip()


def _parse_rate_value(text: str) -> Optional[Decimal]:
    match = RATE_VALUE_RE.search(_normalize_spaces(text))
    if not match:
        return None
    try:
        rate = Decimal(match.group(1))
    except (InvalidOperation, ValueError):
        return None
    if Decimal("1.50") <= rate <= Decimal("12.00"):
        return rate
    return None


def _node_text(node) -> str:
    parts: List[str] = []

    def walk(value):
        if isinstance(value, dict):
            if value.get("nodeType") == "text" and value.get("value"):
                parts.append(str(value["value"]))
            for child in value.values():
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(node)
    return _normalize_spaces(" ".join(parts))


def _rich_rows(table_node) -> List[List[str]]:
    rows: List[List[str]] = []
    for row in table_node.get("content") or []:
        if not isinstance(row, dict) or row.get("nodeType") != "table-row":
            continue
        cells = []
        for cell in row.get("content") or []:
            if isinstance(cell, dict) and cell.get("nodeType") in {"table-cell", "table-header-cell"}:
                cells.append(_node_text(cell))
        if any(cells):
            rows.append(cells)
    return rows


def _iter_labeled_tables(nodes, label: str = ""):
    if not isinstance(nodes, list):
        return
    current = label
    for node in nodes:
        if not isinstance(node, dict):
            continue
        kind = node.get("nodeType")
        if kind == "table":
            yield current, node
            continue
        if kind in {"paragraph", "heading-1", "heading-2", "heading-3", "heading-4", "heading-5"}:
            text = _node_text(node)
            if text:
                current = text
            continue
        for value in node.values():
            if isinstance(value, list):
                yield from _iter_labeled_tables(value, current)


def _is_header_row(cells: List[str]) -> bool:
    if not cells:
        return True
    joined = " ".join(cells).lower()
    if _parse_rate_value(joined) is not None and parse_term_months(joined):
        return False
    first = cells[0].lower()
    return first in {"term", "type"} or "fixed rate" in first or joined.strip() in {
        "term fixed rate (%)",
        "type details convertible closed term variable rate (%)",
        "type fixed rate (%)",
        "type minimum rate (%)",
    }


def _term_and_rate(cells: List[str], headers: List[str]) -> Tuple[Optional[int], str, Optional[Decimal]]:
    term_months = None
    term_text = ""
    for index, cell in enumerate(cells):
        months = parse_term_months(cell)
        if not months:
            continue
        header = headers[index].lower() if index < len(headers) else ""
        if term_months is None or "term" in header:
            term_months = months
            term_text = cell

    rate = None
    preferred = [
        index for index, header in enumerate(headers)
        if "rate" in header.lower() and "prime" not in header.lower()
    ]
    order = preferred + [index for index in range(len(cells)) if index not in preferred]
    for index in order:
        if index >= len(cells):
            continue
        cell = cells[index]
        if term_text and cell == term_text and _parse_rate_value(cell) is None:
            continue
        parsed = _parse_rate_value(cell)
        if parsed is not None:
            rate = parsed
            break
    return term_months, term_text, rate


def _section_flags(section: str, subsection: str, term_text: str):
    blob = f"{section} {subsection}".lower()
    if "equity line" in blob:
        return None
    rate_type = RateType.VARIABLE if "variable" in blob else RateType.FIXED
    insured = any(hint in blob for hint in ("high-ratio", "high ratio", "insured"))
    mortgage_type = MortgageType.INSURED if insured else MortgageType.UNINSURED
    is_promo = "promotional" in (term_text or "").lower()
    return rate_type, mortgage_type, is_promo


def _rates_from_rows(
    rows: List[List[str]],
    *,
    section: str,
    subsection: str,
    lender_slug: str,
    lender_name: str,
    source_url: str,
    scraped_at,
    extraction_method: str,
) -> List[RawRate]:
    flags = _section_flags(section, subsection, "")
    if flags is None or not rows:
        return []
    headers = rows[0] if _is_header_row(rows[0]) else []
    data_rows = rows[1:] if headers else rows
    rates: List[RawRate] = []
    for cells in data_rows:
        if _is_header_row(cells) and not parse_term_months(" ".join(cells)):
            continue
        term_months, term_text, rate = _term_and_rate(cells, headers)
        if term_months is None or rate is None:
            continue
        row_flags = _section_flags(section, subsection, term_text)
        if row_flags is None:
            continue
        rate_type, mortgage_type, is_promo = row_flags
        label = subsection or section or term_text
        product = f"{label}: {term_text}" if label and term_text else (term_text or label)
        rates.append(RawRate(
            lender_slug=lender_slug,
            lender_name=lender_name,
            term_months=term_months,
            rate_type=rate_type,
            mortgage_type=mortgage_type,
            rate=rate,
            source_url=source_url,
            scraped_at=scraped_at,
            raw_data={
                "source": "laurentian_live_scrape",
                "extraction_method": extraction_method,
                "section": section,
                "subsection": subsection,
                "term_text": term_text,
                "is_promotional": is_promo,
                "product": product,
            },
        ))
    return rates


def _rates_from_next_data(html: str, **common) -> List[RawRate]:
    match = NEXT_DATA_RE.search(html or "")
    if not match:
        return []
    try:
        payload = json.loads(match.group(1))
    except json.JSONDecodeError:
        return []
    modules = (
        payload.get("props", {})
        .get("pageProps", {})
        .get("modules")
        or []
    )
    rates: List[RawRate] = []
    for module in modules:
        if not isinstance(module, dict) or module.get("__typename") != "AccountFeaturesTable":
            continue
        section = _normalize_spaces(str(module.get("header") or ""))
        table = module.get("table") or {}
        content = (table.get("json") or {}).get("content") or []
        for subsection, table_node in _iter_labeled_tables(content):
            # The first label inside a fixed-rate module is the section
            # heading repeated as a paragraph only when it is not the
            # Open/Convertible/Closed caption. Prefer the short caption.
            caption = subsection
            if caption.lower().rstrip(".") == section.lower().rstrip("."):
                caption = ""
            rates.extend(_rates_from_rows(
                _rich_rows(table_node),
                section=section,
                subsection=caption,
                extraction_method="next_data",
                **common,
            ))
    return rates


class _TableCollector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tables = []
        self._ignore = 0
        self._heading = ""
        self._subsection = ""
        self._in_heading = False
        self._heading_parts: List[str] = []
        self._in_p = False
        self._p_parts: List[str] = []
        self._in_table = 0
        self._in_cell = False
        self._cell_parts: List[str] = []
        self._row: List[str] = []
        self._rows: List[List[str]] = []

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag in {"script", "style"}:
            self._ignore += 1
            return
        if self._ignore:
            return
        if tag in {"h1", "h2", "h3"}:
            self._in_heading = True
            self._heading_parts = []
        elif tag == "p" and not self._in_table:
            self._in_p = True
            self._p_parts = []
        elif tag == "table":
            self._in_table += 1
            if self._in_table == 1:
                self._rows = []
        elif tag == "tr" and self._in_table:
            self._row = []
        elif tag in {"td", "th"} and self._in_table:
            self._in_cell = True
            self._cell_parts = []

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in {"script", "style"} and self._ignore:
            self._ignore -= 1
            return
        if self._ignore:
            return
        if tag in {"h1", "h2", "h3"} and self._in_heading:
            text = _normalize_spaces(" ".join(self._heading_parts))
            if text:
                self._heading = text
                self._subsection = ""
            self._in_heading = False
        elif tag == "p" and self._in_p:
            text = _normalize_spaces(" ".join(self._p_parts))
            if text and len(text) <= 80:
                self._subsection = text
            self._in_p = False
        elif tag in {"td", "th"} and self._in_cell:
            self._row.append(_normalize_spaces(" ".join(self._cell_parts)))
            self._in_cell = False
        elif tag == "tr" and self._in_table and self._row:
            self._rows.append(self._row)
            self._row = []
        elif tag == "table" and self._in_table:
            self._in_table -= 1
            if self._in_table == 0:
                self.tables.append((self._heading, self._subsection, self._rows))
                self._rows = []

    def handle_data(self, data):
        if self._ignore:
            return
        if self._in_cell:
            self._cell_parts.append(data)
        elif self._in_heading:
            self._heading_parts.append(data)
        elif self._in_p:
            self._p_parts.append(data)


def _rates_from_html_tables(html: str, **common) -> List[RawRate]:
    collector = _TableCollector()
    try:
        collector.feed(html or "")
    except Exception:
        return []
    rates: List[RawRate] = []
    for section, subsection, rows in collector.tables:
        rates.extend(_rates_from_rows(
            rows,
            section=section,
            subsection=subsection,
            extraction_method="html_table",
            **common,
        ))
    return rates


def _visible_lines(html: str) -> List[str]:
    cleaned = re.sub(r"<script[\s\S]*?</script>", " ", html or "", flags=re.IGNORECASE)
    cleaned = re.sub(r"<style[\s\S]*?</style>", " ", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"</(?:p|div|h\d|li|tr|td|th|section|article)>", "\n", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"<br\s*/?>", "\n", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"<[^>]+>", " ", cleaned)
    cleaned = unescape(cleaned)
    lines = []
    for line in cleaned.splitlines():
        text = _normalize_spaces(line)
        if text:
            lines.append(text)
    return lines


def _rates_from_text(html: str, **common) -> List[RawRate]:
    section = ""
    subsection = ""
    pending: Optional[Tuple[int, str]] = None
    synthetic_rows: List[Tuple[str, str, List[str]]] = []
    bucket: List[List[str]] = []

    def flush():
        nonlocal bucket
        if bucket:
            synthetic_rows.append((section, subsection, bucket))
            bucket = []

    for line in _visible_lines(html):
        lowered = line.lower()
        if any(token in lowered for token in ("fixed-rate mortgage", "variable-rate mortgage", "high-ratio", "equity line of credit")):
            flush()
            pending = None
            section = line
            subsection = ""
            continue
        if len(line) <= 80 and re.match(r"^(open|convertible|closed)\b", lowered):
            flush()
            pending = None
            subsection = line
            continue
        if len(line) > 80 or "subject to" in lowered:
            pending = None
            continue
        rate = _parse_rate_value(line)
        months = parse_term_months(line)
        if months and rate is not None and len(line) <= 80:
            bucket.append([line, f"{rate}"])
            pending = None
            continue
        if months and len(line) <= 60:
            pending = (months, line)
            continue
        if pending and rate is not None and len(line) <= 20:
            bucket.append([pending[1], f"{rate}"])
            pending = None
    flush()

    rates: List[RawRate] = []
    for sec, sub, rows in synthetic_rows:
        rates.extend(_rates_from_rows(
            rows,
            section=sec,
            subsection=sub,
            extraction_method="visible_text",
            **common,
        ))
    return rates


def _dedupe(rates: List[RawRate]) -> List[RawRate]:
    seen = set()
    unique = []
    for rate in rates:
        promo = bool((rate.raw_data or {}).get("is_promotional"))
        key = (rate.term_months, rate.rate_type.value, rate.mortgage_type.value, str(rate.rate), promo)
        if key in seen:
            continue
        seen.add(key)
        unique.append(rate)
    return unique


def parse_laurentian_html(
    html: str,
    *,
    lender_slug: str,
    lender_name: str,
    source_url: str,
    scraped_at,
) -> List[RawRate]:
    """Extract posted Laurentian rates from JSON, tables, or visible term lines."""
    common = dict(
        lender_slug=lender_slug,
        lender_name=lender_name,
        source_url=source_url,
        scraped_at=scraped_at,
    )
    if not html:
        return []
    for extractor in (_rates_from_next_data, _rates_from_html_tables, _rates_from_text):
        rates = _dedupe(extractor(html, **common))
        if rates:
            return rates
    return []


class LaurentianBankScraper:
    """Scraper for Laurentian Bank mortgage rates."""

    LENDER_SLUG = "laurentian"
    LENDER_NAME = "Laurentian Bank"
    RATE_URL = "https://www.laurentianbank.ca/en/personal/rates/mortgages"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        """Scrape Laurentian Bank mortgage rates."""
        logger.info("Fetching Laurentian Bank rate page...")
        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Laurentian Bank")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")

        logger.warning(
            "Laurentian page had no posted rates. "
            "Not using the August 14, 2026 hardcoded shelf; previous live rows will be kept."
        )
        return []

    def _scrape_with_playwright(self) -> List[RawRate]:
        """Load the rates page and parse embedded JSON or rendered rates."""
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            logger.warning("Playwright not available")
            return []

        with sync_playwright() as p:
            launch_args = ["--disable-http2", "--disable-quic"]
            try:
                browser = p.chromium.launch(headless=True, args=launch_args)
            except Exception:
                logger.info("Bundled Chromium unavailable; using system Chrome")
                browser = p.chromium.launch(channel="chrome", headless=True, args=launch_args)
            context = browser.new_context(
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
                )
            )
            page = context.new_page()
            page.route(
                "**/*",
                lambda route: route.abort()
                if route.request.resource_type in ["image", "media", "font", "stylesheet"]
                else route.continue_(),
            )
            page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(3000)
            html = page.content()
            table_count = page.locator("table").count()
            final_url = page.url
            title = page.title()
            browser.close()

        logger.info(f"Found {table_count} tables on Laurentian rates page ({final_url})")
        if "/error" in final_url or "page not found" in title.lower():
            logger.warning(
                "Laurentian rates URL resolved to the personal-banking exit page "
                f"({title!r}); posted rate grids are not on this document."
            )
        rates = parse_laurentian_html(
            html,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
        )
        if rates:
            method = (rates[0].raw_data or {}).get("extraction_method")
            logger.info(f"Parsed {len(rates)} Laurentian rates via {method}")
        return rates


if __name__ == "__main__":
    scraper = LaurentianBankScraper()
    found = scraper.scrape()
    print(f"Scraped {len(found)} Laurentian rates")
    for rate in found:
        data = rate.raw_data or {}
        print(
            f"  {rate.mortgage_type.value:10} {rate.term_months:3}mo {rate.rate_type.value:8} "
            f"{rate.rate}% promo={data.get('is_promotional')} {data.get('product')}"
        )
