from dataclasses import dataclass
from datetime import datetime
from uuid import UUID
from enum import Enum

class TicketStatus(str, Enum):
    ACTIVE = "ACTIVE"
    USED = "USED"
    EXPIRED = "EXPIRED"

@dataclass
class Ticket:
    id: UUID
    user_id: UUID
    offer_id: UUID
    validation_code: str
    status: TicketStatus
    created_at: datetime
    updated_at: datetime
    redeemed_at: datetime | None = None
    
    # Comodidad para el listado
    offer_title: str | None = None
    business_name: str | None = None
