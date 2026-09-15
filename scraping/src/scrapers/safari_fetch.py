"""
HTTP fetch with a Safari-like TLS fingerprint.

BMO (Akamai) completes TLS then kills typical automation clients:
libcurl/httpx/Playwright Chromium get HTTP/2 INTERNAL_ERROR or stall
HTTP/1.1 at 0 bytes. Safari on macOS loads the same URLs.

curl_cffi impersonates Safari's JA3/ALPN/HTTP2 fingerprint without a
browser. Playwright WebKit is the in-process fallback (closer to Safari
than Chromium). Plain httpx is last and usually fails for bmo.com.
"""

from __future__ import annotations

from typing import Any, Optional

from loguru import logger

try:
    from .proxy_config import httpx_proxy
except ImportError:
    from proxy_config import httpx_proxy

SAFARI_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15"
)

SAFARI_HEADERS = {
    "User-Agent": SAFARI_UA,
    "Accept": "application/json, text/plain, text/html, */*;q=0.8",
    "Accept-Language": "en-CA,en;q=0.9",
}

# curl_cffi impersonate profiles, newest Safari first. Names vary by
# curl_cffi version; unknown names are skipped.
SAFARI_IMPERSONATE = (
    "safari18_0",
    "safari17_2_ios",
    "safari17_0",
    "safari15_5",
)


def _proxy_url() -> Optional[str]:
    return httpx_proxy()


def fetch_json_safari(
    url: str,
    timeout: float = 25.0,
    headers: Optional[dict] = None,
) -> Optional[Any]:
    """GET JSON using Safari TLS impersonation, then plain httpx."""
    hdrs = {**SAFARI_HEADERS, **(headers or {})}
    payload = _curl_cffi_json(url, timeout, hdrs)
    if payload is not None:
        return payload
    return _httpx_json(url, timeout, hdrs)


def fetch_html_safari(url: str, timeout: float = 25.0) -> Optional[str]:
    """GET HTML using Safari TLS impersonation, then plain httpx."""
    html = _curl_cffi_text(url, timeout, SAFARI_HEADERS)
    if html:
        return html
    try:
        from .http_fetch import fetch_html
    except ImportError:
        from http_fetch import fetch_html
    return fetch_html(url, timeout=timeout, headers=SAFARI_HEADERS)


def _curl_cffi_json(url: str, timeout: float, headers: dict) -> Optional[Any]:
    text = _curl_cffi_text(url, timeout, headers)
    if not text:
        return None
    try:
        import json as json_lib

        return json_lib.loads(text)
    except Exception as e:
        logger.warning(f"Safari-impersonated response was not JSON for {url}: {e}")
        return None


def _curl_cffi_text(url: str, timeout: float, headers: dict) -> Optional[str]:
    try:
        from curl_cffi import requests as cf_requests
    except ImportError:
        logger.info("curl_cffi not installed; skipping Safari TLS impersonation")
        return None

    proxy = _proxy_url()
    last_error: Optional[str] = None
    for impersonate in SAFARI_IMPERSONATE:
        try:
            kwargs = {
                "impersonate": impersonate,
                "timeout": timeout,
                "headers": headers,
                "allow_redirects": True,
            }
            if proxy:
                kwargs["proxies"] = {"http": proxy, "https": proxy}
            try:
                response = cf_requests.get(url, **kwargs)
            except TypeError:
                kwargs.pop("proxies", None)
                if proxy:
                    kwargs["proxy"] = proxy
                response = cf_requests.get(url, **kwargs)
            if response.status_code >= 400:
                last_error = f"HTTP {response.status_code} impersonate={impersonate}"
                logger.warning(f"{last_error} for {url}")
                continue
            if not response.text:
                last_error = f"empty body impersonate={impersonate}"
                continue
            logger.info(
                f"Safari impersonation {impersonate} fetched {url} "
                f"({len(response.text)} bytes)"
            )
            return response.text
        except Exception as e:
            last_error = f"{type(e).__name__}: {e}"
            msg = str(e).lower()
            if "impersonat" in msg or "not support" in msg:
                logger.info(f"curl_cffi impersonate={impersonate} unavailable: {e}")
                continue
            logger.warning(f"curl_cffi {impersonate} failed for {url}: {e}")
    if last_error:
        logger.warning(f"All Safari impersonations failed for {url}: {last_error}")
    return None


def _httpx_json(url: str, timeout: float, headers: dict) -> Optional[Any]:
    try:
        from .http_fetch import fetch_json
    except ImportError:
        from http_fetch import fetch_json
    return fetch_json(url, timeout=timeout, headers=headers)
