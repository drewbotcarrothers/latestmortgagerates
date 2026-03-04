# TSX Data Update Guide

How to refresh your TSX stock data when TradingView releases new screener exports.

---

## When to Update Your Data

**Recommended frequency**: Monthly (first week of each month)

**Update triggers:**
- [ ] New month started (get latest fundamental data)
- [ ] Major market event (ensure price data is current)
- [ ] Quarterly earnings season (updated EPS, revenue, guidance)
- [ ] You're analyzing a stock and notice stale data
- [ ] TradingView adds new metrics you want to include

**Best practice**: Set a recurring calendar reminder for the first Monday of each month.

---

## Update Workflow (15 minutes)

### Step 1: Download New Screener Files from TradingView

**Navigate to**: [TradingView Stock Screener](https://www.tradingview.com/screener/)

**For each metric category you need:**

1. **Go to screener**: Filter for TSX stocks
2. **Add columns**: Select the metrics you want (see "Recommended Metric Groups" below)
3. **Load all stocks**: Scroll to bottom or set "Show: All"
4. **Export**: Click export icon (top right) → Download CSV
5. **Save with descriptive name**: e.g., `TSX Screen_2026-03-01.csv`

**Repeat for each metric group** (you should download 8-10 CSV files total)

---

### Step 2: Upload Files to Stock Analysis Folder

**Upload files to**: `/sessions/gallant-great-fermat/mnt/uploads/`

**File naming convention:**
- Include "TSX" or "Screen" in filename
- Include date: `TSX_Screen_2026-03-01.csv`
- Or keep default TradingView names (they work fine)

**⚠️ Important**:
- Delete old screener files from `/uploads` first (to avoid confusion)
- Or move them to a subfolder like `/uploads/old/`

---

### Step 3: Run Update Script

```bash
cd "/sessions/gallant-great-fermat/mnt/Stock Analysis"
python update_tsx_data.py
```

**What this script does:**
1. ✓ Backs up your current TSX_Merged_Data.csv (timestamped)
2. ✓ Finds all new screener files in /uploads
3. ✓ Removes duplicate rows within each file
4. ✓ Merges files on Symbol column (inner join)
5. ✓ Removes duplicate columns
6. ✓ Saves updated TSX_Merged_Data.csv
7. ✓ Shows summary statistics and changes

**Expected output:**
```
✓ Backed up existing data to: TSX_Merged_Data_backup_2026-03-01_093045.csv
Found 10 screener files
✓ Merged data saved to: TSX_Merged_Data.csv

UPDATE SUMMARY:
  Total stocks: 2,689
  Previous stock count: 2,676
  Net change: +13 stocks (+0.5%)
```

**Time**: ~30 seconds to 1 minute (depending on file size)

---

### Step 4: Verify Update

**Quick checks:**

1. **Stock count reasonable?**
   - Should be 2,600-2,800 for TSX
   - +/- 50 stocks from previous is normal
   - Big changes (>100) might indicate missing files

2. **Date columns updated?**
   ```bash
   head -2 TSX_Merged_Data.csv | grep "Fiscal period end date"
   ```
   Should show recent dates (Q4 2025 or Q1 2026)

3. **Key stocks present?**
   ```bash
   grep "^RY," TSX_Merged_Data.csv
   grep "^TD," TSX_Merged_Data.csv
   grep "^SHOP," TSX_Merged_Data.csv
   ```
   Should return data for these major stocks

---

### Step 5: Re-run Your Analyses (Optional)

If you have saved analyses, consider re-running:

```bash
# Re-screen stocks with updated data
python analysis_scripts/screen_stocks.py

# Update stats for your favorite stocks
python analysis_scripts/quick_stats.py
```

**Note**: Existing filtered CSV files will still reference old data until you re-run screening.

---

## Recommended Metric Groups to Download

To recreate the full 128-column dataset, download these screener views:

### Group 1: Price & Performance
- Symbol, Description
- Price, Price - Currency
- Price Change % (1 day, 1 week, 1 month, 3 months, 6 months, YTD, 1 year, 5 years)
- Volume, Relative Volume
- Pre-market/Post-market data
- Gap %

### Group 2: Valuation
- Market capitalization
- P/E ratio, P/B ratio, P/S ratio, PEG ratio
- Price to cash flow, Price to free cash flow
- Enterprise value, EV/Revenue, EV/EBIT, EV/EBITDA

### Group 3: Dividends
- Dividend yield % (TTM)
- Dividends per share (Annual, Quarterly)
- Dividend yield % (indicated)
- Dividend payout ratio %
- Dividend growth % YoY
- Continuous dividend payout, Continuous dividend growth

### Group 4: Profitability
- Gross margin %, Operating margin %, Net margin % (TTM)
- Return on equity %, Return on assets %, Return on invested capital %
- Free cash flow margin %
- R&D ratio, SG&A ratio

### Group 5: Income Statement
- Total revenue (TTM), Revenue growth % YoY
- Gross profit, Operating income, Net income (TTM)
- EPS basic, EPS diluted (TTM), EPS growth %
- EBITDA (TTM)

### Group 6: Balance Sheet
- Total assets, Current assets, Cash & equivalents (Quarterly)
- Total liabilities, Total debt (Quarterly)
- Total equity (Quarterly)
- Current ratio, Quick ratio
- Debt to equity ratio, Cash to debt ratio
- Net debt

### Group 7: Cash Flow
- Cash from operations, Cash from investing, Cash from financing (TTM)
- Free cash flow (TTM)
- Capital expenditures (TTM)

### Group 8: Per-Share Metrics
- Revenue per share, Operating cash flow per share, Free cash flow per share (TTM)
- EBIT per share, EBITDA per share (TTM)
- Book value per share, Debt per share, Cash per share (Quarterly)

### Group 9: Other
- Sector, Industry
- Analyst Rating
- Volatility (1 week, 1 month)
- Recent fiscal period, Fiscal period end date

**Tip**: Save each screener configuration in TradingView for quick re-export next month!

---

## Backup Management

**Backups location**: `/sessions/gallant-great-fermat/mnt/Stock Analysis/backups/`

**Naming format**: `TSX_Merged_Data_backup_YYYY-MM-DD_HHMMSS.csv`

### Backup Retention Policy

**Recommended:**
- Keep last 3 months: 3 files
- Keep one from each quarter: 4 files/year
- Delete older than 1 year

**Space management:**
```bash
# List backups by size
ls -lh backups/

# Delete backups older than 3 months (example)
find backups/ -name "*.csv" -mtime +90 -delete
```

**Why backups matter:**
- Recover if new data has issues
- Compare trends over time
- Audit trail for analysis dates

---

## Troubleshooting

### "No screener files found"

**Problem**: Script can't find CSV files
**Solution**:
- Verify files are in `/sessions/gallant-great-fermat/mnt/uploads/`
- Check filenames contain "TSX" or "Screen"
- Ensure files end with `.csv`

---

### "Only X stocks after merge (expected 2,600+)"

**Problem**: Inner join excluded too many stocks
**Solution**:
- Check if any screener file has significantly fewer stocks
- Ensure all files cover the full TSX universe (not filtered subsets)
- Verify column headers match (Symbol column must exist in all)

---

### "Merge resulted in way more stocks than expected"

**Problem**: Duplicate symbols created Cartesian product
**Solution**:
- Update script handles this automatically (removes duplicates)
- If still happening, check for multiple tickers with same symbol but different exchanges

---

### "Data looks stale after update"

**Problem**: Downloaded old files or cache issue
**Solution**:
- Verify fiscal period end dates in output
- Re-download from TradingView (ensure no date filters applied)
- Check TradingView's own data freshness (they update quarterly data with lag)

---

### "Missing columns after update"

**Problem**: Didn't download all metric groups
**Solution**:
- Compare column count: should be ~128 columns
- Re-download missing metric groups
- Check "Recommended Metric Groups" section above

---

## Data Freshness Expectations

**What updates immediately:**
- ✓ Price data (daily)
- ✓ Volume data (daily)
- ✓ Performance % (daily)
- ✓ Market capitalization (daily)

**What updates quarterly:**
- ⏱ Earnings (EPS, revenue, net income)
- ⏱ Balance sheet metrics (debt, assets, equity)
- ⏱ Cash flow data
- ⏱ Profitability margins
- ⏱ Per-share metrics

**Typical lag**: 30-45 days after quarter end
- Q4 2025 ends Dec 31 → Data available late Jan/early Feb 2026
- Q1 2026 ends Mar 31 → Data available early May 2026

**Dividend data**: Updates when companies announce (varies by company)

---

## Update Log (Keep Your Own)

Track your updates for reference:

| Update Date | Files Count | Stocks | Changes | Notes |
|-------------|-------------|--------|---------|-------|
| 2026-02-07 | 10 | 2,676 | Initial | First merge |
| 2026-03-01 | 10 | 2,689 | +13 | Added new IPOs |
| 2026-04-01 | 10 | 2,671 | -18 | Delistings |

**Template:**
```
Update Date: [Date]
Files Processed: [Count]
Total Stocks: [Count]
Change from Previous: [+/- X]
Notes: [Any observations]
```

---

## Automation Options (Advanced)

### Option 1: Manual Monthly (Recommended)
- Set calendar reminder
- Download from TradingView manually
- Run script
- **Time**: 15 minutes/month

### Option 2: Semi-Automated
- Keep TradingView screener configurations saved
- Export all with one click (TradingView's batch export if available)
- Run script
- **Time**: 5 minutes/month

### Option 3: Fully Automated (Requires API)
- TradingView doesn't offer public API for screener
- Alternative: Use data providers with APIs (Alpha Vantage, Financial Modeling Prep)
- Setup cron job to fetch + merge monthly
- **Time**: Initial setup only, then automatic

**Recommendation**: Stick with Option 1 or 2. The manual process ensures you review the data.

---

## Best Practices

**✓ DO:**
- Update monthly (first week of the month)
- Back up before updating (script does this automatically)
- Verify stock count and key stocks after update
- Re-run analyses with new data
- Keep update log for your records
- Delete old screener files from /uploads after successful merge

**✗ DON'T:**
- Mix data from different dates in analysis
- Use analyses based on old data after updating (re-screen)
- Delete backups immediately (wait 3 months)
- Run update script without checking upload folder first
- Forget to download all metric groups (leads to missing columns)

---

## Quick Reference Commands

```bash
# Navigate to Stock Analysis folder
cd "/sessions/gallant-great-fermat/mnt/Stock Analysis"

# Run update script
python update_tsx_data.py

# Check current data date
head -2 TSX_Merged_Data.csv | tail -1

# Count stocks
wc -l TSX_Merged_Data.csv

# Count columns
head -1 TSX_Merged_Data.csv | sed 's/[^,]//g' | wc -c

# List backups
ls -lh backups/

# Re-run screening with new data
python analysis_scripts/screen_stocks.py
```

---

## FAQ

**Q: How often should I update?**
A: Monthly is ideal. Quarterly at minimum (after earnings seasons).

**Q: Can I update mid-month?**
A: Yes, but fundamental data (EPS, revenue) won't change. Only prices will update.

**Q: What if I miss a month?**
A: No problem. Just update when you're ready. Data accumulates, doesn't expire.

**Q: Do I need to re-download all 10 files each time?**
A: Yes, to ensure consistency. TradingView data updates across all metrics simultaneously.

**Q: Can I add new metrics without re-downloading everything?**
A: No. The merge requires consistent Symbol column and row counts. Download full set.

**Q: What if TradingView changes column names?**
A: Script merges on 'Symbol' column. As long as that exists, it'll work. Other columns can have different names.

**Q: Should I commit TSX_Merged_Data.csv to version control?**
A: If using git: No (too large). Use backups folder instead. Add `*.csv` to .gitignore.

---

**For questions or issues, refer to the main README.md in the Stock Analysis folder.**
