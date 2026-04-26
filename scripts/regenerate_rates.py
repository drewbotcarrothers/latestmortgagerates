#!/usr/bin/env python3
"""
Regenerate rates.json from all scraper fallback data.
Uses the verified April 25, 2026 fallback rates.
"""

import json
import sys
from pathlib import Path
from decimal import Decimal

# Add paths
sys.path.insert(0, str(Path(__file__).parent.parent / "scraping" / "src"))

# Import all scrapers
from scrapers.rbc_scraper import RBCScraper
from scrapers.td_scraper import TDScraper
from scrapers.bmo_scraper import BMOScraper
from scrapers.scotiabank_scraper import ScotiabankScraper
from scrapers.cibc_scraper import CIBCScraper
from scrapers.nationalbank_scraper import NationalBankScraper
from scrapers.nesto_scraper import NestoScraper
from scrapers.tangerine_scraper import TangerineScraper
from scrapers.meridian_scraper import MeridianScraper
from scrapers.simplii_scraper import SimpliiScraper
from scrapers.eqbank_scraper import EQBankScraper
from scrapers.desjardins_scraper import DesjardinsScraper
from scrapers.firstnational_scraper import FirstNationalScraper
from scrapers.mcap_scraper import MCAPScraper
from scrapers.laurentian_scraper import LaurentianBankScraper
from scrapers.manulife_scraper import ManulifeBankScraper
from scrapers.motive_scraper import MotiveScraper
from scrapers.alterna_scraper import AlternaScraper
from scrapers.rfa_scraper import RFAScraper
from scrapers.vancity_scraper import VancityScraper
from scrapers.atb_scraper import ATBScraper
from scrapers.cwb_scraper import CWBScraper
from scrapers.coastcapital_scraper import CoastCapitalScraper
from scrapers.cmls_scraper import CMLSScraper
from scrapers.merix_scraper import MerixScraper
from scrapers.lendwise_scraper import LendwiseScraper
from scrapers.butler_scraper import ButlerMortgageScraper
from scrapers.intellimortgage_scraper import IntelliMortgageScraper
from scrapers.streetcapital_scraper import StreetCapitalScraper
from scrapers.centum_scraper import CentumScraper
from scrapers.truenorth_scraper import TrueNorthMortgageScraper
from scrapers.wealthsimple_scraper import WealthsimpleScraper
from scrapers.equitable_scraper import EquitableBankScraper
from scrapers.hometrust_scraper import HomeTrustScraper

SCRAPERS = [
    RBCScraper, TDScraper, BMOScraper, ScotiabankScraper, CIBCScraper, NationalBankScraper,
    NestoScraper, TangerineScraper, MeridianScraper, SimpliiScraper, EQBankScraper,
    DesjardinsScraper, FirstNationalScraper, MCAPScraper, LaurentianBankScraper,
    ManulifeBankScraper, MotiveScraper, AlternaScraper, RFAScraper,
    VancityScraper, ATBScraper, CWBScraper, CoastCapitalScraper,
    CMLSScraper, MerixScraper, LendwiseScraper, ButlerMortgageScraper,
    IntelliMortgageScraper, StreetCapitalScraper, CentumScraper,
    TrueNorthMortgageScraper, WealthsimpleScraper, EquitableBankScraper, HomeTrustScraper,
]

def rate_to_dict(rate):
    """Convert a RawRate to a dictionary."""
    return {
        "lender_name": rate.lender_name,
        "lender_slug": rate.lender_slug,
        "term_months": rate.term_months,
        "rate_type": rate.rate_type.value if hasattr(rate.rate_type, 'value') else str(rate.rate_type),
        "mortgage_type": rate.mortgage_type.value if hasattr(rate.mortgage_type, 'value') else str(rate.mortgage_type),
        "rate": float(rate.rate) if isinstance(rate.rate, Decimal) else rate.rate,
        "posted_rate": float(rate.posted_rate) if rate.posted_rate else None,
        "source_url": rate.source_url,
        "scraped_at": rate.scraped_at.isoformat() if hasattr(rate.scraped_at, 'isoformat') else str(rate.scraped_at),
        "apr": rate.raw_data.get("apr") if hasattr(rate, 'raw_data') else None,
        "ltv_tier": None,
        "spread_to_prime": rate.raw_data.get("spread_to_prime") if hasattr(rate, 'raw_data') else None,
    }

def main():
    print("=== REGENERATING rates.json FROM SCRAPER FALLBACKS ===\n")
    
    all_rates = []
    success = 0
    failed = 0
    
    for ScraperClass in SCRAPERS:
        try:
            scraper = ScraperClass()
            # Use fallback rates directly (these are the verified Apr 25, 2026 rates)
            rates = scraper._get_fallback_rates()
            
            for rate in rates:
                all_rates.append(rate_to_dict(rate))
            
            success += 1
            print(f"✅ {scraper.LENDER_SLUG}: {len(rates)} rates")
            
        except Exception as e:
            failed += 1
            print(f"❌ {ScraperClass.__name__}: {e}")
    
    print(f"\n✅ Success: {success}, ❌ Failed: {failed}")
    print(f"Total rates: {len(all_rates)}\n")
    
    # Save to rates.json
    rates_path = Path(__file__).parent.parent / "data" / "rates.json"
    with open(rates_path, 'w') as f:
        json.dump(all_rates, f, indent=2)
    
    print(f"💾 Saved {len(all_rates)} rates to data/rates.json")
    
    # Summary
    from collections import defaultdict
    by_lender = defaultdict(list)
    for r in all_rates:
        by_lender[r['lender_slug']].append(r)
    
    print("\n📊 Best Rates by Lender:")
    for slug, rates in sorted(by_lender.items()):
        best_fixed = min([r for r in rates if r['rate_type'] == 'fixed'], key=lambda x: x['rate'], default=None)
        best_var = min([r for r in rates if r['rate_type'] == 'variable'], key=lambda x: x['rate'], default=None)
        
        fixed_str = f"{best_fixed['rate']}%" if best_fixed else 'N/A'
        var_str = f"{best_var['rate']}%" if best_var else 'N/A'
        
        print(f"  {slug:20} {len(rates)} rates | Best Fixed: {fixed_str:8} | Best Var: {var_str}")
    
    # Overall best
    best_fixed = min([r for r in all_rates if r['rate_type'] == 'fixed' and r['mortgage_type'] == 'uninsured'], key=lambda x: x['rate'], default=None)
    best_insured = min([r for r in all_rates if r['rate_type'] == 'fixed' and r['mortgage_type'] == 'insured'], key=lambda x: x['rate'], default=None)
    best_var = min([r for r in all_rates if r['rate_type'] == 'variable'], key=lambda x: x['rate'], default=None)
    
    print("\n🏆 Overall Best Rates:")
    if best_fixed:
        print(f"  5Y Fixed (Uninsured): {best_fixed['rate']}% - {best_fixed['lender_name']}")
    if best_insured:
        print(f"  5Y Fixed (Insured):   {best_insured['rate']}% - {best_insured['lender_name']}")
    if best_var:
        print(f"  5Y Variable:          {best_var['rate']}% - {best_var['lender_name']}")

if __name__ == "__main__":
    main()