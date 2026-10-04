# Lender logos

Self-hosted marks for the lenders in `data/rates.json`. The site does not hotlink a logo API.

- Files live in this directory as `public/logos/<slug>.svg`, `.png`, or `.webp`.
- Provenance is recorded in `src/data/lender-logos.json` (`slug`, `file`, `source_url`, `retrieved`).
- Every file uses the same transparent 4:1 canvas (`320×80`). Source artwork is trimmed to its ink, then centered with shared padding so a wide wordmark and a square icon carry similar visual weight. SVG stays vector. Raster files are `320×80` pixels, which is 2× the largest on-page frame.
- `LenderLogo` paints that canvas in one fixed frame per context (`xs` 80×20, `sm` 112×28, `md` 128×32, `lg` 160×40) with `object-fit: contain` on a white tile. If a slug has no file, it draws a monogram inside the same frame.

Sources are each lender's own site header, icon, or newsroom image, or Wikimedia Commons when the file is the official mark. A few white-on-dark header SVGs were recolored to the lender's published brand color so they stay readable on white; those notes are in the manifest.
