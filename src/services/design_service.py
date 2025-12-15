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
                print("Primary AI text generation failed. Using fallback description.")
                design_description = (
                    f"**Design Concept (Fallback Generated)**\n\n"
                    f"Based on your request for a {client_preferences} style,\n"
                    f"we propose a sophisticated layout that harmonizes functionality with aesthetics.\n\n"
                    f"- **Style:** {client_preferences}\n"
                    f"- **Atmosphere:** Modern, clean, and elegant.\n"
                    f"- **Key Elements:** High-quality materials, optimal lighting, and spatial efficiency.\n\n"
                    f"(Note: AI servers are currently busy, this is a placeholder description.)"
                )
            else:
                design_description = response["choices"][0]["message"]["content"]
            
            # Generate image
            image_url = None
            final_model_used = "Standard AI"
            
            # Helper function for standard generation
            async def generate_standard_image(desc):
                max_retries = 3
                for attempt in range(max_retries):
                    try:
                        img_prompt = get_image_generation_prompt(desc)
                        img_response = await proxy_api_client.generate_image(
                            model=self.image_model,
                            prompt=img_prompt,
                            size="1024x1024",
                            quality="hd"
                        )
                        if img_response and "data" in img_response:
                            return img_response["data"][0]["url"]
                    except Exception as e:
                        print(f"Standard generation attempt {attempt + 1} failed: {e}")
                        if attempt < max_retries - 1:
                            await asyncio.sleep(2)
                return None

            # 1. Try Pro Mode (Gemini) if requested
            if model_type == "pro":
                if gemini_client.api_key_configured:
                    try:
                        print("Attempting to use Nano Banana Pro (Gemini)...")
                        image_prompt = get_image_generation_prompt(design_description)
                        image_response = await gemini_client.generate_image(
                            prompt=image_prompt
                        )
                        if image_response and image_response.get("image_url"):
                            image_url = image_response.get("image_url")
                            final_model_used = "Nano Banana Pro"
                    except Exception as e:
                        print(f"Gemini generation failed: {e}")
                        print("Falling back to Standard model...")
                else:
                    print("Gemini not configured. Falling back to Standard model...")

            # 2. Fallback or Standard Mode
            if not image_url:
                image_url = await generate_standard_image(design_description)

            # 3. Last Resort Fallback (Mock/Gemini default if everything else fails)
            if not image_url:
                try:
                    print("All standard methods failed. Attempting final fallback...")
                    # This might return a mock if configured in gemini_client
                    image_prompt = get_image_generation_prompt(design_description)
                    image_response = await gemini_client.generate_image(prompt=image_prompt)
                    if image_response:
                        image_url = image_response.get("image_url")
                        print(f"Final fallback successful. URL: {image_url}")
                except Exception as e:
                    print(f"Final fallback failed: {e}")

            result_dict = {
                "description": design_description,
                "image_url": image_url,
                "style": "Contemporary Luxury",
                "color_scheme": "Neutral with gold accents",
                "model_used": final_model_used
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
