import os
import sys
from pathlib import Path
from google import genai

# Add src to sys.path
src_path = Path("/Users/apple/Cursor Projects/Dubai Cons/src")
sys.path.append(str(src_path))

from config.settings import settings

def list_models():
    if not settings.google_api_key:
        print("No Google API Key set.")
        return

    print(f"Checking models for key: {settings.google_api_key[:5]}...")
    try:
        client = genai.Client(api_key=settings.google_api_key)
        # List models that support generation
        print("\nAvailable Models:")
        for model in client.models.list():
             print(f"- {model.name} (DisplayName: {model.display_name})")
             
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    list_models()
