# Lender logos

Self-hosted marks for the lenders in `data/rates.json`. The site does not hotlink a logo API.

- Files live in this directory as `public/logos/<slug>.svg`, `.png`, or `.webp`.
- Provenance is recorded in `src/data/lender-logos.json` (`slug`, `file`, `source_url`, `retrieved`).
- `LenderLogo` renders the file at a fixed height. If a slug has no file, it draws a monogram badge instead.

Sources are each lender's own site header, icon, or newsroom image, or Wikimedia Commons when the file is the official mark. A few white-on-dark header SVGs were recolored to the lender's published brand color so they stay readable on white; those notes are in the manifest.
