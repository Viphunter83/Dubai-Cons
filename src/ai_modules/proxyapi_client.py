"""
ProxyAPI client for accessing AI models
"""

import httpx
from typing import Optional, Dict, Any, List
from config.settings import settings


class ProxyAPIClient:
    """
    Client for accessing AI services through ProxyAPI
    """
    
    def __init__(self):
        self.base_url = settings.proxyapi_base_url
        self.api_key = settings.proxyapi_key
        self.openai_url = f"{self.base_url}/openai/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def chat_completion(
        self,
        model: str,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2000,
    ) -> Optional[Dict[str, Any]]:
        """
        Send chat completion request via ProxyAPI to OpenAI
        
        Args:
            model: Model to use (e.g., "gpt-4", "gpt-3.5-turbo")
            messages: List of message dicts with role and content
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            
        Returns:
            Response dictionary or None if error
        """
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(
                    f"{self.openai_url}/chat/completions",
                    headers=self.headers,
                    json={
                        "model": model,
                        "messages": messages,
                        "temperature": temperature,
                        "max_tokens": max_tokens,
                    }
                )
                response.raise_for_status()
                return response.json()
            except Exception as e:
                print(f"Error in chat completion: {e}")
                return None
    
    async def generate_image(
        self,
        model: str,
        prompt: str,
        size: str = "1024x1024",
        quality: str = "standard",
    ) -> Optional[Dict[str, Any]]:
        """
        Generate image via ProxyAPI to DALL-E
        
        Args:
            model: Model to use (e.g., "dall-e-3")
            prompt: Text description of image
            size: Image size
            quality: Image quality (standard or hd)
            
        Returns:
            Response dictionary with image URL or None if error
        """
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(
                    f"{self.openai_url}/images/generations",
                    headers=self.headers,
                    json={
                        "model": model,
                        "prompt": prompt,
                        "size": size,
                        "quality": quality,
                        "n": 1,
                    }
                )
                response.raise_for_status()
                return response.json()
            except Exception as e:
                print(f"Error generating image: {e}")
                return None


# Global client instance
proxy_api_client = ProxyAPIClient()
