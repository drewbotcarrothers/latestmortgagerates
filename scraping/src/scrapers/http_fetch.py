"""Lightweight HTTP fetch for lender pages that publish rates in HTML."""

from typing import Optional

from loguru import logger

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-CA,en;q=0.9",
}


def fetch_html(url: str, timeout: float = 20.0) -> Optional[str]:
    """Fetch a URL with httpx. Returns HTML text or None."""
    try:
        import httpx
    except ImportError:
        logger.warning("httpx not available")
        return None

    try:
        with httpx.Client(
            timeout=timeout,
            follow_redirects=True,
            headers=DEFAULT_HEADERS,
            http2=False,
        ) as client:
            response = client.get(url)
            if response.status_code >= 400:
                logger.warning(f"HTTP {response.status_code} for {url}")
                return None
            return response.text
    except Exception as e:
        logger.warning(f"HTTP fetch failed for {url}: {e}")
        return None
