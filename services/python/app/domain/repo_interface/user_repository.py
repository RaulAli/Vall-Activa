from abc import ABC, abstractmethod
from uuid import UUID
from app.domain.entity.user import User

class UserRepository(ABC):
    @abstractmethod
    async def get_by_email(self, email: str) -> User | None: ...

    @abstractmethod
    async def get(self, user_id: UUID) -> User | None: ...

    @abstractmethod
    async def create(self, email: str, password_hash: str, role: str) -> User: ...
