from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

@dataclass(frozen=True)
class Task:
    id: UUID
    title: str
    description: str | None
    done: bool
    created_at: datetime
    updated_at: datetime
