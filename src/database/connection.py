"""
Database connection setup for Dubai Cons AI Suite
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pathlib import Path

from config.settings import settings
import os

# Get database URL or use SQLite as fallback
database_url = settings.database_url

# Use SQLite for local development if no database configured
if not database_url:
    # Create storage directory
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    storage_dir = BASE_DIR / "storage"
    storage_dir.mkdir(exist_ok=True)
    
    database_url = f"sqlite:///{storage_dir}/dubai_cons.db"

# Create database engine
engine = create_engine(
    database_url,
    connect_args={"check_same_thread": False} if "sqlite" in database_url else {},
    pool_pre_ping=True if "sqlite" not in database_url else False,
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
