# Thread Format Decision Guide

Use this guide to quickly decide which thread format to use for your analysis.

---

## Quick Decision Tree

```
How many stocks are you analyzing?

├─ 1 stock → USE INDIVIDUAL FORMAT
│  ├─ Goal: Tell complete company story
│  ├─ Length: 12-18 tweets
│  ├─ Charts: 5-7 (detailed)
│  └─ Template: thread_format_individual.md
│
└─ 2+ stocks → USE GROUP FORMAT
   ├─ Goal: Pattern recognition & comparison
   ├─ Length: 8-12 tweets
   ├─ Charts: 3-4 (comparative)
   └─ Template: thread_format_group.md
```

---

## Format Comparison Matrix

| **Factor** | **Individual Format** | **Group Format** |
|------------|----------------------|------------------|
| **Stock Count** | 1 only | 2-20+ |
| **Thread Length** | 12-18 tweets | 8-12 tweets |
| **Charts Needed** | 5-7 visualizations | 3-4 visualizations |
| **Depth per Stock** | Complete analysis | 2-3 key facts each |
| **Research Time** | 2-3 hours | 1-1.5 hours |
| **Hook Focus** | Company surprise | Theme/pattern |
| **Narrative Arc** | Business story | Comparative ranking |
| **Risk Section** | Company-specific (detailed) | Category-wide (brief) |
| **CTA Question** | "What's your take on [Company]?" | "Which would you pick?" |
| **Best For** | Controversial stocks, earnings analysis | Sector reviews, thematic screens |
| **Engagement** | Moderate (niche audience) | High (broader appeal) |

---

## When to Use INDIVIDUAL Format

### ✅ Use Individual Format When:

1. **Deep dive requested**: "Tell me everything about RY"
2. **Controversial name**: Stock with strong opinions (banks, energy, cannabis)
3. **Earnings catalyst**: Recent earnings, guidance change, scandal
4. **Turnaround story**: Company recovering from crisis
5. **Hidden gem**: Lesser-known stock you're championing
6. **Unique business model**: Company that needs explanation
7. **Management change**: New CEO, strategic shift
8. **M&A activity**: Acquisition target or acquirer
9. **Comparing to US equivalent**: "Is [Canadian stock] the next [US stock]?"
10. **Building series**: "Deep Dive Fridays" - weekly individual analysis

### 📊 Content Focus for Individual:
- Business model explanation
- Competitive moats analysis
- Management quality
- Capital allocation history
- Segment performance
- Historical context (how they got here)
- Catalyst pipeline
- Risk assessment (detailed)
- Peer comparison (2-3 competitors)

### 🎯 Example Individual Themes:
- "Royal Bank Deep Dive: Canada's Dividend King"
- "Why TD Bank Just Became Interesting"
- "Shopify: Still a Buy at $80?"
- "The Case for Enbridge (Despite Energy Transition)"
- "Brookfield: The Compounding Machine"

---

## When to Use GROUP Format

### ✅ Use Group Format When:

1. **Thematic screen**: Stocks sharing common trait (high yield, growth, value)
2. **Sector overview**: "Top 5 Canadian Banks" or "TSX Energy Leaders"
3. **Ranking request**: "Best dividend stocks" or "Fastest growers"
4. **Diversification strategy**: Building a mini-portfolio
5. **Peer comparison**: All competitors in one industry
6. **Market scan**: "10 stocks under $10 with 20% growth"
7. **Quadrant analysis**: Risk vs reward, yield vs growth
8. **Educational framework**: Teaching screening methodology
9. **Time-efficient**: Need to cover more ground faster
10. **Building series**: "Monday Market Movers" - weekly themes

### 📊 Content Focus for Group:
- Selection criteria (methodology)
- Relative rankings
- Pattern recognition
- Outlier identification
- Trade-off analysis (can't have it all)
- Sector/industry trends
- Diversification considerations
- Framework development
- Who each stock is best for

### 🎯 Example Group Themes:
- "5 TSX Dividend Aristocrats Ranked"
- "Canadian Banks: Which Is Best?"
- "High Growth Small Caps: Top 7"
- "Yield vs Growth: 5 Stocks, Different Strategies"
- "Defensive Plays for Volatile Markets"

---

## Hybrid Approach: Series Strategy

### Create a SERIES that alternates formats:

**Week 1**: Group thread - "Top 5 Canadian Banks Ranked"
**Week 2**: Individual thread - "Royal Bank Deep Dive" (winner from Week 1)
**Week 3**: Individual thread - "TD Bank: The Growth Story" (#2 from Week 1)
**Week 4**: Group thread - "Canadian vs US Banks: Head to Head"

**Benefits:**
- Builds on previous content
- Keeps audience engaged across different styles
- Deep AND broad coverage
- Easier to generate ideas (one theme → multiple threads)

---

## Script & Template Selection

### For INDIVIDUAL Analysis:

**Scripts to use:**
1. `screen_stocks.py` - Find candidates (optional, if exploring)
2. `quick_stats.py` - Deep stats on the 1 stock
3. Custom visualization script (create time-series charts)

**Template:**
- `thread_format_individual.md`

**Charts to create:**
- Historical stock price (10 years)
- Dividend growth over time
- Segment revenue mix
- Profitability metrics over time
- Valuation bands (P/E range)
- Peer comparison on key metrics
- Risk/opportunity matrix

---

### For GROUP Analysis:

**Scripts to use:**
1. `screen_stocks.py` - Filter by criteria
2. `quick_stats.py` - Summary stats for the group
3. `create_visualizations.py` - Comparative charts (standard)
4. `create_visualizations_extended.py` - For 8+ stocks

**Template:**
- `thread_format_group.md`

**Charts to create:**
- Horizontal bar ranking (primary metric)
- Scatter plot (two metrics)
- Grouped bar comparison (3-4 metrics)
- Optional: Tiered view or sector breakdown

---

## Engagement Predictions

### Individual Format Engagement:

**Higher engagement if:**
- Stock is controversial (banks, energy, telecom)
- Tied to recent news (earnings, scandal, M&A)
- You take a contrarian stance
- Company is well-known (RY, TD, SHOP, CP)

**Lower engagement if:**
- Obscure small cap (limited audience)
- Stable, boring company (no controversy)
- No news catalyst
- Overly technical analysis

**Typical metrics:**
- Impressions: 5K-20K (depends on following)
- Engagement rate: 1-3%
- Best performers: Replies asking for other stock analyses

---

### Group Format Engagement:

**Higher engagement if:**
- Clear ranking (people love lists)
- Includes well-known names
- Actionable framework included
- Poll or question embedded
- Timely theme (dividend season, tax loss selling)

**Lower engagement if:**
- Too many stocks (>10 = overwhelming)
- Obscure theme
- Only large caps (less discovery value)
- No clear winner/loser

**Typical metrics:**
- Impressions: 10K-50K (broader appeal)
- Engagement rate: 2-5%
- Best performers: "Which would you pick?" questions

---

## Content Calendar Strategy

### Month 1: Build Foundation

**Week 1**: Group - "Top 5 Dividend Stocks" (broad appeal)
**Week 2**: Individual - Deep dive on #1 from Week 1
**Week 3**: Group - "5 Growth Stocks" (different audience)
**Week 4**: Individual - Deep dive on controversial pick

### Month 2: Develop Themes

**Week 1**: Group - "Banks vs Utilities: Yield Comparison"
**Week 2**: Individual - Winning bank from Week 1
**Week 3**: Group - "Small Cap Hidden Gems"
**Week 4**: Individual - Most interesting small cap

### Month 3: Engage Community

**Week 1**: Poll thread - Let followers choose which stock to analyze
**Week 2**: Individual - Winner of poll (guaranteed engagement)
**Week 3**: Group - Follower requests compiled
**Week 4**: Year-end / quarterly roundup

---

## Quick Reference: Choose Your Format

| **If you want to...** | **Use this format** |
|------------------------|---------------------|
| Explain why one company is special | Individual |
| Rank best stocks in a category | Group |
| Analyze earnings report | Individual |
| Build a mini-portfolio | Group |
| Debate a controversial stock | Individual |
| Teach a screening methodology | Group |
| Tell a business story | Individual |
| Show relative value | Group |
| Analyze competitive moat | Individual |
| Compare risk/reward profiles | Group |

---

## Pro Tips

### For Individual Threads:
1. **Pick stocks with story potential** (not just good numbers)
2. **Time to news** (earnings, guidance, M&A)
3. **Include 3-5 peer comparisons** (context matters)
4. **Show historical context** (how did they get here?)
5. **Address the bear case** (build credibility)

### For Group Threads:
1. **Limit to 3-7 stocks** for optimal readability
2. **Make criteria crystal clear** (replicable)
3. **Highlight the outlier** (most interesting)
4. **Include a framework** (educational value)
5. **Ask engaging questions** (drive replies)

---

## Examples in the Wild

### Great Individual Threads:
- @BrianFeroldi's stock deep dives (storytelling)
- @TrungTPhan's company breakdowns (business models)
- @borrowed_ideas' thesis threads (contrarian takes)

### Great Group Threads:
- @charliebilello's market data rankings
- @GameofTrades_' sector comparisons
- @MikeZaccardi's dividend stock screens

---

## Decision Template

Before you start, ask yourself:

**1. What's my goal?**
- [ ] Explain one company thoroughly → Individual
- [ ] Compare multiple options → Group

**2. What's my angle?**
- [ ] Business story & competitive position → Individual
- [ ] Pattern recognition & relative value → Group

**3. How much time do I have?**
- [ ] 2-3 hours for deep research → Individual
- [ ] 1-1.5 hours for screen + analysis → Group

**4. What's my CTA?**
- [ ] "What's your take on [Company]?" → Individual
- [ ] "Which would you pick?" → Group

---

**Use this guide every time you start a new analysis to choose the right format!**
