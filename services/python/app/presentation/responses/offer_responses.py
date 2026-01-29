from datetime import datetime, date
from uuid import UUID
from pydantic import BaseModel

class OfferResponse(BaseModel):
    id: UUID
    business_id: UUID
    business_name: str | None
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
    created_at: datetime
    updated_at: datetime
