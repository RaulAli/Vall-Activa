from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

@dataclass(frozen=True)
class TicketDTO:
    id: UUID
    user_id: UUID
    offer_id: UUID
    validation_code: str
    status: str
    created_at: datetime
    offer_title: str | None = None
    business_name: str | None = None
