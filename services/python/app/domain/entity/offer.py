from dataclasses import dataclass
from datetime import datetime, date
from uuid import UUID

@dataclass
class Offer:
    id: UUID
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
    image_url: str | None
    created_at: datetime
    updated_at: datetime

    # campo “comodidad dashboard” (opcional)
    business_name: str | None = None
