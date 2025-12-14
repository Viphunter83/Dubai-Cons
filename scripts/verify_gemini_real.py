import asyncio
import os
import sys
from dotenv import load_dotenv

# Load env before imports
load_dotenv()

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))

from ai_modules.gemini_client import gemini_client
from config.settings import settings

async def main():
    print("🚀 Testing Google Gen AI SDK Integration")
    
    if not settings.google_api_key:
        print("❌ GOOGLE_API_KEY is not set in env. Skipping real test.")
        return

    print("1. Testing Text Generation (Gemini 1.5 Flash)...")
    text = await gemini_client.generate_content("Hello, are you online? Reply with 'Yes I am online'.")
    if text:
        print(f"✅ Text Response: {text}")
    else:
        print("❌ Text Generation Failed")

    print("\n2. Testing Image Generation (Imagen 3)...")
    # Note: This might fail if the API key doesn't have whitelisted access to Imagen
    result = await gemini_client.generate_image("Modern luxury apartment in Dubai with a view of Burj Khalifa, photorealistic")
    
    if result:
        print(f"✅ Image Result: {result}")
        if "Mock" in result.get('model_used', ''):
            print("⚠️ (It resulted in Mock Fallback, which is expected if allowlist is active)")
        else:
            print("🎉 REAL IMAGEN GENERATION SUCCESS!")
    else:
        print("❌ Image Generation Failed/Returned None")

if __name__ == "__main__":
    asyncio.run(main())
