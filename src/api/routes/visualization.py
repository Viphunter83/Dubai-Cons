"""
API routes for 3D visualization
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any
from services.visualization_service import visualization_service

router = APIRouter()


class SceneRequest(BaseModel):
    room_type: str  # living, bedroom, kitchen, etc.
    dimensions: Dict[str, float]  # width, depth, height
    design_elements: Dict[str, Any]


class SceneResponse(BaseModel):
    scene_id: str
    room_type: str
    dimensions: Dict[str, float]
    objects_count: int
    scene_data: Dict[str, Any]


@router.post("/create-scene", response_model=SceneResponse)
async def create_3d_scene(request: SceneRequest):
    """
    Create a 3D scene based on design requirements
    """
    try:
        scene = await visualization_service.create_3d_scene(
            request.room_type,
            request.dimensions,
            request.design_elements
        )
        
        if not scene:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create 3D scene"
            )
        
        return SceneResponse(
            scene_id=f"scene_{request.room_type}_{id(scene)}",
            room_type=scene["room_type"],
            dimensions=scene["dimensions"],
            objects_count=len(scene["objects"]),
            scene_data=scene
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating scene: {str(e)}"
        )


@router.post("/export-gltf")
async def export_to_gltf(request: SceneRequest):
    """
    Export 3D scene to GLTF format
    """
    try:
        scene = await visualization_service.create_3d_scene(
            request.room_type,
            request.dimensions,
            request.design_elements
        )
        
        if not scene:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create 3D scene"
            )
        
        gltf_json = await visualization_service.export_to_gltf(scene)
        
        return {
            "format": "gltf",
            "data": gltf_json
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error exporting scene: {str(e)}"
        )
