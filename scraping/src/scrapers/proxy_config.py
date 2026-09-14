"""
Optional residential / rotating proxy for scrapers.

Reads credentials only from environment / GitHub Actions secrets.
Never hardcode a proxy URL or password.

Supported env vars (first non-empty wins):
  SCRAPER_PROXY_URL          preferred, e.g. http://user:pass@host:port
  HTTPS_PROXY / HTTP_PROXY   standard proxies
  BRIGHTDATA_PROXY_URL
  OXYLABS_PROXY_URL
  SMARTPROXY_URL

Optional auth split out of the URL:
  SCRAPER_PROXY_USERNAME
  SCRAPER_PROXY_PASSWORD
"""

from __future__ import annotations

import os
from typing import Dict, Optional
from urllib.parse import urlparse

from loguru import logger

PROXY_URL_KEYS = (
    "SCRAPER_PROXY_URL",
    "HTTPS_PROXY",
    "HTTP_PROXY",
    "BRIGHTDATA_PROXY_URL",
    "OXYLABS_PROXY_URL",
    "SMARTPROXY_URL",
)


def get_proxy_url() -> Optional[str]:
    for key in PROXY_URL_KEYS:
        value = (os.environ.get(key) or "").strip()
        if value:
            return value
    return None


def proxy_enabled() -> bool:
    return bool(get_proxy_url())


def _apply_split_auth(url: str) -> str:
    user = (os.environ.get("SCRAPER_PROXY_USERNAME") or "").strip()
    password = (os.environ.get("SCRAPER_PROXY_PASSWORD") or "").strip()
    if not user:
        return url
    parsed = urlparse(url)
    if parsed.username:
        return url
    host = parsed.hostname or ""
    port = f":{parsed.port}" if parsed.port else ""
    auth = user if not password else f"{user}:{password}"
    return f"{parsed.scheme}://{auth}@{host}{port}"


def httpx_proxy() -> Optional[str]:
    """Proxy URL for httpx.Client(proxy=...)."""
    url = get_proxy_url()
    if not url:
        return None
    return _apply_split_auth(url)


def playwright_proxy() -> Optional[Dict[str, str]]:
    """Playwright launch/context proxy dict, or None."""
    url = get_proxy_url()
    if not url:
        return None
    url = _apply_split_auth(url)
    parsed = urlparse(url)
    if not parsed.hostname:
        logger.warning("Proxy URL is missing a hostname; ignoring")
        return None
    server = f"{parsed.scheme}://{parsed.hostname}"
    if parsed.port:
        server = f"{server}:{parsed.port}"
    cfg: Dict[str, str] = {"server": server}
    if parsed.username:
        cfg["username"] = parsed.username
    if parsed.password:
        cfg["password"] = parsed.password
    return cfg


def log_proxy_status(context: str = "") -> None:
    prefix = f"{context}: " if context else ""
    if proxy_enabled():
        parsed = urlparse(get_proxy_url() or "")
        host = parsed.hostname or "?"
        logger.info(f"{prefix}using proxy host={host} port={parsed.port}")
    else:
        logger.info(f"{prefix}no scraper proxy configured")
