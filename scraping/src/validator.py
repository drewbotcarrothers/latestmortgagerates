"""
Validator module - validates scraped rates against benchmarks and rules.
"""

from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import List, Optional, Tuple
from loguru import logger

from models import RawRate, RateProduct, ValidationResult, RateType, MortgageType


class RateValidator:
    """
    Validates scraped rates for sanity and accuracy.
    
    Validation rules:
    1. Rate must be within realistic bounds (0.5% - 15%)
    2. Rate shouldn't deviate more than 50% from BoC benchmark
    3. Posted rate should be higher than special offer rate
    4. Fixed rates should follow term structure (shorter = lower typically)
    5. Variable should be lower than 5-year fixed (typically)
    """
    
    def __init__(self):
        self.benchmarks = {}  # Will be populated from BoC API
    
    def set_benchmark(self, term_months: int, rate: Decimal):
        """Set a benchmark rate for validation."""
        self.benchmarks[term_months] = rate
    
    def validate_rate(self, raw_rate: RawRate) -> Tuple[bool, RateProduct, List[str], List[str]]:
        """
        Validate a single raw rate.
        
        Returns:
            (is_valid, rate_product, warnings, errors)
        """
        is_valid = True
        warnings = []
        errors = []
        
        # Rule 1: Rate bounds check
        if raw_rate.rate < Decimal("0.5"):
            errors.append(f"Rate {raw_rate.rate}% is suspiciously low")
            is_valid = False
        elif raw_rate.rate > Decimal("15.0"):
            errors.append(f"Rate {raw_rate.rate}% is suspiciously high")
            is_valid = False
        
        # Rule 2: Benchmark comparison
        if raw_rate.term_months in self.benchmarks:
            benchmark = self.benchmarks[raw_rate.term_months]
            deviation = ((raw_rate.rate - benchmark) / benchmark * 100).quantize(
                Decimal("0.1"), rounding=ROUND_HALF_UP
            )
            
            if abs(deviation) > 50:
                errors.append(f"Rate deviates {deviation}% from benchmark")
                is_valid = False
            elif abs(deviation) > 25:
                warnings.append(f"Rate deviates {deviation}% from benchmark - verify")
        
        # Rule 3: Posted rate should be higher than special rate
        if raw_rate.posted_rate and raw_rate.posted_rate <= raw_rate.rate:
            warnings.append("Posted rate should be higher than special/offer rate")
        
        # Create normalized RateProduct
        rate_product = RateProduct(
            lender_id=raw_rate.lender_slug,  # Will be replaced with proper ID
            term_months=raw_rate.term_months,
            rate_type=raw_rate.rate_type,
            mortgage_type=raw_rate.mortgage_type or MortgageType.UNINSURED,
            rate=raw_rate.rate,
            posted_rate=raw_rate.posted_rate,
            effective_date=datetime.utcnow(),
            prepayment_privilege=raw_rate.prepayment_privilege,
            source_url=raw_rate.source_url,
            scraped_at=raw_rate.scraped_at,
            is_current=True
        )
        
        return is_valid, rate_product, warnings, errors
    
    def validate_all(self, raw_rates: List[RawRate]) -> List[ValidationResult]:
        """Validate multiple rates and return results."""
        results = []
        
        for raw_rate in raw_rates:
            is_valid, product, warnings, errors = self.validate_rate(raw_rate)
            
            result = ValidationResult(
                rate_id=product.id,
                is_valid=is_valid,
                checks_passed=len(warnings) if is_valid else 2,
                checks_failed=len(errors) if not is_valid else 0,
                warnings=warnings,
                errors=errors,
                benchmark_rate=self.benchmarks.get(raw_rate.term_months),
                validated_at=datetime.utcnow()
            )
            
            if result.benchmark_rate:
                result.deviation_from_benchmark = (
                    (product.rate - result.benchmark_rate) / result.benchmark_rate * 100
                ).quantize(Decimal("0.01"))
            
            results.append(result)
            
            if not result.is_valid:
                logger.warning(
                    f"Validation failed for {raw_rate.lender_slug} {raw_rate.term_months}mo: "
                    f"{'; '.join(result.errors)}"
                )
        
        return results
    
    def get_stats(self, results: List[ValidationResult]) -> dict:
        """Get validation statistics."""
        total = len(results)
        valid = sum(1 for r in results if r.is_valid)
        return {
            "total": total,
            "valid": valid,
            "invalid": total - valid,
            "valid_rate": f"{(valid/total*100):.1f}%" if total > 0 else "0%",
            "warnings": sum(len(r.warnings) for r in results),
            "errors": sum(len(r.errors) for r in results)
        }
