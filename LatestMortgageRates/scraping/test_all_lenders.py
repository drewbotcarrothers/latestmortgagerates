"""
Test all lenders (Big 5 + Additional Lenders) with live captured rates.
Scrapes rates from all banks and saves to database.
"""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from loguru import logger
import time

from src.database import Database
from src.validator import RateValidator
from src.models import ScrapingResult

# Import all scrapers
from src.scrapers.rbc_scraper import RBCScraper
from src.scrapers.td_scraper import TDScraper
from src.scrapers.bmo_scraper import BMOScraper
from src.scrapers.scotiabank_scraper import ScotiabankScraper
from src.scrapers.cibc_scraper import CIBCScraper
from src.scrapers.nesto_scraper import NestoScraper
from src.scrapers.tangerine_scraper import TangerineScraper
from src.scrapers.meridian_scraper import MeridianScraper
from src.scrapers.simplii_scraper import SimpliiScraper
from src.scrapers.eqbank_scraper import EQBankScraper


def scrape_all_lenders():
    """Scrape all banks and monoline lenders, save to database."""
    
    logger.info("Starting full lender scraping pipeline (10 lenders)")
    start_time = time.time()
    
    # Initialize components
    db = Database()
    validator = RateValidator()
    
    # All scrapers
    scrapers = [
        # Big 5 Banks
        RBCScraper(),
        TDScraper(),
        BMOScraper(),
        ScotiabankScraper(),
        CIBCScraper(),
        # Monoline Lenders
        NestoScraper(),
        TangerineScraper(),
        # Additional Lenders
        MeridianScraper(),
        SimpliiScraper(),
        EQBankScraper(),
    ]
    
    all_rates = []
    results = []
    
    print("\n" + "="*70)
    print("SCRAPING ALL LENDERS (10 Lenders)")
    print("="*70)
    
    for scraper in scrapers:
        bank_start = time.time()
        try:
            rates = scraper.scrape()
            bank_duration = time.time() - bank_start
            
            all_rates.extend(rates)
            results.append(ScrapingResult(
                lender_slug=scraper.LENDER_SLUG,
                success=True,
                rates_found=len(rates),
                scraped_at=scraper.scraped_at,
                duration_seconds=bank_duration
            ))
            
            print(f"\n{scraper.LENDER_NAME}:")
            for r in sorted(rates, key=lambda x: (x.term_months, x.rate_type.value)):
                years = r.term_months // 12
                posted = f" (posted: {r.posted_rate}%)" if r.posted_rate else ""
                apr = r.raw_data.get("apr", "")
                apr_str = f" APR: {apr}%" if apr else ""
                print(f"  {years}yr {r.rate_type.value}: {r.rate}%{posted}{apr_str}")
            
        except Exception as e:
            bank_duration = time.time() - bank_start
            logger.error(f"Failed to scrape {scraper.LENDER_SLUG}: {e}")
            results.append(ScrapingResult(
                lender_slug=scraper.LENDER_SLUG,
                success=False,
                rates_found=0,
                error_message=str(e),
                scraped_at=scraper.scraped_at,
                duration_seconds=bank_duration
            ))
            print(f"\n{scraper.LENDER_NAME}: FAILED - {e}")
    
    # Validate and save rates
    print("\n" + "="*70)
    print("VALIDATING AND SAVING RATES")
    print("="*70)
    
    valid_rates = []
    invalid_rates = []
    
    for rate in all_rates:
        try:
            is_valid, product, warnings, errors = validator.validate_rate(rate)
            if is_valid:
                valid_rates.append(rate)
            else:
                invalid_rates.append((rate, errors))
        except Exception as e:
            logger.warning(f"Validation error for {rate.lender_slug}: {e}")
            valid_rates.append(rate)  # Assume valid if validation fails
    
    print(f"\nTotal rates: {len(all_rates)}")
    print(f"Valid: {len(valid_rates)}")
    print(f"Invalid: {len(invalid_rates)}")
    
    # Save to database
    if valid_rates:
        try:
            db.save_raw_rates(valid_rates)
            logger.success(f"Saved {len(valid_rates)} rates to database")
            print(f"\nSaved {len(valid_rates)} rates to database")
        except Exception as e:
            logger.error(f"Failed to save rates: {e}")
            print(f"Error saving: {e}")
    
    # Log scraping results
    for result in results:
        try:
            db.log_scraping_result(result)
        except:
            pass
    
    # Show comparison table - 5-Year Fixed Uninsured
    print("\n" + "="*70)
    print("5-YEAR FIXED RATE COMPARISON (Uninsured)")
    print("="*70)
    
    comparison_rates = [r for r in valid_rates 
                       if r.term_months == 60 
                       and r.rate_type.value == "fixed"
                       and r.mortgage_type.value == "uninsured"]
    
    sorted_rates = sorted(comparison_rates, key=lambda x: x.rate)
    
    for r in sorted_rates:
        apr = r.raw_data.get("apr", "")
        apr_str = f" (APR: {apr}%)" if apr else ""
        print(f"  {r.lender_name:20} {r.rate}%{apr_str}")
    
    if not sorted_rates:
        print("  No 5-year fixed uninsured rates found")
    
    # Show 5-year fixed insured comparison
    print("\n" + "="*70)
    print("5-YEAR FIXED RATE COMPARISON (Insured)")
    print("="*70)
    
    insured_rates = [r for r in valid_rates 
                    if r.term_months == 60 
                    and r.rate_type.value == "fixed"
                    and r.mortgage_type.value == "insured"]
    
    sorted_insured = sorted(insured_rates, key=lambda x: x.rate)
    
    for r in sorted_insured:
        ltv = r.raw_data.get("ltv_tier", "")
        ltv_str = f" (LTV: {ltv})" if ltv else ""
        print(f"  {r.lender_name:20} {r.rate}%{ltv_str}")
    
    if not sorted_insured:
        print("  No 5-year fixed insured rates found")
    
    # Show variable rates
    print("\n" + "="*70)
    print("5-YEAR VARIABLE RATE COMPARISON (Uninsured)")
    print("="*70)
    
    variable_rates = [r for r in valid_rates 
                     if r.term_months == 60 
                     and r.rate_type.value == "variable"
                     and r.mortgage_type.value == "uninsured"]
    
    sorted_var = sorted(variable_rates, key=lambda x: x.rate)
    
    for r in sorted_var:
        posted = r.posted_rate
        posted_str = f" (posted: {posted}%)" if posted else ""
        spread = r.raw_data.get("spread_to_prime", "")
        spread_str = f" [{spread}]" if spread else ""
        print(f"  {r.lender_name:20} {r.rate}%{posted_str}{spread_str}")
    
    if not sorted_var:
        print("  No 5-year variable uninsured rates found")
    
    # Show insured variable rates
    print("\n" + "="*70)
    print("5-YEAR VARIABLE RATE COMPARISON (Insured)")
    print("="*70)
    
    var_insured = [r for r in valid_rates 
                  if r.term_months == 60 
                  and r.rate_type.value == "variable"
                  and r.mortgage_type.value == "insured"]
    
    sorted_var_ins = sorted(var_insured, key=lambda x: x.rate)
    
    for r in sorted_var_ins:
        spread = r.raw_data.get("spread_to_prime", "")
        spread_str = f" [{spread}]" if spread else ""
        ltv = r.raw_data.get("ltv_tier", "")
        ltv_str = f" (LTV: {ltv})" if ltv else ""
        print(f"  {r.lender_name:20} {r.rate}%{spread_str}{ltv_str}")
    
    if not sorted_var_ins:
        print("  No 5-year variable insured rates found")
    
    # Database summary
    print("\n" + "="*70)
    print("DATABASE SUMMARY")
    print("="*70)
    
    try:
        all_db_rates = db.get_latest_rates()
        print(f"\nTotal rates in database: {len(all_db_rates)}")
        
        # Count by lender
        by_lender = {}
        for rate in all_db_rates:
            lender = rate.get("lender_slug", "unknown")
            by_lender[lender] = by_lender.get(lender, 0) + 1
        
        print("\nRates by lender:")
        for lender, count in sorted(by_lender.items(), key=lambda x: -x[1]):
            print(f"  {lender}: {count} rates")
        
    except Exception as e:
        logger.error(f"Failed to get database summary: {e}")
    
    # Total time
    total_duration = time.time() - start_time
    success_count = sum(1 for r in results if r.success)
    
    print("\n" + "="*70)
    print(f"PIPELINE COMPLETE: {success_count}/{len(scrapers)} lenders scraped successfully")
    print(f"Total time: {total_duration:.2f}s")
    print("="*70)
    
    return results


if __name__ == "__main__":
    results = scrape_all_lenders()
    
    # Show final status
    print("\nFinal Status:")
    for r in results:
        status = "OK" if r.success else "FAILED"
        print(f"  {r.lender_slug:15} {status:7} {r.rates_found} rates")