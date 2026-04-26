"""
Updated deduplicator with stricter RBC-specific rules and source attribution.
"""

from typing import List, Dict, Tuple, Optional
from decimal import Decimal
from datetime import datetime
from loguru import logger

from models import RawRate, RateType, MortgageType


class RateDeduplicator:
    """
    Deduplicates and validates scraped rates.
    
    Rules:
    1. Remove exact duplicates (same lender/term/type/rate)
    2. Keep only best rate per (lender, term, type, mortgage_type)
    3. Filter unrealistic rates (< 2% or > 10%)
    4. Flag suspicious data (multiple rates same term with big spread)
    5. Prefer scraper-direct over aggregator-sourced
    6. Require minimum metadata (must have source_url)
    """
    
    MIN_RATE = Decimal("2.0")
    MAX_RATE = Decimal("10.0")
    MAX_SPREAD_SAME_TERM = Decimal("2.0")
    
    # Source priority: direct scrapers preferred over aggregators
    SOURCE_PRIORITY = {
        "rbc_live_scrape": 1,
        "td_live_scrape": 1,
        "bmo_live_scrape": 1,
        "scotiabank_live_scrape": 1,
        "cibc_live_scrape": 1,
        "nationalbank_live_scrape": 1,
        "nesto_live_scrape": 1,
        "tangerine_live_scrape": 1,
        "simplii_live_scrape": 1,
        "eqbank_live_scrape": 1,
        "meridian_live_scrape": 1,
        "desjardins_live_scrape": 1,
        "firstnational_live_scrape": 1,
        "mcap_live_scrape": 1,
        "laurentian_live_scrape": 1,
        "manulife_live_scrape": 1,
        "motive_live_scrape": 1,
        "alterna_live_scrape": 1,
        "rfa_live_scrape": 1,
        "vancity_live_scrape": 1,
        "atb_live_scrape": 1,
        "cwb_live_scrape": 1,
        "coastcapital_live_scrape": 1,
        "cmls_live_scrape": 1,
        "merix_live_scrape": 1,
        "lendwise_live_scrape": 1,
        "butler_live_scrape": 1,
        "intellimortgage_live_scrape": 1,
        "streetcapital_live_scrape": 1,
        "centum_live_scrape": 1,
        "truenorth_live_scrape": 1,
        "equitable_live_scrape": 1,
        "hometrust_live_scrape": 1,
        "wealthsimple_live_scrape": 1,
    }
    
    AGGREGATOR_SOURCES = {
        "ratehub": 10,
        "ratesca": 10,
        "lowestrates": 10,
        "wowa": 10,
    }
    
    def _get_source_priority(self, rate: RawRate) -> int:
        """Get priority score for a rate source. Lower = better."""
        raw = rate.raw_data or {}
        source = raw.get("source", "")
        
        # Check for live scrape sources
        for key, priority in self.SOURCE_PRIORITY.items():
            if key in source:
                return priority
        
        # Check for aggregator sources
        for key, priority in self.AGGREGATOR_SOURCES.items():
            if key in source:
                return priority
        
        # Fallback sources (higher number = lower priority)
        if "fallback" in source:
            return 5
        
        return 99  # Unknown source
    
    def deduplicate(self, raw_rates: List[RawRate]) -> Tuple[List[RawRate], Dict]:
        """
        Deduplicate and validate rates.
        
        Returns:
            (clean_rates, stats)
        """
        stats = {
            "input_count": len(raw_rates),
            "removed_duplicates": 0,
            "removed_unrealistic": 0,
            "removed_no_metadata": 0,
            "removed_inferior": 0,
            "flagged_suspicious": 0,
            "output_count": 0,
            "by_lender": {},
            "sources_used": {}
        }
        
        # Step 1: Remove rates with no source or missing critical fields
        valid_meta = []
        for rate in raw_rates:
            if not rate.source_url or not rate.lender_slug:
                stats["removed_no_metadata"] += 1
                continue
            if rate.term_months <= 0 or rate.term_months > 120:
                stats["removed_no_metadata"] += 1
                continue
            valid_meta.append(rate)
        
        # Step 2: Remove exact duplicates
        seen = {}
        deduped = []
        for rate in valid_meta:
            key = (rate.lender_slug, rate.term_months, rate.rate_type.value, 
                   rate.mortgage_type.value if rate.mortgage_type else "uninsured",
                   str(rate.rate))
            if key not in seen:
                seen[key] = rate
                deduped.append(rate)
            else:
                stats["removed_duplicates"] += 1
        
        logger.info(f"Removed {stats['removed_duplicates']} exact duplicates")
        
        # Step 3: Filter unrealistic rates
        realistic = []
        for rate in deduped:
            if rate.rate < self.MIN_RATE:
                stats["removed_unrealistic"] += 1
                logger.warning(
                    f"Unrealistic rate removed: {rate.lender_name} "
                    f"{rate.term_months}mo {rate.rate_type.value} = {rate.rate}% "
                    f"(below {self.MIN_RATE}%)"
                )
                continue
            if rate.rate > self.MAX_RATE:
                stats["removed_unrealistic"] += 1
                logger.warning(
                    f"Unrealistic rate removed: {rate.lender_name} "
                    f"{rate.term_months}mo {rate.rate_type.value} = {rate.rate}% "
                    f"(above {self.MAX_RATE}%)"
                )
                continue
            realistic.append(rate)
        
        # Step 4: Group by (lender, term, type, mortgage_type) and keep best
        grouped: Dict = {}
        for rate in realistic:
            key = (rate.lender_slug, rate.term_months, rate.rate_type.value,
                   rate.mortgage_type.value if rate.mortgage_type else "uninsured")
            if key not in grouped:
                grouped[key] = []
            grouped[key].append(rate)
        
        clean_rates = []
        for key, rates in grouped.items():
            if len(rates) > 1:
                # Multiple rates for same product
                # Sort by: source priority (lower = better), then rate (lower = better)
                rates_sorted = sorted(rates, key=lambda r: (self._get_source_priority(r), r.rate))
                
                # Check if best direct source is available
                best = rates_sorted[0]
                best_priority = self._get_source_priority(best)
                
                # If best is from aggregator and there's a close direct source, prefer direct
                if best_priority >= 10:  # Aggregator source
                    direct_rates = [r for r in rates_sorted if self._get_source_priority(r) < 10]
                    if direct_rates:
                        # Use direct source if within 0.5% of aggregator
                        direct_best = direct_rates[0]
                        if direct_best.rate <= best.rate + Decimal("0.50"):
                            best = direct_best
                            logger.info(
                                f"Preferring direct source for {key[0]} {key[1]}mo: "
                                f"{direct_best.rate}% (direct) vs {rates_sorted[0].rate}% (aggregator)"
                            )
                
                stats["removed_inferior"] += len(rates) - 1
                
                # Check spread between all rates for this product
                all_rates_sorted = sorted(rates, key=lambda r: r.rate)
                spread = all_rates_sorted[-1].rate - all_rates_sorted[0].rate
                if spread > self.MAX_SPREAD_SAME_TERM:
                    stats["flagged_suspicious"] += 1
                    logger.warning(
                        f"Suspicious spread for {key[0]} {key[1]}mo: "
                        f"{all_rates_sorted[0].rate}% to {all_rates_sorted[-1].rate}% "
                        f"(spread: {spread:.2f}%)"
                    )
                
                clean_rates.append(best)
            else:
                clean_rates.append(rates[0])
        
        # Update stats
        stats["output_count"] = len(clean_rates)
        
        # Per-lender stats and source tracking
        for rate in clean_rates:
            slug = rate.lender_slug
            if slug not in stats["by_lender"]:
                stats["by_lender"][slug] = 0
            stats["by_lender"][slug] += 1
            
            source = rate.raw_data.get("source", "unknown") if rate.raw_data else "unknown"
            stats["sources_used"][source] = stats["sources_used"].get(source, 0) + 1
        
        logger.info(
            f"Deduplication complete: {stats['input_count']} in → "
            f"{stats['output_count']} out "
            f"(removed: {stats['removed_duplicates']} dupes, "
            f"{stats['removed_unrealistic']} unrealistic, "
            f"{stats['removed_no_metadata']} no-meta, "
            f"{stats['removed_inferior']} inferior, "
            f"{stats['flagged_suspicious']} suspicious)"
        )
        
        return clean_rates, stats
    
    def get_lender_summary(self, rates: List[RawRate]) -> Dict[str, Dict]:
        """Get summary of rates per lender for display."""
        summary = {}
        for rate in rates:
            slug = rate.lender_slug
            if slug not in summary:
                summary[slug] = {
                    "name": rate.lender_name,
                    "slug": slug,
                    "rates": []
                }
            summary[slug]["rates"].append({
                "term_months": rate.term_months,
                "rate_type": rate.rate_type.value,
                "mortgage_type": rate.mortgage_type.value if rate.mortgage_type else "uninsured",
                "rate": str(rate.rate),
                "posted_rate": str(rate.posted_rate) if rate.posted_rate else None,
                "source": rate.source_url
            })
        
        # Sort rates by term within each lender
        for slug in summary:
            summary[slug]["rates"].sort(
                key=lambda r: (r["term_months"], r["rate_type"], r["mortgage_type"])
            )
        
        return summary
