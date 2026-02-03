from dataclasses import dataclass

@dataclass(frozen=True)
class RegisterAthleteDTO:
    email: str
    password: str
    is_vip: bool = False

@dataclass(frozen=True)
class BusinessDataDTO:
    name: str
    category: str
    region: str
    city: str | None = None
    address: str | None = None
    phone: str | None = None
    website: str | None = None
    description: str | None = None

@dataclass(frozen=True)
class RegisterBusinessDTO:
    email: str
    password: str
    business: BusinessDataDTO

@dataclass(frozen=True)
class RegisterAdminDTO:
    email: str
    password: str

@dataclass(frozen=True)
class LoginDTO:
    email: str
    password: str

@dataclass(frozen=True)
class UpdateUserDTO:
    email: str | None = None
    password: str | None = None
