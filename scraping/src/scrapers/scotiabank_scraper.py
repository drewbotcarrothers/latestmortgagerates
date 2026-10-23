"""
Scotiabank mortgage rate scraper.

Primary source: Scotiabank's public dmtsms daily rates APIs (same feed
bns.dynamic-tokens uses on mortgages-rates.html). Works from datacenter IPs.

Fallbacks: Playwright on the public page, then dated posted rates (2026-07-19).
"""

import re
from decimal import Decimal, InvalidOperation
from typing import List, Optional
from datetime import datetime, timezone
from pathlib import Path

from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType

try:
    from .http_fetch import fetch_json
    from .rate_parse import fallback_rows_to_rates
    from .proxy_config import log_proxy_status, playwright_proxy
except ImportError:
    from http_fetch import fetch_json
    from rate_parse import fallback_rows_to_rates
    from proxy_config import log_proxy_status, playwright_proxy


POSTED_API = "https://dmtsms.scotiabank.com/api/rates/daily/nonspecialmortgage"
PROMO_API = "https://dmtsms.scotiabank.com/api/rates/daily/varmortgage"
PRIME_API = "https://dmtsms.scotiabank.com/api/rates/daily/prime"

# Widget ids on mortgages-rates.html mapped by bns-variable-mortgage-rates.
PROMO_PRODUCTS = {
    "MORTGAGE PROMOTIONAL 1": {
        "term": 60,
        "type": RateType.FIXED,
        "product": "Scotia Flex Value Mortgage-Closed 5 Year Term",
        "is_open": False,
    },
    "MORTGAGE PROMOTIONAL 2": {
        "term": 36,
        "type": RateType.VARIABLE,
        "product": "Scotia Ultimate Variable Rate Mortgage - 3 Year Closed Term",
        "is_open": False,
    },
    "MORTGAGE PROMOTIONAL 3": {
        "term": 60,
        "type": RateType.VARIABLE,
        "product": "Scotia Flex Value Mortgage-Open 5 Year Term",
        "is_open": True,
    },
}

CONVENTIONAL_PRODUCT = "CONVENTIONAL RESIDENTIAL, ETC"
STANDARD_TERMS = (12, 24, 36, 48, 60, 72, 84, 120)


def _term_months(value, unit) -> Optional[int]:
    try:
        amount = int(str(value))
    except (TypeError, ValueError):
        return None
    unit = (unit or "Y").upper()
    if unit.startswith("M"):
        return amount if amount in (6, 12, 18, 24) else None
    if 1 <= amount <= 10:
        return amount * 12
    return None


def _as_rate(value) -> Optional[Decimal]:
    try:
        rate = Decimal(str(value))
    except (InvalidOperation, ValueError, TypeError):
        return None
    if Decimal("1.50") <= rate <= Decimal("15.00"):
        return rate
    return None


def _scotia_row(
    term_months: int,
    rate_type: RateType,
    rate: Decimal,
    posted_rate: Optional[Decimal],
    section: str,
    product: str,
    extraction_method: str,
    as_of,
    scraped_at: datetime,
    source_url: str,
    featured: bool,
) -> RawRate:
    return RawRate(
        lender_slug="scotiabank",
        lender_name="Scotiabank",
        term_months=term_months,
        rate_type=rate_type,
        mortgage_type=MortgageType.UNINSURED,
        rate=rate,
        posted_rate=posted_rate,
        source_url=source_url,
        scraped_at=scraped_at,
        raw_data={
            "source": "scotiabank_live_scrape",
            "extraction_method": extraction_method,
            "product": product,
            "section": section,
            "posted": section == "posted",
            "is_open": False,
            "as_of": as_of,
            "featured": featured,
        },
    )


def build_scotia_rates(
    posted_payload: dict,
    promo_payload: dict,
    scraped_at: datetime,
    source_url: str,
) -> List[RawRate]:
    """
    Conventional closed fixed terms are the posted shelf. The 5-year flex
    special (varmortgage promotional 1) keeps that shelf on posted_rate.
    Other fixed terms are shelf-only. The public 3-year variable column is
    labelled Posted Rate and is fed by promotional 2, so that rate is stored
    as both rate and posted_rate.

    The nonspecial feed also has ULTIMATE VARIABLE RATE at prime. That number
    is not on the rendered mortgages-rates widgets, so it is not published.
    """
    posted_as_of = None
    shelves: dict = {}
    if isinstance(posted_payload, dict) and posted_payload.get("success"):
        posted_as_of = posted_payload.get("update_time") or posted_payload.get("run_date")
        for product in posted_payload.get("data") or []:
            name = (product.get("PRODUCT") or "").strip()
            if name == "ULTIMATE VARIABLE RATE":
                for term in product.get("TERMS") or []:
                    logger.info(
                        "Scotiabank nonspecial ULTIMATE VARIABLE RATE "
                        f"{term.get('RATE')}% is not the public posted column. "
                        "mortgages-rates.html labels promotional 2 as Posted Rate."
                    )
                continue
            if name != CONVENTIONAL_PRODUCT:
                continue
            for term in product.get("TERMS") or []:
                months = _term_months(term.get("TERM_VALUE"), term.get("TERM_UNIT"))
                rate = _as_rate(term.get("RATE"))
                if months not in STANDARD_TERMS or rate is None:
                    continue
                shelves[(months, RateType.FIXED)] = rate

    promo_as_of = None
    promos = []
    if isinstance(promo_payload, dict) and promo_payload.get("success"):
        promo_as_of = promo_payload.get("update_time") or promo_payload.get("run_date")
        for product in promo_payload.get("data") or []:
            name = (product.get("PRODUCT") or "").strip()
            meta = PROMO_PRODUCTS.get(name)
            rate = _as_rate(product.get("RATE"))
            if not meta or rate is None:
                continue
            if meta["is_open"]:
                logger.info(f"Skipping open Scotiabank promo {name} at {rate}%")
                continue
            promos.append((meta, rate))

    rates: List[RawRate] = []
    covered = set()
    for meta, rate in promos:
        key = (meta["term"], meta["type"])
        if meta["type"] == RateType.VARIABLE:
            rates.append(
                _scotia_row(
                    meta["term"],
                    meta["type"],
                    rate,
                    rate,
                    "posted",
                    meta["product"],
                    "dmtsms_varmortgage",
                    promo_as_of,
                    scraped_at,
                    source_url,
                    False,
                )
            )
            covered.add(key)
            continue
        shelf = shelves.get(key)
        section = "special" if shelf and rate < shelf else "posted"
        rates.append(
            _scotia_row(
                meta["term"],
                meta["type"],
                rate,
                shelf if shelf else rate,
                section,
                meta["product"],
                "dmtsms_varmortgage",
                promo_as_of,
                scraped_at,
                source_url,
                meta["term"] == 60,
            )
        )
        covered.add(key)

    for (months, rate_type), shelf in shelves.items():
        if (months, rate_type) in covered:
            continue
        years = months // 12
        rates.append(
            _scotia_row(
                months,
                rate_type,
                shelf,
                shelf,
                "posted",
                f"{years} Year Fixed Posted",
                "dmtsms_nonspecialmortgage",
                posted_as_of,
                scraped_at,
                source_url,
                False,
            )
        )
    if not shelves:
        logger.warning(
            "Scotiabank conventional posted shelf was empty; "
            "posted_rate left unset where no previous shelf can be copied"
        )
    return rates


class ScotiabankScraper:
    """Scraper for Scotiabank mortgage rates."""

    LENDER_SLUG = "scotiabank"
    LENDER_NAME = "Scotiabank"
    RATE_URL = "https://www.scotiabank.com/ca/en/personal/rates-prices/mortgages-rates.html"

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching Scotiabank rates...")
        log_proxy_status("Scotiabank")

        try:
            rates = self._scrape_from_api()
            if rates:
                logger.success(f"Scotiabank first-party API returned {len(rates)} live rates")
                return rates
        except Exception as e:
            logger.warning(f"Scotiabank API scrape failed: {e}")

        try:
            rates = self._scrape_with_playwright()
            has_five_year_posted = any(
                rate.posted_rate and rate.term_months == 60 and rate.rate_type == RateType.FIXED
                for rate in rates
            )
            if rates and has_five_year_posted:
                logger.success(f"Successfully scraped {len(rates)} live rates from Scotiabank")
                return rates
            if rates:
                logger.warning(
                    "Scotiabank Playwright rows had no 5-year posted shelf. "
                    "Discarding them so existing rows are kept."
                )
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")

        logger.warning(
            "Scotiabank live scrape failed or returned no rates. "
            "Returning no rates so existing Scotiabank rows are kept."
        )
        return []

    def _scrape_from_api(self) -> List[RawRate]:
        headers = {"Referer": self.RATE_URL, "Origin": "https://www.scotiabank.com"}
        posted = fetch_json(POSTED_API, timeout=15.0, headers=headers)
        promo = fetch_json(PROMO_API, timeout=15.0, headers=headers)
        return build_scotia_rates(posted or {}, promo or {}, self.scraped_at, self.RATE_URL)

    def _scrape_with_playwright(self) -> List[RawRate]:
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            logger.warning("Playwright not available")
            return []

        try:
            launch_kwargs = {"headless": True}
            proxy = playwright_proxy()
            if proxy:
                launch_kwargs["proxy"] = proxy
            with sync_playwright() as p:
                browser = p.chromium.launch(**launch_kwargs)
                page = browser.new_page()
                page.goto(self.RATE_URL, wait_until="domcontentloaded", timeout=25000)
                page.wait_for_timeout(2000)
                rates = []
                rows = page.query_selector_all("table tbody tr")
                for row in rows:
                    cells = row.query_selector_all("td")
                    if len(cells) < 2:
                        continue
                    term_text = cells[0].inner_text().strip()
                    rate_text = cells[1].inner_text().strip()
                    term_match = re.search(r"(\d+)\s*(?:Year|Yr)", term_text, re.IGNORECASE)
                    if not term_match:
                        continue
                    term_months = int(term_match.group(1)) * 12
                    rate_match = re.search(r"(\d+\.?\d*)\s*%", rate_text)
                    if not rate_match:
                        continue
                    rate = Decimal(rate_match.group(1))
                    rate_type = RateType.VARIABLE if "variable" in term_text.lower() else RateType.FIXED
                    mortgage_type = (
                        MortgageType.INSURED
                        if "insured" in term_text.lower() or "high-ratio" in term_text.lower()
                        else MortgageType.UNINSURED
                    )
                    is_posted = "posted" in term_text.lower() or rate > Decimal("6.0")
                    rates.append(
                        RawRate(
                            lender_slug=self.LENDER_SLUG,
                            lender_name=self.LENDER_NAME,
                            term_months=term_months,
                            rate_type=rate_type,
                            mortgage_type=mortgage_type,
                            rate=rate,
                            source_url=self.RATE_URL,
                            scraped_at=self.scraped_at,
                            raw_data={
                                "source": "scotiabank_live_scrape",
                                "posted": is_posted,
                                "section": "posted" if is_posted else "special",
                                "term_text": term_text,
                                "rate_text": rate_text,
                            },
                        )
                    )
                browser.close()
                return rates
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return []

    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Fallback rates from Scotiabank website (July 19, 2026).
        NOTE: Scotiabank shows posted rates prominently. Special rates require login.
        Used only when the first-party API and page scrape fail.
        """
        fallback_data = [
            {"term": 6, "type": RateType.FIXED, "rate": "6.45", "mortgage_type": "uninsured", "product": "6 Month Fixed (Posted)", "posted": True},
            {"term": 12, "type": RateType.FIXED, "rate": "5.59", "mortgage_type": "uninsured", "product": "1 Year Fixed (Posted)", "posted": True},
            {"term": 12, "type": RateType.FIXED, "rate": "9.50", "mortgage_type": "uninsured", "product": "1 Year Open Fixed", "posted": True},
            {"term": 24, "type": RateType.FIXED, "rate": "4.89", "mortgage_type": "uninsured", "product": "2 Year Fixed (Posted)", "posted": True},
            {"term": 36, "type": RateType.FIXED, "rate": "5.80", "mortgage_type": "uninsured", "product": "3 Year Fixed (Posted)", "posted": True},
            {"term": 36, "type": RateType.VARIABLE, "rate": "5.70", "mortgage_type": "uninsured", "product": "3 Year Variable (Posted)", "posted": True},
            {"term": 48, "type": RateType.FIXED, "rate": "5.74", "mortgage_type": "uninsured", "product": "4 Year Fixed (Posted)", "posted": True},
            {"term": 60, "type": RateType.FIXED, "rate": "5.84", "mortgage_type": "uninsured", "product": "5 Year Fixed (Posted)", "posted": True, "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.65", "mortgage_type": "uninsured", "product": "5 Year Variable Closed", "posted": False},
            {"term": 60, "type": RateType.VARIABLE, "rate": "7.40", "mortgage_type": "uninsured", "product": "5 Year Variable Open", "posted": True},
            {"term": 84, "type": RateType.FIXED, "rate": "6.15", "mortgage_type": "uninsured", "product": "7 Year Fixed (Posted)", "posted": True},
            {"term": 120, "type": RateType.FIXED, "rate": "6.55", "mortgage_type": "uninsured", "product": "10 Year Fixed (Posted)", "posted": True},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="scotiabank_fallback_2026-07-19",
            last_verified="2026-07-19",
        )


if __name__ == "__main__":
    scraper = ScotiabankScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from Scotiabank:")
        print("-" * 60)
        for r in sorted(rates, key=lambda x: (x.term_months, x.rate_type.value)):
            years = r.term_months // 12
            product = (r.raw_data or {}).get("product", "")
            is_posted = (r.raw_data or {}).get("posted", False)
            posted_str = " [POSTED]" if is_posted else ""
            print(f"  {years:3}yr {r.rate_type.value:8} {r.rate}%{posted_str}  {product}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
