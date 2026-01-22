from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
import os
from jose import jwt, JWTError
from uuid import UUID

from app.application.service.task_service import TaskService
from app.infrastructure.db.database import get_session
from app.infrastructure.repo_impl.task_repository_impl import SqlAlchemyTaskRepository
from app.application.service.route_service import RouteService
from app.infrastructure.repo_impl.route_repository_impl import SqlAlchemyRouteRepository
from app.application.service.route_gpx_service import RouteGpxService
from app.application.service.business_service import BusinessService
from app.infrastructure.repo_impl.business_repository_impl import SqlAlchemyBusinessRepository
from app.application.service.offer_service import OfferService
from app.infrastructure.repo_impl.offer_repository_impl import SqlAlchemyOfferRepository

from app.infrastructure.repo_impl.user_repository_impl import SqlAlchemyUserRepository
from app.infrastructure.repo_impl.profile_repository_impl import SqlAlchemyProfileRepository
from app.application.service.auth_service import AuthService
from app.application.service.admin_service import AdminService
from app.application.service.athlete_service import AthleteService

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret")

class Actor:
    def __init__(self, user_id: UUID, role: str, email: str):
        self.user_id = user_id
        self.role = role
        self.email = email

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
security = HTTPBearer(auto_error=False)

from fastapi import Depends, HTTPException, status

async def get_actor_dep(
    creds: HTTPAuthorizationCredentials = Depends(security),
) -> Actor:
    if not creds:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=["HS256"])
        return Actor(UUID(payload["sub"]), payload["role"], payload.get("email", ""))
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

async def get_optional_actor_dep(
    creds: HTTPAuthorizationCredentials = Depends(security),
) -> Actor | None:
    if not creds:
        return None
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=["HS256"])
        return Actor(UUID(payload["sub"]), payload["role"], payload.get("email", ""))
    except:
        return None

def get_auth_service(session: AsyncSession = Depends(get_session)) -> AuthService:
    users = SqlAlchemyUserRepository(session)
    profiles = SqlAlchemyProfileRepository(session)
    businesses = SqlAlchemyBusinessRepository(session)
    return AuthService(users, profiles, businesses, jwt_secret=JWT_SECRET, jwt_exp_minutes=60)

def get_admin_service(session: AsyncSession = Depends(get_session)) -> AdminService:
    profiles = SqlAlchemyProfileRepository(session)
    return AdminService(profiles)

# Login helper (rápido): obtener password_hash
from sqlalchemy import select
from app.infrastructure.db.models import UserModel

def get_password_hash_by_email_factory(session: AsyncSession = Depends(get_session)):
    async def get_password_hash_by_email(email: str) -> str:
        res = await session.execute(select(UserModel.password_hash).where(UserModel.email == email))
        hashed = res.scalar_one_or_none()
        if not hashed:
            raise ValueError("Invalid credentials")
        return hashed
    return get_password_hash_by_email

    ####################################################

def get_task_service(session: AsyncSession = Depends(get_session)) -> TaskService:
    repo = SqlAlchemyTaskRepository(session)
    return TaskService(repo)

def get_route_service(session: AsyncSession = Depends(get_session)) -> RouteService:
    repo = SqlAlchemyRouteRepository(session)
    return RouteService(repo)

def get_route_gpx_service(session: AsyncSession = Depends(get_session)) -> RouteGpxService:
    repo = SqlAlchemyRouteRepository(session)
    return RouteGpxService(repo)

def get_business_service(session: AsyncSession = Depends(get_session)) -> BusinessService:
    repo = SqlAlchemyBusinessRepository(session)
    return BusinessService(repo)

def get_offer_service(session: AsyncSession = Depends(get_session)) -> OfferService:
    repo = SqlAlchemyOfferRepository(session)
    return OfferService(repo)

def get_athlete_service(session: AsyncSession = Depends(get_session)) -> AthleteService:
    repo = SqlAlchemyProfileRepository(session)
    return AthleteService(repo)
