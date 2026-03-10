"""
Test all lenders (30 direct lenders - NO aggregators).
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


# Define approved lender slugs ( whitelist )
APPROVED_LENDERS = {
    'rbc', 'td', 'bmo', 'scotiabank', 'cibc', 'nationalbank',
    'nesto', 'tangerine', 'eqbank', 'simplii', 'motive', 'alterna',
    'meridian', 'desjardins', 'vancity', 'coastcapital',
    'atb', 'cwb',
    'firstnational', 'mcap', 'laurentian', 'manulife', 'rfa',
    'cmls', 'merix', 'lendwise', 'butlermortgage', 'intellimortgage', 'streetcapital', 'centum'
}


def scrape_all_lenders():
    """Scrape all lenders, save to database, and export for website."""
    
    logger.info("Starting full lender scraping pipeline (30 direct lenders)")
    start_time = time.time()
    
    # Initialize components
    db = Database()
    validator = RateValidator()
    
    # All scrapers - organized by category (NO aggregators)
    scrapers = [
        # Big 6 Banks (6)
        RBCScraper(),
        TDScraper(),
        BMOScraper(),
        ScotiabankScraper(),
        CIBCScraper(),
        NationalBankScraper(),
        
        # Digital Banks (6)
        NestoScraper(),
        TangerineScraper(),
        EQBankScraper(),
        SimpliiScraper(),
        MotiveScraper(),
        AlternaScraper(),
        
        # Credit Unions (4)
        MeridianScraper(),
        DesjardinsScraper(),
        VancityScraper(),
        CoastCapitalScraper(),
        
        # Regional Banks (2)
        ATBScraper(),
        CWBScraper(),
        
        # Monoline Lenders (11)
        FirstNationalScraper(),
        MCAPScraper(),
        LaurentianBankScraper(),
        ManulifeBankScraper(),
        RFAScraper(),
        CMLSScraper(),
        MerixScraper(),
        LendwiseScraper(),
        ButlerMortgageScraper(),
        IntelliMortgageScraper(),
        StreetCapitalScraper(),
        CentumScraper(),
    ]
    
    all_rates = []
    results = []
    
    print("\n" + "="*70)
    print(f"SCRAPING ALL LENDERS ({len(scrapers)} Direct Lenders - NO Aggregators)")
    print("="*70)
    
    for i, scraper in enumerate(scrapers, 1):
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
            
            print(f"\n[{i}/{len(scrapers)}] {scraper.LENDER_NAME}: {len(rates)} rates")
            
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
            print(f"\n[{i}/{len(scrapers)}] {scraper.LENDER_NAME}: FAILED - {e}")
    
    # Filter rates: only approved lenders, no aggregators
    print("\n" + "="*70)
    print("FILTERING RATES - Removing aggregators and unknown lenders")
    print("="*70)
    
    filtered_rates = []
    removed_count = 0
    
    for rate in all_rates:
        # Check if lender is in approved list
        if rate.lender_slug not in APPROVED_LENDERS:
            logger.warning(f"Removing rate from unapproved lender: {rate.lender_slug}")
            removed_count += 1
            continue
        
        # Check if source is an aggregator
        source_lower = rate.source_url.lower() if rate.source_url else ""
        if any(agg in source_lower for agg in ['rates.ca', 'lowestrates.ca', 'wowa.ca']):
            logger.warning(f"Removing aggregator rate from: {rate.source_url}")
            removed_count += 1
            continue
        
        filtered_rates.append(rate)
    
    print(f"Original rates: {len(all_rates)}")
    print(f"Filtered rates: {len(filtered_rates)}")
    print(f"Removed: {removed_count} (aggregators/unknown lenders)")
    
    # Validate and save rates
    print("\n" + "="*70)
    print("VALIDATING AND SAVING RATES")
    print("="*70)
    
    valid_rates = []
    invalid_rates = []
    
    for rate in filtered_rates:
        try:
            is_valid, product, warnings, errors = validator.validate_rate(rate)
            if is_valid:
                valid_rates.append(rate)
            else:
                invalid_rates.append((rate, errors))
        except Exception as e:
            logger.warning(f"Validation error for {rate.lender_slug}: {e}")
            valid_rates.append(rate)
    
    print(f"\nTotal rates: {len(filtered_rates)}")
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
    
    # Export to website data
    print("\n" + "="*70)
    print("EXPORTING TO WEBSITE DATA")
    print("="*70)
    
    try:
        # Convert to JSON format expected by website
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
                "scraped_at": rate.scraped_at.isoformat(),
                "apr": rate.raw_data.get("apr"),
                "ltv_tier": rate.raw_data.get("ltv_tier"),
                "spread_to_prime": rate.raw_data.get("spread_to_prime"),
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
            "total_lenders": len(set(r["lender_slug"] for r in export_data)),
            "scrapers_run": len(scrapers),
            "scrapers_successful": sum(1 for r in results if r.success),
            "lenders": sorted(set(r["lender_slug"] for r in export_data))
        }
        
        metadata_path = Path(__file__).parent.parent / "data" / "metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"Saved metadata to {metadata_path}")
        
    except Exception as e:
        logger.error(f"Failed to export: {e}")
        print(f"Export error: {e}")
    
    # Show 5-year fixed comparison (TOP 20)
    print("\n" + "="*70)
    print("5-YEAR FIXED RATE COMPARISON (Top 20 Lowest)")
    print("="*70)
    
    comparison_rates = [r for r in valid_rates 
                       if r.term_months == 60 
                       and r.rate_type.value == "fixed"]
    
    sorted_rates = sorted(comparison_rates, key=lambda x: x.rate)[:20]
    
    for i, r in enumerate(sorted_rates, 1):
        spread = r.raw_data.get("spread_to_prime", "")
        spread_str = f" [{spread}]" if spread else ""
        print(f"  {i:2}. {r.lender_name:25} {r.rate}%{spread_str}")
    
    if not sorted_rates:
        print("  No 5-year fixed rates found")
    
    # Show 5-year variable comparison
    print("\n" + "="*70)
    print("5-YEAR VARIABLE RATE COMPARISON (Top 15 Lowest)")
    print("="*70)
    
    variable_rates = [r for r in valid_rates 
                     if r.term_months == 60 
                     and r.rate_type.value == "variable"]
    
    sorted_var = sorted(variable_rates, key=lambda x: x.rate)[:15]
    
    for i, r in enumerate(sorted_var, 1):
        spread = r.raw_data.get("spread_to_prime", "")
        spread_str = f" [{spread}]" if spread else ""
        print(f"  {i:2}. {r.lender_name:25} {r.rate}%{spread_str}")
    
    if not sorted_var:
        print("  No 5-year variable rates found")
    
    # Total time
    total_duration = time.time() - start_time
    success_count = sum(1 for r in results if r.success)
    
    print("\n" + "="*70)
    print(f"PIPELINE COMPLETE: {success_count}/{len(scrapers)} lenders scraped successfully")
    print(f"Total rates exported: {len(valid_rates)}")
    print(f"Total time: {total_duration:.2f}s")
    print(f"Data exported to: data/rates.json")
    print("="*70)
    
    return results, valid_rates


if __name__ == "__main__":
    results, rates = scrape_all_lenders()
    
    # Show final status
    print("\nFinal Status:")
    for r in results:
        status = "OK" if r.success else "FAILED"
        print(f"  {r.lender_slug:20} {status:7} {r.rates_found} rates")
