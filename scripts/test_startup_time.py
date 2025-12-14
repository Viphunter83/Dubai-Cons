import time
import sys
import os

sys.path.append(os.path.join(os.getcwd(), 'src'))

print("⏳ Measuring startup time...")
start_time = time.time()

# Import main app which triggers all route imports
from main import app

end_time = time.time()
duration = end_time - start_time

print(f"✅ Startup completed in {duration:.2f} seconds.")

if duration > 2.0:
    print("⚠️ Startup is SLOW! Something is blocking import.")
    sys.exit(1)
else:
    print("🚀 Startup is FAST.")
    sys.exit(0)
