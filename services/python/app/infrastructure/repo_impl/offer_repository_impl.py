from uuid import UUID
from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.dto.offer_dto import CreateOfferDTO, UpdateOfferDTO
from app.domain.dto.offer_filters_dto import OfferFiltersDTO
from app.domain.entity.offer import Offer
from app.domain.repo_interface.offer_repository import OfferRepository
from app.infrastructure.db.models import OfferModel, BusinessModel, touch_updated_at
from app.infrastructure.mapper.offer_mapper import model_to_entity

class SqlAlchemyOfferRepository(OfferRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, data: CreateOfferDTO) -> Offer:
        m = OfferModel(
            business_id=data.business_id,
            title=data.title,
            description=data.description,
            discount_type=data.discount_type,
            discount_value=data.discount_value,
            start_date=data.start_date,
            end_date=data.end_date,
            is_active=data.is_active,
            terms=data.terms,
            vac_price=data.vac_price,
            stock_quantity=data.stock_quantity,
        )
        self._session.add(m)
        await self._session.commit()
        await self._session.refresh(m)

        # business_name “comodidad”
        b = await self._session.get(BusinessModel, m.business_id)
        return model_to_entity(m, business_name=b.name if b else None)

    async def get(self, offer_id: UUID) -> Offer | None:
        stmt = (
            select(OfferModel, BusinessModel.name)
            .join(BusinessModel, BusinessModel.id == OfferModel.business_id)
            .where(OfferModel.id == offer_id)
        )
        row = (await self._session.execute(stmt)).first()
        if not row:
            return None
        offer_m, business_name = row
        return model_to_entity(offer_m, business_name=business_name)

    async def list(self, filters: OfferFiltersDTO | None = None) -> List[Offer]:
        from app.infrastructure.db.models import BusinessProfileModel
        stmt = (
            select(OfferModel, BusinessModel.name)
            .join(BusinessModel, BusinessModel.id == OfferModel.business_id)
            .outerjoin(BusinessProfileModel, BusinessModel.owner_id == BusinessProfileModel.user_id)
        )

        if filters:
            if filters.business_id:
                stmt = stmt.where(OfferModel.business_id == filters.business_id)
            if filters.is_active is not None:
                stmt = stmt.where(OfferModel.is_active == filters.is_active)
            if filters.date_from:
                stmt = stmt.where(OfferModel.end_date >= filters.date_from)
            if filters.date_to:
                stmt = stmt.where(OfferModel.start_date <= filters.date_to)
            if filters.category:
                stmt = stmt.where(BusinessModel.category == filters.category)
            if filters.region:
                stmt = stmt.where(BusinessModel.region == filters.region)
            if filters.business_status:
                from app.infrastructure.db.models import BusinessStatus
                stmt = stmt.where(BusinessProfileModel.status == BusinessStatus(filters.business_status))
            if filters.q:
                q = f"%{filters.q.lower()}%"
                stmt = stmt.where(
                    (OfferModel.title.ilike(q))
                    | (OfferModel.description.ilike(q))
                    | (BusinessModel.name.ilike(q))
                )

        stmt = stmt.order_by(OfferModel.created_at.desc())
        rows = (await self._session.execute(stmt)).all()
        return [model_to_entity(offer_m, business_name=bname) for offer_m, bname in rows]

    async def list_by_business(self, business_id: UUID) -> List[Offer]:
        stmt = (
            select(OfferModel, BusinessModel.name)
            .join(BusinessModel, BusinessModel.id == OfferModel.business_id)
            .where(OfferModel.business_id == business_id)
            .order_by(OfferModel.created_at.desc())
        )
        rows = (await self._session.execute(stmt)).all()
        return [model_to_entity(offer_m, business_name=bname) for offer_m, bname in rows]

    async def update(self, offer_id: UUID, data: UpdateOfferDTO) -> Offer | None:
        m = await self._session.get(OfferModel, offer_id)
        if not m:
            return None

        for k, v in data.__dict__.items():
            if v is not None:
                setattr(m, k, v)

        touch_updated_at(m)
        await self._session.commit()
        await self._session.refresh(m)

        b = await self._session.get(BusinessModel, m.business_id)
        return model_to_entity(m, business_name=b.name if b else None)

    async def delete(self, offer_id: UUID) -> bool:
        m = await self._session.get(OfferModel, offer_id)
        if not m:
            return False
        await self._session.delete(m)
        await self._session.commit()
        return True
