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

SKIP_POSTED_PRODUCTS = {
    "N.H.A. RESIDENTIAL, ETC",
    "CONVENTIONAL COTTAGE/LEISURE - TYPE B",
    "ULTIMATE VARIABLE RATE CAP (MAXIMUM)",
    "RIGHT RATE MORTGAGE",
}


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
            if rates:
                logger.success(f"Successfully scraped {len(rates)} live rates from Scotiabank")
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")

        logger.info("Using fallback rates from Scotiabank website (Jul 19, 2026)")
        return self._get_fallback_rates()

    def _scrape_from_api(self) -> List[RawRate]:
        posted = fetch_json(
            POSTED_API,
            timeout=15.0,
            headers={"Referer": self.RATE_URL, "Origin": "https://www.scotiabank.com"},
        )
        promo = fetch_json(
            PROMO_API,
            timeout=15.0,
            headers={"Referer": self.RATE_URL, "Origin": "https://www.scotiabank.com"},
        )
        rates: List[RawRate] = []
        if isinstance(posted, dict) and posted.get("success"):
            rates.extend(self._parse_posted(posted))
        if isinstance(promo, dict) and promo.get("success"):
            rates.extend(self._parse_promo(promo))
        return rates

    def _parse_posted(self, payload: dict) -> List[RawRate]:
        as_of = payload.get("update_time") or payload.get("run_date")
        rates: List[RawRate] = []
        seen = set()
        for product in payload.get("data") or []:
            name = (product.get("PRODUCT") or "").strip()
            if name in SKIP_POSTED_PRODUCTS:
                continue
            is_open = name == "OPEN"
            is_variable = "VARIABLE" in name.upper()
            terms = product.get("TERMS") or []
            if not terms and product.get("RATE") is not None:
                terms = [{"TERM_VALUE": "5", "TERM_UNIT": "Y", "RATE": product["RATE"]}]
            for term in terms:
                term_months = self._term_months(term.get("TERM_VALUE"), term.get("TERM_UNIT"))
                rate = self._as_rate(term.get("RATE"))
                if not term_months or rate is None:
                    continue
                # 3% "Right Rate" style program values are not advertised mortgage rates
                if rate < Decimal("3.50"):
                    continue
                rate_type = RateType.VARIABLE if is_variable else RateType.FIXED
                key = (term_months, rate_type, is_open, str(rate), name)
                if key in seen:
                    continue
                seen.add(key)
                rates.append(
                    RawRate(
                        lender_slug=self.LENDER_SLUG,
                        lender_name=self.LENDER_NAME,
                        term_months=term_months,
                        rate_type=rate_type,
                        mortgage_type=MortgageType.UNINSURED,
                        rate=rate,
                        source_url=self.RATE_URL,
                        scraped_at=self.scraped_at,
                        raw_data={
                            "source": "scotiabank_live_scrape",
                            "extraction_method": "dmtsms_nonspecialmortgage",
                            "product": name,
                            "section": "posted",
                            "posted": True,
                            "is_open": is_open,
                            "as_of": as_of,
                            "featured": False,
                        },
                    )
                )
        return rates

    def _parse_promo(self, payload: dict) -> List[RawRate]:
        as_of = payload.get("update_time") or payload.get("run_date")
        rates: List[RawRate] = []
        for product in payload.get("data") or []:
            name = (product.get("PRODUCT") or "").strip()
            meta = PROMO_PRODUCTS.get(name)
            rate = self._as_rate(product.get("RATE"))
            if not meta or rate is None:
                continue
            rates.append(
                RawRate(
                    lender_slug=self.LENDER_SLUG,
                    lender_name=self.LENDER_NAME,
                    term_months=meta["term"],
                    rate_type=meta["type"],
                    mortgage_type=MortgageType.UNINSURED,
                    rate=rate,
                    source_url=self.RATE_URL,
                    scraped_at=self.scraped_at,
                    raw_data={
                        "source": "scotiabank_live_scrape",
                        "extraction_method": "dmtsms_varmortgage",
                        "product": meta["product"],
                        "section": "special",
                        "posted": False,
                        "is_open": meta["is_open"],
                        "as_of": as_of,
                        "featured": meta["term"] == 60 and not meta["is_open"],
                    },
                )
            )
        return rates

    def _term_months(self, value, unit) -> Optional[int]:
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

    def _as_rate(self, value) -> Optional[Decimal]:
        try:
            rate = Decimal(str(value))
        except (InvalidOperation, ValueError, TypeError):
            return None
        if Decimal("1.50") <= rate <= Decimal("15.00"):
            return rate
        return None

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
