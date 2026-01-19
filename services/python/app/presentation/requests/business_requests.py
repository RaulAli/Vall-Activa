from pydantic import BaseModel, Field

class CreateBusinessRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    category: str = Field(min_length=1, max_length=100)
    region: str = Field(min_length=1, max_length=200)
    city: str | None = Field(default=None, max_length=200)
    phone: str | None = Field(default=None, max_length=50)
    website: str | None = Field(default=None, max_length=300)
    instagram: str | None = Field(default=None, max_length=100)

class UpdateBusinessRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    category: str | None = Field(default=None, min_length=1, max_length=100)
    region: str | None = Field(default=None, min_length=1, max_length=200)
    city: str | None = Field(default=None, max_length=200)
    phone: str | None = Field(default=None, max_length=50)
    website: str | None = Field(default=None, max_length=300)
    instagram: str | None = Field(default=None, max_length=100)
