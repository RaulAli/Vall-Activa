from datetime import date
from uuid import UUID
from pydantic import BaseModel, Field

class CreateOfferRequest(BaseModel):
    business_id: UUID
    title: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    discount_type: str = Field(min_length=1, max_length=30)  # percent|fixed|other
    discount_value: str = Field(min_length=1, max_length=100)
    start_date: date
    end_date: date
    is_active: bool = True
    terms: str | None = Field(default=None, max_length=5000)
    vac_price: int = Field(default=0, ge=0) 
    stock_quantity: int = Field(default=0, ge=0)

class UpdateOfferRequest(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    discount_type: str | None = Field(default=None, min_length=1, max_length=30)
    discount_value: str | None = Field(default=None, min_length=1, max_length=100)
    start_date: date | None = None
    end_date: date | None = None
    is_active: bool | None = None
    terms: str | None = Field(default=None, max_length=5000)
    vac_price: int | None = Field(default=None, ge=0)
    stock_quantity: int | None = Field(default=None, ge=0)
