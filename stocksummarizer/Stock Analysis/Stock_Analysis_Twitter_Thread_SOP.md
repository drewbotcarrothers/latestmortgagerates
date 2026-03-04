# Stock Analysis for Twitter Threads - Standard Operating Procedure

## Executive Summary

This SOP outlines a semi-automated workflow for creating compelling, data-driven stock analysis threads for Twitter. The process combines Python scripts for data analysis and visualization with manual narrative crafting to produce engaging, story-driven content.

**Target Output**: 8-15 tweet threads with 2-4 visualizations telling a cohesive investment story
**Time per Analysis**: 45-90 minutes
**Data Source**: TSX_Merged_Data.csv (2,676 stocks, 128 financial metrics)

---

## Workflow Overview

```
Theme Identification → Stock Selection → Data Analysis → Visualization →
Narrative Development → Thread Formatting → Review & Post
```

**Semi-Automated Elements**: Data filtering, calculations, chart generation
**Manual Elements**: Theme selection, narrative crafting, insights, formatting

---

## Phase 1: Theme Identification

### Step 1.1: Choose Your Story Angle

Select a thematic lens that will resonate with your audience:

**Investment Themes:**
- **Dividend Aristocrats**: High-yield, consistent dividend payers
- **Growth Champions**: High revenue growth, strong margins
- **Value Plays**: Low P/E, undervalued by traditional metrics
- **Cash Flow Kings**: Strong free cash flow generation
- **Comeback Stories**: Improved performance metrics YoY
- **Sector Leaders**: Top performers within specific sectors
- **Risk-Reward**: High volatility with high returns
- **Defensive Plays**: Low volatility, stable performance

**Market Themes:**
- Sector rotation opportunities
- Post-earnings momentum
- Seasonal patterns
- Market cap segments (small/mid/large cap)
- ESG leaders (requires additional data)

### Step 1.2: Define Selection Criteria

For each theme, establish 3-5 quantitative filters:

**Example - "Dividend Aristocrats":**
- Dividend yield > 3%
- Continuous dividend payout > 5 years
- Dividend growth YoY > 0%
- Payout ratio < 80% (sustainable)
- Market cap > $1B (stability)

**Example - "Growth Champions":**
- Revenue growth YoY > 15%
- Operating margin > 10%
- Earnings per share growth > 20%
- Price performance 1 year > 10%
- Sector: Technology, Consumer Cyclical, Healthcare

**Example - "Undervalued Cash Machines":**
- P/E ratio < 15
- Free cash flow margin > 10%
- Return on equity > 15%
- Price to book ratio < 2
- Debt to equity < 1

---

## Phase 2: Stock Selection & Data Analysis

### Step 2.1: Run Screening Script

Create a Python script to filter stocks based on your criteria.

**Script Template: `screen_stocks.py`**

```python
import pandas as pd
import numpy as np

# Load merged data
df = pd.read_csv('TSX_Merged_Data.csv')

print(f"Total stocks in dataset: {len(df)}")
print(f"\nAvailable sectors: {df['Sector'].value_counts()}")

# DEFINE YOUR THEME CRITERIA HERE
# Example: Dividend Aristocrats

criteria = {
    'dividend_yield': 3.0,
    'continuous_payout': 5,
    'payout_ratio_max': 80,
    'market_cap_min': 1_000_000_000
}

# Filter stocks
filtered = df[
    (df['Dividend yield %, Trailing 12 months'] >= criteria['dividend_yield']) &
    (df['Continuous dividend payout'] >= criteria['continuous_payout']) &
    (df['Dividend payout ratio %, Trailing 12 months'] <= criteria['payout_ratio_max']) &
    (df['Market capitalization'] >= criteria['market_cap_min'])
].copy()

# Remove rows with missing critical data
filtered = filtered.dropna(subset=[
    'Dividend yield %, Trailing 12 months',
    'Dividends per share growth %, Annual YoY'
])

# Sort by dividend yield
filtered = filtered.sort_values('Dividend yield %, Trailing 12 months', ascending=False)

print(f"\nStocks matching criteria: {len(filtered)}")
print("\nTop 10 candidates:")
print(filtered[['Symbol', 'Description', 'Dividend yield %, Trailing 12 months',
                'Continuous dividend payout', 'Sector']].head(10))

# Save filtered results
filtered.to_csv('filtered_stocks.csv', index=False)
print("\nFiltered stocks saved to 'filtered_stocks.csv'")
```

### Step 2.2: Narrow to Final Selection

- Review the filtered list (typically 10-30 stocks)
- Manually select 3-7 stocks for your thread based on:
  - Diversity (different sectors)
  - Name recognition (mix of well-known and hidden gems)
  - Story potential (interesting business models)
  - Data completeness (avoid too many NaN values)

### Step 2.3: Calculate Key Metrics

Add any derived metrics needed for your story:

```python
# Example: Calculate relative performance scores
filtered['Dividend_Score'] = (
    filtered['Dividend yield %, Trailing 12 months'].rank(pct=True) * 0.4 +
    filtered['Dividends per share growth %, Annual YoY'].rank(pct=True) * 0.3 +
    (100 - filtered['Dividend payout ratio %, Trailing 12 months']).rank(pct=True) * 0.3
)

# Example: Industry comparison
filtered['Industry_Avg_Yield'] = filtered.groupby('Sector')['Dividend yield %, Trailing 12 months'].transform('mean')
filtered['Yield_vs_Industry'] = filtered['Dividend yield %, Trailing 12 months'] - filtered['Industry_Avg_Yield']
```

---

## Phase 3: Visualization Creation

### Step 3.1: Choose Chart Types

**For Twitter, these chart types perform best:**

1. **Horizontal Bar Charts**: Rankings, comparisons (most engaging)
2. **Scatter Plots**: Risk/return, value discovery
3. **Line Charts**: Performance over time
4. **Small Multiples**: Comparing same metric across stocks
5. **Heatmaps**: Multiple metrics at once (use sparingly)

**Avoid**: 3D charts, pie charts with >5 slices, overly complex visualizations

### Step 3.2: Visualization Guidelines

**Twitter-Optimized Design:**
- Size: 1200x675px (16:9) or 1080x1080px (1:1)
- Font size: Minimum 14pt for labels, 18pt+ for titles
- High contrast colors
- Minimal text annotations
- White or light background (better visibility in light mode)
- Brand consistently (optional watermark)

**Color Palette Suggestions:**
- Use 3-5 colors maximum per chart
- Green for positive, red for negative (universal)
- Colorblind-friendly palettes (avoid red-green only distinctions)
- Consistent colors across all charts in a thread

### Step 3.3: Generate Visualizations

**Script Template: `create_visualizations.py`**

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6.75)
plt.rcParams['font.size'] = 12
plt.rcParams['axes.titlesize'] = 18
plt.rcParams['axes.labelsize'] = 14

# Load your filtered data
df = pd.read_csv('filtered_stocks.csv')

# Select your final stocks
stocks = ['RY', 'TD', 'ENB', 'BMO', 'BNS']  # Replace with your selection
analysis_df = df[df['Symbol'].isin(stocks)].copy()

# CHART 1: Dividend Yield Comparison (Horizontal Bar)
fig, ax = plt.subplots(figsize=(12, 6.75))
analysis_df = analysis_df.sort_values('Dividend yield %, Trailing 12 months')

colors = ['#2ecc71' if x > 4 else '#3498db' for x in analysis_df['Dividend yield %, Trailing 12 months']]

ax.barh(analysis_df['Symbol'], analysis_df['Dividend yield %, Trailing 12 months'], color=colors)
ax.set_xlabel('Dividend Yield (%)', fontsize=14)
ax.set_title('TSX Dividend Aristocrats: Current Yields', fontsize=18, weight='bold', pad=20)
ax.grid(axis='x', alpha=0.3)

# Add value labels
for i, (symbol, value) in enumerate(zip(analysis_df['Symbol'], analysis_df['Dividend yield %, Trailing 12 months'])):
    ax.text(value + 0.1, i, f'{value:.2f}%', va='center', fontsize=12)

plt.tight_layout()
plt.savefig('chart1_dividend_yield.png', dpi=150, bbox_inches='tight')
print("Chart 1 saved: chart1_dividend_yield.png")
plt.close()

# CHART 2: Yield vs Growth Scatter Plot
fig, ax = plt.subplots(figsize=(12, 6.75))

scatter = ax.scatter(
    analysis_df['Dividend yield %, Trailing 12 months'],
    analysis_df['Dividends per share growth %, Annual YoY'],
    s=analysis_df['Market capitalization'] / 1e9,  # Size by market cap
    alpha=0.6,
    c=range(len(analysis_df)),
    cmap='viridis'
)

# Add stock labels
for idx, row in analysis_df.iterrows():
    ax.annotate(
        row['Symbol'],
        (row['Dividend yield %, Trailing 12 months'],
         row['Dividends per share growth %, Annual YoY']),
        fontsize=11,
        weight='bold'
    )

ax.set_xlabel('Current Dividend Yield (%)', fontsize=14)
ax.set_ylabel('Dividend Growth YoY (%)', fontsize=14)
ax.set_title('Yield vs Growth: Finding the Sweet Spot', fontsize=18, weight='bold', pad=20)
ax.grid(alpha=0.3)

# Add quadrant lines
median_yield = analysis_df['Dividend yield %, Trailing 12 months'].median()
median_growth = analysis_df['Dividends per share growth %, Annual YoY'].median()
ax.axvline(median_yield, color='gray', linestyle='--', alpha=0.5)
ax.axhline(median_growth, color='gray', linestyle='--', alpha=0.5)

plt.tight_layout()
plt.savefig('chart2_yield_vs_growth.png', dpi=150, bbox_inches='tight')
print("Chart 2 saved: chart2_yield_vs_growth.png")
plt.close()

# CHART 3: Multi-metric Comparison (Small Multiples or Radar)
metrics = [
    'Dividend yield %, Trailing 12 months',
    'Return on equity %, Trailing 12 months',
    'Debt to equity ratio, Quarterly',
    'Price to earnings ratio'
]

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
axes = axes.flatten()

for idx, metric in enumerate(metrics):
    ax = axes[idx]
    data = analysis_df.sort_values(metric, ascending=False)

    ax.barh(data['Symbol'], data[metric], color='#3498db')
    ax.set_title(metric, fontsize=12, weight='bold')
    ax.grid(axis='x', alpha=0.3)

    # Add value labels
    for i, (symbol, value) in enumerate(zip(data['Symbol'], data[metric])):
        if pd.notna(value):
            ax.text(value, i, f'{value:.1f}', va='center', fontsize=10)

plt.suptitle('Comprehensive Comparison: Key Metrics', fontsize=18, weight='bold', y=0.995)
plt.tight_layout()
plt.savefig('chart3_multi_metric.png', dpi=150, bbox_inches='tight')
print("Chart 3 saved: chart3_multi_metric.png")
plt.close()

print("\nAll visualizations created successfully!")
```

### Step 3.4: Review & Refine Charts

- Check readability on mobile (75% of Twitter users)
- Ensure all text is legible
- Verify data accuracy
- Remove chart junk (unnecessary decorations)
- Add subtle branding if desired

---

## Phase 4: Narrative Development

### Step 4.1: Craft Your Hook (Tweet 1)

The first tweet must grab attention within 2 seconds.

**Formula: Surprising stat + Question/Bold claim**

**Examples:**

"Only 23 TSX stocks have paid dividends for 20+ years straight.

Here are the 5 that ALSO increased payouts every single year (with yields above 4%): 🧵"

"Most investors chase growth.

But these 4 Canadian stocks deliver 8%+ yields AND grew dividends by 10%+ annually.

The best part? They're trading below market P/E ratios: 🧵"

"$10,000 invested in the average TSX stock 5 years ago: $13,200

The same $10K in these dividend growers? $18,700

What makes them different: 🧵"

### Step 4.2: Structure Your Thread

**Classic 10-Tweet Thread Structure:**

1. **Hook** - Attention-grabbing opener
2. **Context** - Why this matters now
3. **Methodology** - Brief explanation of selection criteria
4. **Visual 1** - Overview/comparison chart
5. **Insight 1** - Key finding from the data
6. **Visual 2** - Detailed analysis
7. **Insight 2** - Deeper dive or contrarian take
8. **Visual 3** - Forward-looking or risk analysis
9. **Actionable takeaway** - What investors should consider
10. **CTA** - Call to action (follow, share, discuss)

### Step 4.3: Writing Guidelines

**DO:**
- Use short sentences (12-15 words max)
- Lead with numbers and specifics
- Use analogies for complex concepts
- Ask rhetorical questions
- Include 1-2 emojis per tweet (not excessive)
- Break up text with line breaks
- Bold key metrics (using Unicode or caps)

**DON'T:**
- Give financial advice ("you should buy...")
- Use jargon without explanation
- Make predictions about stock prices
- Cherry-pick misleading data
- Copy-paste data tables as text

**Tone:**
- Educational, not promotional
- Confident, not arrogant
- Data-driven, not speculative
- Accessible, not dumbed-down

### Step 4.4: Insight Development

Transform data into insights by asking:

1. **What's surprising?** - Data that defies expectations
2. **What's the pattern?** - Trends across stocks
3. **What's the outlier?** - Stocks that break the pattern (why?)
4. **What's the trade-off?** - No free lunch in investing
5. **What's overlooked?** - Hidden in the data
6. **What's the risk?** - Balanced perspective

**Example Insights:**

"RY and TD dominate by market cap, but ENB delivers higher yield with better dividend growth.

The trade-off? Energy sector volatility vs banking stability."

"All 5 stocks have payout ratios below 70%.

This means they're returning cash to shareholders while STILL retaining 30%+ for growth and safety."

"Interesting: The two best performers (1-year) have the LOWEST dividend yields.

Proof that total return ≠ just dividends. Capital appreciation matters."

---

## Phase 5: Twitter Thread Formatting

### Step 5.1: Prepare Tweet Content

Create a document with your thread:

**Format:**
```
[1/10]
Hook tweet text here...

---

[2/10]
Context tweet text...

---

[3/10]
Methodology tweet...
Selection criteria:
• Criterion 1
• Criterion 2
• Criterion 3

---

[4/10]
[IMAGE: chart1_dividend_yield.png]
Caption for chart...

---

[etc.]
```

### Step 5.2: Image Integration

**Best practices:**
- Place image FIRST in tweet (better preview)
- Add 1-2 sentence caption below
- Use alt text for accessibility
- Preview on mobile before posting

**Alt Text Template:**
"Bar chart showing dividend yields for 5 TSX stocks, ranging from 3.2% to 5.8%, with [SYMBOL] having the highest yield."

### Step 5.3: Hashtag & Mention Strategy

**Use 1-3 relevant hashtags:**
- #TSX #CanadianStocks #DividendInvesting
- #ValueInvesting #StockAnalysis
- #FinancialMarkets #Investing

**Place hashtags:**
- At the end of tweets (not mid-sentence)
- In final tweet or tweet 2 (not the hook)

**Mentions:**
- Tag stocks sparingly ($RY, $TD) - some platforms, not all
- Don't tag random influencers hoping for RTs

### Step 5.4: Timing & Posting

**Best times to post (EST):**
- Weekdays: 8-10 AM, 12-1 PM, 5-6 PM
- Avoid: Late evenings, weekends (lower engagement)
- Financial content: Before market open (7-9 AM)

**Posting cadence:**
- Post thread tweets 30-60 seconds apart
- Don't rush (algorithm may flag as spam)
- Use Twitter thread feature or reply to yourself

---

## Phase 6: Review Checklist

Before posting, verify:

**Data Accuracy:**
- [ ] All numbers match source data
- [ ] Calculations are correct
- [ ] Stock symbols are accurate
- [ ] No misleading comparisons

**Clarity:**
- [ ] Thread tells a cohesive story
- [ ] Charts are readable on mobile
- [ ] No jargon without explanation
- [ ] Insights are clear and specific

**Compliance:**
- [ ] No "buy/sell" recommendations
- [ ] Disclosure of any positions (if applicable)
- [ ] Balanced perspective (acknowledge risks)
- [ ] Source attribution for data

**Engagement:**
- [ ] Hook is compelling
- [ ] CTA is clear
- [ ] Hashtags are relevant
- [ ] Alt text added to images

---

## Complete Workflow Example

### Theme: "Canadian Dividend Aristocrats: Yield + Growth"

**Phase 1: Theme Selection**
- Angle: Dividend stocks that grow payouts consistently
- Target: Income investors, retirees, conservative growth

**Phase 2: Stock Selection**
- Criteria: Yield >3%, 10+ years payout, growth >5% YoY
- Screened: 47 stocks matched
- Selected: 5 stocks (RY, TD, ENB, BMO, BCE)

**Phase 3: Visualizations**
- Chart 1: Dividend yield comparison (bar chart)
- Chart 2: Yield vs growth scatter plot
- Chart 3: Total return performance (line chart)

**Phase 4: Narrative**
- Hook: "Only 5 TSX stocks combine 5%+ yields with 10-year dividend growth streaks"
- Story: Show how consistent compounding beats chasing yield alone
- Insight: Trade-offs between sectors (banks vs utilities vs telecom)

**Phase 5: Thread**
- 12 tweets total
- 3 images embedded
- Posted Tuesday 8:30 AM EST
- Hashtags: #TSX #DividendInvesting #CanadianStocks

---

## Script Repository Summary

Keep these scripts in your workflow folder:

1. **`screen_stocks.py`** - Filter stocks by theme criteria
2. **`create_visualizations.py`** - Generate charts
3. **`quick_stats.py`** - Calculate summary statistics
4. **`sector_analysis.py`** - Compare across sectors
5. **`performance_analysis.py`** - Time-series performance

---

## Tips for Consistency & Growth

**Build a Theme Library:**
- Document successful themes with engagement metrics
- Maintain a backlog of 10-15 theme ideas
- Revisit top themes quarterly with updated data

**Engagement Tracking:**
- Note which charts get the most engagement
- Track what hooks drive the most impressions
- A/B test different narrative structures

**Time Management:**
- Theme selection: 10 min
- Data analysis: 20-30 min
- Visualization: 15-20 min
- Writing: 20-30 min
- Review & post: 10 min
- **Total: 75-100 min per thread**

**Continuous Improvement:**
- Study top financial Twitter accounts
- Experiment with new chart types
- Refine your unique voice
- Build recurring series ("Monday Market Movers", "Dividend Deep-Dive Fridays")

---

## Additional Resources

**Python Libraries:**
- `pandas` - Data manipulation
- `matplotlib` - Basic charts
- `seaborn` - Statistical visualizations
- `plotly` - Interactive charts (export as static images)

**Design Tools (Optional):**
- Canva - Chart templates and final polish
- Figma - Custom chart design
- Adobe Express - Quick edits

**Inspiration:**
- @charliebilello (market data visualizations)
- @GameofTrades_ (thematic stock analysis)
- @BrianFeroldi (educational financial threads)

---

## Quick Reference: Theme Ideas

**Fundamental Themes:**
1. Dividend aristocrats by yield
2. Growth stocks by revenue acceleration
3. Value plays by P/E ratio
4. Free cash flow generators
5. Return on equity champions
6. Debt-free balance sheets
7. Margin expansion stories
8. Sector rotation opportunities
9. Small-cap hidden gems
10. Large-cap stability plays

**Performance Themes:**
11. YTD top performers
12. 5-year compounders
13. Comeback stocks (turnaround)
14. Consistent performers (low volatility, steady gains)
15. Momentum plays (3-month surge)

**Comparative Themes:**
16. Banks vs Credit Unions
17. Canadian vs US sector peers
18. Large vs small cap in same sector
19. High P/E vs Low P/E performers
20. Growth vs Value showdown

---

**End of SOP**

*Version 1.0 | Last Updated: February 2026*
