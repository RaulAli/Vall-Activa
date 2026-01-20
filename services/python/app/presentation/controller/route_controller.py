from uuid import UUID
import datetime as dt
from fastapi import Query
from fastapi import APIRouter, Depends, HTTPException, status

from app.application.service.route_service import RouteService
from app.domain.dto.route_dto import CreateRouteDTO, UpdateRouteDTO
from app.presentation.requests.route_requests import CreateRouteRequest, UpdateRouteRequest
from app.presentation.responses.route_responses import RouteResponse
from app.infrastructure.container import get_route_service, get_actor_dep
from app.domain.dto.route_filters_dto import RouteFiltersDTO

router = APIRouter(prefix="/routes", tags=["routes"])

@router.post("", response_model=RouteResponse, status_code=status.HTTP_201_CREATED)
async def create_route(
    body: CreateRouteRequest, 
    service: RouteService = Depends(get_route_service),
    actor = Depends(get_actor_dep)
):
    r = await service.create_route(CreateRouteDTO(user_id=actor.user_id, **body.model_dump()))
    return RouteResponse(**r.__dict__)

@router.get("", response_model=list[RouteResponse])
async def list_routes(
    service: RouteService = Depends(get_route_service),

    distance_km_min: float | None = Query(default=None, ge=0),
    user_id: UUID | None = Query(default=None),
    distance_km_max: float | None = Query(default=None, ge=0),

    elevation_gain_m_min: int | None = Query(default=None, ge=0),
    elevation_gain_m_max: int | None = Query(default=None, ge=0),

    total_time_min_min: int | None = Query(default=None, ge=0),
    total_time_min_max: int | None = Query(default=None, ge=0),

    difficulty_min: int | None = Query(default=None, ge=1, le=5),
    difficulty_max: int | None = Query(default=None, ge=1, le=5),

    date_from: dt.date | None = None,
    date_to: dt.date | None = None,

    region: str | None = None,

    sort_by: str = Query(default="date", pattern="^(date|distance|elevation|difficulty)$"),
    sort_dir: str = Query(default="desc", pattern="^(asc|desc)$"),
):
    filters = RouteFiltersDTO(
        user_id=user_id,
        distance_km_min=distance_km_min,
        distance_km_max=distance_km_max,
        elevation_gain_m_min=elevation_gain_m_min,
        elevation_gain_m_max=elevation_gain_m_max,
        total_time_min_min=total_time_min_min,
        total_time_min_max=total_time_min_max,
        difficulty_min=difficulty_min,
        difficulty_max=difficulty_max,
        date_from=date_from,
        date_to=date_to,
        region=region,
        sort_by=sort_by,
        sort_dir=sort_dir,
    )

    items = await service.list_routes(filters)
    return [RouteResponse(**x.__dict__) for x in items]

@router.get("/{route_id}", response_model=RouteResponse)
async def get_route(route_id: UUID, service: RouteService = Depends(get_route_service)):
    r = await service.get_route(route_id)
    if not r:
        raise HTTPException(status_code=404, detail="Route not found")
    return RouteResponse(**r.__dict__)

@router.put("/{route_id}", response_model=RouteResponse)
async def update_route(route_id: UUID, body: UpdateRouteRequest, service: RouteService = Depends(get_route_service)):
    r = await service.update_route(route_id, UpdateRouteDTO(**body.model_dump()))
    if not r:
        raise HTTPException(status_code=404, detail="Route not found")
    return RouteResponse(**r.__dict__)

@router.delete("/{route_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_route(route_id: UUID, service: RouteService = Depends(get_route_service)):
    ok = await service.delete_route(route_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Route not found")
    return None
