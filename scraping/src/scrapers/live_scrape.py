"""Try HTTP HTML first, then a short Playwright pass."""

from typing import List

from loguru import logger

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate

try:
    from .http_fetch import fetch_html
    from .rate_parse import extract_rates_from_html
except ImportError:
    from http_fetch import fetch_html
    from rate_parse import extract_rates_from_html


def scrape_live_rates(
    *,
    url: str,
    lender_slug: str,
    lender_name: str,
    scraped_at,
    source: str,
    http_timeout: float = 20.0,
    playwright_timeout_ms: int = 20000,
    wait_ms: int = 2500,
) -> List[RawRate]:
    html = fetch_html(url, timeout=http_timeout)
    if html:
        rates = extract_rates_from_html(
            html,
            lender_slug=lender_slug,
            lender_name=lender_name,
            source_url=url,
            scraped_at=scraped_at,
            source=source,
            extraction_method="http_html",
        )
        rates = [r for r in rates if "RDS%" not in (r.raw_data or {}).get("context", "")]
        if rates:
            logger.info(f"{lender_name}: {len(rates)} rates from HTTP HTML")
            return rates

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        return []

    try:
        from .proxy_config import playwright_proxy, log_proxy_status
    except ImportError:
        from proxy_config import playwright_proxy, log_proxy_status

    try:
        log_proxy_status(lender_name)
        with sync_playwright() as p:
            launch_kwargs = {
                "headless": True,
                "args": ["--disable-http2", "--disable-quic"],
            }
            proxy = playwright_proxy()
            if proxy:
                launch_kwargs["proxy"] = proxy
            browser = p.chromium.launch(**launch_kwargs)
            context = browser.new_context(
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
                ),
                locale="en-CA",
            )
            page = context.new_page()
            page.set_default_navigation_timeout(playwright_timeout_ms)
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=playwright_timeout_ms)
                page.wait_for_timeout(wait_ms)
                html = page.content()
                text = page.locator("body").inner_text()
            finally:
                browser.close()
        rates = extract_rates_from_html(
            html + "\n" + text,
            lender_slug=lender_slug,
            lender_name=lender_name,
            source_url=url,
            scraped_at=scraped_at,
            source=source,
            extraction_method="playwright",
        )
        if rates:
            logger.info(f"{lender_name}: {len(rates)} rates from Playwright")
        return rates
    except Exception as e:
        logger.warning(f"{lender_name} Playwright scrape failed: {e}")
        return []
