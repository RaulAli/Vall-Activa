from abc import ABC, abstractmethod
from uuid import UUID
from typing import List

from app.domain.dto.offer_dto import CreateOfferDTO, UpdateOfferDTO
from app.domain.dto.offer_filters_dto import OfferFiltersDTO
from app.domain.entity.offer import Offer

class OfferRepository(ABC):
    @abstractmethod
    async def create(self, data: CreateOfferDTO) -> Offer: ...

    @abstractmethod
    async def get(self, offer_id: UUID) -> Offer | None: ...

    @abstractmethod
    async def list(self, filters: OfferFiltersDTO | None = None) -> List[Offer]: ...

    @abstractmethod
    async def list_by_business(self, business_id: UUID) -> List[Offer]: ...

    @abstractmethod
    async def update(self, offer_id: UUID, data: UpdateOfferDTO) -> Offer | None: ...

    @abstractmethod
    async def delete(self, offer_id: UUID) -> bool: ...

    @abstractmethod
    async def purchase(self, user_id: UUID, offer_id: UUID) -> str: ... # Returns validation_code

    @abstractmethod
    async def list_tickets(self, user_id: UUID) -> List[dict]: ...
