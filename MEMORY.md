# MEMORY.md - DrewBot's Memory

## Projects

### StockSummarizer.com
**Status:** In progress  
**Purpose:** Analyze individual stocks or groups of stocks and share in-depth analysis with end users in an interesting way

**Infrastructure:**
- **Domain:** Secured
- **Hosting:** Hostinger.com
- **Platform:** WordPress

**Data Sources:**
- TradingView.com stock screener and data

**Workflow:**
1. Download stock data from TradingView
2. Process/join data using Python scripts
3. Perform analysis on specific stocks or groups of stocks
4. Publish visualizations and insights to WordPress posts and/or distribute to social media channels

**Analysis Type:** Fundamental analysis (financial metrics, ratios, earnings, etc.)

**Data Details:**
- **Screener:** TradingView TSX (Canadian stocks only)
- **Data scope:** Current snapshot/screener data sufficient for now
- **Execution:** Local machine only

**Distribution:**
- **Website:** WordPress posts
- **Social:** YouTube, X (Twitter), Instagram

**Goals:**
- Provide stock analysis that's engaging and accessible to users
- Handle both individual stocks and groups/portfolios
- Heavy use of visualizations: tables, charts, diagrams

---

## Projects

### StockSummarizer.com
**Status:** In progress  
**Purpose:** Analyze individual stocks or groups of stocks and share in-depth analysis with end users in an interesting way

**Infrastructure:**
- **Domain:** Secured
- **Hosting:** Hostinger.com
- **Platform:** WordPress

**Data Sources:**
- TradingView.com stock screener and data

**Workflow:**
1. Download stock data from TradingView
2. Process/join data using Python scripts
3. Perform analysis on specific stocks or groups of stocks
4. Publish visualizations and insights to WordPress posts and/or distribute to social media channels

**Analysis Type:** Fundamental analysis (financial metrics, ratios, earnings, etc.)

**Data Details:**
- **Screener:** TradingView TSX (Canadian stocks only)
- **Data scope:** Current snapshot/screener data sufficient for now
- **Execution:** Local machine only

**Distribution:**
- **Website:** WordPress posts
- **Social:** YouTube, X (Twitter), Instagram

**Goals:**
- Provide stock analysis that's engaging and accessible to users
- Handle both individual stocks and groups/portfolios
- Heavy use of visualizations: tables, charts, diagrams

---

### LatestMortgageRates.ca
**Status:** Deployed ✅  
**Purpose:** Live mortgage rate comparison website showing rates from Big 5 banks + monoline lenders

**Infrastructure:**
- **Domain:** latestmortgagerates.ca
- **Hosting:** Hostinger.com
- **Platform:** Next.js (static export)

**GitHub Actions Secrets - Hostinger SFTP:**
- **SFTP_HOST:** Hostinger SFTP server (e.g., `ftp.latestmortgagerates.ca` or `ssh.latestmortgagerates.ca`)
- **SFTP_USERNAME:** Hostinger FTP/SFTP username
- **SFTP_PASSWORD:** Hostinger FTP/SFTP password
- **REMOTE_PATH:** Target directory on server (e.g., `/public_html/`)
- **Port:** 65002 (pre-configured in workflow)

**Where to find in Hostinger:**
1. hpanel.hostinger.com → Files → FTP Accounts
2. Hostname, username, password listed there
3. Port is 65002 for SFTP

**Auto-Deployment:**
- Triggers on every push to `main` branch
- Workflow: `.github/workflows/deploy.yml`
- Uses `sshpass` + native `sftp` command

**Tech Stack:**
- Next.js 15.2.0 with static export
- TypeScript
- Tailwind CSS
- SQLite for rate data
- Python scrapers for banks

---

*Memory file created 2026-02-21*
