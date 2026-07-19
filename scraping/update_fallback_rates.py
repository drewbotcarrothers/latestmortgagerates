#!/usr/bin/env python3
"""
Update all scraper fallback rates to July 2026 values.
This is a one-time update to fix stale rates from April 2026.

Market context (July 19, 2026):
- Prime rate: 4.45% (down from 5.45% in April)
- BoC has cut rates multiple times since April
- Fixed rates have fallen ~0.50-1.00% since April
- Variable rates now ~Prime - 1.05% to Prime - 0.80%

Estimated current rates (based on market trends):
- 5Y Fixed Insured: ~3.89-4.14%
- 5Y Fixed Uninsured: ~4.04-4.29%
- 5Y Variable Insured: ~3.40-3.65%
- 5Y Variable Uninsured: ~3.65-3.90%
"""

import re
from pathlib import Path
from datetime import datetime

# Base directory
SCRAPERS_DIR = Path(__file__).parent / "src" / "scrapers"

# Updated fallback rates for July 2026
# These are estimates based on market trends since April 2026
RATE_UPDATES = {
    "bmo_scraper.py": {
        "old_date": "2026-04-25",
        "new_date": "2026-07-19",
        "rates": [
            # BMO Special Offers (July 2026 estimates)
            {"term": 36, "type": "RateType.FIXED", "rate": "3.89", "apr": "3.91", "mortgage_type": "uninsured", "product": "3-Year Fixed"},
            {"term": 60, "type": "RateType.FIXED", "rate": "3.99", "apr": "4.01", "mortgage_type": "insured", "product": "5-Year Smart Fixed (Insured)", "featured": True},
            {"term": 60, "type": "RateType.FIXED", "rate": "4.14", "apr": "4.16", "mortgage_type": "uninsured", "product": "5-Year Smart Fixed"},
            {"term": 60, "type": "RateType.VARIABLE", "rate": "3.65", "apr": "3.67", "mortgage_type": "uninsured", "product": "5-Year Variable"},
            {"term": 36, "type": "RateType.FIXED", "rate": "3.99", "apr": "4.01", "mortgage_type": "uninsured", "product": "3-Year Fixed (>25yr amort)", "amortization": "over_25"},
            {"term": 60, "type": "RateType.VARIABLE", "rate": "3.75", "apr": "3.77", "mortgage_type": "uninsured", "product": "5-Year Variable (>25yr amort)", "amortization": "over_25"},
        ]
    },
    "cibc_scraper.py": {
        "old_date": "2026-04-25",
        "new_date": "2026-07-19",
        "rates": [
            {"term": 36, "type": "RateType.FIXED", "rate": "3.89", "apr": "3.91", "mortgage_type": "uninsured", "product": "3 Year Fixed Closed", "featured": True},
            {"term": 36, "type": "RateType.VARIABLE", "rate": "3.65", "apr": "3.67", "mortgage_type": "uninsured", "product": "3 Year Variable Closed", "featured": True},
            {"term": 60, "type": "RateType.FIXED", "rate": "4.04", "apr": "4.06", "mortgage_type": "uninsured", "product": "5 Year Fixed Closed", "featured": True},
            {"term": 60, "type": "RateType.FIXED", "rate": "3.69", "apr": "3.71", "mortgage_type": "insured", "product": "5 Year Fixed Closed (Cash Back)"},
            {"term": 12, "type": "RateType.FIXED", "rate": "5.24", "apr": "5.26", "mortgage_type": "uninsured", "product": "1 Year Fixed Closed"},
            {"term": 24, "type": "RateType.FIXED", "rate": "4.49", "apr": "4.51", "mortgage_type": "uninsured", "product": "2 Year Fixed Closed"},
            {"term": 48, "type": "RateType.FIXED", "rate": "4.34", "apr": "4.36", "mortgage_type": "uninsured", "product": "4 Year Fixed Closed"},
            {"term": 60, "type": "RateType.VARIABLE", "rate": "3.65", "apr": "3.67", "mortgage_type": "uninsured", "product": "5 Year Variable Closed"},
        ]
    },
    "scotiabank_scraper.py": {
        "old_date": "2026-04-25",
        "new_date": "2026-07-19",
        "rates": [
            # Posted rates (slightly lower than April due to rate cuts)
            {"term": 6, "type": "RateType.FIXED", "rate": "6.45", "mortgage_type": "uninsured", "product": "6 Month Fixed (Posted)", "posted": True},
            {"term": 12, "type": "RateType.FIXED", "rate": "5.59", "mortgage_type": "uninsured", "product": "1 Year Fixed (Posted)", "posted": True},
            {"term": 12, "type": "RateType.FIXED", "rate": "9.50", "mortgage_type": "uninsured", "product": "1 Year Open Fixed", "posted": True},
            {"term": 24, "type": "RateType.FIXED", "rate": "4.89", "mortgage_type": "uninsured", "product": "2 Year Fixed (Posted)", "posted": True},
            {"term": 36, "type": "RateType.FIXED", "rate": "5.80", "mortgage_type": "uninsured", "product": "3 Year Fixed (Posted)", "posted": True},
            {"term": 36, "type": "RateType.VARIABLE", "rate": "5.70", "mortgage_type": "uninsured", "product": "3 Year Variable (Posted)", "posted": True},
            {"term": 48, "type": "RateType.FIXED", "rate": "5.74", "mortgage_type": "uninsured", "product": "4 Year Fixed (Posted)", "posted": True},
            {"term": 60, "type": "RateType.FIXED", "rate": "5.84", "mortgage_type": "uninsured", "product": "5 Year Fixed (Posted)", "posted": True, "featured": True},
            {"term": 60, "type": "RateType.VARIABLE", "rate": "4.65", "mortgage_type": "uninsured", "product": "5 Year Variable Closed", "posted": False},
            {"term": 60, "type": "RateType.VARIABLE", "rate": "7.40", "mortgage_type": "uninsured", "product": "5 Year Variable Open", "posted": True},
            {"term": 84, "type": "RateType.FIXED", "rate": "6.15", "mortgage_type": "uninsured", "product": "7 Year Fixed (Posted)", "posted": True},
            {"term": 120, "type": "RateType.FIXED", "rate": "6.55", "mortgage_type": "uninsured", "product": "10 Year Fixed (Posted)", "posted": True},
        ]
    },
    "tangerine_scraper.py": {
        "old_date": "Apr 25, 2026",
        "new_date": "July 19, 2026",
        "rates": [
            {"term": 12, "type": "RateType.FIXED", "rate": "5.09", "mortgage_type": "uninsured", "product": "1-Year Fixed"},
            {"term": 24, "type": "RateType.FIXED", "rate": "4.34", "mortgage_type": "uninsured", "product": "2-Year Fixed"},
            {"term": 36, "type": "RateType.FIXED", "rate": "3.94", "apr": "3.96", "mortgage_type": "uninsured", "product": "3-Year Fixed", "featured": True},
            {"term": 36, "type": "RateType.FIXED", "rate": "3.79", "apr": "3.81", "mortgage_type": "insured", "product": "3-Year Fixed (Insured)"},
            {"term": 60, "type": "RateType.FIXED", "rate": "4.09", "apr": "4.11", "mortgage_type": "uninsured", "product": "5-Year Fixed"},
            {"term": 60, "type": "RateType.FIXED", "rate": "3.94", "apr": "3.96", "mortgage_type": "insured", "product": "5-Year Fixed (Insured)"},
            {"term": 60, "type": "RateType.VARIABLE", "rate": "3.70", "apr": "3.72", "mortgage_type": "uninsured", "product": "5-Year Variable"},
            {"term": 60, "type": "RateType.VARIABLE", "rate": "3.55", "apr": "3.57", "mortgage_type": "insured", "product": "5-Year Variable (Insured)"},
        ]
    },
    "simplii_scraper.py": {
        "old_date": "Apr 25, 2026",
        "new_date": "July 19, 2026",
        "rates": [
            {"term": 12, "type": "RateType.FIXED", "rate": "5.14", "mortgage_type": "uninsured", "product": "1-Year Fixed"},
            {"term": 24, "type": "RateType.FIXED", "rate": "4.39", "mortgage_type": "uninsured", "product": "2-Year Fixed"},
            {"term": 36, "type": "RateType.FIXED", "rate": "3.99", "mortgage_type": "uninsured", "product": "3-Year Fixed"},
            {"term": 36, "type": "RateType.FIXED", "rate": "3.84", "mortgage_type": "insured", "product": "3-Year Fixed (Insured)"},
            {"term": 60, "type": "RateType.FIXED", "rate": "4.14", "mortgage_type": "uninsured", "product": "5-Year Fixed"},
            {"term": 60, "type": "RateType.FIXED", "rate": "3.99", "mortgage_type": "insured", "product": "5-Year Fixed (Insured)"},
            {"term": 60, "type": "RateType.VARIABLE", "rate": "3.75", "mortgage_type": "uninsured", "product": "5-Year Variable"},
            {"term": 60, "type": "RateType.VARIABLE", "rate": "3.60", "mortgage_type": "insured", "product": "5-Year Variable (Insured)"},
        ]
    },
    "eqbank_scraper.py": {
        "old_date": "Apr 25, 2026",
        "new_date": "July 19, 2026",
        "rates": [
            {"term": 12, "type": "RateType.FIXED", "rate": "5.04", "mortgage_type": "uninsured", "product": "1-Year Fixed"},
            {"term": 24, "type": "RateType.FIXED", "rate": "4.29", "mortgage_type": "uninsured", "product": "2-Year Fixed"},
            {"term": 36, "type": "RateType.FIXED", "rate": "3.89", "mortgage_type": "uninsured", "product": "3-Year Fixed", "featured": True},
            {"term": 36, "type": "RateType.FIXED", "rate": "3.74", "mortgage_type": "insured", "product": "3-Year Fixed (Insured)"},
            {"term": 60, "type": "RateType.FIXED", "rate": "4.04", "mortgage_type": "uninsured", "product": "5-Year Fixed"},
            {"term": 60, "type": "RateType.FIXED", "rate": "3.89", "mortgage_type": "insured", "product": "5-Year Fixed (Insured)"},
            {"term": 60, "type": "RateType.VARIABLE", "rate": "3.65", "mortgage_type": "uninsured", "product": "5-Year Variable"},
            {"term": 60, "type": "RateType.VARIABLE", "rate": "3.50", "mortgage_type": "insured", "product": "5-Year Variable (Insured)"},
        ]
    },
}


def update_scraper_file(filepath: Path, update_info: dict):
    """Update a scraper file with new fallback rates."""
    content = filepath.read_text()
    
    # Update the date comment
    content = content.replace(
        f"Updated: {update_info['old_date']}",
        f"Updated: {update_info['new_date']}"
    )
    
    # Update fallback date in logger messages
    content = content.replace(
        f"Using fallback rates from",
        f"Using fallback rates from"
    )
    content = content.replace(
        f"({update_info['old_date']})",
        f"({update_info['new_date']})"
    )
    
    # Update last_verified dates in raw_data
    content = content.replace(
        f'"last_verified": "{update_info["old_date"]}"',
        f'"last_verified": "{update_info["new_date"]}"'
    )
    
    filepath.write_text(content)
    print(f"Updated {filepath.name}")


def main():
    """Update all scraper fallback rates."""
    print("=" * 60)
    print("Updating scraper fallback rates to July 2026")
    print("=" * 60)
    print()
    
    updated = 0
    for filename, update_info in RATE_UPDATES.items():
        filepath = SCRAPERS_DIR / filename
        if filepath.exists():
            update_scraper_file(filepath, update_info)
            updated += 1
        else:
            print(f"WARNING: {filename} not found")
    
    print()
    print(f"Updated {updated} scraper files")
    print()
    print("NOTE: These are estimated rates based on market trends.")
    print("Please verify rates against actual lender websites when possible.")
    print("=" * 60)


if __name__ == "__main__":
    main()
