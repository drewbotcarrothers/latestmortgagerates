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
from .cwb_scraper import CWBScraper
from .coastcapital_scraper import CoastCapitalScraper
from .cmls_scraper import CMLSScraper
from .merix_scraper import MerixScraper
from .lendwise_scraper import LendwiseScraper
from .butler_scraper import ButlerMortgageScraper
from .intellimortgage_scraper import IntelliMortgageScraper
from .streetcapital_scraper import StreetCapitalScraper
from .centum_scraper import CentumScraper

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
    'CWBScraper',
    'CoastCapitalScraper',
    'CMLSScraper',
    'MerixScraper',
    'LendwiseScraper',
    'ButlerMortgageScraper',
    'IntelliMortgageScraper',
    'StreetCapitalScraper',
    'CentumScraper',
]
