"""
Rate freshness monitoring system for mortgage scrapers.
Alerts when scraper data may be stale and needs manual verification.
"""

import json
import sys
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
from dataclasses import dataclass

sys.path.insert(0, str(Path(__file__).parent / "scraping" / "src"))
from loguru import logger


@dataclass
class ScraperStatus:
    lender: str
    name: str
    last_verified: str
    rates_count: int
    has_playwright: bool
    status: str  # "current", "stale", "needs_verification"
    priority: int  # 1 = Big 6, 2 = Major monoline, 3 = Regional


class RateMonitor:
    """Monitor scraper freshness and alert on stale data."""
    
    # Priority levels
    BIG_6 = ["rbc", "td", "bmo", "scotiabank", "cibc", "nationalbank"]
    MAJOR_MONOLINE = ["firstnational", "mcap", "manulife", "laurentian", "rfa", 
                      "cmls", "merix", "lendwise", "butlermortgage", "intellimortgage",
                      "streetcapital", "centum", "truenorth"]
    REGIONAL = ["meridian", "desjardins", "vancity", "coastcapital", "alterna", 
                "atb", "cwb", "equitable", "hometrust"]
    DIGITAL = ["nesto", "eqbank", "simplii", "tangerine", "motive", "wealthsimple"]
    
    def __init__(self, rates_file: str = "data/rates.json", metadata_file: str = "data/metadata.json"):
        self.rates_file = Path(rates_file)
        self.metadata_file = Path(metadata_file)
        self.results: List[ScraperStatus] = []
    
    def check_all(self) -> List[ScraperStatus]:
        """Check freshness of all scrapers."""
        logger.info("Checking scraper freshness...")
        
        # Load metadata
        try:
            with open(self.metadata_file) as f:
                metadata = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            metadata = {}
        
        # Load rates
        try:
            with open(self.rates_file) as f:
                rates = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            rates = []
        
        # Check each lender
        all_lenders = self.BIG_6 + self.MAJOR_MONOLINE + self.REGIONAL + self.DIGITAL
        
        for lender in all_lenders:
            status = self._check_lender(lender, rates, metadata)
            self.results.append(status)
        
        return self.results
    
    def _check_lender(self, slug: str, rates: List[Dict], metadata: Dict) -> ScraperStatus:
        """Check freshness of a single lender."""
        
        # Determine priority
        if slug in self.BIG_6:
            priority = 1
            name = slug.upper()
        elif slug in self.MAJOR_MONOLINE:
            priority = 2
            name = slug.title()
        elif slug in self.REGIONAL:
            priority = 3
            name = slug.title()
        else:
            priority = 2
            name = slug.title()
        
        # Count rates
        lender_rates = [r for r in rates if r.get("lender_slug") == slug]
        rates_count = len(lender_rates)
        
        # Check last verified date from raw_data
        last_verified = None
        for rate in lender_rates:
            raw = rate.get("raw_data", {})
            if "last_verified" in raw:
                last_verified = raw["last_verified"]
                break
            elif "source" in raw and "2026" in str(raw.get("source", "")):
                # Extract date from source string
                source = raw["source"]
                if "2026-" in source:
                    import re
                    date_match = re.search(r'2026-\d{2}-\d{2}', source)
                    if date_match:
                        last_verified = date_match.group()
        
        # Determine status
        if not last_verified:
            status = "needs_verification"
        else:
            try:
                verified_date = datetime.strptime(last_verified, "%Y-%m-%d")
                days_old = (datetime.now() - verified_date).days
                
                if days_old < 7:
                    status = "current"
                elif days_old < 14:
                    status = "stale"
                else:
                    status = "needs_verification"
            except ValueError:
                status = "needs_verification"
        
        # Check if Playwright is implemented
        scraper_file = Path(f"scraping/src/scrapers/{slug}_scraper.py")
        has_playwright = False
        if scraper_file.exists():
            content = scraper_file.read_text()
            has_playwright = "playwright" in content.lower()
        
        return ScraperStatus(
            lender=slug,
            name=name,
            last_verified=last_verified or "unknown",
            rates_count=rates_count,
            has_playwright=has_playwright,
            status=status,
            priority=priority
        )
    
    def print_report(self):
        """Print a formatted report."""
        print("\n" + "=" * 80)
        print("MORTGAGE RATE SCRAPER FRESHNESS REPORT")
        print("=" * 80)
        
        # Group by priority
        for priority, label in [(1, "BIG 6 BANKS"), (2, "MAJOR MONOLINE LENDERS"), (3, "REGIONAL/CREDIT UNIONS")]:
            group = [r for r in self.results if r.priority == priority]
            if not group:
                continue
            
            print(f"\n{label}:")
            print("-" * 80)
            
            for status in sorted(group, key=lambda x: x.lender):
                icon = {
                    "current": "✅",
                    "stale": "⚠️",
                    "needs_verification": "❌"
                }.get(status.status, "❓")
                
                pw_icon = "🎭" if status.has_playwright else "📄"
                
                print(f"  {icon} {pw_icon} {status.lender:20} | {status.rates_count:3} rates | "
                      f"Last: {status.last_verified:12} | {status.status.upper()}")
        
        # Summary
        total = len(self.results)
        current = sum(1 for r in self.results if r.status == "current")
        stale = sum(1 for r in self.results if r.status == "stale")
        needs_verification = sum(1 for r in self.results if r.status == "needs_verification")
        with_playwright = sum(1 for r in self.results if r.has_playwright)
        
        print("\n" + "=" * 80)
        print("SUMMARY")
        print("=" * 80)
        print(f"  Total scrapers: {total}")
        print(f"  Current (≤7 days): {current}")
        print(f"  Stale (8-14 days): {stale}")
        print(f"  Needs verification (>14 days): {needs_verification}")
        print(f"  With Playwright: {with_playwright}/{total}")
        print()
        
        # Priority actions
        print("PRIORITY ACTIONS:")
        print("-" * 80)
        
        big6_needs_work = [r for r in self.results if r.priority == 1 and r.status != "current"]
        if big6_needs_work:
            print(f"  HIGH: Update {len(big6_needs_work)} Big 6 bank scrapers:")
            for r in big6_needs_work:
                print(f"    - {r.lender}: {r.status} (last: {r.last_verified})")
        
        no_playwright = [r for r in self.results if r.priority <= 2 and not r.has_playwright]
        if no_playwright:
            print(f"\n  MEDIUM: Add Playwright to {len(no_playwright)} major lenders:")
            for r in no_playwright[:5]:
                print(f"    - {r.lender}")
        
        print()
    
    def generate_update_script(self):
        """Generate a script to update stale scrapers."""
        stale = [r for r in self.results if r.status in ("stale", "needs_verification")]
        
        script_lines = ["#!/usr/bin/env python3", '"""Auto-generated scraper update script."""', ""]
        
        for status in sorted(stale, key=lambda x: x.priority):
            script_lines.append(f"# TODO: Update {status.lender} ({status.name})")
            script_lines.append(f"# Status: {status.status}, Last verified: {status.last_verified}")
            script_lines.append(f"# Priority: {status.priority}")
            script_lines.append("")
        
        return "\n".join(script_lines)


def main():
    monitor = RateMonitor()
    monitor.check_all()
    monitor.print_report()
    
    # Save report
    report_file = Path("scraper_freshness_report.txt")
    import io
    from contextlib import redirect_stdout
    
    f = io.StringIO()
    with redirect_stdout(f):
        monitor.print_report()
    
    report_file.write_text(f.getvalue())
    print(f"\nReport saved to {report_file}")


if __name__ == "__main__":
    main()