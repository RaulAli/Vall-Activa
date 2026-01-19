from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.db.models import UserModel
from app.domain.entity.user import User
from app.domain.repo_interface.user_repository import UserRepository

def model_to_entity(m: UserModel) -> User:
    return User(
        id=m.id,
        email=m.email,
        role=m.role.value if hasattr(m.role, "value") else str(m.role),
        is_active=m.is_active,
    )

class SqlAlchemyUserRepository(UserRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def get_by_email(self, email: str) -> User | None:
        q = select(UserModel).where(UserModel.email == email)
        res = await self._session.execute(q)
        m = res.scalar_one_or_none()
        return model_to_entity(m) if m else None

    async def get(self, user_id: UUID) -> User | None:
        m = await self._session.get(UserModel, user_id)
        return model_to_entity(m) if m else None

    async def create(self, email: str, password_hash: str, role: str) -> User:
        m = UserModel(email=email, password_hash=password_hash, role=role)
        self._session.add(m)
        await self._session.commit()
        await self._session.refresh(m)
        return model_to_entity(m)
    