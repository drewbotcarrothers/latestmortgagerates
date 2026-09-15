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

### Self-hosted runner (primary BMO path)

**Scrape Rates & Deploy** runs on Andrew’s home Mac (`runs-on: [self-hosted, macOS, lmr-home]`). BMO still fingerprint-blocks Chromium and curl from that residential IP; Safari loads. The scraper uses Safari TLS impersonation (`curl_cffi`) against BMO’s public-data JSON, then Playwright WebKit. A paid proxy is **not** required.

See **`RUNNER.md`** for labels, keeping the Mac awake at 6 AM / 6 PM Eastern, public-repo security (never `pull_request` + self-hosted), and how to re-run via `workflow_dispatch`.

### Scraper proxy secrets (OPTIONAL fallback)

BMO’s public mortgage-rates page fingerprint-blocks typical curl / httpx / Chromium clients (HTTP/2 INTERNAL_ERROR or HTTP/1.1 0-byte stall) even on a residential ISP. Safari loads. The scraper impersonates Safari TLS (`curl_cffi`) against first-party public-data JSON; Playwright WebKit is the browser fallback. CIBC, RBC, TD, and Scotiabank scrape live from first-party APIs or HTML **without** a proxy.

Proxy secrets are an **optional fallback** if the home runner is offline or the residential IP is blocked. Leave them unset for the normal self-hosted path. Do not commit credentials.

| Secret Name | Purpose | Example |
|-------------|---------|---------|
| `SCRAPER_PROXY_URL` | Preferred. Full proxy URL | `http://USER:PASS@brd.superproxy.io:22225` or `http://host:7777` |
| `SCRAPER_PROXY_USERNAME` | Optional if user/pass are not in the URL | `customer-zone-ca` |
| `SCRAPER_PROXY_PASSWORD` | Optional if password is not in the URL | `********` |
| `HTTPS_PROXY` / `HTTP_PROXY` | Standard proxy env fallbacks | same URL form |
| `BRIGHTDATA_PROXY_URL` | Provider-specific alias | Bright Data residential URL |
| `OXYLABS_PROXY_URL` | Provider-specific alias | Oxylabs residential URL |
| `SMARTPROXY_URL` | Provider-specific alias | Smartproxy / Decodo URL |

**How it is used:** `.github/workflows/scrape-and-deploy.yml` still passes these into the `Run scraper` step. `scraping/src/scrapers/proxy_config.py` reads the first non-empty value and applies it to httpx and Playwright. Empty / missing secrets are ignored — the scraper uses the runner’s own IP (home ISP on `lmr-home`). If live BMO still fails, dated BMO fallbacks are used.

**Suggested setup (Andrew):**
1. Prefer the self-hosted `lmr-home` Mac (see `RUNNER.md`). No proxy required for BMO when that runner is online from a Canadian residential IP.
2. Only if the home IP is blocked: sign up for a Canadian residential proxy (Bright Data, Oxylabs, Smartproxy, or similar) and set `SCRAPER_PROXY_URL`.
3. Re-run **Scrape Rates & Deploy** via **Actions → Run workflow**. BMO logs should show `bmo_live_scrape` (usually `public_data_api`).
4. If a proxy provider uses IP allowlisting, allow the home ISP IP (or the provider username that does not require allowlisting). Do not point allowlists at GitHub-hosted ranges unless you have moved the job back to `ubuntu-latest`.

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

- **2026-09-15**: BMO live path is Safari TLS impersonation + Playwright WebKit against first-party public-data JSON. Proxy remains optional. See `RUNNER.md`.
- **2026-09-15**: Scrape job moved to self-hosted Mac (`lmr-home`). Proxy secrets remain optional fallback; home ISP IP is the primary live-BMO path. See `RUNNER.md`.
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
