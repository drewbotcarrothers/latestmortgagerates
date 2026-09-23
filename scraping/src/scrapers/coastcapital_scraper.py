"""
Coast Capital Savings mortgage rate scraper.

Featured rates are server-rendered on the mortgages pages, but plain httpx
times out from this environment. A Safari TLS client gets the HTML. Each
card's headline figure is the only number published (the page marks it APR);
the product name is the following paragraph, before the tooltip.
"""

import re
from decimal import Decimal, InvalidOperation
from typing import List
from datetime import datetime, timezone
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType

try:
    from .http_fetch import fetch_html
    from .rate_parse import fallback_rows_to_rates, parse_term_months
    from .safari_fetch import fetch_html_safari
except ImportError:
    from http_fetch import fetch_html
    from rate_parse import fallback_rows_to_rates, parse_term_months
    from safari_fetch import fetch_html_safari


CARD_RE = re.compile(
    r"(?is)font-size:\s*36px[^>]*>(\d+\.\d+)\s*%.{0,500}?<p\b[^>]*>(.*?)</p>"
)


def _title_text(paragraph_html: str) -> str:
    without_tooltip = re.sub(r'(?is)<span class="tooltip-wrapper">.*', "", paragraph_html)
    without_tooltip = re.sub(r"(?is)<sup\b.*?</sup>", " ", without_tooltip)
    text = re.sub(r"<[^>]+>", " ", without_tooltip)
    return " ".join(text.split())


def parse_coastcapital_html(
    html: str,
    *,
    lender_slug: str,
    lender_name: str,
    source_url: str,
    scraped_at,
    extraction_method: str,
) -> List[RawRate]:
    if not html or "highlight" not in html.lower():
        return []
    rates: List[RawRate] = []
    seen = set()
    for match in CARD_RE.finditer(html):
        title = _title_text(match.group(2))
        term_months = parse_term_months(title)
        if not term_months:
            continue
        try:
            rate = Decimal(match.group(1))
        except (InvalidOperation, ValueError):
            continue
        if not (Decimal("1.50") <= rate <= Decimal("12.00")):
            continue
        lowered = title.lower()
        rate_type = RateType.VARIABLE if "variable" in lowered else RateType.FIXED
        mortgage_type = (
            MortgageType.INSURED
            if "high-ratio" in lowered or "high ratio" in lowered
            else MortgageType.UNINSURED
        )
        key = (term_months, rate_type, mortgage_type, str(rate))
        if key in seen:
            continue
        seen.add(key)
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
                    "source": "coastcapital_live_scrape",
                    "extraction_method": extraction_method,
                    "product": title,
                    "page_labels_figure_as": "APR",
                    "featured": True,
                },
            )
        )
    return rates


class CoastCapitalScraper:
    LENDER_SLUG = "coastcapital"
    LENDER_NAME = "Coast Capital Savings"
    RATE_URL = "https://www.coastcapitalsavings.com/mortgages"
    ALT_URL = "https://www.coastcapitalsavings.com/mortgages/buying-your-next-home"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching Coast Capital Savings rate page...")
        for url in (self.RATE_URL, self.ALT_URL):
            html = fetch_html_safari(url, timeout=25.0)
            method = "safari_tls"
            if not html:
                html = fetch_html(url, timeout=20.0)
                method = "http_html"
            if not html:
                logger.warning(f"Coast Capital fetch failed for {url}")
                continue
            rates = parse_coastcapital_html(
                html,
                lender_slug=self.LENDER_SLUG,
                lender_name=self.LENDER_NAME,
                source_url=url,
                scraped_at=self.scraped_at,
                extraction_method=method,
            )
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Coast Capital")
                return rates
            logger.warning(f"Coast Capital HTML from {url} contained no rate cards")
        logger.info("Using fallback rates from Coast Capital (2026-09-14)")
        return self._get_fallback_rates()

    def _get_fallback_rates(self) -> List[RawRate]:
        fallback_data = [
            {"term": 60, "type": RateType.FIXED, "rate": "4.06", "mortgage_type": "insured", "product": "5-Year Fixed High-Ratio", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.46", "mortgage_type": "uninsured", "product": "5-Year Fixed", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.81", "mortgage_type": "insured", "product": "5-Year Variable High-Ratio", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "3.96", "mortgage_type": "uninsured", "product": "5-Year Variable", "featured": True},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="coastcapital_fallback_2026-09-14",
            last_verified="2026-09-14",
        )


if __name__ == "__main__":
    scraper = CoastCapitalScraper()
    rates = scraper.scrape()
    print(f"Scraped {len(rates)} Coast Capital rates")
    for r in rates:
        print(f"  {r.mortgage_type.value:10} {r.term_months//12}yr {r.rate_type.value:8} {r.rate}% {(r.raw_data or {}).get('product')}")
