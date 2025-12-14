from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import Project, DesignConcept, Estimation
from services.report_service import report_service

router = APIRouter()

@router.get("/project/{project_id}/master")
async def generate_project_master_report(
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Generate and download a Master PDF Report for the project
    """
    # 1. Fetch Project
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # 2. Fetch Design (Latest)
    design = db.query(DesignConcept).filter(
        DesignConcept.project_id == project_id
    ).order_by(DesignConcept.created_at.desc()).first()

    # 3. Fetch Estimation
    estimation = db.query(Estimation).filter(
        Estimation.project_id == project_id
    ).first()

    try:
        pdf_bytes = report_service.generate_master_report(project, design, estimation)
        
        filename = f"MasterReport_{project.title.replace(' ', '_')}.pdf"
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except Exception as e:
        print(f"Error generating PDF: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate PDF report")
