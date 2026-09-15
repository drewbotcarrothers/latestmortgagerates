"""
BMO mortgage rate scraper.

Primary source: BMO's public-data JSON feeds (same files the
mortgage-rates page hydrates via datacode placeholders):

  - specials: /public-data/api/v2.0/bmo-ca-mortgages-rates.json
  - posted:   /public-data/api/epm/v1.0/bmo-epm-mortgage.json

bmo.com fingerprint-blocks libcurl, httpx, and Playwright Chromium
(HTTP/2 INTERNAL_ERROR / HTTP/1.1 0-byte stall). Safari on macOS loads
the page. Fetch order:

  1. curl_cffi Safari TLS impersonation (no browser)
  2. Playwright WebKit API request (Safari-like; preferred on macOS)
  3. Playwright Chromium API request
  4. Playwright HTML (WebKit then Chromium; longer goto timeouts)
  5. Dated specials last resort
"""

from __future__ import annotations

import re
import sys
from decimal import Decimal, InvalidOperation
from typing import Any, Dict, List, Optional, Tuple
from datetime import datetime, timezone
from pathlib import Path

from loguru import logger

sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType

try:
    from .rate_parse import extract_rates_from_html, fallback_rows_to_rates
    from .http_fetch import fetch_html
    from .proxy_config import log_proxy_status, playwright_proxy, proxy_enabled
    from .safari_fetch import SAFARI_UA, fetch_html_safari, fetch_json_safari
except ImportError:
    from rate_parse import extract_rates_from_html, fallback_rows_to_rates
    from http_fetch import fetch_html
    from proxy_config import log_proxy_status, playwright_proxy, proxy_enabled
    from safari_fetch import SAFARI_UA, fetch_html_safari, fetch_json_safari


SPECIALS_API = "https://www.bmo.com/public-data/api/v2.0/bmo-ca-mortgages-rates.json"
POSTED_API = "https://www.bmo.com/public-data/api/epm/v1.0/bmo-epm-mortgage.json"

# Keys the public specials JSON uses for advertised consumer rates
# (matches the four cards on the mortgage-rates page).
SPECIAL_PRODUCTS: Dict[str, Dict[str, Any]] = {
    "fixed3YearClosedSpecial": {
        "term": 36,
        "rate_type": RateType.FIXED,
        "mortgage_type": MortgageType.UNINSURED,
        "product": "3-Year Fixed Special",
        "featured": True,
    },
    "smartFixed5YearClosedHighRatioSpecial": {
        "term": 60,
        "rate_type": RateType.FIXED,
        "mortgage_type": MortgageType.INSURED,
        "product": "5-Year Smart Fixed (Insured)",
        "featured": True,
    },
    "smartFixed5YearClosedSpecial": {
        "term": 60,
        "rate_type": RateType.FIXED,
        "mortgage_type": MortgageType.UNINSURED,
        "product": "5-Year Smart Fixed (Uninsured)",
        "featured": True,
    },
    "variable5YearClosedSpecial": {
        "term": 60,
        "rate_type": RateType.VARIABLE,
        "mortgage_type": MortgageType.UNINSURED,
        "product": "5-Year Variable Special",
        "featured": True,
    },
}

# Posted closed products from the EPM feed. Skip open / HELOC / junk keys.
SKIP_POSTED_KEYS = {
    "6MonthOpen",
    "6MonthConvertible",
    "1YearOpen",
    "18YearOpen",
    "12VariableLimited",
    "12VariableOpen",
    "3YearOpen",
}

SAFARI_CONTEXT = {
    "user_agent": SAFARI_UA,
    "viewport": {"width": 1440, "height": 900},
    "locale": "en-CA",
    "timezone_id": "America/Toronto",
    "extra_http_headers": {
        "Accept-Language": "en-CA,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    "device_scale_factor": 2.0,
    "is_mobile": False,
    "has_touch": False,
}


def _parse_rate_value(value: Any) -> Optional[Decimal]:
    if value is None or value == "":
        return None
    try:
        rate = Decimal(str(value).strip().rstrip("%"))
    except (InvalidOperation, ValueError, AttributeError):
        return None
    if rate <= Decimal("0") or rate < Decimal("2.00") or rate > Decimal("10.50"):
        return None
    return rate


def parse_specials_payload(payload: Any) -> List[Tuple[str, Decimal, Dict[str, Any]]]:
    """Return (key, rate, meta) for advertised specials. Ignores APR keys."""
    if not isinstance(payload, dict):
        return []
    found: List[Tuple[str, Decimal, Dict[str, Any]]] = []
    for key, meta in SPECIAL_PRODUCTS.items():
        rate = _parse_rate_value(payload.get(key))
        if rate is None:
            continue
        found.append((key, rate, meta))
    return found


def parse_posted_payload(payload: Any) -> List[Tuple[str, int, RateType, Decimal, str]]:
    """Return (key, term_months, rate_type, rate, product) for posted closed rates."""
    if not isinstance(payload, dict):
        return []
    mortgage_rates = payload.get("mortgageRates")
    if not isinstance(mortgage_rates, dict):
        return []

    rows: List[Tuple[str, int, RateType, Decimal, str]] = []
    for bucket, rate_type in (("fixed", RateType.FIXED), ("variable", RateType.VARIABLE)):
        products = mortgage_rates.get(bucket)
        if not isinstance(products, dict):
            continue
        for key, item in products.items():
            if key in SKIP_POSTED_KEYS or not isinstance(item, dict):
                continue
            if "open" in key.lower():
                continue
            rate = _parse_rate_value(item.get("value"))
            if rate is None:
                continue
            try:
                term_months = int(str(item.get("term_months") or "0"))
            except (TypeError, ValueError):
                continue
            if term_months not in (12, 24, 36, 48, 60, 72, 84, 120):
                continue
            label = (item.get("en") or key).strip()
            product = f"{label} Posted Closed" if "posted" not in label.lower() else label
            rows.append((key, term_months, rate_type, rate, product))
    return rows


class BMOScraper:
    """Scraper for BMO mortgage rates."""

    LENDER_SLUG = "bmo"
    LENDER_NAME = "Bank of Montreal"
    RATE_URL = "https://www.bmo.com/en-ca/main/personal/mortgages/mortgage-rates/"
    NAV_TIMEOUT_MS = 60000

    def __init__(self):
        self.scraped_at = datetime.now(timezone.utc)

    def scrape(self) -> List[RawRate]:
        logger.info("Fetching BMO rate page...")
        log_proxy_status("BMO")

        try:
            rates = self._scrape_from_api()
            if rates:
                logger.success(
                    f"Successfully scraped {len(rates)} live rates from BMO "
                    f"(bmo_live_scrape, public_data_api)"
                )
                return rates
        except Exception as e:
            logger.warning(f"BMO first-party JSON scrape failed: {e}")

        try:
            rates = self._scrape_with_playwright()
            if rates:
                logger.success(
                    f"Successfully scraped {len(rates)} live rates from BMO "
                    f"(bmo_live_scrape, playwright)"
                )
                return rates
        except Exception as e:
            logger.warning(f"Playwright scraping failed: {e}")

        try:
            html = fetch_html_safari(self.RATE_URL, timeout=25.0)
            if not html:
                html = fetch_html(self.RATE_URL, timeout=20.0 if proxy_enabled() else 8.0)
            if html:
                rates = extract_rates_from_html(
                    html,
                    lender_slug=self.LENDER_SLUG,
                    lender_name=self.LENDER_NAME,
                    source_url=self.RATE_URL,
                    scraped_at=self.scraped_at,
                    source="bmo_live_scrape",
                    extraction_method="http_html",
                )
                rates = [r for r in rates if self._looks_like_mortgage_rate(r)]
                if rates:
                    logger.success(
                        f"HTTP scrape found {len(rates)} BMO rates (bmo_live_scrape)"
                    )
                    return rates
        except Exception as e:
            logger.warning(f"BMO HTTP scrape failed: {e}")

        logger.warning(
            "BMO live scrape blocked or empty. "
            "Using verified public special/posted rates from 2026-09-14."
        )
        return self._get_fallback_rates()

    def _looks_like_mortgage_rate(self, rate: RawRate) -> bool:
        if "RDS%" in (rate.raw_data or {}).get("context", ""):
            return False
        return Decimal("2.00") <= rate.rate <= Decimal("10.50")

    def _scrape_from_api(self) -> List[RawRate]:
        json_headers = {"Referer": self.RATE_URL, "Origin": "https://www.bmo.com"}
        specials = fetch_json_safari(SPECIALS_API, timeout=25.0, headers=json_headers)
        posted = fetch_json_safari(POSTED_API, timeout=25.0, headers=json_headers)
        method = "public_data_api"
        rates = self._rates_from_payloads(specials, posted, method)
        if parse_specials_payload(specials) and rates:
            return rates

        logger.info("BMO JSON incomplete via curl_cffi; trying Playwright WebKit/Chromium request")
        pw_specials, pw_posted = self._playwright_get_both_json()
        if parse_specials_payload(pw_specials):
            specials = pw_specials
            method = "playwright_request"
        if parse_posted_payload(pw_posted):
            posted = pw_posted
            method = "playwright_request"
        return self._rates_from_payloads(specials, posted, method)

    def _rates_from_payloads(
        self,
        specials: Any,
        posted: Any,
        extraction_method: str,
    ) -> List[RawRate]:
        rates: List[RawRate] = []
        seen = set()

        for key, rate, meta in parse_specials_payload(specials):
            dedupe = (meta["term"], meta["rate_type"], meta["mortgage_type"], str(rate))
            if dedupe in seen:
                continue
            seen.add(dedupe)
            rates.append(
                RawRate(
                    lender_slug=self.LENDER_SLUG,
                    lender_name=self.LENDER_NAME,
                    term_months=meta["term"],
                    rate_type=meta["rate_type"],
                    mortgage_type=meta["mortgage_type"],
                    rate=rate,
                    source_url=self.RATE_URL,
                    scraped_at=self.scraped_at,
                    raw_data={
                        "source": "bmo_live_scrape",
                        "extraction_method": extraction_method,
                        "api": "bmo-ca-mortgages-rates",
                        "datacode": key,
                        "product": meta["product"],
                        "featured": meta["featured"],
                    },
                )
            )

        for key, term_months, rate_type, rate, product in parse_posted_payload(posted):
            dedupe = (term_months, rate_type, MortgageType.UNINSURED, str(rate))
            if dedupe in seen:
                continue
            seen.add(dedupe)
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
                        "source": "bmo_live_scrape",
                        "extraction_method": extraction_method,
                        "api": "bmo-epm-mortgage",
                        "product_key": key,
                        "product": product,
                        "featured": False,
                    },
                )
            )

        if rates:
            logger.info(
                f"BMO JSON parsed {len(parse_specials_payload(specials))} specials + "
                f"{len(parse_posted_payload(posted))} posted -> {len(rates)} rates "
                f"via {extraction_method}"
            )
        return rates

    def _playwright_engines(self, playwright) -> List[str]:
        """WebKit first (Safari-like TLS), then Chromium."""
        available = []
        for name in ("webkit", "chromium"):
            if getattr(playwright, name, None) is not None:
                available.append(name)
        return available

    def _launch_kwargs(self, engine: str) -> dict:
        kwargs: dict = {"headless": True}
        proxy = playwright_proxy()
        if proxy:
            kwargs["proxy"] = proxy
        if engine == "chromium":
            # Do not --disable-http2: HTTP/1.1 to bmo.com stalls at 0 bytes.
            kwargs["args"] = ["--disable-blink-features=AutomationControlled"]
        return kwargs

    def _playwright_get_both_json(self) -> Tuple[Optional[Any], Optional[Any]]:
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            return None, None
        try:
            with sync_playwright() as p:
                for engine in self._playwright_engines(p):
                    browser = None
                    try:
                        launcher = getattr(p, engine)
                        browser = launcher.launch(**self._launch_kwargs(engine))
                        context = browser.new_context(**SAFARI_CONTEXT)
                        specials = posted = None
                        for url, slot in ((SPECIALS_API, "specials"), (POSTED_API, "posted")):
                            response = context.request.get(
                                url,
                                timeout=self.NAV_TIMEOUT_MS,
                                headers={
                                    "Accept": "application/json, text/plain, */*",
                                    "Referer": self.RATE_URL,
                                },
                            )
                            if response.ok:
                                payload = response.json()
                                if slot == "specials":
                                    specials = payload
                                else:
                                    posted = payload
                        if specials or posted:
                            logger.info(f"BMO {engine} fetched specials/posted JSON")
                            return specials, posted
                    except Exception as e:
                        logger.warning(f"BMO {engine} combined JSON request failed: {e}")
                    finally:
                        if browser:
                            browser.close()
        except Exception as e:
            logger.warning(f"Playwright combined JSON fetch failed: {e}")
        return None, None

    def _scrape_with_playwright(self) -> List[RawRate]:
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            logger.warning("Playwright not available")
            return []

        try:
            with sync_playwright() as p:
                for engine in self._playwright_engines(p):
                    rates = self._scrape_html_with_engine(p, engine)
                    if rates:
                        return rates
            return []
        except Exception as e:
            logger.error(f"Playwright error: {e}")
            return []

    def _scrape_html_with_engine(self, playwright, engine: str) -> List[RawRate]:
        browser = None
        timeout_ms = self.NAV_TIMEOUT_MS
        try:
            launcher = getattr(playwright, engine)
            browser = launcher.launch(**self._launch_kwargs(engine))
            context = browser.new_context(**SAFARI_CONTEXT)
            page = context.new_page()
            page.set_default_navigation_timeout(timeout_ms)

            last_error = None
            navigated = False
            for wait_until in ("commit", "domcontentloaded", "load"):
                try:
                    logger.info(
                        f"BMO {engine} goto wait_until={wait_until} timeout={timeout_ms}ms"
                    )
                    page.goto(self.RATE_URL, wait_until=wait_until, timeout=timeout_ms)
                    navigated = True
                    break
                except Exception as e:
                    last_error = e
                    logger.warning(f"BMO {engine} goto wait_until={wait_until} failed: {e}")
            if not navigated:
                logger.error(f"BMO {engine} navigation failed: {last_error}")
                return []

            try:
                page.wait_for_function(
                    r"() => /\d+\.\d+\s*%/.test(document.body.innerText)",
                    timeout=15000,
                )
            except Exception:
                page.wait_for_timeout(4000)

            html = page.content()
            text = page.locator("body").inner_text()
        finally:
            if browser:
                browser.close()

        combined = html + "\n" + text
        rates = extract_rates_from_html(
            combined,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="bmo_live_scrape",
            extraction_method=f"playwright_{engine}",
        )
        if not rates:
            rates = self._extract_special_blocks(text)
            for rate in rates:
                if rate.raw_data is not None:
                    rate.raw_data["extraction_method"] = f"playwright_{engine}_special_block"
        cleaned = [r for r in rates if self._looks_like_mortgage_rate(r)]
        if cleaned:
            logger.info(f"BMO {engine} HTML scrape found {len(cleaned)} rates")
        return cleaned

    def _extract_special_blocks(self, page_text: str) -> List[RawRate]:
        rates: List[RawRate] = []
        pattern = re.compile(
            r"(\d+)\s*Year\s+(Smart\s+)?(Fixed|Variable)[^\n]{0,80}?(\d+\.\d+)\s*%",
            re.IGNORECASE,
        )
        for match in pattern.finditer(page_text):
            years = int(match.group(1))
            rate_type = RateType.VARIABLE if match.group(3).lower() == "variable" else RateType.FIXED
            rate = Decimal(match.group(4))
            context = match.group(0)
            mortgage_type = (
                MortgageType.INSURED
                if "insured" in context.lower()
                or "smart" in context.lower()
                and "default" in context.lower()
                else MortgageType.UNINSURED
            )
            rates.append(
                RawRate(
                    lender_slug=self.LENDER_SLUG,
                    lender_name=self.LENDER_NAME,
                    term_months=years * 12,
                    rate_type=rate_type,
                    mortgage_type=mortgage_type,
                    rate=rate,
                    source_url=self.RATE_URL,
                    scraped_at=self.scraped_at,
                    raw_data={
                        "source": "bmo_live_scrape",
                        "extraction_method": "special_block",
                        "context": context[:180],
                    },
                )
            )
        return rates

    def _get_fallback_rates(self) -> List[RawRate]:
        """
        Special and closed posted rates published by BMO.

        Verified 2026-09-14 via NerdWallet's BMO table, which cites www.bmo.com
        as the source. Special/Smart rates are the advertised consumer rates.
        """
        fallback_data = [
            {"term": 36, "type": RateType.FIXED, "rate": "4.64", "mortgage_type": "uninsured", "product": "3-Year Fixed Special", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.74", "mortgage_type": "insured", "product": "5-Year Smart Fixed (Insured)", "featured": True},
            {"term": 60, "type": RateType.FIXED, "rate": "4.84", "mortgage_type": "uninsured", "product": "5-Year Smart Fixed (Uninsured)", "featured": True},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.10", "mortgage_type": "uninsured", "product": "5-Year Variable Special", "featured": True},
            {"term": 12, "type": RateType.FIXED, "rate": "5.49", "mortgage_type": "uninsured", "product": "1-Year Fixed Posted Closed"},
            {"term": 24, "type": RateType.FIXED, "rate": "4.89", "mortgage_type": "uninsured", "product": "2-Year Fixed Posted Closed"},
            {"term": 36, "type": RateType.FIXED, "rate": "6.05", "mortgage_type": "uninsured", "product": "3-Year Fixed Posted Closed"},
            {"term": 48, "type": RateType.FIXED, "rate": "5.99", "mortgage_type": "uninsured", "product": "4-Year Fixed Posted Closed"},
            {"term": 60, "type": RateType.FIXED, "rate": "6.09", "mortgage_type": "uninsured", "product": "5-Year Fixed Posted Closed"},
            {"term": 60, "type": RateType.VARIABLE, "rate": "4.45", "mortgage_type": "uninsured", "product": "5-Year Variable Posted Closed"},
            {"term": 84, "type": RateType.FIXED, "rate": "6.40", "mortgage_type": "uninsured", "product": "7-Year Fixed Posted Closed"},
            {"term": 120, "type": RateType.FIXED, "rate": "6.80", "mortgage_type": "uninsured", "product": "10-Year Fixed Posted Closed"},
        ]
        return fallback_rows_to_rates(
            fallback_data,
            lender_slug=self.LENDER_SLUG,
            lender_name=self.LENDER_NAME,
            source_url=self.RATE_URL,
            scraped_at=self.scraped_at,
            source="bmo_fallback_2026-09-14",
            last_verified="2026-09-14",
        )


if __name__ == "__main__":
    scraper = BMOScraper()
    try:
        rates = scraper.scrape()
        print(f"\nScraped {len(rates)} rates from BMO:")
        print("-" * 60)
        for r in sorted(rates, key=lambda x: (x.mortgage_type.value, x.term_months, x.rate_type.value)):
            years = r.term_months / 12
            src = (r.raw_data or {}).get("source")
            method = (r.raw_data or {}).get("extraction_method")
            product = (r.raw_data or {}).get("product", "")
            print(
                f"  {r.mortgage_type.value:10} {years:g}yr {r.rate_type.value:8} "
                f"{r.rate}%  ({src}/{method}) {product}"
            )
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
