from pydantic import BaseModel

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str

from uuid import UUID

class UserResponse(BaseModel):
    id: UUID
    email: str
    role: str
