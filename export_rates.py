"""
Export rates from database to JSON for website consumption.
Run this after scraping to update website data.
"""

import json
import sys
from pathlib import Path
from datetime import datetime

sys.path.insert(0, str(Path(__file__).parent / "scraping" / "src"))
from database import Database


def export_rates_to_json():
    """Export all rates to JSON file for website, removing duplicates."""
    
    db = Database()
    rates = db.get_latest_rates()
    
    if not rates:
        print("No rates found in database")
        return
    
    # Process rates and remove duplicates
    # Keep only the most recent rate for each unique combination
    # of (lender_slug, term_months, rate_type, mortgage_type)
    seen_keys = {}
    deduplicated_rates = []
    
    for rate in rates:
        # Create a unique key for this rate
        key = (
            rate.get("lender_slug", ""),
            rate.get("term_months", 0),
            rate.get("rate_type", ""),
            rate.get("mortgage_type", "")
        )
        
        scraped_at = rate.get("scraped_at", "")
        
        # Keep only the most recent rate for each key
        if key not in seen_keys or scraped_at > seen_keys[key]["scraped_at"]:
            if key in seen_keys:
                # We'll replace this one
                pass
            seen_keys[key] = rate
    
    # Build the final list from seen_keys
    unique_rates = list(seen_keys.values())
    
    # Process rates for JSON export
    processed_rates = []
    for rate in unique_rates:
        # Parse raw_data if it's a string
        raw_data = rate.get("raw_data", {})
        if isinstance(raw_data, str):
            try:
                raw_data = json.loads(raw_data)
            except:
                raw_data = {}
        
        processed_rates.append({
            "lender_name": rate.get("lender_name", ""),
            "lender_slug": rate.get("lender_slug", ""),
            "term_months": rate.get("term_months", 0),
            "rate_type": rate.get("rate_type", ""),
            "mortgage_type": rate.get("mortgage_type", ""),
            "rate": float(rate.get("rate", 0)),
            "posted_rate": float(rate.get("posted_rate")) if rate.get("posted_rate") else None,
            "source_url": rate.get("source_url", ""),
            "scraped_at": rate.get("scraped_at", ""),
            "apr": raw_data.get("apr") if raw_data else None,
            "ltv_tier": raw_data.get("ltv_tier") if raw_data else None,
            "spread_to_prime": raw_data.get("spread_to_prime") if raw_data else None,
        })
    
    # Export to JSON
    web_data_dir = Path(__file__).parent
    output_file = web_data_dir / "rates.json"
    
    with open(output_file, 'w') as f:
        json.dump(processed_rates, f, indent=2)
    
    print(f"Exported {len(processed_rates)} unique rates to {output_file}")
    
    # Also export metadata
    metadata = {
        "last_updated": datetime.utcnow().isoformat(),
        "total_rates": len(processed_rates),
        "lenders": list(set(r["lender_slug"] for r in processed_rates)),
    }
    
    metadata_file = web_data_dir / "metadata.json"
    with open(metadata_file, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"Exported metadata to {metadata_file}")
    
    # Print deduplication stats
    removed = len(rates) - len(unique_rates)
    if removed > 0:
        print(f"\nRemoved {removed} duplicate rate(s)")
    
    # Print summary
    print("\nRate Summary:")
    by_lender = {}
    for r in processed_rates:
        lender = r["lender_slug"]
        if lender not in by_lender:
            by_lender[lender] = 0
        by_lender[lender] += 1
    
    for lender, count in sorted(by_lender.items()):
        print(f"  {lender}: {count} rates")


if __name__ == "__main__":
    export_rates_to_json()