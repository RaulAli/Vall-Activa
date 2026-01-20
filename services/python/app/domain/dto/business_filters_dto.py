from dataclasses import dataclass
from uuid import UUID

@dataclass(frozen=True)
class BusinessFiltersDTO:
    owner_id: UUID | None = None
    q: str | None = None
    category: str | None = None
    region: str | None = None
    city: str | None = None
