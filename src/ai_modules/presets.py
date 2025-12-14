"""
Design Presets for Dubai Cons AI Suite
Pre-defined templates for different property types and styles
"""

from typing import Dict, List, Any

# Property types with descriptions
PROPERTY_TYPES = [
    {
        "value": "villa",
        "label": "Villa",
        "icon": "🏡",
        "description": "Luxury standalone villa",
        "typical_area": 400,
        "typical_rooms": ["living_room", "dining_room", "kitchen", "4_bedrooms", "3_bathrooms", "study", "garden"]
    },
    {
        "value": "penthouse",
        "label": "Penthouse",
        "icon": "🏙️",
        "description": "Luxury top-floor residence",
        "typical_area": 350,
        "typical_rooms": ["living_room", "dining_room", "kitchen", "3_bedrooms", "2_bathrooms", "terrace"]
    },
    {
        "value": "apartment",
        "label": "Apartment",
        "icon": "🏢",
        "description": "Standard residential apartment",
        "typical_area": 120,
        "typical_rooms": ["living_room", "kitchen", "2_bedrooms", "2_bathrooms"]
    },
    {
        "value": "office",
        "label": "Commercial Office",
        "icon": "💼",
        "description": "Corporate office space",
        "typical_area": 300,
        "typical_rooms": ["reception", "open_space", "meeting_rooms", "private_offices", "pantry"]
    },
    {
        "value": "restaurant",
        "label": "Restaurant/HoReCa",
        "icon": "🍽️",
        "description": "Hospitality and dining establishment",
        "typical_area": 250,
        "typical_rooms": ["dining_area", "bar", "kitchen", "storage", "restrooms"]
    }
]

# Design styles
DESIGN_STYLES = [
    {
        "value": "modern_luxury",
        "label": "Modern Luxury",
        "description": "Sleek contemporary with high-end finishes",
        "color_palette": ["#FFFFFF", "#F5F5F5", "#FFD700", "#000000"],
        "materials": ["marble", "glass", "brass", "leather"],
        "preview": "Sleek lines, neutral colors with gold accents"
    },
    {
        "value": "luxury_arabic",
        "label": "Luxury Arabic",
        "description": "Traditional Middle Eastern elegance",
        "color_palette": ["#D4AF37", "#B8860B", "#800020", "#2F4F4F"],
        "materials": ["marble", "traditional_tiles", "wood_carving", "textiles"],
        "preview": "Rich gold and burgundy, intricate patterns"
    },
    {
        "value": "minimalist",
        "label": "Minimalist",
        "description": "Clean and simple aesthetic",
        "color_palette": ["#FFFFFF", "#F0F0F0", "#333333"],
        "materials": ["concrete", "wood", "metal"],
        "preview": "Minimal furniture, clean lines, neutral colors"
    },
    {
        "value": "art_deco",
        "label": "Art Deco",
        "description": "Vintage glamour and geometric patterns",
        "color_palette": ["#000000", "#FFFFFF", "#FFD700", "#DC143C"],
        "materials": ["mirrors", "lacquer", "brass", "velvet"],
        "preview": "Geometric patterns, bold colors, luxurious"
    },
    {
        "value": "industrial",
        "label": "Industrial",
        "description": "Urban loft style with exposed elements",
        "color_palette": ["#2F2F2F", "#C0C0C0", "#8B4513"],
        "materials": ["concrete", "steel", "brick", "wood"],
        "preview": "Exposed brick, metal fixtures, raw materials"
    },
    {
        "value": "scandinavian",
        "label": "Scandinavian",
        "description": "Light, airy with natural wood",
        "color_palette": ["#FFFFFF", "#F5F5DC", "#D2B48C"],
        "materials": ["wood", "white_paint", "wool", "cotton"],
        "preview": "Light wood, white walls, cozy textiles"
    }
]

# Room types - GENERAL list for backward compatibility
ROOM_TYPES = [
    {
        "value": "living_room",
        "label": "Living Room",
        "icon": "🛋️",
        "typical_area": 40,
        "description": "Main social space"
    },
    {
        "value": "bedroom",
        "label": "Bedroom",
        "icon": "🛏️",
        "typical_area": 20,
        "description": "Sleeping quarters"
    },
    {
        "value": "kitchen",
        "label": "Kitchen",
        "icon": "🍳",
        "typical_area": 15,
        "description": "Cooking and dining area"
    },
    {
        "value": "bathroom",
        "label": "Bathroom",
        "icon": "🚿",
        "typical_area": 10,
        "description": "Bathroom facilities"
    },
    {
        "value": "dining_room",
        "label": "Dining Room",
        "icon": "🍽️",
        "typical_area": 25,
        "description": "Dining area"
    },
    {
        "value": "study",
        "label": "Study / Office",
        "icon": "💻",
        "typical_area": 15,
        "description": "Work space"
    },
    {
        "value": "terrace",
        "label": "Terrace / Balcony",
        "icon": "🌿",
        "typical_area": 20,
        "description": "Outdoor space"
    }
]

# Property-specific room types
PROPERTY_SPECIFIC_ROOMS = {
    "villa": [
        {"value": "living_room", "label": "Living Room", "icon": "🛋️", "typical_area": 50},
        {"value": "dining_room", "label": "Dining Room", "icon": "🍽️", "typical_area": 30},
        {"value": "kitchen", "label": "Kitchen", "icon": "🍳", "typical_area": 20},
        {"value": "bedroom", "label": "Master Bedroom", "icon": "🛏️", "typical_area": 25},
        {"value": "guest_bedroom", "label": "Guest Bedroom", "icon": "🛏️", "typical_area": 20},
        {"value": "bathroom", "label": "Bathroom", "icon": "🚿", "typical_area": 12},
        {"value": "study", "label": "Study/Home Office", "icon": "💻", "typical_area": 15},
        {"value": "garden", "label": "Garden/Terrace", "icon": "🌿", "typical_area": 100},
    ],
    "apartment": [
        {"value": "living_room", "label": "Living Room", "icon": "🛋️", "typical_area": 30},
        {"value": "kitchen", "label": "Kitchen", "icon": "🍳", "typical_area": 12},
        {"value": "bedroom", "label": "Bedroom", "icon": "🛏️", "typical_area": 18},
        {"value": "bathroom", "label": "Bathroom", "icon": "🚿", "typical_area": 8},
    ],
    "penthouse": [
        {"value": "living_room", "label": "Living Room", "icon": "🛋️", "typical_area": 60},
        {"value": "dining_room", "label": "Dining Room", "icon": "🍽️", "typical_area": 35},
        {"value": "kitchen", "label": "Kitchen", "icon": "🍳", "typical_area": 25},
        {"value": "bedroom", "label": "Master Bedroom", "icon": "🛏️", "typical_area": 30},
        {"value": "bathroom", "label": "Bathroom", "icon": "🚿", "typical_area": 15},
        {"value": "terrace", "label": "Terrace/ROOF", "icon": "🌿", "typical_area": 80},
    ],
    "office": [
        {"value": "reception", "label": "Reception Area", "icon": "🚪", "typical_area": 30},
        {"value": "open_space", "label": "Open Workspace", "icon": "🖥️", "typical_area": 100},
        {"value": "meeting_room", "label": "Meeting Room", "icon": "👥", "typical_area": 40},
        {"value": "private_office", "label": "Private Office", "icon": "🏢", "typical_area": 25},
        {"value": "pantry", "label": "Pantry/Kitchen", "icon": "🍵", "typical_area": 15},
        {"value": "server_room", "label": "Server Room", "icon": "💻", "typical_area": 20},
    ],
    "restaurant": [
        {"value": "dining_area", "label": "Dining Area", "icon": "🍽️", "typical_area": 100},
        {"value": "bar_area", "label": "Bar Area", "icon": "🍸", "typical_area": 40},
        {"value": "professional_kitchen", "label": "Professional Kitchen", "icon": "👨‍🍳", "typical_area": 60},
        {"value": "storage", "label": "Storage/Pantry", "icon": "📦", "typical_area": 30},
        {"value": "restrooms", "label": "Restrooms", "icon": "🚻", "typical_area": 20},
        {"value": "entrance", "label": "Entrance/Host", "icon": "🚪", "typical_area": 20},
    ]
}

def get_rooms_for_property_type(property_type: str) -> list:
    """Get room types specific to property type"""
    return PROPERTY_SPECIFIC_ROOMS.get(property_type, ROOM_TYPES)

# Budget ranges
BUDGET_RANGES = [
    {"min": 100000, "max": 250000, "label": "100k - 250k AED"},
    {"min": 250000, "max": 500000, "label": "250k - 500k AED"},
    {"min": 500000, "max": 1000000, "label": "500k - 1M AED"},
    {"min": 1000000, "max": 2000000, "label": "1M - 2M AED"},
    {"min": 2000000, "max": 5000000, "label": "2M+ AED"}
]


def get_preset_by_type(property_type: str) -> Dict[str, Any]:
    """Get preset by property type"""
    for preset in PROPERTY_TYPES:
        if preset["value"] == property_type:
            return preset
    return PROPERTY_TYPES[0]  # Default to villa


def get_preset_by_style(style: str) -> Dict[str, Any]:
    """Get preset by design style"""
    for preset in DESIGN_STYLES:
        if preset["value"] == style:
            return preset
    return DESIGN_STYLES[0]  # Default to modern luxury


def build_design_prompt_from_presets(
    property_type: str,
    design_style: str,
    rooms: List[Dict],
    budget_range: str,
    additional_preferences: str = ""
) -> str:
    """
    Build AI design prompt from preset selections
    
    Args:
        property_type: Selected property type
        design_style: Selected design style
        rooms: List of rooms with {type, quantity, area}
        budget_range: Selected budget range
        additional_preferences: Any additional text preferences
        
    Returns:
        Complete AI prompt
    """
    # Get presets
    property_preset = get_preset_by_type(property_type)
    style_preset = get_preset_by_style(design_style)
    
    # Build rooms description
    rooms_desc = []
    for room in rooms:
        rooms_desc.append(f"{room.get('quantity', 1)}x {room.get('type', 'room')} ({room.get('area', 15)} sqm)")
    rooms_text = ", ".join(rooms_desc)
    
    # Build prompt
    prompt = f"""Create a comprehensive interior design concept for a {property_preset['label']} in Dubai.

PROPERTY DETAILS:
- Type: {property_preset['label']} - {property_preset['description']}
- Rooms: {rooms_text}
- Budget Range: {budget_range}

DESIGN STYLE: {style_preset['label']}
- Description: {style_preset['description']}
- Color Palette: {', '.join(style_preset['color_palette'])}
- Key Materials: {', '.join(style_preset['materials'])}
- Aesthetic: {style_preset['preview']}

ADDITIONAL REQUIREMENTS:
{additional_preferences if additional_preferences else "No specific additional requirements"}

Please provide:
1. Detailed design concept for each room
2. Color schemes with specific hex codes
3. Material recommendations
4. Furniture suggestions
5. Lighting strategy
6. Decorative elements
7. Dubai-specific luxury touches
"""
    
    return prompt


def get_presets_summary() -> Dict[str, Any]:
    """Get all available presets for frontend"""
    return {
        "property_types": PROPERTY_TYPES,
        "design_styles": DESIGN_STYLES,
        "room_types": ROOM_TYPES,
        "budget_ranges": BUDGET_RANGES,
        "property_specific_rooms": PROPERTY_SPECIFIC_ROOMS
    }

