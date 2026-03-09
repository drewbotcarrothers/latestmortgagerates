"""
Test new scrapers (14 new lenders added today):
- Vancity, ATB, CWB, Coast Capital
- CMLS, Merix, Lendwise, Butler, IntelliMortgage, Street Capital, Centum
- Rates.ca, LowestRates.ca, WOWA.ca
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "src"))

from loguru import logger
import time

# New scrapers
from src.scrapers.vancity_scraper import VancityScraper
from src.scrapers.atb_scraper import ATBScraper
from src.scrapers.cwb_scraper import CWBScraper
from src.scrapers.coastcapital_scraper import CoastCapitalScraper
from src.scrapers.cmls_scraper import CMLSScraper
from src.scrapers.merix_scraper import MerixScraper
from src.scrapers.lendwise_scraper import LendwiseScraper
from src.scrapers.butler_scraper import ButlerMortgageScraper
from src.scrapers.intellimortgage_scraper import IntelliMortgageScraper
from src.scrapers.streetcapital_scraper import StreetCapitalScraper
from src.scrapers.centum_scraper import CentumScraper
from src.scrapers.ratesca_scraper import RatesCaScraper
from src.scrapers.lowestrates_scraper import LowestRatesScraper
from src.scrapers.wowa_scraper import WOWAScraper


def test_new_scrapers():
    """Test all new scrapers."""
    
    logger.info("Testing 14 NEW scrapers")
    start_time = time.time()
    
    # Regional Banks & Credit Unions
    regional_scrapers = [
        ("Vancity", VancityScraper()),
        ("ATB Financial", ATBScraper()),
        ("Canadian Western Bank", CWBScraper()),
        ("Coast Capital Savings", CoastCapitalScraper()),
    ]
    
    # Monoline Lenders
    monoline_scrapers = [
        ("CMLS Financial", CMLSScraper()),
        ("Merix Financial", MerixScraper()),
        ("Lendwise", LendwiseScraper()),
        ("Butler Mortgage", ButlerMortgageScraper()),
        ("IntelliMortgage", IntelliMortgageScraper()),
        ("Street Capital", StreetCapitalScraper()),
        ("Centum", CentumScraper()),
    ]
    
    # Aggregators
    aggregator_scrapers = [
        ("Rates.ca", RatesCaScraper()),
        ("LowestRates.ca", LowestRatesScraper()),
        ("WOWA.ca", WOWAScraper()),
    ]
    
    all_scrapers = regional_scrapers + monoline_scrapers + aggregator_scrapers
    
    print("\n" + "="*70)
    print("TESTING 14 NEW SCRAPERS")
    print("="*70)
    
    all_rates = []
    results = []
    
    for name, scraper in all_scrapers:
        scrape_start = time.time()
        try:
            rates = scraper.scrape()
            duration = time.time() - scrape_start
            
            all_rates.extend(rates)
            results.append({
                "name": name,
                "success": True,
                "rates": len(rates),
                "duration": duration
            })
            
            print(f"\n[OK] {name}: {len(rates)} rates in {duration:.2f}s")
            
            # Show sample rates (5-year fixed if available)
            five_year = [r for r in rates if r.term_months == 60 and r.rate_type.value == "fixed"]
            if five_year:
                print(f"   5yr Fixed: {five_year[0].rate}%")
            
        except Exception as e:
            duration = time.time() - scrape_start
            results.append({
                "name": name,
                "success": False,
                "rates": 0,
                "duration": duration,
                "error": str(e)
            })
            print(f"\n[FAIL] {name}: FAILED - {e}")
    
    # Summary
    total_duration = time.time() - start_time
    success_count = sum(1 for r in results if r["success"])
    
    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    print(f"Total scrapers: {len(all_scrapers)}")
    print(f"Successful: {success_count}")
    print(f"Failed: {len(all_scrapers) - success_count}")
    print(f"Total rates scraped: {len(all_rates)}")
    print(f"Total time: {total_duration:.2f}s")
    
    # Show 5-year fixed comparison from new scrapers
    print("\n" + "="*70)
    print("5-YEAR FIXED RATES (New Scrapers)")
    print("="*70)
    
    five_year_rates = [r for r in all_rates 
                       if r.term_months == 60 
                       and r.rate_type.value == "fixed"]
    
    sorted_rates = sorted(five_year_rates, key=lambda x: x.rate)
    
    for r in sorted_rates[:20]:  # Show top 20
        print(f"  {r.lender_name:25} {r.rate}%")
    
    print("\n" + "="*70)
    print("TEST COMPLETE")
    print("="*70)
    
    return results


if __name__ == "__main__":
    results = test_new_scrapers()
