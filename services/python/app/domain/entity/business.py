from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

@dataclass
class Business:
    id: UUID
    owner_id: UUID
    name: str
    description: str | None
    category: str
    region: str
    city: str | None
    address: str | None
    phone: str | None
    website: str | None
    instagram: str | None
    status: str | None
    created_at: datetime
    updated_at: datetime
