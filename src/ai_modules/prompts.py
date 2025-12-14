"""
AI prompts for design generation
"""


def get_design_concept_prompt(client_preferences: str, project_details: str) -> str:
    """
    Generate prompt for design concept generation
    
    Args:
        client_preferences: Client's preferences and requirements
        project_details: Project details (area, type, location, etc.)
        
    Returns:
        Formatted prompt for AI model
    """
    prompt = f"""You are an expert interior designer and architect specializing in luxury residential and commercial spaces in Dubai.

Client Requirements:
{client_preferences}

Project Details:
{project_details}

IMPORTANT: Provide a comprehensive, detailed interior design concept with AT LEAST 500 words per room.

Structure your response with:
1. DESIGN STYLE: Specific contemporary luxury style suitable for Dubai (minimum 100 words)
2. COLOR PALETTE: 5-7 colors with hex codes (e.g., #FFFFFF), explain why each color was chosen
3. MAIN DESIGN ELEMENTS (minimum 300 words):
   - Flooring materials and finishes (specify brand, type, texture)
   - Wall treatments and textures (specific materials and techniques)
   - Ceiling design (lighting integration, materials, height considerations)
   - Lighting strategy (ambient, task, accent lighting with specific fixtures)
   - Furniture style and positioning (layout, materials, brands recommendations)
4. KEY FEATURES: Unique elements that reflect Dubai's luxury lifestyle (minimum 100 words)
5. MOOD AND AMBIENCE: Description of the final atmosphere (minimum 50 words)
6. SUSTAINABLE ELEMENTS: Eco-friendly materials and solutions (minimum 50 words)
7. ROOM-BY-ROOM BREAKDOWN (minimum 400 words per room):
   For EACH room specify:
   - Layout and space planning
   - Specific materials with brands where applicable
   - Furniture recommendations with approximate dimensions
   - Color scheme for this specific room
   - Lighting design
   - Decorative elements
   - Technical considerations (electrical, plumbing, HVAC if applicable)

Provide MINIMUM 500 words per room. Be specific, detailed, and include material specifications."""
    
    return prompt


def get_image_generation_prompt(design_description: str) -> str:
    """
    Generate prompt for image generation from design description
    
    Args:
        design_description: AI-generated design description (full text, not truncated)
        
    Returns:
        Optimized prompt for DALL-E 3 image generation
    """
    # Use the full description without truncation
    prompt = f"""Create a photorealistic 3D render of a luxury interior design in Dubai:

{design_description}

Style: Professional architectural visualization
Quality: Ultra-realistic, magazine-worthy
Mood: Luxurious, sophisticated, modern
Setting: Dubai luxury residence
Camera: Wide angle, eye level, perfect lighting
Art style: Photo-realistic, 4K quality, detailed materials, natural lighting
Lighting: Natural daylight with perfect exposure"""
    
    return prompt
