#!/usr/bin/env python3
"""
Generate sitemap.xml for Latest Mortgage Rates Canada
Includes: main pages, calculator tools, blog posts, glossary terms
"""

import json
from datetime import datetime
from pathlib import Path
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom

BASE_URL = "https://latestmortgagerates.ca"

CALCULATOR_TOOLS = [
    "/tools/mortgage-calculator",
    "/tools/affordability-calculator",
    "/tools/land-transfer-tax-calculator",
    "/tools/cmhc-insurance-calculator",
    "/tools/mortgage-renewal-calculator",
    "/tools/rent-vs-buy-calculator",
    "/tools/refinance-calculator",
    "/tools/closing-costs-calculator",
    "/tools/mortgage-penalty-calculator",
    "/tools/stress-test-qualifier",
]

STATIC_PAGES = [
    ("/", "1.00", "daily"),
    ("/trends", "0.80", "daily"),
    ("/experts", "0.70", "weekly"),
    ("/blog", "0.70", "daily"),
    ("/glossary", "0.60", "weekly"),
    ("/tools", "0.80", "weekly"),
]


def load_blog_posts():
    """Load blog post pages."""
    try:
        blog_dir = Path(__file__).parent.parent / "app" / "blog"
        blog_page = blog_dir / "page.tsx"
        
        # Extract slugs from data.ts or page.tsx
        data_file = blog_dir / "data.ts"
        if data_file.exists():
            content = data_file.read_text()
            # Simple extraction - in production this would parse properly
            import re
            slugs = re.findall(r'slug:\s*"([^"]+)"', content)
            return slugs[:50]  # Limit to 50 posts
    except Exception as e:
        print(f"Warning: Could not load blog posts: {e}")
    
    # Fallback known blog posts
    return [
        "bank-of-canada-rate-hold-january-2025",
        "spring-housing-market-2025",
        "variable-vs-fixed-2025",
        "first-time-buyer-guide-2025",
        "renewal-strategy-2025",
    ]


def load_glossary_terms():
    """Load glossary term pages."""
    try:
        glossary_page = Path(__file__).parent.parent / "app" / "glossary" / "page.tsx"
        if glossary_page.exists():
            content = glossary_page.read_text()
            import re
            # Extract slugs from the glossaryTerms array
            slugs = re.findall(r'slug:\s*"([^"]+)"', content)
            return slugs
    except Exception as e:
        print(f"Warning: Could not load glossary terms: {e}")
    
    # Fallback terms
    return [
        "amortization-period",
        "apr",
        "cmhc-insurance",
        "closing-costs",
        "fixed-rate",
        "variable-rate",
        "gds-ratio",
        "tds-ratio",
        "ltv-ratio",
        "prepayment-privilege",
        "prime-rate",
        "mortgage-term",
        "portability",
        "refinancing",
        "renewal",
        "stress-test",
    ]


def get_lastmod_from_git(file_path):
    """Try to get last modified date from git, fallback to now."""
    try:
        import subprocess
        result = subprocess.run(
            ["git", "log", "-1", "--format=%cI", str(file_path)],
            capture_output=True,
            text=True,
            cwd=Path(__file__).parent.parent,
        )
        if result.returncode == 0 and result.stdout.strip():
            date = result.stdout.strip()[:10]  # YYYY-MM-DD
            return date
    except Exception:
        pass
    return datetime.now().strftime("%Y-%m-%d")


def generate_sitemap():
    """Generate the sitemap.xml file."""
    
    urlset = Element("urlset")
    urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    urlset.set("xmlns:xhtml", "http://www.w3.org/1999/xhtml")
    urlset.set("xmlns:image", "http://www.google.com/schemas/sitemap-image/1.1")
    urlset.set("xmlns:news", "http://www.google.com/schemas/sitemap-news/0.9")
    
    urls_added = 0
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Add static pages
    for path, priority, changefreq in STATIC_PAGES:
        url = SubElement(urlset, "url")
        loc = SubElement(url, "loc")
        loc.text = f"{BASE_URL}{path}"
        
        lastmod = SubElement(url, "lastmod")
        lastmod.text = today
        
        changefreq_elem = SubElement(url, "changefreq")
        changefreq_elem.text = changefreq
        
        priority_elem = SubElement(url, "priority")
        priority_elem.text = priority
        
        urls_added += 1
    
    # Add calculator tools
    for tool_path in CALCULATOR_TOOLS:
        url = SubElement(urlset, "url")
        loc = SubElement(url, "loc")
        loc.text = f"{BASE_URL}{tool_path}"
        
        lastmod = SubElement(url, "lastmod")
        lastmod.text = today
        
        changefreq_elem = SubElement(url, "changefreq")
        changefreq_elem.text = "weekly"
        
        priority_elem = SubElement(url, "priority")
        priority_elem.text = "0.70"
        
        urls_added += 1
    
    # Add blog posts
    for slug in load_blog_posts():
        url = SubElement(urlset, "url")
        loc = SubElement(url, "loc")
        loc.text = f"{BASE_URL}/blog/{slug}"
        
        lastmod = SubElement(url, "lastmod")
        lastmod.text = today
        
        changefreq_elem = SubElement(url, "changefreq")
        changefreq_elem.text = "monthly"
        
        priority_elem = SubElement(url, "priority")
        priority_elem.text = "0.60"
        
        urls_added += 1
    
    # Add glossary terms
    for slug in load_glossary_terms():
        url = SubElement(urlset, "url")
        loc = SubElement(url, "loc")
        loc.text = f"{BASE_URL}/glossary#{slug}"
        
        lastmod = SubElement(url, "lastmod")
        lastmod.text = today
        
        changefreq_elem = SubElement(url, "changefreq")
        changefreq_elem.text = "monthly"
        
        priority_elem = SubElement(url, "priority")
        priority_elem.text = "0.50"
        
        urls_added += 1
    
    # Pretty print XML
    xml_str = tostring(urlset, encoding="unicode")
    dom = minidom.parseString(xml_str)
    pretty_xml = dom.toprettyxml(indent="  ", encoding="utf-8")
    
    # Write to file
    output_path = Path(__file__).parent.parent / "public" / "sitemap.xml"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(pretty_xml)
    
    print(f"Generated sitemap with {urls_added} URLs")
    print(f"Saved to: {output_path}")
    return output_path


def generate_robots_txt():
    """Generate updated robots.txt."""
    content = """User-agent: *
Allow: /

# Sitemap location
Sitemap: https://latestmortgagerates.ca/sitemap.xml

# Disallow admin/staging areas (none currently)

# Crawl rate - allow search engines to crawl freely
Crawl-delay: 1
"""
    
    output_path = Path(__file__).parent.parent / "public" / "robots.txt"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(content)
    
    print(f"Generated robots.txt at: {output_path}")
    return output_path


if __name__ == "__main__":
    generate_sitemap()
    generate_robots_txt()
    print("SEO files generated successfully!")
