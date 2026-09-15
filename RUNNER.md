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

## Homebrew Python 3.11 + Node 22 (required)

Do **not** use `actions/setup-python` or `actions/setup-node` on this runner.

`actions/setup-python@v5` on macOS **hardcodes** `/Users/runner/hostedtoolcache`. GitHub-hosted images run as user `runner`; this Mac runs as `andrewcarrothers`. Creating `/Users/runner` fails with:

```
mkdir: /Users/runner
Permission denied
```

`AGENT_TOOLSDIRECTORY` / `RUNNER_TOOL_CACHE` cannot override that: the action overwrites them on macOS because the official CPython builds are compiled with that prefix and are non-relocatable. Creating `/Users/runner` as a workaround also needs `sudo installer` into `/Library/Frameworks` (passwordless sudo). We skip that whole path.

The workflow uses **Homebrew** instead (`.github/scripts/setup-self-hosted-macos.sh`):

1. Finds brew at `/opt/homebrew/bin/brew` (Apple Silicon) or `/usr/local/bin/brew` (Intel) even if the LaunchAgent PATH is empty
2. `brew install python@3.11` and `brew install node@22` if they are missing
3. Creates a **job-local venv** under `$RUNNER_TEMP` so pip never writes to Anaconda (`~/anaconda3`) or the system interpreter
4. Puts that venv and Node 22 on `PATH` for later steps (Astro 7 requires Node ≥ 22.12)

### One-time Mac setup

```bash
# Homebrew (skip if `brew --version` already works)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Apple Silicon: add brew to your interactive shell if the installer says so
# echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile

brew install python@3.11 node@22
python3.11 --version   # expect 3.11.x
# node@22 is keg-only:
"$(brew --prefix node@22)/bin/node" --version   # expect v22.x
```

The workflow will install the formulae itself when missing, as long as `brew` is present. Pre-installing makes the first scrape faster (no compile/download during the 20-minute job budget).

If `node@22` is unavailable, the setup script falls back to current `brew node` (must be ≥ 22). `python@3.11` remains available through 2027.

Do **not** point the workflow at `/Users/andrewcarrothers/anaconda3/bin/python3`. The venv is intentional.

### LaunchAgent PATH

If the runner is a LaunchAgent/service, it may not load `~/.zprofile`. The setup script does not rely on that: it calls `brew shellenv` from the standard brew binary path.

If setup still cannot find brew, add to the runner’s `.env` (next to `config.sh` / `run.sh`):

```
PATH=/opt/homebrew/bin:/opt/homebrew/sbin:/usr/bin:/bin:/usr/sbin:/sbin
```

Then restart the runner.

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

## Playwright on macOS (Chromium + WebKit)

The workflow installs browsers with:

```bash
python -m playwright install chromium
python -m playwright install webkit
```

It does **not** run `playwright install-deps` / `--with-deps` (Linux apt only). Binaries are cached under the Mac user’s Playwright cache (`~/Library/Caches/ms-playwright`) after the first install.

BMO blocks typical Chromium / curl TLS fingerprints even from this residential IP (Safari in a real window still loads). The BMO scraper therefore:

1. Fetches BMO’s public-data JSON with **Safari TLS impersonation** (`curl_cffi`)
2. Falls back to **Playwright WebKit** (Safari-like) API request / HTML
3. Uses dated `bmo_fallback_*` only if those fail

Other lenders still use Chromium or first-party APIs. Do not drop the Chromium install.

Look for `bmo_live_scrape` in **Run scraper** logs after a successful live BMO fetch.

## After merge: re-run Scrape Rates & Deploy

1. Confirm the Mac is awake and the runner is **Idle**
2. Open [Actions → Scrape Rates & Deploy](https://github.com/drewbotcarrothers/latestmortgagerates/actions/workflows/scrape-and-deploy.yml)
3. **Run workflow** on `master` (or this PR branch to test before merge)
4. Confirm **Setup Python 3.11 and Node 22 (Homebrew)** succeeds (no `/Users/runner`)
5. Confirm the job ran on `andrews-mbp-lmr` / `lmr-home`, and BMO logs show `bmo_live_scrape` (typically `public_data_api` or `playwright_webkit`) rather than `bmo_fallback_`
6. Confirm **Build Astro site** and **Deploy to Hostinger (FTP - Attempt 1)** succeed. If attempt 1 is green, **Wait 2 minutes before retry** and **Attempt 2** are skipped. A green Attempt 1 with `continue-on-error` plus a red Attempt 2 means attempt 1 actually failed (check the step logs for `550`).

If Homebrew formulae are missing on a stale cellar, update once on the Mac: `brew update && brew install python@3.11 node@22`.

Hostinger leftovers (verified against production after the failed Astro FTP): `api/version` is a **file**, `api/rates/` is a **directory**. The build writes `api/version.json` + extensionless `api/version`, and `api/rates.json` + `api/rates/index.html`. It does **not** write `api/version/index.html` (that was the 550). Do not turn on `dangerous-clean-slate` for the whole `public_html`.

## Related

- Optional proxy fallback secrets: `WORKFLOW_SECRETS.md`
- Workflow index: `.github/workflows/README.md`
