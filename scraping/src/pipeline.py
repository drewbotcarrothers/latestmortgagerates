"""
Pipeline orchestrator - coordinates scraping, validation, and syncing.
"""

import yaml
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
from loguru import logger

from database import db
from validator import RateValidator
from models import RawRate, ScrapingResult

# Import scrapers
from scrapers.rbc_simple import RBCSimpleScraper
from scrapers.boc_scraper import BankOfCanadaScraper


class Pipeline:
    """
    Orchestrates the mortgage rate scraping pipeline:
    1. Load config
    2. Scrape lender rates
    3. Validate rates
    4. Save to local staging DB
    5. (Future) Sync to Hostinger
    """
    
    def __init__(self, config_path: Path = None):
        self.config_path = config_path or Path(__file__).parent.parent / "config" / "lenders.yaml"
        self.config = self._load_config()
        self.validator = RateValidator()
        
        # Map lender slugs to scraper classes
        self.scrapers = {
            "rbc": RBCSimpleScraper,
            "boc": BankOfCanadaScraper,
            # Add more as they're implemented
        }
    
    def _load_config(self) -> dict:
        """Load lender configuration from YAML."""
        with open(self.config_path, 'r') as f:
            return yaml.safe_load(f)
    
    def run_single(self, lender_slug: str) -> ScrapingResult:
        """
        Run scraping for a single lender.
        
        Args:
            lender_slug: e.g., "rbc", "td", "bmo"
            
        Returns:
            ScrapingResult with success/failure info
        """
        logger.info(f"Starting scrape for {lender_slug}")
        
        # Get scraper class
        scraper_class = self.scrapers.get(lender_slug)
        if not scraper_class:
            result = ScrapingResult(
                lender_slug=lender_slug,
                success=False,
                rates_found=0,
                error_message=f"No scraper implemented for {lender_slug}",
                scraped_at=datetime.utcnow()
            )
            db.log_scraping_result(result)
            return result
        
        # Run scraper
        import time
        start_time = time.time()
        scraper = scraper_class()
        
        try:
            rates = scraper.scrape()
            duration = time.time() - start_time
            
            result = ScrapingResult(
                lender_slug=lender_slug,
                success=True,
                rates_found=len(rates),
                scraped_at=datetime.utcnow(),
                duration_seconds=duration
            )
            
            # Log and save
            db.log_scraping_result(result)
            db.save_raw_rates(rates)
            
            # Validate
            validation_results = self.validator.validate_all(rates)
            stats = self.validator.get_stats(validation_results)
            logger.info(f"Validation: {stats}")
            
        except Exception as e:
            duration = time.time() - start_time
            logger.error(f"Scraping failed for {lender_slug}: {e}")
            result = ScrapingResult(
                lender_slug=lender_slug,
                success=False,
                rates_found=0,
                error_message=str(e),
                scraped_at=datetime.utcnow(),
                duration_seconds=duration
            )
            db.log_scraping_result(result)
        
        return result
    
    def run_all(self, priority_filter: Optional[int] = None) -> List[ScrapingResult]:
        """
        Run scraping for all configured lenders.
        
        Args:
            priority_filter: If set, only scrape lenders with this priority or higher
            
        Returns:
            List of ScrapingResults
        """
        results = []
        lenders = self.config.get('lenders', {})
        
        # Sort by priority
        lender_list = []
        for slug, config in lenders.items():
            if priority_filter is None or config.get('priority', 99) <= priority_filter:
                lender_list.append((slug, config))
        
        lender_list.sort(key=lambda x: x[1].get('priority', 99))
        
        logger.info(f"Running {len(lender_list)} lenders")
        
        for slug, config in lender_list:
            logger.info(f"Scraping {config.get('name', slug)} ({slug})")
            try:
                result = self.run_single(slug)
                results.append(result)
            except Exception as e:
                logger.error(f"Pipeline failed for {slug}: {e}")
                results.append(ScrapingResult(
                    lender_slug=slug,
                    success=False,
                    rates_found=0,
                    error_message=str(e),
                    scraped_at=datetime.utcnow()
                ))
        
        return results
    
    def get_stats(self) -> dict:
        """Get pipeline statistics."""
        return db.get_scraping_stats()
    
    def get_latest_rates(self, lender_slug: Optional[str] = None) -> List[dict]:
        """Get latest scraped rates."""
        return db.get_latest_rates(lender_slug)


def run_pipeline_demo():
    """Run a demo of the pipeline."""
    print("="*70)
    print("MORTGAGE RATE SCRAPING PIPELINE")
    print("="*70)
    
    pipeline = Pipeline()
    
    # Run RBC scraper
    print("\nScraping RBC rates...")
    result = pipeline.run_single("rbc")
    
    print(f"\nResult:")
    print(f"  Success: {result.success}")
    print(f"  Rates found: {result.rates_found}")
    if result.duration_seconds:
        print(f"  Duration: {result.duration_seconds:.1f}s")
    if result.error_message:
        print(f"  Error: {result.error_message}")
    
    # Show stats
    stats = pipeline.get_stats()
    print(f"\nPipeline Stats:")
    for key, value in stats.items():
        print(f"  {key}: {value}")
    
    # Show latest rates
    rates = pipeline.get_latest_rates("rbc")
    if rates:
        print(f"\nLatest RBC rates (up to {min(5, len(rates))} shown):")
        for rate in rates[:5]:
            posted = f" (posted: {rate['posted_rate']}%)" if rate.get('posted_rate') else ""
            print(f"  {rate['term_months']}mo {rate['rate_type']}: {rate['rate']}%{posted}")
    
    print("\n" + "="*70)


if __name__ == "__main__":
    run_pipeline_demo()
