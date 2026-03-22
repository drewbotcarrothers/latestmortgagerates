"""
Test all lenders (30 direct lenders - NO aggregators).
Scrapes rates from all banks and saves to database.
With timeouts and comprehensive error handling.
"""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from loguru import logger
import time
import signal
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Optional

from src.database import Database
from src.validator import RateValidator
from src.models import ScrapingResult

# Import all scrapers - ORIGINAL
from src.scrapers.rbc_scraper import RBCScraper
from src.scrapers.td_scraper import TDScraper
from src.scrapers.bmo_scraper import BMOScraper
from src.scrapers.scotiabank_scraper import ScotiabankScraper
from src.scrapers.cibc_scraper import CIBCScraper
from src.scrapers.nationalbank_scraper import NationalBankScraper
from src.scrapers.nesto_scraper import NestoScraper
from src.scrapers.tangerine_scraper import TangerineScraper
from src.scrapers.meridian_scraper import MeridianScraper
from src.scrapers.simplii_scraper import SimpliiScraper
from src.scrapers.eqbank_scraper import EQBankScraper
from src.scrapers.desjardins_scraper import DesjardinsScraper
from src.scrapers.firstnational_scraper import FirstNationalScraper
from src.scrapers.mcap_scraper import MCAPScraper
from src.scrapers.laurentian_scraper import LaurentianBankScraper
from src.scrapers.manulife_scraper import ManulifeBankScraper
from src.scrapers.motive_scraper import MotiveScraper
from src.scrapers.alterna_scraper import AlternaScraper
from src.scrapers.rfa_scraper import RFAScraper

# Import NEW scrapers - Regional Banks & Credit Unions
from src.scrapers.vancity_scraper import VancityScraper
from src.scrapers.atb_scraper import ATBScraper
from src.scrapers.cwb_scraper import CWBScraper
from src.scrapers.coastcapital_scraper import CoastCapitalScraper

# Import NEW scrapers - Monoline Lenders
from src.scrapers.cmls_scraper import CMLSScraper
from src.scrapers.merix_scraper import MerixScraper
from src.scrapers.lendwise_scraper import LendwiseScraper
from src.scrapers.butler_scraper import ButlerMortgageScraper
from src.scrapers.intellimortgage_scraper import IntelliMortgageScraper
from src.scrapers.streetcapital_scraper import StreetCapitalScraper
from src.scrapers.centum_scraper import CentumScraper
from src.scrapers.truenorth_scraper import TrueNorthMortgageScraper

# Import NEW scrapers - Digital Banks (Fintech)
from src.scrapers.wealthsimple_scraper import WealthsimpleScraper

# Import NEW scrapers - National Alternative Lenders (March 2025)
from src.scrapers.equitable_scraper import EquitableBankScraper
from src.scrapers.hometrust_scraper import HomeTrustScraper


# Define approved lender slugs (whitelist) - organized by category
APPROVED_LENDERS = {
    # Big 6 Banks (6)
    'rbc', 'td', 'bmo', 'scotiabank', 'cibc', 'nationalbank',
    # Digital Banks (7) - Online-first banks
    'nesto', 'tangerine', 'eqbank', 'simplii', 'motive', 'alterna', 'wealthsimple',
    # Credit Unions (4)
    'meridian', 'desjardins', 'vancity', 'coastcapital',
    # Regional Banks (2)
    'atb', 'cwb',
    # Monoline Lenders (13) - Mortgage specialists
    'firstnational', 'mcap', 'laurentian', 'manulife', 'rfa',
    'cmls', 'merix', 'lendwise', 'butlermortgage', 'intellimortgage', 
    'streetcapital', 'centum', 'truenorth',
    # National Alternative Lenders (2) - Alternative lending specialists
    'equitable', 'hometrust',
}

# Default timeout per scraper (seconds)
SCRAPER_TIMEOUT = 60  # 1 minute per scraper


class ScraperTimeout(Exception):
    """Raised when a scraper exceeds its timeout."""
    pass


def run_scraper_with_timeout(scraper, timeout_secs=SCRAPER_TIMEOUT):
    """
    Run a scraper with a timeout.
    Returns (rates, result, duration) tuple.
    """
    start_time = time.time()
    rates = []
    error_msg = None
    
    def scrape_thread():
        nonlocal rates, error_msg
        try:
            rates = scraper.scrape()
        except Exception as e:
            error_msg = str(e)
    
    # Start scraper in a thread
    thread = threading.Thread(target=scrape_thread)
    thread.start()
    thread.join(timeout=timeout_secs)
    
    duration = time.time() - start_time
    
    if thread.is_alive():
        # Scraper is still running after timeout
        logger.warning(f"Scraper {scraper.LENDER_SLUG} timed out after {timeout_secs}s")
        return [], f"TIMEOUT after {timeout_secs}s", duration
    
    if error_msg:
        return [], error_msg, duration
    
    return rates, None, duration


def scrape_all_lenders():
    """Scrape all lenders, save to database, and export for website."""
    
    logger.info("Starting full lender scraping pipeline (30 direct lenders)")
    start_time = time.time()
    
    # Initialize components
    db = Database()
    validator = RateValidator()
    
    # All scraper classes - organized by category
    scraper_classes = [
        # Big 6 Banks (6)
        ("RBC", RBCScraper),
        ("TD", TDScraper),
        ("BMO", BMOScraper),
        ("Scotia", ScotiabankScraper),
        ("CIBC", CIBCScraper),
        ("NBC", NationalBankScraper),
        
        # Digital Banks (7) - Online-only or digital-first banks
        ("Nesto", NestoScraper),
        ("Tangerine", TangerineScraper),
        ("EQ Bank", EQBankScraper),
        ("Simplii", SimpliiScraper),
        ("Motive", MotiveScraper),
        ("Alterna", AlternaScraper),
        ("Wealthsimple", WealthsimpleScraper),  # Fintech with full banking capabilities
        
        # Credit Unions (4)
        ("Meridian", MeridianScraper),
        ("Desjardins", DesjardinsScraper),
        ("Vancity", VancityScraper),
        ("Coast Capital", CoastCapitalScraper),
        
        # Regional Banks (2)
        ("ATB", ATBScraper),
        ("CWB", CWBScraper),
        
        # Monoline Lenders (13) - Mortgage specialists
        ("First National", FirstNationalScraper),
        ("MCAP", MCAPScraper),
        ("Laurentian", LaurentianBankScraper),
        ("Manulife", ManulifeBankScraper),
        ("RFA", RFAScraper),
        ("CMLS", CMLSScraper),
        ("Merix", MerixScraper),
        ("Lendwise", LendwiseScraper),
        ("Butler", ButlerMortgageScraper),
        ("IntelliMortgage", IntelliMortgageScraper),
        ("Street Capital", StreetCapitalScraper),
        ("Centum", CentumScraper),
        ("True North", TrueNorthMortgageScraper),
        
        # National Alternative Lenders (2) - Alternative lending specialists
        ("Equitable Bank", EquitableBankScraper),
        ("Home Trust", HomeTrustScraper),
    ]
    
    all_rates = []
    results = []
    
    print("\n" + "="*80)
    print(f"SCRAPING ALL LENDERS ({len(scraper_classes)} Direct Lenders - NO Aggregators)")
    print("="*80)
    print(f"Timeout per scraper: {SCRAPER_TIMEOUT}s")
    print("="*80)
    
    # Run each scraper with timeout
    for i, (short_name, ScraperClass) in enumerate(scraper_classes, 1):
        scraped_at = time.time()
        
        try:
            scraper = ScraperClass()
        except Exception as e:
            logger.error(f"Failed to initialize {short_name}: {e}")
            results.append(ScrapingResult(
                lender_slug=short_name.lower(),
                success=False,
                rates_found=0,
                error_message=f"INIT ERROR: {e}",
                scraped_at=scraped_at,
                duration_seconds=0
            ))
            print(f"\n[{i:2}/{len(scraper_classes)}] {short_name:20} FAILED - Init error: {e}")
            continue
        
        # Run with timeout
        rates, error, duration = run_scraper_with_timeout(scraper, SCRAPER_TIMEOUT)
        
        if error:
            logger.error(f"Failed to scrape {scraper.LENDER_SLUG}: {error}")
            results.append(ScrapingResult(
                lender_slug=scraper.LENDER_SLUG,
                success=False,
                rates_found=0,
                error_message=error,
                scraped_at=scraped_at,
                duration_seconds=duration
            ))
            status = "TIMEOUT" if "TIMEOUT" in error else "FAILED"
            print(f"\n[{i:2}/{len(scraper_classes)}] {scraper.LENDER_NAME:25} {status:8} {error[:40]}")
        else:
            all_rates.extend(rates)
            results.append(ScrapingResult(
                lender_slug=scraper.LENDER_SLUG,
                success=True,
                rates_found=len(rates),
                scraped_at=scraped_at,
                duration_seconds=duration
            ))
            print(f"\n[{i:2}/{len(scraper_classes)}] {scraper.LENDER_NAME:25} OK       {len(rates)} rates ({duration:.1f}s)")
    
    # Print summary of scraping results
    print("\n" + "="*80)
    print("SCRAPING SUMMARY")
    print("="*80)
    
    successful = [r for r in results if r.success]
    failed = [r for r in results if not r.success]
    
    print(f"\nSuccessful: {len(successful)}/{len(scraper_classes)}")
    print(f"Failed:     {len(failed)}/{len(scraper_classes)}")
    
    if failed:
        print("\nFailed scrapers:")
        for r in failed:
            print(f"  - {r.lender_slug:20} {r.error_message[:50]}")
    
    # Filter rates: only approved lenders, no aggregators
    print("\n" + "="*80)
    print("FILTERING RATES - Removing aggregators and unknown lenders")
    print("="*80)
    
    filtered_rates = []
    removed_count = 0
    removed_lenders = set()
    
    for rate in all_rates:
        # Check if lender is in approved list
        if rate.lender_slug not in APPROVED_LENDERS:
            logger.warning(f"Removing rate from unapproved lender: {rate.lender_slug}")
            removed_count += 1
            removed_lenders.add(rate.lender_slug)
            continue
        
        # Check if source is an aggregator
        source_lower = rate.source_url.lower() if rate.source_url else ""
        if any(agg in source_lower for agg in ['rates.ca', 'lowestrates.ca', 'wowa.ca']):
            logger.warning(f"Removing aggregator rate from: {rate.source_url}")
            removed_count += 1
            continue
        
        filtered_rates.append(rate)
    
    if removed_lenders:
        print(f"Removed lenders not in approved list: {removed_lenders}")
    
    print(f"Original rates: {len(all_rates)}")
    print(f"Filtered rates: {len(filtered_rates)}")
    print(f"Removed: {removed_count} (aggregators/unknown lenders)")
    
    # Validate and save rates
    print("\n" + "="*80)
    print("VALIDATING AND SAVING RATES")
    print("="*80)
    
    valid_rates = []
    invalid_rates = []
    
    for rate in filtered_rates:
        try:
            is_valid, product, warnings, errors = validator.validate_rate(rate)
            if is_valid:
                valid_rates.append(rate)
            else:
                invalid_rates.append((rate, errors))
                logger.warning(f"Invalid rate: {rate.lender_slug} {rate.term_months}mo - {errors}")
        except Exception as e:
            logger.warning(f"Validation error for {rate.lender_slug}: {e}")
            valid_rates.append(rate)  # Keep it anyway
    
    print(f"Total rates:   {len(filtered_rates)}")
    print(f"Valid:         {len(valid_rates)}")
    print(f"Invalid:       {len(invalid_rates)}")
    
    # Group by lender for summary
    lender_counts = {}
    for rate in valid_rates:
        lender_counts[rate.lender_slug] = lender_counts.get(rate.lender_slug, 0) + 1
    
    print(f"\nRates by lender ({len(lender_counts)} lenders):")
    for lender, count in sorted(lender_counts.items(), key=lambda x: -x[1]):
        print(f"  {lender:20} {count:3} rates")
    
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
        except Exception as e:
            logger.warning(f"Failed to log result for {result.lender_slug}: {e}")
    
    # Export to website data
    print("\n" + "="*80)
    print("EXPORTING TO WEBSITE DATA")
    print("="*80)
    
    try:
        import json
        from datetime import datetime
        
        export_data = []
        for rate in valid_rates:
            export_data.append({
                "lender_name": rate.lender_name,
                "lender_slug": rate.lender_slug,
                "term_months": rate.term_months,
                "rate_type": rate.rate_type.value,
                "mortgage_type": rate.mortgage_type.value,
                "rate": float(rate.rate),
                "posted_rate": float(rate.posted_rate) if rate.posted_rate else None,
                "source_url": rate.source_url,
                "scraped_at": rate.scraped_at.isoformat() if hasattr(rate.scraped_at, 'isoformat') else str(rate.scraped_at),
                "apr": rate.raw_data.get("apr") if rate.raw_data else None,
                "ltv_tier": rate.raw_data.get("ltv_tier") if rate.raw_data else None,
                "spread_to_prime": rate.raw_data.get("spread_to_prime") if rate.raw_data else None,
            })
        
        # Save to rates.json
        output_path = Path(__file__).parent.parent / "data" / "rates.json"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        print(f"Exported {len(export_data)} rates to {output_path}")
        
        # Also save metadata
        metadata = {
            "last_updated": datetime.now().isoformat(),
            "total_rates": len(export_data),
            "total_lenders": len(lender_counts),
            "scrapers_run": len(scraper_classes),
            "scrapers_successful": len(successful),
            "scrapers_failed": len(failed),
            "lenders": sorted(lender_counts.keys()),
            "scraper_results": [
                {
                    "lender": r.lender_slug,
                    "success": r.success,
                    "rates_found": r.rates_found,
                    "duration": r.duration_seconds,
                    "error": r.error_message[:100] if r.error_message else None
                }
                for r in results
            ]
        }
        
        metadata_path = Path(__file__).parent.parent / "data" / "metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"Saved metadata to {metadata_path}")
        
    except Exception as e:
        logger.error(f"Failed to export: {e}")
        print(f"Export error: {e}")
        import traceback
        traceback.print_exc()
    
    # Show 5-year fixed comparison (Top 20)
    print("\n" + "="*80)
    print("5-YEAR FIXED RATE COMPARISON (Top 20 Lowest)")
    print("="*80)
    
    comparison_rates = [r for r in valid_rates 
                       if r.term_months == 60 
                       and r.rate_type.value == "fixed"]
    
    sorted_rates = sorted(comparison_rates, key=lambda x: x.rate)[:20]
    
    for i, r in enumerate(sorted_rates, 1):
        spread = r.raw_data.get("spread_to_prime", "") if r.raw_data else ""
        spread_str = f" [{spread}]" if spread else ""
        print(f"  {i:2}. {r.lender_name:25} {r.rate}%{spread_str}")
    
    if not sorted_rates:
        print("  No 5-year fixed rates found")
    
    # Show 5-year variable comparison
    print("\n" + "="*80)
    print("5-YEAR VARIABLE RATE COMPARISON (Top 15 Lowest)")
    print("="*80)
    
    variable_rates = [r for r in valid_rates 
                     if r.term_months == 60 
                     and r.rate_type.value == "variable"]
    
    sorted_var = sorted(variable_rates, key=lambda x: x.rate)[:15]
    
    for i, r in enumerate(sorted_var, 1):
        spread = r.raw_data.get("spread_to_prime", "") if r.raw_data else ""
        spread_str = f" [{spread}]" if spread else ""
        print(f"  {i:2}. {r.lender_name:25} {r.rate}%{spread_str}")
    
    if not sorted_var:
        print("  No 5-year variable rates found")
    
    # Final summary
    total_duration = time.time() - start_time
    
    print("\n" + "="*80)
    print("FINAL SUMMARY")
    print("="*80)
    print(f"Total scrapers:     {len(scraper_classes)}")
    print(f"Successful:           {len(successful)}")
    print(f"Failed/Timeout:       {len(failed)}")
    print(f"Total rates scraped:  {len(all_rates)}")
    print(f"Valid rates:          {len(valid_rates)}")
    print(f"Total lenders:        {len(lender_counts)}")
    print(f"Total time:           {total_duration:.2f}s")
    print(f"Data exported to:     data/rates.json")
    print("="*80)
    
    # Return error code if too many failures
    if len(failed) > len(scraper_classes) * 0.5:  # More than 50% failed
        print("\nWARNING: More than 50% of scrapers failed!")
        return results, valid_rates, 1
    
    return results, valid_rates, 0


if __name__ == "__main__":
    results, rates, exit_code = scrape_all_lenders()
    
    # Show final status table
    print("\n" + "="*80)
    print("SCRAPER STATUS TABLE")
    print("="*80)
    print(f"{'Lender':<25} {'Status':<10} {'Rates':<8} {'Time(s)':<10} {'Error'}")
    print("-"*80)
    
    for r in results:
        status = "OK" if r.success else ("TIMEOUT" if "TIMEOUT" in (r.error_message or "") else "FAILED")
        error = r.error_message[:30] if r.error_message else ""
        print(f"{r.lender_slug:<25} {status:<10} {r.rates_found:<8} {r.duration_seconds:<10.1f} {error}")
    
    print("="*80)
    
    sys.exit(exit_code)
