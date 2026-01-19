from uuid import UUID
from app.domain.dto.route_dto import CreateRouteDTO, UpdateRouteDTO
from app.domain.dto.route_filters_dto import RouteFiltersDTO
from app.domain.entity.route import Route
from app.domain.repo_interface.route_repository import RouteRepository

class RouteService:
    def __init__(self, repo: RouteRepository):
        self._repo = repo

    async def create_route(self, data: CreateRouteDTO) -> Route:
        return await self._repo.create(data)

    async def get_route(self, route_id: UUID) -> Route | None:
        return await self._repo.get(route_id)

    async def list_routes(self, filters: RouteFiltersDTO | None = None) -> list[Route]:
        return await self._repo.list(filters)

    async def update_route(self, route_id: UUID, data: UpdateRouteDTO) -> Route | None:
        return await self._repo.update(route_id, data)

    async def delete_route(self, route_id: UUID) -> bool:
        return await self._repo.delete(route_id)

    async def get_track(self, route_id: UUID) -> dict | None:
        return await self._repo.get_track(route_id)
