# Latest Mortgage Rates — Video production rules

**Brand:** Latest Mortgage Rates  
**Site:** https://latestmortgagerates.ca  
**Product (default):** Landscape YouTube — *Top 5 rates by term*  
**Last updated:** 2026-09-15 (ET)

Read this file **before** scripting, TTS, Remotion props, thumbnailing, or uploading any LMR YouTube video.

---

## 1. Format & packaging

| Rule | Spec |
|------|------|
| Aspect | **Landscape long-form** `1920×1080` (`youtube_landscape`) — not Shorts / 9:16 for this product |
| Length | Prefer **~2–4 minutes** for weekly Top-5-by-term |
| Audio | **Voice-only** — no music bed |
| Voice | Microsoft Edge neural TTS **`en-US-AndrewNeural`**, rate **`+12%`** |
| Thumbnail | Custom **CTR thumbnail** `1280×720`: huge best rate %, “TOP 5 RATES”, lender, date, site URL |
| Upload | Manual YouTube Studio (do **not** auto-upload from this pipeline yet) |

---

## 2. Brand visual language (NOT StockSummarizer)

StockSummarizer is white/red/black. **Do not copy that palette** for LMR.

| Token | Hex | Use |
|-------|-----|-----|
| Teal accent | `#0D9488` | Primary accent, captions highlight, bars |
| Emerald | `#059669` | Secondary accent, “best” emphasis |
| Teal dark | `#0F766E` | Deep accent |
| Slate text | `#0F172A` | Body / headings on light |
| Muted | `#334155` | Secondary text |
| White bg | `#FFFFFF` | Default Explainer background (high contrast) |
| Mint surface | `#F0FDFA` / `#ECFDF5` | Cards / comparison panels |

- Large type, high contrast, one idea per beat (~8–12s).
- Logo: **hero** on first frame + CTA; **badge top-right** on every other cut (`lmr-logo.png`).
- Always label **insured / uninsured** when showing a rate.

---

## 3. Data rules

1. Prefer live full board: `https://latestmortgagerates.ca/rates.json` (scrape shape).  
2. Fallback: repo `data/rates.json` (parent of `video-pipeline/`), then GitHub `drewbotcarrothers/latestmortgagerates` `data/rates.json` via `gh`.  
3. Slim API `/api/rates.json` is top-N only — fine for a hook check, **not** enough for multi-term Top 5.  
4. Normalize both API `{lender, rate, type}` and scrape `{lender_name, term_months, rate_type, mortgage_type, rate}` shapes.  
5. Ranking: lowest rate first; **dedupe by lender**; prefer **insured** when ≥5 insured quotes exist for that term/type, otherwise insured-first then fill with uninsured (label clearly).  
6. Default terms: **5y fixed**, **5y variable**, **3y fixed**.  
7. Soft NFA every episode: rates change; verify with lender; educational only.

---

## 4. Default structure (Top 5 by term)

1. Hook + date + latestmortgagerates.ca branding  
2. **Section: 5-year fixed** — section title beat, then **`data_table`** (rank / lender / rate / type)  
3. **Section: 5-year variable** — section title beat, then **`data_table`**  
4. **Section: 3-year fixed** — section title beat, then **`data_table`**  
5. Best overall / gap vs Big-5 posted (when data allows)  
6. CTA → latestmortgagerates.ca + NFA  

**Do not** dump all rankings into one continuous scroll. Each term/type gets its own visually distinct section (title → table).

On-screen table columns: `#`, `Lender`, `Rate`, `Type` (insured/uninsured). Remotion cut type: `data_table`.

---

## 5. Voiceover hygiene

- Speak rates as *“three point five nine percent”* (script already does this in the builder).  
- Say “five-year fixed / variable”, “three-year fixed”.  
- Say “insured” / “uninsured” explicitly.  
- “latestmortgagerates.ca” is fine as-written for AndrewNeural.  
- No buy/sell / “you should refinance” commands — informational only.

---

## 6. OpenMontage checklist

- [ ] Project: `$OPENMONTAGE_ROOT/projects/lmr-top5-rates-by-term/` (default `/workspace/OpenMontage`)  
- [ ] Pipeline: `video-pipeline/openmontage/build_top5_by_term.py` in this repo  
- [ ] `media_profile`: `youtube_landscape`  
- [ ] `music_policy`: `voice_only`  
- [ ] Narration → `public/narration_full.mp3`  
- [ ] Props → `renders/.remotion_props_v2_landscape.json`  
- [ ] Script → `artifacts/script_v2_landscape.json`  
- [ ] Each term section uses `data_table` (not a single mega-list)  
- [ ] Thumbnail PNG beside meta  
- [ ] Spot-check: on-screen #1 matches lowest rate for that term in the snapshot  

---

## 7. YouTube upload (manual — later)

- Title: hook + “Top 5” + date/Canada  
- Description: plain summary, link to site, NFA, light tags  
- Custom thumbnail  
- Public landscape long-form (not Shorts packaging)  
- Secrets/deps for upload are **out of scope** for this builder (no OAuth wired here)

---

## 8. Change log

- **2026-09-15** — v2: separate sections per term + `data_table` cut type (not callout lists).
- **2026-09-15** — Initial LMR Top-5-by-term landscape rules (teal brand, voice-only AndrewNeural +12%).
