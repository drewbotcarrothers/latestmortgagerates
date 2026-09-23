"""
Manulife Bank mortgage rate scraper.

Public rates are server-rendered HTML on
https://www.manulifebank.ca/current-rates.html
There is no separate rates JSON API. The page's Special rates cards and the
Manulife One / Manulife Bank Select / Preferred Rate Mortgage tables are in
the initial document.

The old Playwright path read visible <td> innerText only. On the 2026-09-23
run that walk returned no rows (no exception), and the dated July 19 fallback
was returned anyway. The pipeline treats any returned list as success, so
metadata showed success with rates_found 8 while cleaning recorded
manulife_fallback_2026-07-19. innerText also misses the Special rates cards,
which are not table rows.
"""

from __future__ import annotations

import re
import sys
from datetime import datetime, timezone
from decimal import Decimal
from html import unescape
from pathlib import Path
from typing import List, Optional

from loguru import logger

sys.path.append(str(Path(__file__).parent.parent))
from models import MortgageType, RateType, RawRate

try:
    from .http_fetch import fetch_html
    from .safari_fetch import fetch_html_safari
except ImportError:
    from http_fetch import fetch_html
    from safari_fetch import fetch_html_safari


class ManulifeBankScraper:
    """Scraper for Manulife Bank mortgage rates."""

    LENDER_SLUG = "manulife"
    LENDER_NAME = "Manulife Bank"
    RATE_URL = "https://www.manulifebank.ca/current-rates.html"
    LIVE_SOURCE = "manulife_live_scrape"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        """Scrape current Manulife Bank mortgage rates."""
        logger.info(f"Fetching Manulife Bank rates from {self.RATE_URL}")

        for method, html in self._fetch_candidates():
            rates = parse_manulife_html(
                html,
                source_url=self.RATE_URL,
                scraped_at=self.scraped_at,
                extraction_method=method,
            )
            if rates:
                effective = (rates[0].raw_data or {}).get("effective_date")
                fresh = f", page effective {effective}" if effective else ""
                logger.success(
                    f"Successfully scraped {len(rates)} live rates from Manulife Bank via {method}{fresh}"
                )
                return rates
            logger.warning(f"Manulife {method} HTML did not contain parseable mortgage rates")

        logger.warning("Using fallback rates from Manulife Bank (2026-07-19)")
        return self._get_fallback_rates()

    def _fetch_candidates(self):
        """Yield (method, html) until one parses. HTTP first; Playwright is backup."""
        html = fetch_html(self.RATE_URL, timeout=25.0)
        if html:
            yield "http_html", html

        safari_html = fetch_html_safari(self.RATE_URL, timeout=25.0)
        if safari_html and safari_html != html:
            yield "safari_html", safari_html

        playwright_html = self._fetch_with_playwright()
        if playwright_html and playwright_html not in (html, safari_html):
            yield "playwright_html", playwright_html

    def _fetch_with_playwright(self) -> str:
        """Load the rates page and return its HTML, including non-visible nodes."""
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            logger.warning("Playwright not available")
            return ""

        browser = None
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=["--disable-http2", "--disable-quic"],
                )
                context = browser.new_context(
                    user_agent=(
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
                    ),
                    extra_http_headers={
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        "Accept-Language": "en-CA,en;q=0.9",
                    },
                )
                page = context.new_page()
                page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=30000)
                page.wait_for_timeout(1500)
                return page.content()
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")
            return ""
        finally:
            if browser:
                try:
                    browser.close()
                except Exception:
                    pass

    def _get_fallback_rates(self) -> List[RawRate]:
        """Last-resort rates captured 2026-07-19. Not used when the live page parses."""
        fallback_data = [
            {"term": 12, "type": RateType.FIXED, "rate": "5.74", "mortgage_type": "uninsured", "product": "1 Year Fixed"},
            {"term": 24, "type": RateType.FIXED, "rate": "5.34", "mortgage_type": "uninsured", "product": "2 Year Fixed"},
            {"term": 36, "type": RateType.FIXED, "rate": "4.59", "mortgage_type": "uninsured", "product": "3 Year Fixed", "featured": True},
            {"term": 48, "type": RateType.FIXED, "rate": "4.69", "mortgage_type": "uninsured", "product": "4 Year Fixed"},
            {"term": 60, "type": RateType.FIXED, "rate": "4.69", "mortgage_type": "uninsured", "product": "5 Year Fixed", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.54", "mortgage_type": "insured", "product": "5 Year Fixed (Insured)"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.30", "mortgage_type": "uninsured", "product": "5 Year Variable"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.10", "mortgage_type": "insured", "product": "5 Year Variable (Insured)"},
        ]

        rates = []
        for item in fallback_data:
            mortgage_type = MortgageType.INSURED if item.get("mortgage_type") == "insured" else MortgageType.UNINSURED
            rates.append(RawRate(
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                term_months=item["term"],
                rate_type=item["type"],
                mortgage_type=mortgage_type,
                rate=Decimal(item["rate"]),
                source_url=self.RATE_URL,
                scraped_at=self.scraped_at,
                raw_data={
                    "source": "manulife_fallback_2026-07-19",
                    "product": item.get("product"),
                    "featured": item.get("featured", False),
                    "last_verified": "2026-07-19",
                },
            ))
        return rates


_SPECIAL_CARD_RE = re.compile(
    r"(?is)<h3[^>]*>\s*(?P<heading>\d+\s*-\s*year[^<]*)</h3>"
    r".*?As low as</span>\s*(?P<rate>\d+\.\d+)\s*%"
    r"(?P<after>.*?)<p>(?P<product>.*?)</p>"
)
_BLOCK_RE = re.compile(r"(?is)<h([1-4])\b[^>]*>.*?</h\1>|<table\b.*?</table>")
_HEADING_RE = re.compile(r"(?is)^<h([1-4])\b")
_ROW_RE = re.compile(r"(?is)<tr\b.*?</tr>")
_CELL_RE = re.compile(r"(?is)<td\b.*?</td>")
_TERM_RE = re.compile(r"(\d+)\s*[-–]?\s*(year|month)", re.IGNORECASE)
_RATE_RE = re.compile(r"(\d+\.\d+)")
_EFFECTIVE_RE = re.compile(r"current as of ([A-Za-z]+ \d{1,2}, \d{4})", re.IGNORECASE)
_POSTED_5YR_RE = re.compile(r"posted 5-year rate is (\d+\.\d+)%", re.IGNORECASE)

_FAMILY_LABELS = {
    "one": "Manulife One",
    "select": "Manulife Bank Select",
    "preferred": "Preferred Rate Mortgage",
}


def parse_manulife_html(
    html: str,
    *,
    source_url: str,
    scraped_at: datetime,
    extraction_method: str,
) -> List[RawRate]:
    """Parse mortgage specials and posted tables from the current-rates page."""
    if not html or "manulife" not in html.lower():
        return []

    region = _mortgage_region(html)
    if not region:
        return []

    effective_date = _effective_date(region)
    posted_5yr = _posted_five_year(region)
    rates: List[RawRate] = []
    rates.extend(_parse_specials(
        region,
        source_url=source_url,
        scraped_at=scraped_at,
        extraction_method=extraction_method,
        effective_date=effective_date,
        posted_5yr=posted_5yr,
    ))
    rates.extend(_parse_tables(
        region,
        source_url=source_url,
        scraped_at=scraped_at,
        extraction_method=extraction_method,
        effective_date=effective_date,
    ))
    return _dedupe(rates)


def _mortgage_region(html: str) -> str:
    """Slice from Special rates through the mortgage tables, before deposit accounts."""
    lowered = html.lower()
    start = lowered.find("special rates")
    if start < 0:
        start = lowered.find("manulife one")
    if start < 0:
        return ""
    end = lowered.find("bank account rates", start)
    if end < 0:
        end = lowered.find("investments rates", start)
    if end < 0:
        return html[start:]
    return html[start:end]


def _effective_date(region: str) -> Optional[str]:
    match = _EFFECTIVE_RE.search(_strip_tags(region))
    if not match:
        return None
    try:
        return datetime.strptime(match.group(1), "%B %d, %Y").date().isoformat()
    except ValueError:
        return None


def _posted_five_year(region: str) -> Optional[Decimal]:
    match = _POSTED_5YR_RE.search(_strip_tags(region))
    if not match:
        return None
    return _bounded_rate(match.group(1))


def _parse_specials(
    region: str,
    *,
    source_url: str,
    scraped_at: datetime,
    extraction_method: str,
    effective_date: Optional[str],
    posted_5yr: Optional[Decimal],
) -> List[RawRate]:
    rates: List[RawRate] = []
    for match in _SPECIAL_CARD_RE.finditer(region):
        heading = _strip_tags(match.group("heading"))
        product = _strip_tags(match.group("product"))
        if _is_open_term(heading):
            continue
        term_months = _term_months(heading)
        rate = _bounded_rate(match.group("rate"))
        if term_months is None or rate is None:
            continue
        mortgage_type = _special_mortgage_type(match.group("after"), product)
        rate_type = RateType.VARIABLE if "variable" in heading.lower() else RateType.FIXED
        posted_rate = posted_5yr if term_months == 60 and rate_type == RateType.FIXED else None
        rates.append(_raw_rate(
            term_months=term_months,
            rate_type=rate_type,
            mortgage_type=mortgage_type,
            rate=rate,
            product=f"{product} {heading}".strip(),
            featured=True,
            offer="special",
            source_url=source_url,
            scraped_at=scraped_at,
            extraction_method=extraction_method,
            effective_date=effective_date,
            posted_rate=posted_rate,
        ))
    return rates


def _parse_tables(
    region: str,
    *,
    source_url: str,
    scraped_at: datetime,
    extraction_method: str,
    effective_date: Optional[str],
) -> List[RawRate]:
    rates: List[RawRate] = []
    family: Optional[str] = None
    for block in _BLOCK_RE.finditer(region):
        chunk = block.group(0)
        if _HEADING_RE.match(chunk):
            family = _family_from_heading(_strip_tags(chunk)) or family
            continue
        if not family:
            continue
        label = _FAMILY_LABELS[family]
        for row in _ROW_RE.finditer(chunk):
            cells = [_strip_tags(cell) for cell in _CELL_RE.findall(row.group(0))]
            cells = [cell for cell in cells if cell]
            if len(cells) < 2:
                continue
            term_text, rate_text = cells[0], cells[1]
            if _is_open_term(term_text):
                continue
            term_months = _term_months(term_text)
            rate = _bounded_rate(rate_text)
            if term_months is None or rate is None:
                continue
            mortgage_type = MortgageType.UNINSURED
            lowered = term_text.lower()
            if "high ratio" in lowered or "high-ratio" in lowered or "insured" in lowered:
                mortgage_type = MortgageType.INSURED
            rate_type = RateType.VARIABLE if ("prime" in lowered or "variable" in lowered) else RateType.FIXED
            rates.append(_raw_rate(
                term_months=term_months,
                rate_type=rate_type,
                mortgage_type=mortgage_type,
                rate=rate,
                product=f"{label} {term_text}",
                featured=False,
                offer="published",
                source_url=source_url,
                scraped_at=scraped_at,
                extraction_method=extraction_method,
                effective_date=effective_date,
                posted_rate=None,
            ))
    return rates


def _family_from_heading(text: str) -> Optional[str]:
    lowered = text.lower()
    if "preferred rate" in lowered:
        return "preferred"
    if "manulife bank select" in lowered:
        return "select"
    if lowered.strip() in {"manulife one", "manulife one rates"} or lowered.startswith("manulife one"):
        # Special-card blurbs are not headings. "Manulife One something long" still
        # belongs to that table only when the heading is the section title.
        if "closed" in lowered or "fixed" in lowered or "as low as" in lowered:
            return None
        return "one"
    return None


def _special_mortgage_type(after_html: str, product: str) -> MortgageType:
    blob = f"{after_html} {product}".lower()
    if "footnotecroix" in blob or "high ratio" in blob or "high-ratio" in blob:
        return MortgageType.INSURED
    if "footnotedoubleasterisk" in blob or "insurable" in blob:
        return MortgageType.INSURABLE
    return MortgageType.UNINSURED


def _term_months(text: str) -> Optional[int]:
    match = _TERM_RE.search(text)
    if not match:
        return None
    count = int(match.group(1))
    unit = match.group(2).lower()
    if unit.startswith("month"):
        if count in (6, 12, 18, 24):
            return count
        return None
    if 1 <= count <= 10:
        return count * 12
    return None


def _is_open_term(text: str) -> bool:
    lowered = text.lower()
    return bool(re.search(r"\bopen\b", lowered)) and "closed" not in lowered


def _bounded_rate(text: str) -> Optional[Decimal]:
    match = _RATE_RE.search(text or "")
    if not match:
        return None
    rate = Decimal(match.group(1))
    if Decimal("2") <= rate <= Decimal("10"):
        return rate
    return None


def _strip_tags(fragment: str) -> str:
    text = re.sub(r"(?is)<(script|style|noscript).*?</\1>", " ", fragment)
    text = re.sub(r"(?is)<br\s*/?>", " ", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def _raw_rate(
    *,
    term_months: int,
    rate_type: RateType,
    mortgage_type: MortgageType,
    rate: Decimal,
    product: str,
    featured: bool,
    offer: str,
    source_url: str,
    scraped_at: datetime,
    extraction_method: str,
    effective_date: Optional[str],
    posted_rate: Optional[Decimal],
) -> RawRate:
    raw_data = {
        "source": ManulifeBankScraper.LIVE_SOURCE,
        "product": product,
        "featured": featured,
        "offer": offer,
        "extraction_method": extraction_method,
    }
    if effective_date:
        raw_data["effective_date"] = effective_date
    return RawRate(
        lender_slug=ManulifeBankScraper.LENDER_SLUG,
        lender_name=ManulifeBankScraper.LENDER_NAME,
        term_months=term_months,
        rate_type=rate_type,
        mortgage_type=mortgage_type,
        rate=rate,
        posted_rate=posted_rate,
        source_url=source_url,
        scraped_at=scraped_at,
        raw_data=raw_data,
    )


def _dedupe(rates: List[RawRate]) -> List[RawRate]:
    """Drop identical term/type/rate rows. Keep a special ahead of the same posted rate."""
    chosen = {}
    order = []
    for rate in rates:
        key = (
            rate.term_months,
            rate.rate_type.value,
            rate.mortgage_type.value if rate.mortgage_type else "",
            str(rate.rate),
        )
        if key not in chosen:
            chosen[key] = rate
            order.append(key)
            continue
        current_featured = bool((chosen[key].raw_data or {}).get("featured"))
        new_featured = bool((rate.raw_data or {}).get("featured"))
        if new_featured and not current_featured:
            chosen[key] = rate
    deduped = [chosen[key] for key in order]
    deduped.sort(key=lambda rate: (
        rate.term_months,
        rate.rate_type.value,
        rate.mortgage_type.value if rate.mortgage_type else "",
        rate.rate,
    ))
    return deduped


if __name__ == "__main__":
    scraper = ManulifeBankScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Manulife Bank:")
        print("-" * 72)
        for rate in rates:
            years = rate.term_months / 12
            product = (rate.raw_data or {}).get("product", "")
            source = (rate.raw_data or {}).get("source", "")
            effective = (rate.raw_data or {}).get("effective_date", "")
            featured = " [FEATURED]" if (rate.raw_data or {}).get("featured") else ""
            print(
                f"  {rate.mortgage_type.value:10} {years:g}yr {rate.rate_type.value:8} "
                f"{rate.rate}%{featured}  {source}  {effective}"
            )
            if product:
                print(f"    {product}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
