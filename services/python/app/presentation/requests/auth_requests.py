from pydantic import BaseModel, Field, EmailStr

class RegisterAthleteRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    is_vip: bool = False

class BusinessData(BaseModel):
    name: str
    category: str
    region: str
    city: str | None = None
    address: str | None = None
    phone: str | None = None
    website: str | None = None
    description: str | None = None

class RegisterBusinessRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    business: BusinessData

class RegisterAdminRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UpdateUserRequest(BaseModel):
    email: EmailStr | None = None
    password: str | None = Field(None, min_length=6)
