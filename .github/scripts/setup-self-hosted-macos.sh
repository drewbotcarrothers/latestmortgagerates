#!/usr/bin/env bash
# Install (if missing) and put Homebrew Python 3.11 + Node 20 on PATH.
#
# Used by scrape-and-deploy.yml on the lmr-home Mac. Do not use
# actions/setup-python on this runner: that action hardcodes
# /Users/runner/hostedtoolcache (non-relocatable macOS CPython builds) and
# fails with `mkdir: /Users/runner: Permission denied` for any user other
# than GitHub's hosted `runner` account.
#
# Reads PYTHON_VERSION and NODE_VERSION from the workflow `env:` block.
# Compatible with macOS system Bash 3.2. Do not hardcode a user home or
# Anaconda path.

set -euo pipefail

export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_INSTALLED_DEPENDENTS_CHECK=1
export HOMEBREW_NO_ANALYTICS=1
export NONINTERACTIVE=1

PYTHON_VERSION="${PYTHON_VERSION:-3.11}"
NODE_VERSION="${NODE_VERSION:-20}"
PY_FORMULA="python@${PYTHON_VERSION}"
PY_BIN="python${PYTHON_VERSION}"
NODE_FORMULA="node@${NODE_VERSION}"

if [ -z "${GITHUB_PATH:-}" ]; then
  echo "GITHUB_PATH is not set; this script must run inside GitHub Actions." >&2
  exit 1
fi

prepend_path() {
  dir="$1"
  case ":${PATH}:" in
    *:"${dir}":*) ;;
    *) export PATH="${dir}:${PATH}" ;;
  esac
  echo "${dir}" >> "${GITHUB_PATH}"
}

# LaunchAgent runners often lack brew on PATH. Probe the standard prefixes.
if command -v brew >/dev/null 2>&1; then
  :
elif [ -x /opt/homebrew/bin/brew ]; then
  eval "$(/opt/homebrew/bin/brew shellenv)"
elif [ -x /usr/local/bin/brew ]; then
  eval "$(/usr/local/bin/brew shellenv)"
else
  echo "Homebrew is required on this self-hosted Mac." >&2
  echo "Install from https://brew.sh then run:" >&2
  echo "  brew install ${PY_FORMULA} ${NODE_FORMULA}" >&2
  exit 1
fi

echo "Using brew at $(command -v brew) ($(brew --prefix))"

# --- Python ---
if ! command -v "${PY_BIN}" >/dev/null 2>&1; then
  echo "${PY_BIN} not on PATH; installing Homebrew ${PY_FORMULA}"
  brew install "${PY_FORMULA}"
fi

PY_PREFIX="$(brew --prefix "${PY_FORMULA}" 2>/dev/null || true)"
if [ -n "${PY_PREFIX}" ] && [ -x "${PY_PREFIX}/bin/${PY_BIN}" ]; then
  prepend_path "${PY_PREFIX}/bin"
fi

if ! command -v "${PY_BIN}" >/dev/null 2>&1; then
  echo "${PY_BIN} is still missing after brew install ${PY_FORMULA}" >&2
  echo "Try: brew update && brew install ${PY_FORMULA}" >&2
  exit 1
fi

echo "${PY_BIN} -> $(command -v "${PY_BIN}") ($("${PY_BIN}" --version 2>&1))"

# Job-local venv so pip never writes to Anaconda or the system interpreter.
VENV="${RUNNER_TEMP}/lmr-python"
"${PY_BIN}" -m venv "${VENV}"
prepend_path "${VENV}/bin"

python -m pip install --upgrade pip

python -c "import sys
expected = tuple(int(p) for p in '${PYTHON_VERSION}'.split('.'))
assert sys.version_info[:len(expected)] == expected, sys.version
print('venv python ->', sys.executable, sys.version.split()[0])"

# --- Node ---
# Prefer node@20. Homebrew disables that formula on 2026-10-28; fall back to
# current `brew node` (must still be >= 20 for Next.js 15).
node_major() {
  node -p "process.versions.node.split('.')[0]"
}

NODE_PREFIX="$(brew --prefix "${NODE_FORMULA}" 2>/dev/null || true)"
if [ -n "${NODE_PREFIX}" ] && [ -x "${NODE_PREFIX}/bin/node" ]; then
  prepend_path "${NODE_PREFIX}/bin"
elif command -v node >/dev/null 2>&1 && [ "$(node_major)" = "${NODE_VERSION}" ]; then
  echo "Using existing Node $(node --version) at $(command -v node)"
else
  echo "Node ${NODE_VERSION} not found; installing Homebrew ${NODE_FORMULA}"
  if brew install "${NODE_FORMULA}"; then
    NODE_PREFIX="$(brew --prefix "${NODE_FORMULA}")"
    prepend_path "${NODE_PREFIX}/bin"
  else
    echo "${NODE_FORMULA} is unavailable; falling back to Homebrew node (>= ${NODE_VERSION})"
    brew install node
    prepend_path "$(brew --prefix node)/bin"
  fi
fi

if ! command -v node >/dev/null 2>&1; then
  echo "node is still missing after setup" >&2
  echo "Try: brew update && brew install ${NODE_FORMULA} || brew install node" >&2
  exit 1
fi

node -e "const need = parseInt('${NODE_VERSION}', 10); const got = parseInt(process.versions.node.split('.')[0], 10); if (got < need) { console.error('Need Node >=' + need + ', found', process.version); process.exit(1) }"
echo "node -> $(command -v node) ($(node --version))"
echo "npm  -> $(command -v npm) ($(npm --version))"

echo "Setup complete. Later steps use this venv + Node ${NODE_VERSION} (no /Users/runner toolcache)."
