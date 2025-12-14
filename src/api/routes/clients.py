"""
API routes for clients management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field, validator

from database.connection import get_db
from database.models import Client

router = APIRouter()


# Request/Response models
class ClientCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, description="Client name")
    email: Optional[str] = Field(None, max_length=200, pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$', description="Email address")
    phone: Optional[str] = Field(None, max_length=50, description="Phone number")
    company: Optional[str] = Field(None, max_length=200, description="Company name")
    segment: Optional[str] = Field(None, max_length=50, description="Client segment")
    preferences: Optional[str] = Field(None, max_length=1000, description="Client preferences")
    budget_range: Optional[str] = Field(None, max_length=100, description="Budget range")
    
    @validator('name')
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()


class ClientResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    segment: Optional[str] = None
    preferences: Optional[str] = None
    budget_range: Optional[str] = None
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[ClientResponse])
async def get_clients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all clients"""
    clients = db.query(Client).offset(skip).limit(limit).all()
    return clients


@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(client_id: int, db: Session = Depends(get_db)):
    """Get client by ID"""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    return client


@router.post("/", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
async def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    """Create a new client"""
    db_client = Client(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


@router.put("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: int,
    client: ClientCreate,
    db: Session = Depends(get_db)
):
    """Update client"""
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    for field, value in client.dict().items():
        setattr(db_client, field, value)
    
    db.commit()
    db.refresh(db_client)
    return db_client


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(client_id: int, db: Session = Depends(get_db)):
    """Delete client"""
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    db.delete(db_client)
    db.commit()
    return None
