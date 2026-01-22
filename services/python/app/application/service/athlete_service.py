from uuid import UUID
from app.domain.repo_interface.profile_repository import ProfileRepository
from app.domain.entity.athlete_profile import AthleteProfile

class AthleteService:
    def __init__(self, profile_repo: ProfileRepository):
        self._profile_repo = profile_repo

    async def get_profile(self, user_id: UUID) -> AthleteProfile:
        """Get athlete profile with total VAC points."""
        profile = await self._profile_repo.get_athlete_profile(user_id)
        if not profile:
            raise ValueError("Athlete profile not found")
        return profile
