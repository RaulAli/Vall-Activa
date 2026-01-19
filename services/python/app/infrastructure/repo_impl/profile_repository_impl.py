from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.infrastructure.db.models import (
    AthleteProfileModel,
    AdminProfileModel,
    BusinessProfileModel,
    BusinessStatus,
)

from app.domain.entity.business_profile import BusinessProfile
from app.domain.repo_interface.profile_repository import ProfileRepository

def business_model_to_entity(m: BusinessProfileModel) -> BusinessProfile:
    return BusinessProfile(
        user_id=m.user_id,
        status=m.status.value if hasattr(m.status, "value") else str(m.status),
        is_active=m.is_active,
    )

class SqlAlchemyProfileRepository(ProfileRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create_athlete_profile(self, user_id: UUID) -> None:
        self._session.add(AthleteProfileModel(user_id=user_id))
        await self._session.commit()

    async def create_admin_profile(self, user_id: UUID) -> None:
        self._session.add(AdminProfileModel(user_id=user_id))
        await self._session.commit()

    async def create_business_profile_pending(self, user_id: UUID) -> BusinessProfile:
        m = BusinessProfileModel(user_id=user_id, status=BusinessStatus.PENDING)
        self._session.add(m)
        await self._session.commit()
        await self._session.refresh(m)
        return business_model_to_entity(m)

    async def set_business_status(self, user_id: UUID, status: str) -> BusinessProfile | None:
        m = await self._session.get(BusinessProfileModel, user_id)
        if not m:
            return None
        # status llega como "APPROVED"/"REJECTED"
        m.status = BusinessStatus(status)
        await self._session.commit()
        await self._session.refresh(m)
        return business_model_to_entity(m)

    async def get_business_profile(self, user_id: UUID) -> BusinessProfile | None:
        m = await self._session.get(BusinessProfileModel, user_id)
        return business_model_to_entity(m) if m else None
