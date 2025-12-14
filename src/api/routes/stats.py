"""
API routes for statistics and analytics
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Dict, Any
from database.connection import get_db
from database.models import Project, Client, DesignConcept

router = APIRouter()


class StatsResponse(BaseModel):
    total_projects: int
    total_clients: int
    total_designs: int
    active_projects: int
    completed_projects: int
    average_budget: float
    projects_by_status: Dict[str, int]
    clients_by_segment: Dict[str, int]


@router.get("/overview", response_model=StatsResponse)
async def get_stats(db: Session = Depends(get_db)):
    """Get overall statistics"""
    
    total_projects = db.query(Project).count()
    total_clients = db.query(Client).count()
    total_designs = db.query(DesignConcept).count()
    
    active_projects = db.query(Project).filter(Project.status == "active").count()
    completed_projects = db.query(Project).filter(Project.status == "completed").count()
    
    # Average budget
    avg_budget_result = db.query(func.avg(Project.budget)).scalar()
    average_budget = float(avg_budget_result) if avg_budget_result else 0.0
    
    # Projects by status
    projects_by_status = db.query(
        Project.status, func.count(Project.id)
    ).group_by(Project.status).all()
    projects_status_dict = {status: count for status, count in projects_by_status}
    
    # Clients by segment
    clients_by_segment_result = db.query(
        Client.segment, func.count(Client.id)
    ).group_by(Client.segment).all()
    clients_segment_dict = {segment: count for segment, count in clients_by_segment_result if segment}
    
    return StatsResponse(
        total_projects=total_projects,
        total_clients=total_clients,
        total_designs=total_designs,
        active_projects=active_projects,
        completed_projects=completed_projects,
        average_budget=average_budget,
        projects_by_status=projects_status_dict,
        clients_by_segment=clients_segment_dict
    )


@router.get("/recent-projects")
async def get_recent_projects(limit: int = 5, db: Session = Depends(get_db)):
    """Get recent projects"""
    from database.models import Project
    
    projects = db.query(Project).order_by(Project.created_at.desc()).limit(limit).all()
    return projects


@router.get("/recent-designs")
async def get_recent_designs(limit: int = 5, db: Session = Depends(get_db)):
    """Get recent design concepts"""
    designs = db.query(DesignConcept).order_by(DesignConcept.created_at.desc()).limit(limit).all()
    return designs

