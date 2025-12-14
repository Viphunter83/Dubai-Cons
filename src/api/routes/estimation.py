"""
API routes for cost estimation
"""

import json
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from pydantic import BaseModel, Field

from database.connection import get_db
from database.models import Project, Estimation, DesignConcept
from services.estimation_service import estimation_service

router = APIRouter()


class EstimationResponse(BaseModel):
    id: int
    project_id: int
    total_cost: float
    materials_cost: float
    labor_cost: float
    additional_cost: float
    status: str
    
    class Config:
        from_attributes = True


class RoomPreset(BaseModel):
    type: str = Field(..., description="Room type")
    quantity: int = Field(1, ge=1, description="Number of rooms")
    area: float = Field(..., gt=0, description="Area in sqm")


class QuickEstimationRequest(BaseModel):
    property_type: str = Field(..., description="Property type")
    area: float = Field(..., gt=0, description="Total area in sqm")
    design_style: str = Field(None, description="Design style")
    rooms: List[RoomPreset] = Field(None, description="List of rooms")
    segment: str = Field("commercial", description="Client segment")
    budget_range: str = Field(None, description="Budget range")


@router.post("/calculate/{project_id}")
async def calculate_estimation(
    project_id: int,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Calculate cost estimation for a project
    """
    # Get project
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Get design concept if exists
    design_concept = db.query(DesignConcept).filter(
        DesignConcept.project_id == project_id
    ).first()
    
    # Calculate estimation
    calculation = estimation_service.calculate_estimation(project, design_concept)
    
    # Create or update estimation record
    existing_estimation = db.query(Estimation).filter(
        Estimation.project_id == project_id
    ).first()
    
    if existing_estimation:
        # Update existing
        for key, value in calculation.items():
            if hasattr(existing_estimation, key) and key != "project_id":
                setattr(existing_estimation, key, value)
        existing_estimation.breakdown = json.dumps(calculation["breakdown"])
        existing_estimation.assumptions = "\n".join(calculation["assumptions"])
        existing_estimation.valid_until = datetime.now() + timedelta(days=30)
        db.commit()
        db.refresh(existing_estimation)
        estimation = existing_estimation
    else:
        # Create new
        estimation_data = {
            "project_id": project_id,
            "materials_cost": calculation["materials_cost"],
            "labor_cost": calculation["labor_cost"],
            "additional_cost": calculation["additional_cost"],
            "total_cost": calculation["total_cost"],
            "flooring_cost": calculation["flooring_cost"],
            "wall_cost": calculation["wall_cost"],
            "ceiling_cost": calculation["ceiling_cost"],
            "electrical_cost": calculation["electrical_cost"],
            "plumbing_cost": calculation["plumbing_cost"],
            "hvac_cost": calculation["hvac_cost"],
            "furniture_cost": calculation["furniture_cost"],
            "lighting_cost": calculation["lighting_cost"],
            "decoration_cost": calculation["decoration_cost"],
            "breakdown": json.dumps(calculation["breakdown"]),
            "assumptions": "\n".join(calculation["assumptions"]),
            "valid_until": datetime.now() + timedelta(days=30),
            "status": "draft"
        }
        estimation = Estimation(**estimation_data)
        db.add(estimation)
        db.commit()
        db.refresh(estimation)
    
    return {
        "estimation_id": estimation.id,
        **calculation
    }


@router.get("/project/{project_id}")
async def get_project_estimation(
    project_id: int,
    db: Session = Depends(get_db)
):
    """Get estimation for a project"""
    estimation = db.query(Estimation).filter(
        Estimation.project_id == project_id
    ).first()
    
    if not estimation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Estimation not found for this project"
        )
    
    return {
        "id": estimation.id,
        "project_id": estimation.project_id,
        "total_cost": estimation.total_cost,
        "materials_cost": estimation.materials_cost,
        "labor_cost": estimation.labor_cost,
        "additional_cost": estimation.additional_cost,
        "breakdown": json.loads(estimation.breakdown) if estimation.breakdown else {},
        "assumptions": estimation.assumptions.split("\n") if estimation.assumptions else [],
        "status": estimation.status,
        "valid_until": estimation.valid_until.isoformat() if estimation.valid_until else None,
        "created_at": estimation.created_at.isoformat(),
        "updated_at": estimation.updated_at.isoformat() if estimation.updated_at else None,
    }


@router.get("/{estimation_id}")
async def get_estimation(
    estimation_id: int,
    db: Session = Depends(get_db)
):
    """Get estimation by ID"""
    estimation = db.query(Estimation).filter(
        Estimation.id == estimation_id
    ).first()
    
    if not estimation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Estimation not found"
        )
    
    return estimation


@router.post("/quick-calculate")
async def quick_calculate_estimation(request: QuickEstimationRequest):
    """
    Quick estimation without creating a project
    Calculate cost estimation based on property type, area, and rooms
    """
    from database.models import Client
    
    # Calculate total area from rooms if provided
    total_area = request.area
    if request.rooms:
        rooms_area = sum(room.area * room.quantity for room in request.rooms)
        if rooms_area > 0:
            total_area = rooms_area
    
    # Create a mock project object for calculation
    class MockProject:
        def __init__(self):
            self.id = 0
            self.property_type = request.property_type
            self.area = total_area
            
            # Create mock client
            mock_client = type('MockClient', (), {
                'segment': request.segment
            })()
            self.client = mock_client
    
    mock_project = MockProject()
    
    # Calculate estimation
    calculation = estimation_service.calculate_estimation(mock_project, None)
    
    return {
        "property_type": request.property_type,
        "total_area": total_area,
        "rooms_count": len(request.rooms) if request.rooms else 0,
        "segment": request.segment,
        "design_style": request.design_style,
        **calculation
    }

@router.post("/audit/{project_id}")
async def audit_estimation(
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Perform an AI Audit on the existing estimation for a project
    """
    # Get project
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Get estimation
    estimation = db.query(Estimation).filter(Estimation.project_id == project_id).first()
    if not estimation:
        raise HTTPException(status_code=404, detail="No estimation found. Calculate it first.")

    # Prepare data for service
    estimation_dict = {
        "total_cost": estimation.total_cost,
        "materials_cost": estimation.materials_cost,
        "labor_cost": estimation.labor_cost,
        "furniture_cost": estimation.furniture_cost or 0,
        "tier": "standard" # simplistic, could be stored
    }

    # Call service
    audit_result = await estimation_service.audit_estimation(project, estimation_dict)
    
    return audit_result
