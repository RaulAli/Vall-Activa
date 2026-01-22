from pydantic import BaseModel
from uuid import UUID

class AthleteProfileResponse(BaseModel):
    user_id: UUID
    total_vac_points: int
    is_active: bool
