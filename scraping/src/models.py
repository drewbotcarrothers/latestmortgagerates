"""
Data models for mortgage rate scraping pipeline.
Uses Pydantic for validation and type safety.
"""

from datetime import datetime
from decimal import Decimal
from typing import Optional
from enum import Enum
from pydantic import BaseModel, Field
import uuid


class LenderType(str, Enum):
    BANK = "bank"
    CREDIT_UNION = "credit_union"
    MONOLINE = "monoline"
    BROKER = "broker"
    DIGITAL = "digital"


class RateType(str, Enum):
    FIXED = "fixed"
    VARIABLE = "variable"


class MortgageType(str, Enum):
    INSURED = "insured"      # < 20% down payment
    INSURABLE = "insurable"  # >= 20% down, qualified for insurance
    UNINSURED = "uninsured"  # >= 20% down, conventional


class Lender(BaseModel):
    """Represents a mortgage lender."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str = Field(..., pattern=r"^[a-z0-9_-]+$")
    type: LenderType
    logo_url: Optional[str] = None
    website_url: str
    description: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)


class RawRate(BaseModel):
    """Raw scraped rate data before normalization."""
    lender_slug: str
    lender_name: Optional[str] = None
    term_months: int
    rate_type: RateType
    mortgage_type: Optional[MortgageType] = None
    rate: Decimal = Field(..., decimal_places=3)
    posted_rate: Optional[Decimal] = Field(None, decimal_places=3)
    prepayment_privilege: Optional[str] = None
    is_qualified: Optional[bool] = None
    source_url: str
    scraped_at: datetime = Field(default_factory=datetime.utcnow)
    raw_data: Optional[dict] = None  # Store original scraped data for debugging


class RateProduct(BaseModel):
    """Normalized and validated rate product."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lender_id: str
    term_months: int = Field(..., ge=1, le=120)
    rate_type: RateType
    mortgage_type: MortgageType
    rate: Decimal = Field(..., decimal_places=3)
    posted_rate: Optional[Decimal] = Field(None, decimal_places=3)
    effective_date: datetime
    prepayment_privilege: Optional[str] = None
    portability: Optional[bool] = None
    penalties_info: Optional[str] = None
    min_down_payment: Optional[Decimal] = Field(None, decimal_places=2)
    source_url: str
    scraped_at: datetime
    is_current: bool = True


class RateHistory(BaseModel):
    """Historical rate data for trend analysis."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lender_id: str
    term_months: int
    rate_type: RateType
    rate: Decimal = Field(..., decimal_places=3)
    recorded_at: datetime


class ScrapingResult(BaseModel):
    """Result of a scraping operation."""
    lender_slug: str
    success: bool
    rates_found: int = 0
    error_message: Optional[str] = None
    scraped_at: datetime = Field(default_factory=datetime.utcnow)
    duration_seconds: Optional[float] = None


class ValidationResult(BaseModel):
    """Result of rate validation against benchmarks."""
    rate_id: str
    is_valid: bool
    checks_passed: int = 0
    checks_failed: int = 0
    warnings: list[str] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)
    benchmark_rate: Optional[Decimal] = None
    deviation_from_benchmark: Optional[Decimal] = None
    validated_at: datetime = Field(default_factory=datetime.utcnow)


class SyncResult(BaseModel):
    """Result of syncing rates to Hostinger."""
    rates_total: int
    rates_inserted: int
    rates_updated: int
    rates_unchanged: int
    sync_timestamp: datetime = Field(default_factory=datetime.utcnow)
    error_message: Optional[str] = None
