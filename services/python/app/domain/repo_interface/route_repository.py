from abc import ABC, abstractmethod
from uuid import UUID
from typing import Any, List

from app.domain.dto.route_dto import CreateRouteDTO, UpdateRouteDTO
from app.domain.dto.route_filters_dto import RouteFiltersDTO
from app.domain.entity.route import Route

class RouteRepository(ABC):
    @abstractmethod
    async def create(self, data: CreateRouteDTO) -> Route: ...

    @abstractmethod
    async def get(self, route_id: UUID) -> Route | None: ...

    @abstractmethod
    async def list(self, filters: RouteFiltersDTO | None = None) -> List[Route]: ...

    @abstractmethod
    async def update(self, route_id: UUID, data: UpdateRouteDTO) -> Route | None: ...

    @abstractmethod
    async def delete(self, route_id: UUID) -> bool: ...

    @abstractmethod
    async def update_gpx_and_stats(
        self,
        route_id: UUID,
        filename: str,
        gpx_content: str,
        track_geojson: dict | None,
        distance_km: float,
        elevation_gain_m: int,
        elevation_loss_m: int,
        total_time_min: int,
        min_altitude_m: int | None,
        max_altitude_m: int | None,
        start_lat: float | None = None,
        start_lng: float | None = None,
        end_lat: float | None = None,
        end_lng: float | None = None,
        is_circular: bool | None = None,
    ) -> Route | None: ...

    @abstractmethod
    async def get_track(self, route_id: UUID) -> dict | None: ...
