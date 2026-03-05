"""
Test script for Ratehub scraper with database integration.
Scrapes rates from Ratehub and saves to SQLite staging database.
"""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from loguru import logger
import time

from src.scrapers.ratehub_scraper import RatehubScraper
from src.database import Database
from src.validator import RateValidator
from src.models import ScrapingResult, RawRate


def test_ratehub_pipeline():
    """Test full pipeline: scrape + validate + save."""
    
    logger.info("Starting Ratehub pipeline test")
    start_time = time.time()
    
    # Initialize components
    db = Database()
    validator = RateValidator()
    scraper = RatehubScraper()
    
    # Scrape rates
    logger.info("Scraping Ratehub...")
    scraped_rates = scraper.scrape()
    scrape_duration = time.time() - start_time
    
    if not scraped_rates:
        logger.error("No rates scraped")
        return
    
    logger.success(f"Scraped {len(scraped_rates)} rates in {scrape_duration:.2f}s")
    
    # Show what was scraped
    print("\n" + "="*60)
    print("SCRAPED RATES")
    print("="*60)
    
    by_lender = {}
    for rate in scraped_rates:
        lender = rate.lender_slug.upper()
        if lender not in by_lender:
            by_lender[lender] = []
        by_lender[lender].append(rate)
    
    for lender in sorted(by_lender.keys()):
        print(f"\n{lender}:")
        for r in sorted(by_lender[lender], key=lambda x: (x.term_months, x.rate_type.value)):
            years = r.term_months // 12
            print(f"  {years}yr {r.rate_type.value}: {r.rate}%")
    
    # Validate rates
    logger.info("Validating rates...")
    valid_rates = []
    invalid_rates = []
    
    for rate in scraped_rates:
        is_valid, product, warnings, errors = validator.validate_rate(rate)
        if is_valid:
            valid_rates.append(product)
        else:
            invalid_rates.append((rate, is_valid, warnings, errors))
    
    print("\n" + "="*60)
    print("VALIDATION RESULTS")
    print("="*60)
    print(f"  Valid:   {len(valid_rates)}")
    print(f"  Invalid: {len(invalid_rates)}")
    
    if invalid_rates:
        print("\n  Invalid rates:")
        for rate, is_valid, warnings, errors in invalid_rates:
            print(f"    {rate.lender_slug} {rate.term_months}mo {rate.rate_type.value}: {rate.rate}%")
            for error in errors:
                print(f"      Error: {error}")
            for warning in warnings:
                print(f"      Warning: {warning}")
    
    # Save to database
    logger.info("Saving rates to database...")
    try:
        db.save_raw_rates(scraped_rates)
        logger.success(f"Saved {len(scraped_rates)} rates to database")
    except Exception as e:
        logger.error(f"Failed to save rates: {e}")
    
    # Create scraping result record
    result = ScrapingResult(
        lender_slug="ratehub",
        success=True,
        rates_found=len(scraped_rates),
        scraped_at=scraper.scraped_at,
        duration_seconds=scrape_duration
    )
    
    # Show database summary
    print("\n" + "="*60)
    print("DATABASE SUMMARY")
    print("="*60)
    
    # Get latest rates using existing method
    all_rates = db.get_latest_rates()
    
    # Count by lender
    by_lender = {}
    for rate in all_rates:
        lender = rate.get('lender_slug', 'unknown')
        if lender not in by_lender:
            by_lender[lender] = []
        by_lender[lender].append(rate)
    
    print("\n  Rates by lender:")
    for lender, rates in sorted(by_lender.items(), key=lambda x: -len(x[1])):
        min_rate = min(float(r['rate']) for r in rates)
        max_rate = max(float(r['rate']) for r in rates)
        print(f"    {lender}: {len(rates)} rates, range {min_rate:.2f}% - {max_rate:.2f}%")
    
    # Show most recent
    print("\n  Most recent rates:")
    recent = all_rates[:10] if len(all_rates) >= 10 else all_rates
    for rate in recent:
        years = int(rate['term_months']) // 12
        print(f"    {rate['lender_slug']}: {years}yr {rate['rate_type']} {float(rate['rate']):.2f}%")
    
    # Total time
    total_duration = time.time() - start_time
    print("\n" + "="*60)
    print(f"PIPELINE COMPLETE in {total_duration:.2f}s")
    print("="*60)
    
    return result


if __name__ == "__main__":
    result = test_ratehub_pipeline()
    if result.success:
        print("\nSuccess! Ratehub scraper integrated into pipeline.")
    else:
        print(f"\nFailed: {result.error_message}")
