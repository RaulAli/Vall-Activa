from uuid import UUID
from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.dto.business_dto import CreateBusinessDTO, UpdateBusinessDTO
from app.domain.dto.business_filters_dto import BusinessFiltersDTO
from app.domain.entity.business import Business
from app.domain.repo_interface.business_repository import BusinessRepository
from app.infrastructure.db.models import BusinessModel, BusinessProfileModel, BusinessStatus, touch_updated_at
from app.infrastructure.mapper.business_mapper import model_to_entity

class SqlAlchemyBusinessRepository(BusinessRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, data: CreateBusinessDTO) -> Business:
        m = BusinessModel(
            owner_id=data.owner_id,
            name=data.name,
            description=data.description,
            category=data.category,
            region=data.region,
            city=data.city,
            address=data.address,
            phone=data.phone,
            website=data.website,
            instagram=data.instagram,
        )
        self._session.add(m)
        await self._session.commit()
        await self._session.refresh(m)
        return await self.get(m.id) # Re-fetch to get status

    async def get(self, business_id: UUID) -> Business | None:
        stmt = (
            select(BusinessModel, BusinessProfileModel.status)
            .outerjoin(BusinessProfileModel, BusinessModel.owner_id == BusinessProfileModel.user_id)
            .where(BusinessModel.id == business_id)
        )
        res = await self._session.execute(stmt)
        row = res.first()
        if not row:
            return None
        
        m, status = row
        entity = model_to_entity(m)
        entity.status = status.value if status and hasattr(status, "value") else str(status) if status else None
        return entity

    async def list(self, filters: BusinessFiltersDTO | None = None) -> List[Business]:
        stmt = (
            select(BusinessModel, BusinessProfileModel.status)
            .outerjoin(BusinessProfileModel, BusinessModel.owner_id == BusinessProfileModel.user_id)
        )

        if filters:
            if filters.owner_id is not None:
                stmt = stmt.where(BusinessModel.owner_id == filters.owner_id)
            if filters.category:
                stmt = stmt.where(BusinessModel.category == filters.category)
            if filters.region:
                stmt = stmt.where(BusinessModel.region == filters.region)
            if filters.city:
                stmt = stmt.where(BusinessModel.city == filters.city)
            if filters.status:
                stmt = stmt.where(BusinessProfileModel.status == BusinessStatus(filters.status))
            if filters.q:
                q = f"%{filters.q.lower()}%"
                stmt = stmt.where(
                    (BusinessModel.name.ilike(q)) | (BusinessModel.description.ilike(q))
                )

        stmt = stmt.order_by(BusinessModel.created_at.desc())
        rows = (await self._session.execute(stmt)).all()
        
        results = []
        for m, status in rows:
            entity = model_to_entity(m)
            entity.status = status.value if status and hasattr(status, "value") else str(status) if status else None
            results.append(entity)
        return results

    async def update(self, business_id: UUID, data: UpdateBusinessDTO) -> Business | None:
        m = await self._session.get(BusinessModel, business_id)
        if not m:
            return None

        for k, v in data.__dict__.items():
            if v is not None:
                setattr(m, k, v)

        touch_updated_at(m)
        await self._session.commit()
        await self._session.refresh(m)
        return model_to_entity(m)

    async def delete(self, business_id: UUID) -> bool:
        m = await self._session.get(BusinessModel, business_id)
        if not m:
            return False
        await self._session.delete(m)
        await self._session.commit()
        return True
