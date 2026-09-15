#!/usr/bin/env python3
"""Convert Next.js app/ sources into Astro-ready React views + page wrappers."""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APP = ROOT / "app"
SRC = ROOT / "src"
VIEWS = SRC / "views"
COMPONENTS = SRC / "components"
CONTENT = SRC / "content"
PAGES = SRC / "pages"

SITE = "https://latestmortgagerates.ca"


def _skip_balanced(content: str, start: int) -> int:
    """Return index after the first balanced `{...}` starting at/after start."""
    i = content.find("{", start)
    if i < 0:
        return -1
    depth = 0
    in_str = None
    escape = False
    while i < len(content):
        ch = content[i]
        if in_str:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == in_str:
                in_str = None
        elif ch in ('"', "'", "`"):
            in_str = ch
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    return -1


def strip_export_block(content: str, prefix: str) -> str:
    idx = 0
    while True:
        match = re.search(rf"^{re.escape(prefix)}\b", content[idx:], flags=re.M)
        if not match:
            return content
        start = idx + match.start()
        end = _skip_balanced(content, start)
        if end < 0:
            return content
        while end < len(content) and content[end] in "; \t":
            end += 1
        if end < len(content) and content[end] == "\n":
            end += 1
        content = content[:start] + content[end:]
        idx = start


def strip_named_function(content: str, name: str) -> str:
    pattern = rf"^export (?:async )?function {name}\b"
    idx = 0
    while True:
        match = re.search(pattern, content[idx:], flags=re.M)
        if not match:
            return content
        start = idx + match.start()
        i = idx + match.end()
        paren = 0
        seen_paren = False
        body_at = -1
        while i < len(content):
            ch = content[i]
            if ch == "(":
                paren += 1
                seen_paren = True
            elif ch == ")":
                paren -= 1
            elif ch == "{" and seen_paren and paren == 0:
                body_at = i
                break
            i += 1
        if body_at < 0:
            return content
        end = _skip_balanced(content, body_at)
        if end < 0:
            return content
        if end < len(content) and content[end] == "\n":
            end += 1
        content = content[:start] + content[end:]
        idx = start


def transform_source(content: str) -> str:
    """Strip Next.js-only APIs and rewrite to plain React."""
    content = re.sub(r'^import type \{ Metadata \} from ["\']next["\'];\n', "", content, flags=re.M)
    content = re.sub(r'^import \{ Metadata \} from ["\']next["\'];\n', "", content, flags=re.M)
    content = re.sub(r'^import type \{ MetadataRoute \} from ["\']next["\'];\n', "", content, flags=re.M)
    content = re.sub(r'^import Link from ["\']next/link["\'];\n', "", content, flags=re.M)
    content = re.sub(r"^import Link from ['\"]next/link['\"];\n", "", content, flags=re.M)
    content = re.sub(r'^import Image from ["\']next/image["\'];\n', "", content, flags=re.M)
    content = re.sub(r'^import \{ notFound \} from ["\']next/navigation["\'];\n', "", content, flags=re.M)
    content = re.sub(r'^import \{ usePathname \} from ["\']next/navigation["\'];\n', "", content, flags=re.M)

    content = re.sub(
        r'from ["\'](?:\.\./)+components/',
        'from "@/components/',
        content,
    )
    content = re.sub(r'from ["\']\./components/', 'from "@/components/', content)
    content = re.sub(
        r'from ["\'](?:\.\./)+data/',
        'from "@/data/',
        content,
    )
    content = content.replace('from "../blog/data"', 'from "@/content/blog"')
    content = content.replace("from '../blog/data'", 'from "@/content/blog"')
    content = content.replace('from "../data"', 'from "@/content/blog"')
    content = content.replace('from "../terms"', 'from "@/content/glossary"')
    content = content.replace('from "../../data/lenderContent.json"', 'from "@/content/lenderContent.json"')
    content = content.replace('from "../../glossary/terms"', 'from "@/content/glossary"')
    content = content.replace('from "../glossary/terms"', 'from "@/content/glossary"')
    content = content.replace('from "./data"', 'from "@/content/blog"')
    content = content.replace('from "../data.ts"', 'from "@/content/blog"')

    # Local relative component imports inside components/ stay as-is
    content = content.replace("</Link>", "</a>")
    content = re.sub(r"<Link\b", "<a", content)

    content = re.sub(r"<Image\b", "<img", content)
    content = re.sub(r"\s+priority(?:=\{true\})?(?=\s|/|>)", "", content)
    # Next/Image `fill` boolean only — do not strip SVG fill="none"
    content = re.sub(r"\s+fill(?:=\{true\})?(?=\s|/|>)", "", content)
    content = re.sub(r"\s+sizes=\{[^}]+\}", "", content)
    content = re.sub(r'\s+sizes="[^"]*"', "", content)

    content = re.sub(r"^export const dynamic\s*=\s*['\"]force-static['\"];\n", "", content, flags=re.M)
    content = re.sub(r"^export const dynamicParams\s*=\s*false;\n", "", content, flags=re.M)

    content = strip_export_block(content, "export const metadata")
    content = strip_named_function(content, "generateMetadata")
    content = strip_named_function(content, "generateStaticParams")

    content = content.replace("notFound();", "return null;")

    # JSON-LD scripts: keep dangerouslySetInnerHTML (valid in React)
    return content


def extract_metadata(original: str) -> dict:
    """Pull title/description/canonical from a Next metadata object when present."""
    meta = {
        "title": "Latest Mortgage Rates Canada",
        "description": "Compare the latest mortgage rates from Canada's top lenders.",
        "canonical": None,
        "keywords": None,
    }
    m = re.search(r"export const metadata: Metadata = \{([\s\S]*?)\n\};", original)
    if not m:
        return meta
    block = m.group(1)
    title = re.search(r'title:\s*"([^"]+)"', block)
    desc = re.search(r'description:\s*"([^"]+)"', block)
    # template literals
    if not title:
        title = re.search(r"title:\s*`([^`]+)`", block)
    if not desc:
        desc = re.search(r"description:\s*`([^`]+)`", block)
    canon = re.search(r'canonical:\s*"([^"]+)"', block)
    if not canon:
        canon = re.search(r"canonical:\s*`([^`]+)`", block)
    if title:
        meta["title"] = title.group(1)
    if desc:
        meta["description"] = desc.group(1)
    if canon:
        meta["canonical"] = canon.group(1)
    return meta


def astro_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)


def copy_components() -> None:
    if COMPONENTS.exists():
        shutil.rmtree(COMPONENTS)
    shutil.copytree(APP / "components", COMPONENTS)
    for path in COMPONENTS.rglob("*.tsx"):
        text = transform_source(path.read_text())
        # StructuredData: replace usePathname with a prop
        if path.name == "StructuredData.tsx":
            text = text.replace(
                'interface StructuredDataProps {\n  rates: Rate[];\n  lastUpdated: string;\n}',
                'interface StructuredDataProps {\n  rates: Rate[];\n  lastUpdated: string;\n  pathname?: string;\n}',
            )
            text = text.replace(
                "export default function StructuredData({ rates, lastUpdated }: StructuredDataProps) {\n  const pathname = usePathname();",
                'export default function StructuredData({ rates, lastUpdated, pathname = "/" }: StructuredDataProps) {',
            )
        if path.name == "LenderLogo.tsx":
            text = text.replace(
                '        <img\n          src={logoPath}\n          alt={`${lenderName} logo`}\n          className="object-contain rounded-lg"\n          onError={() => setImageError(true)}\n        />',
                '        <img\n          src={logoPath}\n          alt={`${lenderName} logo`}\n          className="object-contain rounded-lg w-full h-full"\n          onError={() => setImageError(true)}\n        />',
            )
        if path.name == "Header.tsx":
            # Add ThemeToggle beside nav for dark/light (previously only in unused StickyNav)
            if "ThemeToggle" not in text:
                text = text.replace(
                    'import Navigation from "./Navigation";',
                    'import Navigation from "./Navigation";\nimport ThemeToggle from "./ThemeToggle";',
                )
                text = text.replace(
                    "          <Navigation currentPage={currentPage} />",
                    '          <div className="flex items-center gap-2">\n            <ThemeToggle />\n            <Navigation currentPage={currentPage} />\n          </div>',
                )
        path.write_text(text)


def copy_content() -> None:
    CONTENT.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(APP / "blog" / "data.ts", CONTENT / "blog.ts")
    shutil.copyfile(APP / "glossary" / "terms.ts", CONTENT / "glossary.ts")
    shutil.copyfile(APP / "data" / "lenderContent.json", CONTENT / "lenderContent.json")


def strip_page_helpers(text: str) -> str:
    text = transform_source(text)
    # Convert Next async params pages into slug-prop components
    text = re.sub(
        r"interface PageProps \{\n  params: Promise<\{ slug: string \}>;\n\}\n\n",
        "",
        text,
    )
    text = re.sub(
        r"export default async function (\w+)\(\{ params \}: PageProps\) \{\n  const \{ slug \} = await params;",
        r"export default function \1({ slug }: { slug: string }) {",
        text,
    )
    text = re.sub(
        r"export default async function (\w+)\(\{\n  params,\n\}: \{\n  params: Promise<\{ slug: string \}>;\n\}\) \{\n  const \{ slug \} = await params;",
        r"export default function \1({ slug }: { slug: string }) {",
        text,
    )
    return text


def astro_page(
    view_import: str,
    layout_import: str,
    meta: dict,
    client: str | None,
    extra_frontmatter: str = "",
    component_props: str = "",
    named_export: str | None = None,
) -> str:
    title = astro_escape(meta.get("title") or "Latest Mortgage Rates Canada")
    desc = astro_escape(meta.get("description") or "")
    canonical = meta.get("canonical")
    canon_line = f'  canonical="{astro_escape(canonical)}"\n' if canonical else ""
    client_attr = f" {client}" if client else ""
    comp = named_export or "Page"
    return f"""---
import BaseLayout from "{layout_import}";
import {comp} from "{view_import}";
{extra_frontmatter}---
<BaseLayout
  title="{title}"
  description="{desc}"
{canon_line}>
  <{comp}{component_props}{client_attr} />
</BaseLayout>
"""


def emit_static_view(src_page: Path, dest_view: Path) -> dict:
    original = src_page.read_text()
    meta = extract_metadata(original)
    write(dest_view, strip_page_helpers(original))
    return meta


def depth_to_layouts(page_path: Path) -> str:
    rel = page_path.relative_to(PAGES)
    depth = len(rel.parts) - 1
    return "../" * depth + "layouts/BaseLayout.astro"


def depth_to_views(page_path: Path, view_rel: str) -> str:
    rel = page_path.relative_to(PAGES)
    depth = len(rel.parts) - 1
    return "../" * depth + "views/" + view_rel


def main() -> None:
    if VIEWS.exists():
        shutil.rmtree(VIEWS)
    VIEWS.mkdir(parents=True)
    PAGES.mkdir(parents=True, exist_ok=True)

    copy_components()
    copy_content()

    # --- Home ---
    home_meta = emit_static_view(APP / "page.tsx", VIEWS / "HomePage.tsx")
    home_meta["canonical"] = f"{SITE}/"
    write(
        PAGES / "index.astro",
        astro_page(
            "../views/HomePage",
            "../layouts/BaseLayout.astro",
            home_meta,
            client="client:load",
        ),
    )

    # --- Simple static-ish pages ---
    simple = [
        ("blog/page.tsx", "blog/BlogIndex.tsx", "blog/index.astro", "client:load", f"{SITE}/blog/"),
        ("tools/page.tsx", "tools/ToolsIndex.tsx", "tools/index.astro", "client:load", f"{SITE}/tools/"),
        ("glossary/page.tsx", "glossary/GlossaryIndex.tsx", "glossary/index.astro", "client:load", f"{SITE}/glossary/"),
        ("experts/page.tsx", "experts/ExpertsPage.tsx", "experts/index.astro", "client:load", f"{SITE}/experts/"),
        ("mortgage-guide/page.tsx", "mortgage-guide/EbookPage.tsx", "mortgage-guide/index.astro", "client:load", f"{SITE}/mortgage-guide/"),
        ("privacy/page.tsx", "privacy/PrivacyPage.tsx", "privacy/index.astro", "client:load", f"{SITE}/privacy/"),
        ("terms/page.tsx", "terms/TermsPage.tsx", "terms/index.astro", "client:load", f"{SITE}/terms/"),
        ("unsubscribed/page.tsx", "unsubscribed/UnsubscribedPage.tsx", "unsubscribed/index.astro", None, f"{SITE}/unsubscribed/"),
        ("widget/page.tsx", "widget/WidgetPage.tsx", "widget/index.astro", "client:load", f"{SITE}/widget/"),
        ("rates/5-year-fixed/page.tsx", "rates/FiveYearFixedPage.tsx", "rates/5-year-fixed/index.astro", "client:load", f"{SITE}/rates/5-year-fixed/"),
        ("rates/variable/page.tsx", "rates/VariablePage.tsx", "rates/variable/index.astro", "client:load", f"{SITE}/rates/variable/"),
        ("rates/insured/page.tsx", "rates/InsuredPage.tsx", "rates/insured/index.astro", "client:load", f"{SITE}/rates/insured/"),
        ("rates/uninsured/page.tsx", "rates/UninsuredPage.tsx", "rates/uninsured/index.astro", "client:load", f"{SITE}/rates/uninsured/"),
    ]

    tool_pages = [
        "mortgage-calculator",
        "affordability-calculator",
        "closing-costs-calculator",
        "cmhc-insurance-calculator",
        "land-transfer-tax-calculator",
        "mortgage-penalty-calculator",
        "mortgage-renewal-calculator",
        "refinance-calculator",
        "rent-vs-buy-calculator",
        "stress-test-qualifier",
    ]
    for slug in tool_pages:
        pascal = "".join(p.title().replace("-", "") for p in slug.replace("-", " ").split())
        # simpler: MortgageCalculatorPage etc from filename
        simple.append(
            (
                f"tools/{slug}/page.tsx",
                f"tools/{slug}/Page.tsx",
                f"tools/{slug}/index.astro",
                "client:load",
                f"{SITE}/tools/{slug}/",
            )
        )

    for src_rel, view_rel, page_rel, client, canonical in simple:
        src = APP / src_rel
        if not src.exists():
            raise SystemExit(f"missing {src}")
        meta = emit_static_view(src, VIEWS / view_rel)
        meta["canonical"] = canonical
        page_path = PAGES / page_rel
        layout = depth_to_layouts(page_path)
        view_imp = depth_to_views(page_path, view_rel.replace(".tsx", ""))
        write(page_path, astro_page(view_imp, layout, meta, client))

    # Copy widget CopyButton next to widget view
    copy_btn = APP / "widget" / "CopyButton.tsx"
    if copy_btn.exists():
        write(VIEWS / "widget" / "CopyButton.tsx", transform_source(copy_btn.read_text()))
        # Fix import in WidgetPage
        wp = VIEWS / "widget" / "WidgetPage.tsx"
        text = wp.read_text().replace("from './CopyButton'", "from './CopyButton'")
        wp.write_text(text)

    # Dynamic views (Astro pages already live under src/pages)
    emit_static_view(APP / "lenders" / "[slug]" / "page.tsx", VIEWS / "lenders" / "LenderPage.tsx")
    emit_static_view(APP / "blog" / "[slug]" / "page.tsx", VIEWS / "blog" / "BlogPost.tsx")
    emit_static_view(APP / "glossary" / "[slug]" / "page.tsx", VIEWS / "glossary" / "GlossaryTerm.tsx")

    # Trends: page is a thin wrapper
    trends_client = APP / "trends" / "TrendsPageClient.tsx"
    write(VIEWS / "trends" / "TrendsPageClient.tsx", transform_source(trends_client.read_text()))
    trends_meta = extract_metadata((APP / "trends" / "page.tsx").read_text())
    trends_meta["canonical"] = f"{SITE}/trends/"
    write(
        PAGES / "trends" / "index.astro",
        astro_page(
            "../../views/trends/TrendsPageClient",
            "../../layouts/BaseLayout.astro",
            trends_meta,
            "client:load",
            named_export="TrendsPageClient",
        ),
    )

    # Cities
    for city_page in sorted((APP / "cities").glob("*/page.tsx")):
        slug = city_page.parent.name
        meta = emit_static_view(city_page, VIEWS / "cities" / f"{slug}.tsx")
        meta["canonical"] = f"{SITE}/cities/{slug}/"
        write(
            PAGES / "cities" / slug / "index.astro",
            astro_page(
                f"../../../views/cities/{slug}",
                "../../../layouts/BaseLayout.astro",
                meta,
                "client:load",
            ),
        )

    print("Converted components, views, and static Astro wrappers.")
    print(f"  components: {len(list(COMPONENTS.rglob('*.tsx')))}")
    print(f"  views:      {len(list(VIEWS.rglob('*.tsx')))}")
    print(f"  pages:      {len(list(PAGES.rglob('*.astro')))}")


if __name__ == "__main__":
    main()
