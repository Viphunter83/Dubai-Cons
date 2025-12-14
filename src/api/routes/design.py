"""
API routes for design generation
"""

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field, validator
from typing import List, Dict, Any, Optional
from services.design_service import design_service
from services.compliance_service import compliance_service

from database.connection import get_db
from database.models import DesignConcept
from ai_modules.presets import build_design_prompt_from_presets
import json

router = APIRouter()


class RoomPreset(BaseModel):
    type: str = Field(..., description="Room type")
    quantity: int = Field(1, ge=1, description="Number of rooms")
    area: float = Field(..., gt=0, description="Area in sqm")


class PresetDesignRequest(BaseModel):
    property_type: str = Field(..., description="Property type")
    design_style: str = Field(..., description="Design style")
    rooms: List[RoomPreset] = Field(..., description="List of rooms")
    budget_range: str = Field(..., description="Budget range")
    additional_preferences: str = Field("", description="Additional preferences")


class DesignRequest(BaseModel):
    client_preferences: str = Field(..., min_length=10, max_length=2000, description="Client preferences and requirements")
    project_details: str = Field(..., min_length=10, max_length=2000, description="Project details (area, type, location)")
    project_id: Optional[int] = Field(None, gt=0, description="Associated project ID")
    use_pro_for_image: bool = Field(False, description="Use Nano Banana Pro (Gemini) for high quality generation")
    check_compliance: bool = Field(False, description="Check design against Dubai building codes")
    
    @validator('client_preferences')
    def validate_preferences(cls, v):
        if not v or len(v.strip()) < 10:
            raise ValueError('Client preferences must be at least 10 characters')
        return v.strip()
    
    @validator('project_details')
    def validate_details(cls, v):
        if not v or len(v.strip()) < 10:
            raise ValueError('Project details must be at least 10 characters')
        return v.strip()


class DesignResponse(BaseModel):
    id: Optional[int] = None
    description: str
    image_url: Optional[str] = None
    style: str
    color_scheme: str
    compliance_report: Optional[Dict[str, Any]] = None
    rooms_designs: Optional[List[Dict[str, Any]]] = None  # Designs for each room
    
    class Config:
        from_attributes = True


@router.post("/generate-by-presets", response_model=DesignResponse)
async def generate_design_by_presets(
    request: PresetDesignRequest,
    db: Session = Depends(get_db)
):
    """
    Generate design concept using presets (property type, style, rooms)
    Generates separate design for each room type
    """
    rooms_designs = []
    
    # Generate design for each room type
    for room in request.rooms:
        # Build specific prompt for this room
        client_preferences = f"{request.design_style} style for {room.type} in {request.property_type}"
        if request.additional_preferences:
            client_preferences += f". {request.additional_preferences}"
        
        project_details = f"{room.type} - {room.area} sqm, {request.budget_range} budget"
        
        # Generate design for this specific room
        result = await design_service.generate_design_concept(
            client_preferences,
            project_details
        )
        
        if result:
            rooms_designs.append({
                "room_type": room.type,
                "quantity": room.quantity,
                "area": room.area,
                "description": result.get("description", ""),
                "image_url": result.get("image_url"),
                "style": result.get("style"),
                "color_scheme": result.get("color_scheme")
            })
    
    if not rooms_designs:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate design concepts for rooms"
        )
    
    # Create overall description
    overall_description = f"Design concept for {request.property_type} in {request.design_style} style.\n"
    
    # Build rooms description using different quotes to avoid f-string issues
    rooms_list = []
    for r in rooms_designs:
        rooms_list.append(f"{r['quantity']}x {r['room_type']}")
    overall_description += f"Rooms: {', '.join(rooms_list)}\n"
    
    total_area = sum(r['area'] * r['quantity'] for r in rooms_designs)
    overall_description += f"Total area: {total_area} sqm\n"
    overall_description += f"Budget: {request.budget_range}\n\n"
    
    for room in rooms_designs:
        room_type = room['room_type'].upper()
        room_area = room['area']
        room_desc = room['description'][:200]
        overall_description += f"\n{room_type} ({room_area} sqm):\n{room_desc}...\n"
    
    # Save main design concept to database
    db_design = DesignConcept(
        project_id=None,  # Can be linked to a project later
        description=overall_description,
        image_url=rooms_designs[0].get("image_url") if rooms_designs else None,  # First room's image
        style=request.design_style,
        color_scheme=rooms_designs[0].get("color_scheme") if rooms_designs else ""
    )
    db.add(db_design)
    db.commit()
    db.refresh(db_design)
    
    return DesignResponse(
        id=db_design.id,
        description=overall_description,
        image_url=rooms_designs[0].get("image_url") if rooms_designs else None,
        style=request.design_style,
        color_scheme=rooms_designs[0].get("color_scheme") if rooms_designs else "",
        rooms_designs=rooms_designs
    )


@router.post("/generate", response_model=DesignResponse)
async def generate_design(
    request: DesignRequest,
    db: Session = Depends(get_db)
):
    """
    Generate design concept using AI and save to database
    """
    result = await design_service.generate_design_concept(
        request.client_preferences,
        request.project_details,
        model_type="pro" if request.use_pro_for_image else "standard"
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate design concept"
        )
    
    # Save to database
    db_design = DesignConcept(
        project_id=request.project_id,
        description=result["description"],
        image_url=result.get("image_url"),
        style=result.get("style"),
        color_scheme=result.get("color_scheme")
    )
    db.add(db_design)
    db.commit()
    db.refresh(db_design)
    
    compliance_result = None
    if request.check_compliance:
        try:
            compliance_result = compliance_service.check_design_compliance({
                "project_details": request.project_details,
                "client_preferences": request.client_preferences
            })
        except Exception as e:
            print(f"Error checking compliance: {e}")

    return DesignResponse(
        id=db_design.id,
        description=db_design.description,
        image_url=db_design.image_url,
        style=db_design.style,
        color_scheme=db_design.color_scheme,
        compliance_report=compliance_result
    )


@router.post("/validate-compliance")
async def validate_compliance(request: DesignRequest):
    """
    Check design request against Dubai building codes without generating full design
    """
    try:
        compliance_result = compliance_service.check_design_compliance({
            "project_details": request.project_details,
            "client_preferences": request.client_preferences
        })
        return compliance_result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Compliance check failed: {str(e)}"
        )


@router.get("/concept/{concept_id}", response_model=DesignResponse)
async def get_design_concept(concept_id: int, db: Session = Depends(get_db)):
    """Get design concept by ID"""
    concept = db.query(DesignConcept).filter(DesignConcept.id == concept_id).first()
    if not concept:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Design concept not found"
        )
    return concept
