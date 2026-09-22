#!/usr/bin/env python3
"""
Latest Mortgage Rates — Top 5 by Term YouTube landscape pipeline.

Fetches live rates → ranks top 5 per term → writes OpenMontage script + Remotion
props → edge-tts narration → Remotion Explainer render + CTR thumbnail.

Usage (from repo root, with OpenMontage installed separately):
  export OPENMONTAGE_ROOT=/workspace/OpenMontage   # default if unset
  "$OPENMONTAGE_ROOT/.venv/bin/python" \\
    video-pipeline/openmontage/build_top5_by_term.py

Optional flags:
  --skip-render     Build artifacts + TTS + thumbnail only
  --rates PATH      Use a local rates JSON instead of live fetch
  --concurrency N   Remotion concurrency (default 4)
"""

from __future__ import annotations

import argparse
import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

# ---------------------------------------------------------------------------
# Paths (portable: repo root from __file__; OpenMontage via OPENMONTAGE_ROOT)
# ---------------------------------------------------------------------------
PIPELINE_DIR = Path(__file__).resolve().parent
# video-pipeline/openmontage/ → repo root is parents[1]
LMR_ROOT = PIPELINE_DIR.parents[1]
OM_ROOT = Path(os.environ.get("OPENMONTAGE_ROOT", "/workspace/OpenMontage")).expanduser().resolve()
PROJECT = OM_ROOT / "projects" / "lmr-top5-rates-by-term"
ARTIFACTS = PROJECT / "artifacts"
RENDERS = PROJECT / "renders"
PUBLIC = PROJECT / "public"
AUDIO = PROJECT / "assets" / "audio"
IMAGES = PROJECT / "assets" / "images"
COMPOSER = OM_ROOT / "remotion-composer"
VENV_PYTHON = OM_ROOT / ".venv" / "bin" / "python"
EDGE_TTS = OM_ROOT / ".venv" / "bin" / "edge-tts"

VOICE = "en-US-AndrewNeural"
VOICE_RATE = "+12%"
FPS = 30
WIDTH = 1920
HEIGHT = 1080
GAP_SECONDS = 0.168  # match Telus section gap feel
TZ = ZoneInfo("America/Toronto")

# Brand (Latest Mortgage Rates — teal/emerald, NOT StockSummarizer red)
TEAL = "#0D9488"
EMERALD = "#059669"
TEAL_DARK = "#0F766E"
SLATE = "#0F172A"
SLATE_SOFT = "#1E293B"
WHITE = "#FFFFFF"
MUTED = "#334155"
SURFACE = "#F0FDFA"
CARD_BG = "#ECFDF5"

BIG5_SLUGS = {"rbc", "td", "scotiabank", "bmo", "cibc", "tdbank", "bankofmontreal"}
BIG5_NAME_HINTS = (
    "royal bank",
    "rbc",
    "td bank",
    "toronto-dominion",
    "scotiabank",
    "bank of nova scotia",
    "bmo",
    "bank of montreal",
    "cibc",
    "canadian imperial",
)

LIVE_URLS = [
    "https://latestmortgagerates.ca/rates.json",  # full scrape-shaped (preferred)
    "https://latestmortgagerates.ca/api/rates.json",  # slim API top-N
]
LOCAL_FALLBACK = LMR_ROOT / "data" / "rates.json"
GH_REPO = "drewbotcarrothers/latestmortgagerates"
GH_PATH = "data/rates.json"

LOGO_FILE = "lmr-logo.png"


# ---------------------------------------------------------------------------
# Data fetch + normalize
# ---------------------------------------------------------------------------
def _http_json(url: str, timeout: int = 30) -> Any:
    req = urllib.request.Request(url, headers={"User-Agent": "LMR-OpenMontage/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _gh_rates() -> list[dict]:
    raw = subprocess.check_output(
        ["gh", "api", f"repos/{GH_REPO}/contents/{GH_PATH}", "--jq", ".content"],
        text=True,
    ).strip()
    import base64

    # gh may return quoted base64; strip quotes
    if raw.startswith('"'):
        raw = json.loads(raw)
    data = base64.b64decode(raw.replace("\n", "")).decode("utf-8")
    payload = json.loads(data)
    return payload if isinstance(payload, list) else payload.get("rates", [])


def fetch_rates(explicit: Path | None = None) -> tuple[list[dict], str]:
    if explicit:
        payload = json.loads(explicit.read_text())
        rates = payload if isinstance(payload, list) else payload.get("rates", [])
        return normalize_rates(rates), f"file:{explicit}"

    errors: list[str] = []
    slim: list[dict] | None = None
    slim_src = ""

    for url in LIVE_URLS:
        try:
            payload = _http_json(url)
            rates = payload if isinstance(payload, list) else payload.get("rates", [])
            norm = normalize_rates(rates)
            # Prefer a source that has enough rows for multi-term ranking
            if len(norm) >= 20:
                return norm, f"live:{url}"
            if norm and slim is None:
                slim = norm
                slim_src = f"live:{url}"
        except Exception as e:  # noqa: BLE001
            errors.append(f"{url}: {e}")

    if LOCAL_FALLBACK.exists():
        payload = json.loads(LOCAL_FALLBACK.read_text())
        rates = payload if isinstance(payload, list) else payload.get("rates", [])
        return normalize_rates(rates), f"local:{LOCAL_FALLBACK}"

    try:
        return normalize_rates(_gh_rates()), f"github:{GH_REPO}/{GH_PATH}"
    except Exception as e:  # noqa: BLE001
        errors.append(f"gh: {e}")

    if slim:
        return slim, slim_src

    raise RuntimeError("Could not load rates. Tried live, local, gh. " + "; ".join(errors))


def _parse_type_string(type_str: str) -> tuple[int | None, str]:
    """Parse API '5 Year Fixed' / '3 Year Variable' → (months, rate_type)."""
    s = (type_str or "").strip().lower()
    m = re.search(r"(\d+)\s*year", s)
    months = int(m.group(1)) * 12 if m else None
    if "variable" in s or "adjustable" in s:
        rt = "variable"
    elif "fixed" in s:
        rt = "fixed"
    else:
        rt = "unknown"
    return months, rt


def normalize_rates(raw: list[dict]) -> list[dict]:
    out: list[dict] = []
    for r in raw:
        if not isinstance(r, dict):
            continue
        # Scrape shape
        if "lender_name" in r or "term_months" in r:
            rate = r.get("rate")
            if rate is None:
                continue
            try:
                rate_f = float(rate)
            except (TypeError, ValueError):
                continue
            out.append(
                {
                    "lender": r.get("lender_name") or r.get("lender") or "Unknown",
                    "lender_slug": (r.get("lender_slug") or "").lower(),
                    "rate": rate_f,
                    "term_months": int(r.get("term_months") or 0) or None,
                    "rate_type": str(r.get("rate_type") or "unknown").lower(),
                    "mortgage_type": str(r.get("mortgage_type") or "unknown").lower(),
                    "posted_rate": r.get("posted_rate"),
                    "source_url": r.get("source_url") or r.get("url"),
                    "updated_at": r.get("scraped_at") or r.get("updated_at"),
                    "_raw": r,
                }
            )
            continue
        # API shape {lender, rate, type, ...}
        if "lender" in r and "rate" in r:
            try:
                rate_f = float(r["rate"])
            except (TypeError, ValueError):
                continue
            months, rt = _parse_type_string(str(r.get("type") or ""))
            mt = str(r.get("mortgage_type") or r.get("insurance") or "unknown").lower()
            if "insured" in mt and "un" not in mt:
                mt = "insured"
            elif "uninsured" in mt:
                mt = "uninsured"
            out.append(
                {
                    "lender": r.get("lender") or "Unknown",
                    "lender_slug": (r.get("lender_slug") or "").lower(),
                    "rate": rate_f,
                    "term_months": months,
                    "rate_type": rt,
                    "mortgage_type": mt,
                    "posted_rate": r.get("posted_rate"),
                    "source_url": r.get("url"),
                    "updated_at": r.get("updated_at"),
                    "_raw": r,
                }
            )
    return out


def top_n(
    rates: list[dict],
    *,
    term_months: int,
    rate_type: str,
    n: int = 5,
    prefer_insured: bool = True,
) -> list[dict]:
    pool = [
        r
        for r in rates
        if r.get("term_months") == term_months
        and r.get("rate_type") == rate_type
        and r.get("rate") is not None
    ]
    if prefer_insured:
        insured = [r for r in pool if r.get("mortgage_type") == "insured"]
        if len(insured) >= n:
            pool = insured
        elif insured:
            rest = [r for r in pool if r.get("mortgage_type") != "insured"]
            pool = insured + rest
    pool = sorted(pool, key=lambda r: (float(r["rate"]), r.get("lender", "")))
    seen: set[str] = set()
    out: list[dict] = []
    for r in pool:
        key = r.get("lender_slug") or r.get("lender", "").lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(r)
        if len(out) >= n:
            break
    return out


def is_big5(r: dict) -> bool:
    slug = (r.get("lender_slug") or "").lower()
    if slug in BIG5_SLUGS:
        return True
    name = (r.get("lender") or "").lower()
    return any(h in name for h in BIG5_NAME_HINTS)


def best_big5(rates: list[dict], term_months: int, rate_type: str) -> dict | None:
    pool = [
        r
        for r in rates
        if r.get("term_months") == term_months
        and r.get("rate_type") == rate_type
        and is_big5(r)
    ]
    if not pool:
        return None
    return min(pool, key=lambda r: float(r["rate"]))


def fmt_rate(rate: float) -> str:
    return f"{rate:.2f}%"


def speak_rate(rate: float) -> str:
    """TTS-friendly rate: 3.59 → 'three point five nine percent'."""
    whole = int(rate)
    cents = int(round((rate - whole) * 100))
    ones = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
        "twenty",
    ]
    tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

    def say_int(n: int) -> str:
        if n <= 20:
            return ones[n]
        if n < 100:
            t, o = divmod(n, 10)
            return tens[t] if o == 0 else f"{tens[t]} {ones[o]}"
        return str(n)

    d1, d2 = divmod(cents, 10)
    return f"{say_int(whole)} point {ones[d1]} {ones[d2]} percent"


def mt_label(mt: str) -> str:
    if mt == "insured":
        return "insured"
    if mt == "uninsured":
        return "uninsured"
    return mt or "rate"


# ---------------------------------------------------------------------------
# Script + ranking payload
# ---------------------------------------------------------------------------
def build_rankings(rates: list[dict]) -> dict[str, Any]:
    fixed5 = top_n(rates, term_months=60, rate_type="fixed", prefer_insured=True)
    var5 = top_n(rates, term_months=60, rate_type="variable", prefer_insured=True)
    fixed3 = top_n(rates, term_months=36, rate_type="fixed", prefer_insured=True)
    big5_f5 = best_big5(rates, 60, "fixed")

    overall_candidates = []
    for bucket in (fixed5, var5, fixed3):
        if bucket:
            overall_candidates.append(bucket[0])
    overall = min(overall_candidates, key=lambda r: float(r["rate"])) if overall_candidates else None

    gap = None
    if fixed5 and big5_f5:
        gap = {
            "best": fixed5[0],
            "big5": big5_f5,
            "delta_pp": round(float(big5_f5["rate"]) - float(fixed5[0]["rate"]), 2),
        }

    return {
        "fixed_5y": fixed5,
        "variable_5y": var5,
        "fixed_3y": fixed3,
        "overall_best": overall,
        "gap_vs_big5": gap,
        "prefer_insured_note": {
            "fixed_5y": _pool_insurance_note(fixed5),
            "variable_5y": _pool_insurance_note(var5),
            "fixed_3y": _pool_insurance_note(fixed3),
        },
    }


def _pool_insurance_note(rows: list[dict]) -> str:
    if not rows:
        return "none"
    types = {r.get("mortgage_type") for r in rows}
    if types == {"insured"}:
        return "insured"
    if "insured" in types and "uninsured" in types:
        return "mixed (insured preferred, then uninsured)"
    return rows[0].get("mortgage_type") or "unknown"


def list_lines_screen(rows: list[dict]) -> str:
    lines = []
    for i, r in enumerate(rows, 1):
        lines.append(
            f"#{i}  {r['lender']}  ·  {fmt_rate(r['rate'])}  ·  {mt_label(r.get('mortgage_type',''))}"
        )
    return "\n".join(lines)


def list_lines_vo(rows: list[dict], term_label: str) -> str:
    parts = []
    for i, r in enumerate(rows, 1):
        parts.append(
            f"Number {i}: {r['lender']} at {speak_rate(r['rate'])}, "
            f"{mt_label(r.get('mortgage_type',''))}."
        )
    return (
        f"Next section: {term_label}. "
        f"Here is the top five table. "
        + " ".join(parts)
    )


def build_script_sections(rankings: dict, as_of: datetime) -> list[dict]:
    date_str = as_of.strftime("%B %-d, %Y")
    fixed5 = rankings["fixed_5y"]
    var5 = rankings["variable_5y"]
    fixed3 = rankings["fixed_3y"]
    gap = rankings["gap_vs_big5"]
    overall = rankings["overall_best"]

    best5 = fixed5[0] if fixed5 else None
    best_hook = (
        f"The best five-year fixed we see today is {speak_rate(best5['rate'])} "
        f"from {best5['lender']}."
        if best5
        else "Here are Canada's best mortgage rates by term."
    )

    sections = [
        {
            "id": "s1_hook",
            "label": "Hook",
            "text": (
                f"Canada's best mortgage rates today — {date_str}. "
                f"{best_hook} "
                f"I'm ranking the top five for five-year fixed, five-year variable, "
                f"and three-year fixed, using live data from latestmortgagerates.ca. "
                f"Insured rates preferred when available — labels stay clear on screen."
            ),
        },
        {
            "id": "s2_fixed5",
            "label": "5-year fixed top 5",
            "text": (
                list_lines_vo(fixed5, "five-year fixed")
                if fixed5
                else "We do not have enough five-year fixed quotes in today's file."
            ),
        },
        {
            "id": "s3_var5",
            "label": "5-year variable top 5",
            "text": (
                list_lines_vo(var5, "five-year variable")
                if var5
                else "We do not have enough five-year variable quotes in today's file."
            ),
        },
        {
            "id": "s4_fixed3",
            "label": "3-year fixed top 5",
            "text": (
                list_lines_vo(fixed3, "three-year fixed")
                if fixed3
                else "We do not have enough three-year fixed quotes in today's file."
            ),
        },
    ]

    # Gap / overall callout
    if gap and overall:
        sections.append(
            {
                "id": "s5_gap",
                "label": "Best overall & Big-5 gap",
                "text": (
                    f"Best overall print in this cut: {overall['lender']} at "
                    f"{speak_rate(overall['rate'])} on "
                    f"{'five-year variable' if overall.get('rate_type')=='variable' and overall.get('term_months')==60 else 'this board'}. "
                    f"Versus the Big Five: the lowest Big Five five-year fixed we see is "
                    f"{gap['big5']['lender']} at {speak_rate(gap['big5']['rate'])}. "
                    f"That is about {gap['delta_pp']} percentage points above today's "
                    f"best five-year fixed of {speak_rate(gap['best']['rate'])} from "
                    f"{gap['best']['lender']}. Shopping beyond the Big Five still matters."
                ),
            }
        )
    elif overall:
        sections.append(
            {
                "id": "s5_gap",
                "label": "Best overall",
                "text": (
                    f"Best overall in this cut: {overall['lender']} at "
                    f"{speak_rate(overall['rate'])}. Compare the full board before you lock in."
                ),
            }
        )

    sections.append(
        {
            "id": "s6_cta",
            "label": "CTA",
            "text": (
                "Compare all rates and lenders at latestmortgagerates.ca. "
                "Rates change — verify the live quote with the lender or broker "
                "before you apply. This is educational only, not financial advice."
            ),
        }
    )
    return sections


# ---------------------------------------------------------------------------
# TTS
# ---------------------------------------------------------------------------
def _ffprobe_duration(path: Path) -> float:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        text=True,
    ).strip()
    return float(out)


def _parse_vtt_words(vtt_path: Path, offset_ms: int = 0) -> list[dict]:
    """Parse edge-tts word-ish VTT into [{word,startMs,endMs}]."""
    text = vtt_path.read_text(encoding="utf-8")
    cues: list[dict] = []
    # edge-tts VTT: timestamps then payload line
    blocks = re.split(r"\n\n+", text.strip())
    for block in blocks:
        lines = [ln for ln in block.splitlines() if ln.strip() and not ln.strip().startswith("WEBVTT")]
        if len(lines) < 2:
            continue
        # find timestamp line
        ts_line = None
        payload_lines = []
        for ln in lines:
            if "-->" in ln:
                ts_line = ln
            elif ts_line is not None:
                payload_lines.append(ln)
        if not ts_line or not payload_lines:
            continue
        m = re.match(
            r"(\d{2}):(\d{2}):(\d{2})[.,](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[.,](\d{3})",
            ts_line.strip(),
        )
        if not m:
            continue
        h1, m1, s1, ms1, h2, m2, s2, ms2 = map(int, m.groups())
        start = ((h1 * 3600 + m1 * 60 + s1) * 1000 + ms1) + offset_ms
        end = ((h2 * 3600 + m2 * 60 + s2) * 1000 + ms2) + offset_ms
        payload = " ".join(payload_lines).strip()
        # Strip VTT tags like <c> </c>
        payload = re.sub(r"</?c[^>]*>", "", payload)
        payload = re.sub(r"<[^>]+>", "", payload).strip()
        if not payload:
            continue
        words = payload.split()
        if len(words) == 1:
            cues.append({"word": words[0], "startMs": start, "endMs": max(end, start + 50)})
        else:
            span = max(end - start, 50)
            per = span / len(words)
            for i, w in enumerate(words):
                ws = int(start + i * per)
                we = int(start + (i + 1) * per)
                cues.append({"word": w, "startMs": ws, "endMs": max(we, ws + 40)})
    return cues


def generate_narration(sections: list[dict], audio_dir: Path) -> tuple[Path, list[dict], list[dict], float]:
    audio_dir.mkdir(parents=True, exist_ok=True)
    # silence gap
    gap_path = audio_dir / "_gap.mp3"
    if not gap_path.exists():
        subprocess.check_call(
            [
                "ffmpeg",
                "-y",
                "-f",
                "lavfi",
                "-i",
                f"anullsrc=r=24000:cl=mono",
                "-t",
                str(GAP_SECONDS),
                "-q:a",
                "9",
                str(gap_path),
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

    timed: list[dict] = []
    captions: list[dict] = []
    concat_lines: list[str] = []
    cursor = 0.0

    for sec in sections:
        txt_path = audio_dir / f"{sec['id']}.txt"
        mp3_path = audio_dir / f"{sec['id']}.mp3"
        vtt_path = audio_dir / f"{sec['id']}.vtt"
        txt_path.write_text(sec["text"], encoding="utf-8")
        cmd = [
            str(EDGE_TTS),
            "--voice",
            VOICE,
            "--rate",
            VOICE_RATE,
            "--file",
            str(txt_path),
            "--write-media",
            str(mp3_path),
            "--write-subtitles",
            str(vtt_path),
        ]
        subprocess.check_call(cmd)
        dur = _ffprobe_duration(mp3_path)
        start = cursor
        end = cursor + dur
        timed.append(
            {
                "id": sec["id"],
                "label": sec["label"],
                "text": sec["text"],
                "start": round(start, 3),
                "end": round(end, 3),
                "duration": round(dur, 3),
            }
        )
        captions.extend(_parse_vtt_words(vtt_path, offset_ms=int(start * 1000)))
        concat_lines.append(f"file '{mp3_path.name}'")
        cursor = end + GAP_SECONDS
        concat_lines.append(f"file '{gap_path.name}'")

    # drop trailing gap
    if concat_lines and concat_lines[-1].endswith("_gap.mp3'"):
        concat_lines.pop()
        cursor -= GAP_SECONDS

    concat_txt = audio_dir / "concat.txt"
    concat_txt.write_text("\n".join(concat_lines) + "\n", encoding="utf-8")
    narration = audio_dir / "narration_full.mp3"
    subprocess.check_call(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(concat_txt),
            "-c:a",
            "libmp3lame",
            "-q:a",
            "2",
            str(narration),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    # copy into project public for Remotion
    PUBLIC.mkdir(parents=True, exist_ok=True)
    shutil.copy2(narration, PUBLIC / "narration_full.mp3")
    # also stage into composer public as safety
    shutil.copy2(narration, COMPOSER / "public" / "narration_full.mp3")
    if (IMAGES / LOGO_FILE).exists():
        shutil.copy2(IMAGES / LOGO_FILE, PUBLIC / LOGO_FILE)
        shutil.copy2(IMAGES / LOGO_FILE, COMPOSER / "public" / LOGO_FILE)

    total = _ffprobe_duration(narration)
    (audio_dir / "section_timings.json").write_text(json.dumps(timed, indent=2), encoding="utf-8")
    (audio_dir / "captions.json").write_text(json.dumps(captions), encoding="utf-8")
    (audio_dir / "sections.json").write_text(json.dumps(sections, indent=2), encoding="utf-8")
    return narration, timed, captions, total


# ---------------------------------------------------------------------------
# Remotion props
# ---------------------------------------------------------------------------
def _base_cut(
    cid: str,
    t0: float,
    t1: float,
    *,
    reason: str,
    shot_intent: str,
    hero: bool = False,
    narrative_role: str = "deliver_payload",
) -> dict:
    return {
        "id": cid,
        "source": "",
        "in_seconds": round(t0, 3),
        "out_seconds": round(t1, 3),
        "transition_in": "slide-left",
        "transition_out": "fade",
        "transition_duration": 0.25,
        "backgroundColor": WHITE,
        "reason": reason,
        "shot_intent": shot_intent,
        "narrative_role": narrative_role,
        "information_role": shot_intent,
        "hero_moment": hero,
        "shot_language": {
            "shot_size": "medium",
            "camera_movement": "static",
            "lighting_key": "high_key",
            "color_temperature": "neutral",
        },
        "color": SLATE,
        "accentColor": TEAL,
        "logo": LOGO_FILE,
        "logoVariant": "badge",
    }


def table_rows_from_ranking(rows: list[dict]) -> list[dict]:
    out = []
    for i, r in enumerate(rows, 1):
        out.append(
            {
                "rank": i,
                "lender": r["lender"],
                "rate": fmt_rate(r["rate"]),
                "label": mt_label(r.get("mortgage_type", "")).title(),
            }
        )
    return out


def build_cuts(timed: list[dict], rankings: dict, as_of: datetime) -> list[dict]:
    """v2 cut structure: hook → (section title + data_table) × N → gap → CTA."""
    by_id = {s["id"]: s for s in timed}
    cuts: list[dict] = []
    date_short = as_of.strftime("%b %-d, %Y")
    fixed5 = rankings["fixed_5y"]
    var5 = rankings["variable_5y"]
    fixed3 = rankings["fixed_3y"]
    gap = rankings["gap_vs_big5"]
    overall = rankings["overall_best"]

    # --- Hook ---
    s1 = by_id["s1_hook"]
    mid1 = s1["start"] + (s1["end"] - s1["start"]) * 0.45
    c = _base_cut(
        "sc1",
        s1["start"],
        mid1,
        reason="Hero",
        shot_intent="hook",
        hero=True,
        narrative_role="establish_context",
    )
    c.update(
        {
            "type": "hero_title",
            "text": "Canada's Best Mortgage Rates",
            "heroSubtitle": f"Top 5 by term · {date_short} · latestmortgagerates.ca",
            "logoVariant": "hero",
        }
    )
    cuts.append(c)

    best = fixed5[0] if fixed5 else None
    c = _base_cut("sc2", mid1, s1["end"], reason="Hook rate", shot_intent="key number", hero=True)
    if best:
        c.update(
            {
                "type": "stat_card",
                "stat": fmt_rate(best["rate"]),
                "subtitle": f"Best 5-year fixed · {best['lender']} · {mt_label(best.get('mortgage_type',''))}",
                "fontSize": 96,
            }
        )
    else:
        c.update({"type": "text_card", "text": "Top 5 rates by term", "fontSize": 56})
    cuts.append(c)

    def add_term_section(sec_id: str, section_title: str, rows: list[dict], prefix: str, note_key: str):
        """Visually distinct section: title beat, then data_table beat (no combined scroll dump)."""
        s = by_id[sec_id]
        note = rankings["prefer_insured_note"].get(note_key, "")
        if not rows:
            c0 = _base_cut(f"{prefix}_title", s["start"], s["end"], reason=section_title, shot_intent="explanation")
            c0.update(
                {
                    "type": "callout",
                    "title": section_title,
                    "text": "No quotes in today's file",
                    "callout_type": "warning",
                }
            )
            cuts.append(c0)
            return

        dur = s["end"] - s["start"]
        # ~22% title card, rest = table (table must dominate the section)
        t_split = s["start"] + min(5.5, max(3.2, dur * 0.22))

        c_title = _base_cut(
            f"{prefix}_title",
            s["start"],
            t_split,
            reason=f"{section_title} section",
            shot_intent="section",
            hero=True,
            narrative_role="establish_context",
        )
        c_title.update(
            {
                "type": "hero_title",
                "text": section_title,
                "heroSubtitle": f"Top 5 · {note}",
                "logoVariant": "badge",
            }
        )
        cuts.append(c_title)

        c_table = _base_cut(
            f"{prefix}_table",
            t_split,
            s["end"],
            reason=f"{section_title} table",
            shot_intent="table",
            hero=True,
        )
        c_table.update(
            {
                "type": "data_table",
                "title": f"{section_title} — Top 5",
                "tableColumns": ["#", "Lender", "Rate", "Type"],
                "tableRows": table_rows_from_ranking(rows),
            }
        )
        cuts.append(c_table)

    add_term_section("s2_fixed5", "5-Year Fixed", fixed5, "sc3", "fixed_5y")
    add_term_section("s3_var5", "5-Year Variable", var5, "sc4", "variable_5y")
    add_term_section("s4_fixed3", "3-Year Fixed", fixed3, "sc5", "fixed_3y")

    # Gap / overall — keep as its own section after term tables
    if "s5_gap" in by_id:
        s = by_id["s5_gap"]
        mid = s["start"] + (s["end"] - s["start"]) * 0.5
        if gap:
            c = _base_cut("sc6a", s["start"], mid, reason="Gap vs Big-5", shot_intent="comparison", hero=True)
            c.update(
                {
                    "type": "comparison",
                    "title": "5-Year Fixed: Best vs Big-5",
                    "leftLabel": f"Best · {gap['best']['lender']}",
                    "leftValue": fmt_rate(gap["best"]["rate"]),
                    "rightLabel": f"Big-5 · {gap['big5']['lender']}",
                    "rightValue": fmt_rate(gap["big5"]["rate"]),
                    "cardBackgroundColor": CARD_BG,
                    "textColor": SLATE,
                    "leftColor": EMERALD,
                    "rightColor": MUTED,
                }
            )
            cuts.append(c)
            c = _base_cut("sc6b", mid, s["end"], reason="Gap delta", shot_intent="key number", hero=True)
            c.update(
                {
                    "type": "stat_card",
                    "stat": f"{gap['delta_pp']:.2f} pp",
                    "subtitle": "Gap — Big-5 lowest vs today's best 5-year fixed",
                    "fontSize": 84,
                }
            )
            cuts.append(c)
        elif overall:
            c = _base_cut("sc6a", s["start"], s["end"], reason="Overall best", shot_intent="key number", hero=True)
            c.update(
                {
                    "type": "stat_card",
                    "stat": fmt_rate(overall["rate"]),
                    "subtitle": f"Best overall in this cut · {overall['lender']}",
                    "fontSize": 88,
                }
            )
            cuts.append(c)

    # CTA
    s = by_id["s6_cta"]
    mid = s["start"] + (s["end"] - s["start"]) * 0.55
    c = _base_cut("sc7a", s["start"], mid, reason="CTA", shot_intent="cta", hero=True, narrative_role="call_to_action")
    c.update(
        {
            "type": "hero_title",
            "text": "latestmortgagerates.ca",
            "heroSubtitle": "Compare all rates · verify with the lender",
            "logoVariant": "hero",
        }
    )
    cuts.append(c)
    c = _base_cut("sc7b", mid, s["end"], reason="NFA", shot_intent="cta", narrative_role="call_to_action")
    c.update(
        {
            "type": "text_card",
            "text": "Rates change — verify the live quote.\nEducational only — not financial advice.",
            "fontSize": 44,
        }
    )
    cuts.append(c)

    if cuts and timed:
        cuts[-1]["out_seconds"] = timed[-1]["end"]
    return cuts


def build_props(cuts: list[dict], captions: list[dict], total_dur: float, as_of: datetime, source: str) -> dict:
    return {
        "version": "1.0",
        "renderer_family": "explainer-data",
        "render_runtime": "remotion",
        "composition_mode": "templated",
        "playbook": "latestmortgagerates",
        "cuts": cuts,
        "audio": {"narration": {"src": "narration_full.mp3", "volume": 1.0}},
        "captions": captions,
        "subtitles": {
            "enabled": True,
            "style": "word-by-word",
            "position": "bottom-center",
            "font_size": 48,
            "font": "Inter",
            "color": SLATE,
            "background": "rgba(255,255,255,0.92)",
            "max_words_per_line": 4,
        },
        "slideshow_risk_score": 0,
        "metadata": {
            "playbook": "latestmortgagerates",
            "delivery_promise": {
                "promise_type": "data_explainer",
                "motion_required": True,
                "tone_mode": "educational",
                "quality_floor": "presentable",
                "approved_fallback": "still_led",
            },
            "media_profile": "youtube_landscape",
            "voice": VOICE,
            "voice_rate": VOICE_RATE,
            "logo": LOGO_FILE,
            "logo_policy": "hero on first/CTA; badge top-right on every other cut",
            "music_policy": "voice_only",
            "brand": "latestmortgagerates",
            "rates_source": source,
            "as_of": as_of.isoformat(),
            "duration_seconds": total_dur,
        },
        "themeConfig": {
            "primaryColor": TEAL,
            "accentColor": EMERALD,
            "backgroundColor": WHITE,
            "surfaceColor": SURFACE,
            "textColor": SLATE,
            "mutedTextColor": MUTED,
            "headingFont": "Inter",
            "bodyFont": "Inter",
            "monoFont": "JetBrains Mono",
            "chartColors": [TEAL, EMERALD, TEAL_DARK, MUTED, SLATE, "#14B8A6"],
            "springConfig": {"damping": 14, "stiffness": 160, "mass": 0.9},
            "transitionDuration": 0.25,
            "captionHighlightColor": TEAL,
            "captionBackgroundColor": "rgba(255, 255, 255, 0.92)",
            "captionFontSize": 48,
            "captionLetterSpacing": "0.06em",
            "captionWordsPerPage": 4,
        },
    }


# ---------------------------------------------------------------------------
# Thumbnail
# ---------------------------------------------------------------------------
def make_thumbnail(path: Path, rankings: dict, as_of: datetime) -> Path:
    from PIL import Image, ImageDraw, ImageFont

    W, H = 1280, 720
    img = Image.new("RGB", (W, H), SLATE)
    draw = ImageDraw.Draw(img)
    # teal accent bar
    draw.rectangle([0, 0, W, 16], fill=TEAL)
    draw.rectangle([0, H - 16, W, H], fill=EMERALD)

    def font(size: int):
        for fp in (
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
            "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
        ):
            if Path(fp).exists():
                return ImageFont.truetype(fp, size)
        return ImageFont.load_default()

    f_huge = font(120)
    f_title = font(54)
    f_sub = font(36)
    f_small = font(28)

    best = rankings["fixed_5y"][0] if rankings["fixed_5y"] else None
    rate_txt = fmt_rate(best["rate"]) if best else "TOP 5"
    lender = best["lender"] if best else ""

    draw.text((64, 80), "TOP 5 RATES", font=f_title, fill=TEAL)
    draw.text((64, 160), rate_txt, font=f_huge, fill=WHITE)
    draw.text((64, 310), "Best 5-Year Fixed Today", font=f_sub, fill="#94A3B8")
    if lender:
        draw.text((64, 370), lender, font=f_title, fill=EMERALD)
    draw.text(
        (64, 480),
        f"Canada · {as_of.strftime('%b %-d, %Y')}",
        font=f_small,
        fill="#CBD5E1",
    )
    draw.text((64, 540), "latestmortgagerates.ca", font=f_sub, fill=TEAL)

    # logo badge
    logo_path = IMAGES / LOGO_FILE
    if logo_path.exists():
        try:
            logo = Image.open(logo_path).convert("RGBA")
            logo.thumbnail((160, 160))
            img.paste(logo, (W - 200, 40), logo)
        except Exception:  # noqa: BLE001
            pass

    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")
    return path


# ---------------------------------------------------------------------------
# Render
# ---------------------------------------------------------------------------
def run_remotion(props_path: Path, out_mp4: Path, concurrency: int = 4) -> tuple[bool, str]:
    out_mp4.parent.mkdir(parents=True, exist_ok=True)
    log_path = RENDERS / "render_v2.log"
    cmd = [
        "npx",
        "remotion",
        "render",
        str(COMPOSER / "src" / "index.tsx"),
        "Explainer",
        str(out_mp4),
        f"--props={props_path}",
        f"--public-dir={PUBLIC}",
        "--width",
        str(WIDTH),
        "--height",
        str(HEIGHT),
        f"--concurrency={concurrency}",
        "--timeout=120000",
    ]
    with open(log_path, "w", encoding="utf-8") as log:
        log.write("CMD: " + " ".join(cmd) + "\n\n")
        log.flush()
        proc = subprocess.Popen(
            cmd,
            cwd=str(COMPOSER),
            stdout=log,
            stderr=subprocess.STDOUT,
            text=True,
        )
        rc = proc.wait()
    ok = rc == 0 and out_mp4.exists() and out_mp4.stat().st_size > 10_000
    return ok, str(log_path)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main() -> int:
    ap = argparse.ArgumentParser(description="Build LMR Top-5-by-term YouTube landscape video")
    ap.add_argument("--skip-render", action="store_true")
    ap.add_argument("--rates", type=Path, default=None)
    ap.add_argument("--concurrency", type=int, default=4)
    args = ap.parse_args()

    for d in (ARTIFACTS, RENDERS, PUBLIC, AUDIO, IMAGES):
        d.mkdir(parents=True, exist_ok=True)

    print("== Fetch rates ==")
    rates, source = fetch_rates(args.rates)
    print(f"source={source} rows={len(rates)}")
    rankings = build_rankings(rates)
    as_of = datetime.now(TZ)

    # Spot-check print
    for key, label in (
        ("fixed_5y", "5y fixed"),
        ("variable_5y", "5y variable"),
        ("fixed_3y", "3y fixed"),
    ):
        print(f"\nTop 5 {label} ({rankings['prefer_insured_note'][key]}):")
        for i, r in enumerate(rankings[key], 1):
            print(f"  {i}. {r['rate']:.2f}%  {r['lender']}  [{r.get('mortgage_type')}]")

    sections = build_script_sections(rankings, as_of)

    print("\n== TTS narration ==")
    narration, timed, captions, total_dur = generate_narration(sections, AUDIO)
    print(f"narration={narration} duration={total_dur:.2f}s captions={len(captions)}")

    # Align section script JSON with measured timings
    script = {
        "version": "2.0",
        "title": "Canada's Best Mortgage Rates Today — Top 5 by Term",
        "total_duration_seconds": total_dur,
        "media_profile": "youtube_landscape",
        "voice_performance": {
            "performance_intent": "Educational Latest Mortgage Rates — clear Canadian rate guide",
            "pacing_profile": "energetic",
            "provider_notes": {"edge_tts": f"{VOICE} rate={VOICE_RATE}"},
        },
        "rates_source": source,
        "as_of": as_of.isoformat(),
        "rankings": {
            k: [
                {
                    "rank": i,
                    "lender": r["lender"],
                    "rate": r["rate"],
                    "mortgage_type": r.get("mortgage_type"),
                    "rate_type": r.get("rate_type"),
                    "term_months": r.get("term_months"),
                }
                for i, r in enumerate(rankings[k], 1)
            ]
            for k in ("fixed_5y", "variable_5y", "fixed_3y")
        },
        "gap_vs_big5": (
            {
                "best_lender": rankings["gap_vs_big5"]["best"]["lender"],
                "best_rate": rankings["gap_vs_big5"]["best"]["rate"],
                "big5_lender": rankings["gap_vs_big5"]["big5"]["lender"],
                "big5_rate": rankings["gap_vs_big5"]["big5"]["rate"],
                "delta_pp": rankings["gap_vs_big5"]["delta_pp"],
            }
            if rankings["gap_vs_big5"]
            else None
        ),
        "sections": [
            {
                "id": t["id"],
                "label": t["label"],
                "text": t["text"],
                "start_seconds": t["start"],
                "end_seconds": t["end"],
            }
            for t in timed
        ],
    }
    script_path = ARTIFACTS / "script_v2_landscape.json"
    script_path.write_text(json.dumps(script, indent=2), encoding="utf-8")

    rankings_path = ARTIFACTS / "rankings_v2.json"
    # JSON-safe rankings (drop _raw)
    def scrub(rows):
        return [
            {k: v for k, v in r.items() if k != "_raw"}
            for r in rows
        ]

    rankings_path.write_text(
        json.dumps(
            {
                "source": source,
                "as_of": as_of.isoformat(),
                "fixed_5y": scrub(rankings["fixed_5y"]),
                "variable_5y": scrub(rankings["variable_5y"]),
                "fixed_3y": scrub(rankings["fixed_3y"]),
                "prefer_insured_note": rankings["prefer_insured_note"],
                "gap_vs_big5": (
                    {
                        "best": scrub([rankings["gap_vs_big5"]["best"]])[0],
                        "big5": scrub([rankings["gap_vs_big5"]["big5"]])[0],
                        "delta_pp": rankings["gap_vs_big5"]["delta_pp"],
                    }
                    if rankings["gap_vs_big5"]
                    else None
                ),
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    print("\n== Remotion props ==")
    cuts = build_cuts(timed, rankings, as_of)
    props = build_props(cuts, captions, total_dur, as_of, source)
    props_path = RENDERS / ".remotion_props_v2_landscape.json"
    props_path.write_text(json.dumps(props), encoding="utf-8")
    print(f"cuts={len(cuts)} props={props_path}")

    print("\n== Thumbnail ==")
    thumb = ARTIFACTS / "thumbnail_v2.png"
    make_thumbnail(thumb, rankings, as_of)
    thumb_render = RENDERS / "thumbnail_v2.png"
    shutil.copy2(thumb, thumb_render)
    print(f"thumbnail={thumb}")

    out_mp4 = RENDERS / "final_landscape_v2.mp4"
    render_ok = False
    render_log = ""
    render_error = None
    if args.skip_render:
        print("\n== Skip Remotion render (--skip-render) ==")
    else:
        print("\n== Remotion render (this can take a while) ==")
        try:
            render_ok, render_log = run_remotion(props_path, out_mp4, concurrency=args.concurrency)
        except Exception as e:  # noqa: BLE001
            render_error = str(e)
            render_ok = False
            render_log = str(RENDERS / "render_v2.log")
        print(f"render_ok={render_ok} log={render_log}")

    meta = {
        "revision": "v2-section-tables",
        "title": script["title"],
        "total_duration_seconds": total_dur,
        "narration_duration_seconds": total_dur,
        "voice": VOICE,
        "rate": VOICE_RATE,
        "sections": len(timed),
        "cuts": len(cuts),
        "logo": f"assets/images/{LOGO_FILE}",
        "music": None,
        "music_policy": "voice_only",
        "resolution": f"{WIDTH}x{HEIGHT}",
        "fps": FPS,
        "profile": "youtube_landscape",
        "media_profile": "youtube_landscape",
        "playbook": "latestmortgagerates",
        "brand_colors": {"accent": TEAL, "accent2": EMERALD, "text": SLATE, "bg": WHITE},
        "rates_source": source,
        "as_of": as_of.isoformat(),
        "output_project": str(out_mp4),
        "thumbnail": str(thumb),
        "thumbnail_size": "1280x720",
        "props": str(props_path),
        "script": str(script_path),
        "rankings": str(rankings_path),
        "composition": "Explainer",
        "concurrency": args.concurrency,
        "status": "success" if render_ok else ("artifacts_only" if args.skip_render else "render_failed"),
        "render_log": render_log,
        "render_error": render_error,
        "file_size_bytes": out_mp4.stat().st_size if out_mp4.exists() else 0,
        "youtube_upload": False,
        "spot_check": {
            "fixed_5y_1": rankings["fixed_5y"][0]["rate"] if rankings["fixed_5y"] else None,
            "variable_5y_1": rankings["variable_5y"][0]["rate"] if rankings["variable_5y"] else None,
            "fixed_3y_1": rankings["fixed_3y"][0]["rate"] if rankings["fixed_3y"] else None,
        },
        "completed_at": datetime.now(timezone.utc).isoformat(),
    }
    meta_path = ARTIFACTS / "v2_landscape_build_meta.json"
    meta_path.write_text(json.dumps(meta, indent=2), encoding="utf-8")

    (ARTIFACTS / "rates_snapshot.json").write_text(
        json.dumps(scrub(rates), indent=2), encoding="utf-8"
    )

    print("\n== Done ==")
    print(json.dumps({"status": meta["status"], "mp4": str(out_mp4), "duration": total_dur, "meta": str(meta_path)}, indent=2))
    return 0 if (render_ok or args.skip_render) else 1


if __name__ == "__main__":
    sys.exit(main())
