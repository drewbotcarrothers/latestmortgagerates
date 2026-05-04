# Video Pipeline for LatestMortgageRates.ca

## Overview

Automated YouTube video generation using [HyperFrames](https://hyperframes.heygen.com/) — a programmatic video framework that renders HTML/GSAP compositions to MP4.

## Architecture

```
video-pipeline/
├── README.md                 # This file
├── docs/
│   ├── hyperframes-docs-index.md  # HyperFrames documentation summary
│   ├── prompting-guide.md      # How to prompt AI agents for video creation
│   ├── rendering-guide.md      # Render options and quality settings
│   └── html-schema-reference.md # Complete HTML composition reference
├── scripts/
│   ├── generate-daily-rate-short.js  # 15-30 sec Shorts (best rates)
│   ├── generate-weekly-update.js     # 60-90 sec long-form (weekly recap)
│   ├── generate-city-spotlight.js    # 30-45 sec city-specific rates
│   ├── generate-lender-review.js     # 60-90 sec lender spotlight
│   └── upload-youtube.js             # YouTube API upload + metadata
├── templates/
│   ├── shared/
│   │   ├── header.html           # Site branding header
│   │   ├── footer.html           # CTA footer with URL
│   │   ├── rate-card.html        # Reusable rate display card
│   │   └── transitions.html      # Standard transitions
│   ├── shorts/
│   │   ├── rate-of-the-day.html     # Best rate highlight
│   │   ├── rate-comparison.html     # Side-by-side comparison
│   │   ├── did-you-know.html        # Quick mortgage fact
│   │   └── city-teaser.html         # City rate preview
│   └── long-form/
│       ├── weekly-rate-update.html   # Full weekly recap
│       ├── lender-deep-dive.html     # Detailed lender analysis
│       ├── calculator-guide.html     # How-to walkthrough
│       └── market-trends.html        # Trend analysis
├── assets/
│   ├── logos/
│   │   └── site-logo.png       # latestmortgagerates.ca logo
│   ├── music/
│   │   ├── background-ambient.mp3   # Chill background track
│   │   ├── background-upbeat.mp3    # Energetic background
│   │   └── background-corporate.mp3 # Professional background
│   └── fonts/
│       └── Inter-Bold.woff2    # Primary font (loaded via CDN)
├── output/                   # Rendered MP4s (gitignored)
└── config.json               # Pipeline settings
```

## Video Types

### 1. Short Form (15-30 seconds) — YouTube Shorts, TikTok, Instagram Reels

**"Rate of the Day"**
- Hook: "Today's best 5-year fixed rate..."
- Show: Rate + lender name + comparison to last week
- CTA: "Compare all rates at latestmortgagerates.ca"

**"Rate Comparison"**
- Hook: "Insured vs Uninsured — which saves you more?"
- Show: Side-by-side rate cards
- CTA: "Use our calculator to find out"

**"Did You Know?"**
- Hook: "Did you know...?"
- Show: Quick mortgage fact with animated text
- CTA: "Learn more in our glossary"

**"City Teaser"**
- Hook: "Toronto mortgage rates just dropped..."
- Show: City name + best rate + trend arrow
- CTA: "See your city's rates"

### 2. Long Form (60-90 seconds) — YouTube Main Videos

**"Weekly Rate Update"**
- 0:00-0:05 Hook: "This week's mortgage rate winners and losers"
- 0:05-0:20 Best rates by category (fixed, variable, insured, uninsured)
- 0:20-0:40 Biggest movers (which lenders changed rates)
- 0:40-0:60 Market context (BoC, bond yields, predictions)
- 0:60-0:75 CTA: Subscribe + visit site

**"Lender Spotlight"**
- 0:00-0:05 Hook: "Why [Lender] has Canada's best variable rate"
- 0:05-0:25 Lender overview (who they are, what they offer)
- 0:25-0:50 Rate analysis (how their rates compare)
- 0:50-0:70 Who they're best for (first-time, renewals, investors)
- 0:70-0:90 CTA: Compare on our site

**"Calculator Guide"**
- 0:00-0:05 Hook: "Stop guessing your mortgage payments"
- 0:05-0:20 Problem: Why manual calculations fail
- 0:20-0:50 Solution: Walk through the calculator
- 0:50-0:70 Result: Show the savings
- 0:70-0:90 CTA: Try it free + subscribe

## HyperFrames Quickstart

```bash
# 1. Install HyperFrames CLI globally
npm install -g hyperframes

# 2. Verify environment
npx hyperframes doctor

# 3. Create a video project
npx hyperframes init my-video

# 4. Preview in browser (hot reload)
npx hyperframes preview

# 5. Render to MP4
npx hyperframes render --output output.mp4

# 6. Render with Docker (deterministic, for CI)
npx hyperframes render --docker --output output.mp4
```

## Requirements

| Dependency      | Required | Notes                                              |
| --------------- | -------- | -------------------------------------------------- |
| **Node.js** 22+ | Yes      | Runtime for CLI and dev server                     |
| **npm** or bun  | Yes      | Package manager                                    |
| **FFmpeg**      | Yes      | Video encoding for local renders                   |
| **Docker**      | No       | Optional — for deterministic, reproducible renders |

### Windows FFmpeg Install
```powershell
# Via winget
winget install ffmpeg

# Verify
ffmpeg -version
```

## Data Flow

```
Site Scraper
    ↓
data/rates.json (updated 2x daily)
    ↓
video-pipeline/scripts/generate-*.js
    ↓
HTML composition (HyperFrames format)
    ↓
npx hyperframes render → MP4
    ↓
YouTube API upload
    ↓
Published video with SEO metadata
```

## Automation Plan

### GitHub Actions Workflow (`.github/workflows/video-generation.yml`)

**Trigger Options:**
1. **Scheduled**: Daily at 8 AM EST (after rate scrape at 6 AM)
2. **Manual**: Workflow dispatch with video type selector
3. **On-demand**: After significant rate changes (>0.1%)

**Jobs:**
1. `generate-short` — Create daily Shorts (15-30 sec)
2. `generate-long` — Create weekly long-form (60-90 sec) — Sundays only
3. `render-videos` — Render all pending compositions to MP4
4. `upload-youtube` — Upload with metadata, thumbnails, playlists

### Content Calendar

| Day | Short (Daily) | Long (Weekly) |
|-----|---------------|---------------|
| Mon | Rate of the Day | — |
| Tue | City Spotlight | — |
| Wed | Rate Comparison | — |
| Thu | Did You Know? | — |
| Fri | Rate of the Day | — |
| Sat | Lender Teaser | — |
| Sun | — | Weekly Rate Update |

## YouTube Strategy

### Channel Setup
- **Name**: Latest Mortgage Rates Canada
- **Handle**: @LatestMortgageRates
- **Description**: Daily mortgage rate updates, lender comparisons, and expert analysis for Canadian homebuyers.
- **Links**: Website, rate alert signup, mortgage calculator

### Playlist Structure
1. **Daily Rate Updates** — Shorts, auto-generated
2. **Weekly Recaps** — Long-form, every Sunday
3. **City Guides** — Toronto, Vancouver, Calgary, etc.
4. **Lender Reviews** — Deep dives on major lenders
5. **Mortgage 101** — Educational content for beginners
6. **Calculator Tutorials** — How-to videos

### SEO Metadata Template

**Short Form (YouTube Shorts):**
```
Title: [Rate]% 5-Year Fixed | Best Mortgage Rate Today | [City/Canada]
Description:
🏆 Today's best rate: [Rate]% from [Lender]

Compare all lenders: https://latestmortgagerates.ca

📍 [City]-specific rates | 📊 Trend: [Up/Down/Stable]

#MortgageRates #Canada #[City] #HomeBuying #MortgageTips

Subscribe for daily rate updates!
```

**Long Form:**
```
Title: Weekly Mortgage Rate Update | [Date] | Best Fixed & Variable Rates Canada
Description:
📉 This week's biggest mortgage rate moves

TIMESTAMPS:
0:00 Intro
0:10 Best 5-Year Fixed Rates
0:30 Best 5-Year Variable Rates
0:50 Biggest Rate Changes
1:10 Market Analysis
1:30 What to Expect Next Week

🔗 RESOURCES:
• Compare all rates: https://latestmortgagerates.ca
• Mortgage calculator: https://latestmortgagerates.ca/tools/mortgage-calculator
• Rate alerts: https://latestmortgagerates.ca/rate-alerts
• City guides: https://latestmortgagerates.ca/cities

📊 DATA SOURCES:
Rates scraped daily from 34+ Canadian lenders including RBC, TD, Scotiabank, BMO, CIBC, National Bank, nesto, EQ Bank, Simplii, and more.

#MortgageRates #CanadianRealEstate #HomeBuying #MortgageBroker #InterestRates

—
🎬 New videos every Sunday + daily Shorts
🔔 Subscribe for the latest mortgage rate updates
```

## Video Style Guide

### Colors (Brand Palette)
```
Primary:    #2563eb (Blue-600)     — Trust, professionalism
Secondary:  #059669 (Emerald-600)   — Growth, savings, positive
Accent:     #d97706 (Amber-600)     — Attention, CTAs
Background: #0f172a (Slate-900)     — Dark mode, premium
Surface:    #1e293b (Slate-800)     — Cards, containers
Text:       #f8fafc (Slate-50)      — Primary text
Muted:      #94a3b8 (Slate-400)     — Secondary text
```

### Typography
- **Primary**: Inter (Google Fonts) — clean, modern, highly readable
- **Headlines**: 800 weight, 72-96px
- **Subheadings**: 600 weight, 48-64px
- **Body**: 400 weight, 32-40px
- **Captions**: 500 weight, 28-36px

### Animation Style
- **Easing**: `power2.out` for smooth, professional feel
- **Entrance**: Fade + slide (elements enter from below)
- **Emphasis**: Scale pop for numbers/rates
- **Transitions**: Flash through white or subtle slide
- **Timing**: 0.4-0.6s for most animations (professional pace)

### Audio
- **Background music**: Low volume (0.15-0.25), corporate/upbeat
- **TTS narration**: Kokoro local TTS, professional voice
- **Sound effects**: Subtle whoosh on transitions, ping on rate reveals

## Creating Your First Video

### Step 1: Generate the composition
```bash
cd video-pipeline
node scripts/generate-daily-rate-short.js
```

### Step 2: Preview and iterate
```bash
cd output
cd rate-of-the-day-[date]
npx hyperframes preview
# Open browser, make edits to index.html, save to reload
```

### Step 3: Render
```bash
# Fast draft for review
npx hyperframes render --quality draft --output draft.mp4

# Final render
npx hyperframes render --quality high --output final.mp4
```

### Step 4: Upload
```bash
node ../scripts/upload-youtube.js --video final.mp4 --type short
```

## Performance Tips

1. **Use Docker for final renders** — deterministic output across machines
2. **Draft quality for iteration** — 5x faster than high quality
3. **Parallel renders** — Use `--workers auto` for faster processing
4. **Pre-load assets** — Keep logos/music in `assets/` to avoid fetch delays
5. **Reusable components** — Use `templates/shared/` for consistent branding

## Troubleshooting

| Issue | Solution |
|-------|----------|
| FFmpeg not found | `winget install ffmpeg` then restart terminal |
| Chrome launch fails | Use `--docker` flag for containerized rendering |
| Text looks blurry | Increase font size, use `--quality high` |
| Animations not playing | Check `window.__timelines` registration |
| Video won't upload | Check YouTube API quota, refresh OAuth token |

## Next Steps

1. ✅ Read `docs/hyperframes-docs-index.md` for framework overview
2. ✅ Read `docs/prompting-guide.md` for AI agent prompts
3. Install HyperFrames: `npm install -g hyperframes`
4. Install FFmpeg: `winget install ffmpeg`
5. Generate first video: `node scripts/generate-daily-rate-short.js`
6. Set up YouTube API credentials for automated upload
7. Configure GitHub Actions workflow for daily automation

## Resources

- **HyperFrames Docs**: https://hyperframes.mintlify.app/
- **YouTube API**: https://developers.google.com/youtube/v3
- **GSAP Animation**: https://gsap.com/docs/
- **Site Data**: `../data/rates.json` (live mortgage rates)

---

**Last Updated**: May 4, 2026
**Maintained By**: DrewBot OpenClaw
