# LatestMortgageRates.ca

Astro website for comparing Canadian mortgage rates from major banks, credit unions, and monoline lenders.

## Features

- Compare rates from 20+ lenders (Big 6 banks, digital banks, credit unions, and monolines)
- Fixed and variable rates
- Insured and uninsured mortgage rates
- Auto-generated comparison tables
- Responsive design with Tailwind CSS
- Fully automated deployment via GitHub Actions

Rates are scraped twice daily from first-party bank sources. CIBC, TD, and Scotiabank use official public rate APIs; RBC uses first-party HTML. **BMO’s public page is blocked from GitHub Actions / datacenter IPs** — the scrape job runs on the self-hosted Mac runner `lmr-home` (see `RUNNER.md`). EQ Bank, MCAP, Street Capital, and Centum are not shown as direct lenders (no public consumer rates, wholesale-only, or retired).

## Tech Stack

- Astro (static output)
- React islands (filters, calculators, theme, charts)
- TypeScript
- Tailwind CSS
- Hostinger FTP static hosting (`dist/`)

## Local Development

Requires **Node.js 22.12+** (Astro 7).

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Production build (writes static files to dist/)
npm run build

# Preview the production build
npm run preview
```

The site is a **static** Astro build (`output: 'static'`, `trailingSlash: 'always'`, `outDir: 'dist'`). Rate tables are generated at build time from `data/rates.json` and `data/metadata.json`. Do not invent rates.

Widget and API JSON are emitted to match what Hostinger already has (Next leftover **file** `api/version`, plus `api/rates/` from the failed Astro FTP):

| URL | File in `dist/` |
|-----|-----------------|
| `/api/rates.json` (canonical) | `api/rates.json` |
| `/api/rates` and `/api/rates/` | `api/rates/index.html` (directory already on Hostinger) |
| `/api/version.json` and `/api/version` | `api/version.json` + extensionless file `api/version` |

Do **not** emit `api/version/index.html` (550 Not a directory over the leftover file) or a file named `api/rates` (would collide with the existing directory). `npm run build` runs `scripts/verify-static-api.mjs` to enforce this.

## Scraping

```bash
cd scraping
pip install -r requirements.txt
python -m playwright install chromium
python test_all_lenders_v2.py
python clean_and_save.py ../data/rates.json ../data/rates.json
```

See `SCRAPER_UPDATE_STATUS.md` for current live vs fallback lender notes and `WORKFLOW_SECRETS.md` for optional proxy secrets (`SCRAPER_PROXY_URL`). The self-hosted Mac scrape runner is documented in `RUNNER.md`.

## Deployment

### 1. Push to GitHub

Pushes to `master` run `.github/workflows/ci-cd.yml` (GitHub-hosted Ubuntu): install, `astro build`, FTP `dist/` to Hostinger.

The scrape workflow (`.github/workflows/scrape-and-deploy.yml`) runs on `[self-hosted, macOS, lmr-home]`. It uses Homebrew Python/Node (`.github/scripts/setup-self-hosted-macos.sh`) — **do not** use `actions/setup-python` or `actions/setup-node` on that Mac (`/Users/runner` toolcache). After scraping it runs `npm ci` + `npm run build` (Astro) and FTPs `dist/`.

After merging an Astro/FTP path change, re-run **Scrape Rates & Deploy** on `master` (`RUNNER.md`). FTP attempt 1 should complete green; the 2-minute retry is skipped unless attempt 1 actually failed.

### 2. Add GitHub Secrets

Go to **Settings > Secrets and variables > Actions** and add:

| Secret | Description |
|--------|-------------|
| `SFTP_HOST` | Your Hostinger SFTP hostname (e.g., `ftp.yourdomain.com`) |
| `SFTP_USERNAME` | Your Hostinger SFTP username |
| `SFTP_PASSWORD` | FTP password |
| `REMOTE_PATH` | Target directory (e.g., `/public_html/` or `/public_html/rates/`) |
| `SCRAPER_PROXY_URL` | Optional residential proxy for live BMO (see `WORKFLOW_SECRETS.md`) |

## Data Updates

The scraper runs separately and exports data to `data/rates.json` plus `data/metadata.json` (`last_updated` is UTC with a `Z` suffix). The homepage "Last updated" label is baked into the static export from that timestamp.

## License

MIT
