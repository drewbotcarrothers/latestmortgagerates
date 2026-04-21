"""
Backfill historical rates data from git history.
Extracts daily rates.json commits and generates historical snapshots.
"""

import subprocess
import json
import sys
from pathlib import Path
from datetime import datetime, timedelta
from typing import List, Dict

sys.path.insert(0, str(Path(__file__).parent.parent / "scraping" / "src"))
from historical_rates import save_daily_snapshot, generate_json_output

def get_git_commits_for_file(filepath: str, since_date: str) -> List[Dict]:
    """Get all commits for a file since a specific date."""
    cmd = [
        "git", "log",
        "--since", since_date,
        "--format=%H|%ci|%s",
        "--", filepath
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    commits = []
    for line in result.stdout.strip().split('\n'):
        if '|' in line:
            parts = line.split('|', 2)
            if len(parts) >= 2:
                commits.append({
                    'hash': parts[0],
                    'date': parts[1].split()[0],  # YYYY-MM-DD
                    'message': parts[2] if len(parts) > 2 else ''
                })
    return commits

def get_file_at_commit(commit_hash: str, filepath: str) -> Dict:
    """Get file contents at a specific commit."""
    cmd = ["git", "show", f"{commit_hash}:{filepath}"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    try:
        return json.loads(result.stdout)
    except:
        return {}

def backfill_april():
    """Backfill historical data for April 2026."""
    print("Backfilling April 2026 historical data...")
    
    # Get commits for data/rates.json since April 1
    commits = get_git_commits_for_file("data/rates.json", "2026-04-01")
    print(f"Found {len(commits)} commits for rates.json since April 1")
    
    # Load current historical data
    historical_path = Path(__file__).parent.parent / "data" / "historical_rates.json"
    existing_data = []
    if historical_path.exists():
        with open(historical_path) as f:
            existing = json.load(f)
            existing_data = existing.get("data", [])
    
    existing_dates = {entry.get("date") for entry in existing_data}
    print(f"Existing historical entries: {len(existing_data)} days")
    
    # Process each commit
    backfilled = 0
    for commit in commits:
        date_str = commit['date']
        
        # Skip if already exists
        if date_str in existing_dates:
            print(f"  Skipping {date_str} (already exists)")
            continue
        
        # Get rates at this commit
        rates = get_file_at_commit(commit['hash'], "data/rates.json")
        if not rates:
            print(f"  Warning: No rates data for {date_str}")
            continue
        
        # Save snapshot for this date
        try:
            save_daily_snapshot(rates, date=date_str)
            print(f"  Added snapshot for {date_str} ({len(rates)} rates)")
            backfilled += 1
        except Exception as e:
            print(f"  Error saving {date_str}: {e}")
    
    # Regenerate JSON
    if backfilled > 0:
        generate_json_output()
        print(f"\nBackfilled {backfilled} days. Historical data updated.")
    else:
        print("\nNo new data to backfill.")

if __name__ == "__main__":
    backfill_april()
