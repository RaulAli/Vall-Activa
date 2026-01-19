from dataclasses import dataclass

@dataclass(frozen=True)
class CreateBusinessDTO:
    name: str
    description: str | None
    category: str
    region: str
    city: str | None
    phone: str | None
    website: str | None
    instagram: str | None

@dataclass(frozen=True)
class UpdateBusinessDTO:
    name: str | None = None
    description: str | None = None
    category: str | None = None
    region: str | None = None
    city: str | None = None
    phone: str | None = None
    website: str | None = None
    instagram: str | None = None
