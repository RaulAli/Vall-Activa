from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt
from uuid import UUID

from app.domain.dto.auth_dto import RegisterAthleteDTO, RegisterBusinessDTO, RegisterAdminDTO, LoginDTO, BusinessDataDTO
from app.domain.dto.business_dto import CreateBusinessDTO
from app.domain.repo_interface.user_repository import UserRepository
from app.domain.repo_interface.profile_repository import ProfileRepository
from app.domain.entity.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self, users: UserRepository, profiles: ProfileRepository, businesses: "BusinessRepository", jwt_secret: str, jwt_exp_minutes: int = 60):
        self._users = users
        self._profiles = profiles
        self._businesses = businesses
        self._secret = jwt_secret
        self._exp = jwt_exp_minutes

    def _hash(self, pw: str) -> str:
        return pwd_context.hash(pw)

    def _verify(self, pw: str, hashed: str) -> bool:
        return pwd_context.verify(pw, hashed)

    def _token(self, user: User) -> str:
        payload = {
            "sub": str(user.id),
            "role": user.role,
            "email": user.email,
            "exp": datetime.utcnow() + timedelta(minutes=self._exp),
        }
        return jwt.encode(payload, self._secret, algorithm="HS256")

    async def register_athlete(self, data: RegisterAthleteDTO) -> tuple[str, str]:
        existing = await self._users.get_by_email(data.email)
        if existing:
            raise ValueError("Email already registered")

        role = "ATHLETE_VIP" if data.is_vip else "ATHLETE"
        user = await self._users.create(data.email, self._hash(data.password), role)
        await self._profiles.create_athlete_profile(user.id)
        return self._token(user), role

    async def register_business(self, data: RegisterBusinessDTO) -> tuple[str, str]:
        existing = await self._users.get_by_email(data.email)
        if existing:
            raise ValueError("Email already registered")

        user = await self._users.create(data.email, self._hash(data.password), "BUSINESS")
        await self._profiles.create_business_profile_pending(user.id)
        
        # Create the business profile immediately with the provided data
        await self._businesses.create(CreateBusinessDTO(
            owner_id=user.id,
            name=data.business.name,
            category=data.business.category,
            region=data.business.region,
            city=data.business.city,
            address=data.business.address,
            description=data.business.description,
            phone=data.business.phone,
            website=data.business.website,
            instagram=None # Register doesn't have instagram yet
        ))
        
        return self._token(user), "BUSINESS"

    async def register_admin(self, data: RegisterAdminDTO) -> tuple[str, str]:
        existing = await self._users.get_by_email(data.email)
        if existing:
            raise ValueError("Email already registered")

        user = await self._users.create(data.email, self._hash(data.password), "ADMIN")
        await self._profiles.create_admin_profile(user.id)
        return self._token(user), "ADMIN"

    async def login(self, data: LoginDTO, get_password_hash_by_email) -> tuple[str, str]:
        # get_password_hash_by_email lo implementamos en repo_impl por simplicidad,
        # o si prefieres, añádelo al UserRepository.
        user = await self._users.get_by_email(data.email)
        if not user:
            raise ValueError("Invalid credentials")

        hashed = await get_password_hash_by_email(data.email)
        if not self._verify(data.password, hashed):
            raise ValueError("Invalid credentials")

        if not user.is_active:
            raise ValueError("User is inactive")


        return self._token(user), user.role

    async def update_user(self, user_id: UUID, data: "UpdateUserDTO") -> User | None:
        email = data.email
        password_hash = self._hash(data.password) if data.password else None
        
        # If email is changing, check for duplicates
        if email:
            existing = await self._users.get_by_email(email)
            if existing and existing.id != user_id:
                raise ValueError("Email already in use")
        
        return await self._users.update(user_id, email, password_hash)
