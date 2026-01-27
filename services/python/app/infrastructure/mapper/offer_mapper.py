from app.domain.entity.offer import Offer
from app.infrastructure.db.models import OfferModel

def model_to_entity(m: OfferModel, business_name: str | None = None) -> Offer:
    return Offer(
        id=m.id,
        business_id=m.business_id,
        title=m.title,
        description=m.description,
        discount_type=m.discount_type,
        discount_value=m.discount_value,
        start_date=m.start_date,
        end_date=m.end_date,
        is_active=m.is_active,
        terms=m.terms,
        vac_price=m.vac_price,
        stock_quantity=m.stock_quantity,
        created_at=m.created_at,
        updated_at=m.updated_at,
        business_name=business_name,
    )
