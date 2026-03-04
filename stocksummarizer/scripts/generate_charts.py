#!/usr/bin/env python3
"""
StockSummarizer Chart Generator
Creates visualizations for stock analysis
"""

import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
from pathlib import Path
from datetime import datetime

# Configuration
OUTPUT_DIR = Path(__file__).parent.parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

def create_top_stocks_chart(df: pd.DataFrame, top_n: int = 10, output_path: Path = None):
    """Create a bar chart of top stocks by score"""
    if 'Score' not in df.columns:
        print("No Score column found. Run process_data.py first.")
        return
    
    top_stocks = df.nlargest(top_n, 'Score')
    
    plt.figure(figsize=(12, 6))
    plt.barh(top_stocks['Ticker'], top_stocks['Score'], color='#2E86AB')
    plt.xlabel('Fundamental Score')
    plt.ylabel('Stock Ticker')
    plt.title(f'Top {top_n} TSX Stocks by Fundamental Score')
    plt.gca().invert_yaxis()
    plt.tight_layout()
    
    if output_path is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = OUTPUT_DIR / f"top_stocks_{timestamp}.png"
    
    plt.savefig(output_path, dpi=150, bbox_inches='tight')
    plt.close()
    print(f"Saved chart: {output_path}")
    
    return output_path

def create_metrics_table(df: pd.DataFrame, output_path: Path = None):
    """Create a formatted table of key metrics"""
    from matplotlib.patches import Rectangle
    
    # Select key columns
    key_cols = ['Ticker', 'Score']
    optional_cols = ['Market Cap', 'P/E', 'Dividend Yield', 'ROE', 'Debt/Equity']
    
    for col in optional_cols:
        if col in df.columns:
            key_cols.append(col)
    
    if len(key_cols) <= 2:
        print("Limited columns available for table")
        return
    
    # Top 15 stocks
    display_df = df.nlargest(15, 'Score')[key_cols]
    
    # Create figure
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.axis('tight')
    ax.axis('off')
    
    # Create table
    table = ax.table(
        cellText=display_df.values,
        colLabels=display_df.columns,
        cellLoc='center',
        loc='center',
        colColours=['#2E86AB'] * len(display_df.columns),
        colWidths=[0.15] * len(display_df.columns)
    )
    
    table.auto_set_font_size(False)
    table.set_fontsize(9)
    table.scale(1, 2)
    
    # Style header
    for i, key in enumerate(display_df.columns):
        table[(0, i)].set_text_props(color='white', fontweight='bold')
    
    # Alternate row colors
    for i in range(1, len(display_df) + 1):
        for j in range(len(display_df.columns)):
            if i % 2 == 0:
                table[(i, j)].set_facecolor('#E8F4F8')
    
    plt.title('TSX Stock Fundamental Analysis', fontsize=14, fontweight='bold', pad=20)
    
    if output_path is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = OUTPUT_DIR / f"metrics_table_{timestamp}.png"
    
    plt.savefig(output_path, dpi=150, bbox_inches='tight')
    plt.close()
    print(f"Saved table: {output_path}")
    
    return output_path

if __name__ == "__main__":
    print("StockSummarizer Chart Generator")
    print("=" * 40)
    
    # Look for processed CSV files
    processed_files = list(OUTPUT_DIR.glob("processed_*.csv"))
    
    if not processed_files:
        print("\nNo processed data found.")
        print("Run process_data.py first to generate processed CSV files.")
        exit(1)
    
    # Use most recent processed file
    latest_file = max(processed_files, key=lambda p: p.stat().st_mtime)
    print(f"\nLoading: {latest_file.name}")
    
    df = pd.read_csv(latest_file)
    
    print("\nGenerating charts...")
    create_top_stocks_chart(df)
    create_metrics_table(df)
    
    print("\nChart generation complete!")
    print(f"Check the output folder: {OUTPUT_DIR}")
