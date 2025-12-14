"""
API routes for projects management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field, validator

from database.connection import get_db
from database.models import Project, Client, User

router = APIRouter()


# Request/Response models
class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, description="Project name")
    description: Optional[str] = Field(None, description="Project description")
    client_id: Optional[int] = Field(None, gt=0, description="Client ID")
    property_type: Optional[str] = Field(None, max_length=50, description="Type of property")
    area: Optional[float] = Field(None, gt=0, description="Area in square meters")
    location: Optional[str] = Field(None, max_length=200, description="Project location")
    budget: Optional[float] = Field(None, ge=0, description="Project budget")
    
    @validator('name')
    def validate_title(cls, v):
        if not v or not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()
    
    @validator('area')
    def validate_area(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Area must be greater than 0')
        return v


class ProjectResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    client_id: Optional[int] = None
    property_type: Optional[str] = None
    area: Optional[float] = None
    location: Optional[str] = None
    status: Optional[str] = None
    budget: Optional[float] = None
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[ProjectResponse])
async def get_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all projects"""
    projects = db.query(Project).offset(skip).limit(limit).all()
    return projects


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get project by ID"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    # Create project
    project_data = project.model_dump()
    # Map 'name' from Pydantic to 'title' in DB Model
    if 'name' in project_data:
        project_data['title'] = project_data.pop('name')
        
    db_project = Project(**project_data)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    """Update project"""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    for field, value in project.dict().items():
        setattr(db_project, field, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: int, db: Session = Depends(get_db)):
    """Delete project"""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    db.delete(db_project)
    db.commit()
    return None
