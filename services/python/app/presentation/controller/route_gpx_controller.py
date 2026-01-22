from uuid import UUID
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.application.service.route_gpx_service import RouteGpxService
from app.infrastructure.container import get_route_gpx_service
from app.presentation.responses.route_responses import RouteResponse

router = APIRouter(prefix="/routes", tags=["routes-gpx"])

@router.post("/{route_id}/gpx", response_model=RouteResponse, status_code=status.HTTP_200_OK)
async def upload_gpx(
    route_id: UUID,
    file: UploadFile = File(...),
    service: RouteGpxService = Depends(get_route_gpx_service)
):
    if not file.filename.lower().endswith(".gpx"):
        raise HTTPException(status_code=400, detail="Only .gpx files are allowed")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    updated = await service.attach_gpx(route_id, filename=file.filename, gpx_bytes=content)
    if not updated:
        raise HTTPException(status_code=404, detail="Route not found")

    return RouteResponse(**updated.__dict__)
@router.post("/gpx/parse", status_code=status.HTTP_200_OK)
async def parse_gpx(
    file: UploadFile = File(...),
    service: RouteGpxService = Depends(get_route_gpx_service)
):
    if not file.filename.lower().endswith(".gpx"):
        raise HTTPException(status_code=400, detail="Only .gpx files are allowed")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    result = await service.parse_gpx(content)
    # Remove large text content for preview response
    result.pop("gpx_text", None)
    return result
