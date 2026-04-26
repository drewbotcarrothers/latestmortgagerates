"""
Clean scraped rates and save to data/rates.json
Applies deduplication, validation, and filtering.

Usage:
    python clean_and_save.py [input_file] [output_file]
    
    If no input_file provided, reads from data/rates.json
    If no output_file provided, writes to data/rates.json
"""

import sys
import json
from pathlib import Path
from decimal import Decimal
from datetime import datetime
from typing import List, Dict

sys.path.insert(0, str(Path(__file__).parent / "src"))

from loguru import logger
from models import RawRate, RateType, MortgageType
from deduplicator import RateDeduplicator


def load_rates_from_json(filepath: str) -> List[RawRate]:
    """Load rates from JSON file."""
    with open(filepath, 'r') as f:
        data = json.load(f)
    
    rates = []
    for item in data:
        try:
            # Set raw_data.source for tracking
            raw_data = item.get("raw_data", {})
            if not raw_data.get("source") and item.get("source_url"):
                # Derive source from URL domain
                url = item.get("source_url", "")
                if "ratehub" in url:
                    raw_data["source"] = "ratehub"
                elif "rates.ca" in url:
                    raw_data["source"] = "ratesca"
                elif "lowestrates" in url:
                    raw_data["source"] = "lowestrates"
                elif "wowa" in url:
                    raw_data["source"] = "wowa"
                else:
                    raw_data["source"] = f"{item.get('lender_slug', 'unknown')}_live_scrape"
            
            rate = RawRate(
                lender_slug=item.get("lender_slug", ""),
                lender_name=item.get("lender_name"),
                term_months=int(item.get("term_months", 0)),
                rate_type=RateType(item.get("rate_type", "fixed")),
                mortgage_type=MortgageType(item.get("mortgage_type", "uninsured")) if item.get("mortgage_type") else None,
                rate=Decimal(str(item.get("rate", 0))),
                posted_rate=Decimal(str(item["posted_rate"])) if item.get("posted_rate") else None,
                source_url=item.get("source_url", ""),
                scraped_at=datetime.fromisoformat(item["scraped_at"]) if item.get("scraped_at") else datetime.utcnow(),
                raw_data=raw_data
            )
            rates.append(rate)
        except Exception as e:
            logger.warning(f"Failed to parse rate item: {e}")
            continue
    
    return rates


def save_rates_to_json(rates: List[RawRate], filepath: str, stats: Dict = None):
    """Save cleaned rates to JSON file."""
    output = []
    for rate in rates:
        item = {
            "lender_name": rate.lender_name or rate.lender_slug,
            "lender_slug": rate.lender_slug,
            "term_months": rate.term_months,
            "rate_type": rate.rate_type.value,
            "rate": float(rate.rate),
            "mortgage_type": rate.mortgage_type.value if rate.mortgage_type else "uninsured",
            "apr": str(rate.raw_data.get("apr")) if rate.raw_data and rate.raw_data.get("apr") else None,
            "posted_rate": float(rate.posted_rate) if rate.posted_rate else None,
            "ltv_tier": rate.raw_data.get("ltv_tier") if rate.raw_data else None,
            "spread_to_prime": rate.raw_data.get("spread_to_prime") if rate.raw_data else None,
            "source_url": rate.source_url,
            "scraped_at": rate.scraped_at.isoformat() if rate.scraped_at else datetime.utcnow().isoformat(),
            "raw_data": rate.raw_data or {}
        }
        output.append(item)
    
    # Add metadata as a separate cleaning report
    metadata = {
        "generated_at": datetime.utcnow().isoformat(),
        "total_rates": len(output),
        "cleaning_stats": stats or {},
        "data_quality": "deduplicated_and_validated"
    }
    
    # Save metadata to a separate file (don't overwrite data/metadata.json)
    metadata_file = Path(filepath).parent / "cleaning_metadata.json"
    with open(metadata_file, 'w') as f:
        json.dump(metadata, f, indent=2, default=str)
    
    # Save rates as flat array (matching original format)
    with open(filepath, 'w') as f:
        json.dump(output, f, indent=2, default=str)
    
    logger.success(f"Saved {len(output)} cleaned rates to {filepath}")
    logger.success(f"Saved cleaning metadata to {metadata_file}")


def main():
    # Default paths
    input_file = sys.argv[1] if len(sys.argv) > 1 else "data/rates.json"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "data/rates.json"
    
    input_path = Path(input_file)
    if not input_path.exists():
        logger.error(f"Input file not found: {input_file}")
        sys.exit(1)
    
    logger.info(f"Loading rates from {input_file}...")
    rates = load_rates_from_json(input_file)
    logger.info(f"Loaded {len(rates)} raw rates")
    
    logger.info("Running deduplication and validation...")
    deduplicator = RateDeduplicator()
    clean_rates, stats = deduplicator.deduplicate(rates)
    
    logger.info(f"\nCleaning Results:")
    logger.info(f"  Input:    {stats['input_count']}")
    logger.info(f"  Output:   {stats['output_count']}")
    logger.info(f"  Removed:  {stats['removed_aggregator']} aggregator")
    logger.info(f"             {stats['removed_duplicates']} duplicates")
    logger.info(f"             {stats['removed_unrealistic']} unrealistic")
    logger.info(f"             {stats['removed_no_metadata']} no-metadata")
    logger.info(f"             {stats['removed_inferior']} inferior")
    logger.info(f"  Flagged:  {stats['flagged_suspicious']} suspicious")
    
    if stats["sources_used"]:
        logger.info(f"\nSources used:")
        for source, count in sorted(stats["sources_used"].items(), key=lambda x: -x[1]):
            logger.info(f"  {source}: {count}")
    
    if stats["by_lender"]:
        logger.info(f"\nRates per lender:")
        for slug, count in sorted(stats["by_lender"].items(), key=lambda x: -x[1]):
            logger.info(f"  {slug}: {count}")
    
    save_rates_to_json(clean_rates, output_file, stats)
    logger.success("Done!")


if __name__ == "__main__":
    main()
