import asyncio
import os
import sys
from sqlalchemy import create_engine, text
from redis import Redis

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))

# Manual env loading since python-dotenv might not overload existing env vars if not careful,
# but here we rely on the .env file being updated.
# We will just use the values we expect.

DB_URL = "postgresql://postgres:password@127.0.0.1:5433/dubaicons"
REDIS_URL = "redis://127.0.0.1:6379/0"

def test_postgres():
    print("🐘 Testing PostgreSQL Connection...")
    try:
        engine = create_engine(DB_URL)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print(f"✅ PostgreSQL Connected! Result: {result.scalar()}")
    except Exception as e:
        print(f"❌ PostgreSQL Connection Failed: {e}")

def test_redis():
    print("\n🔴 Testing Redis Connection...")
    try:
        r = Redis.from_url(REDIS_URL, decode_responses=True)
        r.set('test_key', 'hello_dubai')
        val = r.get('test_key')
        if val == 'hello_dubai':
             print(f"✅ Redis Connected! Value: {val}")
        else:
             print(f"❌ Redis Failed. Got: {val}")
    except Exception as e:
        print(f"❌ Redis Connection Failed: {e}")

if __name__ == "__main__":
    test_postgres()
    test_redis()
