from dataclasses import dataclass
from datetime import date
from uuid import UUID

@dataclass(frozen=True)
class OfferFiltersDTO:
    q: str | None = None
    business_id: UUID | None = None
    is_active: bool | None = None
    date_from: date | None = None
    date_to: date | None = None

    # filtros “dashboard” (via join con business)
    category: str | None = None
    region: str | None = None
    business_status: str | None = None
