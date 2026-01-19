from dataclasses import dataclass
from uuid import UUID

@dataclass(frozen=True)
class User:
    id: UUID
    email: str
    role: str
    is_active: bool
