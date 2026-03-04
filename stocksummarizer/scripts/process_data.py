#!/usr/bin/env python3
"""
StockSummarizer Data Processor
Processes TradingView CSV exports and performs fundamental analysis
"""

import pandas as pd
import json
from pathlib import Path
from datetime import datetime

# Configuration
DATA_DIR = Path(__file__).parent.parent / "data"
OUTPUT_DIR = Path(__file__).parent.parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

def load_tradingview_csv(filename: str) -> pd.DataFrame:
    """Load TradingView CSV export"""
    filepath = DATA_DIR / filename
    if not filepath.exists():
        raise FileNotFoundError(f"CSV file not found: {filepath}")
    
    df = pd.read_csv(filepath)
    print(f"Loaded {len(df)} stocks from {filename}")
    return df

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and standardize TradingView data"""
    # Remove duplicates by ticker
    df = df.drop_duplicates(subset=['Ticker'], keep='first')
    
    # Handle missing values
    df = df.fillna(0)
    
    return df

def calculate_fundamental_scores(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate fundamental analysis scores"""
    # Example metrics - adjust based on your TradingView columns
    df['Score'] = 0
    
    # P/E ratio scoring (lower is better for value)
    if 'P/E' in df.columns:
        df.loc[df['P/E'] > 0, 'Score'] += 10
        df.loc[(df['P/E'] > 0) & (df['P/E'] < 20), 'Score'] += 10
    
    # Dividend yield scoring
    if 'Dividend Yield' in df.columns:
        df.loc[df['Dividend Yield'] > 0, 'Score'] += 10
        df.loc[df['Dividend Yield'] > 3, 'Score'] += 10
    
    return df

def generate_summary(df: pd.DataFrame, top_n: int = 10) -> dict:
    """Generate analysis summary"""
    summary = {
        "date": datetime.now().isoformat(),
        "total_stocks": len(df),
        "top_stocks": []
    }
    
    if 'Score' in df.columns:
        top_stocks = df.nlargest(top_n, 'Score')[['Ticker', 'Score'] + [c for c in df.columns if c not in ['Ticker', 'Score']][:5]]
        summary["top_stocks"] = top_stocks.to_dict(orient='records')
    
    return summary

def save_processed_data(df: pd.DataFrame, summary: dict):
    """Save processed data and summary"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save processed CSV
    output_csv = OUTPUT_DIR / f"processed_{timestamp}.csv"
    df.to_csv(output_csv, index=False)
    print(f"Saved processed data to: {output_csv}")
    
    # Save summary JSON
    output_json = OUTPUT_DIR / f"summary_{timestamp}.json"
    with open(output_json, 'w') as f:
        json.dump(summary, f, indent=2)
    print(f"Saved summary to: {output_json}")
    
    return output_csv, output_json

if __name__ == "__main__":
    print("StockSummarizer Data Processor")
    print("=" * 40)
    
    # Find CSV files in data directory
    csv_files = list(DATA_DIR.glob("*.csv"))
    if not csv_files:
        print(f"\nNo CSV files found in: {DATA_DIR}")
        print("Please export your TradingView screener data to this folder.")
        exit(1)
    
    print(f"\nFound {len(csv_files)} CSV file(s)")
    
    # Process first CSV file
    csv_file = csv_files[0]
    print(f"\nProcessing: {csv_file.name}")
    
    df = load_tradingview_csv(csv_file.name)
    df = clean_data(df)
    df = calculate_fundamental_scores(df)
    summary = generate_summary(df)
    
    save_processed_data(df, summary)
    
    print("\nProcessing complete!")
    print(f"Check the output folder: {OUTPUT_DIR}")
