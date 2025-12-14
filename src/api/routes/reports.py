from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
from services.report_service import report_service
from datetime import datetime

router = APIRouter()

class ReportRequest(BaseModel):
    project_details: Optional[Dict[str, Any]] = {}
    design_result: Dict[str, Any]

@router.post("/generate", response_class=StreamingResponse)
async def generate_report(request: ReportRequest):
    """
    Generate a PDF report for the given design
    """
    try:
        pdf_buffer = report_service.generate_project_report(
            project_data=request.project_details,
            design_result=request.design_result
        )
        
        filename = f"DubaiCons_Report_{datetime.now().strftime('%Y%m%d_%H%M')}.pdf"
        
        return StreamingResponse(
            pdf_buffer, 
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
