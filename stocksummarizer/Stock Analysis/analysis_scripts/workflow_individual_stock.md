# Complete Workflow: Individual Stock Analysis

End-to-end process for creating a Twitter thread about ONE stock.

---

## Overview

**Total Time**: 3-4 hours (first time) → 2-2.5 hours (once familiar)
**Output**: 12-18 tweet thread with 5-7 charts
**Format**: Individual deep dive

---

## PHASE 1: Stock Selection (10 min)

### Step 1.1: Choose Your Stock

**Selection criteria:**
- [ ] Personal interest or knowledge in the company
- [ ] Recent news catalyst (earnings, M&A, controversy)
- [ ] Sufficient data available in TSX_Merged_Data.csv
- [ ] Controversial enough to drive engagement
- [ ] NOT just "good fundamentals" (needs a story angle)

**Quick validation:**
```bash
cd "/sessions/gallant-great-fermat/mnt/Stock Analysis"
# Check if stock exists and has data
grep "^RY," TSX_Merged_Data.csv
```

---

## PHASE 2: Web Research (50 min) ⭐ NEW

### Step 2.1: Set Up Research Document

Open and save a copy of the template:
- Template: `stock_research_template.md`
- Save as: `research_[SYMBOL]_[DATE].md`

Example: `research_RY_2026-02-07.md`

---

### Step 2.2: Run Web Searches

**Search queries to run** (in order):

1️⃣ **Recent news**
```
Search: "RY Royal Bank news 2026"
Filter: News tab, Past 3 months
```

2️⃣ **Latest earnings**
```
Search: "Royal Bank earnings Q4 2025"
Look for: Earnings beat/miss, guidance, key quotes
```

3️⃣ **Analyst sentiment**
```
Search: "Royal Bank analyst rating 2026"
Look for: Consensus, recent upgrades/downgrades, price targets
```

4️⃣ **Strategic updates**
```
Search: "Royal Bank strategy 2026"
Look for: M&A, new products, geographic expansion, partnerships
```

5️⃣ **Industry trends**
```
Search: "Canadian banking industry trends 2026"
Look for: Regulatory changes, competitive dynamics, macro trends
```

6️⃣ **Specific risks**
```
Search: "Royal Bank risks concerns 2026"
Look for: Analyst concerns, regulatory issues, lawsuit, controversies
```

---

### Step 2.3: Complete Research Template

**Fill out each section:**
- Part 1: Quick data review (5 min)
- Part 2: Search results summary (15 min)
- Part 3: Bear case - 4-6 risks (10 min)
- Part 4: Bull case - 4-6 opportunities (10 min)
- Part 5: Your balanced view (5 min)
- Part 6: Hook ideas (5 min)

**💡 Pro tip**: Use split-screen - browser on one side, research template on the other

---

### Step 2.4: Synthesize Your Angle

After research, you should be able to answer:
- ✓ What's my unique investment thesis?
- ✓ What's the market missing about this stock?
- ✓ What's the key debate (bulls vs bears)?
- ✓ Who is this stock right for (and who should avoid it)?

**Example angles:**
- "Market overreacting to housing risk, missing wealth management transformation"
- "Dividend is safe and growing, but capital appreciation limited"
- "Turnaround story gaining momentum, but still early"

---

## PHASE 3: Data Analysis (30 min)

### Step 3.1: Generate Quick Stats

Edit the stock symbol in the script:
```bash
cd analysis_scripts
nano quick_stats.py  # Change SELECTED_STOCKS = ['RY']
python quick_stats.py > stats_output_RY.txt
```

**Review output for:**
- Interesting facts (highest/lowest metrics)
- How stock compares to TSX average
- Valuation context
- Quality indicators

**Mark 5-7 stats** that support your thesis or surprise you

---

### Step 3.2: Identify Chart Needs

Based on your research and thesis, decide which charts to create:

**Essential charts (pick 3):**
- [ ] Historical performance (price + dividends over 10 years)
- [ ] Quality metrics vs peers (ROE, margins, etc.)
- [ ] Dividend analysis (yield, payout ratio, growth)
- [ ] Valuation context (P/E vs historical range)
- [ ] Segment breakdown (revenue mix)

**Optional charts (pick 2):**
- [ ] Profitability trend (margins over time)
- [ ] Market share evolution
- [ ] Balance sheet strength
- [ ] Geographic mix

---

## PHASE 4: Visualization Creation (30 min)

### Step 4.1: Create Custom Charts

**Option A**: Modify existing script
```bash
nano create_visualizations.py
# Change SELECTED_STOCKS = ['RY']
# Customize metrics for charts 1-3
python create_visualizations.py
```

**Option B**: Write custom chart code for individual analysis

Since you're analyzing ONE stock, you'll want different chart types than group comparisons:

```python
# Example: 10-year stock price + dividend growth
import pandas as pd
import matplotlib.pyplot as plt

# Load historical data (you may need to supplement TSX_Merged_Data.csv
# with historical prices from Yahoo Finance or similar)

# Create line chart showing:
# - Stock price (left axis)
# - Dividend per share (right axis)
# - Highlight recession periods

# Save as: chart1_historical_performance.png
```

**Key principle**: Charts should tell YOUR story, not generic comparisons

---

### Step 4.2: Chart Checklist

For each chart, verify:
- [ ] Title clearly states what it shows
- [ ] Readable on mobile (test by viewing on phone)
- [ ] Labels and legends are clear
- [ ] Data source noted (if not obvious)
- [ ] Supports a specific point in your thread
- [ ] 1200x675px or 1080x1080px (Twitter-optimized)

---

## PHASE 5: Thread Writing (60 min)

### Step 5.1: Follow Individual Template

Open: `thread_format_individual.md`

**Structure:**
- Tweet 1: Hook (use one from your research)
- Tweet 2: Company overview
- Tweet 3: Your thesis (from research Part 5)
- Tweets 4-11: Visuals + insights (data + research)
- Tweet 12: Risk assessment (from research Part 3 - Bear Case)
- Tweet 13: Catalysts (from research Part 4 - Bull Case)
- Tweet 14: Peer comparison
- Tweet 15: Verdict + CTA

---

### Step 5.2: Integrate Research into Thread

**Where to use your research:**

| Tweet # | Research Source | What to Include |
|---------|----------------|-----------------|
| 3 | Part 5 (Investment Angle) | Your unique thesis |
| 5, 7, 9, 11 | Parts 2 & 4 (Bull Case) | Opportunities, catalysts, positive data |
| 12 | Part 3 (Bear Case) | Specific risks with evidence |
| 13 | Part 4 (Bull Case) | Upcoming catalysts, potential re-rating |
| 15 | Part 5 (Balanced View) | Who this stock is for |

**Key principle**: Every claim should be supported by either:
- Your TSX data (charts, stats)
- Recent news/earnings (web research)
- Analyst consensus
- Company disclosures

---

### Step 5.3: Add Source Attribution

**When to cite sources in tweets:**
- Specific claims ("CEO said X" → cite earnings call)
- Controversial statements ("analysts are wrong about..." → cite consensus)
- Data not from your charts (housing prices, industry data)
- Direct quotes from company

**How to cite** (keep it brief for Twitter):
- "Source: Q4 2025 earnings call"
- "Per Bank of Canada data"
- "Globe & Mail, Jan 2026"
- "Company investor presentation"

---

### Step 5.4: Review Checklist

Before finalizing:
- [ ] Thread tells a coherent story (not just scattered facts)
- [ ] Hook is attention-grabbing
- [ ] Thesis is clear by tweet 3
- [ ] Every chart has a caption explaining the insight
- [ ] Risks are acknowledged (shows balance)
- [ ] Opportunities are specific (not vague "growth potential")
- [ ] No "buy/sell" language (frame as "for investors seeking...")
- [ ] All tweets under 280 characters
- [ ] 3-5 hashtags included (not in hook tweet)
- [ ] CTA asks engaging question

---

## PHASE 6: Final Polish & Post (20 min)

### Step 6.1: Mobile Preview Test

- Email thread draft to yourself
- View on mobile phone
- Check chart readability
- Verify formatting

---

### Step 6.2: Fact-Check Pass

**Verify:**
- [ ] All numbers match source data
- [ ] Dates are correct (earnings dates, news dates)
- [ ] Stock symbols accurate
- [ ] Company name spelled correctly
- [ ] No math errors in calculations
- [ ] Percentages/currency formatted consistently

---

### Step 6.3: Add Alt Text to Images

For each chart, write descriptive alt text:

**Template**: "[Chart type] showing [what it displays], with [key finding]"

**Examples:**
- "Line chart showing Royal Bank stock price 2014-2024, demonstrating 82% gain plus 42.50 per share in dividends"
- "Bar chart comparing ROE of Big 5 Canadian banks, with RY ranking 2nd at 13.8%"
- "Scatter plot of dividend yield vs growth rate, with RY positioned in moderate yield, high growth quadrant"

---

### Step 6.4: Post Strategy

**Timing:**
- Best: Monday-Friday, 8-10 AM EST
- Avoid: Market hours (people busy), evenings, weekends

**Posting:**
1. Post tweet 1 (hook)
2. Wait 30-60 seconds
3. Post tweet 2 as reply
4. Continue threading (30-60 sec between tweets)
5. Pin thread to profile for 24 hours

**First 30 minutes:**
- Monitor for replies
- Reply to first 3-5 comments
- Engage thoughtfully
- Thank people for thoughtful additions

---

## PHASE 7: Performance Tracking (Post-Thread)

### Track These Metrics:

**Engagement:**
- Total impressions
- Engagement rate (likes + RTs + replies / impressions)
- Best-performing tweet (which got most likes?)
- Best-performing chart (which visual drove most engagement?)

**Feedback:**
- Common questions asked
- Disagreements/pushback
- Requests ("do [X stock] next!")

**Learning:**
- What worked (hook style, chart type, narrative structure)
- What didn't (confusing section, too technical, too long)
- Ideas for next thread

---

## Time Breakdown

| Phase | Task | Time (First) | Time (Experienced) |
|-------|------|-------------|-------------------|
| 1 | Stock selection | 10 min | 5 min |
| 2 | Web research | 50 min | 30 min |
| 3 | Data analysis | 30 min | 15 min |
| 4 | Visualization | 30 min | 20 min |
| 5 | Thread writing | 60 min | 40 min |
| 6 | Polish & post | 20 min | 15 min |
| **TOTAL** | | **3h 20min** | **2h 5min** |

---

## Workflow Optimization Tips

**Batch similar tasks:**
- Do all web searches in one session
- Create all charts in one session
- Write all tweet copy in one session

**Build templates:**
- Save search query templates for each stock type
- Create chart templates you can reuse
- Keep a "snippets" file of transitions and CTAs

**Learn from each thread:**
- Note what got engagement
- Save successful hooks/formats
- Build a "greatest hits" swipe file

---

## Troubleshooting

**"I can't find recent news"**
→ Try variations: "[Symbol] news", "[Company] news", "[Company] [Industry] news"
→ Check investor relations directly
→ Use analyst reports if accessible

**"Charts aren't telling a story"**
→ Revisit your thesis - what do you need to prove?
→ Custom-create charts that match your narrative
→ Don't force generic charts if they don't support your angle

**"Research contradicts my initial view"**
→ GOOD! Update your thesis
→ Steel-man the opposing view
→ Your thread will be stronger for acknowledging complexity

**"Thread feels too long"**
→ Cut tweets that don't advance the story
→ Combine similar insights
→ Save some content for follow-up tweets later

**"Not sure about my thesis"**
→ That's what Phase 2 research is for
→ Don't write the thread until your angle is clear
→ It's okay to change stocks if research doesn't yield interesting story

---

## Files Created During Workflow

By the end, you'll have:
- `research_[SYMBOL]_[DATE].md` - Your research notes
- `stats_output_[SYMBOL].txt` - Quick stats
- `chart1_[name].png` through `chart5_[name].png` - Visualizations
- `thread_[SYMBOL]_[DATE].md` - Final thread copy
- Performance notes for future reference

**Tip**: Keep these organized by stock symbol for future updates

---

## Example: Complete RY Analysis

**Phase 1** (10 min): Selected Royal Bank (RY) due to recent earnings beat

**Phase 2** (50 min):
- Searched recent news, found wealth management growth story
- Identified bear case: housing market exposure
- Identified bull case: margin expansion from wealth mix shift
- Angle: "Market missing wealth transformation, overly focused on housing"

**Phase 3** (30 min):
- Generated quick stats: ROE 13.8%, Div yield 3.9%, Payout 48%
- Noted: Operating efficiency best among Big 5 banks

**Phase 4** (30 min):
- Chart 1: 10-year price + dividend growth
- Chart 2: Segment revenue mix (showing wealth growth)
- Chart 3: ROE vs Big 5 peers
- Chart 4: Valuation (P/E vs 5-year range)
- Chart 5: Payout ratio over time (sustainability)

**Phase 5** (60 min):
- Wrote 15-tweet thread using individual format
- Hook: "Royal Bank just reported 18% YoY wealth management growth. Most investors missed it. Here's why it matters: 🧵"
- Integrated all research findings
- Added risk section (housing) and catalyst section (wealth M&A)

**Phase 6** (20 min):
- Mobile tested all charts
- Added alt text
- Posted Tuesday 8:45 AM EST
- Engaged with first replies

**Result**: 15.2K impressions, 3.1% engagement rate, 12 requests for other bank analyses

---

**Use this workflow for every individual stock thread!**
