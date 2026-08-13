"""Scraper modules for mortgage lenders."""

from .base import BaseScraper, ScraperError
from .rbc_scraper import RBCScraper
from .td_scraper import TDScraper
from .bmo_scraper import BMOScraper
from .scotiabank_scraper import ScotiabankScraper
from .cibc_scraper import CIBCScraper
from .tangerine_scraper import TangerineScraper
from .vancity_scraper import VancityScraper
from .atb_scraper import ATBScraper
from .coastcapital_scraper import CoastCapitalScraper
from .cmls_scraper import CMLSScraper
from .butler_scraper import ButlerMortgageScraper
from .streetcapital_scraper import StreetCapitalScraper
from .centum_scraper import CentumScraper
from .ratesca_scraper import RatesCaScraper
from .lowestrates_scraper import LowestRatesScraper
from .wowa_scraper import WOWAScraper

__all__ = [
    'BaseScraper',
    'ScraperError',
    'RBCScraper',
    'TDScraper',
    'BMOScraper',
    'ScotiabankScraper',
    'CIBCScraper',
    'TangerineScraper',
    'VancityScraper',
    'ATBScraper',
    'CoastCapitalScraper',
    'CMLSScraper',
    'ButlerMortgageScraper',
    'StreetCapitalScraper',
    'CentumScraper',
    'RatesCaScraper',
    'LowestRatesScraper',
    'WOWAScraper',
]
