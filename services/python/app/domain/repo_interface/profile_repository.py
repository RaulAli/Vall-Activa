from abc import ABC, abstractmethod
from uuid import UUID
from app.domain.entity.business_profile import BusinessProfile

class ProfileRepository(ABC):
    @abstractmethod
    async def create_athlete_profile(self, user_id: UUID) -> None: ...

    @abstractmethod
    async def create_admin_profile(self, user_id: UUID) -> None: ...

    @abstractmethod
    async def create_business_profile_pending(self, user_id: UUID) -> BusinessProfile: ...

    @abstractmethod
    async def set_business_status(self, user_id: UUID, status: str) -> BusinessProfile | None: ...

    @abstractmethod
    async def get_business_profile(self, user_id: UUID) -> BusinessProfile | None: ...
