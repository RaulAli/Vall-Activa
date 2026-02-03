from dataclasses import dataclass
from uuid import UUID

@dataclass(frozen=True)
class CreateBusinessDTO:
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
    logo_url: str | None = None

@dataclass(frozen=True)
class UpdateBusinessDTO:
    name: str | None = None
    description: str | None = None
    category: str | None = None
    region: str | None = None
    city: str | None = None
    address: str | None = None
    phone: str | None = None
    website: str | None = None
    instagram: str | None = None
    logo_url: str | None = None
