"""
Local SQLite database for staging scraped rates before syncing to Hostinger.
This acts as the buffer between scraping and production.
"""

import sqlite3
import json
from datetime import datetime
from decimal import Decimal
from pathlib import Path
from typing import List, Optional
from contextlib import contextmanager

from loguru import logger
from models import RawRate, RateProduct, Lender, ScrapingResult

DB_PATH = Path(__file__).parent.parent / "data" / "staging.db"


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return super().default(obj)


class Database:
    """Local SQLite database for staging scraped data."""
    
    def __init__(self, db_path: Path = DB_PATH):
        self.db_path = db_path
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()
    
    @contextmanager
    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
        finally:
            conn.close()
    
    def _init_db(self):
        """Initialize database tables."""
        with self._get_connection() as conn:
            # Lenders table
            conn.execute("""
                CREATE TABLE IF NOT EXISTS lenders (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    slug TEXT UNIQUE NOT NULL,
                    type TEXT NOT NULL,
                    logo_url TEXT,
                    website_url TEXT NOT NULL,
                    description TEXT,
                    is_active INTEGER DEFAULT 1,
                    created_at TEXT NOT NULL
                )
            """)
            
            # Raw scraped rates (before normalization)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS raw_rates (
                    id TEXT PRIMARY KEY,
                    lender_slug TEXT NOT NULL,
                    lender_name TEXT,
                    term_months INTEGER NOT NULL,
                    rate_type TEXT NOT NULL,
                    mortgage_type TEXT,
                    rate TEXT NOT NULL,
                    posted_rate TEXT,
                    prepayment_privilege TEXT,
                    is_qualified INTEGER,
                    source_url TEXT NOT NULL,
                    scraped_at TEXT NOT NULL,
                    raw_data TEXT
                )
            """)
            
            # Normalized rates (after validation)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS rate_products (
                    id TEXT PRIMARY KEY,
                    lender_id TEXT NOT NULL,
                    term_months INTEGER NOT NULL,
                    rate_type TEXT NOT NULL,
                    mortgage_type TEXT NOT NULL,
                    rate TEXT NOT NULL,
                    posted_rate TEXT,
                    effective_date TEXT NOT NULL,
                    prepayment_privilege TEXT,
                    portability INTEGER,
                    penalties_info TEXT,
                    min_down_payment TEXT,
                    source_url TEXT NOT NULL,
                    scraped_at TEXT NOT NULL,
                    is_current INTEGER DEFAULT 1
                )
            """)
            
            # Rate history (for trend charts)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS rate_history (
                    id TEXT PRIMARY KEY,
                    lender_id TEXT NOT NULL,
                    term_months INTEGER NOT NULL,
                    rate_type TEXT NOT NULL,
                    rate TEXT NOT NULL,
                    recorded_at TEXT NOT NULL
                )
            """)
            
            # Scraping results log
            conn.execute("""
                CREATE TABLE IF NOT EXISTS scraping_results (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    lender_slug TEXT NOT NULL,
                    success INTEGER NOT NULL,
                    rates_found INTEGER DEFAULT 0,
                    error_message TEXT,
                    scraped_at TEXT NOT NULL,
                    duration_seconds REAL
                )
            """)
            
            # Sync log
            conn.execute("""
                CREATE TABLE IF NOT EXISTS sync_log (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    rates_total INTEGER NOT NULL,
                    rates_inserted INTEGER NOT NULL,
                    rates_updated INTEGER NOT NULL,
                    rates_unchanged INTEGER NOT NULL,
                    sync_timestamp TEXT NOT NULL,
                    error_message TEXT
                )
            """)
            
            conn.commit()
            logger.info(f"Database initialized at {self.db_path}")
    
    def save_raw_rates(self, rates: List[RawRate]):
        """Save raw scraped rates to staging."""
        import uuid
        with self._get_connection() as conn:
            for rate in rates:
                rate_id = str(uuid.uuid4())
                conn.execute("""
                    INSERT INTO raw_rates
                    (id, lender_slug, lender_name, term_months, rate_type, mortgage_type,
                     rate, posted_rate, prepayment_privilege, is_qualified,
                     source_url, scraped_at, raw_data)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    rate_id,
                    rate.lender_slug,
                    rate.lender_name,
                    rate.term_months,
                    rate.rate_type.value,
                    rate.mortgage_type.value if rate.mortgage_type else None,
                    str(rate.rate),
                    str(rate.posted_rate) if rate.posted_rate else None,
                    rate.prepayment_privilege,
                    1 if rate.is_qualified else 0 if rate.is_qualified is not None else None,
                    rate.source_url,
                    rate.scraped_at.isoformat(),
                    json.dumps(rate.raw_data, cls=DecimalEncoder) if rate.raw_data else None
                ))
            conn.commit()
        logger.info(f"Saved {len(rates)} raw rates to staging")
    
    def save_rate_products(self, rates: List[RateProduct]):
        """Save normalized rate products."""
        with self._get_connection() as conn:
            for rate in rates:
                conn.execute("""
                    INSERT OR REPLACE INTO rate_products
                    (id, lender_id, term_months, rate_type, mortgage_type,
                     rate, posted_rate, effective_date, prepayment_privilege,
                     portability, penalties_info, min_down_payment, source_url,
                     scraped_at, is_current)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    rate.id,
                    rate.lender_id,
                    rate.term_months,
                    rate.rate_type.value,
                    rate.mortgage_type.value,
                    str(rate.rate),
                    str(rate.posted_rate) if rate.posted_rate else None,
                    rate.effective_date.isoformat(),
                    rate.prepayment_privilege,
                    1 if rate.portability else 0 if rate.portability is not None else None,
                    rate.penalties_info,
                    str(rate.min_down_payment) if rate.min_down_payment else None,
                    rate.source_url,
                    rate.scraped_at.isoformat(),
                    1 if rate.is_current else 0
                ))
            conn.commit()
        logger.info(f"Saved {len(rates)} rate products")
    
    def log_scraping_result(self, result: ScrapingResult):
        """Log the result of a scraping operation."""
        with self._get_connection() as conn:
            conn.execute("""
                INSERT INTO scraping_results
                (lender_slug, success, rates_found, error_message, scraped_at, duration_seconds)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                result.lender_slug,
                1 if result.success else 0,
                result.rates_found,
                result.error_message,
                result.scraped_at.isoformat(),
                result.duration_seconds
            ))
            conn.commit()
        
        if result.success:
            logger.success(f"Scraped {result.lender_slug}: {result.rates_found} rates in {result.duration_seconds:.1f}s")
        else:
            logger.error(f"Failed to scrape {result.lender_slug}: {result.error_message}")
    
    def get_latest_rates(self, lender_slug: Optional[str] = None) -> List[dict]:
        """Get latest rates (optionally filtered by lender)."""
        with self._get_connection() as conn:
            query = "SELECT * FROM raw_rates WHERE 1=1"
            params = []
            if lender_slug:
                query += " AND lender_slug = ?"
                params.append(lender_slug)
            query += " ORDER BY scraped_at DESC LIMIT 100"
            
            cursor = conn.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
    
    def get_scraping_stats(self, since: Optional[datetime] = None) -> dict:
        """Get scraping statistics."""
        with self._get_connection() as conn:
            since = since or datetime(2000, 1, 1)
            
            total = conn.execute(
                "SELECT COUNT(*) FROM scraping_results WHERE scraped_at > ?",
                (since.isoformat(),)
            ).fetchone()[0]
            
            successful = conn.execute(
                "SELECT COUNT(*) FROM scraping_results WHERE success = 1 AND scraped_at > ?",
                (since.isoformat(),)
            ).fetchone()[0]
            
            total_rates = conn.execute(
                "SELECT SUM(rates_found) FROM scraping_results WHERE success = 1 AND scraped_at > ?",
                (since.isoformat(),)
            ).fetchone()[0] or 0
            
            return {
                "total_attempts": total,
                "successful": successful,
                "failed": total - successful,
                "success_rate": f"{(successful/total*100):.1f}%" if total > 0 else "0%",
                "total_rates_collected": total_rates
            }


# Global database instance
db = Database()
