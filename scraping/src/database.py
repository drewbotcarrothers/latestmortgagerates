"""
Local SQLite database for staging scraped rates before syncing to Hostinger.
This acts as the buffer between scraping and production.
"""

import sqlite3
import json
from datetime import datetime, timedelta
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
    
    def record_rate_history(self, rates: List[RawRate]):
        """Record rate history for trend analysis."""
        import uuid
        recorded_at = datetime.utcnow().isoformat()
        
        with self._get_connection() as conn:
            history_count = 0
            for rate in rates:
                history_id = str(uuid.uuid4())
                conn.execute("""
                    INSERT INTO rate_history
                    (id, lender_id, term_months, rate_type, rate, recorded_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (
                    history_id,
                    rate.lender_slug,
                    rate.term_months,
                    rate.rate_type.value,
                    str(rate.rate),
                    recorded_at
                ))
                history_count += 1
            conn.commit()
        
        logger.info(f"Recorded {history_count} rate history entries")
    
    def get_rate_history(self, lender_slug: str = None, term_months: int = 60, 
                        days: int = 90) -> List[dict]:
        """Get rate history for trend charting.
        
        Args:
            lender_slug: Filter by specific lender, or None for all lenders average
            term_months: Term period (12, 24, 36, 48, 60, etc)
            days: Number of days of history to retrieve
        """
        cutoff_date = (datetime.utcnow() - timedelta(days=days)).isoformat()
        
        with self._get_connection() as conn:
            query = """
                SELECT lender_id, term_months, rate_type, rate, recorded_at
                FROM rate_history
                WHERE term_months = ? AND recorded_at > ?
                AND rate > 0 AND rate < '20'  -- Sanity check
            """
            params = [term_months, cutoff_date]
            
            if lender_slug:
                query += " AND lender_id = ?"
                params.append(lender_slug)
            
            query += " ORDER BY recorded_at ASC"
            
            cursor = conn.execute(query, params)
            rows = cursor.fetchall()
            
            return [dict(row) for row in rows]
    
    def get_rate_trends(self, days: int = 30) -> List[dict]:
        """Get average rates by day for trend analysis.
        
        Returns daily average rates for 5-year fixed and 5-year variable
        across all lenders.
        """
        cutoff_date = (datetime.utcnow() - timedelta(days=days)).isoformat()
        
        with self._get_connection() as conn:
            # Get daily averages for 5-year fixed
            cursor = conn.execute("""
                SELECT DATE(recorded_at) as date, AVG(CAST(rate AS REAL)) as avg_rate, 
                       COUNT(*) as sample_size, rate_type
                FROM rate_history
                WHERE term_months = 60 AND recorded_at > ?
                GROUP BY DATE(recorded_at), rate_type
                ORDER BY date ASC
            """, (cutoff_date,))
            
            return [dict(row) for row in cursor.fetchall()]
    
    def get_latest_rate_change(self, term_months: int = 60, rate_type: str = "fixed") -> dict:
        """Get the rate change between last two recordings."""
        with self._get_connection() as conn:
            cursor = conn.execute("""
                SELECT DISTINCT DATE(recorded_at) as date, AVG(CAST(rate AS REAL)) as avg_rate
                FROM rate_history
                WHERE term_months = ? AND rate_type = ?
                GROUP BY DATE(recorded_at)
                ORDER BY date DESC
                LIMIT 2
            """, (term_months, rate_type))
            
            rows = cursor.fetchall()
            if len(rows) < 2:
                return {"change": 0, "percent_change": 0, "direction": "stable", "days_since": 0}
            
            latest = rows[0]
            previous = rows[1]
            
            latest_rate = latest['avg_rate']
            prev_rate = previous['avg_rate']
            change = round(latest_rate - prev_rate, 3)
            percent_change = round((change / prev_rate) * 100, 2) if prev_rate > 0 else 0
            
            direction = "down" if change < 0 else "up" if change > 0 else "stable"
            
            return {
                "change": change,
                "percent_change": percent_change,
                "direction": direction,
                "latest_rate": round(latest_rate, 3),
                "previous_rate": round(prev_rate, 3),
                "days_since": 0
            }
    
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
