import sys
from pathlib import Path
import json

sys.path.insert(0, 'scraping/src')

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
    return {
        'lender_name': rate.lender_name,
        'lender_slug': rate.lender_slug,
        'term_months': rate.term_months,
        'rate_type': rate.rate_type.value if hasattr(rate.rate_type, 'value') else str(rate.rate_type),
        'mortgage_type': rate.mortgage_type.value if hasattr(rate.mortgage_type, 'value') else str(rate.mortgage_type),
        'rate': float(rate.rate) if hasattr(rate.rate, '__float__') else rate.rate,
        'posted_rate': float(rate.posted_rate) if rate.posted_rate else None,
        'source_url': rate.source_url,
        'scraped_at': rate.scraped_at.isoformat() if hasattr(rate.scraped_at, 'isoformat') else str(rate.scraped_at),
        'apr': rate.raw_data.get('apr') if hasattr(rate, 'raw_data') else None,
        'ltv_tier': None,
        'spread_to_prime': rate.raw_data.get('spread_to_prime') if hasattr(rate, 'raw_data') else None,
    }

all_rates = []
for ScraperClass in SCRAPERS:
    try:
        scraper = ScraperClass()
        rates = scraper._get_fallback_rates()
        for rate in rates:
            all_rates.append(rate_to_dict(rate))
        print(f'OK  {scraper.LENDER_SLUG}: {len(rates)} rates')
    except Exception as e:
        print(f'ERR {ScraperClass.__name__}: {e}')

slugs = set()
for r in all_rates:
    slugs.add(r['lender_slug'])

print()
print(f'Total: {len(all_rates)} rates from {len(slugs)} lenders')

with open('data/rates.json', 'w') as f:
    json.dump(all_rates, f, indent=2)
print('Saved to data/rates.json')
