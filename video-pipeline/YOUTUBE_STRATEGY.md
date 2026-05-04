# YouTube Video Strategy for LatestMortgageRates.ca

## Content Pillars

### 1. Rate Updates (High Frequency)
- **"Rate of the Day"** — Daily 15-30 sec Shorts
- **"Weekly Rate Wrap"** — Weekly 60-90 sec long-form
- **"Rate Alert"** — When rates drop significantly

### 2. City Spotlights (Local SEO)
- **"Toronto Mortgage Rates"** — City-specific 30-45 sec Shorts
- **"Vancouver vs Calgary"** — Comparison 60 sec Shorts

### 3. Educational (Evergreen)
- **"Did You Know?"** — Quick mortgage facts 15-30 sec
- **"Mortgage Myths"** — Busting misconceptions 30-45 sec
- **"Stress Test Explained"** — 60-90 sec explainers

---

## YouTube Shorts Best Practices

### Technical Specs
- **Aspect ratio**: 9:16 (1080x1920)
- **Duration**: 15-60 seconds (optimal: 15-30)
- **Frame rate**: 30fps
- **Safe zones**: Keep text within 1080x1420 (top/bottom 250px for UI)

### Engagement Formula (Every Video)

```
0:00-0:03  HOOK   — Pattern interrupt, bold claim, question
0:03-0:08  VALUE  — Deliver the key info FAST
0:08-0:12  PROOF  — Numbers, comparison, visual
0:12-0:15  CTA    — What to do next
```

### Hook Types That Work
1. **The Shocker**: "Mortgage rates just hit a 2-year LOW"
2. **The Question**: "Should you lock in your rate TODAY?"
3. **The Challenge**: "Stop overpaying on your mortgage"
4. **The Number**: "Save $47,000 with this one move"
5. **The Fear**: "The Bank of Canada just signaled..."

### Visual Rules
- **Change something every 2-3 seconds** — cut, zoom, animation, new element
- **Big bold text** — minimum 72px, high contrast
- **Motion on everything** — nothing static for more than 2 sec
- **Brand colors** — consistent palette (blue/emerald/gold from site)
- **Logo watermark** — bottom corner throughout

### Caption Style
- **Bouncy captions** — sync with TTS narration
- **Word-by-word highlight** — karaoke style for key phrases
- **Emoji accents** — 📉 for drops, 🔥 for hot deals
- **No small text** — if it can't be read on a phone, it's too small

---

## Long-Form Best Practices (60-90 sec)

### Structure
```
0:00-0:05   HOOK      — Bold statement + visual punch
0:05-0:15   CONTEXT   — What's happening in the market
0:15-0:45   CONTENT   — The actual rates/data (main value)
0:45-0:75   INSIGHT   — Analysis/what it means for you
0:75-0:90  CTA       — Visit site, subscribe, comment
```

### Engagement Tactics
- **Lower third** — Channel name/subscribe button (0:03-0:08)
- **Progress bar** — Top of screen showing video progress
- **Like/subscribe animations** — Burst effects at CTA moments
- **Comment prompt** — "Drop your city below 👇"
- **End screen** — 5 sec with subscribe button + related video

---

## Channel Branding

### Visual Identity
- **Primary**: Deep blue (#1e3a5f) — trust, finance
- **Accent**: Emerald (#34d399) — growth, savings
- **Highlight**: Gold (#fbbf24) — calls to action
- **Background**: Dark slate (#0f172a) — premium feel
- **Font**: Inter (bold, clean, readable at small sizes)

### Audio
- **Background music**: Upbeat, modern, non-intrusive
- **TTS voice**: Professional female (af_nova) or male (am_michael)
- **Sound effects**: Subtle whoosh on transitions, ping on numbers

---

## Publishing Strategy

### Frequency
- **Shorts**: 1-2 per day (rate of the day + educational)
- **Long-form**: 1-2 per week (weekly wrap + deep dives)

### Best Times (EST)
- **Shorts**: 7-9 AM, 12-1 PM, 5-7 PM
- **Long-form**: 2-4 PM, 7-9 PM

### Titles & Thumbnails
- **Titles**: Numbers + urgency + benefit
  - "5-Year Fixed Drops to 3.89% — What This Means for You"
  - "Don't Renew Your Mortgage Before Watching This"
  - "Toronto vs Vancouver: Who Has Better Rates?"
- **Thumbnails**: Bold text, face (if using avatar), bright colors, arrows

### Hashtags
- #mortgagerates #canadamortgage #realestate #firsttimehomebuyer
- #mortgagetips #homeloans #canadianrealestate #mortgagebroker

---

## Automation Plan

### Daily Shorts
1. Scraper updates rates.json (6 AM/PM)
2. `generate-rate-of-day.js` creates HTML composition
3. HyperFrames renders to MP4
4. Upload via YouTube API with auto-generated title/description

### Weekly Long-Form
1. Aggregate week's rate changes
2. `generate-weekly-update.js` creates 90-sec video
3. Render + upload every Sunday

### Content Calendar
| Day | Content |
|-----|---------|
| Mon | Rate of the Day (Short) |
| Tue | Did You Know? (Short) |
| Wed | Rate of the Day (Short) |
| Thu | City Spotlight (Short) |
| Fri | Rate of the Day (Short) |
| Sat | Rate Alert (if significant change) |
| Sun | Weekly Rate Wrap (Long) |
