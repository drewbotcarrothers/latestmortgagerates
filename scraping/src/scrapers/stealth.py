"""
Shared Playwright stealth configuration for mortgage rate scrapers.
Provides anti-detection settings to bypass bot blocking.
"""

from playwright.sync_api import sync_playwright, Browser, BrowserContext, Page
from typing import Optional, Callable, List
import random


# Rotating user agents to avoid fingerprinting
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0",
]

# Viewport sizes to rotate through
VIEWPORTS = [
    {"width": 1920, "height": 1080},
    {"width": 1366, "height": 768},
    {"width": 1440, "height": 900},
    {"width": 1536, "height": 864},
    {"width": 1280, "height": 720},
]


def get_stealth_browser() -> tuple[Browser, BrowserContext]:
    """Create a browser with stealth settings."""
    p = sync_playwright().start()
    
    browser = p.chromium.launch(
        headless=True,
        args=[
            '--disable-blink-features=AutomationControlled',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-site-isolation-trials',
            '--disable-web-security',
            '--disable-features=BlockInsecurePrivateNetworkRequests',
        ]
    )
    
    viewport = random.choice(VIEWPORTS)
    user_agent = random.choice(USER_AGENTS)
    
    context = browser.new_context(
        user_agent=user_agent,
        viewport=viewport,
        locale='en-CA',
        timezone_id='America/Toronto',
        geolocation={'latitude': 43.6532, 'longitude': -79.3832},  # Toronto
        permissions=['geolocation'],
        color_scheme='light',
        reduced_motion='no-preference',
    )
    
    # Add stealth scripts to evade detection
    context.add_init_script("""
        // Override navigator.webdriver
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined
        });
        
        // Override permissions
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' 
                ? Promise.resolve({ state: Notification.permission })
                : originalQuery(parameters)
        );
        
        // Hide automation flags
        delete navigator.__proto__.webdriver;
        
        // Override plugins
        Object.defineProperty(navigator, 'plugins', {
            get: () => [
                { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
                { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: 'Portable Document Format' },
                { name: 'Native Client', filename: 'internal-nacl-plugin', description: 'Native Client module' }
            ]
        });
        
        // Override languages
        Object.defineProperty(navigator, 'languages', {
            get: () => ['en-CA', 'en-US', 'en']
        });
        
        // Override chrome.runtime
        window.chrome = { runtime: {} };
        
        // Override notification permission
        const originalNotification = window.Notification;
        Object.defineProperty(window, 'Notification', {
            get: () => originalNotification,
            set: () => {}
        });
        
        // Hide automation in iframes too
        const originalAttachShadow = Element.prototype.attachShadow;
        Element.prototype.attachShadow = function(...args) {
            const shadow = originalAttachShadow.apply(this, args);
            Object.defineProperty(shadow, 'webdriver', { get: () => undefined });
            return shadow;
        };
    """)
    
    return browser, context, p


def scrape_with_stealth(url: str, extract_fn: Callable, wait_for: str = "domcontentloaded", timeout: int = 30000) -> Optional[List]:
    """
    Scrape a URL with stealth settings.
    
    Args:
        url: URL to scrape
        extract_fn: Function that takes a page and returns extracted data
        wait_for: Playwright wait_until strategy (domcontentloaded, networkidle, load)
        timeout: Navigation timeout in ms
    
    Returns:
        Extracted data or None if failed
    """
    browser = None
    p = None
    
    try:
        browser, context, p = get_stealth_browser()
        page = context.new_page()
        
        # Set extra headers
        page.set_extra_http_headers({
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-CA,en-US;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
        })
        
        # Navigate with shorter timeout and less strict wait
        page.goto(url, wait_until=wait_for, timeout=timeout)
        
        # Wait a bit for JS to execute (but not too long)
        page.wait_for_timeout(1500)
        
        # Extract data
        result = extract_fn(page)
        
        return result
        
    except Exception as e:
        from loguru import logger
        logger.error(f"Stealth scraping failed for {url}: {e}")
        return None
        
    finally:
        if browser:
            browser.close()
        if p:
            p.stop()


def simple_table_extractor(page, term_pattern: str = r'(\\d+)\\s*(?:Year|Yr)', rate_pattern: str = r'([\\d.]+)\\s*%') -> List[dict]:
    """
    Simple extractor for table-based rate pages.
    Returns list of dicts with term_text and rate_text.
    """
    import re
    results = []
    
    # Try different selectors
    selectors = [
        "table tbody tr",
        "table tr",
        ".rate-table tbody tr",
        ".rates-table tbody tr",
        "[class*='rate'] tbody tr",
        "[class*='mortgage'] tbody tr",
    ]
    
    for selector in selectors:
        rows = page.query_selector_all(selector)
        if rows:
            for row in rows:
                cells = row.query_selector_all("td")
                if len(cells) >= 2:
                    term_text = cells[0].inner_text().strip()
                    rate_text = cells[1].inner_text().strip()
                    
                    term_match = re.search(term_pattern, term_text, re.IGNORECASE)
                    rate_match = re.search(rate_pattern, rate_text)
                    
                    if term_match and rate_match:
                        results.append({
                            "term_text": term_text,
                            "rate_text": rate_text,
                            "term_months": int(term_match.group(1)) * 12,
                            "rate": rate_match.group(1),
                        })
            
            if results:
                break
    
    return results
