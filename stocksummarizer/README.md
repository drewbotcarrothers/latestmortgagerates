# StockSummarizer

Automated TSX stock analysis pipeline that processes TradingView data and publishes to WordPress.

## Quick Start

1. **Export TradingView Data**
   - Go to TradingView Screener
   - Apply TSX filter
   - Export to CSV
   - Save CSV to `data/` folder

2. **Process Data**
   ```bash
   cd scripts
   python process_data.py
   ```

3. **Generate Charts**
   ```bash
   python generate_charts.py
   ```

4. **Publish to WordPress**
   - Edit `post_to_wordpress.py` with your WordPress credentials
   - Run: `python post_to_wordpress.py`

## Folder Structure

```
stocksummarizer/
├── scripts/
│   ├── process_data.py       # Process TradingView CSV
│   ├── generate_charts.py     # Create visualizations
│   └── post_to_wordpress.py   # Publish to WordPress
├── data/                      # TradingView CSV exports
├── output/                    # Processed data + charts
└── templates/                 # Post templates
```

## Requirements

- Python 3.8+
- pandas
- matplotlib

Install dependencies:
```bash
pip install pandas matplotlib
```

## WordPress Setup

1. Log into WordPress admin
2. Go to Users → Profile → Application Passwords
3. Create new application password
4. Update credentials in `post_to_wordpress.py`

## Workflow

1. Download TSX data from TradingView → `data/`
2. Run `process_data.py` to clean and score stocks
3. Run `generate_charts.py` to create visualizations
4. Run `post_to_wordpress.py` to publish

---

Created for StockSummarizer.com
