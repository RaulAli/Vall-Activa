from uuid import UUID
from app.domain.dto.offer_dto import CreateOfferDTO, UpdateOfferDTO
from app.domain.dto.offer_filters_dto import OfferFiltersDTO
from app.domain.entity.offer import Offer
from app.domain.repo_interface.offer_repository import OfferRepository

class OfferService:
    def __init__(self, repo: OfferRepository):
        self._repo = repo

    async def create_offer(self, data: CreateOfferDTO) -> Offer:
        return await self._repo.create(data)

    async def get_offer(self, offer_id: UUID) -> Offer | None:
        return await self._repo.get(offer_id)

    async def list_offers(self, filters: OfferFiltersDTO | None = None) -> list[Offer]:
        return await self._repo.list(filters)

    async def list_business_offers(self, business_id: UUID) -> list[Offer]:
        return await self._repo.list_by_business(business_id)

    async def update_offer(self, offer_id: UUID, data: UpdateOfferDTO) -> Offer | None:
        return await self._repo.update(offer_id, data)

    async def delete_offer(self, offer_id: UUID) -> bool:
        return await self._repo.delete(offer_id)
