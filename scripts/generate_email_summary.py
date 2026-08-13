import json
import os
import sys
from datetime import datetime

def generate_summary_email():
    """Generate an HTML email summary of the rate scraper run."""
    
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
    
    # Group by lender
    lender_stats = {}
    for result in metadata['scraper_results']:
        lender = result['lender']
        lender_stats[lender] = {
            'success': result['success'],
            'rates_found': result['rates_found'],
            'error': result['error'],
            'duration': result['duration']
        }
    
    # Build HTML email
    html = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: #1a5f7a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
        .header h1 {{ margin: 0; font-size: 24px; }}
        .header p {{ margin: 5px 0 0 0; opacity: 0.9; }}
        .stats {{ background: #f8f9fa; padding: 20px; border-left: 4px solid #1a5f7a; }}
        .stat-row {{ display: flex; justify-content: space-between; margin: 8px 0; }}
        .stat-label {{ font-weight: bold; color: #555; }}
        .stat-value {{ font-weight: bold; }}
        .live {{ color: #28a745; }}
        .fallback {{ color: #ffc107; }}
        .failed {{ color: #dc3545; }}
        .lender-table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
        .lender-table th {{ background: #1a5f7a; color: white; padding: 10px; text-align: left; }}
        .lender-table td {{ padding: 8px 10px; border-bottom: 1px solid #ddd; }}
        .lender-table tr:hover {{ background: #f5f5f5; }}
        .success {{ color: #28a745; font-weight: bold; }}
        .error {{ color: #dc3545; font-weight: bold; }}
        .footer {{ margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Mortgage Rate Scraper Report</h1>
            <p>Run completed: {last_updated}</p>
        </div>
        
        <div class="stats">
            <div class="stat-row">
                <span class="stat-label">Total Rates:</span>
                <span class="stat-value">{total_rates}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Live Rates:</span>
                <span class="stat-value live">{live_count} ({live_pct:.1f}%)</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Fallback Rates:</span>
                <span class="stat-value fallback">{fallback_count}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Total Lenders:</span>
                <span class="stat-value">{total_lenders}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Scrapers Run:</span>
                <span class="stat-value">{scrapers_run}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Successful:</span>
                <span class="stat-value success">{successful}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Failed:</span>
                <span class="stat-value failed">{failed}</span>
            </div>
        </div>
        
        <h2 style="margin-top: 30px;">Lender Details</h2>
        <table class="lender-table">
            <thead>
                <tr>
                    <th>Lender</th>
                    <th>Status</th>
                    <th>Rates Found</th>
                    <th>Duration (s)</th>
                </tr>
            </thead>
            <tbody>
"""
    
    # Sort by rates found (descending)
    sorted_results = sorted(metadata['scraper_results'], key=lambda x: x['rates_found'], reverse=True)
    
    for result in sorted_results:
        lender = result['lender']
        success = result['success']
        rates_found = result['rates_found']
        duration = result['duration']
        error = result['error']
        
        status_class = 'success' if success and rates_found > 0 else 'error' if not success else 'fallback'
        status_text = '✅ Live' if success and rates_found > 0 else '❌ Failed' if not success else '⚠️ No rates'
        
        html += f"""
                <tr>
                    <td>{lender.title()}</td>
                    <td class="{status_class}">{status_text}</td>
                    <td>{rates_found}</td>
                    <td>{duration:.1f}s</td>
                </tr>
"""
    
    html += """
            </tbody>
        </table>
        
        <div class="footer">
            <p>This report was automatically generated by the Mortgage Rate Scraper.</p>
            <p>View the full data at: <a href="https://latestmortgagerates.ca">latestmortgagerates.ca</a></p>
        </div>
    </div>
</body>
</html>
"""
    
    # Also generate plain text version
    text = f"""Mortgage Rate Scraper Report
=============================

Run completed: {last_updated}

Summary:
- Total Rates: {total_rates}
- Live Rates: {live_count} ({live_pct:.1f}%)
- Fallback Rates: {fallback_count}
- Total Lenders: {total_lenders}
- Scrapers Run: {scrapers_run}
- Successful: {successful}
- Failed: {failed}

Lender Details:
"""
    
    for result in sorted_results:
        lender = result['lender']
        success = result['success']
        rates_found = result['rates_found']
        status = 'LIVE' if success and rates_found > 0 else 'FAILED' if not success else 'NO RATES'
        text += f"- {lender.title()}: {status} ({rates_found} rates, {result['duration']:.1f}s)\n"
    
    return html, text

if __name__ == '__main__':
    html_content, text_content = generate_summary_email()
    
    # Write to files for email action
    with open('email_summary.html', 'w') as f:
        f.write(html_content)
    
    with open('email_summary.txt', 'w') as f:
        f.write(text_content)
    
    print("Email summary generated successfully!")
    print(f"HTML: {len(html_content)} chars")
    print(f"Text: {len(text_content)} chars")
