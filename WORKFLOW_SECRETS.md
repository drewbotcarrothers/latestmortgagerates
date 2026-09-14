# Workflow Secrets Reference

## GitHub Actions Secrets

The following secrets are **REQUIRED** for the scrape-and-deploy workflow to function:

### FTP Deployment Secrets (MANDATORY)

**DO NOT CHANGE THESE SECRET NAMES** - They are configured in GitHub and must match exactly:

| Secret Name | Purpose | Example |
|-------------|---------|---------|
| `SFTP_HOST` | FTP server hostname | `ftp.hostinger.com` or IP address |
| `SFTP_USERNAME` | FTP username | `user@example.com` |
| `SFTP_PASSWORD` | FTP password | `********` |

**⚠️ CRITICAL:** The secret names contain `SFTP_` but the protocol is **PLAIN FTP** (not SFTP, not FTPS). This is for historical compatibility.

## Protocol Configuration

**ALWAYS USE PLAIN FTP:**
- `protocol: ftp`
- `port: 21`
- **DO NOT** use `ftps`, `ftps-legacy`, or `sftp`

### Scraper proxy secrets (OPTIONAL — needed for live BMO from GitHub Actions)

BMO’s public mortgage-rates page does not accept connections from typical datacenter / GitHub Actions IPs (TCP never reaches `commit`; 0 network responses). CIBC, RBC, TD, and Scotiabank now scrape live from first-party APIs or HTML **without** a proxy.

To scrape **live BMO** (and any other JS-blocked first-party page that still times out) from CI, add a residential or rotating proxy. Do not commit credentials.

| Secret Name | Purpose | Example |
|-------------|---------|---------|
| `SCRAPER_PROXY_URL` | Preferred. Full proxy URL | `http://USER:PASS@brd.superproxy.io:22225` or `http://host:7777` |
| `SCRAPER_PROXY_USERNAME` | Optional if user/pass are not in the URL | `customer-zone-ca` |
| `SCRAPER_PROXY_PASSWORD` | Optional if password is not in the URL | `********` |
| `HTTPS_PROXY` / `HTTP_PROXY` | Standard proxy env fallbacks | same URL form |
| `BRIGHTDATA_PROXY_URL` | Provider-specific alias | Bright Data residential URL |
| `OXYLABS_PROXY_URL` | Provider-specific alias | Oxylabs residential URL |
| `SMARTPROXY_URL` | Provider-specific alias | Smartproxy / Decodo URL |

**How it is used:** `.github/workflows/scrape-and-deploy.yml` passes these into the `Run scraper` step. `scraping/src/scrapers/proxy_config.py` reads the first non-empty value and applies it to httpx and Playwright. Empty / missing secrets are ignored — scrapers then use dated BMO fallbacks.

**Suggested setup (Andrew):**
1. Sign up for a Canadian residential proxy (Bright Data, Oxylabs, Smartproxy, or similar).
2. Create a GitHub Actions secret named `SCRAPER_PROXY_URL` with the provider’s HTTP proxy URL.
3. Re-run **Scrape Rates & Deploy**. BMO should flip from `bmo_fallback_2026-09-14` to `bmo_live_scrape` if the proxy can reach bmo.com.
4. If the provider uses IP allowlisting, allow GitHub-hosted runner ranges or use a proxy username that does not require allowlisting.

Never paste the proxy URL into the repo, issues, or PR text.

## Email Notification Secrets (OPTIONAL)

To receive email summaries after each scrape run, configure these secrets:

| Secret Name | Purpose | Example |
|-------------|---------|---------|
| `EMAIL_USERNAME` | Gmail address for sending | `yourbot@gmail.com` |
| `EMAIL_PASSWORD` | Gmail App Password (not your regular password!) | `abcd efgh ijkl mnop` |

### Setting up Gmail App Passwords

1. Go to your Google Account → Security → 2-Step Verification → Enable it
2. Go to Security → App passwords → Generate new app password
3. Name it "Rate Scraper Bot" → Copy the 16-character password
4. Add `EMAIL_USERNAME` and `EMAIL_PASSWORD` to GitHub secrets

**⚠️ IMPORTANT:** Use an App Password, not your regular Gmail password. Regular passwords won't work with SMTP.

### Email Contents

Each email includes:
- Total rates scraped
- Live vs fallback rate counts
- Per-lender status (success/failure/rates found)
- Scraping duration per lender
- JSON attachments (metadata.json and rates.json)

---

## Where Used

### FTP Secrets
These secrets are referenced in `.github/workflows/scrape-and-deploy.yml`:

```yaml
- name: Deploy to Hostinger (FTP)
  uses: SamKirkland/FTP-Deploy-Action@v4.3.5
  with:
    server: ${{ secrets.SFTP_HOST }}
    username: ${{ secrets.SFTP_USERNAME }}
    password: ${{ secrets.SFTP_PASSWORD }}
    port: 21
    protocol: ftp
    local-dir: ./dist/
    dangerous-clean-slate: true
```

## History

- **2026-03-21**: Changed to plain `ftp` protocol on port 21 per Hostinger requirements
- **2026-03-21**: Briefly tried `sftp` (port 22) and `ftps-legacy` but reverted to plain FTP
- **2026-03-18**: Changed from `FTP_*` to `SFTP_*` to match existing GitHub secrets
- Secrets configured in: GitHub Repo → Settings → Secrets and variables → Actions

## Critical Rules

1. **Secret names stay as `SFTP_*`** - Do not rename them in GitHub
2. **Protocol stays as `ftp`** - Do not change to `sftp` or `ftps`
3. **Port stays as `21`** - Do not change to `22`

## If Secrets Need to Change

If you need to update the secret values:
1. Go to GitHub Repo → Settings → Secrets and variables → Actions
2. Update the existing secrets (don't rename them)
3. **DO NOT** change the secret names in the workflow file unless you also update them in GitHub

## Troubleshooting

**Error: "Input required and not supplied: server"**
→ The secrets are missing or misnamed. Check that `SFTP_HOST`, `SFTP_USERNAME`, and `SFTP_PASSWORD` exist in GitHub secrets.

**Error: "Authentication failed"**
→ The secret values are incorrect. Verify the FTP credentials with your hosting provider (Hostinger).

**Error: "SSL routines:ssl3_get_record:wrong version number"**
→ You tried to use FTPS/SFTP. Revert to plain `ftp` protocol on port 21.
