from uuid import UUID
from app.domain.dto.business_dto import CreateBusinessDTO, UpdateBusinessDTO
from app.domain.dto.business_filters_dto import BusinessFiltersDTO
from app.domain.entity.business import Business
from app.domain.repo_interface.business_repository import BusinessRepository

class BusinessService:
    def __init__(self, repo: BusinessRepository):
        self._repo = repo

    async def create_business(self, data: CreateBusinessDTO) -> Business:
        return await self._repo.create(data)

    async def get_business(self, business_id: UUID) -> Business | None:
        return await self._repo.get(business_id)

    async def list_businesses(self, filters: BusinessFiltersDTO | None = None) -> list[Business]:
        return await self._repo.list(filters)

    async def update_business(self, business_id: UUID, data: UpdateBusinessDTO) -> Business | None:
        return await self._repo.update(business_id, data)

    async def delete_business(self, business_id: UUID) -> bool:
        return await self._repo.delete(business_id)
