from uuid import UUID
from app.domain.repo_interface.profile_repository import ProfileRepository

class AdminService:
    def __init__(self, profiles: ProfileRepository):
        self._profiles = profiles

    async def approve_business(self, user_id: UUID):
        return await self._profiles.set_business_status(user_id, "APPROVED")

    async def reject_business(self, user_id: UUID):
        return await self._profiles.set_business_status(user_id, "REJECTED")
