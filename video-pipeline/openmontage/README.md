# LMR OpenMontage — Top 5 rates by term (YouTube landscape)

Automated weekly-friendly pipeline that:

1. Fetches live Canadian mortgage rates  
2. Ranks **Top 5** for **5-year fixed**, **5-year variable**, and **3-year fixed**  
3. Writes OpenMontage script + Remotion Explainer props  
4. Generates **edge-tts** narration (`en-US-AndrewNeural`, `+12%`)  
5. Renders a **1920×1080** MP4 + **1280×720** CTR thumbnail  

Does **not** upload to YouTube.

Brand / production rules: [`VIDEO-RULES.md`](./VIDEO-RULES.md).

## Setup

OpenMontage lives **outside** this repo (do not vendor the monorepo or Remotion `node_modules` here):

```text
$OPENMONTAGE_ROOT/projects/lmr-top5-rates-by-term/
```

Default box layout: `OPENMONTAGE_ROOT=/workspace/OpenMontage`. See [`project.example.json`](./project.example.json) for stub metadata only.

## One-command rebuild

```bash
export OPENMONTAGE_ROOT="${OPENMONTAGE_ROOT:-/workspace/OpenMontage}"

"$OPENMONTAGE_ROOT/.venv/bin/python" \
  video-pipeline/openmontage/build_top5_by_term.py
```

Artifacts-only (skip Remotion — useful for fast script/TTS refresh):

```bash
"$OPENMONTAGE_ROOT/.venv/bin/python" \
  video-pipeline/openmontage/build_top5_by_term.py \
  --skip-render
```

Use a pinned rates file:

```bash
"$OPENMONTAGE_ROOT/.venv/bin/python" \
  video-pipeline/openmontage/build_top5_by_term.py \
  --rates data/rates.json
```

## Outputs

All generated files land under `$OPENMONTAGE_ROOT/projects/lmr-top5-rates-by-term/` (not committed here):

| Artifact | Path under project |
|----------|--------------------|
| Final MP4 | `renders/final_landscape_v2.mp4` |
| Remotion props | `renders/.remotion_props_v2_landscape.json` |
| Script | `artifacts/script_v2_landscape.json` |
| Rankings spot-check | `artifacts/rankings_v2.json` |
| Thumbnail | `artifacts/thumbnail_v2.png` |
| Build meta | `artifacts/v2_landscape_build_meta.json` |
| Narration | `public/narration_full.mp3` |
| Render log | `renders/render_v2.log` |

## Data source order

1. Live `https://latestmortgagerates.ca/rates.json` (full board)  
2. Live slim `https://latestmortgagerates.ca/api/rates.json` (kept only if nothing else works)  
3. Local repo `data/rates.json` (Astro build source)  
4. GitHub `drewbotcarrothers/latestmortgagerates` `data/rates.json` via `gh`

Both API and scrape object shapes are normalized in the builder.

## Visual sections (v2+)

Each category is its own section: **title beat → `data_table` beat** (rank, lender, rate %, insured/uninsured). Requires OpenMontage Remotion `DataTable` component (`cut.type = "data_table"`).

## Ranking rules

- Lowest rate wins; dedupe by lender.  
- Prefer **insured** when enough insured quotes exist; otherwise insured-first then fill; labels always on screen.  
- Soft Big-5 gap callout when Big-5 5-year fixed quotes exist.

## Dependencies

- OpenMontage clone at `OPENMONTAGE_ROOT` with `remotion-composer` `node_modules`  
- `$OPENMONTAGE_ROOT/.venv` with `edge-tts` (and Pillow for thumbnails)  
- `ffmpeg` / `ffprobe`  
- Network for live rates + edge-tts  
- Optional: `gh` auth for GitHub fallback  

YouTube upload (future): Google OAuth client for the LMR channel — **not** configured by this script.

## Not in this repo

Do not commit `rates_live.json`, MP4s, Remotion renders, narration audio, thumbnails, or other generated artifacts. See [`.gitignore`](./.gitignore).
