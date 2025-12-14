import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))

from main import app
from database.connection import Base, get_db

# Use a separate test DB if feasible, OR usage dev DB carefully.
# For API E2E in this context, we will use the configured dev DB 
# but could use an SQLite file for isolation if strictness helps.
# But Alembic migrations run against Postgres, so keeping Postgres is better for parity.
# For safety in this prompt, we will use the existing app configuration but 
# in a real CI this should be a fresh test DB.

@pytest.fixture(scope="module")
def client():
    # Use TestClient for sync testing of async endpoints (FastAPI wrapper handles it)
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="module")
def db_session():
    # Helper to clean up or inspect DB directly if needed
    # (Not strictly needed if we only test via API, but good for assertion)
    from database.connection import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
