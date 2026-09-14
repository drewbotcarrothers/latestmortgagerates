"""Lightweight HTTP fetch for lender pages that publish rates in HTML or JSON."""

from typing import Optional

from loguru import logger

try:
    from .proxy_config import httpx_proxy
except ImportError:
    from proxy_config import httpx_proxy

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-CA,en;q=0.9",
}


def _client_kwargs(timeout: float, headers: Optional[dict] = None) -> dict:
    kwargs = {
        "timeout": timeout,
        "follow_redirects": True,
        "headers": headers or DEFAULT_HEADERS,
        "http2": False,
    }
    proxy = httpx_proxy()
    if proxy:
        kwargs["proxy"] = proxy
    return kwargs


def fetch_html(url: str, timeout: float = 20.0, headers: Optional[dict] = None) -> Optional[str]:
    """Fetch a URL with httpx. Returns response text or None."""
    try:
        import httpx
    except ImportError:
        logger.warning("httpx not available")
        return None

    try:
        with httpx.Client(**_client_kwargs(timeout, headers)) as client:
            response = client.get(url)
            if response.status_code >= 400:
                logger.warning(f"HTTP {response.status_code} for {url}")
                return None
            return response.text
    except Exception as e:
        logger.warning(f"HTTP fetch failed for {url}: {e}")
        return None


def fetch_json(
    url: str,
    timeout: float = 20.0,
    method: str = "GET",
    json_body: Optional[dict] = None,
    headers: Optional[dict] = None,
):
    """Fetch JSON from a first-party rates endpoint. Returns parsed object or None."""
    try:
        import httpx
    except ImportError:
        logger.warning("httpx not available")
        return None

    hdrs = {
        **DEFAULT_HEADERS,
        # TD's getRates returns text/plain JSON and 406s a JSON-only Accept.
        "Accept": "application/json, text/plain, text/javascript, */*;q=0.8",
    }
    if headers:
        hdrs.update(headers)

    try:
        with httpx.Client(**_client_kwargs(timeout, hdrs)) as client:
            if method.upper() == "POST":
                response = client.post(url, json=json_body or {})
            else:
                response = client.get(url)
            if response.status_code >= 400:
                logger.warning(f"HTTP {response.status_code} for {url}")
                return None
            try:
                return response.json()
            except Exception:
                import json as json_lib
                try:
                    return json_lib.loads(response.text)
                except Exception:
                    return response.text
    except Exception as e:
        logger.warning(f"JSON fetch failed for {url}: {e}")
        return None
