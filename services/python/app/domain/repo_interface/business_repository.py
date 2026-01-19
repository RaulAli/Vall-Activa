from abc import ABC, abstractmethod
from uuid import UUID
from typing import List

from app.domain.dto.business_dto import CreateBusinessDTO, UpdateBusinessDTO
from app.domain.dto.business_filters_dto import BusinessFiltersDTO
from app.domain.entity.business import Business

class BusinessRepository(ABC):
    @abstractmethod
    async def create(self, data: CreateBusinessDTO) -> Business: ...

    @abstractmethod
    async def get(self, business_id: UUID) -> Business | None: ...

    @abstractmethod
    async def list(self, filters: BusinessFiltersDTO | None = None) -> List[Business]: ...

    @abstractmethod
    async def update(self, business_id: UUID, data: UpdateBusinessDTO) -> Business | None: ...

    @abstractmethod
    async def delete(self, business_id: UUID) -> bool: ...
