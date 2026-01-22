from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

@dataclass(frozen=True)
class AthleteProfile:
    user_id: UUID
    is_active: bool
    total_vac_points: int
    created_at: datetime
    updated_at: datetime
