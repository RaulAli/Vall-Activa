from dataclasses import dataclass
from datetime import date
from uuid import UUID

@dataclass(frozen=True)
class CreateOfferDTO:
    business_id: UUID
    title: str
    description: str | None
    discount_type: str
    discount_value: str
    start_date: date
    end_date: date
    is_active: bool
    terms: str | None
    vac_price: int
    stock_quantity: int
    image_url: str | None = None

@dataclass(frozen=True)
class UpdateOfferDTO:
    title: str | None = None
    description: str | None = None
    discount_type: str | None = None
    discount_value: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    is_active: bool | None = None
    terms: str | None = None
    vac_price: int | None = None
    stock_quantity: int | None = None
    image_url: str | None = None
