# Stock Analysis Scripts - Complete Guide

Everything you need to create data-driven, engaging Twitter threads about TSX stocks.

---

## 📦 What's In This Toolkit

### Core Scripts
- **screen_stocks.py** - Filter 2,676 TSX stocks by theme criteria (4 pre-built themes)
- **quick_stats.py** - Generate summary statistics for selected stocks
- **create_visualizations.py** - Create Twitter-optimized charts (3-7 stocks)
- **create_visualizations_extended.py** - For larger stock sets (8-20 stocks)

### Thread Templates
- **thread_format_individual.md** - Deep dive format (1 stock, 12-18 tweets, 5-7 charts)
- **thread_format_group.md** - Comparison format (2+ stocks, 8-12 tweets, 3-4 charts)
- **THREAD_FORMAT_GUIDE.md** - Decision guide: which format to use when

### Research & Planning
- **stock_research_template.md** - Web research template (bull case, bear case, sources)
- **workflow_individual_stock.md** - Complete step-by-step workflow for deep dives
- **TSX_THEME_IDEAS.md** - 60+ theme ideas specific to Canadian market

### Examples & Reference
- **EXAMPLE_Complete_Thread.md** - Fully written example thread (Dividend Aristocrats)
- **README.md** - This file

---

## 🎯 Two Analysis Formats

### Individual Format - 1 Stock Deep Dive
**When to use**: Analyzing ONE stock in depth
- **Length**: 12-18 tweets
- **Charts**: 5-7 detailed visualizations
- **Time**: 2-3 hours (includes 50 min web research)
- **Focus**: Complete business story, moats, catalysts, risks
- **Template**: `thread_format_individual.md`
- **Workflow**: `workflow_individual_stock.md`

**Example themes**:
- "Shopify: Still a Buy at $80?"
- "Royal Bank Deep Dive: 28-Year Dividend Streak Explained"
- "Why TD Bank Just Became Interesting"

---

### Group Format - Comparative Analysis
**When to use**: Comparing 2-20 stocks with common theme
- **Length**: 8-12 tweets
- **Charts**: 3-4 comparative visualizations
- **Time**: 1-1.5 hours (no web research required)
- **Focus**: Pattern recognition, rankings, trade-offs
- **Template**: `thread_format_group.md`
- **Script**: `create_visualizations.py` (or `_extended.py` for 8+ stocks)

**Example themes**:
- "Big 5 Banks Ranked: Which Is Best?"
- "5 TSX Dividend Aristocrats Compared"
- "Canadian Pipeline Oligopoly: Yield + Growth Analysis"

---

## 🚀 Quick Start Workflows

### For Group Analysis (Fastest - 60 min)

```bash
# 1. Choose theme & screen stocks (5 min)
cd "/sessions/gallant-great-fermat/mnt/Stock Analysis/analysis_scripts"
python screen_stocks.py  # Edit to select theme first

# 2. Select 3-7 stocks manually from results (5 min)

# 3. Generate statistics (2 min)
nano quick_stats.py  # Edit SELECTED_STOCKS = ['RY', 'TD', 'ENB', ...]
python quick_stats.py

# 4. Create charts (2 min)
nano create_visualizations.py  # Edit SELECTED_STOCKS
python create_visualizations.py

# 5. Write thread (30 min)
# Use: thread_format_group.md

# 6. Review & post (10 min)
```

---

### For Individual Deep Dive (Complete - 2-3 hours)

```bash
# 1. Choose stock (5 min)

# 2. Web research (50 min) ⭐ CRITICAL STEP
# Fill out: stock_research_template.md
# - Search recent news, earnings, analyst views
# - Document 4-6 risks (bear case)
# - Document 4-6 opportunities (bull case)
# - Develop your unique investment thesis

# 3. Generate statistics (15 min)
nano quick_stats.py  # Edit SELECTED_STOCKS = ['RY']
python quick_stats.py > stats_RY.txt

# 4. Create custom charts (30 min)
# Individual stocks need different charts than group comparisons
# - Historical performance (10 years)
# - Quality metrics vs peers
# - Segment breakdown
# - Valuation context
# - Dividend sustainability

# 5. Write thread (60 min)
# Use: thread_format_individual.md
# Integrate your research from step 2

# 6. Review & post (20 min)
```

**Full workflow**: See `workflow_individual_stock.md`

---

## 📊 Pre-Built Theme Templates

The `screen_stocks.py` script includes 4 ready-to-use themes:

### 1. Dividend Aristocrats
- **Criteria**: Yield >3%, 5+ years payout, payout ratio <80%, market cap >$1B
- **Best for**: Income investors

### 2. Growth Champions
- **Criteria**: Revenue growth >15%, Operating margin >10%, EPS growth >20%
- **Best for**: Growth seekers

### 3. Value Plays
- **Criteria**: P/E <15, FCF margin >10%, ROE >15%, P/B <2
- **Best for**: Value hunters

### 4. Cash Flow Kings (DEFAULT)
- **Criteria**: FCF margin >15%, Operating margin >20%, Current ratio >1.5
- **Best for**: Quality + cash generation

**Want 60+ more theme ideas?** See `TSX_THEME_IDEAS.md` for Canadian-specific themes like:
- Big 5 Banks Ranked
- Pipeline Oligopoly
- Railway Duopoly
- Oil Sands Giants
- Cannabis Consolidation
- Shopify Deep Dive
- And 54 more...

---

## 🔍 Web Research Process (For Individual Stocks)

**NEW**: Before writing any individual stock thread, complete web research using `stock_research_template.md`

### Why This Matters
- ✓ Ensures analysis is current (your data may be 30-45 days old)
- ✓ Provides specific risks and opportunities with evidence
- ✓ Builds credibility with source citations
- ✓ Develops your unique investment angle
- ✓ Makes tweets 10x more engaging (specific > vague)

### What You'll Research (50 min)
1. **Recent news** - Last 3 months of headlines
2. **Latest earnings** - Q4 2025 or most recent quarter
3. **Analyst views** - Consensus rating, price targets
4. **Strategic updates** - M&A, product launches, expansion
5. **Bear case** - 4-6 specific risks with evidence and sources
6. **Bull case** - 4-6 specific opportunities with catalysts

### Search Queries to Run
```
"[Symbol] news 2026"
"[Company] earnings Q4 2025"
"[Symbol] analyst rating 2026"
"[Company] strategy 2026"
"[Industry] trends 2026"
"[Company] risks concerns 2026"
```

**Output**: Completed research template that feeds directly into tweets 3, 7, 12, 13 of your thread

---

## 📈 Visualization Scripts

### create_visualizations.py (Standard)
**For**: 3-7 stocks in group comparison
**Charts created**:
1. Horizontal bar - Primary metric ranking
2. Scatter plot - Two-dimensional comparison
3. Grouped bars - Multi-metric scorecard
4. Performance comparison (optional)

**Usage**:
```python
SELECTED_STOCKS = ['RY', 'TD', 'ENB', 'BMO', 'BNS']
THEME_NAME = "Canadian Dividend Aristocrats"
python create_visualizations.py
```

---

### create_visualizations_extended.py (For Larger Sets)
**For**: 8-20 stocks in sector overview
**Charts created**:
1. Top N ranking (works up to 20)
2. Tiered view (top/mid/bottom terciles)
3. Multi-metric grid (top 10 only)
4. Sector breakdown (pie + bars)

**Usage**:
```python
SELECTED_STOCKS = ['RY', 'TD', 'ENB', ...] # 8-20 stocks
python create_visualizations_extended.py
```

---

## 🎨 Customization Guide

### Change Theme Criteria
Edit `screen_stocks.py` lines 45-130:
```python
# Uncomment one theme or create your own
criteria = {
    'dividend_yield_min': 3.0,  # Adjust this
    'continuous_payout_min': 5,  # Or this
    # ... etc
}
```

### Change Chart Colors
Edit `create_visualizations.py` lines 16-20:
```python
COLOR_PRIMARY = '#3498db'    # Blue
COLOR_POSITIVE = '#2ecc71'   # Green
COLOR_NEGATIVE = '#e74c3c'   # Red
COLOR_ACCENT = '#f39c12'     # Orange
```

### Change Selected Stocks
Edit in multiple files:
- `quick_stats.py` line 11
- `create_visualizations.py` line 26
- Both use: `SELECTED_STOCKS = ['RY', 'TD', ...]`

### Add New Metrics to Charts
1. Open `create_visualizations.py`
2. Find the chart section (Chart 1, 2, 3, etc.)
3. Change the metric variable (e.g., `metric_chart1 = 'Your metric'`)
4. Update title and axis labels

---

## ⏱️ Time Estimates

| Task | Individual | Group |
|------|-----------|-------|
| Theme selection | 5 min | 5 min |
| Web research | 50 min | - |
| Stock screening | - | 5 min |
| Stock selection | - | 5 min |
| Data analysis | 30 min | 2 min |
| Visualization | 30 min | 5 min |
| Thread writing | 60 min | 30 min |
| Review & post | 20 min | 10 min |
| **TOTAL** | **~3 hours** | **~1 hour** |

**With experience**:
- Individual: 2 hours
- Group: 45 minutes

---

## 📝 Thread Structure Comparison

| Element | Individual (1 stock) | Group (2+ stocks) |
|---------|---------------------|-------------------|
| **Hook** | Company-specific surprise | Theme/pattern |
| **Thesis** | Your unique angle on this company | Selection criteria + methodology |
| **Visuals** | Historical, quality, segments, valuation, risks | Rankings, scatter plots, comparisons |
| **Insights** | Business moats, competitive advantages | Patterns, outliers, trade-offs |
| **Risks** | Company-specific (detailed, 3-4 risks) | Category-wide (brief) |
| **Opportunities** | Specific catalysts with dates | General themes |
| **CTA** | "What's your take on [Company]?" | "Which would you pick?" |

---

## 🎯 Which Format Should You Use?

**Use INDIVIDUAL format when:**
- Analyzing earnings announcement
- Controversial/newsworthy stock (banks, energy, cannabis)
- Turnaround story or hidden gem
- Building "Deep Dive Fridays" series
- You want to establish sector expertise

**Use GROUP format when:**
- Comparing competitors in same industry
- Creating thematic screens (high yield, growth, value)
- Sector overview ("Top 5 Canadian Banks")
- Building diversification strategy
- Time-efficient content creation

**Still unsure?** See `THREAD_FORMAT_GUIDE.md` for detailed decision tree

---

## 🔧 Troubleshooting

### "ModuleNotFoundError: No module named 'pandas'"
```bash
pip install pandas matplotlib seaborn --break-system-packages
```

### "No stocks matched your criteria"
- Criteria too strict → Relax thresholds in `screen_stocks.py`
- Missing data → Some stocks lack certain metrics
- Check which specific filter is eliminating stocks

### "Chart text is too small"
Edit `create_visualizations.py` line 11:
```python
plt.rcParams['font.size'] = 14  # Increase from 12
```

### "Stock not found in data"
```bash
# Check if stock exists
grep "^RY," ../TSX_Merged_Data.csv
```

### "Data looks stale"
- Run data update: `cd .. && python update_tsx_data.py`
- Check fiscal period dates in dataset
- Quarterly data has 30-45 day lag

---

## 📚 Documentation Map

**Start here:**
- `README.md` (this file) - Overview and quick start

**Choose your format:**
- `THREAD_FORMAT_GUIDE.md` - Decision guide
- `thread_format_individual.md` - 1 stock deep dive
- `thread_format_group.md` - Group comparison

**Complete workflows:**
- `workflow_individual_stock.md` - Step-by-step for deep dives
- `stock_research_template.md` - Web research template

**Inspiration:**
- `TSX_THEME_IDEAS.md` - 60+ Canadian market themes
- `EXAMPLE_Complete_Thread.md` - Fully written example

**Parent folder:**
- `../Stock_Analysis_Twitter_Thread_SOP.md` - Master guide (11,000+ words)
- `../DATA_UPDATE_GUIDE.md` - Monthly data updates
- `../QUICK_START.md` - One-page reference
- `../update_tsx_data.py` - Data update script

---

## 💡 Pro Tips

### Content Strategy
- **Monday**: Group comparison (broad appeal, week starter)
- **Wednesday**: Individual deep dive (mid-week depth)
- **Friday**: Contrarian take or timely news (engagement boost)

### Engagement Tactics
- ✓ Start with your strongest insight (don't bury the lead)
- ✓ Ask questions in tweets 5-7 (drives replies)
- ✓ Include 1-2 contrarian takes (sparks discussion)
- ✓ Use "you" language (personalization)
- ✓ Respond to first 3-5 comments within 30 min

### Quality Markers
- ✓ Specific numbers > vague claims ("grew 18% YoY" not "strong growth")
- ✓ Visual insights > data dumps (interpret the chart, don't just show it)
- ✓ "Why" explanations > "what" descriptions (explain causation)
- ✓ Balanced perspective > hype (acknowledge risks)
- ✓ Source citations > assertions (Q4 2025 earnings, Globe & Mail)

### Time Savers
- ✓ Build 10-15 theme backlog (never run out of ideas)
- ✓ Save successful hooks and structures (swipe file)
- ✓ Reuse chart templates (consistent branding)
- ✓ Track performance (double down on what works)
- ✓ Update data monthly (first week, 15 min)

### Growth Tactics
- ✓ Post Tuesday-Thursday 8-10 AM EST (optimal engagement)
- ✓ Build recurring series ("Deep Dive Fridays", "Monday Movers")
- ✓ Cross-reference threads ("In my RY thread, I mentioned...")
- ✓ Ask followers what to analyze next (guaranteed engagement)
- ✓ Compile quarterly "best threads" retrospective

---

## ⚠️ Pre-Post Checklist

**Data Accuracy:**
- [ ] All numbers match source data
- [ ] Calculations verified (no math errors)
- [ ] Stock symbols correct
- [ ] Dates accurate (earnings dates, fiscal periods)

**Content Quality:**
- [ ] Thread tells cohesive story
- [ ] Hook is attention-grabbing
- [ ] Every chart has insight caption
- [ ] Risks acknowledged (balance)
- [ ] Sources cited where appropriate

**Format:**
- [ ] All tweets under 280 characters
- [ ] Images readable on mobile
- [ ] Alt text added to all images
- [ ] 1-3 hashtags included (not in hook)
- [ ] No "buy/sell" language

**Compliance:**
- [ ] No financial advice given
- [ ] Positions disclosed (if you own the stocks)
- [ ] Balanced perspective (not promotional)
- [ ] Sources attributed

---

## 🎓 Learning Resources

**Follow these accounts for inspiration:**
- @charliebilello - Data visualizations
- @GameofTrades_ - Thematic analysis
- @BrianFeroldi - Educational threads
- @borrowed_ideas - Contrarian takes
- @TrungTPhan - Company deep dives

**Master these skills:**
- Data storytelling (charts that communicate insights)
- Hook writing (first 3 words determine success)
- Risk/reward framing (balanced perspective)
- Source credibility (build trust with citations)
- Engagement tactics (questions, CTAs, timing)

---

## 🚀 Getting Started Right Now

**New to this toolkit?**
1. Read `QUICK_START.md` (one-page overview)
2. Browse `TSX_THEME_IDEAS.md` (pick a theme)
3. Choose format: `THREAD_FORMAT_GUIDE.md`
4. Follow workflow for your chosen format

**Ready to create your first thread?**
→ Group comparison (easiest): "Big 5 Banks Ranked"
1. `python screen_stocks.py` (select Dividend Aristocrats or create bank filter)
2. Select RY, TD, BMO, BNS, CM
3. `python quick_stats.py`
4. `python create_visualizations.py`
5. Use `thread_format_group.md`
6. Post Tuesday 9 AM EST

**Want to go deeper?**
→ Individual deep dive: "Royal Bank: The Complete Analysis"
1. Complete `stock_research_template.md` (50 min)
2. Follow `workflow_individual_stock.md`
3. Use `thread_format_individual.md`
4. Create 5-7 custom charts
5. Write 12-18 tweet thread

---

## 📞 Support

**Questions about:**
- Workflow → See `workflow_individual_stock.md`
- Format choice → See `THREAD_FORMAT_GUIDE.md`
- Theme ideas → See `TSX_THEME_IDEAS.md`
- Data updates → See `../DATA_UPDATE_GUIDE.md`
- Everything else → See `../Stock_Analysis_Twitter_Thread_SOP.md`

**Common issues:**
- Script errors → Check Troubleshooting section above
- No ideas → Browse 60 themes in `TSX_THEME_IDEAS.md`
- Low engagement → Review Pro Tips and examples
- Stale data → Run `../update_tsx_data.py`

---

**Your complete stock analysis toolkit is ready. Choose a theme and start creating!** 🎯📊

*Last updated: February 2026*
