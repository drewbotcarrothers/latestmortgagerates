# LatestMortgageRates.ca

Next.js website for comparing Canadian mortgage rates from major banks, credit unions, and monoline lenders.

## Features

- Compare rates from 20+ lenders (Big 6 banks, digital banks, credit unions, and monolines)
- Fixed and variable rates
- Insured and uninsured mortgage rates
- Auto-generated comparison tables
- Responsive design with Tailwind CSS
- Fully automated deployment via GitHub Actions

Rates are scraped twice daily. Some lenders (notably BMO and CIBC) block datacenter IPs, so the pipeline falls back to dated, source-cited public rates when live extraction fails. EQ Bank, MCAP, Street Capital, and Centum are not shown as direct lenders (no public consumer rates, wholesale-only, or retired).

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Static Export (SSG)

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Scraping

```bash
cd scraping
pip install -r requirements.txt
python -m playwright install chromium
python test_all_lenders_v2.py
python clean_and_save.py ../data/rates.json ../data/rates.json
```

See `SCRAPER_UPDATE_STATUS.md` for current live vs fallback lender notes.

## Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/latestmortgagerates.git
git push -u origin main
```

### 2. Add GitHub Secrets

Go to **Settings > Secrets and variables > Actions** and add:

| Secret | Description |
|--------|-------------|
| `SFTP_HOST` | Your Hostinger SFTP hostname (e.g., `ftp.yourdomain.com`) |
| `SFTP_USERNAME` | Your Hostinger SFTP username |
| `SSH_PRIVATE_KEY` | Your SSH private key (preferred) OR SFTP password as string |
| `REMOTE_PATH` | Target directory (e.g., `/public_html/` or `/public_html/rates/`) |

### 3. Automatic Deployment

Every push to `main` branch triggers automatic deployment to Hostinger.

## Getting Hostinger Credentials

1. Log into Hostinger hPanel
2. Go to **Files > FTP Accounts**
3. Create or view FTP account
4. Note the server/hostname
5. Generate SSH key or use password

## Data Updates

The scraper runs separately and exports data to `data/rates.json` plus `data/metadata.json` (`last_updated` is UTC with a `Z` suffix). The homepage "Last updated" label is baked into the static export from that timestamp.

## License

MIT
