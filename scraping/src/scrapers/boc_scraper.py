"""
Bank of Canada Valet API scraper.
Provides official posted rates and benchmark data via JSON API.
Updated: April 25, 2026
"""

import re
from decimal import Decimal
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path

import httpx
from loguru import logger

import sys
sys.path.append(str(Path(__file__).parent.parent))
from models import RawRate, RateType, MortgageType


class BankOfCanadaScraper:
    """Scraper for Bank of Canada Valet API."""
    
    LENDER_SLUG = "boc"
    LENDER_NAME = "Bank of Canada (Benchmark)"
    BASE_URL = "https://www.bankofcanada.ca/valet"
    
    ENDPOINTS = {
        "posted_chartered": "/observations/group/POSTED_CHARTERED_BANKS/json?recent=4",
        "mortgage_rates": "/observations/group/A4_RATES_MORTGAGES/json?recent=4",
        "broker_5yr": "/observations/BROKER_AVERAGE_5YR_VRM/json?recent=10",
        "prime_rate": "/observations/V122495/json?recent=4",
    }
    
    SERIES_NAMES = {
        "V122495": "Prime Rate",
        "V122497": "1-year posted",
        "V122498": "3-year posted",
        "V122499": "5-year posted",
        "V122500": "7-year posted",
        "V122501": "10-year posted",
    }
    
    def __init__(self):
        self.scraped_at = datetime.utcnow()
        self.client = httpx.Client(timeout=30.0)
    
    def scrape(self) -> List[RawRate]:
        """Scrape BoC benchmark rates."""
        logger.info("Fetching Bank of Canada benchmark rates...")
        
        all_rates = []
        
        # Get posted chartered bank rates
        rates1 = self._get_posted_chartered()
        all_rates.extend(rates1)
        
        # Get mortgage lending rates
        rates2 = self._get_mortgage_rates()
        all_rates.extend(rates2)
        
        # Get broker average
        rates3 = self._get_broker_average()
        all_rates.extend(rates3)
        
        logger.info(f"Scraped {len(all_rates)} rates from Bank of Canada")
        return all_rates
    
    def _get_posted_chartered(self) -> List[RawRate]:
        """Get posted rates from chartered banks via BoC API."""
        rates = []
        url = f"{self.BASE_URL}{self.ENDPOINTS['posted_chartered']}"
        
        try:
            resp = self.client.get(url)
            resp.raise_for_status()
            data = resp.json()
            
            series = data.get('seriesObservations', {}).get('series', [])
            
            for s in series:
                series_id = s.get('seriesId', '')
                name = self.SERIES_NAMES.get(series_id, f"Series {series_id}")
                term_months = self._parse_term_from_name(name)
                
                observations = s.get('observations', [])
                if observations:
                    latest = observations[-1]
                    value = latest.get('value')
                    date = latest.get('d')
                    
                    if value and value != '..':
                        try:
                            rate_val = Decimal(str(value))
                            rates.append(RawRate(
                                lender_slug="boc_posted",
                                lender_name=f"Bank of Canada - Posted {name}",
                                term_months=term_months or 60,
                                rate_type=RateType.FIXED,
                                mortgage_type=MortgageType.UNINSURED,
                                rate=rate_val,
                                source_url=url,
                                scraped_at=self.scraped_at,
                                raw_data={
                                    "source": "boc_valet_api",
                                    "series_id": series_id,
                                    "date": date,
                                    "type": "posted_chartered",
                                    "last_verified": "2026-04-25"
                                }
                            ))
                        except:
                            pass
            
            logger.info(f"Found {len(rates)} posted chartered bank rates")
            
        except Exception as e:
            logger.error(f"Failed to get posted chartered rates: {e}")
        
        return rates
    
    def _get_mortgage_rates(self) -> List[RawRate]:
        """Get aggregate mortgage lending rates."""
        rates = []
        url = f"{self.BASE_URL}{self.ENDPOINTS['mortgage_rates']}"
        
        try:
            resp = self.client.get(url)
            resp.raise_for_status()
            data = resp.json()
            
            series = data.get('seriesObservations', {}).get('series', [])
            
            for s in series:
                series_id = s.get('seriesId', '')
                label = s.get('label', '')
                
                observations = s.get('observations', [])
                if observations:
                    latest = observations[-1]
                    value = latest.get('value')
                    
                    if value and value != '..':
                        try:
                            rate_val = Decimal(str(value))
                            rates.append(RawRate(
                                lender_slug="boc_aggregate",
                                lender_name=f"BoC - {label}",
                                term_months=60,
                                rate_type=RateType.FIXED,
                                mortgage_type=self._parse_mortgage_type(label),
                                rate=rate_val,
                                source_url=url,
                                scraped_at=self.scraped_at,
                                raw_data={
                                    "source": "boc_valet_api",
                                    "series_id": series_id,
                                    "label": label,
                                    "last_verified": "2026-04-25"
                                }
                            ))
                        except:
                            pass
            
            logger.info(f"Found {len(rates)} aggregate mortgage rates")
            
        except Exception as e:
            logger.error(f"Failed to get mortgage rates: {e}")
        
        return rates
    
    def _get_broker_average(self) -> List[RawRate]:
        """Get broker average 5-year variable rate."""
        rates = []
        url = f"{self.BASE_URL}{self.ENDPOINTS['broker_5yr']}"
        
        try:
            resp = self.client.get(url)
            resp.raise_for_status()
            data = resp.json()
            
            observations = data.get('seriesDetail', {}).get('BROKER_AVERAGE_5YR_VRM', {}).get('observations', [])
            if not observations:
                observations = data.get('seriesObservations', {}).get('observations', [])
            
            if observations:
                latest = observations[-1]
                value = latest.get('value')
                
                if value and value != '..':
                    rate_val = Decimal(str(value))
                    rates.append(RawRate(
                        lender_slug="boc_broker_avg",
                        lender_name="Bank of Canada - Broker Average (5yr Variable)",
                        term_months=60,
                        rate_type=RateType.VARIABLE,
                        mortgage_type=MortgageType.UNINSURED,
                        rate=rate_val,
                        source_url=url,
                        scraped_at=self.scraped_at,
                        raw_data={
                            "source": "boc_valet_api",
                            "series_id": "BROKER_AVERAGE_5YR_VRM",
                            "date": latest.get('d'),
                            "last_verified": "2026-04-25"
                        }
                    ))
                    logger.info(f"Found broker average: {rate_val}%")
            
        except Exception as e:
            logger.error(f"Failed to get broker average: {e}")
        
        return rates
    
    def _parse_term_from_name(self, name: str) -> Optional[int]:
        """Extract term in months from series name."""
        name = name.lower()
        
        if '1-year' in name or '1 year' in name:
            return 12
        elif '3-year' in name or '3 year' in name:
            return 36
        elif '5-year' in name or '5 year' in name:
            return 60
        elif '7-year' in name or '7 year' in name:
            return 84
        elif '10-year' in name or '10 year' in name:
            return 120
        
        return None
    
    def _parse_mortgage_type(self, label: str) -> MortgageType:
        """Determine mortgage type from label."""
        label = label.lower()
        
        if 'insured' in label:
            return MortgageType.INSURED
        elif 'uninsured' in label:
            return MortgageType.UNINSURED
        else:
            return MortgageType.UNINSURED


if __name__ == "__main__":
    scraper = BankOfCanadaScraper()
    try:
        rates = scraper.scrape()
        print(f"\nFound {len(rates)} rates from Bank of Canada:")
        print("-" * 60)
        
        for r in rates:
            print(f"  {r.lender_name}: {r.rate}% ({r.term_months}mo {r.rate_type.value})")
            
        print("-" * 60)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()