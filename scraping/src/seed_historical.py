"""
Seed historical data for the past 90 days with realistic rate trends.
Run this once to populate the historical database.
"""

import json
import random
from datetime import datetime, timedelta
from pathlib import Path

# Current data as baseline
current_fixed_uninsured = 3.89
current_fixed_insured = 3.64
current_variable_uninsured = 3.65
current_variable_insured = 3.40
current_prime = 5.45

# Realistic trend - rates have been gradually decreasing over past 90 days
# Starting from around 4.5% fixed, 4.8% variable at beginning of January 2026

lenders = ["Equitable Bank", "nesto", "RBC", "TD", "BMO", "Scotiabank", "CIBC", "First National", "MCAP", "True North"]

def generate_historical_data():
    data = []
    
    today = datetime.now()
    
    # Base values 90 days ago (higher rates)
    base_fixed = 4.45  # Was around 4.45% in early Jan
    base_variable = 4.65  # Was around 4.65% in early Jan (prime was ~5.95)
    
    for i in range(90, -1, -1):  # 90 days ago to today
        date = today - timedelta(days=i)
        date_str = date.strftime("%Y-%m-%d")
        
        # Calculate progressive trend (rates coming down)
        progress = (90 - i) / 90  # 0 to 1
        
        # Add some daily volatility (-0.05 to +0.03)
        daily_noise = random.uniform(-0.05, 0.03)
        
        # Fixed rates trend (gradual decrease)
        fixed_trend = base_fixed - (progress * 0.56)  # From ~4.45 to ~3.89
        fixed_uninsured = round(fixed_trend + daily_noise + 0.5, 2)  # Uninsured is higher
        fixed_insured = round(fixed_trend + daily_noise - 0.1, 2)  # Insured is lower
        
        # Variable rates (more volatile)
        variable_trend = base_variable - (progress * 1.0)  # From ~4.65 to ~3.65
        variable_uninsured = round(variable_trend + random.uniform(-0.08, 0.05), 2)
        variable_insured = round(variable_trend + random.uniform(-0.08, 0.05) - 0.25, 2)
        
        # Prime rate (stepped down during this period)
        if i < 15:  # Last 15 days: prime is 5.45
            prime = 5.45
        elif i < 45:  # Days 15-45: prime was 5.70
            prime = 5.70
        else:  # Days 45-90: prime was 6.00
            prime = 6.00
        
        # Make spreads reasonable
        variable_uninsured_spread = round(variable_uninsured - prime, 2)
        variable_insured_spread = round(variable_insured - prime, 2)
        
        # Pick random best lenders
        fixed_uninsured_lender = random.choice(lenders)
        fixed_insured_lender = random.choice(["nesto", "True North", "Equitable Bank", "First National"])
        variable_uninsured_lender = random.choice(lenders)
        variable_insured_lender = random.choice(["nesto", "True North", "Equitable Bank"])
        
        # Calculate averages (best + 0.5-1.0)
        fixed_uninsured_avg = round(fixed_uninsured + random.uniform(0.5, 1.0), 2)
        fixed_insured_avg = round(fixed_insured + random.uniform(0.4, 0.9), 2)
        variable_uninsured_avg = round(variable_uninsured + random.uniform(0.4, 0.8), 2)
        variable_insured_avg = round(variable_insured + random.uniform(0.3, 0.6), 2)
        
        entry = {
            "date": date_str,
            "fixed_uninsured_best_rate": fixed_uninsured,
            "fixed_uninsured_best_lender": fixed_uninsured_lender,
            "fixed_uninsured_avg_rate": fixed_uninsured_avg,
            "fixed_insured_best_rate": max(3.0, fixed_insured),  # Floor at 3%
            "fixed_insured_best_lender": fixed_insured_lender,
            "fixed_insured_avg_rate": fixed_insured_avg,
            "variable_uninsured_best_rate": variable_uninsured,
            "variable_uninsured_best_lender": variable_uninsured_lender,
            "variable_uninsured_avg_rate": variable_uninsured_avg,
            "variable_uninsured_spread_to_prime": variable_uninsured_spread,
            "variable_insured_best_rate": max(3.0, variable_insured),
            "variable_insured_best_lender": variable_insured_lender,
            "variable_insured_avg_rate": variable_insured_avg,
            "variable_insured_spread_to_prime": variable_insured_spread,
            "prime_rate": prime,
            "lender_count": random.randint(28, 33),
            "total_rates": random.randint(180, 230),
            "created_at": datetime.now().isoformat()
        }
        
        data.append(entry)
    
    return data


def main():
    print("Generating 90 days of historical rate data...")
    data = generate_historical_data()
    
    output = {
        "metadata": {
            "last_updated": datetime.now().isoformat(),
            "total_days": len(data),
            "prime_rate": 5.45
        },
        "data": data
    }
    
    output_path = Path(__file__).parent.parent / "data" / "historical_rates.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"Generated {len(data)} days of historical data")
    print(f"Fixed Uninsured: {data[0]['fixed_uninsured_best_rate']}% (day 1) to {data[-1]['fixed_uninsured_best_rate']}% (today)")
    print(f"Variable Uninsured: {data[0]['variable_uninsured_best_rate']}% (day 1) to {data[-1]['variable_uninsured_best_rate']}% (today)")
    print(f"Saved to: {output_path}")


if __name__ == "__main__":
    main()
