from dataclasses import dataclass

@dataclass(frozen=True)
class RegisterAthleteDTO:
    email: str
    password: str
    is_vip: bool = False

@dataclass(frozen=True)
class RegisterBusinessDTO:
    email: str
    password: str

@dataclass(frozen=True)
class RegisterAdminDTO:
    email: str
    password: str

@dataclass(frozen=True)
class LoginDTO:
    email: str
    password: str
