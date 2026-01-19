from datetime import datetime
from uuid import UUID
from pydantic import BaseModel

class TaskResponse(BaseModel):
    id: UUID
    title: str
    description: str | None
    done: bool
    created_at: datetime
    updated_at: datetime
