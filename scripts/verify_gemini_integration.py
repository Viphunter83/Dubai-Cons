import asyncio
import sys
import os
from unittest.mock import MagicMock, patch

# Mock google.generativeai before importing anything that uses it
sys.modules['google'] = MagicMock()
sys.modules['google.generativeai'] = MagicMock()

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))

from services.design_service import DesignAIService

async def test_integration():
    print("🧪 Starting Integration Verification...")
    
    # Mock clients
    with patch('services.design_service.proxy_api_client') as mock_proxy, \
         patch('ai_modules.gemini_client.gemini_client') as mock_gemini:
        
        # Setup mocks with AsyncMock for async methods
        mock_proxy.chat_completion = MagicMock(side_effect=asyncio.coroutine(lambda **kwargs: {
            "choices": [{"message": {"content": "A beautiful design description"}}]
        }))
        mock_proxy.generate_image = MagicMock(side_effect=asyncio.coroutine(lambda **kwargs: {
            "data": [{"url": "http://standard-image.com"}]
        }))
        
        mock_gemini.api_key_configured = True
        mock_gemini.generate_image = MagicMock(side_effect=asyncio.coroutine(lambda **kwargs: {
            "image_url": "http://gemini-image.com"
        }))
        
        service = DesignAIService()
        
        # Test Case 1: Standard Model
        print("\n📋 Test Case 1: Standard Model")
        result_std = await service.generate_design_concept(
            "preferences", "details", model_type="standard"
        )
        
        if result_std["image_url"] == "http://standard-image.com" and \
           result_std["model_used"] == "Standard AI":
             print("✅ Standard Model: PASSED")
        else:
             print(f"❌ Standard Model: FAILED. Result: {result_std}")
             
        # Test Case 2: Pro Model
        print("\n📋 Test Case 2: Pro Model (Nano Banana Pro)")
        result_pro = await service.generate_design_concept(
            "preferences", "details", model_type="pro"
        )
        
        if result_pro["image_url"] == "http://gemini-image.com" and \
           result_pro["model_used"] == "Nano Banana Pro":
             print("✅ Pro Model: PASSED")
        else:
             print(f"❌ Pro Model: FAILED. Result: {result_pro}")

if __name__ == "__main__":
    asyncio.run(test_integration())
