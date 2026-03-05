"""
Test the data pipeline with simulated RBC rates.
This demonstrates the pipeline structure without requiring OpenClaw setup.
"""

from decimal import Decimal
from datetime import datetime
from pathlib import Path
import sys

# Add src to path
sys.path.append(str(Path(__file__).parent / "src"))

from database import db
from validator import RateValidator
from models import RawRate, RateType, MortgageType

print("="*70)
print("MORTGAGE RATE PIPELINE - TEST DEMO")
print("="*70)

# Simulate RBC rates (as if scraped)
test_rates = [
    RawRate(
        lender_slug="rbc",
        lender_name="Royal Bank of Canada",
        term_months=12,
        rate_type=RateType.FIXED,
        mortgage_type=MortgageType.UNINSURED,
        rate=Decimal("5.34"),
        posted_rate=Decimal("7.24"),
        source_url="https://www.rbcroyalbank.com/mortgages/mortgage-rates.html",
        scraped_at=datetime.utcnow(),
        raw_data={"test": True, "method": "simulated"}
    ),
    RawRate(
        lender_slug="rbc",
        lender_name="Royal Bank of Canada",
        term_months=24,
        rate_type=RateType.FIXED,
        mortgage_type=MortgageType.UNINSURED,
        rate=Decimal("5.09"),
        posted_rate=Decimal("6.99"),
        source_url="https://www.rbcroyalbank.com/mortgages/mortgage-rates.html",
        scraped_at=datetime.utcnow(),
        raw_data={"test": True, "method": "simulated"}
    ),
    RawRate(
        lender_slug="rbc",
        lender_name="Royal Bank of Canada", 
        term_months=36,
        rate_type=RateType.FIXED,
        mortgage_type=MortgageType.UNINSURED,
        rate=Decimal("4.84"),
        posted_rate=Decimal("6.49"),
        source_url="https://www.rbcroyalbank.com/mortgages/mortgage-rates.html",
        scraped_at=datetime.utcnow(),
        raw_data={"test": True, "method": "simulated"}
    ),
    RawRate(
        lender_slug="rbc",
        lender_name="Royal Bank of Canada",
        term_months=60,
        rate_type=RateType.FIXED,
        mortgage_type=MortgageType.UNINSURED,
        rate=Decimal("4.59"),
        posted_rate=Decimal("6.14"),
        source_url="https://www.rbcroyalbank.com/mortgages/mortgage-rates.html",
        scraped_at=datetime.utcnow(),
        raw_data={"test": True, "method": "simulated"}
    ),
    RawRate(
        lender_slug="rbc",
        lender_name="Royal Bank of Canada",
        term_months=60,
        rate_type=RateType.VARIABLE,
        mortgage_type=MortgageType.UNINSURED,
        rate=Decimal("5.55"),
        posted_rate=Decimal("7.20"),
        source_url="https://www.rbcroyalbank.com/mortgages/mortgage-rates.html", 
        scraped_at=datetime.utcnow(),
        raw_data={"test": True, "method": "simulated"}
    ),
]

print(f"\nGenerated {len(test_rates)} simulated rates")

# Save to database
print("\nSaving to local SQLite database...")
db.save_raw_rates(test_rates)
print("Saved!")

# Validate rates
print("\nValidating rates...")
validator = RateValidator()
# Set some benchmarks (BoC typical ranges)
validator.set_benchmark(60, Decimal("5.0"))
validator.set_benchmark(36, Decimal("4.8"))

results = validator.validate_all(test_rates)
stats = validator.get_stats(results)

print(f"\nValidation Results:")
for key, val in stats.items():
    print(f"  {key}: {val}")

# Show rates
print("\nSaved Rates:")
for rate in test_rates:
    posted = f" (posted: {rate.posted_rate}%)" if rate.posted_rate else ""
    print(f"  {rate.lender_slug.upper()} - {rate.term_months}mo {rate.rate_type.value}: {rate.rate}%{posted}")

# Check database stats
print("\n" + "-"*70)
print("Database Statistics:")
db_stats = db.get_scraping_stats()
for key, val in db_stats.items():
    print(f"  {key}: {val}")

# Retrieve from database
print("\nRetrieving from database (latest RBC rates):")
retrieved = db.get_latest_rates("rbc")
for rate in retrieved[:3]:
    print(f"  {rate['term_months']}mo {rate['rate_type']}: {rate['rate']}% (scraped: {rate['scraped_at'][:19]})")

print("\n" + "="*70)
print("PIPELINE DEMO COMPLETE")
print("="*70)
print("\nNext steps:")
print("1. Install OpenClaw: npm install -g openclaw")
print("2. Run real scraper: python src/pipeline.py")
print("3. Add more lenders to src/scrapers/")
print("4. Set up Windows Task Scheduler for automation")
