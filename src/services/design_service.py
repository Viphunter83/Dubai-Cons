"""
Design AI Service - Generates design concepts using AI
"""

from typing import Optional, Dict, Any
from ai_modules.proxyapi_client import proxy_api_client
from ai_modules.prompts import get_design_concept_prompt, get_image_generation_prompt


class DesignAIService:
    """
    Service for generating design concepts using AI
    """
    
    def __init__(self):
        self.text_model = "gpt-4"  # Will use deepseek-v3 through ProxyAPI
        self.image_model = "dall-e-3"
    
    async def generate_design_concept(
        self,
        client_preferences: str,
        project_details: str,
        model_type: str = "standard"  # "standard" or "pro"
    ) -> Optional[Dict[str, Any]]:
        """
        Generate a complete design concept (text + image)
        
        Args:
            client_preferences: Client requirements
            project_details: Project details
            model_type: "standard" (DALL-E) or "pro" (Nano Banana Pro / Gemini)
            
        Returns:
            Dictionary with design_description and image_url
        """
        import asyncio
        from ai_modules.gemini_client import gemini_client
        
        try:
            # Generate text description with increased tokens
            prompt = get_design_concept_prompt(client_preferences, project_details)
            
            messages = [
                {"role": "system", "content": "You are an expert interior designer."},
                {"role": "user", "content": prompt}
            ]
            
            response = await proxy_api_client.chat_completion(
                model=self.text_model,
                messages=messages,
                temperature=0.7,
                max_tokens=6000,
            )
            
            if not response:
                return None
            
            design_description = response["choices"][0]["message"]["content"]
            
            # Generate image
            image_url = None
            
            if model_type == "pro" and gemini_client.api_key_configured:
                # Use Nano Banana Pro (Gemini)
                try:
                    image_prompt = get_image_generation_prompt(design_description)
                    image_response = await gemini_client.generate_image(
                        prompt=image_prompt
                    )
                    if image_response:
                        image_url = image_response.get("image_url")
                except Exception as e:
                    print(f"Gemini generation failed: {e}")
                    # Fallback to standard? Or just fail? Let's keep it null to indicate failure or handle graceful degradation in UI
            else:
                # Use Standard (DALL-E via ProxyAPI)
                max_retries = 3
                for attempt in range(max_retries):
                    try:
                        image_prompt = get_image_generation_prompt(design_description)
                        image_response = await proxy_api_client.generate_image(
                            model=self.image_model,
                            prompt=image_prompt,
                            size="1024x1024",
                            quality="hd"
                        )
                        
                        if image_response and "data" in image_response:
                            image_url = image_response["data"][0]["url"]
                            break  # Success
                    except Exception as image_error:
                        print(f"Error generating image (attempt {attempt + 1}/{max_retries}): {image_error}")
                        if attempt < max_retries - 1:
                            await asyncio.sleep(2)  # Wait 2 seconds before retry
                        else:
                            print("Image generation failed after all retries, trying Gemini fallback...")
            
            # Fallback to Gemini if Standard failed or if model_type was standard but failed
            if not image_url:
                try:
                    print("Attempting fallback to Gemini/Mock...")
                    image_prompt = get_image_generation_prompt(design_description)
                    # We force call gemini even if not "pro" because we need an image (and it handles mocks)
                    image_response = await gemini_client.generate_image(prompt=image_prompt)
                    if image_response:
                        image_url = image_response.get("image_url")
                        print(f"Fallback successful. URL: {image_url}")
                except Exception as e:
                    print(f"Fallback to Gemini failed: {e}")
            
            result_dict = {
                "description": design_description,
                "image_url": image_url,
                "style": "Contemporary Luxury",
                "color_scheme": "Neutral with gold accents",
                "model_used": "Nano Banana Pro" if model_type == "pro" else "Standard AI"
            }
            print(f"DEBUG: design_service return: {result_dict}")
            return result_dict
            
        except Exception as e:
            print(f"Error generating design concept: {e}")
            import traceback
            traceback.print_exc()
            return None


# Global service instance
design_service = DesignAIService()
