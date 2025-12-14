"""
Initialize database schema
"""

from database.connection import engine, Base
from database.models import User, Client, Project, DesignConcept, Material, Estimation

def init_db():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


if __name__ == "__main__":
    init_db()
