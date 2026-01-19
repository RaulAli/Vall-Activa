from pydantic import BaseModel, Field, EmailStr

class RegisterAthleteRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    is_vip: bool = False

class RegisterBusinessRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)

class RegisterAdminRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
