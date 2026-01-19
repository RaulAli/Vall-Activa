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
    async def get_track(self, route_id: UUID) -> dict | None: ...
