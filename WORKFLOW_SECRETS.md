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

## Where Used

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
