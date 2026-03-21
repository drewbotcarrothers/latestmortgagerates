# Workflow Secrets Reference

## GitHub Actions Secrets

The following secrets are **REQUIRED** for the scrape-and-deploy workflow to function:

### FTP Deployment Secrets (MANDATORY)

**DO NOT CHANGE THESE SECRET NAMES** - They are configured in GitHub and must match exactly:

| Secret Name | Purpose | Example |
|-------------|---------|---------|
| `SFTP_HOST` | FTP server hostname | `files.000webhost.com` or IP address |
| `SFTP_USERNAME` | FTP username | `user@example.com` |
| `SFTP_PASSWORD` | FTP password | `********` |

**⚠️ IMPORTANT:** The workflow uses `ftps-legacy` protocol on port 21, not standard SFTP on port 22.

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
    protocol: ftps-legacy
```

## History

- **2026-03-18**: Changed from `FTP_*` to `SFTP_*` to match existing GitHub secrets
- Secrets configured in: GitHub Repo → Settings → Secrets and variables → Actions

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
