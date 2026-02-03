from uuid import UUID
from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.dto.offer_dto import CreateOfferDTO, UpdateOfferDTO
from app.domain.dto.offer_filters_dto import OfferFiltersDTO
from app.domain.entity.offer import Offer
from app.domain.repo_interface.offer_repository import OfferRepository
from app.infrastructure.db.models import OfferModel, BusinessModel, touch_updated_at, TicketModel, TicketStatus, AthleteProfileModel
from app.infrastructure.mapper.offer_mapper import model_to_entity
import random
import string

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
            image_url=data.image_url,
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

    async def purchase(self, user_id: UUID, offer_id: UUID) -> str:
        # 1. Get athlete profile
        profile = await self._session.get(AthleteProfileModel, user_id)
        if not profile:
            raise ValueError("Perfil de atleta no encontrado")

        # 2. Get offer
        offer = await self._session.get(OfferModel, offer_id)
        if not offer:
            raise ValueError("Oferta no encontrada")

        # 3. Validations
        if not offer.is_active:
            raise ValueError("La oferta no está activa")
        if offer.stock_quantity <= 0:
            raise ValueError("No queda stock para esta oferta")
        if profile.total_vac_points < offer.vac_price:
            raise ValueError(f"Puntos insuficientes. Necesitas {offer.vac_price} VAC")

        # 4. Atomic updates
        profile.total_vac_points -= offer.vac_price
        offer.stock_quantity -= 1
        
        # 5. Generate validation code
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        
        # 6. Create ticket
        ticket = TicketModel(
            user_id=user_id,
            offer_id=offer_id,
            validation_code=code,
            status=TicketStatus.ACTIVE
        )
        self._session.add(ticket)
        
        await self._session.commit()
        return code

    async def list_tickets(self, user_id: UUID) -> List[dict]:
        stmt = (
            select(TicketModel, OfferModel.title, BusinessModel.name)
            .join(OfferModel, OfferModel.id == TicketModel.offer_id)
            .join(BusinessModel, BusinessModel.id == OfferModel.business_id)
            .where(TicketModel.user_id == user_id)
            .order_by(TicketModel.created_at.desc())
        )
        rows = (await self._session.execute(stmt)).all()
        
        res = []
        for t_m, o_title, b_name in rows:
            res.append({
                "id": str(t_m.id),
                "offer_id": str(t_m.offer_id),
                "offer_title": o_title,
                "business_name": b_name,
                "validation_code": t_m.validation_code,
                "status": t_m.status,
                "created_at": t_m.created_at.isoformat()
            })
        return res
