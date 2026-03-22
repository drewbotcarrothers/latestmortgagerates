"""
Export rate history to JSON for website trends.

Usage: python export_rate_history.py --days 90
"""

import sys
from pathlib import Path
import json
import argparse
from datetime import datetime, timedelta

sys.path.insert(0, str(Path(__file__).parent / "src"))

from database import Database

def export_rate_trends(days: int = 90, output_path: str = None):
    """Export rate trends to JSON for website."""
    db = Database()
    
    print(f"Exporting {days} days of rate history...")
    
    # Get trends data
    trends = db.get_rate_trends(days=days)
    
    # Get latest rate changes
    fixed_change = db.get_latest_rate_change(term_months=60, rate_type="fixed")
    variable_change = db.get_latest_rate_change(term_months=60, rate_type="variable")
    
    # Build output
    output = {
        "exported_at": datetime.utcnow().isoformat(),
        "days_analyzed": days,
        "trends": trends,
        "latest_changes": {
            "fixed_5yr": fixed_change,
            "variable_5yr": variable_change
        },
        "summary": {
            "data_points": len(trends),
            "date_from": (datetime.utcnow() - timedelta(days=days)).isoformat() if trends else None,
            "date_to": datetime.utcnow().isoformat()
        }
    }
    
    # Default output path
    if not output_path:
        output_path = Path(__file__).parent.parent / "app" / "data" / "rate-trends.json"
    else:
        output_path = Path(output_path)
    
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Write JSON
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2, default=str)
    
    print(f"Exported {len(trends)} trend records to {output_path}")
    print(f"Fixed rate change: {fixed_change['change']:+.3f}% ({fixed_change['direction']})")
    print(f"Variable rate change: {variable_change['change']:+.3f}% ({variable_change['direction']})")
    
    return output


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export rate history to JSON")
    parser.add_argument("--days", type=int, default=90, help="Number of days to export")
    parser.add_argument("--output", type=str, help="Output file path")
    
    args = parser.parse_args()
    
    export_rate_trends(days=args.days, output_path=args.output)
