# Self-hosted scrape runner (`lmr-home`)

The **Scrape Rates & Deploy** workflow (`.github/workflows/scrape-and-deploy.yml`) runs on Andrew’s home Mac, not GitHub-hosted `ubuntu-latest`.

BMO blocks typical GitHub Actions / datacenter IPs. A Canadian residential ISP IP is the primary path for live Big 5 scrapes (especially BMO). Proxy secrets stay in the workflow as an optional fallback only — no paid proxy is required when this runner is online.

## Runner labels

Register the GitHub Actions runner on the Mac with these labels:

| Label | Required by workflow? |
|-------|------------------------|
| `self-hosted` | Yes (`runs-on`) |
| `macOS` | Yes (`runs-on`) |
| `lmr-home` | Yes (`runs-on`) |
| `ARM64` | Recommended (macOS arm64); not required in `runs-on` |

Example runner name: `andrews-mbp-lmr`.

`runs-on` is an AND of labels:

```yaml
runs-on: [self-hosted, macOS, lmr-home]
```

If the job sits in “Waiting for a runner” / “Queued”, confirm the Mac runner is **Idle**, online, and has exactly those labels (case-sensitive `macOS`).

## Keep the Mac awake for cron

Scheduled runs (UTC):

- `0 11 * * *` → **6:00 AM Eastern**
- `0 23 * * *` → **6:00 PM Eastern**

The Mac must be **powered on, awake, and connected to the internet** at those times, with the GitHub Actions runner app/service running. Sleep, lid-close sleep, or a stopped runner means the cron job never starts (GitHub does not retry missed `schedule` events).

Practical options:

- Energy Saver / Battery: prevent automatic sleep while on power, or use `caffeinate` around scrape windows
- Keep the runner installed as a LaunchAgent/service so it comes back after reboot
- After missed crons, use **workflow_dispatch** (below) to catch up

## Security — public repo

This repository is **public**. The scrape job uses a **self-hosted** runner and repo secrets (FTP, SMTP, optional proxy).

**Never attach this runner to `pull_request` workflows.** Do not add a `pull_request` trigger to `scrape-and-deploy.yml` (or any other job with `runs-on: [self-hosted, …]`).

A pull request from a fork can run untrusted workflow YAML. On a self-hosted runner that means arbitrary code on Andrew’s Mac, with access to secrets and the local disk. GitHub-hosted `ubuntu-latest` is the right target for PR CI (`ci-cd.yml`).

Keep scrape triggers as they are today:

- `schedule` (twice daily)
- `workflow_dispatch` (manual)

Do not commit runner registration tokens or any other secrets.

## Re-run with `workflow_dispatch` (testing)

After the runner is online, or to test without waiting for cron:

1. Open [Actions → Scrape Rates & Deploy](https://github.com/drewbotcarrothers/latestmortgagerates/actions/workflows/scrape-and-deploy.yml)
2. Click **Run workflow**
3. Branch: `master` (or this PR’s branch if you are testing the workflow file itself)
4. Click **Run workflow**
5. Confirm the job picked `lmr-home` (not `ubuntu-latest`) and that BMO logs show a live scrape (`bmo_live_scrape`) rather than the dated fallback, unless bmo.com is down

To re-run a failed attempt: open that run → **Re-run all jobs** (or **Re-run failed jobs**).

## Playwright / Chromium on macOS

The workflow installs Chromium with:

```bash
python -m playwright install chromium
```

It does **not** run `playwright install-deps` / `--with-deps` (Linux apt only).

## Related

- Optional proxy fallback secrets: `WORKFLOW_SECRETS.md`
- Workflow index: `.github/workflows/README.md`
