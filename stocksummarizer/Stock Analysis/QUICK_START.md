# Quick Start Guide - Stock Analysis Toolkit

One-page reference for common tasks.

---

## 🎯 What Do You Want To Do?

### Create a Twitter Thread

**Individual Stock (1 stock deep dive)**
```bash
1. cd analysis_scripts
2. Fill out: stock_research_template.md (50 min web research)
3. python quick_stats.py  # Update SELECTED_STOCKS first
4. python create_visualizations.py
5. Use: thread_format_individual.md
```
**Time**: 2-3 hours | **Template**: thread_format_individual.md

---

**Group Comparison (2-20 stocks)**
```bash
1. cd analysis_scripts
2. python screen_stocks.py  # Filter by theme
3. Select 3-7 stocks manually
4. python quick_stats.py  # Update SELECTED_STOCKS
5. python create_visualizations.py
6. Use: thread_format_group.md
```
**Time**: 1-1.5 hours | **Template**: thread_format_group.md

---

### Update Your Data (Monthly)

```bash
1. Download new TradingView screener CSVs
2. Upload to /uploads folder
3. python update_tsx_data.py
4. Verify stock count looks reasonable
```
**Time**: 15 minutes | **Guide**: DATA_UPDATE_GUIDE.md

---

### Screen for Stocks

```bash
cd analysis_scripts
nano screen_stocks.py  # Uncomment a theme or create your own
python screen_stocks.py
```
**Output**: filtered_stocks_[theme].csv

**Themes available:**
- Dividend Aristocrats
- Growth Champions
- Value Plays
- Cash Flow Kings (default)

---

### Generate Charts

```bash
cd analysis_scripts
nano create_visualizations.py  # Set SELECTED_STOCKS
python create_visualizations.py
```
**Output**:
- chart1_dividend_yield.png
- chart2_yield_vs_growth.png
- chart3_multi_metric.png
- chart4_performance.png

---

### Get Stock Statistics

```bash
cd analysis_scripts
nano quick_stats.py  # Set SELECTED_STOCKS
python quick_stats.py
```
**Output**: Console summary with min/max/avg for all metrics

---

## 📁 File Structure

```
Stock Analysis/
├── TSX_Merged_Data.csv              ← Your main data file (2,676 stocks)
├── update_tsx_data.py               ← Monthly data update script
├── DATA_UPDATE_GUIDE.md             ← How to update data
├── Stock_Analysis_Twitter_Thread_SOP.md  ← Complete guide
│
├── analysis_scripts/
│   ├── screen_stocks.py             ← Filter stocks by criteria
│   ├── quick_stats.py               ← Get summary statistics
│   ├── create_visualizations.py     ← Generate charts (3-7 stocks)
│   ├── create_visualizations_extended.py  ← For 8-20 stocks
│   │
│   ├── thread_format_individual.md  ← 1 stock deep dive template
│   ├── thread_format_group.md       ← Group comparison template
│   ├── stock_research_template.md   ← Web research template
│   ├── workflow_individual_stock.md ← Complete workflow
│   │
│   └── README.md                    ← Detailed script guide
│
└── backups/                         ← Timestamped data backups
```

---

## 🔧 Common Commands

```bash
# Navigate to folder
cd "/sessions/gallant-great-fermat/mnt/Stock Analysis"

# Check data freshness
head -2 TSX_Merged_Data.csv | tail -1

# Count stocks
wc -l TSX_Merged_Data.csv

# Find a specific stock
grep "^RY," TSX_Merged_Data.csv

# List available sectors
cut -d',' -f15 TSX_Merged_Data.csv | sort | uniq

# Update data
python update_tsx_data.py

# Screen stocks
cd analysis_scripts && python screen_stocks.py
```

---

## 📊 Workflow At A Glance

### For Individual Stock Analysis:
```
Choose Stock → Web Research (50 min) → Data Analysis (30 min) →
Create Charts (30 min) → Write Thread (60 min) → Post (20 min)
```
**Total**: ~3 hours (first time) → 2 hours (experienced)

### For Group Comparison:
```
Choose Theme → Screen Stocks (5 min) → Select Finals (5 min) →
Generate Stats (2 min) → Create Charts (5 min) → Write Thread (30 min)
```
**Total**: ~1 hour

### For Data Update:
```
Download Screeners → Upload Files → Run Script → Verify
```
**Total**: ~15 minutes | **Frequency**: Monthly

---

## 🎨 Customization Quick Reference

**Change theme criteria:**
Edit `analysis_scripts/screen_stocks.py` lines 45-80

**Change chart colors:**
Edit `analysis_scripts/create_visualizations.py` lines 16-20

**Change selected stocks:**
Edit `SELECTED_STOCKS = [...]` in quick_stats.py or create_visualizations.py

**Add new metric to chart:**
Edit metric variables in create_visualizations.py

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Module not found: pandas" | `pip install pandas matplotlib seaborn --break-system-packages` |
| "No stocks matched criteria" | Relax thresholds in screen_stocks.py |
| Charts too small | Increase `plt.rcParams['font.size']` |
| Can't find stock | Check symbol exists: `grep "^SYMBOL," TSX_Merged_Data.csv` |
| Data looks stale | Run `python update_tsx_data.py` |

---

## 📖 Documentation Map

**Getting Started:**
- This file (QUICK_START.md) ← You are here
- Stock_Analysis_Twitter_Thread_SOP.md (complete guide)

**Thread Creation:**
- thread_format_individual.md (1 stock)
- thread_format_group.md (2+ stocks)
- THREAD_FORMAT_GUIDE.md (decision guide)
- stock_research_template.md (web research)
- workflow_individual_stock.md (step-by-step)

**Scripts:**
- analysis_scripts/README.md (detailed script guide)

**Data Management:**
- DATA_UPDATE_GUIDE.md (monthly updates)

---

## 💡 Pro Tips

**Efficiency:**
- ✓ Save successful hooks and narrative structures
- ✓ Build a backlog of 10-15 theme ideas
- ✓ Reuse chart templates across similar analyses
- ✓ Update data monthly (1st week)
- ✓ Post Tuesday-Thursday 8-10 AM EST for best engagement

**Quality:**
- ✓ Always do web research before writing thread (don't skip!)
- ✓ Include both bull case and bear case
- ✓ Cite sources for credibility
- ✓ Preview charts on mobile before posting
- ✓ Keep threads under 280 chars per tweet

**Growth:**
- ✓ Track which threads get most engagement
- ✓ Note which chart types perform best
- ✓ Build recurring series (e.g., "Deep Dive Fridays")
- ✓ Respond to first 3-5 comments within 30 min

---

## 🚀 Quick Links

[Main SOP](Stock_Analysis_Twitter_Thread_SOP.md) |
[Data Updates](DATA_UPDATE_GUIDE.md) |
[Script Guide](analysis_scripts/README.md) |
[Format Decision Guide](analysis_scripts/THREAD_FORMAT_GUIDE.md)

---

**Need help?** Start with the detailed guides above, or review example threads in `EXAMPLE_Complete_Thread.md`

**Ready to begin?** Choose individual or group format from the top section and follow the steps!
