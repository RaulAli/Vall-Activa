from datetime import datetime
from uuid import UUID
from pydantic import BaseModel

class BusinessResponse(BaseModel):
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
    logo_url: str | None
    status: str | None
    created_at: datetime
    updated_at: datetime
