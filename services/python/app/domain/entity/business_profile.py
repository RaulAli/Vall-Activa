from dataclasses import dataclass
from uuid import UUID

@dataclass(frozen=True)
class BusinessProfile:
    user_id: UUID
    status: str
    is_active: bool
