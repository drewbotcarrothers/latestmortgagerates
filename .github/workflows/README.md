# GitHub Actions Workflows

This directory contains all GitHub Actions workflows for the LatestMortgageRates.ca project.

## Workflows Overview

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| **CI/CD Pipeline** | `ci-cd.yml` | Push to master, PRs | Lint, build, and deploy on code changes |
| **Scrape & Deploy** | `scrape-and-deploy.yml` | Schedule (2x/day), manual | Scrape rates, commit changes, auto-deploy |
| **Post to Social** | `post-to-social.yml` | Schedule (daily), manual | Post rate updates to X/Twitter |
| **Send Email Alerts** | `send-email-alerts.yml` | Schedule (daily/weekly/monthly), manual | Send subscriber email alerts |

---

## Detailed Workflow Descriptions

### 1. CI/CD Pipeline (`ci-cd.yml`)

**Purpose**: Continuous integration and deployment for code changes

**Triggers**:
- Push to `master` or `main`
- Pull requests to `master` or `main`
- Manual dispatch

**Jobs**:
1. **Lint & Type Check**: Runs ESLint and TypeScript checks
2. **Build**: Builds the Next.js application and uploads artifacts
3. **Deploy**: Deploys to Hostinger via FTP (only on push to master)

**Concurrency**: Cancels in-progress runs for the same branch

---

### 2. Scrape & Deploy (`scrape-and-deploy.yml`)

**Purpose**: Automated rate scraping and deployment

**Triggers**:
- Schedule: 6:00 AM EST and 6:00 PM EST (11:00 & 23:00 UTC)
- Manual dispatch with option for full vs quick scrape

**Jobs**:
1. **Scrape**: Runs Python/Playwright scraper for 30+ lenders
2. **Commit**: Commits rate changes to repository
3. **Build**: Rebuilds the application with new data
4. **Deploy**: Deploys updated site to Hostinger

**Features**:
- Caching for Python dependencies and Playwright browsers
- Artifact passing between jobs
- Conditional execution (only deploys if rates changed)
- Concurrency control (prevents overlapping scrapes)

---

### 3. Post to Social (`post-to-social.yml`)

**Purpose**: Automated social media posts

**Triggers**:
- Schedule: Daily at 9:00 AM EST
- Schedule: Weekly on Sundays at 10:00 AM EST
- Manual dispatch with post type selection

**Jobs**:
- **Post to X**: Posts rate updates to Twitter/X

**Future Extensions**:
- Post to Bluesky
- Post to LinkedIn
- Post to Facebook

---

### 4. Send Email Alerts (`send-email-alerts.yml`)

**Purpose**: Send email alerts to subscribers

**Triggers**:
- Schedule: Daily at 9:00 AM EST
- Schedule: Weekly on Sundays at 9:00 AM EST
- Schedule: Monthly on the 1st at 9:00 AM EST
- Manual dispatch with frequency selection

**Jobs**:
- **Send Alerts**: Determines frequency and sends appropriate alerts

**Features**:
- Multi-frequency support (daily/weekly/monthly)
- Automatic frequency detection from schedule
- Log artifact upload

---

## Environment Variables & Secrets

Required secrets (set in GitHub Settings > Secrets and variables > Actions):

### Deployment
- `SFTP_HOST` - Hostinger FTP server
- `SFTP_USERNAME` - FTP username
- `SFTP_PASSWORD` - FTP password

### Social Media (X/Twitter)
- `TWITTER_CLIENT_ID` - OAuth 2.0 Client ID
- `TWITTER_CLIENT_SECRET` - OAuth 2.0 Client Secret
- `TWITTER_ACCESS_TOKEN` - OAuth 1.0a Access Token
- `TWITTER_API_KEY` - API Key
- `TWITTER_API_SECRET` - API Secret
- `TWITTER_ACCESS_SECRET` - Access Token Secret

### Email (for alerts)
- `SMTP_HOST` - SMTP server
- `SMTP_PORT` - SMTP port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password

---

## Development Notes

### Adding a New Workflow

1. Create a new `.yml` file in this directory
2. Follow the naming convention: `kebab-case-descriptive-name.yml`
3. Include proper triggers (schedule, push, manual)
4. Add concurrency control for workflows that shouldn't overlap
5. Document the workflow in this README

### Testing Workflows Locally

Use [act](https://github.com/nektos/act) to test workflows locally:

```bash
# Install act
brew install act

# Run a specific workflow
act -W .github/workflows/ci-cd.yml

# Run with secrets
act -s FTP_PASSWORD=secret -W .github/workflows/scrape-and-deploy.yml
```

### Workflow Status Badges

Add these badges to your main README.md:

```markdown
![CI/CD](https://github.com/drewbotcarrothers/latestmortgagerates/workflows/CI/CD%20Pipeline/badge.svg)
![Scrape](https://github.com/drewbotcarrothers/latestmortgagerates/workflows/Scrape%20Rates%20%26%20Deploy/badge.svg)
```

---

## Troubleshooting

### Common Issues

**FTP Deployment Fails**
- Check secrets are set correctly in GitHub
- Verify FTP credentials work with FileZilla
- Check server path is correct

**Scraper Times Out**
- Some sites may block GitHub Actions IPs
- Check Playwright browser installation
- Review scraper logs

**Build Fails**
- Check Node.js version compatibility
- Ensure all dependencies are in package.json
- Run `npm ci` locally to verify

---

## Migration from Old Workflows

This setup replaces the following old workflows:
- `deploy.yml` → `ci-cd.yml`
- `daily-scrape.yml` + `scrape-rates.yml` → `scrape-and-deploy.yml`
- `daily-tweet.yml` + `tweet-rates.yml` → `post-to-social.yml`
- `send-alerts.yml` → `send-email-alerts.yml`

The new workflows provide:
- Better dependency management with `needs`
- Consistent structure and naming
- Improved caching
- Artifact passing between jobs
- Better concurrency control
