"""
Canonical Canadian Big 5 prime rate.

The number lives in config/prime_rate.json. historical_rates.py calls
resolve_prime_rate() during the daily scrape so a hard-coded 5.45 cannot
be written back into data/historical_rates.json.

How to update
-------------
When the Bank of Canada changes the policy rate and the Big 5 follow,
edit config/prime_rate.json (prime_rate, boc_policy_rate, effective).
Big 5 prime = policy rate + spread_over_policy (2.20). TD's separate
mortgage prime (4.60% as of 2026-09) is not this headline prime.

The daily job also tries the Bank of Canada Valet API:

- V39079: target for the overnight rate (policy rate). If the latest
  observation is recent, prime is policy + spread_over_policy.
- V122495: chartered-bank prime. As of 2026-09-27 this series is stale
  (last print 2019-09-01 at 3.95%). It is used only when the observation
  is recent AND prime − policy is within 0.05 of spread_over_policy.
  Otherwise it is ignored so a dead series cannot overwrite 4.45.

If Valet is unreachable, the config value is the fallback.
"""

from __future__ import annotations

import json
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

CONFIG_PATH = Path(__file__).resolve().parents[2] / "config" / "prime_rate.json"
VALET_URL = "https://www.bankofcanada.ca/valet/observations/{series}/json?recent=8"
POLICY_SERIES = "V39079"
PRIME_SERIES = "V122495"
POLICY_MAX_AGE_DAYS = 14
PRIME_SERIES_MAX_AGE_DAYS = 45
SPREAD_TOLERANCE = 0.05


def load_config() -> Dict[str, Any]:
    with CONFIG_PATH.open() as handle:
        config = json.load(handle)
    if "prime_rate" not in config:
        raise ValueError(f"{CONFIG_PATH} is missing prime_rate")
    return config


def configured_prime_rate() -> float:
    """Prime from config/prime_rate.json. Does not call the network."""
    prime = round(float(load_config()["prime_rate"]), 2)
    if not _sane_prime(prime):
        raise ValueError(f"Configured prime rate {prime} is outside 1–20")
    return prime


def resolve_prime_rate(refresh_config: bool = False) -> float:
    """
    Current Big 5 prime.

    Prefers a recent Valet prime print that sits ~2.20 above the policy
    rate, otherwise derives policy + spread, otherwise uses the config file.
    """
    config = load_config()
    fallback = round(float(config["prime_rate"]), 2)
    spread = float(config.get("spread_over_policy", 2.20))

    policy = _fetch_series(POLICY_SERIES)
    prime_obs = _fetch_series(PRIME_SERIES)

    resolved = fallback
    resolved_policy = config.get("boc_policy_rate")
    effective = config.get("effective")
    source = "config"

    if policy and _is_recent(policy[0], POLICY_MAX_AGE_DAYS) and _sane_policy(policy[1]):
        policy_date, policy_rate = policy
        resolved_policy = policy_rate
        series_ok = False
        if prime_obs and _is_recent(prime_obs[0], PRIME_SERIES_MAX_AGE_DAYS):
            if abs((prime_obs[1] - policy_rate) - spread) <= SPREAD_TOLERANCE:
                resolved = round(prime_obs[1], 2)
                effective = prime_obs[0]
                source = "valet_prime"
                series_ok = True
        if not series_ok:
            resolved = round(policy_rate + spread, 2)
            effective = policy_date
            source = "policy_plus_spread"

    if not _sane_prime(resolved):
        resolved = fallback
        source = "config"

    if refresh_config and source != "config" and resolved_policy is not None:
        _maybe_update_config(config, resolved, float(resolved_policy), effective, source)

    return resolved


def _fetch_series(series_id: str) -> Optional[Tuple[str, float]]:
    url = VALET_URL.format(series=series_id)
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "latestmortgagerates-prime-rate/1.0",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except Exception:
        return None

    latest: Optional[Tuple[str, float]] = None
    for obs in payload.get("observations") or []:
        raw = obs.get(series_id) or {}
        value = raw.get("v") if isinstance(raw, dict) else None
        date = obs.get("d")
        if not date or value in (None, "", ".."):
            continue
        try:
            number = float(value)
        except (TypeError, ValueError):
            continue
        if latest is None or str(date) > latest[0]:
            latest = (str(date), number)
    return latest


def _is_recent(iso_date: str, max_age_days: int) -> bool:
    try:
        observed = datetime.strptime(iso_date, "%Y-%m-%d").date()
    except ValueError:
        return False
    age = (datetime.now(timezone.utc).date() - observed).days
    return 0 <= age <= max_age_days


def _sane_policy(rate: float) -> bool:
    return 0.25 <= rate <= 15.0


def _sane_prime(rate: float) -> bool:
    return 1.0 <= rate <= 20.0


def _maybe_update_config(
    config: Dict[str, Any],
    prime: float,
    policy: float,
    effective: Optional[str],
    source: str,
) -> None:
    """Write config only when the resolved prime or policy rate actually changed."""
    same_prime = round(float(config["prime_rate"]), 2) == round(prime, 2)
    same_policy = round(float(config.get("boc_policy_rate", -1)), 2) == round(policy, 2)
    if same_prime and same_policy:
        return

    config["prime_rate"] = round(prime, 2)
    config["boc_policy_rate"] = round(policy, 2)
    if effective and not same_prime:
        config["effective"] = effective
    config["last_resolved_from"] = source
    config["last_resolved_at"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat()

    temporary = CONFIG_PATH.with_suffix(".json.tmp")
    temporary.write_text(json.dumps(config, indent=2) + "\n")
    temporary.replace(CONFIG_PATH)


if __name__ == "__main__":
    print(json.dumps({"prime_rate": resolve_prime_rate(refresh_config=False)}))
