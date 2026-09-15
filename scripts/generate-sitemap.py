#!/usr/bin/env python3
"""
Post-build sitemap helper.

Astro (@astrojs/sitemap) is the source of truth. It emits sitemap-0.xml with
trailing-slash canonical URLs matching `trailingSlash: 'always'`.

Google Search Console is already submitted at `/sitemap.xml`, so copy the Astro
chunk to that filename after `npm run build`. Do **not** write `public/sitemap.xml`
before the build — a hand-rolled sitemap without trailing slashes used to land
in `dist/sitemap.xml` and override the canonical list.
"""

from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
SRC = DIST / "sitemap-0.xml"
DEST = DIST / "sitemap.xml"

ROBOTS = """User-agent: *
Allow: /

# Canonical sitemap (trailing-slash 200 URLs from the Astro build)
Sitemap: https://latestmortgagerates.ca/sitemap.xml

# Disallow admin/staging areas (none currently)

# Crawl rate - allow search engines to crawl freely
Crawl-delay: 1
"""


def generate_robots_txt():
    output_path = ROOT / "public" / "robots.txt"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(ROBOTS)
    print(f"Wrote {output_path}")
    return output_path


def copy_astro_sitemap():
    if not SRC.exists():
        print(
            f"No {SRC.relative_to(ROOT)} yet. Run this after `npm run build`.",
            file=sys.stderr,
        )
        return False
    shutil.copyfile(SRC, DEST)
    print(f"Copied {SRC.relative_to(ROOT)} -> {DEST.relative_to(ROOT)}")
    return True


if __name__ == "__main__":
    generate_robots_txt()
    public_sitemap = ROOT / "public" / "sitemap.xml"
    if public_sitemap.exists():
        public_sitemap.unlink()
        print(f"Removed {public_sitemap} so it cannot override the Astro sitemap")
    ok = copy_astro_sitemap()
    if not ok:
        sys.exit(0)
    print("SEO files generated successfully!")
