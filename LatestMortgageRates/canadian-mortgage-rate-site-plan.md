# Latest Mortgage Rates — Business & Technical Plan
### latestmortgagerates.ca

## 1. Product Vision

**Latest Mortgage Rates** (latestmortgagerates.ca) is a consumer-facing website that helps Canadians find the best mortgage rates by aggregating, comparing, and explaining mortgage products from major lenders, credit unions, and mortgage brokers across Canada.

**Revenue model:** Affiliate commissions from lender referrals, lead generation fees, and Google AdSense display advertising.

---

## 2. Recommended Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | **Next.js 14+ (App Router)** | SSR/SSG for SEO (critical for this business), React ecosystem, API routes built in |
| **Language** | TypeScript | Type safety for financial data handling |
| **Styling** | Tailwind CSS + shadcn/ui | Fast iteration, professional look, accessible components |
| **Database** | MySQL (Hostinger Cloud managed) or PostgreSQL (Neon/Supabase external) | MySQL is bundled and fully managed; PostgreSQL available via external service if preferred |
| **ORM** | Drizzle ORM or Prisma | Type-safe database queries |
| **Rate Data Pipeline** | Python + OpenClaw (local Windows machine) | AI-powered scraping with browser automation, runs locally, syncs to Hostinger |
| **Job Scheduling** | Windows Task Scheduler (local scraping) + hPanel Cron Jobs (site tasks) | Scraping runs on your Windows PC; site-level jobs on Hostinger Cloud |
| **CMS (blog/guides)** | MDX files or Sanity.io | SEO content is a major traffic driver; MDX is simple, Sanity is more flexible |
| **Hosting** | **Hostinger Cloud Hosting** | Website, domain, email, MySQL DB all managed via hPanel — minimal server admin |
| **Domain & DNS** | **Hostinger** | Domain registration + DNS management bundled with hosting |
| **Email** | **Hostinger Email** | Professional email (e.g., hello@latestmortgagerates.ca) bundled with hosting plan |
| **Analytics** | **Google Analytics 4 (GA4)** | Industry standard, free, deep integration with Google Ads and AdSense |
| **Ads / Revenue** | **Google AdSense** | Display ad monetization — primary passive revenue stream alongside affiliate |
| **Search** | Algolia or Meilisearch | Fast filtering/sorting of rate products |

### 2.1 Hostinger Setup Notes

Hostinger offers several hosting tiers. Here's the recommended approach:

**Hostinger Cloud Hosting (Your plan)**

Cloud Hosting uses Hostinger's managed hPanel with dedicated resources, automatic scaling, and better uptime guarantees than shared hosting. Key characteristics:

- **Managed environment:** hPanel handles server management, security patches, SSL, and backups
- **Dedicated resources:** Guaranteed CPU and RAM (not shared like traditional hosting)
- **Node.js support:** hPanel supports Node.js applications natively — no manual Nginx/PM2 setup needed
- **MySQL included:** Managed MySQL databases via hPanel (note: MySQL, not PostgreSQL — see database note below)
- **SSH access:** Available for CLI operations, deployments, and cron jobs
- **Built-in caching:** LiteSpeed web server with built-in caching for performance
- **Auto-scaling:** Resources scale automatically during traffic spikes
- **Plans:** Typically ~$10–30/mo depending on resources

**Database note — MySQL vs. PostgreSQL:**
Hostinger Cloud Hosting provides managed MySQL, not PostgreSQL. Two options:
1. **Use MySQL (simpler):** Adapt the schema to MySQL — the data model works fine with MySQL. Use Prisma or Drizzle ORM which support both. This is the recommended approach since it's fully managed by Hostinger.
2. **Use a managed PostgreSQL service (external):** If you strongly prefer PostgreSQL, use Neon (free tier: 0.5 GB) or Supabase (free tier: 500 MB) as an external managed database. Your Next.js app on Hostinger connects to it over the network. Adds a small amount of latency but keeps PostgreSQL.

**Deployment approach (split architecture — local Windows + Hostinger Cloud):**
```
YOUR WINDOWS PC (local)                    HOSTINGER CLOUD HOSTING (remote)
────────────────────────                   ──────────────────────────────
├── Python 3.12+                           ├── LiteSpeed web server (managed)
├── OpenClaw (npm, Node.js 22+)            ├── Next.js app (Node.js via hPanel)
├── Chromium (for OpenClaw Browser)        ├── MySQL database (managed via hPanel)
├── Next.js development environment        │   OR external PostgreSQL (Neon/Supabase)
├── Rate scraping engine (Python)          ├── Rate ingest API endpoint
├── Social media content engine (Python)   ├── Cron jobs (via hPanel cron manager)
├── Local SQLite (staging DB)              ├── SSL (auto-managed by Hostinger)
├── Windows Task Scheduler                 ├── Email (Hostinger Email bundled)
│   (triggers scraping every 4-6 hrs)      └── Backups (automatic, daily)
├── FTP/SFTP client (FileZilla/WinSCP)
│   (deploys website builds to Cloud)
└── Sync client (pushes rate data to Cloud)
```

**Deploying Next.js on Hostinger Cloud Hosting (via FTP from Windows):**

You'll build your Next.js app locally on your Windows PC and upload the production build to Hostinger via FTP.

**Build locally, deploy via FTP workflow:**
1. Develop and test locally on your Windows machine
2. Run `npm run build` to create the production `.next` build
3. Upload the build output to Hostinger via FTP
4. hPanel runs the Node.js app using your `server.js` entry point

**FTP setup:**
1. Enable Node.js in hPanel → Website → Advanced → Node.js
2. Set Node.js version (22.x LTS recommended)
3. Set the application root to your Next.js project directory (e.g., `/home/user/htdocs/latestmortgagerates.ca`)
4. Set the startup file to `server.js`
5. Get FTP credentials from hPanel → Files → FTP Accounts
6. Use an FTP client (FileZilla, WinSCP, or CLI) to upload files

**Recommended FTP client: FileZilla (free, open source)**
```
Host: ftp.latestmortgagerates.ca (or the IP from hPanel)
Port: 21 (FTP) or 22 (SFTP — recommended for security)
Protocol: SFTP (SSH File Transfer Protocol) — preferred over plain FTP
Username: your Hostinger FTP username (from hPanel → FTP Accounts)
Password: your FTP password
```

**What to upload via FTP:**
```
LOCAL (Windows)                          REMOTE (Hostinger)
──────────────                          ──────────────────
C:\MortgageRates\website\               /home/user/htdocs/latestmortgagerates.ca/
├── .next/              ──────FTP──────► ├── .next/
├── public/             ──────FTP──────► ├── public/
├── node_modules/       ──────FTP──────► ├── node_modules/  (or run npm install on server)
├── package.json        ──────FTP──────► ├── package.json
├── package-lock.json   ──────FTP──────► ├── package-lock.json
├── server.js           ──────FTP──────► ├── server.js
├── next.config.js      ──────FTP──────► ├── next.config.js
├── prisma/             ──────FTP──────► ├── prisma/
└── .env.production     ──────FTP──────► └── .env  (rename on server)
```

**Automated FTP deployment script (Windows batch file):**
```batch
@echo off
REM deploy.bat — Build and deploy to Hostinger via SFTP
REM Requires WinSCP CLI (winscpcommand) or FileZilla CLI

echo [1/3] Building Next.js production build...
cd C:\MortgageRates\website
call npm run build
if %errorlevel% neq 0 (
    echo BUILD FAILED — aborting deployment
    exit /b 1
)

echo [2/3] Uploading to Hostinger via SFTP...
REM Using WinSCP command-line (install from winscp.net)
"C:\Program Files (x86)\WinSCP\WinSCP.com" /command ^
    "open sftp://FTP_USER:FTP_PASSWORD@latestmortgagerates.ca/" ^
    "synchronize remote C:\MortgageRates\website /home/user/htdocs/latestmortgagerates.ca -filemask=|.git/;.env.local;README.md" ^
    "exit"

echo [3/3] Restarting Node.js app on Hostinger...
REM SSH command to restart the app (or use hPanel to restart manually)
ssh user@latestmortgagerates.ca "cd /home/user/htdocs/latestmortgagerates.ca && npm install --production && node -e 'console.log(\"Packages installed\")'"

echo Deployment complete! Site: https://latestmortgagerates.ca
```

**Alternative: Use `npm install` on the server instead of uploading node_modules**

Uploading `node_modules/` via FTP is slow (thousands of small files). A faster approach:
1. Upload everything EXCEPT `node_modules/`
2. SSH into Hostinger and run `npm install --production` on the server
3. This installs dependencies directly on Hostinger — much faster than FTP transfer

```batch
REM deploy-lean.bat — Upload without node_modules, install on server
cd C:\MortgageRates\website
call npm run build

REM Sync files excluding node_modules
"C:\Program Files (x86)\WinSCP\WinSCP.com" /command ^
    "open sftp://FTP_USER:FTP_PASSWORD@latestmortgagerates.ca/" ^
    "synchronize remote C:\MortgageRates\website /home/user/htdocs/latestmortgagerates.ca -filemask=|node_modules/;.git/;.env.local" ^
    "exit"

REM Install dependencies on server
ssh user@latestmortgagerates.ca "cd /home/user/htdocs/latestmortgagerates.ca && npm install --production"
```

**FTP deployment tips:**
- Use SFTP (port 22) instead of plain FTP (port 21) — SFTP encrypts the transfer
- Use WinSCP's `synchronize` command to only upload changed files (much faster than full upload)
- First deployment will be slow (uploading everything); subsequent deploys are fast (only diffs)
- Add `.env.production` locally but rename it to `.env` on the server — never commit secrets to Git
- After uploading, restart the Node.js application in hPanel or via SSH
- Consider setting up a `.bat` shortcut on your desktop for one-click deploys

```javascript
// server.js — custom entry point for Hostinger Cloud
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res, parse(req.url, true));
  }).listen(port, () => {
    console.log(`> Ready on port ${port}`);
  });
});
```

**Local Windows project structure (website development):**
```
C:\MortgageRates\
├── website/                             # Next.js project (develop + build locally)
│   ├── .next/                           # Production build output (uploaded via FTP)
│   ├── public/                          # Static assets
│   ├── src/                             # App source code
│   ├── prisma/                          # Database schema
│   ├── server.js                        # Hostinger Cloud entry point
│   ├── next.config.js
│   ├── package.json
│   ├── .env.local                       # Local dev environment variables
│   ├── .env.production                  # Production env vars (uploaded as .env)
│   └── deploy.bat                       # One-click build + FTP deploy script
├── scraping/                            # Rate scraping engine (Python)
├── social-engine/                       # Content automation (Python)
└── logs/
```

**Cron jobs on Hostinger Cloud:**
- Set up via hPanel → Advanced → Cron Jobs
- Use for: site maintenance, social media publishing queue, database cleanup
- Note: rate scraping runs on your Windows PC, NOT on Hostinger — the cron jobs on Hostinger are for site-level tasks only

**Domain & email setup:**
- Domain: **latestmortgagerates.ca** registered through Hostinger (~$12–15/yr for .ca)
- Set up professional email: info@latestmortgagerates.ca, hello@latestmortgagerates.ca
- Configure SPF, DKIM, DMARC records for email deliverability (important for rate alert emails)

### 2.2 Google Analytics 4 (GA4) Implementation

GA4 is the analytics backbone for both the website and ad revenue optimization.

**Key tracking setup:**
- **Page views & engagement:** Which rate pages, calculators, and guides get the most traffic
- **Custom events:** Rate table filter usage, calculator submissions, lender click-throughs, lead form completions
- **Conversion tracking:** Define conversions for lead form submissions, affiliate link clicks, and rate alert signups
- **Audience segments:** First-time visitors vs. returning, province-based, device type
- **Integration with Google Ads:** If you run paid campaigns later, GA4 conversion data feeds directly into ad optimization
- **Integration with AdSense:** GA4 links to AdSense to show revenue per page, helping you identify which content earns the most

**GA4 implementation in Next.js:**
```typescript
// Use @next/third-parties for optimized Google tag loading
// or install via Google Tag Manager for flexibility
// Key events to track:
// - rate_table_filter (term, type, province)
// - calculator_used (calculator_type, input_values)
// - lender_click (lender_name, rate, term)
// - lead_form_submit (province, mortgage_type)
// - rate_alert_signup (target_rate, term)
// - ad_click (placement, page)
```

**Privacy considerations (PIPEDA):**
- Implement a cookie consent banner (required in Canada)
- GA4 supports consent mode — only fires tracking after user accepts
- Configure data retention settings (default 14 months, adjust as needed)
- Add a clear Privacy Policy page explaining what data is collected

### 2.3 Google AdSense Strategy

AdSense is a core revenue stream from day one, complementing affiliate/lead gen income.

**Ad placement strategy for a mortgage rate site:**

| Placement | Ad Unit Type | Location | Rationale |
|---|---|---|---|
| **Leaderboard** | Display (728x90) | Top of page, below navigation | High visibility, standard placement |
| **In-content** | In-article | Between sections in guides/blog posts | Non-intrusive, high engagement |
| **Sidebar** | Display (300x250) | Right sidebar on rate table page | Visible while users scroll rates |
| **Anchor** | Anchor ad (mobile) | Bottom of mobile viewport | Persistent mobile visibility |
| **Between calculators** | Multiplex / native | Between calculator results and next section | Contextual placement |
| **Rate table interstitial** | In-feed | Every 5–10 rows in the rate comparison table | Blends with content |

**AdSense optimization tips:**
- Enable Auto Ads initially to let Google find optimal placements, then refine manually
- Finance/mortgage is one of the highest-paying AdSense niches (CPMs of $10–50+ for Canadian finance traffic)
- Don't overdo it — too many ads hurt UX, bounce rate, and ultimately SEO rankings
- Use Ad Balance to filter out low-paying ads and show fewer, higher-quality placements
- Test ad density: start conservative (3–4 units per page), increase gradually while monitoring bounce rate
- Exclude competitor ads: block specific advertisers (competing rate comparison sites) in AdSense settings

**Revenue expectations (rough estimates):**

| Monthly Sessions | Est. RPM (Revenue per 1K sessions) | Est. Monthly AdSense Revenue |
|---|---|---|
| 10,000 | $15–30 | $150–300 |
| 50,000 | $20–40 | $1,000–2,000 |
| 100,000 | $25–50 | $2,500–5,000 |
| 250,000 | $30–60 | $7,500–15,000 |

*Note: Mortgage/finance RPMs are among the highest in AdSense. Actual revenue varies significantly based on traffic quality, ad placement, and seasonal trends (spring housing season = higher RPMs).*

**AdSense compliance requirements:**
- Must have a Privacy Policy page (required by Google)
- Must label ads clearly (Google handles this automatically)
- Cannot place ads on pages with thin content — every page needs substantial, original content
- Cannot incentivize clicks or place ads in misleading positions
- Site must be live with real content before applying (Google reviews the site)
- Recommended: apply once you have 15–20 pages of quality content and some organic traffic

---

## 3. Core Features (MVP)

### 3.1 Rate Comparison Engine
- **Rate table** showing current mortgage rates from multiple lenders
- **Filters:** term length (1–10 yr), fixed vs. variable, insured vs. uninsured, purchase vs. renewal vs. refinance
- **Sort:** by rate, lender name, or monthly payment
- **Rate details expansion:** clicking a row shows full product details, penalties, prepayment privileges, portability

### 3.2 Mortgage Calculator
- Monthly payment calculator with amortization schedule
- Affordability calculator (income → max purchase price)
- Comparison calculator (side-by-side two products)
- Land transfer tax calculator (province-specific)
- CMHC insurance premium calculator
- Stress test calculator (B-20 qualifying rate)

### 3.3 Lender Profiles
- Individual pages per lender (Big 5 banks, credit unions, monolines, brokers)
- Reviews, product summaries, contact info
- Historical rate tracking per lender

### 3.4 Educational Content (SEO)
- "Best mortgage rates in Canada" (primary keyword target)
- Province-specific pages (Ontario, BC, Alberta, Quebec, etc.)
- Guides: first-time buyer, renewal, refinance, variable vs. fixed
- Glossary of Canadian mortgage terms
- Blog with weekly rate commentary

### 3.5 Rate Alerts
- Email signup: "Alert me when 5-year fixed drops below X%"
- Weekly rate summary newsletter

### 3.6 Lead Capture / CTA
- "Get a personalized rate" form → routes leads to partner brokers
- Click-through tracking to lender sites (affiliate attribution)

---

## 4. Data Pipeline Architecture

```
YOUR WINDOWS PC (local)                          HOSTINGER CLOUD (remote)
═══════════════════════                          ══════════════════════

┌─────────────────────────────┐
│   WINDOWS TASK SCHEDULER     │
│   Triggers every 4-6 hours   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  PYTHON SCRAPING ENGINE      │
│                              │
│  1. OpenClaw Browser Tool    │
│     → Launches Chromium      │
│     → Navigates to bank      │
│       rate pages             │
│     → Handles JS rendering   │
│     → AI-powered extraction  │
│       (understands page      │
│        structure, adapts to  │
│        layout changes)       │
│                              │
│  2. OpenClaw web_fetch       │
│     → Static/simple pages    │
│     → API calls (BoC Valet)  │
│     → RSS feeds (news)       │
│                              │
│  3. Per-lender scraper       │
│     modules (Python)         │
│     → RBC, TD, BMO, etc.    │
│     → Each lender has its    │
│       own scraper class      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  NORMALIZATION LAYER         │
│  Standardize to schema:      │
│  - rate, term, type, lender  │
│  - effective_date, conditions│
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  VALIDATION & QA             │
│  - Sanity checks             │
│  - Cross-ref aggregators     │
│  - BoC benchmark check       │
│  - Diff vs. last scrape      │
│  - Anomaly alerting          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  LOCAL STAGING DB (SQLite)   │        ┌─────────────────────────┐
│  Validated rates stored      │        │  HOSTINGER CLOUD         │
│  locally before upload       │        │                          │
└──────────────┬──────────────┘        │  ┌─────────────────────┐ │
               │                        │  │  MySQL DB (managed)  │ │
               │   SYNC TO HOSTINGER    │  │  (production)        │ │
               │   ─────────────────►   │  │  rates, lenders,     │ │
               │                        │  │  products, history   │ │
               │   Methods:             │  └──────────┬──────────┘ │
               │   • REST API endpoint  │             │             │
               │     (POST /api/rates)  │             ▼             │
               │   • Direct MySQL       │  ┌─────────────────────┐ │
               │     connection (SSH    │  │  Next.js App         │ │
               │     tunnel)            │  │  ISR revalidation    │ │
               │   • SCP/rsync JSON     │  │  triggered on new    │ │
               │     export files       │  │  rate data           │ │
               │                        │  └─────────────────────┘ │
               │                        └─────────────────────────┘
               │
               ▼
┌─────────────────────────────┐
│  LOCAL LOGS & MONITORING     │
│  - Scrape success/failure    │
│  - Rates collected vs.       │
│    expected                  │
│  - Email alert on failures   │
│  - Dashboard (optional)      │
└─────────────────────────────┘
```

### Why Run Scraping Locally on Windows?

This architecture has several advantages over running scrapers on the Cloud server:

| Benefit | Explanation |
|---|---|
| **No Cloud server resource strain** | Headless browser scraping is CPU/RAM intensive — offloading it to your PC keeps the Cloud server lean for serving web traffic |
| **Residential IP address** | Your home IP is less likely to be blocked by bank websites than a data center IP |
| **Easier debugging** | You can see the browser in real-time on your monitor, inspect elements, and troubleshoot |
| **OpenClaw AI advantage** | OpenClaw's AI-powered extraction adapts to page layout changes — if a bank redesigns their rate page, OpenClaw can often still extract the data without updating selectors |
| **No additional hosting costs** | No need to upgrade Cloud plan for headless browser workloads |

**Trade-offs to be aware of:**

| Trade-off | Mitigation |
|---|---|
| PC must be on for scraping to run | Use Windows Task Scheduler + wake timers; or run it on a cheap always-on mini PC |
| Internet outage = no scrape | Validation pipeline flags missing data; Cloud server serves last-known-good rates with "stale" badge |
| IP could get rate-limited | Rotate user agents, add delays between requests, use OpenClaw's Firecrawl fallback for difficult sites |

### Data Sourcing Strategy (Tiered Approach)

Accurate rate data requires multiple sources layered together. No single source covers everything — the strategy is to combine official APIs, direct lender scraping, and aggregator cross-referencing into a pipeline that validates data across sources.

#### Tier 1: Official Government APIs (Baseline & Validation)

These are free, reliable, and legal. They provide market-level benchmarks — not individual lender rates, but essential for validation and trend data.

**Bank of Canada Valet API** (Free, no API key required)
The single most valuable official data source. Provides weekly and monthly mortgage rate data in JSON, CSV, or XML.

Key endpoints:
```
# Broker average 5-year variable rate mortgage (weekly)
GET https://www.bankofcanada.ca/valet/observations/BROKER_AVERAGE_5YR_VRM/json?recent=10

# All chartered bank mortgage lending rates (monthly, 24 series)
# Covers insured + uninsured, variable + fixed, by term bucket
GET https://www.bankofcanada.ca/valet/observations/group/A4_RATES_MORTGAGES/json?recent=4

# Posted interest rates from the Big 6 chartered banks (weekly)
# Prime rate, conventional mortgages, GICs
GET https://www.bankofcanada.ca/valet/observations/group/POSTED_CHARTERED_BANKS/json?recent=4

# Discover all available series
GET https://www.bankofcanada.ca/valet/lists/series/json
```

The `A4_RATES_MORTGAGES` group returns 24 series covering:
- Insured vs. uninsured residential mortgages
- Variable rate vs. fixed rate (by term bucket: <1yr, 1–<3yr, 3–<5yr, 5yr+)
- Both funds advanced and outstanding balances

Python client: `pyvalet` package (`pip install pyvalet`)
```python
from pyvalet import ValetInterpreter
vi = ValetInterpreter()
df_series, df = vi.get_series_observations("BROKER_AVERAGE_5YR_VRM", response_format='csv')
```

Use for: market benchmarks, trend charts, validation (if a scraped lender rate deviates wildly from BoC averages, flag it), historical rate data going back decades.

**CMHC / Statistics Canada / Open Data Portal**
```
# CMHC conventional 5-year mortgage lending rate (monthly)
https://open.canada.ca/data/en/dataset/861ae633-be72-480c-9e7e-30219ebb67a9
# Available in CSV, XML, SDMX
```

Use for: long-term historical rates, CMHC insurance premium context, housing market indicators.

#### Tier 2: Direct Lender Website Scraping (Core Rate Data)

This is where the actual per-lender, per-product rate data comes from. Each bank/lender publishes rates on their website — some statically, some dynamically loaded via JavaScript.

**Big 5 Banks — Scraping Approach (OpenClaw on Windows):**

| Bank | Rate Page URL | Rendering | OpenClaw Method |
|---|---|---|---|
| **RBC** | rbcroyalbank.com/mortgages/mortgage-rates.html | Dynamic JS (rates loaded client-side) | Browser tool (Chromium via CDP) — AI snapshot extraction |
| **TD** | td.com/ca/en/personal-banking/products/mortgages/mortgage-rates | Dynamic JS | Browser tool — AI snapshot extraction |
| **BMO** | bmo.com/main/personal/mortgages/mortgage-rates/ | Dynamic JS | Browser tool — AI snapshot extraction |
| **Scotiabank** | scotiabank.com/ca/en/personal/rates-prices/mortgages-rates.html | Mixed (some static) | web_fetch first; fall back to Browser if needed |
| **CIBC** | cibc.com/en/personal-banking/mortgages/mortgage-rates.html | Dynamic JS | Browser tool — AI snapshot extraction |

**Why OpenClaw for bank scraping:**

OpenClaw's Browser tool connects to Chromium via the Chrome DevTools Protocol (CDP), giving it full browser control — it executes JavaScript, waits for dynamic content, and can click/expand elements. The key advantage over traditional Playwright scripts is **AI-powered extraction**: OpenClaw takes "AI snapshots" of the rendered page and uses its AI agent to understand the page structure and extract data intelligently, rather than relying on brittle CSS selectors that break when banks redesign their sites.

**OpenClaw scraping modes for this project:**

| Mode | When to Use | How It Works |
|---|---|---|
| **`web_fetch`** | Static pages, APIs, RSS feeds | Simple HTTP GET → converts HTML to markdown/text. Fast, lightweight. Use for BoC Valet API, simpler lender pages, news feeds. Does NOT execute JavaScript. |
| **Browser tool (AI snapshot)** | JS-rendered bank rate pages | Launches real Chromium browser, navigates to URL, waits for JS to render, takes AI snapshot of the DOM, extracts structured data. Handles dynamic content, collapsible sections, and SPAs. |
| **Browser tool + Firecrawl fallback** | Heavily protected sites | If a bank site blocks standard browser requests, Firecrawl provides proxy-backed scraping with bot detection bypass. Configure as fallback in OpenClaw settings. |

**Key scraping notes for Big 5:**
- All major banks use JavaScript to render rate tables — OpenClaw's `web_fetch` (plain HTTP) will NOT work for these. Use the Browser tool which launches real Chromium and executes JavaScript.
- OpenClaw's AI snapshot mode is ideal here: it reads the rendered page and extracts rate data by understanding the table structure, rather than hard-coded CSS selectors. This means less maintenance when banks update their page designs.
- RBC embeds some mortgage offer metadata in JavaScript objects (`mortgagesTextOfferData`, `ga4EcomInfo`) — OpenClaw's Browser tool can execute JS to extract these directly.
- Banks publish both "posted rates" (higher, used for penalty calculations) and "special offer rates" (the actual rates customers get). You want BOTH — posted rates are important for penalty calculators.
- The spread between posted and special rates at Big 5 banks averages 0.50%+ — this is a valuable insight for your content.
- Rate pages often have collapsible sections — use OpenClaw's `click` command to expand all sections before taking a snapshot.
- Banks may serve different rates based on amortization (≤25yr vs. >25yr) and down payment (high-ratio vs. conventional). Capture all variants.

**Monolines & Digital Lenders — Generally Easier:**

| Lender | Approach | OpenClaw Method |
|---|---|---|
| **Nesto** | nesto.ca/mortgage-rates/ | `web_fetch` or Browser; also pursue affiliate data feed (partnerships@nesto.ca) |
| **Pine** | pine.ca/mortgage-rates | `web_fetch` or Browser — digital-first, clean pages |
| **THINK Financial** | thinkfinancial.ca | `web_fetch` — monoline, simple rate pages |
| **MCAP** | mcap.com | Browser — may require JS for full rate display |
| **First National** | firstnational.ca | `web_fetch` — largest non-bank lender |
| **Tangerine** | tangerine.ca/en/products/borrowing/mortgages | Browser — Scotiabank subsidiary, may use dynamic loading |
| **EQ Bank** | eqbank.ca/mortgage | `web_fetch` or Browser — digital-first |
| **Simplii** | simplii.com/en/mortgage-rates.html | Browser — CIBC subsidiary, similar tech stack |
| **Desjardins** | desjardins.com | Browser — large credit union, Quebec market entry |
| **Meridian** | meridiancu.ca | `web_fetch` — Ontario's largest credit union |

**OpenClaw setup on Windows:**
```bash
# Install OpenClaw globally (requires Node.js 22+)
npm install -g openclaw@latest

# Run onboarding wizard
openclaw onboard

# Configure browser profile in ~/.openclaw/openclaw.json
# OpenClaw will use your local Chromium/Chrome installation
```

**Python orchestration pattern (calls OpenClaw via subprocess):**

Your Python scraping engine runs as the orchestrator — it triggers OpenClaw commands,
parses the results, normalizes the data, validates it, and syncs to Hostinger.

```python
import subprocess
import json
from datetime import datetime

class OpenClawScraper:
    """Base class for all lender scrapers using OpenClaw."""

    def run_openclaw(self, command: str) -> str:
        """Execute an OpenClaw CLI command and return output."""
        result = subprocess.run(
            f"openclaw {command}",
            shell=True, capture_output=True, text=True, timeout=120
        )
        if result.returncode != 0:
            raise ScraperError(f"OpenClaw failed: {result.stderr}")
        return result.stdout

class RBCScraper(OpenClawScraper):
    URL = "https://www.rbcroyalbank.com/mortgages/mortgage-rates.html"
    LENDER_SLUG = "rbc"

    def scrape(self) -> list[RawRate]:
        # 1. Open the rate page in OpenClaw's browser
        self.run_openclaw(f'browser open {self.URL}')

        # 2. Wait for JS to render the rate tables
        self.run_openclaw('browser wait --fn "document.querySelector('.rate-table') !== null"')

        # 3. Expand all collapsible rate sections
        self.run_openclaw('browser snapshot --interactive')
        # OpenClaw returns numbered refs for clickable elements
        # Click each expander to reveal all rates
        for ref in self.find_expander_refs():
            self.run_openclaw(f'browser click {ref}')

        # 4. Take AI snapshot — OpenClaw extracts structured content
        snapshot = self.run_openclaw('browser snapshot')

        # 5. Use AI to parse the snapshot into structured rate data
        # OpenClaw's AI understands the table layout and extracts rates
        # Even if RBC redesigns the page, the AI adapts
        rates = self.parse_rates_from_snapshot(snapshot)

        return [RawRate(
            lender=self.LENDER_SLUG,
            term=r["term"],
            rate_type=r["rate_type"],
            rate=r["rate"],
            posted_rate=r.get("posted_rate"),
            source_url=self.URL,
            scraped_at=datetime.utcnow(),
        ) for r in rates]


class BoCApiScraper(OpenClawScraper):
    """Uses web_fetch (no browser needed) for the Bank of Canada API."""

    def scrape(self) -> list[RawRate]:
        # BoC Valet API is plain JSON — no browser needed
        url = "https://www.bankofcanada.ca/valet/observations/group/POSTED_CHARTERED_BANKS/json?recent=4"
        output = self.run_openclaw(f'web_fetch {url}')
        data = json.loads(output)
        return self.parse_boc_data(data)
```

**Alternative: Python-native approach (if you prefer not to shell out to OpenClaw)**

You can also use OpenClaw purely for the browser automation piece and handle
everything else in native Python. Or mix approaches — use OpenClaw's Browser
for the JS-heavy bank sites, and Python `httpx` for simple API calls:

```python
import httpx
from openclaw import Browser  # if OpenClaw exposes a Python SDK

# Simple API calls — no OpenClaw needed
async def fetch_boc_rates():
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://www.bankofcanada.ca/valet/observations/BROKER_AVERAGE_5YR_VRM/json?recent=10"
        )
        return resp.json()

# JS-heavy bank pages — use OpenClaw Browser
async def fetch_rbc_rates():
    browser = Browser(profile="scraping")
    await browser.open("https://www.rbcroyalbank.com/mortgages/mortgage-rates.html")
    await browser.wait(fn="document.querySelector('.rate-table') !== null")
    snapshot = await browser.snapshot()
    return parse_snapshot(snapshot)
```

**Syncing scraped data to Hostinger:**

```python
import httpx
import paramiko

class HostingerSync:
    """Push validated rate data from local Windows machine to Hostinger Cloud."""

    def __init__(self, config):
        self.cloud_host = config["hostinger_cloud_ip"]
        self.api_url = config["site_api_url"]  # https://latestmortgagerates.ca/api/rates
        self.api_key = config["sync_api_key"]

    # METHOD 1: REST API (Recommended)
    # Your Next.js app exposes a protected API endpoint that accepts rate data
    async def sync_via_api(self, rates: list[dict]):
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.api_url}/ingest",
                json={"rates": rates, "scraped_at": datetime.utcnow().isoformat()},
                headers={"Authorization": f"Bearer {self.api_key}"},
                timeout=30,
            )
            resp.raise_for_status()
            return resp.json()  # {"inserted": 45, "updated": 12, "unchanged": 89}

    # METHOD 2: Direct DB connection via SSH tunnel
    # Connect directly to MySQL on Hostinger Cloud through an SSH tunnel
    def sync_via_ssh_tunnel(self, rates: list[dict]):
        import sshtunnel
        import pymysql  # or mysql-connector-python

        with sshtunnel.SSHTunnelForwarder(
            (self.cloud_host, 22),
            ssh_username=os.getenv("HOSTINGER_SSH_USER"),
            ssh_pkey="~/.ssh/hostinger_key",
            remote_bind_address=("127.0.0.1", 3306),  # MySQL default port
        ) as tunnel:
            conn = pymysql.connect(
                host="127.0.0.1",
                port=tunnel.local_bind_port,
                database="mortgage_rates",
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
            )
            self.upsert_rates(conn, rates)

    # METHOD 3: JSON file export via SFTP
    # Export rates as JSON, SFTP to Hostinger, cron job imports on Cloud
    def sync_via_sftp(self, rates: list[dict]):
        filepath = f"rates_export_{datetime.now():%Y%m%d_%H%M}.json"
        with open(filepath, "w") as f:
            json.dump(rates, f)

        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(
            self.cloud_host,
            username=os.getenv("HOSTINGER_SSH_USER"),
            key_filename="~/.ssh/hostinger_key"
        )
        sftp = ssh.open_sftp()
        sftp.put(filepath, f"/home/{os.getenv('HOSTINGER_SSH_USER')}/rate_imports/{filepath}")
        sftp.close()
        ssh.close()
```

**Recommended sync method: REST API (Method 1)**

Build a simple protected endpoint in your Next.js app:
```
POST https://latestmortgagerates.ca/api/rates/ingest
Headers: Authorization: Bearer <SYNC_API_KEY>
Body: { "rates": [...], "scraped_at": "2026-03-01T10:00:00Z" }
```

This is the cleanest approach because:
- No SSH keys or tunnels to manage
- The API can validate data server-side before inserting
- It triggers Next.js ISR revalidation automatically after insert
- Easy to monitor via API logs
- Works from any machine (your PC, a backup PC, or eventually a VPS if you migrate later)

**Local Windows project structure:**

```
C:\MortgageRates\
├── scraping/
│   ├── config/
│   │   ├── lenders.yaml              # All lender URLs, scrape methods, schedules
│   │   ├── openclaw_config.json      # OpenClaw browser profiles & settings
│   │   └── sync.yaml                 # Hostinger API URL, credentials
│   ├── scrapers/
│   │   ├── base.py                   # BaseScraper class (OpenClaw integration)
│   │   ├── rbc.py                    # RBC-specific scraper
│   │   ├── td.py                     # TD-specific scraper
│   │   ├── bmo.py                    # BMO-specific scraper
│   │   ├── scotiabank.py
│   │   ├── cibc.py
│   │   ├── nesto.py
│   │   ├── tangerine.py
│   │   └── boc_api.py               # Bank of Canada Valet API (no browser needed)
│   ├── pipeline/
│   │   ├── normalizer.py            # Standardize raw rates to common schema
│   │   ├── validator.py             # Cross-reference, range checks, anomaly detection
│   │   └── sync.py                  # Push validated data to Hostinger Cloud
│   ├── storage/
│   │   ├── local_db.py              # SQLite staging database
│   │   └── exports/                 # JSON export files (backup)
│   ├── monitoring/
│   │   ├── alerts.py                # Email/Slack notifications on failures
│   │   └── dashboard.py             # Optional local Flask dashboard for scrape status
│   ├── main.py                      # Entry point: scrape → normalize → validate → sync
│   ├── requirements.txt
│   └── run_scrape.bat               # Windows batch file triggered by Task Scheduler
├── social-engine/                   # Social media content automation (also local)
│   └── ...                          # (see Section 11.7 for structure)
└── logs/
    └── scrape_YYYYMMDD_HHMM.log    # Rotating log files
```

**Windows Task Scheduler setup:**

```
Task: MortgageRateScrape
Trigger: Every 6 hours (06:00, 12:00, 18:00, 00:00)
Action: Run C:\MortgageRates\scraping\run_scrape.bat
Settings:
  - "Wake the computer to run this task" → enabled
  - "Run whether user is logged on or not" → enabled
  - "If the task fails, restart every 15 minutes, up to 3 times"

# run_scrape.bat contents:
@echo off
cd C:\MortgageRates\scraping
python main.py --all 2>> ..\logs\scrape_%date:~-4%%date:~4,2%%date:~7,2%.log
```

**BoC rate decision day override:**
On the 8 scheduled Bank of Canada rate announcement days per year, temporarily
increase frequency to every 30 minutes. You can set this up as a separate
Task Scheduler entry triggered on specific dates, or toggle it manually via:
```bash
python main.py --turbo  # scrapes every 30 min until you stop it
```

#### Tier 3: Aggregator Cross-Referencing (Validation & Gap-Filling)

Existing aggregator sites already do the work of collecting rates from many lenders. Use them as a secondary validation source, NOT as a primary data source (to avoid dependency and ToS issues).

| Aggregator | URL | Coverage | Use As |
|---|---|---|---|
| **Ratehub.ca** | ratehub.ca/banks/bank-mortgage-rates | Big 6 + dozens of lenders | Cross-reference / validation |
| **WOWA.ca** | wowa.ca/mortgage-rates | 40+ lenders | Cross-reference / validation |
| **Rates.ca** | rates.ca/mortgage-rates | Multiple lenders + brokers | Cross-reference / gap-filling |
| **Superbroker.ca** | superbroker.ca/mortgage-rates | Broker channel rates | Broker rate benchmarks |

**Important legal/ethical notes on aggregator scraping:**
- Check each site's `robots.txt` (e.g., `ratehub.ca/robots.txt`, `wowa.ca/robots.txt`) before scraping
- Review their Terms of Service for explicit prohibitions on automated data collection
- Scrape at low frequency (1x/day max) and respect rate limits
- Do NOT present aggregator-sourced data as your own primary data
- Use aggregator data primarily for validation: if your direct scrape of RBC says 4.59% but Ratehub and WOWA both show 4.49%, your scraper may have a bug
- Long-term goal: replace aggregator dependency entirely with direct lender scraping

#### Tier 4: Affiliate & Partnership Data Feeds (Best Long-Term Source)

As your site grows, the highest-quality rate data comes from direct partnerships with lenders and broker networks. They have an incentive to give you accurate data because you're sending them leads.

**Immediate opportunities:**
- **Nesto affiliate program:** Email partnerships@nesto.ca — their affiliate dashboard may include rate data feeds. Nesto is positioning itself as a "mortgage ecosystem" with B2B data capabilities.
- **Mortgage broker networks (Mortgage Alliance, Dominion Lending):** Once you have traffic, broker networks will share rate sheets to get listed on your site.
- **CJ Affiliate / Impact.com:** Some lender affiliate programs include product data feeds with current rates.

**Medium-term (once you have 10k+ monthly sessions):**
- Direct outreach to monoline lenders (MCAP, First National, CMLS) — they want broker and aggregator exposure
- Credit union partnerships — many smaller credit unions don't appear on competitor sites, giving you exclusive rate data
- Rate sheet automation: some lenders distribute daily rate sheets via email — build an email parser that automatically ingests these

**Long-term:**
- Build an "Add Your Rates" self-serve portal where smaller lenders/brokers can submit their own rates
- This becomes a flywheel: more lenders listed → more traffic → more lenders want to be listed

### Validation & Accuracy Pipeline

```
┌─────────────────────────────────────────────────────────┐
│                   MULTI-SOURCE VALIDATION                │
│                                                          │
│  For each lender + product + term combination:           │
│                                                          │
│  1. Primary: Direct lender scrape                        │
│  2. Cross-ref: Aggregator check (Ratehub, WOWA)         │
│  3. Benchmark: BoC Valet API market averages             │
│                                                          │
│  Validation rules:                                       │
│  ✓ Rate within ±0.50% of BoC benchmark for that term    │
│  ✓ Rate matches at least 1 aggregator (±0.05% tolerance)│
│  ✓ Rate changed by <0.50% from last scrape              │
│  ✓ Rate is positive and in realistic range (1%–10%)     │
│                                                          │
│  If any check fails → flag for manual review             │
│  If all checks pass → auto-publish to site               │
│                                                          │
│  Anomaly alerts:                                         │
│  • Slack/email notification if a rate jumps >0.25%       │
│  • Alert if a lender's rates go missing (scraper broke)  │
│  • Alert if BoC benchmark shifts significantly           │
│  • Weekly summary: rates collected vs. expected           │
└─────────────────────────────────────────────────────────┘
```

**"Last updated" transparency:**
Every rate on the site shows "Last verified: [timestamp]" — this builds trust and differentiates from competitors who don't show freshness. If a rate is >24 hours old, show a warning badge.

**User-powered error reporting:**
Add a "Report incorrect rate" button on every rate row. User reports trigger an immediate re-scrape of that lender and cross-reference against aggregators. This is a free QA layer.

### Data Freshness Schedule

| Data Source | Scrape Frequency | Rationale |
|---|---|---|
| Big 5 bank rates | Every 6 hours | Banks update rates frequently, especially around BoC decisions |
| Monoline/digital lender rates | Every 12 hours | Less frequent changes, lower scraping overhead |
| Credit union rates | Once daily | Rates change less often |
| BoC Valet API | Once daily | Weekly publication, daily check ensures no missed updates |
| Aggregator cross-reference | Once daily | Validation only, not primary source |
| BoC rate decision days | Every 30 minutes (day-of) | Rates change rapidly on decision days — crank up frequency |

### Key Canadian Lenders to Target (MVP → Full)

**MVP (15 lenders — Weeks 1–4):**
Big 5 Banks: RBC, TD, BMO, Scotiabank, CIBC
Monolines: MCAP, First National, THINK Financial
Digital/Online: Nesto, Tangerine, EQ Bank, Simplii
Credit Unions: Desjardins, Meridian

**Expansion (25+ lenders — Weeks 17+):**
Additional monolines: CMLS, RMG, Merix Financial, Lendwise
More credit unions: Vancity, Coast Capital, Conexus, Servus
Additional digital: Pine, Homewise, Perch
Broker networks: Mortgage Alliance, Dominion Lending Centres

### Data Schema (Simplified)

*Note: Schema shown in standard SQL. If using Hostinger's managed MySQL, replace `UUID` with `CHAR(36)` or use auto-increment `INT` primary keys. If using external PostgreSQL (Neon/Supabase), use as-is. Prisma/Drizzle ORM abstracts these differences.*

```sql
-- Lenders
CREATE TABLE lenders (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT CHECK (type IN ('bank', 'credit_union', 'monoline', 'broker', 'digital')),
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate Products
CREATE TABLE rate_products (
  id UUID PRIMARY KEY,
  lender_id UUID REFERENCES lenders(id),
  term_months INT NOT NULL,          -- 12, 24, 36, 48, 60, etc.
  rate_type TEXT CHECK (rate_type IN ('fixed', 'variable')),
  mortgage_type TEXT CHECK (mortgage_type IN ('insured', 'insurable', 'uninsured')),
  rate DECIMAL(5,3) NOT NULL,        -- e.g. 4.590
  posted_rate DECIMAL(5,3),          -- bank's "posted" rate for comparison
  effective_date DATE NOT NULL,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  prepayment_privilege TEXT,
  portability BOOLEAN,
  penalties_info TEXT,
  min_down_payment DECIMAL(5,2),
  source_url TEXT,
  is_current BOOLEAN DEFAULT TRUE
);

-- Rate History (for charts and trends)
CREATE TABLE rate_history (
  id UUID PRIMARY KEY,
  lender_id UUID REFERENCES lenders(id),
  term_months INT,
  rate_type TEXT,
  rate DECIMAL(5,3),
  recorded_at DATE NOT NULL
);

-- Lead Captures
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  email TEXT,
  province TEXT,
  mortgage_amount DECIMAL(12,2),
  purchase_price DECIMAL(12,2),
  down_payment DECIMAL(12,2),
  mortgage_type TEXT,
  preferred_term INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);
```

---

## 5. SEO Strategy (This Is Your Growth Engine)

Mortgage rate comparison is an extremely competitive SEO space. Here's the playbook:

### 5.1 Keyword Targets

| Priority | Keyword Cluster | Monthly Volume (est.) |
|---|---|---|
| P0 | "best mortgage rates canada" | 12,000+ |
| P0 | "current mortgage rates canada" | 8,000+ |
| P0 | "5 year fixed mortgage rate" | 6,000+ |
| P1 | "variable vs fixed mortgage canada" | 3,000+ |
| P1 | "mortgage rates [province]" (x10) | 1,000+ each |
| P1 | "first time home buyer canada" | 5,000+ |
| P2 | "[lender name] mortgage rates" (x20+) | 500+ each |
| P2 | "mortgage renewal rates" | 2,000+ |
| P2 | "mortgage calculator canada" | 10,000+ |

### 5.2 Page Architecture for SEO

```
/                           → Homepage (best rates overview)
/rates                      → Full rate comparison table
/rates/fixed                → Fixed rates filtered view
/rates/variable             → Variable rates filtered view
/rates/[province]           → Province-specific rates (x13)
/calculators/mortgage       → Payment calculator
/calculators/affordability  → Affordability calculator
/calculators/land-transfer  → Land transfer tax calc
/calculators/cmhc           → CMHC insurance calc
/lenders/[slug]             → Individual lender pages (x25+)
/guides/first-time-buyer    → Comprehensive guides
/guides/renewal             → Renewal guide
/guides/refinance           → Refinance guide
/guides/variable-vs-fixed   → Comparison guide
/blog/[slug]                → Weekly rate commentary, news
/glossary                   → Mortgage term definitions
```

### 5.3 Technical SEO Essentials
- Server-side rendering (Next.js SSR/SSG) — critical for rate pages
- Structured data (JSON-LD): `FinancialProduct`, `FAQPage`, `BreadcrumbList`
- Canonical URLs, proper hreflang (en-CA, fr-CA if adding French)
- Fast Core Web Vitals (LiteSpeed caching on Hostinger Cloud, optimized images, minimal JS)
- XML sitemap auto-generation
- Internal linking strategy between rates, guides, and calculator pages

---

## 6. Monetization Strategy

### 6.1 Affiliate Marketing (Primary active revenue)

Affiliate marketing is the highest-value revenue channel for a mortgage rate comparison site. You earn commissions when users click through your site to a lender or broker and complete an action (application, funded mortgage, etc.).

**Revenue models:**

| Model | How It Works | Typical Payout |
|---|---|---|
| **CPA (Cost Per Acquisition)** | Lender pays per funded mortgage or completed application | $50–$200+ per funded mortgage |
| **CPL (Cost Per Lead)** | Lender pays per qualified lead (form submission) | $15–$75 per lead |
| **CPC (Cost Per Click)** | Earn per click-through to lender application page | $0.50–$5.00 per click |
| **Revenue share** | Percentage of the lender's revenue from referred customers | Varies, long-term upside |

**Canadian mortgage affiliate networks and partners:**

| Partner Type | Examples | How to Join |
|---|---|---|
| **Mortgage broker networks** | Mortgage Alliance, Dominion Lending Centres, Mortgage Architects | Direct outreach — they have referral programs |
| **Digital mortgage platforms** | Nesto, Pine, THINK Financial (CanWise), Perch | Most have affiliate/partner programs on their websites |
| **Big 5 banks** | RBC, TD, BMO, Scotiabank, CIBC | Typically through affiliate networks (CJ, Impact, Rakuten) |
| **Affiliate networks** | CJ Affiliate, Impact.com, Rakuten Advertising, ShareASale | Sign up and search for Canadian mortgage/finance offers |
| **Insurance cross-sell** | Home insurance, life insurance, CMHC | Additional revenue from related financial products |

**Affiliate integration points on the website:**

- **Rate comparison table:** Each lender row has a "View Rate" or "Apply" button → affiliate link with tracking
- **Lender profile pages:** "Apply Now" CTAs with affiliate attribution
- **Calculator results:** "Get this rate from [Lender]" buttons after calculating payments
- **Blog/guide content:** Contextual links like "See today's best rates from Nesto" within educational articles
- **Rate alert emails:** "This rate is now available — apply here" with affiliate tracking
- **Comparison tools:** "We recommend [Lender] based on your criteria" with affiliate CTA

**Affiliate link tracking:**

```
All affiliate links pass through your internal redirect:
  latestmortgagerates.ca/go/nesto?utm_source=rate_table&utm_term=5yr_fixed

Your server logs:
  - Click timestamp
  - Source page (rate table, blog post, calculator, email, social media)
  - Lender and product clicked
  - User session ID (anonymized)
  - UTM parameters

This data feeds into GA4 as custom events for revenue attribution.
```

**Affiliate revenue in social media content:**

- YouTube video descriptions include affiliate links: "Get today's best rate from Nesto → [link]"
- Instagram/TikTok bio link (Linktree or custom landing page) routes to rate comparison with affiliate tracking
- X posts link to rate table with UTM parameters for tracking social-driven affiliate clicks
- Facebook Group posts can include "Check if you qualify" affiliate links
- All social-driven affiliate clicks are tracked in GA4 with `utm_source=social&utm_medium=[platform]`

**Compliance for affiliate marketing:**

- **Disclosure required:** Canadian Competition Bureau and FTC (if US traffic) require clear disclosure
- Add "Affiliate Disclosure" page explaining that you earn commissions
- Include inline disclosure on pages with affiliate links: "We may earn a commission when you apply through our links. This doesn't affect our rankings."
- YouTube videos must include verbal + written disclosure ("This video contains affiliate links")
- FTC and Ad Standards Canada require disclosure to be clear and conspicuous, not buried in fine print

### 6.2 Google AdSense (Primary passive revenue — active from launch)
- Display ads via Google AdSense integrated across all pages (see Section 2.3 for placement strategy)
- Finance/mortgage niche has among the highest CPMs in AdSense ($10–50+ RPM)
- Apply for AdSense once site has 15–20 pages of quality content
- Optimize placements over time using GA4 revenue-per-page data
- Consider upgrading to Google Ad Manager or Mediavine once at 50k+ sessions/mo for higher fill rates
- Sponsored lender profiles (direct-sold ads at premium rates)

### 6.3 Newsletter Sponsorship (Tertiary)
- Weekly rate update newsletter with sponsored content slots

---

## 7. Legal & Compliance Considerations

- **PIPEDA compliance:** Privacy policy, cookie consent banner (required for GA4 and AdSense), data handling for leads
- **CASL (Canadian Anti-Spam Law):** Double opt-in for email signups (rate alerts, newsletter)
- **Mortgage broker licensing:** If you're recommending specific products, consult a lawyer about whether you need FSRA (Ontario) or equivalent provincial registration
- **Disclaimer:** "Rates shown are for informational purposes only. Always confirm rates directly with the lender."
- **Affiliate disclosure:** Required by Canadian Competition Bureau and FTC — dedicated Affiliate Disclosure page + inline disclosures on all pages with affiliate links. YouTube videos require verbal + written disclosure.
- **AdSense compliance:** Must meet Google Publisher Policies — no thin content pages, no misleading ad placement, no incentivized clicks
- **Accessibility:** WCAG 2.1 AA compliance (AODA in Ontario requires this)
- **French language:** Consider bilingual support for Quebec market (not MVP, but important for growth)
- **Terms of service** for scraping: Review each lender's ToS; some may prohibit scraping — consider reaching out for official data partnerships

---

## 8. Development Phases

### Phase 1: Foundation (Weeks 1–4)
- [ ] Purchase Hostinger Cloud Hosting plan + register latestmortgagerates.ca domain
- [ ] Enable Node.js in hPanel, configure application root and startup file
- [ ] Set up MySQL database via hPanel (or connect external PostgreSQL via Neon/Supabase)
- [ ] Configure Hostinger professional email (info@latestmortgagerates.ca, hello@latestmortgagerates.ca) with SPF/DKIM/DMARC
- [ ] Set up Next.js project with TypeScript, Tailwind, shadcn/ui
- [ ] Design and implement database schema (MySQL or PostgreSQL)
- [ ] Build rate ingest API endpoint on Hostinger (POST /api/rates/ingest with API key auth)
- [ ] Set up local Windows scraping environment: install Python 3.12+, Node.js 22+, OpenClaw, Chromium
- [ ] Build Python scraping engine with OpenClaw integration (start with 5 major lenders)
- [ ] Build normalization layer, validation pipeline, and Hostinger sync client
- [ ] Configure Windows Task Scheduler to run scraping every 4–6 hours
- [ ] Build lender data model and seed initial lender profiles
- [ ] Set up FTP/SFTP deployment workflow (FileZilla or WinSCP on Windows → Hostinger Cloud)
- [ ] Create deploy.bat script for one-click build-and-upload from Windows PC

### Phase 2: Core Product (Weeks 5–8)
- [ ] Rate comparison table with filtering and sorting
- [ ] Individual lender profile pages
- [ ] Mortgage payment calculator
- [ ] Basic responsive layout and design system
- [ ] Rate detail expansion panels
- [ ] Historical rate chart (per lender/term)

### Phase 3: SEO, Content & Monetization (Weeks 9–12)
- [ ] Set up MDX or Sanity CMS for blog/guides
- [ ] Write 10 core guide pages (first-time buyer, renewal, etc.)
- [ ] Implement JSON-LD structured data on all pages
- [ ] Province-specific rate pages
- [ ] XML sitemap, robots.txt, meta tags
- [ ] Implement Google Analytics 4 (GA4) with custom event tracking (rate filters, calc usage, lender clicks)
- [ ] Set up GA4 consent mode + cookie consent banner (PIPEDA compliance)
- [ ] Google Search Console setup and verification
- [ ] Apply for Google AdSense (once 15–20 quality pages are live)
- [ ] Implement AdSense ad units: leaderboard, in-content, sidebar, anchor (mobile)
- [ ] Link GA4 to AdSense for revenue-per-page reporting

### Phase 4: Growth & Monetization Features (Weeks 13–16)
- [ ] Email rate alert system (Hostinger email + Resend for transactional volume)
- [ ] Affordability calculator
- [ ] CMHC insurance calculator
- [ ] Land transfer tax calculator
- [ ] Lead capture form → partner broker routing
- [ ] Sign up for affiliate networks (CJ Affiliate, Impact.com) and direct lender programs (Nesto, Pine, etc.)
- [ ] Build internal affiliate link redirect system (/go/[lender]) with click tracking
- [ ] Integrate affiliate CTAs into rate table, lender pages, calculator results, and blog content
- [ ] Set up GA4 custom events for affiliate link clicks (lender, product, source page)
- [ ] Create Affiliate Disclosure page and add inline disclosure to pages with affiliate links
- [ ] Add affiliate links to YouTube descriptions, social bio links, and email templates

### Phase 5: Social Media Automation Pipeline (Weeks 13–18, parallel with Phase 4)
- [ ] Build Python content generation engine (generators, context assembler, brand voice config)
- [ ] Integrate Claude API for AI-powered draft generation across all platforms
- [ ] Build asset generator (rate card graphics with Pillow, trend charts with matplotlib)
- [ ] Build FFmpeg-based short-form video assembler (image sequences + captions → MP4)
- [ ] Build review dashboard (Flask/Next.js) with approve/edit/reject/regenerate workflow
- [ ] Integrate platform publishing APIs (X, Facebook, YouTube, Instagram, TikTok)
- [ ] Set up cron triggers: daily rate change detection → content generation → review queue
- [ ] Set up weekly batch trigger: Monday overnight generation of the full week's content
- [ ] Add email/Slack notifications when new content batch is ready for review
- [ ] Set up YouTube channel, TikTok, Instagram, X, Facebook page + group
- [ ] Design branded templates and configure brand voice YAML for AI
- [ ] Film and publish first 4 YouTube long-form videos (backlog before launch)
- [ ] Run 2-week pilot: generate → review → publish cycle, tune AI prompts based on edit patterns

### Phase 6: Scale & Monetize (Weeks 19+)
- [ ] Expand to 25+ lenders
- [ ] A/B testing on CTAs and rate table layout
- [ ] French language support (Quebec market)
- [ ] Mobile app consideration (PWA first)
- [ ] Lender partnership outreach for direct data feeds
- [ ] Optimize AdSense placements using GA4 revenue-per-page data
- [ ] A/B test ad density and placement positions for RPM vs. bounce rate balance
- [ ] Upgrade Hostinger Cloud plan tier as traffic grows
- [ ] Evaluate upgrading from AdSense to Google Ad Manager or Mediavine at 50k+ sessions/mo
- [ ] Build analytics feedback loop: feed top-performing content patterns back into AI generator
- [ ] Add A/B content testing: generate 2 variants per post, approve your preferred version
- [ ] Explore YouTube monetization (ads) once 1K subs + 4K watch hours reached
- [ ] Launch "Share your result" social cards from calculators
- [ ] Create embeddable rate widget for realtors/bloggers (backlink strategy)
- [ ] Refine AI prompts quarterly based on rejection/edit patterns from review dashboard

---

## 9. Estimated Costs (Monthly, Post-Launch)

| Service | Cost |
|---|---|
| Hostinger Cloud Hosting (hosting, email, MySQL DB, SSL — all managed) | $10–30/mo (scales with plan tier) |
| Hostinger .ca domain registration | ~$12–15/yr |
| Google Analytics 4 | Free |
| Google AdSense | Free (revenue-generating) |
| CMS (Sanity, if used) | $0–99/mo |
| Resend (transactional email for rate alerts at scale) | $0–20/mo |
| Social media automation (Claude API, CapCut, Descript, Canva, VidIQ) | $90–150/mo |
| **Total** | **~$100–300/mo** |

---

## 10. Competitive Advantages to Pursue

1. **Speed to update:** Scrape more frequently than competitors, show "last updated X minutes ago"
2. **Transparency:** Show rate history charts, explain penalties clearly — NerdWallet doesn't do this well for Canada
3. **Calculator depth:** Stress test calc, CMHC calc, provincial LTT calc — tools people actually need
4. **Canadian-first:** Many competitors are US companies with a Canadian section bolted on — build for Canada from day one
5. **Broker-neutral tone:** Don't feel like a sales funnel — earn trust through useful content
6. **Rate alerts:** Most competitors don't offer automated email alerts for rate drops

---

## 11. Social Media & Content Marketing Strategy

Social media is a critical acquisition channel alongside SEO — especially for reaching younger first-time buyers and building brand trust in a space dominated by faceless comparison sites. The goal: become the recognizable "mortgage rate person" that Canadians follow and share.

### 11.1 Platform Strategy Overview

| Platform | Format | Posting Cadence | Primary Audience | Goal |
|---|---|---|---|---|
| **YouTube (long-form)** | 8–15 min educational videos | 1–2x/week | First-time buyers, renewers doing research | Authority building, SEO (YouTube is the 2nd largest search engine) |
| **YouTube Shorts** | 30–60 sec rate updates, tips | 3–5x/week | Broad Canadian audience | Discovery, channel growth, funnel to long-form |
| **Instagram Reels** | 15–60 sec visual tips, rate cards | 4–5x/week | Millennials & Gen Z (25–40), first-time buyers | Brand awareness, shareability |
| **TikTok** | 15–60 sec punchy mortgage tips | 5–7x/week | Gen Z & young millennials (20–35) | Viral reach, brand personality |
| **X (Twitter)** | Text posts, threads, rate charts | 1–3x/day | Finance-savvy Canadians, realtors, brokers | Real-time rate commentary, industry credibility |
| **Facebook** | Posts, articles, rate graphics | 3–5x/week | Older millennials & Gen X (35–55), renewers | Community building, link sharing to site |

### 11.2 Content Pillars

All social content should map to one of these five pillars, which align with the website's value proposition:

**Pillar 1: Rate Updates & Market Commentary ("The Numbers")**
Weekly or breaking rate change content that positions you as the go-to source for what's happening.

- "This week's best 5-year fixed rates ranked"
- "Bank of Canada just held rates — here's what it means for your mortgage"
- Rate comparison graphics (carousel or single image)
- BoC decision day live commentary threads (X)

**Pillar 2: Mortgage Education ("The Explainers")**
Break down complex mortgage concepts into digestible, shareable content.

- "Fixed vs. variable in 60 seconds" (Shorts/Reels/TikTok)
- "What the stress test actually does to your buying power" (YouTube long-form)
- "5 mortgage penalties that will surprise you" (carousel)
- Glossary-style "Mortgage term of the week" series

**Pillar 3: Calculator & Tool Demos ("The How-To")**
Showcase the website's calculators and tools — drives traffic directly.

- Screen recordings walking through the mortgage calculator
- "Here's how much house you can afford on $80K in Toronto" (uses the affordability calc)
- "I calculated the CMHC insurance on a $500K home — the number is wild"
- Before/after scenarios using the comparison tool

**Pillar 4: Canadian Housing Market Context ("The Big Picture")**
Tap into the housing affordability conversation that dominates Canadian social media.

- Province-specific affordability breakdowns
- "What $500K gets you in every province" (visual series)
- Reactions to housing policy announcements
- Myth-busting content ("No, you don't need 20% down")

**Pillar 5: Real Stories & Community ("The Human Side")**
Build trust and relatability — mortgage content doesn't have to be dry.

- First-time buyer success stories / case studies
- "I saved $X by switching from my bank's posted rate" testimonials
- Q&A sessions answering audience questions
- "Rate negotiation tips that actually work"

### 11.3 YouTube Strategy (Long-Form)

**Channel positioning:** "Canada's mortgage rate channel" — think of it as the video version of your website's guides section.

**Content types and examples:**

| Type | Example Titles | Length | Frequency |
|---|---|---|---|
| Rate roundups | "Best Mortgage Rates This Week (March 2026)" | 8–12 min | Weekly |
| Deep explainers | "Variable vs Fixed Mortgages: The Complete Canadian Guide" | 12–20 min | 1–2x/month |
| Calculator walkthroughs | "How Much House Can You Actually Afford? (Calculator Demo)" | 8–15 min | 2x/month |
| BoC decision analysis | "Bank of Canada Rate Decision — What It Means For Your Mortgage" | 8–12 min | 8x/year (per decision) |
| Province spotlights | "Buying Your First Home in Ontario: Complete 2026 Guide" | 15–25 min | Monthly |
| Lender reviews | "Is Nesto Actually Better Than Your Bank? Honest Review" | 10–15 min | 2x/month |

**YouTube SEO tips:**
- Title-optimize for search queries people actually type ("best mortgage rate canada 2026")
- First 30 seconds must hook — open with the conclusion/number, then explain
- Add timestamps/chapters for longer videos
- End cards linking to website calculators
- Pin comment with link to the full rate comparison table on your site

### 11.4 Short-Form Video Strategy (YouTube Shorts, Reels, TikTok)

Short-form is the discovery engine. It's how new audiences find you. The content should be snackable, opinionated, and shareable.

**Format templates (reuse across all 3 platforms):**

| Template | Structure | Example |
|---|---|---|
| **Rate Flash** | "Today's best rate is X% — here's who's offering it" + quick graphic | Weekly rate update, 15–30 sec |
| **Myth Buster** | "Everyone thinks [myth]... but actually [truth]" | "You don't need 20% down — here's the real minimum", 30–45 sec |
| **Quick Math** | Screen record of calculator + surprising result | "I put $100K salary into the affordability calc — the result shocked me", 30–60 sec |
| **Hot Take** | Opinionated reaction to news, policy, or trend | "The new FHSA is overrated — here's why", 30–45 sec |
| **Tip of the Day** | One actionable mortgage tip with on-screen text | "Ask your lender about blend-and-extend — it could save you thousands", 15–30 sec |
| **Comparison** | Side-by-side split screen or swipe format | "Big bank rate vs. monoline rate for the exact same mortgage", 30–45 sec |

**Cross-posting workflow:**
1. Film vertically (9:16) once
2. Edit with CapCut, Descript, or similar
3. Export 3 versions: TikTok (with TikTok-native captions), Reels (clean), Shorts (clean)
4. Post to TikTok first (best organic reach), then Reels and Shorts same day or next day
5. Repurpose audio/script as X thread or Facebook post

**Posting schedule:**

| Day | TikTok | Reels | Shorts |
|---|---|---|---|
| Mon | Tip of the Day | Tip of the Day | — |
| Tue | Rate Flash | — | Rate Flash |
| Wed | Myth Buster | Myth Buster | Myth Buster |
| Thu | Quick Math | Quick Math | — |
| Fri | Hot Take | — | Hot Take |
| Sat | — | Comparison | Comparison |
| Sun | — | — | — |

### 11.5 X (Twitter) Strategy

X is where the real-time mortgage rate conversation happens. Realtors, brokers, and financially-engaged Canadians are active here.

**Post types:**

| Type | Format | Frequency |
|---|---|---|
| **Rate updates** | "5-year fixed just dropped to X.XX% at [lender]. That's the lowest since [date]." + link to rate table | As rates change |
| **BoC commentary** | Live thread on rate decision days with analysis | 8x/year |
| **Data threads** | "I tracked every Big 5 bank's rate changes this month. Here's what happened 🧵" (thread with charts) | Weekly |
| **Engagement posts** | "Fixed or variable right now? Reply with your pick." / Polls | 2–3x/week |
| **Link sharing** | Share new blog posts, calculator tools, guide pages with a hook | As published |
| **Quote tweets / reactions** | React to housing news, CMHC reports, BoC statements | As they happen |

**Growth tactics on X:**
- Engage in replies to Canadian housing/mortgage conversations
- Build relationships with realtor and broker accounts (they'll amplify your content)
- Use relevant hashtags sparingly: #cdnecon, #canadianrealestate, #mortgagerates
- Post rate comparison images/charts (visual posts get 2–3x more engagement)

### 11.6 Facebook Strategy

Facebook skews older but is still where many Canadians aged 35–55 discover and share financial content — exactly the renewal and refinance audience.

**Post types:**

| Type | Format | Frequency |
|---|---|---|
| **Rate graphics** | Branded rate comparison card image with top 5 rates | 2x/week |
| **Article shares** | Link to blog posts/guides with a conversational caption | 2–3x/week |
| **Calculator CTAs** | "Wondering if you should break your mortgage? Use our penalty calculator →" | 1x/week |
| **Engagement questions** | "When does your mortgage renew? Start comparing rates 120 days before." | 1–2x/week |
| **Video reposts** | Share YouTube videos and select Reels natively | 1–2x/week |

**Facebook-specific tactics:**
- Create a Facebook Group (e.g., "Canadian Mortgage Rate Watchers") for community
- Groups drive significantly more reach than pages in 2026
- Share rate updates, answer questions, build trust
- Eventually the group becomes a lead generation engine itself

### 11.7 Semi-Automated Content Pipeline (Python + AI)

The content production system is built as a Python pipeline that uses AI to generate drafts across all platforms, then queues everything into a review dashboard where you approve, edit, or reject before anything is published. Nothing goes live without your explicit approval.

#### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATA TRIGGERS (automated)                    │
│                                                                  │
│  • Scheduled cron (daily/weekly)                                 │
│  • BoC rate decision event                                       │
│  • Rate change detected by scraping pipeline                     │
│  • New blog post published on site                               │
│  • Manual trigger via CLI ("generate content about X")           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CONTENT GENERATION ENGINE (Python)               │
│                                                                  │
│  1. Context Assembler                                            │
│     → Pulls latest rate data from MySQL / database               │
│     → Pulls rate history / deltas for trend context              │
│     → Fetches recent BoC statements, housing news (RSS/API)     │
│     → Loads brand voice guidelines + platform-specific rules     │
│                                                                  │
│  2. AI Content Generator (Claude API / OpenAI API)               │
│     → Generates platform-specific drafts per content pillar      │
│     → X: post text + alt text for rate chart images              │
│     → Facebook: post caption + link preview text                 │
│     → TikTok/Reels/Shorts: script + on-screen text overlays     │
│     → YouTube: title, description, script outline, tags          │
│     → Applies brand voice, tone, and length constraints          │
│                                                                  │
│  3. Asset Generator                                              │
│     → Rate comparison graphics (Pillow / matplotlib → PNG)       │
│     → Rate trend charts (matplotlib/plotly → PNG/MP4)            │
│     → Thumbnail generation with text overlays (Pillow)           │
│     → Short-form video assembly (FFmpeg: images + captions       │
│       + background music → MP4) for simple visual videos         │
│                                                                  │
│  4. Hashtag & SEO Optimizer                                      │
│     → Platform-specific hashtag suggestions                      │
│     → YouTube title/tag optimization via AI                      │
│     → Optimal posting time recommendation (from analytics API)   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   REVIEW QUEUE (web dashboard)                   │
│                                                                  │
│  Built as a simple Next.js admin page or standalone Flask app.   │
│  All generated content lands here in "pending review" state.     │
│                                                                  │
│  For each content item you see:                                  │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Platform: TikTok          Status: ⏳ Pending Review   │      │
│  │  Pillar: Rate Update       Scheduled: Mar 3, 10:00 AM │      │
│  │                                                        │      │
│  │  Script:                                               │      │
│  │  "Today's best 5-year fixed is 4.29% from Nesto —     │      │
│  │   that's 0.15% lower than last week..."               │      │
│  │                                                        │      │
│  │  On-screen text: "5yr Fixed: 4.29% 📉"                │      │
│  │  Hashtags: #mortgagerates #canada #firsttimebuyer      │      │
│  │                                                        │      │
│  │  [Preview Asset]  [Edit ✏️]  [Approve ✅]  [Reject ❌] │      │
│  └────────────────────────────────────────────────────────┘      │
│                                                                  │
│  Actions:                                                        │
│  • Edit: opens inline editor for text, captions, hashtags        │
│  • Approve: moves to "scheduled" queue for publishing            │
│  • Reject: discards with optional feedback (fed back to AI       │
│    for style learning)                                           │
│  • Regenerate: re-runs AI generation with your notes             │
│  • Bulk approve: select multiple items and approve at once       │
│                                                                  │
│  Filters: by platform, pillar, status, date range                │
│  Notifications: email/Slack alert when new batch is ready        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼  (only after explicit approval)
┌─────────────────────────────────────────────────────────────────┐
│                   PUBLISHING ENGINE (Python)                     │
│                                                                  │
│  Posts approved content via platform APIs:                        │
│                                                                  │
│  • X (Twitter) API v2  → text posts, image posts, threads       │
│  • Facebook Graph API  → page posts, group posts, link shares   │
│  • YouTube Data API v3 → video uploads, Shorts, metadata        │
│  • Instagram Graph API → Reels (via Meta Business Suite API)    │
│  • TikTok Content API  → video uploads with captions            │
│                                                                  │
│  Features:                                                       │
│  • Respects platform rate limits and best posting times          │
│  • Retry logic with exponential backoff                          │
│  • Publishes to scheduled time slot or immediately               │
│  • Logs every publish with post ID for analytics tracking        │
│  • Rollback: can delete a post if you spot an issue post-publish │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                 ANALYTICS & FEEDBACK LOOP                         │
│                                                                  │
│  • Pulls engagement metrics from each platform API               │
│  • Tracks: impressions, clicks, saves, shares, comments          │
│  • Weekly performance report (auto-generated)                    │
│  • Feeds top-performing content patterns back into the AI        │
│    generator as style examples for future content                │
│  • A/B tracking: which pillar/format/time performs best          │
└─────────────────────────────────────────────────────────────────┘
```

#### Python Project Structure

```
social-engine/
├── config/
│   ├── brand_voice.yaml          # Tone, vocabulary, dos/don'ts
│   ├── platforms.yaml             # API keys, posting rules per platform
│   └── schedules.yaml             # Default posting cadence per platform
├── generators/
│   ├── base.py                    # Base content generator class
│   ├── rate_update.py             # Pillar 1: rate flash, weekly roundup
│   ├── explainer.py               # Pillar 2: educational content
│   ├── calculator_demo.py         # Pillar 3: tool walkthroughs
│   ├── market_context.py          # Pillar 4: housing market commentary
│   └── community.py               # Pillar 5: Q&A, stories
├── assets/
│   ├── graphics.py                # Rate card / chart image generation
│   ├── thumbnails.py              # YouTube thumbnail generator
│   └── video_assembler.py         # FFmpeg-based short video builder
├── publishers/
│   ├── twitter.py                 # X API v2 client
│   ├── facebook.py                # Facebook Graph API client
│   ├── youtube.py                 # YouTube Data API client
│   ├── instagram.py               # Instagram Graph API client
│   └── tiktok.py                  # TikTok Content API client
├── review/
│   ├── dashboard/                 # Next.js or Flask review UI
│   ├── models.py                  # ContentItem, ReviewStatus, etc.
│   └── notifications.py           # Email/Slack alerts for review queue
├── analytics/
│   ├── collectors.py              # Pull metrics from platform APIs
│   ├── reports.py                 # Weekly performance summaries
│   └── feedback_loop.py           # Feed winning patterns back to AI
├── data/
│   ├── rate_fetcher.py            # Pulls latest rates from main DB
│   └── news_fetcher.py            # RSS/API for housing news context
├── cli.py                         # Manual trigger: "python cli.py generate --pillar rate_update"
├── scheduler.py                   # Cron-based automated generation triggers
└── requirements.txt
```

#### Key Python Libraries

| Library | Purpose |
|---|---|
| `anthropic` or `openai` | AI content generation (Claude API recommended for quality) |
| `Pillow` | Rate card and graphic image generation |
| `matplotlib` / `plotly` | Rate trend charts |
| `ffmpeg-python` | Short-form video assembly (image sequences + captions + music) |
| `tweepy` | X (Twitter) API v2 |
| `facebook-sdk` or `requests` | Facebook Graph API |
| `google-api-python-client` | YouTube Data API v3 |
| `httpx` | TikTok and Instagram API calls |
| `sqlalchemy` | Database access for rate data |
| `pyyaml` | Brand voice and config management |
| `celery` or `apscheduler` | Task scheduling and job queues |
| `flask` or `fastapi` | Review dashboard backend |
| `jinja2` | Email notification templates |

#### Content Generation Examples

**Example 1: Automated X post when a rate change is detected**
```python
# Triggered by rate scraping pipeline detecting a change
class RateChangeGenerator:
    def generate(self, rate_change: RateChange) -> ContentDraft:
        context = {
            "lender": rate_change.lender_name,
            "product": f"{rate_change.term_months // 12}-year {rate_change.rate_type}",
            "new_rate": rate_change.new_rate,
            "old_rate": rate_change.old_rate,
            "delta": rate_change.new_rate - rate_change.old_rate,
            "direction": "dropped" if rate_change.delta < 0 else "increased",
            "comparison": self.get_market_context(rate_change),
        }

        draft = self.ai_client.generate(
            system=self.load_brand_voice(),
            prompt=f"""Generate an X (Twitter) post about this rate change.
            Context: {json.dumps(context)}
            Rules:
            - Max 280 characters
            - Include the rate number
            - Mention direction of change
            - End with link placeholder {{RATE_TABLE_URL}}
            - Tone: informative, not salesy
            """,
        )

        # Generate rate card graphic
        graphic = self.asset_generator.create_rate_card(context)

        return ContentDraft(
            platform="twitter",
            pillar="rate_update",
            text=draft.text,
            assets=[graphic],
            status="pending_review",  # ALWAYS pending — never auto-publish
            suggested_time=self.get_optimal_post_time("twitter"),
        )
```

**Example 2: Weekly batch generation**
```python
# Runs every Monday via cron
def generate_weekly_batch():
    rates = rate_fetcher.get_weekly_summary()
    news = news_fetcher.get_weekly_housing_news()

    drafts = []

    # Generate per-platform content for the whole week
    drafts += rate_update_gen.weekly_roundup(rates)        # X thread + FB post
    drafts += explainer_gen.tip_of_the_week(rates, news)   # TikTok + Reels + Shorts scripts
    drafts += market_context_gen.weekly_take(news)          # X post + FB post
    drafts += calculator_gen.scenario_of_the_week(rates)   # Short-form video script

    # Save all to review queue
    for draft in drafts:
        draft.status = "pending_review"
        review_queue.add(draft)

    # Notify you that the batch is ready
    notifications.send(
        channel="email",  # or Slack
        message=f"{len(drafts)} content items ready for review",
        link=REVIEW_DASHBOARD_URL,
    )
```

#### Review & Approval Workflow

```
HUMAN-IN-THE-LOOP WORKFLOW
───────────────────────────

 1. AI generates content batch (triggered by cron or rate change)
                    │
                    ▼
 2. All drafts land in review queue with status: "pending_review"
    ⚠️  NOTHING is published at this point
                    │
                    ▼
 3. You receive notification (email or Slack):
    "12 new content items ready for review"
                    │
                    ▼
 4. You open the review dashboard and for each item:
    │
    ├─→ ✅ Approve as-is → moves to "scheduled" (publishes at set time)
    ├─→ ✏️  Edit → modify text/captions/hashtags → then approve
    ├─→ 🔄 Regenerate → send notes to AI ("make it shorter", "less clickbaity")
    │                    → new draft replaces old one, back to pending
    └─→ ❌ Reject → discarded (feedback stored for AI improvement)
                    │
                    ▼
 5. Only "approved" items enter the publishing queue
                    │
                    ▼
 6. Publisher posts at the scheduled time via platform APIs
                    │
                    ▼
 7. Post-publish: you can still pull/delete via dashboard if needed
```

**Safeguards:**
- Database-level constraint: `status` must be `approved` before the publisher will touch it
- Publisher runs a final check: if `approved_by` is null, it skips the item
- All approvals are timestamped and logged (audit trail)
- Optional: require re-approval if content is older than 48 hours (stale rate data)
- Emergency kill switch: one-click pause on all scheduled publishing

### 11.8 Content Production Workflow (Your Weekly Time Commitment)

With AI handling first drafts, your weekly involvement drops significantly:

```
WEEKLY WORKFLOW (SEMI-AUTOMATED)
─────────────────────────────────

Monday (~30 min)
  → AI batch runs overnight and generates the week's content
  → You receive notification: "18 items ready for review"
  → Open dashboard, review and approve/edit text-based content
    (X posts, Facebook captions, short-form scripts)

Tuesday (~2 hours)
  → Film 1 YouTube long-form video using AI-generated script outline
  → Film 2–3 short-form videos using AI-generated scripts
  → Upload raw footage; video assembler adds captions + overlays

Wednesday (~30 min)
  → Review AI-assembled short-form videos in dashboard
  → Review AI-generated thumbnails and rate graphics
  → Approve final batch — everything is now scheduled

Thursday–Sunday (~15 min/day)
  → Content publishes automatically per schedule
  → Engage with comments and replies (manual — AI doesn't reply)
  → Dashboard shows real-time engagement metrics
  → Flag any posts for takedown if needed

Total weekly time: ~4–5 hours (vs. ~15–20 hours fully manual)
```

### 11.9 Tools & Estimated Costs

| Tool | Purpose | Cost |
|---|---|---|
| **Claude API (Anthropic)** | AI content generation (scripts, captions, posts) | ~$20–50/mo (usage-based) |
| **FFmpeg** | Video assembly, caption burning | Free (open source) |
| **Pillow + matplotlib** | Rate graphics, chart generation | Free (open source) |
| **CapCut Pro** | Manual video polish when needed | Free–$10/mo |
| **Descript** | Long-form video editing, auto-captions | $24/mo |
| **Canva Pro** | Template design (initial setup), complex graphics | $17/mo |
| **TubeBuddy or VidIQ** | YouTube SEO and keyword research | $8–15/mo |
| **Review dashboard** | Hosted on Hostinger Cloud alongside main site (no extra cost) | $0 (shared) |
| **Basic camera setup** | Smartphone on tripod + ring light + lapel mic | $100–200 one-time |
| **Total ongoing** | | **~$90–150/mo** |

### 11.9 Key Metrics to Track

| Platform | Metrics | Target (First 6 Months) |
|---|---|---|
| **YouTube** | Subscribers, watch time, CTR to site | 1,000 subs, 4,000 watch hours (monetization threshold) |
| **YouTube Shorts** | Views, likes, subscriber conversion | 10K+ views/short average |
| **TikTok** | Views, followers, profile link clicks | 5,000 followers, 1 viral video (100K+ views) |
| **Instagram** | Reach, saves, profile visits, link clicks | 2,000 followers, 5%+ save rate on carousels |
| **X** | Impressions, engagements, link clicks, followers | 2,000 followers, consistent engagement |
| **Facebook** | Reach, link clicks, group members | 500 group members, consistent link traffic |
| **Cross-platform** | Website referral traffic from social | 10–15% of total site traffic from social |

### 11.10 Integration with the Website

Social media should drive traffic to the site and vice versa. Key integration points:

- Every video description and bio links to the rate comparison page
- Blog posts include "Share on X / Facebook" buttons and embeddable rate graphics
- Rate alert signup promoted in video CTAs ("Get rate drop alerts — link in description")
- Calculator results page includes "Share your result" social cards
- Weekly rate email newsletter includes links to that week's YouTube video
- Site footer and header include social links
- Consider adding an embeddable "Current Best Rate" widget that bloggers/realtors can embed (free backlinks + brand exposure)

---

## 12. Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Lenders block scraping | Build relationships for official data feeds; use multiple scraping strategies; check ToS |
| SEO takes 6–12 months | Start content early; consider paid acquisition for initial traffic |
| Affiliate revenue is slow to start | Keep costs low; don't quit day job until traction is clear |
| Rate data accuracy | Validation layer, anomaly alerts, manual spot-checks, "report an error" user feature |
| Legal risk from unlicensed advice | Strong disclaimers, consult a lawyer, avoid making specific recommendations |
| Competition (RateHub, NerdWallet, Ratehub, WOWA) | Differentiate on UX, data freshness, calculator depth, and Canadian focus |
