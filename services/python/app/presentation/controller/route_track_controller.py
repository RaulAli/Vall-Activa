from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status

from app.application.service.route_service import RouteService
from app.infrastructure.container import get_route_service

router = APIRouter(prefix="/routes", tags=["routes-track"])

@router.get("/{route_id}/track", status_code=status.HTTP_200_OK)
async def get_route_track(
    route_id: UUID,
    service: RouteService = Depends(get_route_service),
):
    track = await service.get_track(route_id)
    if track is None:
        raise HTTPException(status_code=404, detail="Route not found")
    if not track:
        # existe ruta pero no hay track
        raise HTTPException(status_code=404, detail="Track not found")
    return track
