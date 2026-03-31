"""
Historical rates tracker - saves daily snapshots of best rates for trend analysis.
"""

import sqlite3
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from decimal import Decimal
from dataclasses import dataclass, asdict
from loguru import logger

DB_PATH = Path(__file__).parent.parent / "data" / "staging.db"
HISTORICAL_DB_PATH = Path(__file__).parent.parent / "data" / "historical.db"


@dataclass
class DailyRateSnapshot:
    """A single day's best rates."""
    date: str  # ISO format date: "2026-03-25"
    # Best uninsured 5-year fixed
    fixed_uninsured_best_rate: float
    fixed_uninsured_best_lender: str
    fixed_uninsured_avg_rate: float
    # Best insured 5-year fixed
    fixed_insured_best_rate: float
    fixed_insured_best_lender: str
    fixed_insured_avg_rate: float
    # Best uninsured variable
    variable_uninsured_best_rate: float
    variable_uninsured_best_lender: str
    variable_uninsured_avg_rate: float
    variable_uninsured_spread_to_prime: float
    # Best insured variable
    variable_insured_best_rate: float
    variable_insured_best_lender: str
    variable_insured_avg_rate: float
    variable_insured_spread_to_prime: float
    # Prime rate for context
    prime_rate: float
    # Total lenders tracked
    lender_count: int
    total_rates: int
    

def init_historical_db():
    """Create the historical database table."""
    HISTORICAL_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    conn = sqlite3.connect(HISTORICAL_DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS daily_snapshots (
            date TEXT PRIMARY KEY,
            fixed_uninsured_best_rate REAL,
            fixed_uninsured_best_lender TEXT,
            fixed_uninsured_avg_rate REAL,
            fixed_insured_best_rate REAL,
            fixed_insured_best_lender TEXT,
            fixed_insured_avg_rate REAL,
            variable_uninsured_best_rate REAL,
            variable_uninsured_best_lender TEXT,
            variable_uninsured_avg_rate REAL,
            variable_uninsured_spread_to_prime REAL,
            variable_insured_best_rate REAL,
            variable_insured_best_lender TEXT,
            variable_insured_avg_rate REAL,
            variable_insured_spread_to_prime REAL,
            prime_rate REAL DEFAULT 5.45,
            lender_count INTEGER,
            total_rates INTEGER,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()
    logger.info(f"Historical database initialized at {HISTORICAL_DB_PATH}")


def calculate_stats(rates: List[Dict]) -> Tuple[float, float, str]:
    """Calculate best rate and average rate from a list of rates."""
    if not rates:
        return 0.0, 0.0, "N/A"
    
    valid_rates = [(r['rate'], r.get('lender_name', 'Unknown')) 
                   for r in rates if r.get('rate') is not None]
    
    if not valid_rates:
        return 0.0, 0.0, "N/A"
    
    best_rate, best_lender = min(valid_rates, key=lambda x: x[0])
    avg_rate = sum(r[0] for r in valid_rates) / len(valid_rates)
    
    return round(best_rate, 2), round(avg_rate, 2), best_lender


def save_daily_snapshot(rates_data: List[Dict], date: Optional[str] = None):
    """
    Save a daily snapshot of best rates.
    
    Args:
        rates_data: List of rate dictionaries from rates.json
        date: Date string (defaults to today)
    """
    init_historical_db()
    
    if date is None:
        date = datetime.now().strftime("%Y-%m-%d")
    
    # Filter for 5-year (60 month) terms
    five_year_rates = [r for r in rates_data if r.get('term_months') == 60]
    
    # Fixed uninsured
    fixed_uninsured = [r for r in five_year_rates 
                      if r.get('rate_type') == 'fixed' 
                      and r.get('mortgage_type') == 'uninsured']
    fixed_uninsured_best, fixed_uninsured_avg, fixed_uninsured_lender = calculate_stats(fixed_uninsured)
    
    # Fixed insured
    fixed_insured = [r for r in five_year_rates 
                    if r.get('rate_type') == 'fixed' 
                    and r.get('mortgage_type') == 'insured']
    fixed_insured_best, fixed_insured_avg, fixed_insured_lender = calculate_stats(fixed_insured)
    
    # Variable uninsured
    variable_uninsured = [r for r in five_year_rates 
                         if r.get('rate_type') == 'variable' 
                         and r.get('mortgage_type') == 'uninsured']
    variable_uninsured_best, variable_uninsured_avg, variable_uninsured_lender = calculate_stats(variable_uninsured)
    
    # Get spread to prime (if available)
    variable_uninsured_spread = 0.0
    if variable_uninsured and variable_uninsured[0].get('spread_to_prime'):
        variable_uninsured_spread = variable_uninsured[0]['spread_to_prime']
    
    # Variable insured
    variable_insured = [r for r in five_year_rates 
                       if r.get('rate_type') == 'variable' 
                       and r.get('mortgage_type') == 'insured']
    variable_insured_best, variable_insured_avg, variable_insured_lender = calculate_stats(variable_insured)
    
    variable_insured_spread = 0.0
    if variable_insured and variable_insured[0].get('spread_to_prime'):
        variable_insured_spread = variable_insured[0]['spread_to_prime']
    
    # Count unique lenders
    lender_count = len(set(r.get('lender_slug') for r in rates_data if r.get('lender_slug')))
    total_rates = len(rates_data)
    
    # Prime rate (assumed, can be extracted if available)
    prime_rate = 5.45
    
    # Save to database
    conn = sqlite3.connect(HISTORICAL_DB_PATH)
    conn.execute("""
        INSERT OR REPLACE INTO daily_snapshots 
        (date, fixed_uninsured_best_rate, fixed_uninsured_best_lender, fixed_uninsured_avg_rate,
         fixed_insured_best_rate, fixed_insured_best_lender, fixed_insured_avg_rate,
         variable_uninsured_best_rate, variable_uninsured_best_lender, variable_uninsured_avg_rate,
         variable_uninsured_spread_to_prime, variable_insured_best_rate, variable_insured_best_lender,
         variable_insured_avg_rate, variable_insured_spread_to_prime, prime_rate, lender_count, total_rates, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        date, fixed_uninsured_best, fixed_uninsured_lender, fixed_uninsured_avg,
        fixed_insured_best, fixed_insured_lender, fixed_insured_avg,
        variable_uninsured_best, variable_uninsured_lender, variable_uninsured_avg, variable_uninsured_spread,
        variable_insured_best, variable_insured_lender, variable_insured_avg, variable_insured_spread,
        prime_rate, lender_count, total_rates, datetime.now().isoformat()
    ))
    conn.commit()
    conn.close()
    
    logger.info(f"Saved daily snapshot for {date}: "
                f"Fixed Uninsured Best: {fixed_uninsured_best}%, "
                f"Variable Best: {variable_uninsured_best}%")


def get_historical_data(days: int = 90) -> List[Dict]:
    """
    Get historical rate data for the past N days.
    
    Args:
        days: Number of days of history to retrieve
        
    Returns:
        List of daily snapshots as dictionaries
    """
    conn = sqlite3.connect(HISTORICAL_DB_PATH)
    conn.row_factory = sqlite3.Row
    
    cutoff_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
    
    cursor = conn.execute(
        "SELECT * FROM daily_snapshots WHERE date >= ? ORDER BY date ASC",
        (cutoff_date,)
    )
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]


def generate_json_output(output_path: Optional[Path] = None):
    """
    Generate JSON file for frontend consumption.
    
    Args:
        output_path: Where to save the JSON file
    """
    if output_path is None:
        output_path = Path(__file__).parent.parent.parent / "data" / "historical_rates.json"
    
    # Get 90 days of data
    data = get_historical_data(90)
    
    if not data:
        logger.warning("No historical data available")
        # Create empty structure
        data = []
    
    # Format for frontend
    output = {
        "metadata": {
            "last_updated": datetime.now().isoformat(),
            "total_days": len(data),
            "prime_rate": 5.45
        },
        "data": data
    }
    
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)
    
    logger.info(f"Generated historical rates JSON: {output_path} ({len(data)} days)")
    return output_path


def main():
    """Main entry point - run this after scraping to save a snapshot."""
    import sys
    
    # Load current rates from rates.json
    rates_file = Path(__file__).parent.parent.parent / "data" / "rates.json"
    
    if not rates_file.exists():
        logger.error(f"Rates file not found: {rates_file}")
        sys.exit(1)
    
    with open(rates_file) as f:
        rates_data = json.load(f)
    
    # Save today's snapshot
    save_daily_snapshot(rates_data)
    
    # Generate JSON output
    generate_json_output()
    
    logger.info("Historical rates update complete")


if __name__ == "__main__":
    main()
