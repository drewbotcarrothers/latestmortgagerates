import json
import os
import sys
from datetime import datetime

def generate_summary_email():
    """Generate a simple high-level email summary of the rate scraper run."""
    
    # Read metadata
    with open('data/metadata.json', 'r') as f:
        metadata = json.load(f)
    
    # Read rates.json for detailed stats
    with open('data/rates.json', 'r') as f:
        rates = json.load(f)
    
    last_updated = metadata['last_updated']
    total_rates = metadata['total_rates']
    total_lenders = metadata['total_lenders']
    scrapers_run = metadata['scrapers_run']
    successful = metadata['scrapers_successful']
    failed = metadata['scrapers_failed']
    
    # Count live vs fallback rates
    live_rates = [r for r in rates if r.get('source_url') and 'fallback' not in r.get('source_url', '')]
    fallback_rates = [r for r in rates if not r.get('source_url') or 'fallback' in r.get('source_url', '')]
    
    live_count = len(live_rates)
    fallback_count = len(fallback_rates)
    live_pct = (live_count / total_rates * 100) if total_rates > 0 else 0
    
    # Build simple HTML email
    html = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: #1a5f7a; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 22px; }}
        .header p {{ margin: 5px 0 0 0; opacity: 0.9; }}
        .stats {{ background: #f8f9fa; padding: 20px; }}
        .stat-row {{ display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #ddd; }}
        .stat-label {{ font-weight: bold; color: #555; }}
        .stat-value {{ font-weight: bold; font-size: 18px; }}
        .live {{ color: #28a745; }}
        .fallback {{ color: #ffc107; }}
        .failed {{ color: #dc3545; }}
        .footer {{ margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; text-align: center; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Rate Scraper Report</h1>
            <p>{last_updated}</p>
        </div>
        
        <div class="stats">
            <div class="stat-row">
                <span class="stat-label">Live Rates</span>
                <span class="stat-value live">{live_count} ({live_pct:.0f}%)</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Fallback Rates</span>
                <span class="stat-value fallback">{fallback_count}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Total Lenders</span>
                <span class="stat-value">{total_lenders}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Scrapers Run</span>
                <span class="stat-value">{scrapers_run}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Successful</span>
                <span class="stat-value" style="color: #28a745;">{successful}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Failed</span>
                <span class="stat-value" style="color: {'#dc3545' if failed > 0 else '#666'};">{failed}</span>
            </div>
        </div>
        
        <div class="footer">
            <p>latestmortgagerates.ca</p>
        </div>
    </div>
</body>
</html>
"""
    
    # Simple text version
    text = f"""📊 Rate Scraper Report - {last_updated}

Live Rates: {live_count} ({live_pct:.0f}%)
Fallback Rates: {fallback_count}
Total Lenders: {total_lenders}
Scrapers Run: {scrapers_run}
Successful: {successful}
Failed: {failed}

latestmortgagerates.ca
"""
    
    return html, text

if __name__ == '__main__':
    html_content, text_content = generate_summary_email()
    
    with open('email_summary.html', 'w') as f:
        f.write(html_content)
    
    with open('email_summary.txt', 'w') as f:
        f.write(text_content)
    
    print("Email summary generated successfully!")
    print(f"HTML: {len(html_content)} chars")
    print(f"Text: {len(text_content)} chars")
