"""
API routes for design presets
"""

from fastapi import APIRouter
from ai_modules.presets import get_presets_summary

router = APIRouter()


@router.get("/design-presets")
async def get_design_presets():
    """
    Get all available design presets
    
    Returns:
        Dictionary with property_types, design_styles, room_types, budget_ranges
    """
    return get_presets_summary()


@router.get("/property-types")
async def get_property_types():
    """Get available property types"""
    from ai_modules.presets import PROPERTY_TYPES
    return {"property_types": PROPERTY_TYPES}


@router.get("/design-styles")
async def get_design_styles():
    """Get available design styles"""
    from ai_modules.presets import DESIGN_STYLES
    return {"design_styles": DESIGN_STYLES}


@router.get("/room-types")
async def get_room_types():
    """Get available room types"""
    from ai_modules.presets import ROOM_TYPES
    return {"room_types": ROOM_TYPES}


@router.get("/budget-ranges")
async def get_budget_ranges():
    """Get available budget ranges"""
    from ai_modules.presets import BUDGET_RANGES
    return {"budget_ranges": BUDGET_RANGES}

