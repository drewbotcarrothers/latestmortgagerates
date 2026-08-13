"""
Stealth browser helper for mortgage rate scrapers.

Uses playwright-stealth to evade bot detection by patching Playwright's
fingerprint to look like a real Chrome browser.

Usage:
    from browser_helper import launch_stealth_browser
    
    with launch_stealth_browser() as (browser, context, page):
        page.goto(url)
        # ... scrape ...
"""

import random
from contextlib import contextmanager
from typing import Generator, Tuple
from datetime import datetime

from loguru import logger

# List of realistic user agents rotated per session
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
]

# Realistic viewport sizes
VIEWPORTS = [
    {"width": 1920, "height": 1080},
    {"width": 1366, "height": 768},
    {"width": 1440, "height": 900},
    {"width": 1536, "height": 864},
    {"width": 1280, "height": 720},
]


@contextmanager
def launch_stealth_browser(
    headless: bool = True,
    timeout_ms: int = 30000,
    block_resources: bool = True
) -> Generator[Tuple, None, None]:
    """
    Launch a stealth-enabled Playwright browser.
    
    Args:
        headless: Run in headless mode (default True)
        timeout_ms: Default navigation timeout
        block_resources: Block images/fonts/media to speed up loading
        
    Yields:
        Tuple of (browser, context, page)
        
    Example:
        with launch_stealth_browser() as (browser, context, page):
            page.goto("https://example.com")
            html = page.content()
    """
    try:
        from playwright.sync_api import sync_playwright
        from playwright_stealth import Stealth
    except ImportError:
        logger.error("playwright-stealth not installed. Install with: pip install playwright-stealth")
        raise
    
    user_agent = random.choice(USER_AGENTS)
    viewport = random.choice(VIEWPORTS)
    
    logger.info(f"Launching stealth browser: {user_agent[:60]}... viewport={viewport}")
    
    with sync_playwright() as p:
        # Launch browser with anti-detection args
        browser = p.chromium.launch(
            headless=headless,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-web-security",
                "--disable-features=IsolateOrigins,site-per-process",
                "--disable-http2",  # Prevent HTTP/2 protocol errors
                "--disable-quic",   # Prevent QUIC errors
                "--disable-features=BlockInsecurePrivateNetworkRequests",
            ]
        )
        
        # Create context with realistic settings
        context = browser.new_context(
            user_agent=user_agent,
            viewport=viewport,
            locale="en-CA",
            timezone_id="America/Toronto",
            geolocation={"latitude": 43.6532, "longitude": -79.3832},  # Toronto
            permissions=["geolocation"],
            color_scheme="light",
            # Realistic device descriptors
            device_scale_factor=1.0,
            is_mobile=False,
            has_touch=False,
        )
        
        # Add stealth scripts to evade detection
        page = context.new_page()
        
        # Add stealth scripts to evade detection
        stealth_config = Stealth(
            navigator_languages_override=("en-CA", "en"),
            navigator_platform_override="Win32",
            navigator_user_agent_override=user_agent,
            sec_ch_ua_override='\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"',
            webgl_vendor_override="Intel Inc.",
            webgl_renderer_override="Intel Iris OpenGL Engine",
        )
        stealth_config.apply_stealth_sync(page)
        
        # Set default timeout
        page.set_default_timeout(timeout_ms)
        page.set_default_navigation_timeout(timeout_ms)
        
        # Block unnecessary resources to speed up loading
        if block_resources:
            page.route(
                "**/*.{png,jpg,jpeg,gif,webp,svg,css,woff,woff2,ttf,otf,ico,mp3,mp4,webm}",
                lambda route: route.abort()
            )
        
        # Inject script to remove webdriver property (stealth backup)
        page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
            
            // Override permissions API
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' 
                    ? Promise.resolve({ state: Notification.permission })
                    : originalQuery(parameters)
            );
            
            // Patch plugins to appear real
            Object.defineProperty(navigator, 'plugins', {
                get: () => [
                    { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' },
                    { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
                    { name: 'Native Client', filename: 'internal-nacl-plugin' },
                ]
            });
        """)
        
        logger.info("Stealth browser launched successfully")
        
        try:
            yield browser, context, page
        finally:
            logger.debug("Closing stealth browser")
            context.close()
            browser.close()


def goto_with_retry(
    page,
    url: str,
    wait_until: str = "domcontentloaded",
    timeout_ms: int = 30000,
    retries: int = 2
) -> bool:
    """
    Navigate to URL with retry logic.
    
    Returns True on success, False on failure after all retries.
    """
    for attempt in range(retries + 1):
        try:
            logger.info(f"Navigating to {url} (attempt {attempt + 1}/{retries + 1})")
            response = page.goto(url, wait_until=wait_until, timeout=timeout_ms)
            
            if response and response.status >= 400:
                logger.warning(f"HTTP {response.status} for {url}")
                if attempt < retries:
                    import time
                    time.sleep(2 ** attempt)  # Exponential backoff
                    continue
                return False
            
            # Small random delay to appear human
            import random, time
            time.sleep(random.uniform(0.5, 2.0))
            
            return True
            
        except Exception as e:
            logger.warning(f"Navigation failed (attempt {attempt + 1}): {e}")
            if attempt < retries:
                import time
                time.sleep(2 ** attempt)
            else:
                return False
    
    return False
