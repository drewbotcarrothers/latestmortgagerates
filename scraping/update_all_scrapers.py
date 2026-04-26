"""
Batch update all scraper fallback data with live rates.
Uses Playwright to scrape each lender's live rates.
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from loguru import logger
from playwright.sync_api import sync_playwright
from decimal import Decimal
import re
from datetime import datetime

# Lender configurations: (slug, name, url, selector/pattern)
LENDERS = {
    # Big 6 Banks
    "rbc": ("Royal Bank of Canada", "https://www.rbcroyalbank.com/mortgages/mortgage-rates.html"),
    "td": ("TD Bank", "https://td.com/ca/en/personal-banking/products/mortgages/mortgage-rates"),
    "bmo": ("Bank of Montreal", "https://www.bmo.com/main/personal/mortgages/mortgage-rates/"),
    "scotiabank": ("Scotiabank", "https://www.scotiabank.com/ca/en/personal/rates-prices/mortgages-rates.html"),
    "cibc": ("CIBC", "https://www.cibc.com/en/personal-banking/mortgages/mortgage-rates.html"),
    "nationalbank": ("National Bank", "https://www.nbc.ca/personal/loans-mortgages/mortgage-rates.html"),
    
    # Digital Banks
    "nesto": ("nesto", "https://www.nesto.ca/mortgage-rates/"),
    "eqbank": ("EQ Bank", "https://www.eqbank.ca/personal-banking/mortgages/mortgage-rates"),
    "simplii": ("Simplii Financial", "https://www.simplii.com/en/rates/mortgage-rates.html"),
    "tangerine": ("Tangerine", "https://www.tangerine.ca/en/rates/mortgage-rates"),
    "motive": ("Motive Financial", "https://www.motivefinancial.com/Rates"),
    
    # Major Monolines
    "firstnational": ("First National", "https://www.firstnational.ca/mortgages/residential-mortgages/mortgage-rates"),
    "mcap": ("MCAP", "https://www.mcap.com/mortgage-rates/"),
    "manulife": ("Manulife Bank", "https://www.manulifebank.ca/mortgages/mortgage-rates.html"),
    "laurentian": ("Laurentian Bank", "https://www.laurentianbank.ca/en/personal/rates/mortgage-rates"),
    "rfa": ("RFA", "https://www.rfa.ca/mortgages/our-rates/"),
    "cmls": ("CMLS Financial", "https://www.cmls.ca/mortgage-rates/"),
    "merix": ("Merix Financial", "https://www.merixfinancial.com/mortgage-rates"),
    "lendwise": ("Lendwise", "https://www.lendwise.com/mortgage-rates/"),
    "butlermortgage": ("Butler Mortgage", "https://www.butlermortgage.com/rates/"),
    "intellimortgage": ("IntelliMortgage", "https://www.intellimortgage.com/rates/"),
    "streetcapital": ("Street Capital", "https://www.streetcapital.ca/mortgage-rates"),
    "centum": ("Centum", "https://www.centum.ca/mortgage-rates"),
    
    # Credit Unions / Regional
    "meridian": ("Meridian", "https://www.meridiancu.ca/mortgage-rates"),
    "desjardins": ("Desjardins", "https://www.desjardins.com/ca/personal/loans-credit/mortgages/mortgage-rates/index.jsp"),
    "vancity": ("Vancity", "https://www.vancity.com/BC mortgage-rates"),
    "coastcapital": ("Coast Capital", "https://www.coastcapitalsavings.com/rates/mortgage-rates"),
    "alterna": ("Alterna", "https://www.alterna.ca/mortgages/mortgage-rates"),
    "atb": ("ATB Financial", "https://www.atb.com/personal/mortgages/mortgage-rates"),
    "cwb": ("CWB", "https://www.cwbank.com/mortgages/mortgage-rates"),
    
    # Alternative Lenders
    "equitable": ("Equitable Bank", "https://www.equitablebank.ca/mortgages/mortgage-rates"),
    "hometrust": ("Home Trust", "https://www.hometrust.ca/mortgages/mortgage-rates"),
    "wealthsimple": ("Wealthsimple", "https://www.wealthsimple.com/en-ca/product/mortgage-rates"),
}


def extract_rates_generic(page, lender_slug):
    """Generic rate extraction - tries multiple strategies."""
    rates = []
    
    # Strategy 1: Look for rate tables with common selectors
    selectors = [
        "[class*='rate']",
        "[class*='mortgage']",
        "table tr",
        ".rate-table tbody tr",
        ".mortgage-rates tbody tr",
    ]
    
    for selector in selectors:
        try:
            rows = page.query_selector_all(selector)
            for row in rows:
                text = row.inner_text()
                # Look for patterns like "5 Year Fixed 4.09%" or "60 months 4.09%"
                matches = re.finditer(
                    r'(?i)(\d+)\s*(?:Year|yr|Y|Month|mo|M)?\s*(?:Fixed|Variable|Open)?\s*([\d.]+)\s*%',
                    text
                )
                for match in matches:
                    logger.debug(f"Found potential rate: {match.group(0)}")
        except Exception:
            pass
    
    # Strategy 2: Extract all text and search for rate patterns
    text_content = page.evaluate("() => document.body.innerText")
    
    # Common rate patterns
    patterns = [
        r'(?i)(\d+)\s*[-]?\s*Year\s+(?:Fixed|Variable|Open)\s+([\d.]+)\s*%',
        r'(?i)(\d+)\s*[-]?\s*Yr\s+(?:Fixed|Variable|Open)\s+([\d.]+)\s*%',
        r'(?i)(\d+)\s*Month\s+(?:Fixed|Variable|Open)\s+([\d.]+)\s*%',
    ]
    
    for pattern in patterns:
        matches = re.finditer(pattern, text_content)
        for match in matches:
            logger.info(f"Pattern match: {match.group(0)}")
            # Add to rates list
    
    return rates


def update_lender(lender_slug, lender_name, url):
    """Update a single lender's rates."""
    logger.info(f"\n{'='*60}")
    logger.info(f"Updating {lender_name} ({lender_slug})")
    logger.info(f"URL: {url}")
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            )
            page = context.new_page()
            
            page.goto(url, wait_until="networkidle", timeout=30000)
            page.wait_for_timeout(2000)
            
            # Take screenshot for debugging
            screenshot_path = f"screenshots/{lender_slug}_rates.png"
            Path("screenshots").mkdir(exist_ok=True)
            page.screenshot(path=screenshot_path, full_page=True)
            logger.info(f"Screenshot saved: {screenshot_path}")
            
            # Extract rates
            rates = extract_rates_generic(page, lender_slug)
            
            browser.close()
            
            if rates:
                logger.success(f"Found {len(rates)} rates for {lender_name}")
                return rates
            else:
                logger.warning(f"No rates found for {lender_name} - may need custom scraper")
                return None
                
    except Exception as e:
        logger.error(f"Error updating {lender_name}: {e}")
        return None


def main():
    """Main batch update function."""
    logger.info("Starting batch scraper update...")
    logger.info(f"Total lenders to update: {len(LENDERS)}")
    
    results = {}
    
    for slug, (name, url) in LENDERS.items():
        rates = update_lender(slug, name, url)
        results[slug] = {
            "name": name,
            "url": url,
            "rates_found": len(rates) if rates else 0,
            "success": rates is not None and len(rates) > 0
        }
    
    # Summary
    logger.info("\n" + "="*60)
    logger.info("UPDATE SUMMARY")
    logger.info("="*60)
    
    successful = sum(1 for r in results.values() if r["success"])
    failed = len(results) - successful
    
    logger.info(f"Successful: {successful}/{len(results)}")
    logger.info(f"Failed/No rates: {failed}/{len(results)}")
    
    for slug, result in results.items():
        status = "✅" if result["success"] else "❌"
        logger.info(f"{status} {slug}: {result['rates_found']} rates")
    
    # Save results to file
    import json
    with open("scraper_update_results.json", "w") as f:
        json.dump(results, f, indent=2, default=str)
    
    logger.info("\nResults saved to scraper_update_results.json")


if __name__ == "__main__":
    main()