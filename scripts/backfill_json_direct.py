"""
Backfill historical rates data directly into JSON file.
Extracts unique daily snapshots from git commits.
"""

import subprocess
import json
from pathlib import Path
from collections import defaultdict
from datetime import datetime

def get_git_commits(filepath, since_date):
    """Get commits for a file since date."""
    cmd = ["git", "log", "--since", since_date, "--format=%H|%ci", "--", filepath]
    result = subprocess.run(cmd, capture_output=True, text=True)
    commits = []
    for line in result.stdout.strip().split('\n'):
        if '|' in line:
            parts = line.split('|')
            if len(parts) >= 2:
                commits.append({
                    'hash': parts[0],
                    'date': parts[1].split()[0]
                })
    return commits

def get_rates_at_commit(commit_hash, filepath):
    """Get rates.json at a specific commit."""
    cmd = ["git", "show", f"{commit_hash}:{filepath}"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    try:
        return json.loads(result.stdout)
    except:
        return None

def calculate_best_rates(rates_data):
    """Calculate best rates from raw rates data."""
    five_year = [r for r in rates_data if r.get('term_months') == 60]
    
    # Fixed uninsured
    fixed_un = [r for r in five_year if r.get('rate_type') == 'fixed' and r.get('mortgage_type') == 'uninsured']
    if fixed_un:
        best = min(fixed_un, key=lambda x: x.get('rate', 999))
        fixed_un_best = round(best.get('rate', 0), 2)
        fixed_un_lender = best.get('lender_name', 'Unknown')
        fixed_un_avg = round(sum(r.get('rate', 0) for r in fixed_un) / len(fixed_un), 2)
    else:
        fixed_un_best, fixed_un_lender, fixed_un_avg = 0, "N/A", 0
    
    # Fixed insured
    fixed_in = [r for r in five_year if r.get('rate_type') == 'fixed' and r.get('mortgage_type') == 'insured']
    if fixed_in:
        best = min(fixed_in, key=lambda x: x.get('rate', 999))
        fixed_in_best = round(best.get('rate', 0), 2)
        fixed_in_lender = best.get('lender_name', 'Unknown')
        fixed_in_avg = round(sum(r.get('rate', 0) for r in fixed_in) / len(fixed_in), 2)
    else:
        fixed_in_best, fixed_in_lender, fixed_in_avg = 0, "N/A", 0
    
    # Variable uninsured
    var_un = [r for r in five_year if r.get('rate_type') == 'variable' and r.get('mortgage_type') == 'uninsured']
    if var_un:
        best = min(var_un, key=lambda x: x.get('rate', 999))
        var_un_best = round(best.get('rate', 0), 2)
        var_un_lender = best.get('lender_name', 'Unknown')
        var_un_avg = round(sum(r.get('rate', 0) for r in var_un) / len(var_un), 2)
        var_un_spread = best.get('spread_to_prime', 0)
    else:
        var_un_best, var_un_lender, var_un_avg, var_un_spread = 0, "N/A", 0, 0
    
    # Variable insured
    var_in = [r for r in five_year if r.get('rate_type') == 'variable' and r.get('mortgage_type') == 'insured']
    if var_in:
        best = min(var_in, key=lambda x: x.get('rate', 999))
        var_in_best = round(best.get('rate', 0), 2)
        var_in_lender = best.get('lender_name', 'Unknown')
        var_in_avg = round(sum(r.get('rate', 0) for r in var_in) / len(var_in), 2)
        var_in_spread = best.get('spread_to_prime', 0)
    else:
        var_in_best, var_in_lender, var_in_avg, var_in_spread = 0, "N/A", 0, 0
    
    lender_count = len(set(r.get('lender_slug') for r in rates_data if r.get('lender_slug')))
    
    return {
        "fixed_uninsured_best_rate": fixed_un_best,
        "fixed_uninsured_best_lender": fixed_un_lender,
        "fixed_uninsured_avg_rate": fixed_un_avg,
        "fixed_insured_best_rate": fixed_in_best,
        "fixed_insured_best_lender": fixed_in_lender,
        "fixed_insured_avg_rate": fixed_in_avg,
        "variable_uninsured_best_rate": var_un_best,
        "variable_uninsured_best_lender": var_un_lender,
        "variable_uninsured_avg_rate": var_un_avg,
        "variable_uninsured_spread_to_prime": var_un_spread,
        "variable_insured_best_rate": var_in_best,
        "variable_insured_best_lender": var_in_lender,
        "variable_insured_avg_rate": var_in_avg,
        "variable_insured_spread_to_prime": var_in_spread,
        "prime_rate": 5.45,
        "lender_count": lender_count,
        "total_rates": len(rates_data),
    }

def backfill():
    """Backfill April data."""
    print("Backfilling April 2026 data...")
    
    # Load existing JSON
    json_path = Path(__file__).parent.parent / "data" / "historical_rates.json"
    with open(json_path) as f:
        historical = json.load(f)
    
    existing_data = historical.get("data", [])
    existing_dates = {entry.get("date") for entry in existing_data}
    print(f"Existing: {len(existing_data)} days through {max(existing_dates) if existing_dates else 'none'}")
    
    # Get commits since April 1
    commits = get_git_commits("data/rates.json", "2026-04-01")
    
    # Group commits by date, keep first one per date
    commits_by_date = defaultdict(list)
    for c in commits:
        commits_by_date[c['date']].append(c['hash'])
    
    # Process each date
    new_entries = []
    for date in sorted(commits_by_date.keys()):
        if date in existing_dates:
            print(f"  Skipping {date} (exists)")
            continue
        
        # Get rates from first commit of the day
        commit_hash = commits_by_date[date][0]
        rates = get_rates_at_commit(commit_hash, "data/rates.json")
        
        if rates:
            entry = calculate_best_rates(rates)
            entry["date"] = date
            entry["created_at"] = datetime.now().isoformat()
            new_entries.append(entry)
            print(f"  Added {date}: Fixed={entry['fixed_uninsured_best_rate']}%, Var={entry['variable_insured_best_rate']}%")
    
    # Merge and sort
    all_data = existing_data + new_entries
    all_data.sort(key=lambda x: x.get("date", ""))
    
    # Keep only last 90 days
    cutoff = (datetime.now() - __import__('datetime').timedelta(days=90)).strftime("%Y-%m-%d")
    all_data = [e for e in all_data if e.get("date", "") >= cutoff]
    
    # Save
    historical["metadata"]["last_updated"] = datetime.now().isoformat()
    historical["metadata"]["total_days"] = len(all_data)
    historical["data"] = all_data
    
    with open(json_path, 'w') as f:
        json.dump(historical, f, indent=2)
    
    print(f"\nDone! Historical data now has {len(all_data)} days (added {len(new_entries)} new)")

if __name__ == "__main__":
    backfill()
