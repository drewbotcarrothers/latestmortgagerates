# LatestMortgageRates.ca

Next.js website for comparing Canadian mortgage rates from Big 5 banks and monoline lenders.

## Features

- Compare rates from 7 lenders: RBC, TD, BMO, Scotiabank, CIBC, nesto, Tangerine
- Fixed and variable rates
- Insured and uninsured mortgage rates
- Auto-generated comparison tables
- Responsive design with Tailwind CSS
- Fully automated deployment via GitHub Actions

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

The scraper runs separately and exports data to `data/rates.json`. This file should be committed to trigger a new deployment.

## License

MIT
