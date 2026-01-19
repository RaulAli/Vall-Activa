from app.domain.entity.business import Business
from app.infrastructure.db.models import BusinessModel

def model_to_entity(m: BusinessModel) -> Business:
    return Business(
        id=m.id,
        name=m.name,
        description=m.description,
        category=m.category,
        region=m.region,
        city=m.city,
        phone=m.phone,
        website=m.website,
        instagram=m.instagram,
        created_at=m.created_at,
        updated_at=m.updated_at,
    )
